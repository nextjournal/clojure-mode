(ns codemirror-next.clojure.extensions.selection-history
  (:require ["@codemirror/next/state" :refer [Facet Extension EditorSelection StateField]]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]))

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
           #js{:create (constantly '())
               :update
               (j/fn [stack ^:js {{:keys [selection]} :state :keys [docChanged]}]
                 (cond

                   ;; doc changed => clear log
                   docChanged '()

                   ;; no selection => clear stack to current position
                   (not (something-selected? selection))
                   (list selection)

                   ;; selected previous selection => move backwards
                   (some-> stack second (.eq selection))
                   (drop 1 stack)

                   ;; same selection => no-op
                   (some-> stack first (.eq selection))
                   stack

                   ;; transaction has selection => add to log
                   :else
                   (conj stack selection)))}))

(def extension #js[selection-history-field])

(defn last-selection [^js state]
  (second (.field state selection-history-field)))
