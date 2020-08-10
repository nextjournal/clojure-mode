(ns codemirror-next.clojure.extensions.indent
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

(j/defn indent-all [^:js {:keys [^js state dispatch]}]
  (let [updated #js{}
        context (new IndentContext state (fn [start] (j/get updated start -1)))
        get-indentation (fn [^js context pos]
                          (->> (.. context -state (facet (.-indentation EditorState)))
                               (reduce
                                (fn [out f]
                                  (let [v (f context pos)]
                                    (if (> v -1) (reduced v) out)))
                                -1)))]
    (u/update-lines state dispatch
      (fn [from value line-num]
        (let [current-indent (-> (.exec #"^\s*" value)
                                 ^js (aget 0)
                                 .-length)]
          (when-some [^number indent (-> (get-indentation context from)
                                         (u/guard (complement neg?)))]
            (case (compare indent current-indent)
              0 nil
              1 #js{:from (+ from current-indent)
                    :insert (make-spaces (- indent ^number current-indent))}
              -1 #js{:from (+ from indent)
                     :to (+ from current-indent)})))))
    true))

(defn expected-space [n1 n2]
  (cond (n/closing-brackets n2) 0
        (n/brackets n1) 0
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
                                        :to start2 })
                     -1 (j/push! out #js{:from end1
                                         :insert " "})
                     out)))
               #js[])))

(j/defn format-all [^:js {:keys [^js state dispatch]}]
  (let [updated #js{}
        context (new IndentContext state (fn [start] (j/get updated start -1)))
        get-indentation (fn [^js context pos]
                          (->> (.. context -state (facet (.-indentation EditorState)))
                               (reduce
                                (fn [out f]
                                  (let [v (f context pos)]
                                    (if (> v -1) (reduced v) out)))
                                -1)))]
    (u/update-lines state dispatch
      (fn [^number from ^string value line-num]
        (let [current-indent (-> ^js (aget (.exec #"^\s*" value) 0)
                                 .-length)
              indentation-change
              (when-some [^number indent (-> (get-indentation context from)
                                             (u/guard (complement neg?)))]
                (case (compare indent current-indent)
                  0 nil
                  1 #js{:from (+ from current-indent)
                        :insert (make-spaces (- indent current-indent))}
                  -1 #js{:from (+ from indent)
                         :to (+ from current-indent)}))
              space-changes (space-changes state
                                           (+ from current-indent)
                                           (+ from (count value)))]
          (prn :space-changes space-changes)
          (cond-> (or space-changes #js[])
            indentation-change (j/push! indentation-change)))))
    true))

(j/defn indent [^:js {:as arg :keys [^js state dispatch]}]
  (if (u/something-selected? state)
    (commands/indentSelection arg)
    (format-all arg)))

(j/defn prefix-all [prefix ^:js {:keys [^js state dispatch]}]
  (u/update-lines state dispatch
    (fn [from _ _] #js{:from from :insert prefix})))

(def extension-after-keyup
  ;; TODO
  ;; a better way to auto-indent after other operations are finished
  (.domEventHandlers view/EditorView
                     #js{:keyup
                         (j/fn [_ ^:js {:as ^js view :keys [state]}]
                           (indent #js{:state state
                                       :dispatch #(.dispatch view %)})
                           nil)}))

