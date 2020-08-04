(ns codemirror-next.clojure-tests
  (:require [cljs.test :refer [is are testing deftest]]
            [codemirror-next.clojure :as cm-clojure]
            [codemirror-next.test-utils :as test-utils]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.commands :as commands]
            [codemirror-next.clojure.extensions.indent :as indent]))

;; TODO
;; set up testing flow

(def apply-f (partial test-utils/apply-f cm-clojure/default-extensions))
(def apply-cmd (partial test-utils/apply-cmd cm-clojure/default-extensions))

(deftest close-brackets
  (are [input expected]
    (= (apply-f #(close-brackets/handle-open % "(") input)
       expected)
    "|" "(|)"
    "(|" "((|)"
    "|(" "(|)("
    "|)" "(|))"
    "#|" "#(|)")

  (are [input expected]
    (= (apply-f #(close-brackets/handle-open % \") input) expected)
    "|" "\"|\""                                             ;; auto-close strings
    "\"|\"" "\"\\\"|\"")                                    ;; insert quoted " inside strings


  (are [input expected]
    (= (apply-f close-brackets/handle-backspace input)
       expected)
    "|" "|"
    "(|" "|"
    "()|" "(|)"
    "#|()" "|()"
    "[[]]|" "[[]|]"
    ))

(deftest indentSelection

  (are [input expected]
    (= (apply-cmd (:indentSelection commands/index) (str "<" input ">"))
       (str "<" expected ">"))
    " ()" "()"                                              ;; top-level => 0 indent
    "()[\n]" "()[\n   ]"
    "(\n)" "(\n )"
    "(b\n)" "(b\n  )"                                       ;; operator gets extra indent
    "(0\n)" "(0\n )"                                        ;; number is not operator
    "(:a\n)" "(:a\n )"                                      ;; keyword is not operator
    "(a\n\nb)" "(a\n  \n  b)"                               ;; empty lines get indent
    )

  (testing "prefix-all"
    (are [before after]
      (= (apply-cmd (partial indent/prefix-all "a") before)
         after)
      "z|z\nzz|\n|zz" "az|z\nazz|\n|azz"
      "z<z>\nz<z>" "az<z>\naz<z>"

      )))

(deftest indent-all
  (are [input expected]
    (= (apply-cmd indent/indent-all input)
       expected)
    "| ()" "|()"                                            ;; top-level => 0 indent
    "|()[\n]" "|()[\n   ]"
    "|(\n)" "|(\n )"
    "(<b>\n)" "(<b>\n  )"                                   ;; operator gets extra indent
    "|(0\nx<)>" "|(0\n x<)>"                                ;; number is not operator
    "<(:a\n)>" "<(:a\n )>"                                  ;; keyword is not operator
    "|(a\n\nb)" "|(a\n  \n  b)"                             ;; empty lines get indent

    ))

(deftest kill
  (are [input expected]
    (= (apply-cmd commands/kill input)
       expected)
    "| ()\nx" "|\nx"                                              ;; top-level
    " \"ab|c\" " " \"ab|\" "                                ;; kill to end of string
    ;" \"|a\nb\"" " \"|\nb\"" ;; TODO - stop at newline within string
    "(|)" "(|)"                                             ;; no-op in empty coll
    "(| x y [])" "(|)"                                      ;; kill all coll contents
    "a| \nb" "a|b"                                          ;; bring next line up


    ))

(deftest unwrap
  (are [input expected]
    (= (apply-cmd commands/unwrap input)
       expected)
    "(|)" "|"
    "[a | b]" "a | b"
    "a|b" "a|b"))
