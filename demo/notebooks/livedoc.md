# 👋 Hello LiveDoc

LiveDoc is a cljs notebook editor powered by [CodeMirror Markdown language support](https://github.com/codemirror/lang-markdown) and [nextjournal clojure mode](https://nextjournal.github.io/clojure-mode).

The rendering of blocks and their evaluation is fully customizable, this makes it easy to bring your own SCI context.

In this demo we're evaluating code in [Clerk](https://github.com/nextjournal/clerk)'s SCI context. In particular we're rendering _markdown_ cells in terms of Clerk's viewers. This allows e.g. to get inline $\LaTeX$ formulas as well as block ones

$$\hat{f}(x) = \int_{-\infty}^{+\infty} f(t)\exp^{-2\pi i x t}dt$$

Here's some of Clerk's API in action

```clojure
(v/plotly {:data [{:y (shuffle (range -100 100))}]})
```

## Keybindings

* `ESC`: toggles edit-one / edit-all / preview & select block
* `ALT`: pressed while in edit mode toggles a tooltip with eval-at-cursor results
* Arrow keys move selection up/down
* `CMD + Enter` : Evaluate selected cell or leave edit mode
* `CMD + Shift + Enter`: Evaluates all cells

```clojure
(v/table
  (zipmap
    (map (comp keyword char) (range 97 113))
    (map #(shuffle (range 10)) (range 16))))
```
```clojure
(v/vl {:width 650 :height 400 :mark "geoshape"
       :data {:url "https://vega.github.io/vega-datasets/data/us-10m.json"
              :format {:type "topojson"
                       :feature "counties"}}
       :transform
       [{:lookup "id"
         :from {:data {:url "https://vega.github.io/vega-datasets/data/unemployment.tsv"}
                :key "id" :fields ["rate"]}}]
       :projection {:type "albersUsa"}
       :encoding {:color {:field "rate" :type "quantitative"}}})
```
```clojure
(def pie
  (v/plotly
    {:data [{:values [27 11 25 8 1 3 25]
             :labels ["US" "China" "European Union" "Russian Federation"
                      "Brazil" "India" "Rest of World"]
             :text "CO2"
             :textposition "inside"
             :domain {:column 1}
             :hoverinfo "label+percent+name"
             :hole 0.4
             :type "pie"}]
     :layout {:showlegend false
              :width 200
              :height 200
              :annotations [{:font {:size 20} :showarrow false :x 0.5 :y 0.5 :text "CO2"}]}
     :config {:responsive true}}))

(def contour
  (v/plotly {:data [{:z [[10 10.625 12.5 15.625 20]
                         [5.625 6.25 8.125 11.25 15.625]
                         [2.5 3.125 5.0 8.125 12.5]
                         [0.625 1.25 3.125 6.25 10.625]
                         [0 0.625 2.5 5.625 10]]
                     :type "contour"}]}))

(v/col
  ;; FIXME: can't use nested v/html
  (v/with-viewer :html [:h1 "Plots"])
  (v/row pie contour))
```

If Clerk's api is not enough, you can reach out to the js ecosystem on the fly without hacking your SCI context.

The following example uses Observable plots to describe [Matt Riggott](https://flother.is/2017/olympic-games-data/) 2016 Olympics data.

```clojure
(defn load-data! [url store mod]
  (.. (js/fetch url)
    (then #(.text %))
    (then #(.. mod (parse % (j/obj :header true :dynamicTyping true)) -data))
    (then #(.slice % 0 3000))
    (then #(reset! store %))))

(defn dot-plot [mod data]
  (when data
    (reagent/with-let [refn (fn [el]
                              (let [dp (.. mod
                                           (dot data (j/obj  :x "weight" :y "height"
                                                             :stroke "sex"))
                                           plot)]
                                (when el
                                  (.append el (.legend dp "color"))
                                  (.append el dp))))]
      [:div {:ref refn}])))

(defn render-plot [mod]
  (reagent/with-let [data (reagent/atom nil)]
    (load-data! "https://raw.githubusercontent.com/flother/rio2016/master/athletes.csv"
      data mod)
    (fn [] [dot-plot mod @data])))

(v/html
  [v/with-d3-require
   {:package ["@observablehq/plot@0.5" "papaparse@5.3.2"]}
   render-plot])
```

## Loading Data

- [ ] extract a pattern from the above

```clojure
(defn wrap-handler [mod handler data]
  (js/console.log :ids data)
  (when data
    [v/inspect-paginated (handler data mod)]))

(defn with-fetch [url handler]
  (v/html
    [v/with-d3-require
     {:package ["papaparse@5.3.2" "@observablehq/plot@0.5"]}
     (fn [mod]
       (reagent/with-let [data (reagent/atom nil)]
         (.. (js/fetch url) (then #(.text %)) (then #(reset! data %)))
         #_ (fn [])
         [wrap-handler mod handler @data]))]))

(defn parse-csv [lib data]
  (.. lib (parse data (j/obj :header true :dynamicTyping true)) -data))

(with-fetch "https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv"
  (fn [data lib]
    (js/console.log "Ahoi")
    (v/table (map js->clj (parse-csv lib data)))))
```

## Usage

Use livedoc `editor` function as a reagent component in your cljs application

    [nextjournal.clojure-mode.livedoc/editor opts]

this puts together an instance of CodeMirror with markdown and clojure mixed language support with a set of extensions configurable via an `opts` map with keys:

* `:doc` (required) a markdown string

* `:render` a function taking a reagent state atom, returning hiccup. Such state holds a map with:
    * `:text` the block's text
    * `:type` with values `:code` or `:markdown`
    * `:selected?`

* `:eval-fn!` will be called on selected block states when evaluation is triggered

* `:tooltip` customises tooltip view

* `:extensions` extra CodeMirror extensions to be added along livedoc ones

* `:focus?` should editor acquire focus when loaded

```clojure
(defonce state (atom 0))
```
```clojure
(defn the-answer
  "to all questions"
  [x]
  (inc x))
```
```clojure
(swap! state inc)
```
```clojure
(v/html [:h2 (str "The Answer is: " (the-answer @state))])
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
- [x] fix eval for empty code cells
