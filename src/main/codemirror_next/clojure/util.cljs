(ns codemirror-next.clojure.util
  (:require [applied-science.js-interop :as j]))

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

(defn update-ranges
  "Applies `f` to each range in `state` (see `changeByRange`)"
  [^js state f]
  (.update state (.changeByRange state f) #js{:scrollIntoView true}))

(defn update-lines
  [^js state dispatch f]
  (let [iterator (.. state -doc (iterLines 0))]
    (loop [result (.next iterator)
           changes #js[]
           from-pos 0
           line-num 1]
      (j/let [^:js {:keys [done ^string value]} result]
        (if done
          (dispatch (.update state #js{:changes (.changes state changes)}))
          (recur (.next iterator)
                 (if-let [change (f from-pos value state)]
                   (j/push! changes change)
                   changes)
                 (+ from-pos 1 (count value))
                 (inc line-num)))))))

(j/defn something-selected? [^:js {{:keys [ranges]} :selection}]
  (not (every? #(.-empty ^js %) ranges)))
