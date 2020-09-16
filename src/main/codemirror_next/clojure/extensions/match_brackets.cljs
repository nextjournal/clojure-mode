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

(defn mark-node [node ^js mark]
  (.range mark (n/start node) (n/end node)))

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
                                            (if-let [other-bracket (if
                                                                     ;; are we at starting position?
                                                                     (and (n/start-edge? bracket)
                                                                          (= (n/start bracket)
                                                                             (n/start (n/up bracket))))
                                                                     ;; get end-bracket
                                                                     (-> bracket n/up n/down-last
                                                                         (u/guard #(= (n/name %)
                                                                                      (n/closed-by bracket))))
                                                                     ;; get start-bracket
                                                                     (-> bracket n/up n/down
                                                                         (u/guard #(= (n/name %)
                                                                                      (n/opened-by bracket)))))]
                                              (conj out
                                                    (mark-node bracket matching-mark)
                                                    (mark-node other-bracket matching-mark))
                                              (conj out (mark-node bracket nonmatching-mark))))
                                          out)) []))]
                     (.set Decoration (into-array decos) true))
                   deco))
       :provide [(.-decorations EditorView)]})
    (.define StateField)))

(defn extension []
  #js[base-theme
      state])
