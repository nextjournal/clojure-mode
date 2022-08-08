(ns nextjournal.clojure-mode.demo.sci
  (:require ["@codemirror/view" :as view]
            [applied-science.js-interop :as j]
            [clojure.string :as str]
            [nextjournal.clerk.sci-viewer :as sv]
            [nextjournal.clojure-mode.extensions.eval-region :as eval-region]
            [sci.core :as sci]))

(defn eval-string
  ([source] (eval-string @sv/!sci-ctx source))
  ([ctx source]
   (when-some [code (not-empty (str/trim source))]
     (try {:result (sci/eval-string* ctx code)}
          (catch js/Error e
            {:error (str (.-message e))})))))

(j/defn eval-at-cursor [on-result ^:js {:keys [state]}]
  (some->> (eval-region/cursor-node-string state)
           (eval-string)
           (on-result))
  true)

(j/defn eval-top-level [on-result ^:js {:keys [state]}]
  (some->> (eval-region/top-level-string state)
           (eval-string)
           (on-result))
  true)

(j/defn eval-cell [on-result ^:js {:keys [state]}]
  (-> (.-doc state)
      (str)
      (eval-string)
      (on-result))
  true)

(defn keymap* [modifier]
  {:eval-cell
   [{:key "Mod-Enter"
     :doc "Evaluate cell"}]
   :eval-at-cursor
   [{:key (str modifier "-Enter")
     :doc "Evaluates form at cursor"}]
   :eval-top-level
   [{:key (str modifier "-Shift-Enter")
     :doc "Evaluates top-level form at cursor"}]})

(defn extension [{:keys [modifier
                         on-result]}]
  (.of view/keymap
       (j/lit
        [{:key "Mod-Enter"
          :run (partial eval-cell on-result)}
         {:key (str modifier "-Enter")
          :shift (partial eval-top-level on-result)
          :run (partial eval-at-cursor on-result)}])))
