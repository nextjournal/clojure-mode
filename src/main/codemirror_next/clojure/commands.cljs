(ns codemirror-next.clojure.commands
  (:require ["@codemirror/next/commands" :as commands :refer [defaultKeymap]]
            ["@codemirror/next/history" :as history :refer [historyKeymap]]
            ["@codemirror/next/state" :refer [EditorState IndentContext]]
            [codemirror-next.clojure.extensions.formatting :as indent]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.extensions.formatting :as format]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]))

(defn view-command [f]
  (j/fn [^:js {:keys [^js state dispatch]}]
    (some-> (f state)
            (dispatch))
    true))

(defn unwrap [state]
  (u/update-ranges state
    (j/fn [^:js {:as range :keys [from to empty]}]
      (when empty
        (when-let [nearest-balanced-coll
                   (some-> (n/tree state from -1)
                           (n/closest n/coll?)
                           (u/guard n/balanced?))]
          {:cursor (dec from)
           :changes [(n/from-to (n/down nearest-balanced-coll))
                     (n/from-to (n/down-last nearest-balanced-coll))]})))))

(defn kill [^js state]
  (u/update-ranges state
    (j/fn [^:js {:as range :keys [from to empty]}]
      (or (when empty
            (let [node (n/tree state from)
                  parent (n/closest node #(or (n/coll? %)
                                              (= "String" (n/name %))
                                              (= "Program" (n/name %))))
                  line-end (.-to (.lineAt (.-doc state) from))
                  next-children (when parent (n/children parent from 1))
                  last-child-on-line
                  (when parent (some->> next-children
                                        (take-while (every-pred
                                                     #(<= (n/start %) line-end)))
                                        last))
                  end (cond (n/string? parent) (let [content (str (n/string state parent))
                                                     content-from (subs content (- from (.-start parent)))
                                                     next-newline (.indexOf content-from \newline)]
                                                 (if (neg? next-newline)
                                                   (dec (n/end parent))
                                                   (+ from next-newline 1)))
                            last-child-on-line (if (n/closing-bracket? last-child-on-line)
                                                 (n/start last-child-on-line)
                                                 (n/end last-child-on-line))
                            (some-> (first next-children)
                                    n/start
                                    (> line-end)) (-> (first next-children) n/start))]
              (when end
                {:cursor from
                 :changes {:from from
                           :to end}})))
          (when-not empty
            {:cursor from
             :changes (u/from-to from to)})))))

(defn nav-position [state from dir]
  (or (some-> (n/closest (n/tree state from)
                         #(or (n/coll? %)
                              (n/top? %)))
              (n/children from dir)
              first
              (j/get (case dir -1 :start 1 :end)))
      (sel/constrain (+ from dir) state)))

(defn nav [dir]
  (fn [state]
    (u/update-ranges state
      (j/fn [^:js {:as range :keys [from to empty]}]
        (if empty
          {:cursor (nav-position state from dir)}
          {:cursor (j/get (u/from-to from to) (case dir -1 :from 1 :to))})))))

(defn nav-select [dir]
  (fn [^js state]
    (u/update-ranges state
      (j/fn [^:js {:as range :keys [from to empty]}]
        (if empty
          {:range (n/balanced-range state from (nav-position state from dir))}
          {:range (j/let [^:js {:keys [from to]} (u/from-to from to)]
                    (case dir
                      1 (n/balanced-range state from (nav-position state to dir))
                      -1 (n/balanced-range state (nav-position state from dir) to)))})))))

(defn nearest-touching [^js state pos dir]
  (let [L (some-> (n/tree state pos -1)
                  (u/guard (j/fn [^:js {:keys [end]}] (= pos end))))
        R (some-> (n/tree state pos 1)
                  (u/guard (j/fn [^:js {:as what :keys [start]}]
                             (= pos start))))
        mid (n/tree state pos)]
    (case dir 1 (or (u/guard R (every-pred some? (complement n/right-edge?)))
                    L
                    R
                    mid)
              -1 (or (u/guard L (every-pred some? (complement n/left-edge?)))
                     R
                     L
                     mid))))

(j/defn grow-1 [state start end]
  (let [node (nearest-touching state end -1)]
    (->> (n/ancestors node)
         (mapcat (juxt n/inner-span identity))              ;; include inner-spans
         (cons node)
         (filter (j/fn [^:js {a-start :start a-end :end}]
                   (and (<= a-start start)
                        (>= a-end end)
                        (not (and (== a-start start)
                                  (== a-end end))))))
         first)))

(defn selection-grow [^js state]
  (u/update-ranges state
    (j/fn [^:js {:as range :keys [from to empty]}]
      (if empty
        {:range (or (some->> (nearest-touching state from -1)
                             (n/balanced-range state))
                    range)}
        {:range (or (some->> (grow-1 state from to)
                             n/range)
                    range)}))))

(defn selection-return [^js state]
  (if-let [selection (sel-history/last-selection state)]
    (.update state #js{:selection selection})
    (u/update-ranges state (fn [^js range] {:cursor (.-from range)}))))

(defn balance-ranges [^js state]
  (u/update-ranges state
    (j/fn [^:js {:keys [from to empty]}]
      (when-not empty
        {:range (n/balanced-range state from to)}))))

(defn slurp [direction]
  (fn [^js state]
    (u/update-ranges state
      (j/fn [^:js {:as range :keys [from to empty]}]
        (when empty
          (when-let [parent (n/closest (n/tree state from) (every-pred n/coll?
                                                                          #(not (case direction 1 (some-> % n/with-prefix n/right n/closing-bracket?)
                                                                                                -1 (some-> % n/with-prefix n/left n/opening-bracket?)))))]
            (when-let [target (case direction 1 (first (remove n/line-comment? (n/rights (n/with-prefix parent))))
                                              -1 (first (remove n/line-comment? (n/lefts (n/with-prefix parent)))))]
              {:cursor/mapped from
               :changes (case direction
                          1
                          (let [edge (n/down-last parent)]
                            [{:from (-> target n/end)
                              :insert (n/name edge)}
                             (-> edge
                                 n/from-to
                                 (assoc :insert " "))])
                          -1
                          (let [^string edge (n/left-edge-with-prefix parent)
                                start (n/start (n/with-prefix parent))]
                            [{:from start
                              :to (+ start (count edge))
                              :insert " "}
                             {:from (n/start target)
                              :insert edge}]))})))))))

(defn barf [direction]
  (fn [^js state]
    (->> (j/fn [^:js {:as range :keys [from to empty]}]
           (when empty
             (when-let [parent (n/closest (n/tree state from) n/coll?)]
               (case direction
                 1
                 (when-let [target (some->> (n/down-last parent)
                                            n/lefts
                                            (remove n/line-comment?)
                                            (drop 1)
                                            first)]

                   {:cursor (min (n/end target) from)
                    :changes [{:from (n/end target)
                               :insert (n/name (n/down-last parent))}
                              (-> (n/down-last parent)
                                  n/from-to
                                  (assoc :insert " "))]})
                 -1
                 (when-let [next-first-child (some->> (n/down parent)
                                                      n/rights
                                                      (remove n/line-comment?)
                                                      (drop 1)
                                                      first)]
                   (let [left-edge (n/left-edge-with-prefix parent)
                         left-start (n/start (n/with-prefix parent))]
                     {:cursor (max from (+ (n/start next-first-child) (count left-edge)))
                      :changes [{:from (n/start next-first-child)
                                 :insert left-edge}
                                {:from left-start
                                 :to (+ left-start (count left-edge))
                                 :insert (format/spaces state (count left-edge))}]}))))))
         (u/update-ranges state))))

(def index
  "Mapping of keyword-id to command functions"
  {:cursorSyntaxLeft commands/cursorSyntaxLeft
   :selectSyntaxLeft commands/selectSyntaxLeft
   :cursorSyntaxRight commands/cursorSyntaxRight
   :selectSyntaxRight commands/selectSyntaxRight
   :moveLineUp commands/moveLineUp
   :copyLineUp commands/copyLineUp
   :moveLineDown commands/moveLineDown
   :copyLineDown commands/copyLineDown
   :simplifySelection commands/simplifySelection
   :selectLine commands/selectLine
   :selectParentSyntax commands/selectParentSyntax
   :indentLess commands/indentLess
   :indentMore commands/indentMore
   :indentSelection commands/indentSelection
   :deleteLine commands/deleteLine
   :cursorMatchingBracket commands/cursorMatchingBracket
   :cursorCharLeft commands/cursorCharLeft
   :selectCharLeft commands/selectCharLeft
   :cursorGroupLeft commands/cursorGroupLeft
   :selectGroupLeft commands/selectGroupLeft
   :cursorLineStart commands/cursorLineStart
   :selectLineStart commands/selectLineStart
   :cursorCharRight commands/cursorCharRight
   :selectCharRight commands/selectCharRight
   :cursorGroupRight commands/cursorGroupRight
   :selectGroupRight commands/selectGroupRight
   :cursorLineEnd commands/cursorLineEnd
   :selectLineEnd commands/selectLineEnd
   :cursorLineUp commands/cursorLineUp
   :selectLineUp commands/selectLineUp
   :cursorDocStart commands/cursorDocStart
   :selectDocStart commands/selectDocStart
   :cursorPageUp commands/cursorPageUp
   :selectPageUp commands/selectPageUp
   :cursorLineDown commands/cursorLineDown
   :selectLineDown commands/selectLineDown
   :cursorDocEnd commands/cursorDocEnd
   :selectDocEnd commands/selectDocEnd
   :cursorPageDown commands/cursorPageDown
   :selectPageDown commands/selectPageDown
   :cursorLineBoundaryBackward commands/cursorLineBoundaryBackward
   :selectLineBoundaryBackward commands/selectLineBoundaryBackward
   :cursorLineBoundaryForward commands/cursorLineBoundaryForward
   :selectLineBoundaryForward commands/selectLineBoundaryForward
   :insertNewlineAndIndent commands/insertNewlineAndIndent
   :selectAll commands/selectAll
   :deleteCharBackward commands/deleteCharBackward
   :deleteCharForward commands/deleteCharForward
   :deleteGroupBackward commands/deleteGroupBackward
   :deleteGroupForward commands/deleteGroupForward
   :cursorGroupBackward commands/cursorGroupBackward
   :selectGroupBackward commands/selectGroupBackward
   :cursorGroupForward commands/cursorGroupForward
   :selectGroupForward commands/selectGroupForward
   :splitLine commands/splitLine
   :transposeChars commands/transposeChars
   :deleteToLineEnd commands/deleteToLineEnd

   :undo history/undo
   :redo history/redo
   :undoSelection history/undoSelection
   :redoSelection history/redoSelection

   :indent (view-command #'indent/format)
   :unwrap (view-command #'unwrap)
   :kill (view-command #'kill)
   :nav-right (view-command (nav 1))
   :nav-left (view-command (nav -1))
   :nav-select-right (view-command (nav-select 1))
   :nav-select-left (view-command (nav-select -1))
   :slurp-forward (view-command (slurp 1))
   :slurp-backward (view-command (slurp -1))
   :barf-forward (view-command (barf 1))
   :barf-backward (view-command (barf -1))
   :selection-grow (view-command #'selection-grow)
   :selection-return (view-command #'selection-return)
   })

(def reverse-index
  "Lookup keyword-id by function"
  (reduce-kv #(assoc %1 %3 %2) {} index))
