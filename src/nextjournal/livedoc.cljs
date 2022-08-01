(ns nextjournal.livedoc
  "A collection of CodeMirror extension for dealing with markdown notebooks, adding support for:
  * code block evaluation
  * per form evaluation inside clojure blocks
  * markdown blocks rendering
  * per-block edit mode"
  (:require ["@codemirror/language" :refer [syntaxHighlighting defaultHighlightStyle syntaxTree ensureSyntaxTree Language LanguageSupport indentNodeProp]]
            ["@codemirror/lang-markdown" :as MD :refer [markdown markdownLanguage]]
            ["@codemirror/state" :refer [EditorState StateField StateEffect Prec]]
            ["@codemirror/view" :as view :refer [EditorView Decoration WidgetType keymap showTooltip]]
            ["@lezer/markdown" :as lezer-markdown]
            [applied-science.js-interop :as j]
            [clojure.string :as str]
            [shadow.cljs.modern :refer [defclass]]
            [nextjournal.clojure-mode :as cm-clj]
            [nextjournal.clojure-mode.extensions.eval-region :as eval-region]
            [nextjournal.clojure-mode.node :as n]
            [reagent.core :as r]
            [reagent.dom :as rdom]))

(declare state->blocks block-opts->decoration get-blocks)

;; Helpers
(defn doc? [^js node] (== (.-Document lezer-markdown/parser.nodeTypes) (.. node -type -id)))
(defn fenced-code? [^js node] (== (.-FencedCode lezer-markdown/parser.nodeTypes) (.. node -type -id)))
(defn within? [pos {:keys [from to]}] (and (<= from pos) (< pos to)))
(defn ->cursor-pos [^js x] (.. x -selection -main -anchor))

(defn rangeset-seq
  "Returns a lazy-seq of ranges inside a RangeSet (like a Decoration set)"
  ([rset] (rangeset-seq rset 0))
  ([^js rset from]
   (let [iterator (.iter rset from)]
     ((fn step []
        (when-some [val (.-value iterator)]
          (let [from (.-from iterator) to (.-to iterator)]
            (.next iterator)
            (cons {:from from :to to :val val}
                  (lazy-seq (step))))))))))

(defn when-fn [p] (fn [x] (when (p x) x)))
(defn block-at [blocks pos] (some (when-fn (partial within? pos)) (rangeset-seq blocks)))
(defn get-block-by-id [state id]
  (some (when-fn #(identical? id (-> % :val .-widget .-id))) (get-blocks state)))
(defn pos->block-idx [blocks pos]
  ;; blocks partition the whole document, the only missing point is the end of the document
  (some (fn [[i b]] (when (within? pos b) i)) (map-indexed #(vector %1 %2) blocks)))
(defn block-eq? [{:keys [^js val]} {^js other :val}] (.. val -widget (eq (.. other -widget))))
(defn ->widget [{:keys [^js val]}] (.-widget val))
(defn update-block [{:keys [from to val]} f]
  (block-opts->decoration (assoc (f (.. val -widget -spec)) :from from :to to)))

;; Config
(def default-config
  {:render
   {:markdown (fn [text] [:pre.md text])
    :code (fn [code] [:pre.code code])}})

(defonce ^{:doc "Configurable entrypoint see also `extensions/1` fn below."}
  config-state
  (.define StateField
           (j/obj :create (constantly default-config)
                  :update (fn [cfg _] cfg))))

;; FXs
(defonce doc-apply-op (.define StateEffect))
(defn get-effect-value
  "Get first effect value matching type from a transaction"
  [^js tr effect-type]
  (some #(and (.is ^js % effect-type) (.-value ^js %)) (.-effects tr)))

;; Doc Operations
;;
;; Doc { :blocks [Decoration]
;;       :selected (Set | Int)
;;       :edit-all? Boolean
;;       :doc-changed? Boolean }

(defn edit-at [{:as doc :keys [selected blocks edit-from]} ^js tr pos]
  ;; we patch the existing decoration with blocks arising from last editable region
  (let [current-block (block-at blocks pos)
        edit-to (when edit-from
                  (or (:from (some (when-fn #(< edit-from (:from %)))
                                   (rangeset-seq blocks edit-from)))
                      (.. tr -state -doc -length)))
        ^js gap-blocks (when edit-to
                         (state->blocks (.-state tr) {:from edit-from
                                                      :to edit-to}))
        ^js selected-block (when selected (nth (rangeset-seq blocks) selected))]
    (cond-> doc
      current-block
      (-> (dissoc :selected :edit-all?)
          (assoc :edit-from (:from current-block))
          (update :blocks
                  (fn [bs]
                    (.update ^js bs
                             (cond-> (j/obj :filter
                                            (j/fn [_from _to ^:js {:keys [widget]}]
                                              (not (or (.eq widget (->widget current-block))
                                                       (when selected-block (.eq widget (->widget selected-block)))))))
                               ;; either add gap (click after click)
                               gap-blocks
                               (j/assoc! :add gap-blocks)
                               ;; or remove selection (click while some block is selected)
                               (and selected-block (not (block-eq? selected-block current-block)))
                               (j/assoc! :add (array (update-block selected-block #(assoc % :selected? false))))))))))))

(defn preview-all-and-select [doc tr]
  ;; rebuild all decorations to get new selection right (investigate filter/add)
  (let [blocks (.set Decoration (state->blocks (.-state tr)))]
    (-> doc
        (assoc :blocks  blocks)
        (assoc :selected (pos->block-idx (rangeset-seq blocks) (->cursor-pos (.-state tr))))
        (dissoc :edit-all? :doc-changed? :edit-from))))

(defn edit-all [doc _tr]
  (-> doc
      (dissoc :selected :doc-changed? :edit-from)
      (assoc :edit-all? true
             :blocks (.-none Decoration))))

(defn update-eval-signal [doc _tr id]
  (update doc :eval-signal (fn [s] (swap! s update id (fnil inc 0)) s)))

;; Doc State Field
(defonce ^{:doc "Maintains a document description at block level"}
  doc-state
  (.define StateField
           (j/obj
            :provide (fn [field] (.. EditorView -decorations (from field #(get % :blocks))))
            :create (fn [cm-state]
                      {:selected nil
                       :blocks (.set Decoration (state->blocks cm-state {:select? false}))
                       :eval-signal (r/atom {})})
            :update (fn [{:as doc :keys [edit-all?]} ^js tr]
                      (let [{:as apply-op :keys [op args]} (get-effect-value tr doc-apply-op)]
                        (cond
                          apply-op (apply op doc tr args)
                          (.-docChanged tr)
                          (-> doc
                              (assoc :doc-changed? true)
                              (cond->
                                (not edit-all?)
                                (update :blocks #(.map ^js % (.-changes tr)))))

                          'else doc))))))

(defn get-blocks [state] (-> state (.field doc-state) :blocks rangeset-seq))
(defn get-eval-signal [state] (-> state (.field doc-state) :eval-signal))

;; Block Previews
(defn render-block-preview [^js widget ^js view]
  (let [el (js/document.createElement "div")
        {:as spec :keys [text type selected?]} (.-spec widget)
        {:keys [render]} (.. view -state (field config-state))]
    (rdom/render [:div.flex.flex-col.rounded.border.m-2.p-2.cursor-pointer
                  {:class [(when (= :code type) "bg-slate-100") (when selected? "ring-4")]
                   :on-click (fn [_e]
                               ;; since decorations might have been mapped since widget creation we cannot argue by range from/to
                               (when-some [{:keys [from]} (get-block-by-id (.-state view) (.-id widget))]
                                 (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [from]})
                                                            :selection {:anchor from}
                                                            :scrollIntoView true})))))}
                  [:div.mt-3
                   [(type render) (assoc spec :eval-signal (get-eval-signal (.-state view)))]]] el)
    el))

(defclass BlockPreviewWidget
  (extends WidgetType)
  (constructor [this spec]
               (j/assoc! this
                         :id (random-uuid)
                         :spec spec
                         :ignoreEvent (constantly false)
                         :toDOM (partial render-block-preview this)
                         :eq (fn [^js other] (identical? (.-id this) (.-id other))))))

(defn block-opts->decoration
  [{:as opts :keys [from to]}]
  (assert (< from to) (str "Bad range: " opts))
  (.. Decoration
      (replace (j/obj :block true
                      :widget (BlockPreviewWidget. (select-keys opts [:text :type :selected?]))))
      (range from to)))

;; Codemirror State Syntax Tree to Blocks
(defn node-info->decoration [^js state {:as opts :keys [from to ^js node type select?]}]
  (block-opts->decoration
   (-> opts
       (assoc :text (cond
                      (= :markdown type)
                      (.. state -doc (sliceString from to))
                      (= :code type)
                      (if-some [^js code-text (.getChild node "CodeText")]
                        ;; if fenced block code is not empty, then it has a CodeText child node
                        (.. state -doc (sliceString (.-from code-text) (.-to code-text)))
                        "")))
       (cond->
         (and select? (within? (->cursor-pos state) opts))
         (assoc :selected? true)))))

(defn state->blocks
  "Partitions the document into ranges delimited by code blocks"
  ([state] (state->blocks state {:select? true}))
  ([state {:keys [from to select?] :or {from 0 to (.. state -doc -length)}}]
   (let [^js blocks (array)]
     ;; TODO: parse only the visible part in viewport / call again when viewport changs
     ;; or delay the state-field until syntax parsing has reached the end
     ;; see also https://codemirror.net/docs/ref/#language.forceParsing (in a high-prec plugin with EditorView access)
     ;; `ensureSyntaxTree` forces parsing of the whole document within 1sec and returns nil otherwise
     ;; `syntaxTree` returns the available tree constructed at the time of call
     (.. (or (ensureSyntaxTree state to 1000)
             (syntaxTree state))
         (iterate (j/obj :from from :to to
                         :enter
                         (fn [^js node]
                           (if (doc? node)
                             true ;; only enter into children of the top level document
                             (do
                               (when (fenced-code? node)
                                 (let [last-to (some-> blocks (.at -1) .-to)
                                       block-from (or last-to from)]
                                   (cond-> blocks
                                     (and (not= from (n/start node))
                                          (< block-from (n/start node))
                                          (or (not last-to)
                                              (not= (inc last-to) (n/start node)))) ;; contiguous fenced blocks
                                     (j/push! (node-info->decoration state
                                                                     {:from block-from
                                                                      :to (n/start node)
                                                                      :type :markdown
                                                                      :select? select?}))
                                     (and (<= from (n/start node)) (<= (n/end node) to))
                                     (j/push! (node-info->decoration state
                                                                     {:from (n/start node)
                                                                      :to (inc (n/end node))
                                                                      ;; ⬆ note this assumes no trailing whitespace after closing ```
                                                                      :node (.-node node)
                                                                      :type :code
                                                                      :select? select?})))))
                               false))))))
     (let [last-to (some-> blocks (.at -1) .-to)]
       (cond-> blocks
         (not= to last-to)
         (j/push! (node-info->decoration state
                                         {:from (or last-to from)
                                          :to to
                                          :type :markdown
                                          :select? select?})))))))

(comment
  (let [state
        (nextjournal.clojure-mode.test-utils/make-state
         (into-array (cons markdown-language-support (extensions)))
         "start\n```\ncode-1\n```\n```\ncode-2\n```\n|end.")
        pos (.. state -selection -main -anchor)]
    (.. state -doc (sliceString 6 21))
    (-> state
        (state->blocks {:from 6 :to pos})
        seq (->> (map (juxt (j/get :from) (j/get :to) (comp :type (j/get :spec) (j/get :widget) (j/get :value)))))
        str
        )))

;; Tooltips State Field
;; depends on `nextjournal.clojure-mode.extensions.eval-region`
(defn eval-region-text [^js state]
  (let [er (.field state eval-region/region-field)]
    (when (< 0 (.-size er))
      (let [i (.. er iter) from (.-from i) to (.-to i)]
        {:to to :text (.. state -doc (sliceString from to))}))))

(defn eval-region-text->tooltip [create-fn {:as ers :keys [to text]}]
  (when (seq ers)
    (j/obj :pos to
           :above false
           :strictSide true
           :arrow true
           :create (partial create-fn text))))

(def tooltip-theme
  (.theme EditorView
          (j/lit {".cm-tooltip"
                  {:background-color "#e2e8f0"
                   :border "1px solid #cbd5e1"}})))

(def eval-region-tooltip
  (.define StateField
           (j/obj :create  (constantly nil)
                  :update  (fn [_ ^js tr] (eval-region-text (.-state tr)))
                  :provide (fn [f] (.compute showTooltip
                                             (array f config-state)
                                             (fn [state]
                                               (when-some [tooltip-create-fn (:tooltip (.field state config-state))]
                                                 (eval-region-text->tooltip tooltip-create-fn (.field state f)))))))))

;; Keyborad Event handling
(defn bounded-inc [i b] (min (dec b) (inc i)))
(defn bounded-dec [i] (max 0 (dec i)))

(defn edit-adjacent-block-at [^js view blocks key]
  (let [pos (->cursor-pos (.-state view))]
    ;; get the first adjacent block we meet wrt the current movement direction
    (when-some [next-block (case key
                             (:up :left) (some (when-fn #(<= (:to %) pos)) (reverse blocks))
                             (:down :right) (some (when-fn #(<= pos (:from %))) blocks))]
      (let [line (.. view -state -doc (lineAt pos))]
        ;; blocks span entire lines we can argue by an offset of at most the current line + 1
        (case key
          (:down :right)
          (let [offset (when (= :down key) (- (.-to line) pos))
                new-pos (cond-> (inc pos) offset (+ offset))
                end (.. view -state -doc -length)]
            (when (or (< (:from next-block) new-pos)
                      (and (= :down key)
                           ;; we'd reach end of doc by jumping across decorations
                           (= end (.. view (moveVertically (.. view -state -selection -main) true) -anchor))))
              (.. view -state -doc (lineAt new-pos) -from)))

          (:up :left)
          (let [offset (when (= :up key) (- pos (.-from line)))
                new-pos (cond-> (dec pos) offset (- offset))]
            (when (or (<= new-pos (:to next-block))
                      (and (= :up key)
                           ;; we'd reach start of doc by jumping across decorations
                           (= 0 (.. view (moveVertically (.. view -state -selection -main) false) -anchor))))
              (.. view -state -doc (lineAt new-pos) -from))))))))

(defn handle-keydown [^js e ^js view]
  (when-some [key (case (.-which e)
                    13 (when (.-metaKey e) :eval)
                    40 :down 38 :up 27 :esc 39 :right 37 :left nil)]
    (let [{:keys [doc-changed? edit-all? edit-from selected blocks]} (.. view -state (field doc-state))
          block-seq (rangeset-seq blocks)]
      (cond
        (= :eval key)
        (when-not edit-from
          (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op update-eval-signal
                                                                 :args [(when selected
                                                                          (-> (nth block-seq selected)
                                                                              :val .-widget .-id))]})})))
          true)

        ;; toggle edit mode (Selected <-> EditOne -> EditAll -> Selected)
        (= :esc key)
        (cond
          selected
          (let [at (:from (nth block-seq selected))]
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [at]})
                                       :selection {:anchor at}
                                       :scrollIntoView true})))
            true)

          (or doc-changed? edit-all?)
          (do
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op preview-all-and-select})})))
            true)

          'edit-one
          (do (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-all})})))
              true))

        ;; move up/down selection
        (and (#{:up :down} key) selected)
        (let [next-idx (case key :up (bounded-dec selected) :down (bounded-inc selected (count block-seq)))]
          (.. view (dispatch (j/lit {:selection {:anchor (:from (nth block-seq next-idx))}
                                     :effects (.of doc-apply-op {:op preview-all-and-select})
                                     :scrollIntoView true})))
          true)

        ;; check we're entering a preview from an edit region
        ;; (not selected) implies we're in edit. Also check we're not expanding/shrinking a paredit region
        (and (not= :esc key) (not selected) (not edit-all?)
             (not (.. view -state (field eval-region-tooltip))))
        (when-some [at (edit-adjacent-block-at view block-seq key)]
          (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [at]})
                                     :selection {:anchor at}
                                     :scrollIntoView true})))
          true)

        'else false))))

(def default-extensions
  "An extension turning a Markdown document in a blockwise preview-able editor"
  [(.low Prec doc-state)
   (.highest Prec (.domEventHandlers EditorView (j/obj :keydown handle-keydown)))
   eval-region-tooltip
   tooltip-theme])

(defn extensions
  "Accepts an `opts` map with optional keys:
   * `:render` A map with keys `:markdown` and `:code` providing render functions (String -> HTMLElement)
      for each block type.

   * `:tooltip` (String -> EditorView -> TooltipView) as per https://codemirror.net/docs/ref/#view.TooltipView
      when present, enables a Codemirror tooltips.
      Receives text spanned by the current region as per `nextjournal.clojure-mode.extensions.eval-region`, positions
      a tooltip at the end of the region.

   Returns a default set of codemirror extensions.
   "
  ([] (extensions {}))
  ([opts]
   (cons (cond-> config-state (seq opts) (.init (constantly opts)))
         default-extensions)))

;; Markdown Language Support

(defn handle-open-backticks [^js view]
  (let [state (.-state view)]
    (when (doc? (.-tree state))
      (let [sel (.. state -selection -main)]
        (when (and (.-empty sel)
                   (identical? "``" (.. state -doc (lineAt (.-anchor sel)) -text)))
          (.dispatch view
                     (.update state (j/lit {:changes [{:insert "\n```"
                                                       :from (.-anchor sel)}]}))))))))
(def ^js markdown-language-support
  (let [^js md
        (markdown (j/obj :defaultCodeLanguage cm-clj/language-support
                         :base (Language.
                                (.-data markdownLanguage)
                                (.. markdownLanguage
                                    -parser (configure
                                             ;; fixes indentation base for clojure inside fenced code blocks ⬇
                                             (j/lit {:props [(.add indentNodeProp
                                                                   (j/obj :Document (constantly 0)))]}))))))]
    (LanguageSupport.
     (.-language md)
     (array (.-support md)
            (.high Prec (.of keymap (j/lit [{:key \` :run handle-open-backticks}])))))))

;; Editor
(defn editor
  "A convenience function/component bundling a basic setup with

  * markdown + clojure-mode language support and their syntax highlighting
  * clojure mode keybindings
  * livedoc extensions configurable via `opts`"
  [{:as opts extras :extensions :keys [doc]}]
  [:div {:ref (fn [^js el]
                (if-not el
                  (some-> el .-editorView .destroy)
                  (j/assoc! el :editorView
                            (EditorView. (j/obj :parent el
                                                :state (.create EditorState
                                                                (j/obj :doc (str/trim doc)
                                                                       :extensions (into-array
                                                                                    (-> (extensions (select-keys opts [:render :tooltip]))
                                                                                        (concat [(syntaxHighlighting defaultHighlightStyle)
                                                                                                 (.of keymap cm-clj/complete-keymap)
                                                                                                 markdown-language-support])
                                                                                        (cond->
                                                                                          (seq extras)
                                                                                          (concat extras)))))))))))}])
