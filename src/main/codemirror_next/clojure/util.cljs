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
  {:pre [(map? update-map)]}
  (let [{:keys [cursor/mapped
                cursor
                from-to
                range
                changes]} (guard update-map map?)
        changes (when changes (.changes state (clj->js changes)))
        range (cond mapped (sel/cursor (.mapPos changes mapped))
                    cursor (sel/cursor cursor)
                    from-to (sel/range (from-to 0) (from-to 1))
                    range range
                    :else js/undefined)]
    (cond-> #js{}
      changes (j/!set :changes changes)
      range (j/!set :range range))))

(defn update-ranges
  "Applies `f` to each range in `state` (see `changeByRange`)"
  [^js state f]
  (->> (fn [range]
         (or (when-some [result (f range)]
               (map-cursor state result))
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


(j/defn iter-changed-lines
  "`f` will be called for each changed line with args [line, changes-array]
   and should *mutate* changes-array. Selections will be mapped through the resulting changeset."
  [^:js {:as tr
         :keys [^js startState ^js changes]
         {:as ^js state :keys [^js doc]} :state} f]
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
                   (let [next-line (.lineAt doc (inc line-to))]
                     (when (and next-line (> (.-number next-line) (.-number line)))
                       (recur next-line))))))))
        next-changeset (.changes state next-changes)
        next-selection (.. state -selection (map next-changeset)) ;; map selection through changeset
        combined-changes (.compose changes next-changeset)]
    #js{:changes combined-changes
        :selection next-selection}))

(j/defn something-selected? [^:js {{:keys [ranges]} :selection}]
  (not (every? #(.-empty ^js %) ranges)))
