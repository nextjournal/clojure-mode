(ns codemirror-next.clojure.extensions.match-brackets
  (:require
    ["@codemirror/next/state" :refer [EditorState
                                      StateField
                                      Extension]]
    ["@codemirror/next/view" :refer [EditorView themeClass
                                     Decoration DecorationSet]]
    [applied-science.js-interop :as j]
    [codemirror-next.clojure.node :as n]
    [codemirror-next.clojure.util :as u]))

(def base-theme
  (->>
    (j/lit {:matchingBracket {:color "#0b0"}
            :nonmatchingBracket {:color "#a22"}})
    (.baseTheme EditorView)))

(def ^js matching-mark (.mark Decoration (j/obj :class (themeClass "matchingBracket"))))
(def ^js nonmatching-mark (.mark Decoration (j/obj :class (themeClass "nonmatchingBracket"))))

(def state
  (->>
    (j/lit
      {:create (constantly (.-none Decoration))
       :update (j/fn [deco ^:js {:as tr :keys [state docChanged selection]}]
                 (if (or docChanged selection)
                   (let [decos (->> (.. tr -state -selection -ranges)
                                    (reduce
                                      (j/fn [out ^:js {:keys [head empty]}]
                                        (or
                                          (when-let [bracket (and empty
                                                                  (->> [(n/tree state head -1) (n/tree state head 1)]
                                                                       (filter (some-fn n/start-edge? n/end-edge?))
                                                                       first))]
                                            (let [start? (and (n/start-edge? bracket)
                                                              (= (n/start bracket)
                                                                 (n/start (n/up bracket))))
                                                  other-bracket (if start?
                                                                  (-> bracket n/up n/down-last (u/guard #(= (n/name %)
                                                                                                            (n/closed-by bracket))))
                                                                  (-> bracket n/up n/down (u/guard #(= (n/name %)
                                                                                                       (n/opened-by bracket)))))]
                                              (if other-bracket
                                                (-> out
                                                    (j/push! (.range matching-mark (n/start bracket) (n/end bracket)))
                                                    (j/push! (.range matching-mark (n/start other-bracket) (n/end other-bracket))))
                                                (j/push! out (.range nonmatching-mark (n/start bracket) (n/end bracket))))))
                                          out)) #js[]))]
                     (.set Decoration decos true))
                   deco))
       :provide [(.-decorations EditorView)]})
    (.define StateField)))

(defn extension []
  #js[base-theme
      state])
