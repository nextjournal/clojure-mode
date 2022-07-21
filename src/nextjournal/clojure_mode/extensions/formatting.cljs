(ns nextjournal.clojure-mode.extensions.formatting
  (:require ["@codemirror/language" :as language :refer [IndentContext]]
            ["@codemirror/state" :refer [EditorState Transaction]]
            ["@codemirror/view" :as view]
            ["@codemirror/commands" :as commands]
            [applied-science.js-interop :as j]
            [nextjournal.clojure-mode.util :as u]
            [nextjournal.clojure-mode.node :as n]))

;; CodeMirror references
;; IndentContext https://codemirror.net/6/docs/ref/#state.IndentContext
;; indentation facet: https://codemirror.net/6/docs/ref/#state.EditorState%5Eindentation
;; indentation commands: https://codemirror.net/6/docs/ref/#commands.indentSelection

;; Clojure formatting reference
;; https://tonsky.me/blog/clojurefmt/

(defn spaces [^js state n]
  (.indentString language state n))

(j/defn indent-node-props [^:js {type-name :name :as type}]
  (j/fn [^:js {:as ^js context :keys [pos unit node ^js state]}]
    (cond (= "Program" type-name)
          0

          (n/coll-type? type)
          (cond-> (.column context
                           (-> node n/down n/end))
            ;; start at the inner-left edge of the coll.
            ;; if it's a list beginning with a symbol, add 1 space.
            (and (= "List" type-name)
                 (#{"Operator"
                    "DefLike"
                    "NS"} (some-> node n/down n/right n/name)))
            (+ 1))
          :else -1)))

(def props (.add language/indentNodeProp
                 indent-node-props))

(defn get-indentation [^js context pos]
  (language/getIndentation (.-state context) pos))

(defn make-indent-context [state]
  (new IndentContext state))

;; TODO: check if this is used at all
(defn indent-all [^js state]
  (let [context (make-indent-context state)]
    (u/update-lines state
                    (fn [from content line-num]
                      (let [current-indent (-> (.exec #"^\s*" content)
                                               ^js (aget 0)
                                               .-length)
                            ^number indent (-> (get-indentation context from)
                                               (u/guard (complement neg?)))]
                        (when indent
                          (case (compare indent current-indent)
                            0 nil
                            1 #js{:from (+ from current-indent)
                                  :insert (spaces state (- indent ^number current-indent))}
                            -1 #js{:from (+ from indent)
                                   :to (+ from current-indent)})))))))

(defn expected-space [n1 n2]
  ;;  (prn :expected (map n/name [n1 n2]))
  (if
   (or
    (n/start-edge-type? n1)
    (n/prefix-edge-type? n1)
    (n/end-edge-type? n2)
    (n/same-edge-type? n2))
    0
    1))

(defn space-changes [state from to]
  (let [nodes (->> (n/terminal-nodes (n/tree state) from to)
                   (filter #(or (<= from (n/start %) to)
                                (<= from (n/end %) to)))
                   (reverse))
        trim? (some-> (first nodes) n/end (< to))]
    (->> nodes
         (partition 2 1)
         (reduce (j/fn [out [^:js {n2 :type start2 :from end2 :to}
                             ^:js {n1 :type start1 :from end1 :to}]]
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

                 (if trim?
                   (j/lit [{:from (-> nodes first n/end)
                            :to to}])
                   #js[])))))

(defn into-arr [^js arr items]
  (doseq [i items] (.push arr i))
  arr)

(defn format-line
  "Returns mutated `changes` array"
  [^js state
   indent-context
   from
   text
   line-num
   changes
   format-spaces?]
  {:pre [(some? text)]}
  (let [current-indent (-> ^js (aget (.exec #"^\s*" text) 0)
                           .-length)
        ^number indent (-> (get-indentation indent-context from)
                           (u/guard (complement neg?)))
        indentation-change
        (when indent
          (case (compare indent current-indent)
            0 nil
            1 #js{:from (+ from current-indent)
                  :insert (spaces state (- indent current-indent))}
            -1 #js{:from (+ from indent)
                   :to (+ from current-indent)}))
        space-changes (when (and format-spaces? (n/within-program? state from))
                        (space-changes state
                                       (+ from current-indent)
                                       (+ from (count text))))]
    (cond-> changes
      space-changes (into-arr space-changes)
      indentation-change (j/push! indentation-change))))

(defn format-selection
  [^js state]
  (let [context (make-indent-context state)]
    (u/update-selected-lines state
                             (j/fn [^:js {:as line :keys [from text number]} ^js changes ^js range]
                               (format-line state context from text number changes true)))))

(defn format-all [state]
  (let [context (make-indent-context state)]
    (u/update-lines state
                    (fn [^number from ^string text line-num]
                      (format-line state context from text line-num #js[] true)))))

(defn format-transaction [^js tr]
  (let [origin (u/get-user-event-annotation tr)]
    (if-some [changes
              (when (n/within-program? (.-startState tr))
                (case origin
                  ("input" "input.type"
                   "delete"
                   "keyboardselection"
                   "pointerselection" "select.pointer"
                   "cut"
                   "noformat"
                   "evalregion") nil
                  "format-selections" (format-selection (.-state tr))
                  (let [state (.-state tr)
                        context (make-indent-context state)]
                    (u/iter-changed-lines tr
                                          (fn [^js line ^js changes]
                                            (format-line state context (.-from line) (.-text line) (.-number line) changes true))))))]
      (.. tr -startState (update (j/assoc! changes :filter false)))
      tr)))

(defn format [state]
  (if (u/something-selected? state)
    (.update state (format-selection state))
    (format-all state)))

(defn prefix-all [prefix state]
  (u/update-lines state
    (fn [from _ _] #js{:from from :insert prefix})))

(defn ext-format-changed-lines [] (.. EditorState -transactionFilter (of format-transaction)))
