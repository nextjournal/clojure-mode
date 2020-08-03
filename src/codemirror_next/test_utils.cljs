(ns codemirror-next.test-utils
  (:require ["@codemirror/next/state" :refer [EditorState EditorSelection Extension StateCommand]]
            [applied-science.js-interop :as j]))

;; (de)serialize cursors| and <selections> for testing

(defn make-state [doc extensions]
  (let [range (new js/RegExp "\\||<(.*?)>" "g")
        [doc ranges] (loop [ranges []
                            doc doc]
                       (if-let [match (.exec range doc)]
                         (let [index (.-index match)]
                           (if (aget match 1)
                             (let [length (count (aget match 1))]
                               (recur
                                (conj ranges (.range EditorSelection index (+ index length)))
                                (str (subs doc 0 index)
                                     (subs doc (+ index 1) (+ index 1 length))
                                     (subs doc (+ index 2 length)))))
                             (recur
                              (conj ranges (.cursor EditorSelection index))
                              (str (subs doc 0 index)
                                   (subs doc (inc index))))))
                         [doc ranges]))]
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
 (-> (make-state "<a>b|c" #js[])
     (state-str)
     (= "<a>b|c")))

