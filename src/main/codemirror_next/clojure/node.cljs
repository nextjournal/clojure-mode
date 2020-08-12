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

(defn left [^js node]
  (.childBefore (.-parent node) (start node)))

(defn lefts [^js node]
  (take-while identity (iterate left (left node))))

(defn right [^js node]
  (.childAfter (.-parent node) (end node)))

(defn rights [^js node]
  (take-while identity (iterate right (right node))))

(defn down [^js node] (.-firstChild node))
(defn down-last [^js node] (.-lastChild node))
(defn up [^js node] (.-parent node))

(def bracket-pair
  (let [pairs {"(" ")"
               "[" "]"
               "{" "}"
               \" \"}]
    (reduce-kv (fn [m k v] (assoc m v k))
               pairs pairs)))

(def prefix-edges #{"#"
                    "##"
                    "#'"
                    "#?"
                    "#^"
                    "#_"
                    "\""
                    "'"
                    "`"
                    "~"
                    "~@"
                    "^"
                    "@"})

(def left-edges (into #{"["
                        "{"
                        "("} prefix-edges))

(def right-edges #{"]"
                   "}"
                   ")"
                   "\""})


(def coll-names #{"Set"
                  "Map"
                  "List"
                  "Vector"})

(def prefix-names #{"Deref"
                    "Ignored"
                    "Quote"
                    "SyntaxQuote"
                    "Unquote"
                    "UnquoteSplice"
                    "Meta"
                    "NamespacedMap"
                    "RegExp"
                    "Var"
                    "AnonymousFunction"
                    "ReaderConditional"})

(def edges (into left-edges right-edges))

(defn error? [^js node]
  (.prop node lz-tree/NodeProp.error))

(defn ^string name [^js node]
  (if (core/string? node)
    node
    (or (.-name node)
        (.. node -type -name))))

(def left-edge? (comp boolean left-edges name))
(def right-edge? (comp boolean right-edges name))
(def edge? (comp boolean edges name))

(def opening-bracket? (comp boolean left-edges name))
(def closing-bracket? (comp boolean right-edges name))

(defn type [^js node]
  (cond-> node
    (not (instance? lezer/NodeType node))
    .-type))


(defn coll-name? [type-name]
  (contains? coll-names type-name))

(defn coll? [node]
  (or
   (coll-name? (name node))
   (some-> (.-firstChild node) name prefix-edges)))

(defn terminal-type? [node]
  (let [n (name node)]
    (cond (identical? n "Program") false
          (coll-name? n) false
          (prefix-names n) false
          :else true)))

(defn top? [node] (nil? (.-parent node)))

(defn string? [node] (identical? "String" (name node)))
(defn regexp? [node] (identical? "RegExp" (name node)))
(defn line-comment? [node] (identical? "LineComment" (name node)))
(defn discard? [node] (identical? "Discard" (name node)))

(j/defn balanced? [^:js {:as node :keys [^js firstChild ^js lastChild]}]
  (if-let [closing (bracket-pair (name firstChild))]
    (and (= closing (name lastChild))
         (not= (end firstChild) (end lastChild)))
    true))

(defn prefix-parent? [type-name]
  (contains? prefix-names type-name))

(defn ancestors [^js node]
  (when-some [parent (.-parent node)]
    (cons parent
          (lazy-seq (ancestors parent)))))

(defn closest [node pred]
  (if (pred node)
    node
    (reduce (fn [_ x] (if (pred x) (reduced x) nil)) nil (ancestors node))))

(defn children
  ([^js parent from dir]
   (when-some [child (case dir 1 (.childAfter parent from)
                               -1 (.childBefore parent from))]
     (cons child (lazy-seq
                  (children parent (case dir 1 (end child)
                                             -1 (start child)) dir)))))
  ([^js subtree]
   (children subtree (start subtree) 1)))

(defn empty?
  "Node only contains whitespace"
  [^js node]
  (let [type-name (name node)]
    (cond (coll? type-name) (== 2 (count (children node)))
          (string? type-name) (== (.. node -firstChild -end) (.. node -lastChild -start))
          :else false)))

(defn from-to [^js node]
  (u/from-to (start node) (end node)))

(defn range [^js node]
  (sel/range (.-start node) (.-end node)))

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

(defn terminal-nodes [^js node from to]
  (let [found (atom [])]
    (.iterate node #js{:from from
                       :to to
                       :enter (fn [type start end]
                                (if (and (terminal-type? type)
                                         (not (error? type)))
                                  (do (swap! found conj #js[(name type) start end])
                                      false)
                                  js/undefined))})
    @found))



(defn iterate-some [f x]
  (take-while identity (iterate f x)))

(defn direction [from to]
  (let [cmp (compare (start to) (start from))]
    (if (zero? cmp)
      (cond (ancestor? to from) -1
            (ancestor? from to) 1
            (eq? from to) 0)
      cmp)))

(defn prefer [preference [L C R]]
  (case preference
    :left (or L C)
    :right (or R C)))

(defn move-toward
  "Returns next loc moving toward `to-path`, skipping children"
  [node to-node]
  (when-not (eq? node to-node)
    (case (compare (start to-node) (start node))
      0 (cond (ancestor? to-node node) (up node)
              (ancestor? node to-node) (down node))
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

(j/defn balanced-range
  ([state ^js node] (balanced-range state (.-start node) (.-end node)))
  ([state from to]
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
                           (map #(cond-> % (edges (name %)) up))
                           (reduce (fn [[left right] ^js node-between]
                                     [(if (ancestor? node-between from-node) (start node-between) left)
                                      (if (ancestor? node-between to-node) (end node-between) right)])
                                   [from to]))]
     (sel/range left right))))

(j/defn inner-span
  "Span of collection not including edges"
  [^:js {:as node :keys [start end ^js firstChild ^js lastChild]}]
  #js{:start (if (left-edge? firstChild)
               (.-end firstChild)
               start)
      :end (if (right-edge? lastChild)
             (.-start lastChild)
             end)})

(defn within?< "within (exclusive of edges)"
  [^js parent ^js child]
  (let [c1 (compare (.-start parent) (.-start child))
        c2 (compare (.-end parent) (.-end child))]
    (and (or (pos? c1) (neg? c2))
         (not (neg? c1))
         (not (pos? c2)))))

(defn within? "within (inclusive of edges)"
  [^js parent ^js child]
  (and (not (neg? (compare (.-start parent) (.-start child))))
       (not (pos? (compare (.-end parent) (.-end child))))))

(defn follow-edges [node]
  (if (edges (name node))
    (up node)
    node))

(defn prefix [node]
  (some-> (up node) down name (u/guard prefix-edges)))

(defn left-edge-with-prefix [node]
  (str (prefix node) (name (down node))))

(defn with-prefix [node]
  (cond-> node
    (prefix node) up))
