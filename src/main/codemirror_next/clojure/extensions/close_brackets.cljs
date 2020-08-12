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
            [codemirror-next.clojure.node :as n]
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
          {:cursor pos
           :changes range}
          (let [^js node| (.resolve (.-tree state) pos -1)  ;; node immediately to the left of cursor
                name| (n/name node|)
                ^js parent (.-parent node|)]
            (or (cond

                  ;; if parent isn't balanced, normal backspace
                  (and parent (not (n/balanced? parent))) nil

                  ;; entering right edge of collection - skip
                  (and (n/closing-bracket? node|) (== pos (.-end parent)))
                  {:cursor (dec pos)}

                  ;; inside left edge of collection - remove or stop
                  (and (n/bracket-pair name|) (== (.-start node|) (.-start parent)))
                  (if (n/empty? (.-parent node|))
                    ;; remove empty collection
                    {:cursor (.-start parent)
                     :changes [(from-to (.-start parent) (.-end parent))]}
                    ;; stop cursor at inner-left of collection
                    {:cursor pos})


                  (some-> (n/resolve state (dec pos) -1)
                          (u/guard (every-pred #(do
                                                  (prn [(dec pos) (.-end ^js %)])
                                                  (= (dec pos) (.-end ^js %)))
                                               n/line-comment?)))
                  {:cursor (dec pos)})
                {:cursor (dec pos)
                 :changes (from-to (max 0 (dec pos)) pos)})))))))

(defn insertion
  "Returns a `change` that inserts string `s` at position `from` and moves cursor to end of insertion."
  [from ^string s]
  {:changes {:insert s
             :from from}
   :cursor (+ from (count s))})

(defn handle-open [^EditorState state ^string open]
  (let [^string close (n/bracket-pair open)]
    (u/update-ranges state
      (j/fn [^:js {:keys [from to head anchor empty]}]
        (or (cond (not empty)                               ;; wrap selections with brackets
                  {:changes [{:insert open :from from}
                             {:insert close :from to}]
                   :from-to [(+ anchor (count open)) (+ head (count open))]}
                  (and (= open \")
                       (n/closest (n/resolve state from) n/string?))
                  (insertion head "\\\""))
            {:changes {:insert (str open close)
                       :from head}
             :cursor (+ head (count open))})))))

(j/defn handle-close [^:js {:as state :keys [doc]
                            {:keys [primaryIndex ranges]} :selection}]
  ;; TODO
  ;; - changeByRange
  ;; - navigate to next closing bracket
  (when-some [moved (reduce (j/fn [out ^:js {:keys [empty head]}]
                              (if (and empty (n/right-edges (chars/next-char doc head)))
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
                                       (n/bracket-pair key-name)
                                       (handle-open state key-name)

                                       (n/right-edges key-name)
                                       (handle-close state))))))}))
