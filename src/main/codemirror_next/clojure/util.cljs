(ns codemirror-next.clojure.util
  (:require [applied-science.js-interop :as j]
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
  (.update state (.changeByRange state
                                 (fn [range]
                                   (or (map-cursor state (f range))
                                       #js{:range range}))) #js{:scrollIntoView true}))

(defn update-lines
  [^js state dispatch f & [{:keys [from to]
                            :or {from 0}}]]
  (let [iterator (.. state -doc (iterLines 0))]
    (loop [result (.next iterator)
           changes #js[]
           from-pos from
           line-num 1]
      (j/let [^:js {:keys [done ^string value]} result]
        (if (or done
                (> from to))
          (dispatch (.update state #js{:changes (.changes state changes)}))
          (recur (.next iterator)
                 (if-let [change (f from-pos value line-num)]
                   (j/push! changes change)
                   changes)
                 (+ from-pos 1 (count value))
                 (inc line-num)))))))

(j/defn something-selected? [^:js {{:keys [ranges]} :selection}]
  (not (every? #(.-empty ^js %) ranges)))
