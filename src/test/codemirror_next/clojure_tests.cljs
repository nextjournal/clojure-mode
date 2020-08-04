(ns codemirror-next.clojure-tests
  (:require [cljs.test :refer [is are testing deftest]]
            [codemirror-next.clojure :as cm-clojure]
            [codemirror-next.test-utils :as test-utils]
            [codemirror-next.clojure.keymap :as keymap :refer [builtin-commands]]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]))

;; TODO
;; set up testing flow

(def apply-f (partial test-utils/apply-f cm-clojure/default-extensions))
(def apply-cmd (partial test-utils/apply-cmd cm-clojure/default-extensions))

(deftest close-brackets
  (are [before after]
    (= (apply-f #(close-brackets/handle-open % "(") before)
       after)
    "|" "(|)"
    "(|" "((|)"
    "|(" "(|)("
    "|)" "(|))"
    "#|" "#(|)")

  (are [before after]
    (= (apply-f #(close-brackets/handle-open % \") before) after)
    "|" "\"|\""                                             ;; auto-close strings
    "\"|\"" "\"\\\"|\"")                                    ;; insert quoted " inside strings


  (are [before after]
    (= (apply-f close-brackets/handle-backspace before)
       after)
    "|" "|"
    "(|" "|"
    "()|" "(|)"
    "#|()" "|()"
    "[[]]|" "[[]|]"
    ))

(deftest indentation
  (are [before after]
    (= (apply-cmd (:indentSelection builtin-commands) (str "<" before ">"))
       (str "<" after ">"))
    " ()" "()"                                              ;; top-level => 0 indent
    "()[\n]" "()[\n   ]"
    "(\n)" "(\n )"
    "(b\n)" "(b\n  )"                                       ;; operator gets extra indent
    "(0\n)" "(0\n )"                                        ;; number is not operator
    "(:a\n)" "(:a\n )"                                      ;; keyword is not operator
    "(a\n\nb)" "(a\n  \n  b)"                               ;; empty lines get indent
    ))
