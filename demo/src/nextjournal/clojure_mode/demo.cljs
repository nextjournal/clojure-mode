(ns nextjournal.clojure-mode.demo
  (:require ["@codemirror/language" :refer [foldGutter syntaxHighlighting defaultHighlightStyle]]
            ["@codemirror/commands" :refer [history historyKeymap]]
            ["@codemirror/state" :refer [EditorState]]
            ["@codemirror/view" :as view :refer [EditorView]]
            [applied-science.js-interop :as j]
            [clojure.string :as str]
            [nextjournal.clojure-mode :as cm-clj]
            [nextjournal.clojure-mode.demo.sci :as sci]
            [nextjournal.clojure-mode.keymap :as keymap]
            [nextjournal.clojure-mode.live-grammar :as live-grammar]
            [nextjournal.clojure-mode.test-utils :as test-utils]
            [reagent.core :as r]
            [reagent.dom :as rdom]))

(def theme
  (.theme EditorView
          (j/lit {".cm-content" {:white-space "pre-wrap"
                                 :padding "10px 0"}
                  "&.cm-focused" {:outline "none"}
                  ".cm-line" {:padding "0 9px"
                              :line-height "1.6"
                              :font-size "16px"
                              :font-family "var(--code-font)"}
                  ".cm-matchingBracket" {:border-bottom "1px solid var(--teal-color)"
                                         :color "inherit"}
                  ".cm-gutters" {:background "transparent"
                                 :border "none"}
                  ".cm-gutterElement" {:margin-left "5px"}
                  ;; only show cursor when focused
                  ".cm-cursor" {:visibility "hidden"}
                  "&.cm-focused .cm-cursor" {:visibility "visible"}})))

(defonce extensions #js[theme
                        (history)
                        (syntaxHighlighting defaultHighlightStyle)
                        (view/drawSelection)
                        (foldGutter)
                        (.. EditorState -allowMultipleSelections (of true))
                        (if false
                          ;; use live-reloading grammar
                          #js[(cm-clj/syntax live-grammar/parser)
                              (.slice cm-clj/default-extensions 1)]
                          cm-clj/default-extensions)
                        (.of view/keymap cm-clj/complete-keymap)
                        (.of view/keymap historyKeymap)])


(defn editor [source {:keys [eval?]}]
  (r/with-let [!view (r/atom nil)
               last-result (when eval? (r/atom (sci/eval-string source)))
               mount! (fn [el]
                        (when el
                          (reset! !view (new EditorView
                                             (j/obj :state
                                                    (test-utils/make-state
                                                     (cond-> #js [extensions]
                                                       eval? (.concat #js [(sci/extension {:modifier  "Alt"
                                                                                           :on-result (partial reset! last-result)})]))
                                                     source)
                                                    :parent el)))))]
    [:div
     [:div {:class "rounded-md mb-0 text-sm monospace overflow-auto relative border shadow-lg bg-white"
            :ref mount!
            :style {:max-height 410}}]
     (when eval?
       [:div.mt-3.mv-4.pl-6 {:style {:white-space "pre-wrap" :font-family "var(--code-font)"}}
        (prn-str @last-result)])]
    (finally
      (j/call @!view :destroy))))


(defn samples []
  (into [:<>]
        (for [source ["(comment
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
          [editor source {:eval? true}])))

(defn linux? []
  (some? (re-find #"(Linux)|(X11)" js/navigator.userAgent)))

(defn mac? []
  (and (not (linux?))
       (some? (re-find #"(Mac)|(iPhone)|(iPad)|(iPod)" js/navigator.platform))))

(defn key-mapping []
  (cond-> {"ArrowUp" "↑"
           "ArrowDown" "↓"
           "ArrowRight" "→"
           "ArrowLeft" "←"
           "Mod" "Ctrl"}
    (mac?)
    (merge {"Alt" "⌥"
            "Shift" "⇧"
            "Enter" "⏎"
            "Ctrl" "⌃"
            "Mod" "⌘"})))

(defn render-key [key]
  (let [keys (into [] (map #(get ((memoize key-mapping)) % %) (str/split key #"-")))]
    (into [:span]
          (map-indexed (fn [i k]
                         [:<>
                          (when-not (zero? i) [:span " + "])
                          [:kbd.kbd k]]) keys))))

(defn key-bindings-table []
  [:table.w-full.text-sm
   [:thead
    [:tr.border-t
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 "Command"]
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 "Keybinding"]
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 "Alternate Binding"]
     [:th.px-3.py-1.align-top.text-left.text-xs.uppercase.font-normal.black-50 {:style {:min-width 290}} "Description"]]]
   (into [:tbody]
         (->> keymap/paredit-keymap*
              (merge (sci/keymap* "Alt"))
              (sort-by first)
              (map (fn [[command [{:keys [key shift doc]} & [{alternate-key :key}]]]]
                     [:<>
                      [:tr.border-t.hover:bg-gray-100
                       [:td.px-3.py-1.align-top.monospace.whitespace-nowrap [:b (name command)]]
                       [:td.px-3.py-1.align-top.text-right.text-sm.whitespace-nowrap (render-key key)]
                       [:td.px-3.py-1.align-top.text-right.text-sm.whitespace-nowrap (some-> alternate-key render-key)]
                       [:td.px-3.py-1.align-top doc]]
                      (when shift
                        [:tr.border-t.hover:bg-gray-100
                         [:td.px-3.py-1.align-top [:b (name shift)]]
                         [:td.px-3.py-1.align-top.text-sm.whitespace-nowrap.text-right
                          (render-key (str "Shift-" key))]
                         [:td.px-3.py-1.align-top.text-sm]
                         [:td.px-3.py-1.align-top]])]))))])

(defn ^:dev/after-load render []
  (rdom/render [samples] (js/document.getElementById "editor"))

  (.. (js/document.querySelectorAll "[clojure-mode]")
      (forEach #(when-not (.-firstElementChild %)
                  (rdom/render [editor (str/trim (.-innerHTML %))] %))))

  (let [mapping (key-mapping)]
    (.. (js/document.querySelectorAll ".mod,.alt,.ctrl")
        (forEach #(when-let [k (get mapping (.-innerHTML %))]
                    (set! (.-innerHTML %) k)))))

  (rdom/render [key-bindings-table] (js/document.getElementById "docs"))

  (when (linux?)
    (js/twemoji.parse (.-body js/document))))
