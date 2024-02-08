# 👋 Hello LiveDoc

LiveDoc is a cljs notebook editor powered by [CodeMirror Markdown language support](https://github.com/codemirror/lang-markdown) and [nextjournal clojure mode](https://nextjournal.github.io/clojure-mode).

In this demo we're evaluating code in [Clerk](https://github.com/nextjournal/clerk)'s SCI context. In particular we're rendering _markdown_ cells in terms of Clerk's viewers. This allows e.g. to get inline $\LaTeX$ formulas as well as block ones

$$\hat{f}(x) = \int_{-\infty}^{+\infty} f(t)\exp^{-2\pi i x t}dt$$

Here's some of Clerk's API in action

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

## Keybindings

* `ESC`: toggles edit-one / edit-all / preview & select block
* `ALT`: pressed while in edit mode toggles a tooltip with eval-at-cursor results
* Arrow keys move selection up/down
* `CMD + Enter` : Evaluate selected cell or leave edit mode
* `CMD + Shift + Enter`: Evaluates all cells

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

## Extending the Evaluation Context

The rendering of blocks and their evaluation is fully customizable, this makes it easy to bring your own SCI context. In this notebook Clerk's context is being augmented of some convenient helpers for loading and handling data in the notebook:

* `livedoc/with-fetch`
* `csv/parse`
* `observable/Plot`

```clojure
(livedoc/with-fetch "https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv"
  (fn [text]
    (v/table (take 10 (map js->clj (csv/parse text))))))
```

The following example is taken from this [Observable notebook](https://observablehq.com/@observablehq/plot)

```clojure
(livedoc/with-fetch "https://raw.githubusercontent.com/flother/rio2016/master/athletes.csv"
  (fn [data]
    (.. observable/Plot
      (dot (csv/parse data)
        (j/obj :x "weight" :y "height" :stroke "sex"))
      plot)))
```
```clojure
(v/plotly {:data [{:y (shuffle (range -100 100))}]})
```

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
- [ ] cannot click to move cursor in each editable section bottom lines (probably we need calls to `requestMeasure`) 
- [ ] scroll selected block into view when moving out of viewport
- [ ] clicking on blocks not always results in an edit at the right place
- [ ] avoid re-rendering _all_ previews when scrolling or clicking to edit one (probably connected to height computations)
- [ ] use async SCI eval
- [ ] don't eval code when rendering previews (but only when leaving edit mode)
