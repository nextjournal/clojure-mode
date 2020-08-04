(ns codemirror-next.test-utils
  (:refer-clojure :exclude [test])
  (:require ["@codemirror/next/state" :refer [EditorState EditorSelection Extension StateCommand]]
            [applied-science.js-interop :as j]
            [clojure.string :as str]))

;; (de)serialize cursors| and <selections> for testing


(defn make-state [doc & [extensions]]
  (let [[doc ranges] (->> (re-seq #"\||<[^>]*?>|[^<>|]+" doc)
                          (reduce (fn [[^string doc ranges] match]
                                    (cond (= match "|")
                                          [doc (conj ranges (.cursor EditorSelection (count doc)))]

                                          (str/starts-with? match "<")
                                          [(str doc (subs match 1 (dec (count match))))
                                           (conj ranges (.range EditorSelection
                                                                (count doc)
                                                                (+ (count doc) (- (count match) 2))))]
                                          :else
                                          [(str doc match) ranges])) ["" []]))]
    (.create EditorState
             #js{:doc doc
                 :selection (if (seq ranges)
                              (.create EditorSelection (to-array ranges))
                              js/undefined)
                 :extensions (cond-> #js[(.. EditorState -allowMultipleSelections (of true))]
                               extensions
                               (j/push! extensions))})))

(defn state-str [^js state]
  (let [doc (str (.-doc state))]
    (->> (.. state -selection -ranges)
         reverse
         (reduce (j/fn [doc ^:js {:keys [empty from to]}]
                   (if empty
                     (str (subs doc 0 from) "|" (subs doc from))
                     (str (subs doc 0 from) "<" (subs doc from to) ">" (subs doc to)))) doc))))

(comment
 (-> (make-state "<a>b|c<d\n>a<b>c|" #js[])
     (state-str)
     (= "<a>b|c<d\n>a<b>c|")))

(defn after [doc extensions cmd]
  (let [state (make-state doc extensions)]
    (state-str (cond
                 (fn? cmd) (.-state (cmd state))
                 (instance? StateCommand cmd)
                 (let [!state (atom state)]
                   (cmd #js{:state @!state
                            :dispatch (fn [^js tr] (reset! !state (.-state tr)))})
                   @!state)))))

(defn test [f extensions & pairs]
  (->> (partition 2 pairs)
       (reduce (fn [out [before expected]]
                 (let [actual (after before extensions f)]
                   (if (= expected actual)
                     out
                     (conj out {:before before
                                :expected expected
                                :actual actual})))) [])
       (#(or (seq %) true))))
