(ns codemirror-next.clojure.node
  (:refer-clojure :exclude [coll? ancestors string? empty? regexp? name type range])
  (:require ["lezer-tree" :as lz-tree]
            ["lezer" :as lezer]
            [clojure.core :as core]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]))

(def brackets {"(" ")"
               "[" "]"
               "{" "}"
               \" \"})

(def closing-brackets
  (zipmap (reverse (map val brackets))
          (reverse (map key brackets))))

(def all-brackets (set (concat (keys brackets) (vals brackets))))

(defn error? [^js node]
  (.prop node lz-tree/NodeProp.error))

(defn ^string name [^js node]
  (if (core/string? node)
    node
    (or (.-name node)
        (.. node -type -name))))

(defn type [^js node]
  (cond-> node
    (not (instance? lezer/NodeType node))
    .-type))

(defn coll? [node]
  (j/get (j/obj "Set" true
                "Map" true
                "List" true
                "Vector" true) (name node) false))

(defn string? [node] (identical? "String" (name node)))
(defn regexp? [node] (identical? "RegExp" (name node)))

(j/defn balanced? [^:js {:as node :keys [^js firstChild ^js lastChild]}]
  (boolean
   (when-let [closing (brackets (name firstChild))]
     (and (= closing (name lastChild))
          (not= (.-end firstChild) (.-end lastChild))))))

(defn prefix-parent? [type-name]
  (j/get (j/obj "Ignored" true
                "Quote" true
                "SyntaxQuote" true
                "Unquote" true
                "ReaderConditional" true) type-name false))

(defn left-edge-width [node]
  (j/get #js{:Set 2
             :RegExp 2} (name node) 1))

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

(defn empty?
  "Node only contains whitespace"
  [^js node]
  (let [type-name (name node)]
    (cond (coll? type-name) (core/empty? (remove (comp all-brackets name) (child-subtrees node)))
          (string? type-name) (== (.. node -firstChild -end) (.. node -lastChild -start))
          :else false)))

(defn range [^js node]
  (u/from-to (.-start node) (.-end node)))
