(ns nextjournal.clojure-mode.demo
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
            [nextjournal.clojure-mode :as cm-clj]
            [nextjournal.clojure-mode.demo.sci :as sci]
            [nextjournal.clojure-mode.extensions.close-brackets :as close-brackets]
            [nextjournal.clojure-mode.extensions.formatting :as format]
            [nextjournal.clojure-mode.extensions.selection-history :as sel-history]
            [nextjournal.clojure-mode.keymap :as keymap]
            [nextjournal.clojure-mode.live-grammar :as live-grammar]
            [nextjournal.clojure-mode.node :as n]
            [nextjournal.clojure-mode.selections :as sel]
            [nextjournal.clojure-mode.test-utils :as test-utils]
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

(defonce extensions #js[theme
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
     [:div {:class "mt-4 rounded-md mb-0 text-sm monospace overflow-auto relative shadow-sm bg-white"
            :ref mount!}]
     [:div.mt-3.mv-4.pl-6 {:style {:white-space "pre-wrap" :font-family "monospace"}}
      (prn-str @last-result)]]
    (finally
     (j/call @!view :destroy))))

(defn samples []
  (into [:<>]
        (for [source ["(comment ;; try evaluating those with alt-enter
  (fizz-buzz 1)
  (fizz-buzz 3)
  (fizz-buzz 5)
  (fizz-buzz 15)
  (fizz-buzz 17)
  (fizz-buzz 42))

(defn fizz-buzz [n]
  (condp (fn [a b] (zero? (mod b a))) n
    15 \"fizzbuzz\"
    3  \"fizz\"
    5  \"buzz\"
    n))"]]
          [editor source])))

(defn tag [tag & s]
  (let [[opts s] (if (map? (first s)) [(first s) (rest s)] [nil s])]
    (str "<" (name tag) (reduce-kv #(str %1 " " (name %2) "=" "'" %3 "'") "" opts) ">" (apply str s) "</" (name tag) ">")))

(defn mac? []
  (some? (re-find #"Mac" js/navigator.platform)))

(defn key-mapping []
  (cond-> {"ArrowUp" "↑"
           "ArrowDown" "↓"
           "ArrowRight" "→"
           "ArrowLeft" "←"}
    (mac?)
    (merge {"Alt" "⌥"
            "Shift" "⇧"
            "Enter" "⏎"
            "Ctrl" "⌃"})))

(defn render-key [key]
  (let [keys (into [] (map #(get ((memoize key-mapping)) % %) (str/split key #"-")))]
    (tag :span
         (str/join (tag :span "+") (map (partial tag :kdb {:class "bg-gray monospace m-1" :style "border-radius: 5px; padding: 1px 4px; border: 1px solid black;"}) keys)))))

(defn ^:dev/after-load render []
  (rdom/render [samples] (js/document.getElementById "editor"))
  (j/assoc! (js/document.getElementById "docs")
            :innerHTML
            (tag :div
                 (tag :h3 {:class "m-3" } "Keybindings")
                 (tag :table {:cellpadding 0 :class "w-full"}
                      (->> keymap/paredit-keymap*
                           (sort-by first)
                           (reduce (fn [out [command [{:keys [key shift doc]}]]]
                                     (str out
                                          (tag :tr
                                               {:class "border-t even:bg-gray-100"}
                                               (tag :td {:class "px-3 py-1 align-top"} (tag :b (name command)))
                                               (tag :td {:class "px-3 py-1 align-top text-sm"} (render-key key))
                                               (tag :td {:class "px-3 py-1 align-top"} doc))
                                          (when shift
                                            (tag :tr
                                                 {:class "border-t even:bg-gray-100"}
                                                 (tag :td {:class "px-3 py-1 align-top"} (tag :b (name shift)))
                                                 (tag :td {:class "px-3 py-1 align-top text-sm"}
                                                      (render-key (str "Shift-" key)))
                                                 (tag :td {:class "px-3 py-1 align-top"} ""))))) ""))
                      "</table>"))))


(comment
 (let [s "#(a )"
       state (test-utils/make-state default-extensions s)
       tree (n/tree state)]
   ))
