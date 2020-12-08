(ns codemirror-next.clojure.demo
  (:require ["@codemirror/next/closebrackets" :refer [closeBrackets]]
            ["@codemirror/next/fold" :as fold]
            ["@codemirror/next/gutter" :refer [lineNumbers]]
            ["@codemirror/next/highlight" :as highlight]
            ["@codemirror/next/history" :refer [history historyKeymap]]
            ["@codemirror/next/state" :refer [EditorState]]
            ["@codemirror/next/view" :as view :refer [EditorView]]
            ["lezer" :as lezer]
            ["lezer-generator" :as lg]
            ["lezer-tree" :as lz-tree]
            [applied-science.js-interop :as j]
            [clojure.string :as str]
            [codemirror-next.clojure :as cm-clj]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.extensions.formatting :as format]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.live-grammar :as live-grammar]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.test-utils :as test-utils]
            [shadow.resource :as rc])
  (:require-macros [codemirror-next.build :as build]))

(def theme
  (.theme EditorView
          (j/lit {:$content {:white-space "pre-wrap"}
                  :$$focused {:outline "none"}
                  :$line {:padding "0 9px"
                          :line-height "1.6"
                          :font-size "16px"
                          :font-family "var(--code-font)"}
                  :$matchingBracket {:border-bottom "1px solid var(--teal-color)"
                                     :color "inherit"}
           ;; only show cursor when focused
                  :$cursor {:visibility "hidden"}
                  "$$focused $cursor" {:visibility "visible"}})))

(defonce extensions #js[(.-lineWrapping EditorView)
                        theme
                        (history)
                        highlight/defaultHighlightStyle
                        (view/drawSelection)
                        (lineNumbers)
                        (fold/foldGutter)
                        (.. EditorState -allowMultipleSelections (of true))
                        (if false
                          ;; use live-reloading grammar
                          #js[(cm-clj/syntax live-grammar/parser)
                              (.slice cm-clj/default-extensions 1)]
                          cm-clj/default-extensions)
                        (view/keymap cm-clj/complete-keymap)
                        (view/keymap historyKeymap)])

(defn sample-text []
  (str "(defn lezer-clojure
  \"This is a showcase for `lezer-clojure`, a grammar for Clojure/Script to enable a decent editor experience in the browser.\"
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

(defn mount-editor! [dom-selector initial-value]
  (let [state (test-utils/make-state extensions initial-value)]
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
                 (tag :table {:cellpadding 0 :class "w-full"}
                      (->> keymap/paredit-keymap*
                           (sort-by first)
                           (reduce (fn [out [command [{:keys [key shift doc]}]]]
                                     (str out
                                          (tag :tr
                                               {:class "border-t even:bg-gray-100"}
                                               (tag :td {:class "px-3 py-1 align-top"} (tag :b (name command)))
                                               (tag :td {:class "px-3 py-1 align-top monospace text-sm"} key)
                                               (tag :td {:class "px-3 py-1 align-top"} doc))
                                          (when shift
                                            (tag :tr
                                                 {:class "border-t even:bg-gray-100"}
                                                 (tag :td {:class "px-3 py-1 align-top"} (tag :b (name shift)))
                                                 (tag :td {:class "px-3 py-1 align-top monospace text-sm"}
                                                      (str "Shift-" key))
                                                 (tag :td {:class "px-3 py-1 align-top"} ""))))) ""))
                      "</table>")))
  #_(j/assoc! (js/document.getElementById "readme")
            :innerHTML
            (tag :pre {:class "mt-4"} (build/slurp "README.md")))
  (.focus (last @prev-views)))


(comment
  (let [s "#(a )"
        state (test-utils/make-state default-extensions s)
        tree (n/tree state)]
    ))
