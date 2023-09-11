(ns nextjournal.clojure-mode.util
  (:require [applied-science.js-interop :as j]
            ["@codemirror/state" :refer [EditorSelection
                                         ChangeSet
                                         ChangeDesc
                                         TransactionSpec
                                         StrictTransactionSpec
                                         StateEffect
                                         Transaction]]
            [nextjournal.clojure-mode.selections :as sel]))

(goog-define node-js? false)

(defn user-event-annotation [event-name]
  (.. Transaction -userEvent (of event-name)))

(defn get-user-event-annotation [tr]
  (.annotation ^Transaction tr (.-userEvent Transaction)))

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
  ([from s] (insertion from from s))
  ([from to ^string s]
   {:changes {:insert s
              :from   from
              :to     to}
    :cursor  (+ from (count s))}))

(defn deletion
  ([from] (deletion (max 0 (dec from)) from))
  ([from to]
   (let [from (if (= from to)
                (max 0 (dec from))
                from)]
     {:cursor  from
      :changes {:from from :to to}})))

(defn line-content-at [state from]
  (-> state
      (j/call-in [:doc :lineAt] from)
      (j/call :slice)))

(defn map-cursor [^js original-range ^js state update-map]
  {:pre [(map? update-map)]}
  (let [{:keys [cursor/mapped
                cursor
                from-to
                range
                changes]} (guard update-map map?)
        change-desc (when changes (.changes state (clj->js changes)))]
    (js/console.log "map-cursor range" range)
    (js/console.log "mapped?" mapped)
    (js/console.log "curos?" cursor)
    (cond-> #js{:range (or range
                           (cond mapped (sel/cursor (.mapPos change-desc mapped))
                                 cursor (sel/cursor cursor)
                                 from-to (sel/range (from-to 0) (from-to 1)))
                           original-range)}
      change-desc (j/!set :changes change-desc))))

(defn update-ranges
  "Applies `f` to each range in `state` (see `changeByRange`)"
  ([state f]
   (update-ranges state nil f))
  ([^js state tr-specs f ]
   (->> (fn [range]
          (js/console.log "range" range)
          (or (when-some [result (f range)]
                (doto (map-cursor range state result)
                  (->> (js/console.log "mapped"))))
              #js{:range range}))
        (.changeByRange state)
        (#(j/extend! % tr-specs))
        (.update state))))

(defn dispatch-changes [^js state dispatch ^js changes]
  (when-not (.-empty changes)
    (dispatch (.update state #js{:changes changes}))))

(defn update-lines
  [^js state f & [{:keys [from to spec]
                   :or {from 0}}]]
  (let [iterator (.. state -doc iter)]
    (loop [result (.next iterator)
           changes #js[]
           from-pos from
           line-num 1]
      (j/let [^:js {:keys [done lineBreak ^string value]} result]
        (if (or done
                (> from to))
          (.update state (j/extend! #js{:changes (.changes state changes)} spec))
          (recur (.next iterator)
                 (if-let [change (and (not lineBreak) (f from-pos value line-num))]
                   (j/push! changes change)
                   changes)
                 (+ from-pos (count value))
                 (cond-> line-num lineBreak inc)))))))

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
         (.changeByRange state))))


(j/defn iter-changed-lines
  "`f` will be called for each changed line with args [line, changes-array]
   and should *mutate* changes-array. Selections will be mapped through the resulting changeset."
  [^:js {:as tr
         :keys [^js changes ^js effects selection]
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
    (if (seq next-changes)
      (-> (j/select-keys tr [:annotations
                             :scrollIntoView
                             :reconfigure])
          (j/assoc! :changes (.compose changes next-changeset))
          (cond->
            selection
            (j/assoc! :selection (.. state -selection (map next-changeset)))
            effects
            (j/assoc! :effects (.mapEffects StateEffect effects next-changeset))))
      tr)))

(j/defn something-selected? [^:js {{:keys [ranges]} :selection}]
  (not (every? #(.-empty ^js %) ranges)))

(j/defn range-str [state ^:js {:as selection :keys [from to]}]
  (str (j/call-in state [:doc :slice] from to)))
