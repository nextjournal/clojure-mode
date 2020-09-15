(ns codemirror-next.clojure.node
  (:refer-clojure :exclude [coll? ancestors string? empty? regexp? name range resolve])
  (:require ["lezer-tree" :as lz-tree]
            ["lezer" :as lezer]
            [clojure.core :as core]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.selections :as sel]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Node props are marked in the grammar and distinguish categories of nodes

;; primitive collection
(defonce coll-prop (.flag lz-tree/NodeProp))
;; prefix collection - a prefix token that wraps the next element
(defonce prefix-coll-prop (.flag lz-tree/NodeProp))
;; the prefix edge itself
(defonce prefix-edge-prop (.flag lz-tree/NodeProp))
;; edges at the beginning/end of collections, + "same" edges (string quotes)
(defonce start-edge-prop (.-closedBy lz-tree/NodeProp))
(defonce end-edge-prop (.-openedBy lz-tree/NodeProp))
(defonce same-edge-prop (.flag lz-tree/NodeProp))

;; used when instantiating the parser
(defn node-prop [prop-name]
  (case prop-name "prefixColl" prefix-coll-prop
                  "coll" coll-prop
                  "prefixEdge" prefix-edge-prop
                  "sameEdge" same-edge-prop))

;; these wrapping functions exist mainly to avoid type hints
;; & are mostly compiled away
(defn ^number start [^js node] (.-start node))
(defn ^number end [^js node] (.-end node))
(defn ^number depth [^js node] (.-depth node))

;; a more zipper-like interface
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

;; category predicates

(defn coll-type? [^js node-type]
  (or (.prop node-type coll-prop) (.prop node-type prefix-coll-prop)))

(defn ^boolean prefix-type? [node-type] (.prop ^js node-type prefix-coll-prop))
(defn ^boolean prefix-edge-type? [node-type] (.prop ^js node-type prefix-edge-prop))
(defn ^boolean same-edge-type? [node-type] (.prop ^js node-type same-edge-prop))
(defn ^boolean start-edge-type? [node-type] (.prop ^js node-type start-edge-prop))
(defn ^boolean end-edge-type? [node-type] (.prop ^js node-type end-edge-prop))

(defn ^boolean prefix? [n] (prefix-type? (.-type ^js n)))
(defn ^boolean prefix-edge? [n] (prefix-edge-type? (.-type ^js n)))
(defn ^boolean same-edge? [n] (same-edge-type? (.-type ^js n)))
(defn ^boolean start-edge? [n] (start-edge-type? (.-type ^js n)))
(defn ^boolean end-edge? [n] (end-edge-type? (.-type ^js n)))

(defn ^boolean left-edge-type? [^js t]
  (or (start-edge-type? t)
      (same-edge-type? t)
      (prefix-edge-type? t)))

(defn ^boolean left-edge? [n]
  (left-edge-type? (.-type ^js n)))

(defn ^boolean right-edge-type? [^js t]
  (or (end-edge-type? t)
      (same-edge-type? t)))

(defn ^boolean right-edge? [^js n]
  (right-edge-type? (.-type n)))

(defn ^boolean edge? [n]
  (let [t (.-type ^js n)]
    (or (start-edge-type? t)
        (end-edge-type? t)
        (same-edge-type? t)
        (prefix-type? t))))

(defn closed-by [n]
  (some-> (.prop (.-type n) (.-closedBy lz-tree/NodeProp))
          (aget 0)))

(defn ^string name [^js node] (.-name node))

;; specific node types

(defn error? [^js node] (.prop node lz-tree/NodeProp.error))
(defn top? [node] (.. node -type (prop (.-top lz-tree/NodeProp))))
(defn string? [node] (identical? "String" (name node)))
(defn regexp? [node] (identical? "RegExp" (name node)))
(defn line-comment? [node] (identical? "LineComment" (name node)))
(defn discard? [node] (identical? "Discard" (name node)))

(defn coll? [node]
  (coll-type? (.-type ^js node)))

(defn terminal-type? [^js node-type]
  (cond (.prop node-type (.-top lz-tree/NodeProp)) false
        (.prop node-type prefix-coll-prop) false
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
                           (map #(cond-> % (edge? %) up))
                           (reduce (fn [[left right] ^js node-between]
                                     [(if (ancestor? node-between from-node) (start node-between) left)
                                      (if (ancestor? node-between to-node) (end node-between) right)])
                                   [from to]))]
     (sel/range left right))))

(j/defn inner-span
  "Span of collection not including edges"
  [^:js {:as node :keys [firstChild lastChild]}]
  #js{:start (if (left-edge? firstChild)
               (end firstChild)
               (start node))
      :end (if (right-edge? lastChild)
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
  (if (edge? node)
    (up node)
    node))

(defn prefix [node]
  (some-> (up node) down (u/guard prefix-edge?) name))

(defn left-edge-with-prefix [node]
  (str (prefix node) (name (down node))))

(defn with-prefix [node]
  (cond-> node
    (prefix node) up))
