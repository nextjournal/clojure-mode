(ns codemirror-next.clojure.commands
  (:require ["@codemirror/next/commands" :as commands :refer [defaultKeymap]]
            ["@codemirror/next/history" :as history :refer [historyKeymap]]
            ["@codemirror/next/state" :refer [EditorState IndentContext]]
            [codemirror-next.clojure.extensions.indent :as indent]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.clojure.node :as node]))

(j/defn unwrap [^:js {:keys [^js state dispatch]}]
  (dispatch
   (u/update-ranges state
     (j/fn [^:js {:as range :keys [from to empty]}]
       (or
        (when empty
          (when-let [nearest-balanced-coll
                     (some-> (.resolve (.-tree state) from -1)
                             (node/closest node/coll?)
                             (u/guard node/balanced?))]
            (j/lit
             {:range (sel/cursor (dec from))
              :changes [(node/range (.-firstChild nearest-balanced-coll))
                        (node/range (.-lastChild nearest-balanced-coll))]})))
        #js{:range range}))))
  true)

(j/defn kill [^:js {:keys [^js state dispatch]}]
  (dispatch
   (u/update-ranges state
     (j/fn [^:js {:as range :keys [from to empty]}]
       (or (when empty
             (let [node (.resolve (.-tree state) from)
                   parent (node/closest node #(or (node/coll? %)
                                                  (= "Program" (node/name %))))
                   line-end (.-to (.lineAt (.-doc state) from))
                   next-children (when parent (node/child-subtrees parent from))
                   last-child-on-line
                   (when parent (some->> next-children
                                         (take-while (every-pred
                                                      #(<= (.-start ^js %) line-end)))
                                         last))
                   end (cond (node/string? node) (dec (.-end node))
                             last-child-on-line (if (node/closing-brackets (node/name last-child-on-line))
                                                  (.-start last-child-on-line)
                                                  (.-end last-child-on-line))
                             (some-> (first next-children)
                                     .-start
                                     (> line-end)) (-> (first next-children) .-start))]
               (when end
                 (j/lit
                  {:range (sel/cursor from)
                   :changes {:from from
                             :to end}}))))
           (when-not empty
             #js{:range (sel/cursor from)
                 :changes (u/from-to from to)})
           #js{:range range}))))
  true)

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

   :indent indent/indent
   :unwrap unwrap
   :kill (fn [x] (#'kill x))
   })

(def reverse-index
  "Lookup keyword-id by function"
  (reduce-kv #(assoc %1 %3 %2) {} index))
