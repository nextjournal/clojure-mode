(ns codemirror-next.clojure
  (:require ["@codemirror/next/closebrackets" :refer [closeBrackets]]
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
            [codemirror-next.clojure.extensions.formatting :as format]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.test-utils :as test-utils]
            [shadow.resource :as rc])
  (:require-macros [codemirror-next.build :as build]))

(def parser
  (lg/buildParser
   (rc/inline "./clojure/clojure.grammar") #js {:externalSpecializer
                                                (fn [_name ^js terms]
                                                  (fn [value _stack]
                                                    (case value
                                                      "nil" (.-Nil terms)
                                                      ("true" "false") (.-Boolean terms)
                                                      (if (= "def" (.slice value 0 3))
                                                        (.-DefLike terms)
                                                        -1))))}))

(def fold-node-props
  (let [coll-span (fn [^js tree] #js{:from (inc (.-start tree))
                                     :to (dec (.-end tree))})]
    #js{:Vector coll-span
        :Map coll-span
        :Set coll-span
        :List coll-span}))


(def style-tags
  #js{"VarName/Symbol" "variableName definition"
      :DefLike "keyword"
      :Boolean "atom"
      :DocString "+emphasis"
      :Discard "+comment"
      :Comment "lineComment"
      :Number "number"
      :String "string"
      :Keyword "atom"
      :Nil "null"
      :Symbol "labelName"
      :LineComment "lineComment"
      :RegExp "regexp"})

(def clojure-syntax
  (.define syntax/LezerSyntax
           (.withProps parser
                       format/props
                       (.add syntax/foldNodeProp fold-node-props)
                       (highlight/styleTags style-tags))
           (j/lit {:closeBrackets {:brackets [\( \[ \{ \' \"]
                                   :commentTokens {:line ";;"}}})))

(def default-extensions #js[(history)
                            clojure-syntax
                            (bracketMatching)
                            highlight/defaultHighlighter
                            (multipleSelections)
                            close-brackets/extension
                            (keymap (keymap/ungroup keymap/default-keymap))
                            sel-history/extension
                            format/ext-format-changed-lines])

(defn state [content & [extensions]]
  (.create EditorState #js{:doc content
                           :extensions (or extensions default-extensions)}))
