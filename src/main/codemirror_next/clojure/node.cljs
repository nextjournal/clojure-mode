(ns codemirror-next.clojure.node
  (:refer-clojure :exclude [coll? ancestors string? empty? regexp? name type range resolve])
  (:require ["lezer-tree" :as lz-tree]
            ["lezer" :as lezer]
            [clojure.core :as core]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.selections :as sel]))

(defn start [^js node] (.-start node))
(defn end [^js node] (.-end node))
(defn depth [^js node] (.-depth node))

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

(def bracket? (comp boolean all-brackets name))
(def opening-bracket? (comp boolean brackets name))
(def closing-bracket? (comp boolean closing-brackets name))

(defn type [^js node]
  (cond-> node
    (not (instance? lezer/NodeType node))
    .-type))

(defn coll? [node]
  (j/get (j/obj "Set" true
                "Map" true
                "List" true
                "Vector" true) (name node) false))

(defn top? [node] (nil? (.-parent node)))

(defn string? [node] (identical? "String" (name node)))
(defn regexp? [node] (identical? "RegExp" (name node)))

(j/defn balanced? [^:js {:as node :keys [^js firstChild ^js lastChild]}]
  (boolean
   (when-let [closing (brackets (name firstChild))]
     (and (= closing (name lastChild))
          (not= (end firstChild) (end lastChild))))))

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
  ([^js subtree from dir]
   (when-some [child (case dir 1 (.childAfter subtree from)
                               -1 (.childBefore subtree from))]
     (cons child (lazy-seq
                  (child-subtrees subtree (case dir 1 (end child)
                                                    -1 (start child)) dir)))))
  ([^js subtree]
   (child-subtrees subtree (start subtree) 1)))

(defn empty?
  "Node only contains whitespace"
  [^js node]
  (let [type-name (name node)]
    (cond (coll? type-name) (core/empty? (remove (comp all-brackets name) (child-subtrees node)))
          (string? type-name) (== (.. node -firstChild -end) (.. node -lastChild -start))
          :else false)))

(defn range [^js node]
  (u/from-to (start node) (end node)))

(defn string [^js state ^js node]
  (.slice (.-doc state) (start node) (end node)))

(defn eq? [^js x ^js y]
  (and (== (start x) (start y))
       (== (end x) (end y))
       (== (depth x) (depth y))))

(defn positions-from [^js node from dir n]
  (let [found (atom [])]
    (.iterate node #js{:from from
                       :to (case dir 1 js/undefined -1 0)
                       :enter (fn [_ start end]
                                (swap! found conj {:start start :end end})
                                (if (>= (count @found) n)
                                  nil
                                  js/undefined))
                       :leave (fn [_ start end]
                                (swap! found conj {:start start :end end}))})
    @found
    ))

(defn getter [^keyword k]
  (fn [o] (j/get o k)))

(defn ancestor? [parent child]
  (boolean
   (and (< (depth parent) (depth child))
        (<= (start parent) (start child))
        (>= (end parent) (end child)))))

(defn left [^js node]
  (.childBefore (.-parent node) (start node)))

(defn right [^js node]
  (.childAfter (.-parent node) (end node)))

(defn first-child [^js node]
  (.-firstChild node))

(defn last-child [^js node]
  (.-lastChild node))

(defn up [^js node]
  (.-parent node))

(defn iterate-some [f x]
  (take-while identity (iterate f x)))

(defn direction [from to]
  (let [cmp (compare (start to) (start from))]
    (if (zero? cmp)
      (cond (ancestor? to from) -1
            (ancestor? from to) 1
            (eq? from to) 0)
      cmp)))

(defn prefer [preference [L C R ]]
  (case preference
    :left (or L C)
    :right (or R C)))

(defn move-toward
  "Returns next loc moving toward `to-path`, skipping children"
  [node to-node]
  (when-not (eq? node to-node)
    (case (compare (start to-node) (start node))
      0 (cond (ancestor? to-node node) (up node)
              (ancestor? node to-node) (first-child node))
      -1 (if (ancestor? node to-node)
           (.-lastChild node)
           (or (left node)
               (up node)))
      1 (if (ancestor? node to-node)
          (.-firstChild node)
          (or (right node)
              (up node))))))

(defn nodes-between [node to-node]
  (take-while identity (iterate #(move-toward % to-node) node)))

(defn- require-balance? [node]
  (or (coll? node)
      (string? node)
      (regexp? node)))

(defn resolve
  ([state pos] (resolve state pos js/undefined))
  ([^js state pos dir]
   (.. state -tree (resolve pos dir))))

(j/defn balanced-range [state from to]
  (let [[from to] (sort [from to])
        from-node (resolve state from 1)
        to-node (resolve state to -1)
        from (if (require-balance? from-node)
               (start from-node)
               from)
        to (if (require-balance? to-node)
             (end to-node)
             to)
        [left right] (->> (nodes-between from-node to-node)
                          (map #(cond-> % (bracket? %) up))
                          (reduce (fn [[left right] ^js node-between]
                                    [(if (ancestor? node-between from-node) (start node-between) left)
                                     (if (ancestor? node-between to-node) (end node-between) right)])
                                  [from to]))]
    (sel/range left right)))


