(ns codemirror-next.clojure.chars
  (:require ["@codemirror/next/text" :as text]))

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
  (prn :pos pos)
  (if (pos-int? pos)
    (.sliceString doc (dec pos) pos)
    ""))

