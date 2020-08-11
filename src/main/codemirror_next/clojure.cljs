(ns codemirror-next.clojure
  (:require ["./clojure/clojure_syntax.js" :as clj-syntax]
            ["@codemirror/next/closebrackets" :refer [closeBrackets]]
            ["@codemirror/next/highlight" :as highlight]
            ["@codemirror/next/history" :refer [history]]
            ["@codemirror/next/matchbrackets" :refer [bracketMatching]]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/view" :refer [EditorView keymap multipleSelections]]
            ["lezer" :as lezer]
            ["lezer-generator" :as lg]
            ["lezer-tree" :as lz-tree]
            [applied-science.js-interop :as j]
            [clojure.string :as str]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.extensions.formatting :as indent]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.test-utils :as test-utils]
            [shadow.resource :as rc])
  (:require-macros [codemirror-next.build :as build]))

(def parser
  (lg/buildParser
   (rc/inline "./clojure/clojure.grammar")))

(def clojure-syntax
  (new syntax/LezerSyntax
       (.withProps parser
                   indent/props
                   (.add syntax/foldNodeProp clj-syntax/foldNodeProps)
                   (highlight/styleTags clj-syntax/styleTags))
       clj-syntax/languageData))

(defn sample-text []
  (str "(defn lezer-clojure
  \"This is a showcase for `lezer-clojure`, an grammar for Clojure/Script to
  enable a decent editor experience in the browser.\"
  {:added \"0.1\"}
  [demo]
  nil ;; nil
  (+ 1 1.0 1/5 1E3 042 +042 -042) ;; numbers
  :hi :hi/ho ::ho :*+!-_? :abc:def:ghi ;; keywords
  true false ;; booleans
  :hello #_ :ignored ;; ignore next form
  #\"[A-Z]\" ;; regex
  ^{:meta/data 'is-data} 'too
  (if (test? <demo>)
    (inc demo)|
    (dec demo)))
  #
    [ ]
    #\"a\""
       \newline
       "a b(c|)d e"
       )

  )

(defonce prev-views (atom []))

(def default-extensions #js[(history)
                            clojure-syntax
                            (bracketMatching)
                            highlight/defaultHighlighter
                            (multipleSelections)
                            close-brackets/extension
                            (keymap (keymap/ungroup keymap/default-keymap))
                            sel-history/extension
                            #_indent/extension-after-keyup])

(defn mount-editor! [dom-selector initial-value]
  (let [state (test-utils/make-state default-extensions initial-value)]
    (->> (j/obj :state state :parent (js/document.querySelector dom-selector))
         (new EditorView)
         (swap! prev-views conj))))

(defn tag [tag & s]
  (let [[opts s] (if (map? (first s)) [(first s) (rest s)] [nil s])]
    (str "<" (name tag) (reduce-kv #(str %1 " " (name %2) "=" "'" %3 "'") "" opts) ">" (apply str s) "</" (name tag) ">")))

(defn ^:dev/after-load render []
  (doseq [v @prev-views] (j/call v :destroy))
  (mount-editor! "#editor" (sample-text))
  (j/assoc! (js/document.getElementById "docs")
            :innerHTML
            (tag :div
              (tag :table {:cellpadding 5}
                (->> keymap/paredit-keymap
                     (sort-by first)
                     (reduce (fn [out [command [{:keys [key shift doc]}]]]
                               (str out
                                    (tag :tr
                                      (tag :td (tag :b (name command)))
                                      (tag :td key)
                                      (tag :td (when shift "\n" (tag :i "+Shift " (tag :b shift))))
                                      (tag :td doc)))) ""))
                "</table>")
              (tag :pre
                (-> (build/slurp "README.md")
                    (str/split #"----")
                    second))
              ))
  (.focus (last @prev-views)))


(comment
 (let [state (test-utils/make-state default-extensions "(a )")
       tree (.-tree state)]
   (n/terminal-nodes tree 0 (.. state -doc -length))

   ))
