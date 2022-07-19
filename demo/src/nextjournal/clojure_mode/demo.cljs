(ns nextjournal.clojure-mode.demo
  (:require ["@codemirror/language" :refer [foldGutter syntaxHighlighting defaultHighlightStyle LanguageSupport syntaxTree]]
            ["@codemirror/lang-markdown" :as MD :refer [markdown markdownLanguage]]
            ["@codemirror/commands" :refer [history historyKeymap]]
            ["@codemirror/state" :refer [EditorState StateField StateEffect Transaction Prec]]
            ["@codemirror/view" :as view :refer [EditorView ViewPlugin Decoration WidgetType keymap Tooltip showTooltip]]
            ["@lezer/markdown" :as lezer-markdown]
            [nextjournal.clerk.sci-viewer :as sv]
            [nextjournal.clerk.viewer :as v]
            [applied-science.js-interop :as j]
            [shadow.cljs.modern :refer (defclass)]
            [shadow.resource :as rc]
            [clojure.string :as str]
            [nextjournal.clojure-mode :as cm-clj]
            [nextjournal.clojure-mode.demo.sci :as sci]
            [nextjournal.clojure-mode.extensions.eval-region :as eval-region]
            [nextjournal.clojure-mode.node :as n]
            [nextjournal.clojure-mode.keymap :as keymap]
            [nextjournal.clojure-mode.live-grammar :as live-grammar]
            [nextjournal.clojure-mode.test-utils :as test-utils]
            ["react" :as react]
            [reagent.core :as r]
            [reagent.dom :as rdom]))

(def theme
  (.theme EditorView
          (j/lit {".cm-content" {:white-space "pre-wrap"
                                 :padding "10px 0"}
                  "&.cm-focused" {:outline "none"}
                  ".cm-line" {:padding "0 9px"
                              :line-height "1.6"
                              :font-size "16px"
                              :font-family "var(--code-font)"}
                  ".cm-matchingBracket" {:border-bottom "1px solid var(--teal-color)"
                                         :color "inherit"}
                  ".cm-gutters" {:background "transparent"
                                 :border "none"}
                  ".cm-gutterElement" {:margin-left "5px"}
                  ;; only show cursor when focused
                  ".cm-cursor" {:visibility "hidden"}
                  "&.cm-focused .cm-cursor" {:visibility "visible"}})))

(defonce extensions #js[theme
                        (history)
                        (syntaxHighlighting defaultHighlightStyle)
                        (view/drawSelection)
                        (foldGutter)
                        (.. EditorState -allowMultipleSelections (of true))
                        (if false
                          ;; use live-reloading grammar
                          #js[(cm-clj/syntax live-grammar/parser)
                              (.slice cm-clj/default-extensions 1)]
                          cm-clj/default-extensions)
                        (.of view/keymap cm-clj/complete-keymap)
                        (.of view/keymap historyKeymap)])


(defn editor [source {:keys [eval?]}]
  (r/with-let [!view (r/atom nil)
               last-result (when eval? (r/atom (sci/eval-string source)))
               mount! (fn [el]
                        (when el
                          (reset! !view (new EditorView
                                             (j/obj :state
                                                    (test-utils/make-state
                                                     (cond-> #js [extensions]
                                                       eval? (.concat #js [(sci/extension {:modifier "Alt"
                                                                                           :on-result (partial reset! last-result)})]))
                                                     source)
                                                    :parent el)))))]
    [:div
     [:div {:class "rounded-md mb-0 text-sm monospace overflow-auto relative border shadow-lg bg-white"
            :ref mount!
            :style {:max-height 410}}]
     (when eval?
       [:div.mt-3.mv-4.pl-6 {:style {:white-space "pre-wrap" :font-family "var(--code-font)"}}
        (when-some [{:keys [error result]} @last-result]
          (cond
            error [:div.red error]
            (react/isValidElement result) result
            'else (sv/inspect-paginated result)))])]
    (finally
     (j/call @!view :destroy))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;  Markdown editor

(defn ->cursor-pos [^js x] (.. x -selection -main -head))
(defn doc? [node] (= (.-Document lezer-markdown/parser.nodeTypes) (.. node -type -id)))
(defn fenced-code? [node] (= (.-FencedCode lezer-markdown/parser.nodeTypes) (.. node -type -id)))
(defn within? [pos {:keys [from to]}] (<= from pos to))

;; FXs
(defonce doc-apply-op (.define StateEffect))

(defn get-effect-value
  "Get first effect value matching type from a transaction"
  [^js tr effect-type]
  (some #(and (.is ^js % effect-type) (.-value ^js %)) (.-effects tr)))

;; Doc
;; { :selected :: Set | Int , :blocks [Map] }

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
      (dissoc :edit-all?)))

(defn edit-all [doc _tr]
  (-> doc (assoc :edit-all? true) (dissoc :selected)))

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

;; Previews
(defn eval-code-view [code]
  [:div.viewer-result {:style {:white-space "pre-wrap" :font-family "var(--code-font)"}}
   (when-some [{:keys [error result]} (sci/eval-string code)]
     (cond
       error [:div.red error]
       (react/isValidElement result) result
       'else (sv/inspect-paginated result)))])

(defn render-markdown [^js widget ^js view]
  (let [el (js/document.createElement "div")
        [from to] ((juxt n/start n/end)
                   (or (when (.-node widget) (j/call-in widget [:node :getChild] "CodeText")) widget))
        code-text (.. view -state -doc (sliceString from to))]
    (rdom/render [:div.flex.flex-col.rounded.border.m-2.p-2.cursor-pointer
                  {:on-click (fn [e]
                               (.preventDefault e)
                               (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [(inc from)]})
                                                          :selection {:anchor (inc from)}}))))
                   :class [(when (= :code (.-type widget)) "bg-slate-100") (when (.-isSelected widget) "ring-4")]}
                  [:div.mt-3
                   [:div.viewer-markdown
                    [sv/inspect-paginated (v/with-viewer (.-type widget) code-text)]]
                   (when (= :code (.-type widget))
                     [:<>
                      [:hr.border]
                      [:div.mt-3.ml-3
                       [eval-code-view code-text]]])]] el)
    el))

(defclass Widget
  (extends WidgetType)
  (constructor [this {:as opts :keys [from to type node selected?]}]
    (j/assoc! this
              :from from :to to :type type :node node
              :isSelected selected?
              :ignoreEvent (constantly false)
              :toDOM (partial render-markdown this)
              :eq (fn [^js other]
                    (and (identical? (.-from this) (.-from other))
                         (identical? (.-to this) (.-to other))
                         (identical? (.-isSelected this) (.-isSelected other))))))) ;; redraw on selection change

;; Document State Field
(def doc-state
  "Maintains a document description at block level"
  (.define StateField
           (j/obj :create (fn [cm-state] {:selected nil :blocks (state->blocks cm-state)})
                  :update (fn [doc ^js tr]
                            (let [{:as apply-op :keys [op args]} (get-effect-value tr doc-apply-op)]
                              (cond
                                apply-op (apply op doc tr args)
                                (.-docChanged tr)
                                (-> doc
                                    (assoc :blocks (state->blocks (.-state tr)))
                                    (edit-at tr (->cursor-pos tr)))
                                'else doc))))))

(defn block->widget [{:as block :keys [from to]}]
  (.. Decoration
      (replace (j/obj :widget (Widget. block) :block true))
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
                       (rdom/render [:div.p-3 [eval-code-view text]] tt-el)
                       (j/obj :dom tt-el))))))

(def tooltip-theme
  (.theme EditorView
          (j/lit {".cm-tooltip"
                  {:background-color "#e2e8f0"
                   :border "1px solid #cbd5e1"}})))

(def eval-region-tooltip
  (.define StateField
           (j/obj :create (constantly nil)
                  :update (fn [_ ^js tr] (eval-region-text (.-state tr)))
                  :provide (fn [f] (.from showTooltip f eval-region-text->tooltip)))))

(defn bounded-inc [i b] (min (dec b) (inc i)))
(defn bounded-dec [i] (max 0 (dec i)))

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
    (let [{:keys [edit-all? selected blocks]} (.. view -state (field doc-state))]
      (cond
        ;; toggle edit mode (Selected -> EditOne -> EditAll)
        (= :esc key)
        (cond
          selected
          (let [at (inc (:from (get blocks selected)))]
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-at :args [at]})
                                       :selection {:anchor at}})))
            true)

          edit-all?
          (let [idx (pos->block-idx blocks (->cursor-pos (.-state view)))]
            (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op preview-all-and-select :args [idx]})
                                       :selection {:anchor (->cursor-pos (.-state view))}})))
            true)

          'else
          (do (.. view (dispatch (j/lit {:effects (.of doc-apply-op {:op edit-all})})))
              true))

        ;; move up/down selection
        (and selected (or (= :up key) (= :down key)))
        (let [at (case key :up (bounded-dec selected) :down (bounded-inc selected (count blocks)))]
          (js/console.log :anchor (inc (:from (get blocks at))))
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

(def markdown-preview
  "An extension turning a Markdown document in a blockwise preview-able editor"
  (j/lit [doc-state
          block-decorations
          eval-region-tooltip tooltip-theme
          (.highest Prec (.domEventHandlers EditorView (j/obj :keydown handle-keydown)))]))

;; syntax (an LRParser) + support (a set of extensions)
(def clojure-lang (LanguageSupport. (cm-clj/syntax)
                                    (.. cm-clj/default-extensions (slice 1))))

(defn markdown-editor [{:keys [doc editable? extensions] :or {editable? true}}]
  [:div {:ref (fn [^js el]
                (if-not el
                  (some-> el .-editorView .destroy)
                  (j/assoc! el :editorView
                            (EditorView. (j/obj :parent el
                                                :state (.create EditorState
                                                                (j/obj :doc (str/trim doc)
                                                                       :extensions (into-array
                                                                                    (cond-> [(syntaxHighlighting defaultHighlightStyle)
                                                                                             (foldGutter)
                                                                                             (.. EditorView -editable (of editable?))
                                                                                             (.of view/keymap cm-clj/complete-keymap)
                                                                                             theme
                                                                                             (markdown (j/obj :base markdownLanguage
                                                                                                              :defaultCodeLanguage clojure-lang))]
                                                                                      (seq extensions)
                                                                                      (concat extensions))))))))))}])

(defn samples []
  (into [:<>]
        (for [source ["(comment
  (fizz-buzz 1)
  (fizz-buzz 3)
  (fizz-buzz 5)
  (fizz-buzz 15)
  (fizz-buzz 17)
  (fizz-buzz 42))

(defn fizz-buzz [n]
  (condp (fn [a b] (zero? (mod b a))) n
    15 \"fizzbuzz\"
    3  \"fizz\"
    5  \"buzz\"
    n))"]]
          [editor source {:eval? true}])))

(defn linux? []
  (some? (re-find #"(Linux)|(X11)" js/navigator.userAgent)))

(defn mac? []
  (and (not (linux?))
       (some? (re-find #"(Mac)|(iPhone)|(iPad)|(iPod)" js/navigator.platform))))

(defn key-mapping []
  (cond-> {"ArrowUp" "↑"
           "ArrowDown" "↓"
           "ArrowRight" "→"
           "ArrowLeft" "←"
           "Mod" "Ctrl"}
    (mac?)
    (merge {"Alt" "⌥"
            "Shift" "⇧"
            "Enter" "⏎"
            "Ctrl" "⌃"
            "Mod" "⌘"})))

(defn render-key [key]
  (let [keys (into [] (map #(get ((memoize key-mapping)) % %) (str/split key #"-")))]
    (into [:span]
          (map-indexed (fn [i k]
                         [:<>
                          (when-not (zero? i) [:span " + "])
                          [:kbd.kbd k]]) keys))))

(defn key-bindings-table [keymap]
  [:table.w-full.text-sm
   [:thead
    [:tr.border-t
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 "Command"]
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 "Keybinding"]
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 "Alternate Binding"]
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 {:style {:min-width 290}} "Description"]]]
   (into [:tbody]
         (->> keymap
              (sort-by first)
              (map (fn [[command [{:keys [key shift doc]} & [{alternate-key :key}]]]]
                     [:<>
                      [:tr.border-t.hover:bg-gray-100
                       [:td.px-3.py-1.align-top.monospace.whitespace-nowrap [:b (name command)]]
                       [:td.px-3.py-1.align-top.text-right.text-sm.whitespace-nowrap (render-key key)]
                       [:td.px-3.py-1.align-top.text-right.text-sm.whitespace-nowrap (some-> alternate-key render-key)]
                       [:td.px-3.py-1.align-top doc]]
                      (when shift
                        [:tr.border-t.hover:bg-gray-100
                         [:td.px-3.py-1.align-top [:b (name shift)]]
                         [:td.px-3.py-1.align-top.text-sm.whitespace-nowrap.text-right
                          (render-key (str "Shift-" key))]
                         [:td.px-3.py-1.align-top.text-sm]
                         [:td.px-3.py-1.align-top]])]))))])

(defn ^:dev/after-load render []
  (rdom/render [samples] (js/document.getElementById "editor"))
  (.. (js/document.querySelectorAll "[clojure-mode]")
      (forEach #(when-not (.-firstElementChild %)
                  (rdom/render [editor (str/trim (.-innerHTML %))] %))))
  (let [mapping (key-mapping)]
    (.. (js/document.querySelectorAll ".mod,.alt,.ctrl")
        (forEach #(when-let [k (get mapping (.-innerHTML %))]
                    (set! (.-innerHTML %) k)))))

  ;; set viewer tailwind stylesheet
  (j/assoc! (js/document.getElementById "viewer-stylesheet")
            :innerHTML (rc/inline "stylesheets/viewer.css"))

  (rdom/render [key-bindings-table (merge keymap/paredit-keymap* (sci/keymap* "Alt"))] (js/document.getElementById "docs"))
  (rdom/render [:div.rounded-md.mb-0.text-sm.monospace.overflow-auto.relative.border.shadow-lg.bg-white
                [markdown-editor {:doc "# Hello Markdown

Lezer [mounted trees](https://lezer.codemirror.net/docs/ref/#common.MountedTree) allows to
have an editor with ~~mono~~ _mixed language support_.

```clojure
(defn the-answer
  \"to all questions\"
  []
  (inc 41))
```

## Todo
- [x] resolve **inner nodes**
- [ ] fix extra spacing when autoformatting after paredit movements
- [ ] fix errors when entering a newline
- [ ] fix extra space when entering a newline
- [ ] fix errors on Ctrl-K
- [ ] fix dark theme
"}]] (js/document.getElementById "markdown-editor"))
  (rdom/render [:div
                [:div.mb-5.bg-white.max-w-4xl.mx-auto.border
                 [key-bindings-table {:toggle-preview
                                      [{:key "Esc" :doc "Toggles between preview and edit mode"}]
                                      :select-previous-block
                                      [{:key "ArrowUp" :doc "Selects block before the current selection"}]
                                      :select-next-block
                                      [{:key "ArrowDown" :doc "Selects block after the current selection"}]
                                      :eval-region-at-cursor
                                      [{:key "Alt" :doc "Selects and evaluates form at cursor or evaluates current selection"}]
                                      :eval-top-form-at-cursor
                                      [{:key "Alt-Shift" :doc "Selects and evaluates top form at cursor"}]
                                      :eval-region-grow
                                      [{:key "Alt-ArrowUp" :doc "Grows the selected region and evaluates"}]
                                      :eval-region-shrink
                                      [{:key "Alt-ArrowUp" :doc "Shrinks the selected region and evaluates"}]}]]
                [:div.rounded-md.mb-0.text-sm.monospace.overflow-auto.relative.border.shadow-lg.bg-white
                 [markdown-editor {:extensions [markdown-preview]
                                   :doc "# Hello Markdown

Lezer [mounted trees](https://lezer.codemirror.net/docs/ref/#common.MountedTree) allows to
have an editor with ~~mono~~ _mixed language support_.

```clojure
(defn the-answer
  \"to all questions\"
  []
  (inc 41))

(v/html [:h2 (str \"The Answer is: \" (the-answer))])
```

## Todo
- [x] Use markdown grammar to split document à la Clerk
- [x] implement block widgets with previews
- [x] make previews editable on click
- [ ] make previews selectable with arrow keys
- [x] make previews editable on click
- [ ] fix loosing selection
- [x] eval region in clojure blocks
- [x] toggle previews editable on cursor enter/leave
- [x] add code block SCI results
- [ ] fix (?) dispatching changes/annotations twice
- [x] bring Clerk stylesheet in demo
- [x] toggle edit all by a second hit of ESC
- [ ] choose keybindings
"}]]] (js/document.getElementById "markdown-preview"))

  (when (linux?)
    (js/twemoji.parse (.-body js/document))))
