(ns codemirror-next.clojure.util
  (:require [applied-science.js-interop :as j]
            ["@codemirror/next/state" :refer [EditorSelection ChangeSet ChangeDesc TransactionSpec StrictTransactionSpec]]
            [codemirror-next.clojure.selections :as sel]))

(defn guard [x f] (when (f x) x))

(defn ^js from-to [p1 p2]
  (if (> p1 p2) #js{:from p2 :to p1} #js{:from p1 :to p2}))

(defn dispatch-some
  "If passed a transaction, dispatch to view and return true to stop processing commands."
  [^js view tr]
  (if (some? tr)
    (do (.dispatch view tr)
        true)
    false))

(defn map-cursor [^js state update-map]
  (if-let [pos (when (map? update-map) (:map-cursor update-map))]
    (let [^js changes (.changes state (clj->js (:changes update-map)))]
      #js{:range (sel/cursor (.mapPos changes pos))
          :changes changes})
    (clj->js update-map)))

(defn update-ranges
  "Applies `f` to each range in `state` (see `changeByRange`)"
  [^js state f]
  (->> (fn [range]
         (or (map-cursor state (f range))
             #js{:range range}))
       (.changeByRange state)
       (.update state)))

(defn dispatch-changes [^js state dispatch ^js changes]
  (when-not (.-empty changes)
    (dispatch (.update state #js{:changes changes}))))

(defn update-lines
  [^js state f & [{:keys [from to]
                   :or {from 0}}]]
  (let [iterator (.. state -doc (iterLines 0))]
    (loop [result (.next iterator)
           changes #js[]
           from-pos from
           line-num 1]
      (j/let [^:js {:keys [done ^string value]} result]
        (if (or done
                (> from to))
          (.update state #js{:changes (.changes state changes)})
          (recur (.next iterator)
                 (if-let [change (f from-pos value line-num)]
                   (j/push! changes change)
                   changes)
                 (+ from-pos 1 (count value))
                 (inc line-num)))))))

(defn update-selected-lines
  "`f` will be called for each selected line with args [line, changes-array, range]
   and should *mutate* changes-array"
  [^js state f]
  (let [at-line (atom -1)
        doc (.-doc state)]
    (->> (j/fn [^:js {:as range :keys [from to anchor head]}]
           (j/let [^:js {:as line line-number :number line-to :to} (.lineAt doc from)
                   changes #js[]]
             (loop [line line]
               (when (> line-number @at-line)
                 (reset! at-line line-number)
                 (f line changes range))
               (if (<= to line-to)
                 (let [^js change-set (.changes state changes)]
                   #js{:changes changes
                       :range (.range EditorSelection
                                      (.mapPos change-set anchor 1)
                                      (.mapPos change-set head 1))})
                 (recur (.lineAt doc (inc line-to)))))))
         (.changeByRange state)
         (.update state))))

(j/defn update-changed-lines
  "`f` will be called for each selected line with args [line, changes-array, range]
   and should *mutate* changes-array"
  [^:js {:as tr
         :keys [startState changes]
         {:as state :keys [doc]} :state} f]
  (let [at-line (atom -1)
        next-changes #js[]
        _ (.iterChanges
           changes
           (fn [from-a to-a from-b to-b inserted]
             (j/let [^:js {:as line line-number :number line-to :to} (.lineAt doc from-b)]
               (loop [line line]
                 (when (> line-number @at-line)
                   (reset! at-line line-number)
                   (f line next-changes))
                 (when-not (<= to-b line-to)
                   (recur (.lineAt doc (inc line-to))))))))
        next-changeset (.changes state next-changes)
        next-selection (.. state -selection (map next-changeset)) ;; map selection through changeset
        combined-changes (.compose changes next-changeset)]
    (.update startState #js{:changes combined-changes
                            :selection next-selection})))

(j/defn something-selected? [^:js {{:keys [ranges]} :selection}]
  (not (every? #(.-empty ^js %) ranges)))
