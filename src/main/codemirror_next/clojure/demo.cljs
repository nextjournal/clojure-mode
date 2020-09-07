(ns codemirror-next.clojure.demo
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
            [codemirror-next.clojure :as cm-clj]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.extensions.formatting :as format]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.test-utils :as test-utils]
            [shadow.resource :as rc])
  (:require-macros [codemirror-next.build :as build]))


(def clojure-core-src
  (rc/inline "./clojure.core.txt"))

(comment
  cm-clj/parser)

(defn sample-text []
  clojure-core-src)

(defonce prev-views (atom []))

(defn mount-editor! [dom-selector initial-value]
  (let [state (test-utils/make-state cm-clj/default-extensions initial-value)]
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
  (let [s "#(a )"
        state (test-utils/make-state default-extensions s)
        tree (.-tree state)]
    ))
