(ns nextjournal.clojure-mode.chars
  (:require ["@codemirror/text" :as text]))

(defn pair-lookup [char-pairs ^string char]
  (let [end (count char-pairs)
        ch (text/codePointAt char 0)]
    (loop [i 0]
      (cond (>= i end) (text/fromCodePoint (if (< ch 128) ch (inc ch)))
            (== ch (.charCodeAt char-pairs i)) (.charAt char-pairs (inc i))
            :else (recur (+ i 2))))))

(defn backspace? [^number code] (== code 8))

(defn next-char [^js doc ^number pos]
  (let [^string next (.sliceString doc pos (+ pos 2))]
    (.slice next 0 (text/codePointSize (text/codePointAt next 0)))))

(defn prev-char [^js doc ^number pos]
  (if (pos-int? pos)
    (.sliceString doc (dec pos) pos)
    ""))

(def whitespace? (->> [" " \n \r ","]
                      (map #(.charCodeAt ^string % 0))
                      (set)))

(comment
 ;; is there a way to iterate from a position, character by character?
 (defn pos-when [doc dir pred]
   ))
