(ns codemirror-next.test-utils
  (:require ["@codemirror/next/state" :refer [EditorState EditorSelection Extension StateCommand]]
            [applied-science.js-interop :as j]
            [clojure.string :as str]))

;; (de)serialize cursors| and <selections> for testing


(defn make-state [doc extensions]
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
                 :extensions #js[extensions (.. EditorState -allowMultipleSelections (of true))]})))

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

