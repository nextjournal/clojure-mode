(ns codemirror-next.clojure
  (:require ["@codemirror/next/highlight" :as highlight :refer [tags]]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/language" :as language]
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
  (clj->js {:DefLike (.-keyword tags)
            "Operator/Symbol" (.-keyword tags)
            "VarName/Symbol" (.definition tags (.-variableName tags))
            :Boolean (.-atom tags)
            "DocString/..." (.-emphasis tags)
            :Discard! (.-comment tags)
            :Number (.-number tags)
            :StringContent (.-string tags)
            ;; need to pass something, that returns " when being parsed as JSON
            ;; also #js doesn't treat this correctly, hence clj->js above
            "\"\\\"\"" (.-string tags)
            :Keyword (.-atom tags)
            :Nil (.-null tags)
            :LineComment (.-lineComment tags)
            :RegExp (.-regexp tags)}))

(def parser lezer-clj/parser)

(comment
  ;; to build a parser \""live" from a .grammar file,
  ;; rather than using a precompiled parser:
  (def parser
    (lg/buildParser
     (rc/inline "./clojure/clojure.grammar")
     #js{:externalProp n/node-prop})))

(defn syntax
  ([]
   (syntax parser))
  ([^js parser]
   (.define language/LezerLanguage
            #js {:parser (.configure parser #js {:props #js [format/props
                                                             (.add language/foldNodeProp fold-node-props)
                                                             (highlight/styleTags style-tags)]})}
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
    (-> (n/tree state)
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
