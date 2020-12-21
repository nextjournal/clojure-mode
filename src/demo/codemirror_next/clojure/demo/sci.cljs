(ns codemirror-next.clojure.demo.sci
  (:require ["@codemirror/next/view" :as view]
            [applied-science.js-interop :as j]
            [sci.core :as sci]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.extensions.temp-selection :as temp-selection]
            [codemirror-next.clojure.util :as u]))

(defonce context (sci/init {}))

(defn eval-string [source]
  (try (sci/eval-string* context source)
       (catch js/Error e
         (str e))))

(j/defn eval-current-range [on-result ^:js {:as view :keys [state]}]
  (some->> (temp-selection/current-string state)
           (eval-string)
           (on-result))
  true)

(j/defn eval-cell [on-result ^:js {:as view :keys [state]}]
  (-> (str "(do " (.-doc state) " )")
      (eval-string)
      (on-result))
  true)

(defn extension [{:keys [modifier
                         on-result]}]
  (view/keymap
   (j/lit
    [{:key "Mod-Enter"
      :run (partial eval-cell on-result)}
     {:key (str modifier "-Enter")
      :shift (partial eval-current-range on-result)
      :run (partial eval-current-range on-result)}])))
