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
    "|" "(|)"                                               ;; auto-close brackets
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
    "(|" "|"                                                ;; delete an unbalanced paren
    "()|" "(|)"                                             ;; enter a form from the right (do not "unbalance")
    "#|()" "|()"                                            ;; delete prefix form
    "[[]]|" "[[]|]"
    ))

(deftest indentSelection

  (are [input expected]
    (= (apply-cmd (:indentSelection commands/index) (str "<" input ">"))
       (str "<" expected ">"))
    " ()" "()"                                              ;; top-level => 0 indent
    "()[\n]" "()[\n   ]"                                    ;; closing-bracket 1 space in front of opening-bracket
    "(\n)" "(\n )"
    "(b\n)" "(b\n  )"                                       ;; operator gets extra indent (symbol in 1st position)
    "(0\n)" "(0\n )"                                        ;; a number is not operator
    "(:a\n)" "(:a\n )"                                      ;; a keyword is not operator
    "(a\n\nb)" "(a\n  \n  b)"                               ;; empty lines get indent
    )

  (testing "prefix-all"
    (are [before after]
      (= (apply-cmd (partial indent/prefix-all "a") before)
         after)
      "z|z\nzz|\n|zz" "az|z\nazz|\n|azz"
      "z<z>\nz<z>" "az<z>\naz<z>"

      )))

(deftest indent-all                                         ;; same as indentSelection but applies to entire doc
  (are [input expected]
    (= (apply-cmd indent/indent-all input)
       expected)
    "| ()" "|()"
    "|()[\n]" "|()[\n   ]"
    "|(\n)" "|(\n )"
    "(<b>\n)" "(<b>\n  )"
    "|(0\nx<)>" "|(0\n x<)>"
    "<(:a\n)>" "<(:a\n )>"
    "|(a\n\nb)" "|(a\n  \n  b)"

    ))

(deftest kill
  (are [input expected]
    (= (apply-f commands/kill input)
       expected)
    "| ()\nx" "|\nx"                                        ;; top-level
    " \"ab|c\" " " \"ab|\" "                                ;; kill to end of string
    ;" \"|a\nb\"" " \"|\nb\"" ;; TODO - stop at newline within string
    "(|)" "(|)"                                             ;; no-op in empty coll
    "(| x y [])" "(|)"                                      ;; kill all coll contents
    "a| \nb" "a|b"                                          ;; bring next line up

    ))

(deftest unwrap
  (are [input expected]
    (= (apply-f commands/unwrap input)
       expected)
    "(|)" "|"
    "[a | b]" "a | b"
    "a|b" "a|b"))

(deftest nav
  (are [input dir expected]
    (= (apply-f (commands/nav dir) input)
       expected)
    "|()" 1 "()|"
    "()|" -1 "|()"
    "a|b" 1 "ab|"
    "a|b" -1 "|ab"
    "| ab" 1 " ab|"
    "ab |" -1 "|ab "
    "(|)" 1 "()|"
    "(|)" -1 "|()"
    "a|\nb" 1 "a\nb|"))

(deftest nav-select
  (are [input dir expected]
    (= (apply-f (commands/nav-select dir) input)
       expected)
    "|()" 1 "<()>"
    "()|" -1 "<()>"
    "a|b" 1 "a<b>"
    "(|)" 1 "<()>"
    "\"a|b\"" 1 "<\"ab\">"
    "a|b" -1 "<a>b"
    "| ab" 1 "< ab>"
    "ab |" -1 "<ab >"
    "(|)" 1 "<()>"
    "(|)" -1 "<()>"
    "a|\nb" 1 "a<\nb>"
    ))

(deftest balance-ranges
  (are [input expected]
    (= (apply-f commands/balance-ranges input)
       expected)
    "<a>" "<a>"
    "a<bc>" "a<bc>"
    " \"a<\"> " " <\"a\"> "
    "(<)>" "<()>"
    "(<a) b>" "<(a) b>"
    ))

(deftest slurp
  (are [input dir expected]
    (= (apply-f (commands/slurp dir) input) expected)
    "(|) a" 1 "(|  a)"
    "((|)) a" 1 "((|)  a)"
    "(|a)" -1 " |a ()"))

(deftest barf
  (are [input dir expected]
    (= (apply-f (commands/barf dir) input) expected)
    "(|a)" 1 "(|) a "
    "(|a)" -1 " |a ()"
    "((|)a)" 1 "((|)a)"))
