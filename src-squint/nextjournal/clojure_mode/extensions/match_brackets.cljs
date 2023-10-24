(ns nextjournal.clojure-mode.extensions.match-brackets
  (:require
   ["@codemirror/state" :refer [StateField]]
   ["@codemirror/view" :refer [EditorView
                               Decoration]]
   [nextjournal.clojure-mode.node :as n]
   [nextjournal.clojure-mode.util :as u]))

(def base-theme
  (->>
   {:$matchingBracket {:color "#0b0"}
    :$nonmatchingBracket {:color "#a22"}}
   (.baseTheme EditorView)))

(def ^js matching-mark (.mark Decoration {:class "cm-matchingBracket"}))
(def ^js nonmatching-mark (.mark Decoration {:class "cm-nonmatchingBracket"}))

(defn mark-node [node ^js mark]
  (.range mark (n/start node) (n/end node)))

(def state
  (->>
   {:create (constantly (.-none Decoration))
    :update (fn [deco ^:js {:as tr :keys [state docChanged selection]}]
              (if (or docChanged selection)
                (let [decos (->> (.. tr -state -selection -ranges)
                                 (reduce
                                  (fn [out ^:js {:keys [head empty]}]
                                    (or
                                     ;; a parsed bracket is found before/after cursor
                                     (when-let [bracket (and empty
                                                             (->> [(n/tree state head -1) (n/tree state head 1)]
                                                                  (filter (some-fn n/start-edge? n/end-edge?))
                                                                  first))]
                                       ;; try finding a matching bracket
                                       (if-let [other-bracket (cond

                                                                ;; are we at starting position?
                                                                (and (n/start-edge? bracket)
                                                                     (= (n/start bracket)
                                                                        (n/start (n/up bracket))))
                                                                ;; get end-bracket
                                                                (-> bracket n/up n/down-last
                                                                    (u/guard #(= (n/name %)
                                                                                 (n/closed-by bracket))))

                                                                ;; are we at ending position?
                                                                (and (n/end-edge? bracket)
                                                                     (= (n/end bracket)
                                                                        (n/end (n/up bracket))))
                                                                ;; get start-bracket
                                                                (-> bracket n/up n/down
                                                                    (u/guard #(= (n/name %)
                                                                                 (n/opened-by bracket)))))]
                                         (conj out
                                               (mark-node bracket matching-mark)
                                               (mark-node other-bracket matching-mark))
                                         (conj out (mark-node bracket nonmatching-mark))))
                                     ;; lezer does not produce tokens for non-matching close-brackets
                                     ;; (we haven't entered a collection, so brackets are not valid tokens
                                     ;;  and aren't parsed). So we need to check the string to see if an
                                     ;; unmatched bracket is sitting in front of the cursor.
                                     (when-let [_unparsed-bracket (and
                                                                  ;; skip this check if we're inside a string
                                                                   (not (-> (n/tree state head) (n/closest n/string?)))
                                                                   (->> (.. tr -state -doc (slice head (inc head)) toString)
                                                                        (contains? #{\] \) \}})))]
                                       (conj out (mark-node (n/from-to head (inc head)) nonmatching-mark)))
                                     out)) []))]
                  (.set Decoration (into-array decos) true))
                deco))}
   (.define StateField)))

(defn extension []
  #js[base-theme
      state
      (.. EditorView -decorations (from state))])

(prn :match-brackets-loaded)
