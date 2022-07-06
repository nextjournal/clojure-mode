(ns nextjournal.clojure-mode
  (:require ["@lezer/highlight" :as highlight :refer [tags]]
            ["@codemirror/language" :as language :refer [LRLanguage]]
            ["lezer-clojure" :as lezer-clj]
            [applied-science.js-interop :as j]
            [nextjournal.clojure-mode.extensions.close-brackets :as close-brackets]
            [nextjournal.clojure-mode.extensions.match-brackets :as match-brackets]
            [nextjournal.clojure-mode.extensions.formatting :as format]
            [nextjournal.clojure-mode.extensions.selection-history :as sel-history]
            [nextjournal.clojure-mode.extensions.eval-region :as eval-region]
            [nextjournal.clojure-mode.keymap :as keymap]
            [nextjournal.clojure-mode.node :as n]
            [nextjournal.clojure-mode.test-utils :as test-utils]))

(def fold-node-props
  (let [coll-span (fn [^js tree] #js{:from (inc (n/start tree))
                                     :to (dec (n/end tree))})]
    (j/lit
     {:Vector coll-span
      :Map coll-span
      :List coll-span})))

(def style-tags
  (clj->js {:NS (.-keyword tags)
            :DefLike (.-keyword tags)
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
     (shadow.resource/inline "./clojure/clojure.grammar")
     #js{:externalProp n/node-prop})))

(defn syntax
  ([] (syntax parser))
  ([^js parser]
   (.define LRLanguage
            #js {:parser (.configure parser #js {:props #js [format/props
                                                             (.add language/foldNodeProp fold-node-props)
                                                             (highlight/styleTags style-tags)]})})))

(def ^js/Array complete-keymap keymap/complete)
(def ^js/Array builtin-keymap keymap/builtin)
(def ^js/Array paredit-keymap keymap/paredit)

(def default-extensions
  #js[(syntax lezer-clj/parser)
      (close-brackets/extension)
      (match-brackets/extension)
      (sel-history/extension)
      (format/ext-format-changed-lines)
      (eval-region/extension {:modifier "Alt"})])

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
