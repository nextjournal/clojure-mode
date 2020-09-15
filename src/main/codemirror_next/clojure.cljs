(ns codemirror-next.clojure
  (:require ["@codemirror/next/highlight" :as highlight]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/view" :as view :refer [EditorView keymap multipleSelections]]
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
            [shadow.resource :as rc]
            [codemirror-next.clojure.util :as u])
  (:require-macros [codemirror-next.build :as build]))

(def parser
  (lg/buildParser
    (rc/inline "./clojure/clojure.grammar")
    #js{:externalProp n/node-prop}))

(def fold-node-props
  (let [coll-span (fn [^js tree] #js{:from (inc (.-start tree))
                                     :to (dec (.-end tree))})]
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
     :String "string"
     :Keyword "atom"
     :Nil "null"
     :LineComment "lineComment"
     :RegExp "regexp"}))

(def clojure-syntax-ext
  (.define syntax/LezerSyntax
           (.withProps parser
                       format/props
                       (.add syntax/foldNodeProp fold-node-props)
                       (highlight/styleTags style-tags))))

(def clj-keymap (keymap/ungroup keymap/default-keymap))

(def clj-extensions #js[clojure-syntax-ext
                        close-brackets/extension
                        sel-history/extension
                        format/ext-format-changed-lines])

(comment

  (let [state (test-utils/make-state #js[clj-extensions
                                         (view/keymap clj-keymap)]
                                     "[[]|")
        from (.. state -selection -primary -from)]
    (some->>
      (n/tree state from -1)
      (n/ancestors)
      (filter (complement n/balanced?))
      first
      n/down
      n/closed-by
      )))
