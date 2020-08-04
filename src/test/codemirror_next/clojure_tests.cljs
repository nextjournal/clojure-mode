(ns codemirror-next.clojure-tests
  (:require [cljs.test :refer [is are testing deftest]]
            [codemirror-next.clojure :as cm-clojure]
            [codemirror-next.test-utils :as test-utils]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]))

;; TODO
;; set up testing flow

(def update-state (partial test-utils/after cm-clojure/default-extensions))

(deftest close-brackets
  (are [before after]
    (= (update-state #(close-brackets/handle-open % "(") before)
       after)
    "|" "(|)"
    "(|" "((|)"
    "|(" "(|)("
    "|)" "(|))"
    "#|" "#(|)")

  (are [before after]
    (= (update-state #(close-brackets/handle-open % \") before) after)
    "|" "\"|\""                                             ;; auto-close strings
    "\"|\"" "\"\\\"|\"")                                    ;; insert quoted " inside strings


  (are [before after]
    (= (update-state close-brackets/handle-backspace before)
       after)
    "|" "|"
    "(|" "|"
    "()|" "(|)"
    "#|()" "|()"
    "[[]]|" "[[]|]"
    ))



