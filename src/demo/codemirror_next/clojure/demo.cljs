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
            [codemirror-next.clojure.demo.sci :as sci]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]
            [codemirror-next.clojure.extensions.formatting :as format]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.keymap :as keymap]
            [codemirror-next.clojure.live-grammar :as live-grammar]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.test-utils :as test-utils]
            [reagent.core :as r]
            [reagent.dom :as rdom]
            [shadow.resource :as rc]))

(def theme
  (.theme EditorView
          (j/lit {:$content {:white-space "pre-wrap"
                             :padding "10px 0"}
                  :$$focused {:outline "none"}
                  :$line {:padding "0 9px"
                          :line-height "1.6"
                          :font-size "16px"
                          :font-family "var(--code-font)"}
                  :$matchingBracket {:border-bottom "1px solid var(--teal-color)"
                                     :color "inherit"}
                  :$gutters {:background "transparent"
                             :border "none"}
                  :$gutterElement {:margin-left "5px"}
                  ;; only show cursor when focused
                  :$cursor {:visibility "hidden"}
                  "$$focused $cursor" {:visibility "visible"}})))

(defonce extensions #js[(.-lineWrapping EditorView)
                        theme
                        (history)
                        highlight/defaultHighlightStyle
                        (view/drawSelection)
                        ;(lineNumbers)
                        (fold/foldGutter)
                        (.. EditorState -allowMultipleSelections (of true))
                        (if false
                          ;; use live-reloading grammar
                          #js[(cm-clj/syntax live-grammar/parser)
                              (.slice cm-clj/default-extensions 1)]
                          cm-clj/default-extensions)
                        (view/keymap cm-clj/complete-keymap)
                        (view/keymap historyKeymap)])

(defn editor [source]
  (r/with-let [!view (atom nil)
               last-result (r/atom (sci/eval-string source))
               mount! (fn [el]
                        (when el
                          (reset! !view (new EditorView
                                             (j/obj :state
                                                    (test-utils/make-state
                                                     #js[extensions
                                                         (sci/extension {:modifier  "Alt"
                                                                         :on-result (partial reset! last-result)})] source)
                                                    :parent el)))))]
    [:div
     [:div {:class "mt-4 rounded-md border mb-0 text-sm monospace overflow-auto relative shadow-md bg-white"
            :ref mount!}]
     [:div.mt-3.mv-4.pl-6 {:style {:white-space "pre-wrap" :font-family "monospace"}}
      (prn-str @last-result)]]
    (finally
     (j/call @!view :destroy))))

(defn samples []
  (into [:<>]
        (for [source ["(rand-nth (range 1000))"
                      "(defn greeting [first-name] \n  (str \"Hello, \" first-name))"
                      "(greeting \"fido\")"]]
          [editor source])))

(defn tag [tag & s]
  (let [[opts s] (if (map? (first s)) [(first s) (rest s)] [nil s])]
    (str "<" (name tag) (reduce-kv #(str %1 " " (name %2) "=" "'" %3 "'") "" opts) ">" (apply str s) "</" (name tag) ">")))

(defn ^:dev/after-load render []
  (rdom/render [samples] (js/document.getElementById "editor"))
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
                      "</table>"))))


(comment
 (let [s "#(a )"
       state (test-utils/make-state default-extensions s)
       tree (n/tree state)]
   ))
