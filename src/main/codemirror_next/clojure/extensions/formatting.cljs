(ns codemirror-next.clojure.extensions.formatting
  (:require ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/state" :refer [EditorState IndentContext]]
            ["@codemirror/next/view" :as view]
            ["@codemirror/next/commands" :as commands]
            [codemirror-next.clojure.node :as node]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.node :as n]))

;; CodeMirror references
;; IndentContext https://codemirror.net/6/docs/ref/#state.IndentContext
;; indentation facet: https://codemirror.net/6/docs/ref/#state.EditorState%5Eindentation
;; indentation commands: https://codemirror.net/6/docs/ref/#commands.indentSelection

;; Clojure formatting reference
;; https://tonsky.me/blog/clojurefmt/

(j/defn indent-node-props [^:js {type-name :name :as type}]
  (j/fn [^:js {:as ^js context :keys [pos unit node ^js state]}]
    (cond (= "Program" type-name)
          0

          (node/coll? type-name)
          (let [left-bracket-end (.. node -firstChild -end)]
            (cond-> (.column context left-bracket-end)
              ;; start at the inner-left edge of the coll.
              ;; if it's a list beginning with a symbol, add 1 space.
              (and (= "List" (node/name node))
                   (= "Operator" (some-> node
                                         (.childAfter (.-end (.-firstChild node)))
                                         node/name)))
              (+ 1)))
          :else -1)))

(def props (.add syntax/indentNodeProp
                 indent-node-props))

(defn make-spaces [n]
  (loop [^string s ""
         i 0]
    (if (== i n)
      s
      (recur (str s " ")
             (inc i)))))

(defn get-indentation [^js context pos]
  (->> (.. context -state (facet (.-indentation EditorState)))
       (reduce
        (fn [out f]
          (let [v (f context pos)]
            (if (> v -1) (reduced v) out)))
        -1)))

(defn make-indent-context [state]
  (let [updated #js{}]
    (new IndentContext state (fn [start] (j/get updated start -1)))))

(defn indent-all [state]
  (let [context (make-indent-context state)]
    (u/update-lines state
      (fn [from content line-num]
        (let [current-indent (-> (.exec #"^\s*" content)
                                 ^js (aget 0)
                                 .-length)]
          (when-some [^number indent (-> (get-indentation context from)
                                         (u/guard (complement neg?)))]
            (case (compare indent current-indent)
              0 nil
              1 #js{:from (+ from current-indent)
                    :insert (make-spaces (- indent ^number current-indent))}
              -1 #js{:from (+ from indent)
                     :to (+ from current-indent)})))))))

(defn expected-space [n1 n2]
  (cond (n/right-edges n2) 0
        (n/left-edges n1) 0
        (identical? n1 "KeywordPrefix") 0
        :else 1))

(defn space-changes [state from to]
  (->> (n/terminal-nodes (.-tree state) to from)
       (partition 2 1)
       (reduce (j/fn [out [^:js [n2 start2 end2]
                           ^:js [n1 start1 end1]]]
                 (let [expected (expected-space n1 n2)
                       actual (- start2 end1)]
                   (case (compare actual expected)
                     0 out
                     1 (j/push! out #js{:from (if (zero? expected)
                                                end1
                                                (inc end1))
                                        :to start2})
                     -1 (j/push! out #js{:from end1
                                         :insert " "})
                     out)))
               #js[])))

(defn into-arr [^js arr items]
  (doseq [i items] (.push arr i))
  arr)

(defn format-line
  "Returns mutated `changes` array"
  [state
   indent-context
   from
   content
   line-num
   changes]
  {:pre [(some? content)]}
  (let [current-indent (-> ^js (aget (.exec #"^\s*" content) 0)
                           .-length)
        indentation-change
        (when-some [^number indent (-> (get-indentation indent-context from)
                                       (u/guard (complement neg?)))]
          (case (compare indent current-indent)
            0 nil
            1 #js{:from (+ from current-indent)
                  :insert (make-spaces (- indent current-indent))}
            -1 #js{:from (+ from indent)
                   :to (+ from current-indent)}))
        space-changes (space-changes state
                                     (+ from current-indent)
                                     (+ from (count content)))]
    (cond-> changes
      space-changes (into-arr space-changes)
      indentation-change (j/push! indentation-change))))


(defn format-selection [state]
  (let [context (make-indent-context state)]
    (u/update-selected-lines state
      (j/fn [^:js {:as line :keys [from content number]} ^js changes ^js range]
        (format-line state context from content number changes)))))

(defn format-all [state]
  (let [context (make-indent-context state)]
    (u/update-lines state
      (fn [^number from ^string content line-num]
        (format-line state context from content line-num #js[])))))

(defn format-transaction [^js tr]
  (let [state (.-state tr)
        context (make-indent-context state)
        formatted-tr (u/update-changed-lines tr
                       (fn [^js line ^js changes]
                         (format-line state context (.-from line) (.-content line) (.-number line) changes)))]
    formatted-tr))

(defn format [state]
  (if (u/something-selected? state)
    (format-selection state)
    (format-all state)))

(defn prefix-all [prefix state]
  (u/update-lines state
    (fn [from _ _] #js{:from from :insert prefix})))

(def extension-after-keyup
  ;; TODO
  ;; a better way to auto-indent after other operations are finished
  (.domEventHandlers view/EditorView
                     #js{:keyup
                         (j/fn [_ ^:js {:as ^js view :keys [state]}]
                           (format #js{:state state
                                       :dispatch #(.dispatch view %)})
                           nil)}))

