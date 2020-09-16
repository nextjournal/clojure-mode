(ns codemirror-next.clojure.util
  (:require [applied-science.js-interop :as j]
            ["@codemirror/next/state" :refer [EditorSelection ChangeSet ChangeDesc TransactionSpec StrictTransactionSpec StateEffect]]
            [codemirror-next.clojure.selections :as sel]))

(defn guard [x f] (when (f x) x))

(defn ^js from-to [p1 p2]
  (if (> p1 p2) #js{:from p2 :to p1} #js{:from p1 :to p2}))

(defn dispatch-some
  "If passed a transaction, dispatch to view and return true to stop processing commands."
  [^js view tr]
  (if tr
    (do (.dispatch view tr)
        true)
    false))

(defn insertion
  "Returns a `change` that inserts string `s` at position `from` and moves cursor to end of insertion."
  [from ^string s]
  {:changes {:insert s
             :from from}
   :cursor (+ from (count s))})

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
  ([state f]
   (update-ranges state nil f))
  ([^js state tr-specs f ]
   (->> (fn [range]
          (or (when-some [result (f range)]
                (map-cursor state result))
              #js{:range range}))
        (.changeByRange state)
        (#(j/extend! % tr-specs))
        (.update state))))

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
           (j/let [changes #js[]]
             (loop [^js line (.lineAt doc from)]
               (j/let [^:js {line-number :number line-to :to} line]
                 (when (> (.-number line) @at-line)
                   (reset! at-line line-number)
                   (f line changes range))
                 (if-let [next-line (and (> to line-to)
                                         (guard (.lineAt doc (inc line-to))
                                                #(> (.-number ^js %) line-number)))]
                   (recur next-line)
                   (let [^js change-set (.changes state changes)]
                     #js{:changes changes
                         :range (.range EditorSelection
                                        (.mapPos change-set anchor 1)
                                        (.mapPos change-set head 1))}))))))
         (.changeByRange state)
         (.update state))))


(j/defn iter-changed-lines
  "`f` will be called for each changed line with args [line, changes-array]
   and should *mutate* changes-array. Selections will be mapped through the resulting changeset."
  [^:js {:as tr
         :keys [^js changes ^js effects annotations scrollIntoView reconfigure]
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
        next-changeset (.changes state next-changes)]
    #js{:changes (.compose changes next-changeset)
        :selection (.. state -selection (map next-changeset))
        :effects (.mapEffects StateEffect effects next-changeset)
        :annotations annotations
        :scrollIntoView scrollIntoView
        :reconfigure reconfigure}))

(j/defn something-selected? [^:js {{:keys [ranges]} :selection}]
  (not (every? #(.-empty ^js %) ranges)))
