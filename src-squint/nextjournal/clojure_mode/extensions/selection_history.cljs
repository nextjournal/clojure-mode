(ns nextjournal.clojure-mode.extensions.selection-history
  (:require ["@codemirror/state" :refer [StateField]]
            ["../node.mjs" :as n]
            #_[nextjournal.clojure-mode.node :as n]
            ["../util.mjs" :as u]
            #_[nextjournal.clojure-mode.util :as u :refer [from-to]]
            ["../selections.mjs" :as sel]
            #_[nextjournal.clojure-mode.selections :as sel]
            ))

(def event-annotation (u/user-event-annotation "selectionhistory"))

(defn second-last [^js arr]
  (when (> (.-length arr) 1)
    (aget arr (dec (.-length arr)))))

(defn ser [selection]
  (-> (.toJSON ^js selection)
      (js->clj :keywordize-keys true)
      :ranges
      (->> (map (juxt :anchor :head)))))

(defn something-selected? [^js selection]
  (-> selection .-ranges (->> (some #(not (.-empty ^js %))))))

(def selection-history-field
  "Stores selection history"
  (.define StateField
           #js{:create (fn [^js state] (list {:selection (.-selection state)}))
               :update
                       (fn [stack ^:js {:as tr {:keys [selection]} :state :keys [docChanged]}]
                         (let [previous-position
                               (first (keep-indexed (fn [i x]
                                                      (when (sel/eq? (:selection x) selection)
                                                        i)) stack))]
                           (cond

                             ;; doc changed => clear log
                             docChanged (list {:selection selection
                                               :event     (u/get-user-event-annotation tr)})

                             ;; no selection => clear stack to current position
                             (not (something-selected? selection))
                             (list {:selection selection
                                    :event     (u/get-user-event-annotation tr)})

                             ;; selection found in stack => move there
                             previous-position
                             (let [[f & more] (drop previous-position stack)]
                               (cons (assoc f :prev-event (:event (first stack))) more))

                             ;; transaction has selection => add to log
                             :else
                             (cons {:selection selection
                                    :event     (u/get-user-event-annotation tr)}
                                   stack))))}))

(defn extension [] selection-history-field)

(defn stack [^js state]
  (.field state selection-history-field))

(defn grow-1 [state start end]
  (let [node (n/nearest-touching state end -1)]
    (->> (n/ancestors node)
         (mapcat (juxt n/inner-span identity))              ;; include inner-spans
         (cons node)
         (filter (fn [^:js {a-start :from a-end :to}]
                   (and (<= a-start start)
                        (>= a-end end)
                        (not (and (== a-start start)
                                  (== a-end end))))))
         first)))

(defn selection-grow* [^js state]
  (u/update-ranges state
                   #js{:annotations event-annotation}
                   (fn [^:js {:as range :keys [from to empty]}]
                     (if empty
                       {:range (or (some->> (n/nearest-touching state from -1)
                                            (n/balanced-range state))
                                   range)}
                       {:range (or (some->> (grow-1 state from to)
                                            n/range)
                                   range)}))))

(defn selection-return* [^js state]
  (if-let [selection (:selection (second (stack state)))]
    (.update state #js{:selection   selection
                       :annotations event-annotation})
    (u/update-ranges state
                     #js{:annotations event-annotation}
                     (fn [^js range] {:cursor (.-from range)}))))

(prn :selection-history-loaded)
