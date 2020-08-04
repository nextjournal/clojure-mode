(ns codemirror-next.clojure.extensions.close-brackets
  (:require ["w3c-keyname" :refer [keyName]]
            ["@codemirror/next/view" :as view]
            ["@codemirror/next/state" :refer [EditorState
                                              EditorSelection
                                              Transaction
                                              CharCategory
                                              Extension]]
            ["@codemirror/next/text" :refer [Text]]
            ["@codemirror/next/text" :as text]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.selections :as sel]
            [codemirror-next.clojure.node :as node]
            [codemirror-next.clojure.chars :as chars]
            [codemirror-next.clojure.util :as u :refer [from-to]]
            [codemirror-next.test-utils :as test-utils]
            [codemirror-next.clojure.commands :as commands]))

(j/defn handle-backspace
  "- skips over closing brackets
   - when deleting an opening bracket of an empty list, removes both brackets"
  [^:js {:as ^EditorState state :keys [doc]}]
  (u/update-ranges state
    (j/fn [^:js {:as range :keys [head empty anchor]}]
      (j/let [^:js {:as range pos :from} (from-to head anchor)]
        (if (not empty)
          ;; delete selections as normal
          (j/lit {:range (sel/cursor pos)
                  :changes range})
          (let [^js node| (.resolve (.-tree state) pos -1)  ;; node immediately to the left of cursor
                name| (node/name node|)
                ^js parent (.-parent node|)]
            (or (cond

                  ;; if parent isn't balanced, normal backspace
                  (not (some-> parent node/balanced?)) nil

                  ;; entering right edge of collection
                  (and (node/closing-brackets name|)
                       (== pos (.-end parent)))
                  (j/lit {:range (sel/cursor (dec pos))})

                  ;; inside left edge of collection
                  (and (node/brackets name|)
                       (== (.-start node|) (.-start parent)))
                  (if (node/empty? (.-parent node|))
                    ;; remove empty collection
                    (j/lit {:range (sel/cursor (.-start parent))
                            :changes [(from-to (.-start parent) (.-end parent))]})
                    ;; stop cursor at inner-left of collection
                    (j/lit {:range (sel/cursor pos)})))
                (j/lit {:range (sel/cursor (dec pos))
                        :changes (from-to (max 0 (dec pos)) pos)}))))))))

(defn insertion
  "Returns a `change` that inserts string `s` at position `from` and moves cursor to end of insertion."
  [from ^string s]
  (j/lit {:changes {:insert s
                    :from from}
          :range (sel/cursor (+ from (count s)))}))

(defn handle-open [^EditorState state ^string open]
  (let [^string close (node/brackets open)]
    (u/update-ranges state
      (j/fn [^:js {:keys [from to head anchor empty]}]
        (or (cond (not empty)                               ;; wrap selections with brackets
                  (j/lit {:changes [{:insert open :from from}
                                    {:insert close :from to}]
                          :range (sel/range (+ anchor (count open)) (+ head (count open)))})
                  (= open \")
                  (let [node| (.. state -tree (resolve from -1))
                        no|de (.. state -tree (resolve from))]
                    (cond
                      ;; if inside an unclosed string, close it
                      (and (node/string? node|)
                           (not (node/balanced? node|))) (insertion head \")

                      ;; if inside a balanced string, insert an escaped "
                      (node/string? no|de) (insertion head "\\\""))))
            (j/lit {:changes {:insert (str open close)
                              :from head}
                    :range (sel/cursor (+ head (count open)))}))))))

(j/defn handle-close [^:js {:as state :keys [doc]
                            {:keys [primaryIndex ranges]} :selection}]
  ;; TODO
  ;; - changeByRange
  ;; - navigate to next closing bracket
  (when-some [moved (reduce (j/fn [out ^:js {:keys [empty head]}]
                              (if (and empty (node/closing-brackets (chars/next-char doc head)))
                                (j/push! out (sel/cursor (inc head)))
                                (reduced nil))) #js[] ranges)]
    (.update state #js{:selection (sel/create moved primaryIndex)
                       :scrollIntoView true})))

(def extension
  (.domEventHandlers view/EditorView
                     #js{:keydown
                         (j/fn [^:js {:as event :keys [metaKey ctrlKey keyCode]} ^:js {:as view :keys [state]}]
                           (cond (or metaKey ctrlKey) false
                                 ;; backspace
                                 (== 8 keyCode) (u/dispatch-some view (handle-backspace state))
                                 :else
                                 (let [^string key-name (keyName event)]
                                   (u/dispatch-some view
                                     (cond
                                       (node/brackets key-name)
                                       (handle-open state key-name)

                                       (node/closing-brackets key-name)
                                       (handle-close state))))))}))
