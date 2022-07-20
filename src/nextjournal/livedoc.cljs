(ns nextjournal.livedoc
  "A collection of CodeMirror extension for dealing with markdown notebooks, adding support for:
  * code block evaluation
  * per form evaluation inside clojure blocks
  * markdown blocks rendering
  * per-block edit mode"
  (:require ["@codemirror/language" :refer [foldGutter syntaxHighlighting defaultHighlightStyle LanguageSupport syntaxTree]]
            ["@codemirror/lang-markdown" :as MD :refer [markdown markdownLanguage]]
            ["@codemirror/state" :refer [EditorState StateField StateEffect Transaction Prec]]
            ["@codemirror/view" :as view :refer [EditorView ViewPlugin Decoration WidgetType keymap Tooltip showTooltip]]
            ["@lezer/markdown" :as lezer-markdown]
            [applied-science.js-interop :as j]
            [shadow.cljs.modern :refer [defclass]]
            [nextjournal.clojure-mode :as cm-clj]
            [nextjournal.clojure-mode.extensions.eval-region :as eval-region]
            [nextjournal.clojure-mode.node :as n]
            [reagent.dom :as rdom]))

(def markdown-language-support
  (markdown (j/obj :base markdownLanguage
                   :defaultCodeLanguage cm-clj/language-support)))

(defn ->cursor-pos [^js x] (.. x -selection -main -head))
(defn doc? [node] (= (.-Document lezer-markdown/parser.nodeTypes) (.. node -type -id)))
(defn fenced-code? [node] (= (.-FencedCode lezer-markdown/parser.nodeTypes) (.. node -type -id)))
(defn within? [pos {:keys [from to]}] (<= from pos to))

;; Config
(def default-config
  {:render
   {:markdown (fn [text] [:pre.md text])
    :code (fn [code] [:pre.code code])}})

(def config-state
  "Configurable entrypoint see also `extensions/1` fn below."
  (.define StateField
           (j/obj :create (constantly default-config)
                  :update (fn [cfg _] cfg))))

;; FXs
(defonce doc-apply-op (.define StateEffect))

(defn get-effect-value
  "Get first effect value matching type from a transaction"
  [^js tr effect-type]
  (some #(and (.is ^js % effect-type) (.-value ^js %)) (.-effects tr)))

;; Doc { :blocks [Block]
;;       :selected (Set | Int)
;;       :edit-all? Boolean
;;       :doc-changed? Boolean }
;;
;; Block { :from Int
;;         :to Int
;;         :type (:code | :markdown)
;;         :node? SyntaxNode
;;         :selected? }
;; Doc Ops
(defn pos->block-idx [blocks pos] (some (fn [[i b]] (when (within? pos b) i)) (map-indexed #(vector %1 %2) blocks)))

(defn edit-at [{:as doc :keys [blocks]} _tr pos]
  ;; we're currently allowing just one edit block at a time, this makes mapping of decorations much easier
  (-> doc
      (update :blocks (partial mapv #(dissoc % :edit?)))
      (assoc-in [:blocks (pos->block-idx blocks pos) :edit?] true)
      (dissoc :selected :edit-all?)))

(defn preview-all-and-select [doc _tr idx]
  (-> doc
      (update :blocks (partial mapv #(dissoc % :edit?)))
      (assoc :selected idx)
      (dissoc :edit-all? :doc-changed?)))

(defn edit-all [doc _tr]
  (-> doc (assoc :edit-all? true) (dissoc :selected :doc-changed?)))

;; Codemirror State to Blocks
(defn state->blocks
  "Partitions the document into ranges delimited by code blocks"
  ([state] (state->blocks state {:from 0}))
  ([state {:keys [from]}]
   (let [vblocks (volatile! [])]
     (.. (syntaxTree state)
         (iterate (j/obj :from from
                         :enter
                         (fn [node]
                           (if (doc? node)
                             true ;; only enter into children of the top level document
                             (do
                               (when (fenced-code? node)
                                 (vswap! vblocks (fn [blocks]
                                                   (let [{:keys [to]} (peek blocks)]
                                                     (cond-> blocks
                                                       (and (not (zero? (n/start node)))
                                                            (or (not to) (not= (inc to) (n/start node))))
                                                       (conj {:from (or to 0)
                                                              :to (n/start node)
                                                              :type :markdown})
                                                       'always
                                                       (conj
                                                        {:from (n/start node)
                                                         :to (n/end node)
                                                         :node (.-node node)
                                                         :type :code}))))))
                               false))))))
     (let [blocks @vblocks
           doc-end (.. state -doc -length)
           {:keys [to]} (peek blocks)]
       (cond-> blocks
         (not= doc-end to)
         (conj {:from to :to doc-end :type :markdown}))))))

;; Block Previews
(defn render-block-preview [^js widget ^js view]
  (let [el (js/document.createElement "div")
        [from to] ((juxt n/start n/end)
                   (or (when (.-node widget) (j/call-in widget [:node :getChild] "CodeText")) widget))
        code-text (.. view -state -doc (sliceString from to))
        {:as cfg :keys [render]} (.. view -state (field config-state))
        widget-type (.-type widget)]
    (rdom/render [:div.flex.flex-col.rounded.border.m-2.p-2.cursor-pointer
                  {:on-click (fn [e]
                               (.preventDefault e)
                               (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [(inc from)]})
                                                          :selection {:anchor (inc from)}}))))
                   :class [(when (= :code (.-type widget)) "bg-slate-100") (when (.-isSelected widget) "ring-4")]}
                  [:div.mt-3
                   [(widget-type render) code-text] ]] el)
    el))

(defclass BlockPreviewWidget
  (extends WidgetType)
  (constructor [this {:as opts :keys [from to type node selected?]}]
               (j/assoc! this
                         :from from :to to :type type :node node
                         :isSelected selected?
                         :ignoreEvent (constantly false)
                         :toDOM (partial render-block-preview this)
                         :eq (fn [^js other]
                               (and (identical? (.-from this) (.-from other))
                                    (identical? (.-to this) (.-to other))
                                    (identical? (.-isSelected this) (.-isSelected other))))))) ;; redraw on selection change

;; Document State Field
(def doc-state
  "Maintains a document description at block level"
  (.define StateField
           (j/obj :create (fn [cm-state] {:selected nil :blocks (state->blocks cm-state)})
                  :update (fn [{:as doc :keys [edit-all?]} ^js tr]
                            (let [{:as apply-op :keys [op args]} (get-effect-value tr doc-apply-op)]
                              (cond
                                apply-op (apply op doc tr args)
                                (.-docChanged tr)
                                (-> doc
                                    (assoc :doc-changed? true)
                                    ;; block state is rebuilt at each edit
                                    ;; we might consider mapping a codemirror range-set through tr changes instead
                                    (cond->
                                      (not edit-all?)
                                      (-> (assoc :blocks (state->blocks (.-state tr)))
                                          (edit-at tr (->cursor-pos tr)))))
                                'else doc))))))

(defn block->widget [{:as block :keys [from to]}]
  (.. Decoration
      (replace (j/obj :widget (BlockPreviewWidget. block) :block true))
      (range from to)))

(defn into-array* [xf coll] (reduce (xf j/push!) (array) coll))
#_(into-array* (comp (map inc) (remove odd?)) [1 2 3])

(defn doc->preview-decorations [{:keys [selected blocks edit-all?]}]
  (if edit-all?
    (.-none Decoration)
    (.set Decoration
          (into-array* (comp (remove :edit?) (map block->widget))
                       (cond-> blocks
                         selected (assoc-in [selected :selected?] true))))))

;; Decoration State Field
(def block-decorations
  "Decorations Facet derived from current Doc state"
  (.. EditorView -decorations (from doc-state doc->preview-decorations)))

;; Tooltips State Field
;; depends on `nextjournal.clojure-mode.extensions.eval-region`
(defn eval-region-text [^js state]
  (let [er (.field state eval-region/region-field)]
    (when (< 0 (.-size er))
      (let [i (.. er iter) from (.-from i) to (.-to i)]
        {:to to :text (.. state -doc (sliceString from to))}))))

(defn eval-region-text->tooltip [{:as ers :keys [to text]}]
  (when (seq ers)
    (j/obj :pos to
           :above false
           :strictSide true
           :arrow true
           :create (fn [_]
                     (let [tt-el (js/document.createElement "div")]
                       (rdom/render [:div.p-3 "Ahoi " #_ [eval-code-view text]] tt-el)
                       (j/obj :dom tt-el))))))

(def tooltip-theme
  (.theme EditorView
          (j/lit {".cm-tooltip"
                  {:background-color "#e2e8f0"
                   :border "1px solid #cbd5e1"}})))

(def eval-region-tooltip
  ;; TODO
  "Takes opts returns a Codemirror extension which works in conjunction with `nextjournal.clojure-mode.extensions.eval-region`.

  Options take keys:
  * `:tooltip-view` of type TooltipView (https://codemirror.net/docs/ref/#view.TooltipView)"
  (.define StateField
           (j/obj :create  (constantly nil)
                  :update  (fn [_ ^js tr] (eval-region-text (.-state tr)))
                  :provide (fn [f] (.from showTooltip f eval-region-text->tooltip)))))

(defn bounded-inc [i b] (min (dec b) (inc i)))
(defn bounded-dec [i] (max 0 (dec i)))

;; Keyborad event handling
(defn get-next-block [^js view blocks key]
  (let [pos (->cursor-pos (.-state view))
        index (pos->block-idx blocks pos)
        next-index (case key
                     (:up :left) (bounded-dec index)
                     (:down :right) (bounded-inc index (count blocks)))]
    (when (not= next-index index)
      (let [line (.. view -state -doc (lineAt pos))
            next-block (get blocks next-index)]
        ;; blocks span entire lines we can argue by an offset of at most the current line + 1
        (case key
          (:down :right)
          (let [offset (when (= :down key) (- (.-to line) pos))
                new-pos (cond-> (inc pos) offset (+ offset))
                end (.. view -state -doc -length)]
            (when (or (<= (:from next-block) new-pos)
                      (and (= :down key)
                           ;; we'd reach end of doc by jumping across decorations
                           (= end (.. view (moveVertically (.. view -state -selection -main) true) -anchor))))
              next-block))

          (:up :left)
          (let [offset (when (= :up key) (- pos (.-from line)))
                new-pos (cond-> (dec pos) offset (- offset))]
            (when (or (< new-pos (:to next-block))
                      (and (= :up key)
                           ;; we'd reach start of doc by jumping across decorations
                           (= 0 (.. view (moveVertically (.. view -state -selection -main) false) -anchor))))
              next-block)))))))

(defn handle-keydown [^js e ^js view]
  (when-some [key (case (.-which e) 40 :down 38 :up 27 :esc 39 :right 37 :left nil)]
    (let [{:keys [doc-changed? edit-all? selected blocks]} (.. view -state (field doc-state))]
      (cond
        ;; toggle edit mode (Selected <-> EditOne -> EditAll -> Selected)
        (= :esc key)
        (cond
          selected
          (let [at (inc (:from (get blocks selected)))]
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [at]})
                                       :selection {:anchor at}})))
            true)

          (or doc-changed? edit-all?)
          (let [idx (pos->block-idx blocks (->cursor-pos (.-state view)))]
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op preview-all-and-select :args [idx]})
                                       :selection {:anchor (->cursor-pos (.-state view))}})))
            true)

          'edit-one
          (do (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-all})})))
              true))

        ;; move up/down selection
        (and selected (or (= :up key) (= :down key)))
        (let [at (case key :up (bounded-dec selected) :down (bounded-inc selected (count blocks)))]
          (.. view (dispatch (j/lit {:selection {:anchor (inc (:from (get blocks at)))}
                                     :effects (.of doc-apply-op {:op preview-all-and-select :args [at]})})))
          false)

        ;; check we're entering a preview from an edit region
        ;; (not selected) implies we're in edit
        (and (not selected) (not edit-all?) (not (.. view -state (field eval-region-tooltip)))
             (or (= :up key) (= :down key) (= :left key) (= :right key)))
        (when-some [next-block (get-next-block view blocks key)]
          (let [at (if (#{:up :left} key) (dec (:to next-block)) (inc (:from next-block)))]
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [at]})
                                       :selection {:anchor at}})))
            true))

        'else false))))

(def default-extensions
  "An extension turning a Markdown document in a blockwise preview-able editor"
  [doc-state
   block-decorations
   eval-region-tooltip tooltip-theme
   (.highest Prec (.domEventHandlers EditorView (j/obj :keydown handle-keydown)))])

(defn extensions
  "Accepts an options map with keys:
   * `:render`
      A map with keys `:markdown` `:code`
   * `:tooltip`
      A
  "
  ([] (cons config-state default-extensions))
  ([opts] (cons (.init config-state (fn [_] opts)) default-extensions)))

(defn editor
  "A convenience function/component bundling a basic setup with
  * markdown+clojure language support
  * configurable rendering options
  * configurable tooltips"
  [doc opts])
