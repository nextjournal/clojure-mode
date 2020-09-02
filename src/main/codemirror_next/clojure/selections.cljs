(ns codemirror-next.clojure.selections
  (:refer-clojure :exclude [range])
  (:require ["@codemirror/next/state" :refer [EditorSelection]]))

(defn range
  ([from to] (.range EditorSelection from to))
  ([^js range] (.range EditorSelection (.-from range) (.-to range))))
(defn cursor [from] (.cursor EditorSelection from))
(defn create [ranges index] (.create EditorSelection ranges index))
(defn constrain [^js state from] (-> from (max 0) (min (.. state -doc -length))))
(defn eq? [^js sel1 sel2]
  (.eq sel1 sel2))
