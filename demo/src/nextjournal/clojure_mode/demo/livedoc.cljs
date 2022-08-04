(ns nextjournal.clojure-mode.demo.livedoc
  (:require [nextjournal.clojure-mode.demo :as demo]
            [nextjournal.clerk.sci-viewer :as sv]
            [nextjournal.clerk.viewer :as v]
            [applied-science.js-interop :as j]
            [shadow.resource :as rc]
            [clojure.string :as str]
            [nextjournal.livedoc :as livedoc]
            [nextjournal.clojure-mode.demo.sci :as demo.sci]
            ["react" :as react]
            [reagent.dom :as rdom]))

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
  ;; set viewer tailwind stylesheet
  (j/assoc! (js/document.getElementById "viewer-stylesheet")
            :innerHTML (rc/inline "stylesheets/viewer.css"))

  (rdom/render [:div
                [:div.rounded-md.mb-0.text-sm.monospace.border.shadow-lg.bg-white
                 [livedoc/editor {:focus? true
                                  :extensions [demo/theme]
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
                                        [:div.flex.flex-col.rounded.m-2
                                         {:class (when selected? "ring-4")}
                                         (case type
                                           :markdown
                                           [:div.p-3.rounded.border
                                            [:div.max-w-prose
                                             [sv/inspect-paginated (v/with-viewer :markdown (:text @state))]]]

                                           :code
                                           [:<>
                                            [:div.p-2.rounded.border.bg-slate-200
                                             [sv/inspect-paginated (v/with-viewer :code text)]]
                                            (when-some [{:keys [error result]} r]
                                              [:div.viewer-result.m-2
                                               {:style {:font-family "var(--code-font)"}}
                                               (cond
                                                 error [:div.red error]
                                                 (react/isValidElement result) result
                                                 result (sv/inspect-paginated result))])])])))
                                  :doc "# 👋 Hello LiveDoc

LiveDoc is a cljs notebook editor powered by CodeMirror Markdown language support and nextjournal clojure mode.

We're evaluating code in [Clerk](https://github.com/nextjournal/clerk)'s SCI context. In particular we're rendering _markdown_ cells in terms of Clerk's viewers. This allows e.g. to get inline $\\LaTeX$ formulas as well as block ones

$$\\hat{f}(x) = \\int_{-\\infty}^{+\\infty} f(t)\\exp^{-2\\pi i x t}dt$$

All of Clerk's API is available

```
(v/plotly {:data [{:y (shuffle (range -100 100))}]})
```

## Keybindings

* `ESC`: toggles edit-one / edit-all / preview & select block
* `ALT`: pressed while in edit mode toggles a tooltip with eval-at-cursor results
* Arrow keys move selection up/down
* `CMD + Enter` : Evaluate selected cell or leave edit mode
* `CMD + Shift + Enter`: Evaluates all cells

```
(v/table
  (zipmap
    (map (comp keyword char) (range 97 113))
    (map #(shuffle (range 10)) (range 16))))
```
```
(v/vl {:width 650 :height 400 :mark \"geoshape\"
       :data {:url \"https://vega.github.io/vega-datasets/data/us-10m.json\"
              :format {:type \"topojson\"
                       :feature \"counties\"}}
       :transform
       [{:lookup \"id\"
         :from {:data {:url \"https://vega.github.io/vega-datasets/data/unemployment.tsv\"}
                :key \"id\" :fields [\"rate\"]}}]
       :projection {:type \"albersUsa\"}
       :encoding {:color {:field \"rate\" :type \"quantitative\"}}})
```
```
(def pie
  (v/plotly
    {:data [{:values [27 11 25 8 1 3 25]
             :labels [\"US\" \"China\" \"European Union\" \"Russian Federation\"
                      \"Brazil\" \"India\" \"Rest of World\"]
             :text \"CO2\"
             :textposition \"inside\"
             :domain {:column 1}
             :hoverinfo \"label+percent+name\"
             :hole 0.4
             :type \"pie\"}]
     :layout {:showlegend false
              :width 200
              :height 200
              :annotations [{:font {:size 20} :showarrow false :x 0.5 :y 0.5 :text \"CO2\"}]}
     :config {:responsive true}}))

(def contour
  (v/plotly {:data [{:z [[10 10.625 12.5 15.625 20]
                         [5.625 6.25 8.125 11.25 15.625]
                         [2.5 3.125 5.0 8.125 12.5]
                         [0.625 1.25 3.125 6.25 10.625]
                         [0 0.625 2.5 5.625 10]]
                     :type \"contour\"}]}))

(v/col
  ;; FIXME: can't use nested v/html
  (v/with-viewer :html [:h1 \"Plots\"])
  (v/row pie contour))
```

## Usage

Use livedoc editor function as a reagent component in your cljs application

    [nextjournal.clojure-mode.livedoc/editor opts]

where `opts` is a map with keys:

* `:doc` (required) a markdown string

* `:render` a function taking a reagent state atom, returning hiccup. Such state holds a map with:
  * `:text` the block's text
  * `:type` with values `:code` or `:markdown`
  * `:selected?`

* `:eval-fn!` will be called on selected block states when evaluation is triggered

* `:tooltip` customises tooltip view

```clojure
(defonce state (atom 0))
```
```clojure
(defn the-answer
  \"to all questions\"
  [x]
  (inc x))
```
```clojure
(swap! state inc)
```
```clojure
(v/html [:h2 (str \"The Answer is: \" (the-answer @state))])
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
- [x] fix Clerk plotly/vega viewers
- [x] eval region in clojure blocks
- [x] toggle previews editable on cursor enter/leave
- [x] add code block SCI results
- [ ] fix (?) dispatching changes/annotations twice
- [x] bring Clerk stylesheet in demo
- [x] toggle edit all by a second hit of ESC
- [x] make livedoc extensions configurable
- [x] fix moving to the right in backticks
- [x] autoclose backticks
- [x] fix eval for empty code cells"}]]] (js/document.getElementById "livedoc-container"))

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
                  [:div
                   [:div.text-lg.font-medium.mb-4
                    [:em "Testing LiveDoc on somewhat larger texts like " [:a {:href "https://github.com/applied-science/js-interop"} "js-interop"] " README."]]
                   [:div.rounded-md.mb-0.text-sm.monospace.border.shadow-lg.bg-white
                    [livedoc/editor {:doc markdown-doc
                                     :extensions [demo/theme]
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
                                           [:div.flex.flex-col.rounded.m-2
                                            {:class (when selected? "ring-4")}
                                            (case type
                                              :markdown
                                              [:div.p-3.rounded.border
                                               [:div.max-w-prose
                                                [sv/inspect-paginated (v/with-viewer :markdown (:text @state))]]]

                                              :code
                                              [:<>
                                               [:div.p-2.rounded.border.bg-slate-200
                                                [sv/inspect-paginated (v/with-viewer :code text)]]
                                               (when-some [{:keys [error result]} r]
                                                 [:div.viewer-result.m-2
                                                  {:style {:font-family "var(--code-font)"}}
                                                  (cond
                                                    error [:div.red error]
                                                    (react/isValidElement result) result
                                                    result (sv/inspect-paginated result))])])])))}]]]
                  (js/document.getElementById "livedoc-large-container")))))))
