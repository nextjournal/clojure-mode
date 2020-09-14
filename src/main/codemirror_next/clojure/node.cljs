(ns codemirror-next.clojure.node
  (:refer-clojure :exclude [coll? ancestors string? empty? regexp? name range resolve])
  (:require ["lezer-tree" :as lz-tree]
            ["lezer" :as lezer]
            [clojure.core :as core]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.selections :as sel]))

(defonce coll-prop (.flag lz-tree/NodeProp))
(defonce prefix-prop (.flag lz-tree/NodeProp))
(defonce end-edge-prop (.flag lz-tree/NodeProp))
(defonce start-edge-prop (.flag lz-tree/NodeProp))
(defonce prefix-edge-prop (.flag lz-tree/NodeProp))
(defonce same-edge-prop (.flag lz-tree/NodeProp))

(defn node-prop [prop-name]
  (case prop-name "prefix" prefix-prop
                  "coll" coll-prop
                  "startEdge" start-edge-prop
                  "endEdge" end-edge-prop
                  "prefixEdge" prefix-edge-prop
                  "sameEdge" same-edge-prop))

(defn prop [^js node prop]
  {:pre [(instance? lz-tree/Subtree node)]}
  (.. node -type (prop prop)))


(defn ^number start [^js node] (.-start node))
(defn ^number end [^js node] (.-end node))
(defn ^number depth [^js node] (.-depth node))

(defn ^js up [node] (.-parent ^js node))
(defn ^js down [node] (.-firstChild ^js node))
(defn ^js down-last [node] (.-lastChild ^js node))
(defn ^js left [^js node] (.childBefore (up node) (start node)))

(defn lefts [node]
  (take-while identity (iterate left (left node))))

(defn ^js right [node]
  (.childAfter (up node) (end node)))

(defn rights [node]
  (take-while identity (iterate right (right node))))

(defn prefix-node? [n] (prop n prefix-prop))
(defn prefix-edge-node? [n] (prop n prefix-edge-prop))
(defn same-edge-node? [n] (prop n same-edge-prop))
(defn start-edge-node? [n] (prop n start-edge-prop))
(defn end-edge-node? [n] (prop n end-edge-prop))

(defn closed-by [n] (some-> (prop n (.-closedBy lz-tree/NodeProp)) (aget 0)))

(defn left-edge-node? [n]
  (or (start-edge-node? n)
      (same-edge-node? n)
      (prefix-node? n)))

(defn right-edge-node? [n]
  (or (end-edge-node? n)
      (same-edge-node? n)))

(defn edge-node? [n]
  (or (start-edge-node? n)
      (end-edge-node? n)
      (same-edge-node? n)
      (prefix-node? n)))

;; specific node types

(defn error? [^js node] (.prop node lz-tree/NodeProp.error))
(defn top? [node] (prop node (.-top lz-tree/NodeProp)))
(defn string? [node] (identical? "String" (name node)))
(defn regexp? [node] (identical? "RegExp" (name node)))
(defn line-comment? [node] (identical? "LineComment" (name node)))
(defn discard? [node] (identical? "Discard" (name node)))

(defn ^string name [^js node] (.-name node))

(defn coll? [node]
  (or (prop node coll-prop)
      (prop node prefix-prop)))

(defn terminal-type? [^js node-type]
  (cond (.prop node-type (.-top lz-tree/NodeProp)) false
        (.prop node-type prefix-prop) false
        (.prop node-type coll-prop) false
        :else true))

(j/defn balanced? [^:js {:as node :keys [^js firstChild ^js lastChild]}]
  (if-let [closing (closed-by firstChild)]
    (do
      (and (= closing (name lastChild))
           (not= (end firstChild) (end lastChild))))
    true))

(defn ancestors [^js node]
  (when-some [parent (up node)]
    (cons parent
          (lazy-seq (ancestors parent)))))

(defn ^js closest [node pred]
  (if (pred node)
    node
    (reduce (fn [_ x] (if (pred x) (reduced x) nil)) nil (ancestors node))))

(defn children
  ([^js parent from dir]
   (when-some [^js child (case dir 1 (.childAfter parent from)
                                   -1 (.childBefore parent from))]
     (cons child (lazy-seq
                  (children parent (case dir 1 (end child)
                                             -1 (start child)) dir)))))
  ([^js subtree]
   (children subtree (start subtree) 1)))

(defn eq? [^js x ^js y]
  (and (== (start x) (start y))
       (== (end x) (end y))
       (== (depth x) (depth y))))

(defn empty?
  "Node only contains whitespace"
  [^js node]
  (let [type-name (name node)]
    (cond (coll? node)
          (eq? (-> node down right) (-> node down-last))

          (= "String" type-name)
          (== (-> node down end) (-> node down-last start))
          :else false)))

(defn from-to [node]
  {:from (start node) :to (end node)})

(defn range [node]
  (sel/range (start node) (end node)))

(defn string [^js state node]
  (.slice (.-doc state) (start node) (end node)))

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
                                  (do (swap! found conj #js[type start end])
                                      false)
                                  js/undefined))})
    @found))

(defn move-toward
  "Returns next loc moving toward `to-path`, skipping children"
  [node to-node]
  (when-not (eq? node to-node)
    (case (compare (start to-node) (start node))
      0 (cond (ancestor? to-node node) (up node)
              (ancestor? node to-node) (down node))
      -1 (if (ancestor? node to-node)
           (down-last node)
           (or (left node)
               (up node)))
      1 (if (ancestor? node to-node)
          (down node)
          (or (right node)
              (up node))))))

(defn nodes-between [node to-node]
  (take-while identity (iterate #(move-toward % to-node) node)))

(defn- require-balance? [node]
  (or (coll? node)
      (string? node)
      (regexp? node)))

(defn ^js tree
  ([^js state] (.. state -tree))
  ([^js state pos] (.. state -tree (resolve pos)))
  ([^js state pos dir] (.. state -tree (resolve pos dir))))

(j/defn balanced-range
  ([state ^js node] (balanced-range state (start node) (end node)))
  ([state from to]
   (let [[from to] (sort [from to])
         from-node (tree state from 1)
         to-node (tree state to -1)
         from (if (require-balance? from-node)
                (start from-node)
                from)
         to (if (require-balance? to-node)
              (end to-node)
              to)
         [left right] (->> (nodes-between from-node to-node)
                           (map #(cond-> % (edge-node? %) up))
                           (reduce (fn [[left right] ^js node-between]
                                     [(if (ancestor? node-between from-node) (start node-between) left)
                                      (if (ancestor? node-between to-node) (end node-between) right)])
                                   [from to]))]
     (sel/range left right))))

(j/defn inner-span
  "Span of collection not including edges"
  [^:js {:as node :keys [firstChild lastChild]}]
  #js{:start (if (left-edge-node? firstChild)
               (end firstChild)
               (start node))
      :end (if (right-edge-node? lastChild)
             (start lastChild)
             (end node))})

(defn within?< "within (exclusive of edges)"
  [parent child]
  (let [c1 (compare (start parent) (start child))
        c2 (compare (end parent) (end child))]
    (and (or (pos? c1) (neg? c2))
         (not (neg? c1))
         (not (pos? c2)))))

(defn within? "within (inclusive of edges)"
  [parent child]
  (and (not (neg? (compare (start parent) (start child))))
       (not (pos? (compare (end parent) (end child))))))

(defn follow-edges [node]
  (if (edge-node? node)
    (up node)
    node))

(defn prefix [node]
  (some-> (up node) down (u/guard prefix-edge-node?) name ))

(defn left-edge-with-prefix [node]
  (str (prefix node) (name (down node))))

(defn with-prefix [node]
  (cond-> node
    (prefix node) up))
