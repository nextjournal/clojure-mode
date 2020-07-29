(ns codemirror-next.clojure.node
  (:refer-clojure :exclude [coll? ancestors string? empty? regexp?])
  (:require [clojure.core :as core]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]))

(defn ^string type-name [node]
  (if (core/string? node) node (j/!get-in node [:type :name])))

(defn coll? [node]
  (j/get (j/obj "Set" true
                "Map" true
                "List" true
                "Vector" true) (type-name node) false))

(defn string? [node] (identical? "String" (type-name node)))
(defn regexp? [node] (identical? "RegExp" (type-name node)))

(defn prefix-parent? [type-name]
  (j/get (j/obj "Ignored" true
                "Quote" true
                "SyntaxQuote" true
                "Unquote" true
                "ReaderConditional" true) type-name false))

(defn left-edge-width [node]
  (j/get #js{:Set 2
             :RegExp 2} (type-name node) 1))

(defn right-edge-width [node] 1)

(defn ancestors [^js node]
  (when-some [parent (.-parent node)]
    (cons parent
          (lazy-seq (ancestors parent)))))

(defn closest [node pred]
  (if (pred node)
    node
    (reduce (fn [_ x] (if (pred x) (reduced x) nil)) nil (ancestors node))))

(defn brackets? [node]
  (or (coll? node) (string? node) (regexp? node)))

(j/defn inner-span [^:js {:keys [start end] :as node}]
  (when brackets?
    (u/from-to (+ start (left-edge-width node))
               (- end (right-edge-width node)))))

(defn child-subtrees
  ([^js subtree from]
   (when-some [first-child (.childAfter subtree from)]
     (cons first-child (lazy-seq
                        (child-subtrees subtree (.-end first-child))))))
  ([^js subtree]
   (child-subtrees subtree (.-start subtree))))

(defn empty? [^js node]
  (let [name (type-name node)]
    (prn name (regexp? name) (== 3 (- (.-end node) (.-start node))))
    (cond (coll? name) (core/empty? (child-subtrees node))
          (string? name) (== 2 (- (.-end node) (.-start node)))
          (regexp? name) (== 3 (- (.-end node) (.-start node)))
          :else false)))
