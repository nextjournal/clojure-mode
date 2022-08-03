(ns nextjournal.clojure-mode.demo
  (:require ["@codemirror/language" :refer [foldGutter syntaxHighlighting defaultHighlightStyle]]
            ["@codemirror/commands" :refer [history historyKeymap]]
            ["@codemirror/state" :refer [EditorState]]
            ["@codemirror/view" :as view :refer [EditorView]]
            [nextjournal.clerk.sci-viewer :as sv]
            [nextjournal.clerk.viewer :as v]
            [applied-science.js-interop :as j]
            [shadow.resource :as rc]
            [clojure.string :as str]
            [nextjournal.clojure-mode :as cm-clj]
            [nextjournal.livedoc :as livedoc]
            [nextjournal.clojure-mode.demo.sci :as demo.sci]
            [nextjournal.clojure-mode.keymap :as keymap]
            [nextjournal.clojure-mode.live-grammar :as live-grammar]
            [nextjournal.clojure-mode.test-utils :as test-utils]
            ["react" :as react]
            [reagent.core :as r]
            [reagent.dom :as rdom]))

(def theme
  (.theme EditorView
          (j/lit {".cm-content" {:white-space "pre-wrap"
                                 :padding "10px 0"
                                 :flex "1 1 0"}

                  "&.cm-focused" {:outline "0 !important"}
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
               last-result (when eval? (r/atom (demo.sci/eval-string source)))
               mount! (fn [el]
                        (when el
                          (reset! !view (new EditorView
                                             (j/obj :state
                                                    (test-utils/make-state
                                                     (cond-> #js [extensions]
                                                       eval? (.concat #js [(demo.sci/extension {:modifier "Alt"
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

;;  Markdown editors
(defn markdown-editor [{:keys [doc extensions]}]
  [:div {:ref (fn [^js el]
                (when el
                  (some-> el .-editorView .destroy)
                  (j/assoc! el :editorView
                            (EditorView. (j/obj :parent el
                                                :state (.create EditorState
                                                                (j/obj :doc (str/trim doc)
                                                                       :extensions (into-array
                                                                                    (cond-> [(syntaxHighlighting defaultHighlightStyle)
                                                                                             (foldGutter)
                                                                                             (.of view/keymap cm-clj/complete-keymap)
                                                                                             (history)
                                                                                             (.of view/keymap historyKeymap)
                                                                                             theme
                                                                                             livedoc/markdown-language-support]
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

(defn eval-code-view
  ([code] (eval-code-view @sv/!sci-ctx code))
  ([ctx code]
   [:div.viewer-result {:style {:white-space "pre-wrap" :font-family "var(--code-font)"}}
    (when-some [{:keys [error result]} (when (seq (str/trim code)) (demo.sci/eval-string ctx code))]
      (cond
        error [:div.red error]
        (react/isValidElement result) result
        'else (sv/inspect-paginated result)))]))

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

  (rdom/render [key-bindings-table (merge keymap/paredit-keymap* (demo.sci/keymap* "Alt"))] (js/document.getElementById "docs"))
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
- [x] fix extra spacing when autoformatting after paredit movements
- [x] fix errors when entering a newline
- [ ] fix extra space when entering a newline
- [x] fix nonsense deletions hitting delete key
- [x] limit the scope of autoformat (TAB)
- [x] limit the scope of kill*
- [x] limit the scope of eval-region
- [ ] restore autoformat when deleting
- [x] keep parens balanced when deleting backward
- [x] fix errors on Ctrl-K
- [ ] fix dark theme
- [ ] fix demo error: CssSyntaxError: <css input>:62:15: The `font-inter` class does not exist
"}]] (js/document.getElementById "markdown-editor"))

  ;; livedoc
  (rdom/render [:div
                [:div.text-lg.font-medium.mb-2 [:em "Click on a cell to edit or use the following keybindings"]]
                [:div.mb-5.bg-white.max-w-4xl.mx-auto.border
                 [key-bindings-table {:toggle-preview
                                      [{:key "Esc" :doc "Toggles Edit-Cell / Edit-all / Preview-and-select modes"}]
                                      :eval
                                      [{:key "Meta-Enter" :doc "Evaluate selected cell / preview when editing a cell"}]
                                      :eval-all
                                      [{:key "Shift-Meta-Enter" :doc "Evaluate all cells"}]
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
                                      [{:key "Alt-ArrowDown" :doc "Shrinks the selected region and evaluates"}]}]]
                [:div.rounded-md.mb-0.text-sm.monospace.border.shadow-lg.bg-white
                 [livedoc/editor {:focus? true
                                  :extensions [theme]
                                  :tooltip (fn [text _editor-view]
                                             (let [tt-el (js/document.createElement "div")]
                                               (rdom/render [:div.p-3 [eval-code-view text]] tt-el)
                                               (j/obj :dom tt-el)))

                                  ;; each cell is assigned a `state` reagent atom
                                  :eval-fn!
                                  (fn [state]
                                    (when state
                                      (swap! state (fn [{:as s :keys [text]}]
                                                     (assoc s :result (demo.sci/eval-string text))))))

                                  :render
                                  (fn [state]
                                    (fn []
                                      (let [{:keys [text type selected?] r :result} @state]
                                        #_(when (not-empty (str/trim text)))
                                        ;; skip empty markdown blocks
                                        [:div.flex.flex-col.rounded.border.m-2
                                         {:class [(when selected? "ring-4") (when (= :code type) "bg-slate-100")]}
                                         (case type
                                           :markdown
                                           [:div.max-w-prose.p-2
                                            [sv/inspect-paginated (v/with-viewer :markdown (:text @state))]]

                                           :code
                                           [:div.p-2
                                            [:div.max-w-prose
                                             [sv/inspect-paginated (v/with-viewer :code text)]]
                                            [:hr.border]
                                            [:div.viewer-result.mt-2 {:style {:font-family "var(--code-font)"}}
                                             (when-some [{:keys [error result]} r]
                                               (cond
                                                 error [:div.red error]
                                                 (react/isValidElement result) result
                                                 result (sv/inspect-paginated result)))]])])))
                                  :doc "# Hello Markdown

Lezer [mounted trees](https://lezer.codemirror.net/docs/ref/#common.MountedTree) allows to
have an editor with ~~mono~~ _mixed language support_.

```clojure
(defonce state (atom 0))
```
```clojure
(defn the-answer
  \"to all questions\"
  []
  (inc 41))
```
```clojure
(swap! state inc)
```

We're evaluating code in [Clerk](https://github.com/nextjournal/clerk)'s SCI context:

```
(v/plotly-viewer {:data [{:y [3 1 2]}]})
```

We're also rendering _markdown_ cells in terms of Clerk's viewers. This allows e.g. to get inline $\\LaTeX$ formulas as well as block ones

$$\\hat{f}(x) = \\int_{-\\infty}^{+\\infty} f(t)\\exp^{-2\\pi i x t}dt$$
```clojure
(v/html [:h2 (str \"The Answer is: \" @state)])
```

## Todo
- [x] Use markdown grammar to split document à la Clerk
- [x] implement block widgets with previews
- [x] make previews editable on click
- [x] make previews selectable with arrow keys
- [x] make previews editable on click
- [x] fix loosing cursor moving up/down to enter a preview block
- [x] fix blocks when editing last one in edit-all mode
- [ ] fix overflow-x in blocks
- [ ] fix selecting positions with click in editable sections between previews
- [ ] fix scrollIntoView when moving selected block out of viewport
- [ ] clicking on block close to viewport sides not always results in an edit
- [ ] fix Clerk plotly/vega viewers
- [x] eval region in clojure blocks
- [x] toggle previews editable on cursor enter/leave
- [x] add code block SCI results
- [ ] fix (?) dispatching changes/annotations twice
- [x] bring Clerk stylesheet in demo
- [x] toggle edit all by a second hit of ESC
- [x] make livedoc extensions configurable
- [x] fix moving to the right in backticks
- [x] autoclose backticks
- [x] fix eval for empty code cells
"}]]] (js/document.getElementById "markdown-preview"))

  (-> (js/fetch "https://raw.githubusercontent.com/applied-science/js-interop/master/README.md")
      (.then #(.text %))
      (.then #(-> %  ;; literal fixes
                  (str/replace "…some javascript object…" ":x 123")
                  (str/replace "…" "'…")
                  (str/replace "..." "'…")
                  #_ (str/replace "default-value" "'default-value")
                  (str/replace "default" "'default")
                  (str/replace "! a 10)" "! (into-array [1 2 3]) 10)")))
      (.then (fn [markdown-doc]
               ;; hack into Clerk's sci-viewer context
               (let [ctx' (sci.core/merge-opts
                           (sci.core/fork @sv/!sci-ctx)
                           ;; FIXME: a more sane approach to js-interop ctx fixes
                           {:namespaces {'user {'obj (j/lit {:x {:y 1} :z 2 :a 1})
                                                '.-someFunction :someFunction
                                                'o (j/obj :someFunction (fn [x] (str "called with: " x)))
                                                '.-x :x '.-y :y '.-z :z '.-a :a
                                                'some-seq [#js {:x 1 :y 2} #js {:x 3 :y 4}]}
                                         'my.app {'.-x :x '.-y :y '.-a :a '.-b :b '.-c :c
                                                  'some-seq [#js {:x 1 :y 2} #js {:x 3 :y 4}]}
                                         'cljs.core {'implements? (fn [c i] false)
                                                     'ISeq nil}}})]
                 (rdom/render
                  [:div.rounded-md.mb-0.text-sm.monospace.border.shadow-lg.bg-white
                   [livedoc/editor {:doc markdown-doc
                                    :extensions [theme]
                                    :tooltip (fn [text _editor-view]
                                               (let [tt-el (js/document.createElement "div")]
                                                 (rdom/render [:div.p-3 [eval-code-view text]] tt-el)
                                                 (j/obj :dom tt-el)))

                                    :eval-fn!
                                    (fn [state]
                                      (when state
                                        (swap! state (fn [{:as s :keys [text]}]
                                                       (assoc s :result (demo.sci/eval-string ctx' text))))))

                                    :render
                                    (fn [state]
                                      (fn []
                                        (let [{:keys [text type selected?] r :result} @state]
                                          #_(when (not-empty (str/trim text)))
                                          ;; skip empty markdown blocks
                                          [:div.flex.flex-col.rounded.border.m-2
                                           {:class [(when selected? "ring-4") (when (= :code type) "bg-slate-100")]}
                                           (case type
                                             :markdown
                                             [:div.max-w-prose.p-2
                                              [sv/inspect-paginated (v/with-viewer :markdown (:text @state))]]

                                             :code
                                             [:div.p-2
                                              [:div.max-w-prose
                                               [sv/inspect-paginated (v/with-viewer :code text)]]
                                              [:hr.border]
                                              [:div.viewer-result.mt-2 {:style {:font-family "var(--code-font)"}}
                                               (when-some [{:keys [error result]} r]
                                                 (cond
                                                   error [:div.red error]
                                                   (react/isValidElement result) result
                                                   result (sv/inspect-paginated result)))]])])))}]]
                  (js/document.getElementById "markdown-preview-large"))))))

  (when (linux?)
    (js/twemoji.parse (.-body js/document))))

(comment
  (let [ctx' (sci.core/fork @sv/!sci-ctx)
        ctx'' (sci.core/merge-opts ctx' {:namespaces {'foo {'bar "ahoi"}}})]

    (demo.sci/eval-string ctx'' "(def o (j/assoc! #js {:a 1} :b 2))")
    (demo.sci/eval-string ctx'' "(j/lookup (j/assoc! #js {:a 1} :b 2))")
    (demo.sci/eval-string ctx'' "(j/get o :b)")
    (demo.sci/eval-string ctx'' "(into-array [1 2 3])")

    ;; this is not evaluable as-is in sci
    (demo.sci/eval-string ctx'' "(j/let [^:js {:keys [a b]} o] (map inc [a b]))")))
