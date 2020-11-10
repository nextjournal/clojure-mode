(ns codemirror-next.clojure
  (:require ["@codemirror/next/highlight" :as highlight]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/view" :as view :refer [EditorView keymap]]
            ["lezer" :as lezer]
            ["lezer-clojure" :as lezer-clj]
            ["lezer-tree" :as lz-tree]
            [applied-science.js-interop :as j]
            [clojure.string :as str]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.extensions.match-brackets :as match-brackets]
            [codemirror-next.clojure.extensions.formatting :as format]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.test-utils :as test-utils]
            [shadow.resource :as rc]
            [codemirror-next.clojure.util :as u]))

(def fold-node-props
  (let [coll-span (fn [^js tree] #js{:from (inc (n/start tree))
                                     :to (dec (n/end tree))})]
    (j/lit
      {:Vector coll-span
       :Map coll-span
       :List coll-span})))

(def style-tags
  (j/lit
    {:DefLike "keyword"
     "Operator/Symbol" "keyword"
     "VarName/Symbol" "variableName definition"
     :Boolean "atom"
     :DocString "+emphasis"
     :Discard "!comment"
     :Number "number"
     :StringContent "string"
     \" "string"
     :Keyword "atom"
     :Nil "null"
     :LineComment "lineComment"
     :RegExp "regexp"}))

(def parser lezer-clj/parser)

(comment
  ;; to build a parser "live" from a .grammar file,
  ;; rather than using a precompiled parser:
  (def parser
    (lg/buildParser
      (rc/inline "./clojure/clojure.grammar")
      #js{:externalProp n/node-prop})))

(defn syntax
  ([]
   (syntax parser))
  ([parser]
   (.define syntax/LezerSyntax
            (.withProps parser
                        format/props
                        (.add syntax/foldNodeProp fold-node-props)
                        (highlight/styleTags style-tags))
            (j/lit
              {:languageData
               {:commentTokens {:line ";;"}}}))))

(def ^js/Array complete-keymap keymap/complete)
(def ^js/Array builtin-keymap keymap/builtin)
(def ^js/Array paredit-keymap keymap/paredit)

(def default-extensions
  #js[(syntax lezer-clj/parser)
      (close-brackets/extension)
      (match-brackets/extension)
      (sel-history/extension)
      (format/ext-format-changed-lines)
      (.-lineWrapping EditorView)])

(comment

 (let [state (test-utils/make-state #js[(syntax lezer-clj/parser)] "[] a")]
   (-> (.-tree state)
       (.resolve 2 1) ;; Symbol "a"
       .-prevSibling
       js/console.log))

 (let [state (test-utils/make-state #js[(syntax lezer-clj/parser)] "\"\" :a")]
   (-> state
       n/tree
       (n/cursor 0 1)
       ))
 (let [state (test-utils/make-state #js[(syntax lezer-clj/parser)] "a\n\nb")]
   (-> state
       (n/tree 1 1)
       (->> (n/string state))
       str
       ))
 (let [state (test-utils/make-state #js[(syntax lezer-clj/parser)] "([]| s)")]
   (-> state
       n/tree
       (n/terminal-cursor 3 1)
       ))

 (let [state (test-utils/make-state #js[(syntax lezer-clj/parser)] "(|")]
   (-> state
       (close-brackets/handle-close ")")
       (->> (n/string state)))))

