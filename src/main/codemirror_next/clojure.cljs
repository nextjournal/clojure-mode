(ns codemirror-next.clojure
  (:require ["./clojure/clojure_syntax.js" :as clj-syntax]
            ["@codemirror/next/closebrackets" :refer [closeBrackets]]
            ["@codemirror/next/highlight" :as highlight]
            ["@codemirror/next/matchbrackets" :refer [bracketMatching]]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/view" :refer [EditorView keymap multipleSelections]]
            ["lezer-generator" :as lg]
            ["lezer-tree" :as lz-tree]
            ["lezer" :as lezer]
            [applied-science.js-interop :as j]
            [cljs.pprint :as pp]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.extensions.indent :as indent]
            [shadow.resource :as rc]
            [codemirror-next.test-utils :as test-utils]))

(def parser
  (lg/buildParser
   (rc/inline "./clojure/clojure.grammar")))

(comment
 (-> (.parse parser "(")
     ;.-firstChild
     ;.-firstChild
     ;(.prop lz-tree/NodeProp.error)

     ;.-type
     ;.-error
     ;(.prop)
     ))

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
    #\"a\"
"))

(defonce prev-views (atom []))

(def default-extensions #js[clojure-syntax
                            (bracketMatching)
                            highlight/defaultHighlighter
                            (multipleSelections)
                            close-brackets/extension
                            (keymap (keymap/ungroup keymap/default-keymap))
                            #_indent/extension-after-keyup])

(defn mount-editor! [dom-selector initial-value]
  (let [state (test-utils/make-state default-extensions initial-value )]
    (->> (j/obj :state state :parent (js/document.querySelector dom-selector))
         (new EditorView)
         (swap! prev-views conj))))

(defn ^:dev/after-load render []
  (doseq [v @prev-views] (j/call v :destroy))
  (mount-editor! "#editor" (sample-text))
  (.focus (last @prev-views)))


