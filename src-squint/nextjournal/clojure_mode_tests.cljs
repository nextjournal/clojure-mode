(ns nextjournal.clojure-mode-tests
  (:require ["./clojure_mode.mjs" :as cm-clojure]
            ["./clojure_mode/commands.mjs" :as commands]
            ["./clojure_mode/extensions/close_brackets.mjs" :as close-brackets]
            ["./clojure_mode/extensions/formatting.mjs" :as format]
            ["@codemirror/state" :as cm-state
             :refer [EditorState EditorSelection]]
            ["assert" :as assert]
            #_[nextjournal.clojure-mode.test-utils :as test-utils])
  (:require-macros [nextjournal.clojure-mode-tests.macros :refer [deftest are testing]]))

#_(assert/equal 1 2)

(defn make-state [extensions doc]
  (let [[doc ranges] (->> (re-seq #"\||<[^>]*?>|[^<>|]+" doc)
                          (reduce (fn [[^string doc ranges] match]
                                    (cond (= match "|")
                                          [doc (conj ranges (.cursor EditorSelection (count doc)))]

                                          (.startsWith match "<")
                                          [(str doc (subs match 1 (dec (count match))))
                                           (conj ranges (.range EditorSelection
                                                                (count doc)
                                                                (+ (count doc) (- (count match) 2))))]
                                          :else
                                          [(str doc match) ranges])) ["" []]))]
    (.create EditorState
             #js{:doc doc
                 :selection (if (seq ranges)
                              (.create EditorSelection (into-array ranges))
                              js/undefined)
                 :extensions (cond-> #js[(.. EditorState -allowMultipleSelections (of true))]
                               extensions
                               (doto (.push extensions)))})))

(defn state-str [^js state]
  (let [doc (str (.-doc state))]
    (->> (.. state -selection -ranges)
         reverse
         (reduce (fn [doc ^:js {:keys [empty from to]}]
                   (if empty
                     (str (subs doc 0 from) "|" (subs doc from))
                     (str (subs doc 0 from) "<" (subs doc from to) ">" (subs doc to)))) doc))))

(defn apply-f* [extensions cmd doc]
  ;; TODO: fix in squint
  #_{:pre [(array? extensions)
           (fn? cmd)
           (string? doc)]}
  (let [state (make-state extensions doc)
        tr (cmd state)]
    (state-str (if tr (.-state tr) state))))

(defn apply-cmd* [extensions cmd doc]
  (let [state (make-state extensions doc)
        !tr (atom nil)
        _ (cmd #js{:state state
                   :dispatch #(reset! !tr %)})
        tr @!tr]
    (state-str (get tr :state))))

(def extensions
  cm-clojure/default-extensions
  ;; optionally test with live grammar
  #_#js[(cm-clojure/syntax live-grammar/parser)
        (.slice cm-clojure/default-extensions 1)])

(def apply-f (partial apply-f* extensions))
(def apply-cmd (partial apply-cmd* extensions))

;; nav
(doseq [[input dir expected] [["|()" 1 "()|"]
                              ["()|" -1 "|()"]
                              ["a|b" 1 "ab|"]
                              ["a|b" -1 "|ab"]
                              ["| ab" 1 " ab|"]
                              ["ab |" -1 "|ab "]
                              ["(|)" 1 "()|"]
                              ["(|)" -1 "|()"]
                              ["a|\nb" 1 "a\nb|"]]]
  (assert.equal (apply-f (commands/nav dir) input)
                expected))

;; nav-select
(doseq [[input dir expected] [["|()" 1 "<()>"]
                              ["()|" -1 "<()>"]
                              ["a|b" 1 "a<b>"]
                              ["(|)" 1 "<()>"]
                              ["\"a|b\"" 1 "\"a<b>\""]
                              ["\"a<b>\"" 1 "<\"ab\">"]
                              ["a|b" -1 "<a>b"]
                              ["| ab" 1 "< ab>"]
                              ["ab |" -1 "<ab >"]
                              ["(|)" 1 "<()>"]
                              ["(|)" -1 "<()>"]
                              ["a|\nb" 1 "a<\nb>"]]]
  (assert.equal (apply-f (commands/nav-select dir) input)
                expected))

;; close brackets > handle open
(doseq [[input insert expected]
        (partition 3 ["|" \( "(|)" ;; auto-close brackets
                      "(|" \( "((|)"
                      "|(" \( "(|)("
                      "|)" \( "(|))"
                      "#|" \( "#(|)"
                      "\"|\"" \( "\"(|\"" ;; no auto-close inside strings
                      ])]
  (assert.equal (apply-f #(close-brackets/handle-open % insert) input)
                expected))

;; close brackets > handle close
(doseq [[input bracket expected]
        (partition 3 ["|" \) "|"
                      "|(" \) "|("
                      "|)" \) ")|"
                      "(|)" \) "()|"
                      "() |()" \) "() ()|"
                      "[(|)]" \) "[()|]"
                      "[()|]" \) "[()]|"
                      "([]| s)" \) "([] s)|"
                      "(|" \) "()|" ;; close unclosed parent
                      "[(|]" \} "[(]|" ;; non-matching bracket doesn't close ancestor
                      "((|)" \] "(()|" ;; non-matching bracket doesn't close ancestor
                      "((|)" \) "(())|" ;; a bit weird - it finds an unclosed ancestor, and closes that.
                      "\"|\"" \) "\")|\"" ;; normal behaviour inside strings
                      ])]
  (assert.equal (apply-f #(close-brackets/handle-close % bracket) input)
                expected))

;; close brackets > handle open string
(doseq [[input expected]
        (partition 2 ["|" "\"|\"" ;; auto-close strings
                      "\"|\"" "\"\\\"|\"" ;; insert quoted " inside strings
                      ]
                   )]
  (assert.equal (apply-f #(close-brackets/handle-open % \") input) expected))

;; close brackets > handle backspace
(doseq [[input expected]
        (partition 2 ["|" "|"
                      "(|" "|" ;; delete an unbalanced paren
                      "()|" "(|)" ;; enter a form from the right (do not "unbalance")
                      "#|()" "|()" ;; delete prefix form
                      "[[]]|" "[[]|]"
                      "(| )" "|" ;; delete empty form
                      "(| a)" "(| a)" ;; don't delete non-empty forms
                      "@|" "|" ;; delete @
                      "@|x" "|x"
                      "\"|\"" "|" ;; delete empty string
                      "\"\"|" "\"|\""
                      "\"| \"" "\"| \"" ;; do not delete string with whitespace
                      ":x  :a |" ":x  :a|" ;; do not format on backspace
                      "\"[|]\"" "\"|]\"" ;; normal deletion inside strings
                      ])]
  (assert.equal (apply-f close-brackets/handle-backspace input)
                expected))

;; indent selection
(doseq [[input expected]
        (partition 2 [" ()" "()" ;; top-level => 0 indent
                      "(\n)" "(\n )"
                      "(b\n)" "(b\n  )" ;; operator gets extra indent (symbol in 1st position)
                      "(0\n)" "(0\n )" ;; a number is not operator
                      "(:a\n)" "(:a\n )" ;; a keyword is not operator
                      "(a\n\nb)" "(a\n  \n  b)" ;; empty lines get indent
                      ])]
  (assert.equal (apply-f format/format (str "<" input ">"))
                (str "<" expected ">")))

;; nav
(doseq [[input dir expected]
        (partition 3
                   ["|()" 1 "()|"
                    "()|" -1 "|()"
                    "a|b" 1 "ab|"
                    "a|b" -1 "|ab"
                    "| ab" 1 " ab|"
                    "ab |" -1 "|ab "
                    "(|)" 1 "()|"
                    "(|)" -1 "|()"
                    "a|\nb" 1 "a\nb|"])]
  (assert.equal (apply-f (commands/nav dir) input)
                expected))
;; nav-select
(doseq [[input dir expected]
        (partition 3 ["|()" 1 "<()>"
                      "()|" -1 "<()>"
                      "a|b" 1 "a<b>"
                      "(|)" 1 "<()>"
                      "\"a|b\"" 1 "\"a<b>\""
                      "\"a<b>\"" 1 "<\"ab\">"
                      "a|b" -1 "<a>b"
                      "| ab" 1 "< ab>"
                      "ab |" -1 "<ab >"
                      "(|)" 1 "<()>"
                      "(|)" -1 "<()>"
                      "a|\nb" 1 "a<\nb>"
                      ])]
  (assert.equal (apply-f (commands/nav-select dir) input)
                expected))

;; close-brackets
(doseq [[input insert expected]
        (partition 3 ["|" \( "(|)" ;; auto-close brackets
                      "(|" \( "((|)"
                      "|(" \( "(|)("
                      "|)" \( "(|))"
                      "#|" \( "#(|)"
                      "\"|\"" \( "\"(|\"" ;; no auto-close inside strings
                      ])]
  (assert.equal (apply-f #(close-brackets/handle-open % insert) input)
                expected))

;; handle-close
(doseq [[input bracket expected]
        (partition 3 ["|" \) "|"
                      "|(" \) "|("
                      "|)" \) ")|"
                      "(|)" \) "()|"
                      "() |()" \) "() ()|"
                      "[(|)]" \) "[()|]"
                      "[()|]" \) "[()]|"
                      "([]| s)" \) "([] s)|"
                      "(|" \) "()|" ;; close unclosed parent
                      "[(|]" \} "[(]|" ;; non-matching bracket doesn't close ancestor
                      "((|)" \] "(()|" ;; non-matching bracket doesn't close ancestor
                      "((|)" \) "(())|" ;; a bit weird - it finds an unclosed ancestor, and closes that.
                      "\"|\"" \) "\")|\"" ;; normal behaviour inside strings
                      ])]
  (assert.equal (apply-f #(close-brackets/handle-close % bracket) input)
                expected))

(deftest close-brackets
  (testing "handle-open"
        )

      (testing "handle-close"
        )

      (testing "handle-open string"
        (are [input expected]
            (= (apply-f #(close-brackets/handle-open % \") input) expected)
          "|" "\"|\"" ;; auto-close strings
          "\"|\"" "\"\\\"|\"" ;; insert quoted " inside strings
          ))

      (testing "handle-backspace"
        (are [input expected]
            (= (apply-f close-brackets/handle-backspace input)
               expected)
          "|" "|"
          "(|" "|" ;; delete an unbalanced paren
          "()|" "(|)" ;; enter a form from the right (do not "unbalance")
          "#|()" "|()" ;; delete prefix form
          "[[]]|" "[[]|]"
          "(| )" "|" ;; delete empty form
          "(| a)" "(| a)" ;; don't delete non-empty forms
          "@|" "|" ;; delete @
          "@|x" "|x"
          "\"|\"" "|" ;; delete empty string
          "\"\"|" "\"|\""
          "\"| \"" "\"| \"" ;; do not delete string with whitespace
          ":x  :a |" ":x  :a|" ;; do not format on backspace
          "\"[|]\"" "\"|]\"" ;; normal deletion inside strings
          ))

      #_(testing "handle backspace (embedded)"
        (are [input expected]
            (= (apply-embedded-f close-brackets/handle-backspace input)
               expected)
          "```\n()|\n```" "```\n(|)\n```"
          "```\n[[]]|\n```" "```\n[[]|]\n```"
          "```\n(| )\n```" "```\n|\n```")))

(do
    
    

    (deftest indentSelection

      (are [input expected]
          (= (apply-f format/format (str "<" input ">"))
             (str "<" expected ">"))
        " ()" "()" ;; top-level => 0 indent
        "(\n)" "(\n )"
        "(b\n)" "(b\n  )" ;; operator gets extra indent (symbol in 1st position)
        "(0\n)" "(0\n )" ;; a number is not operator
        "(:a\n)" "(:a\n )" ;; a keyword is not operator
        "(a\n\nb)" "(a\n  \n  b)" ;; empty lines get indent
        )

      (testing "prefix-all"
        (are [before after]
            (= (apply-f (partial format/prefix-all "a") before)
               after)
          "z|z\nzz|\n|zz" "az|z\nazz|\n|azz"
          "z<z>\nz<z>" "az<z>\naz<z>")))

    (deftest indent-all ;; same as indentSelection but applies to entire doc
      (are [input expected]
          (= (apply-f format/indent-all input)
             expected)
        "| ()" "|()"
        "|()[\n]" "|()[\n   ]"
        "|(\n)" "|(\n )"
        "(<b>\n)" "(<b>\n  )"
        "|(0\nx<)>" "|(0\n x<)>"
        "<(:a\n)>" "<(:a\n )>"
        "|(a\n\nb)" "|(a\n\n  b)"))

    (deftest format-all
      (are [input expected]
          (= (apply-f format/format-all input)
             expected)
        "a  :b  3 |" "a :b 3|" ;; remove extra spaces
        "\"\" |:a " "\"\" |:a"
        "(|a )" "(|a)"
        "| ( )" "|()"
        "|()a" "|() a" ;; add needed spaces
        "()  |a" "() |a" ;; cursor position
        "()|  a" "()| a"
        "() | a" "() |a"
        "|(\n )" "|(\n )"
        "(<b>\n)" "(<b>\n  )"
        "<(:a\n)>" "<(:a\n )>"
        "|(a\n\nb)" "|(a\n\n  b)"
        "|\"a\"" "|\"a\""
        "#_a|" "#_a|"
        "[ | ]" "[|]"
        "|[] " "|[]"
        "#(|a )" "#(|a)"

        "|@ a" "|@a"
        "|&" "|&"
        "[_ & |_]" "[_ & |_]"

        "|[a [\n]]" "|[a [\n    ]]"
        "|[a  [\n]]" "|[a [\n    ]]"

        "|[       a \n]" "|[a\n ]"
        "|[       a [\n]]" "|[a [\n    ]]"
        "|[ \n[ \n[ ]]]" "|[\n [\n  []]]"
        "|()[\n]" "|() [\n    ]" ;; closing-bracket 1 space in front of opening-bracket
        "|()[\n]" "|() [\n    ]"))

    (deftest format-selection
      (are [input expected]
          (= (apply-f format/format input)
             expected)
        "<a  b>\nc  d" "<a b>\nc  d" ;; only selected lines are formatted
        "<a>   <b>   c   <d>\na  b" "<a> <b> c <d>\na  b" ;; multiple selectons on one line
        ))

    (deftest kill
      (are [input expected]
          (= (apply-cmd commands/kill input)
             expected)
        "| ()\nx" "|\nx" ;; top-level
        " \"ab|c\" " "\"ab|\"" ;; kill to end of string
        " \"|a\nb\"" "\"|b\"" ;; TODO - stop at newline within string
        "(|)" "(|)" ;; no-op in empty coll
        "(| x y [])" "(|)" ;; kill all coll contents
        "a| \nb" "a|b" ;; bring next line up
        ))

    (deftest unwrap
      (are [input expected]
          (= (apply-cmd commands/unwrap input)
             expected)
        "(|)" "|"
        "[a | b]" "a |b"
        "a|b" "a|b"))

    (deftest balance-ranges
      (are [input expected]
          (= (apply-f commands/balance-ranges input)
             expected)
        "<a>" "<a>"
        "a<bc>" "a<bc>"
        " \"a<\"> " " <\"a\"> "
        "(<)>" "<()>"
        "(<a) b>" "<(a) b>"))

    (deftest slurp
      (are [input dir expected]
          (= (apply-f (commands/slurp dir) input) expected)
        "(|) a" 1 "(|a)"
        "((|)) a" 1 "((|) a)"
        "(|) ;;comment\na" 1 "(|;;comment\n a)" ;; slurp around comments
        "a(|)" -1 "(a|)"
        "a ;; hello\n(|)" -1 "(a ;; hello\n | )"
        "a #:b{|}" -1 "#:b{a|}"

        "a #(|)" -1 "#(a|)"
        "#(|) a" 1 "#(|a)"
        "@(|) a" 1 "@(|a)"
        "#::a{|:a} 1" 1 "#::a{|:a 1}"
        "'(|) 1" 1 "'(|1)"

        "^{|}    :x :a " 1 "^{|:x} :a"
        "^{|}    :x 1" 1 "^{|:x} 1"
        "^{} [|] :x" 1 "^{} [|:x]"

        "('is-d|ata) :x" 1 "('is-d|ata :x)"
        "('xy|z 1) 2" 1 "('xy|z 1 2)"
        "'ab|c 1" 1 "'ab|c 1"))

    #_(deftest slurp-embedded
      (are [input dir expected]
          (= (apply-embedded-f (commands/slurp dir) input) expected)
        "```\n(|) a\n```" 1 "```\n(|a)\n```"
        "```\n((|)) a\n```" 1 "```\n((|) a)\n```"
        "```\n(|) ;;comment\na\n```" 1 "```\n(|;;comment\n a)\n```"
        "```\n('xy|z 1) 2\n```" 1 "```\n('xy|z 1 2)\n```"))

    (deftest barf
      (are [input dir expected]
          (= (apply-f (commands/barf dir) input) expected)
        "(|a)" 1 "(|) a"
        "(|a)" -1 "a (|)"
        "((|)a)" 1 "((|)a)"

        "#(|a)" -1 "a #(|)"
        "#(|a)" 1 "#(|) a"

        "#:b{a|}" -1 "a #:b{|}"))

    (deftest grow-selections
      (are [input expected]
          (= (apply-cmd commands/selection-grow input) expected)

        "(|)" "<()>"
        "(|a)" "(<a>)"
        "(a|)" "(<a>)"
        "\"|\"" "<\"\">"
        "\"a|b\"" "\"<ab>\""
        "[|]" "<[]>"
        ";; hell|o" "<;; hello>"

        "( a|)" "( <a>)"
        "( <a>)" "(< a>)"
        "(< a>)" "<( a)>"

        "@<deref>" "<@deref>"))

    (deftest enter-and-indent
      (are [input expected]
          (= (apply-cmd commands/enter-and-indent input) expected)

        "(|)" "(\n |)"
        "((|))" "((\n  |))"
        "(()|)" "(()\n |)"
        "(a |b)" "(a\n  |b)"
        "(a b|c)" "(a b\n  |c)")))
