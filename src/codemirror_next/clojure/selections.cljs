(ns codemirror-next.clojure.selections
  (:refer-clojure :exclude [range])
  (:require ["@codemirror/next/state" :refer [EditorSelection]]))

(defn range [from to] (.range EditorSelection from to))
(defn cursor [from] (.cursor EditorSelection from))
(defn create [ranges index] (.create EditorSelection ranges index))
