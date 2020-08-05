(ns codemirror-next.clojure
  (:require ["./clojure/clojure_syntax.js" :as clj-syntax]
            ["@codemirror/next/closebrackets" :refer [closeBrackets]]
            ["@codemirror/next/highlight" :as highlight]
            ["@codemirror/next/history" :refer [history]]
            ["@codemirror/next/matchbrackets" :refer [bracketMatching]]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/view" :refer [EditorView keymap multipleSelections]]
            ["lezer-generator" :as lg]
            ["lezer-tree" :as lz-tree]
            ["lezer" :as lezer]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.extensions.indent :as indent]
            [codemirror-next.clojure.node :as n]
            [shadow.resource :as rc]
            [codemirror-next.test-utils :as test-utils]
            [codemirror-next.clojure.selections :as sel]
            [clojure.string :as str])
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
                     (reduce-kv (fn [out command [{:keys [key shift doc]}]]
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
 (let [tree (.-tree (test-utils/make-state default-extensions "ab"))
       from 1
       to 2
       from-node (.. tree (resolve from 1))
       to-node (.. tree (resolve to -1))
       nodes-between (n/nodes-between from-node to-node)
       ]
   (map n/name nodes-between)

   ))
