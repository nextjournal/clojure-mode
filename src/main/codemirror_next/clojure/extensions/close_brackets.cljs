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
  (when-not (and (= 1 (.. state -selection -ranges -length))
                 (let [^js range (j/get-in state [:selection :ranges 0])]
                   (and (.-empty range) (= 0 (.-from range)))))
    (u/update-ranges state
      #js{:annotations (.. Transaction -userEvent (of "delete"))}
      (j/fn [^:js {:as range :keys [head empty anchor]}]
        (j/let [^:js {:as range pos :from} (from-to head anchor)]
          (if (not empty)
            ;; delete selections as normal
            {:cursor pos
             :changes range}
            (let [^js node| (.resolve (.-tree state) pos -1) ;; node immediately to the left of cursor
                  ^js parent (.-parent node|)]
              (or (cond

                    ;; if parent isn't balanced, normal backspace
                    (and parent (not (n/balanced? parent))) nil

                    ;; entering right edge of collection - skip
                    (and (n/right-edge? node|) (== pos (.-end parent)))
                    {:cursor (dec pos)}

                    ;; inside left edge of collection - remove or stop
                    (and (or (n/start-edge? node|)
                             (n/same-edge? node|)) (== (.-start node|) (.-start parent)))
                    (if (n/empty? (n/up node|))
                      ;; remove empty collection
                      {:cursor (.-start parent)
                       :changes [(from-to (.-start parent) (.-end parent))]}
                      ;; stop cursor at inner-left of collection
                      {:cursor pos})


                    (some-> (n/tree state (dec pos) -1)
                            (u/guard (every-pred #(= (dec pos) (.-end ^js %))
                                                 n/line-comment?)))
                    {:cursor (dec pos)})
                  {:cursor (sel/constrain state (dec pos))
                   :changes (from-to (sel/constrain state (dec pos)) pos)}))))))))

(def coll-pairs {"(" ")"
                 "[" "]"
                 "{" "}"
                 \" \"})

(defn handle-open [^EditorState state ^string open]
  (let [^string close (coll-pairs open)]
    (u/update-ranges state
      (j/fn [^:js {:keys [from to head anchor empty]}]
        (or (cond (not empty)                               ;; wrap selections with brackets
                  {:changes [{:insert open :from from}
                             {:insert close :from to}]
                   :from-to [(+ anchor (count open)) (+ head (count open))]}
                  (and (= open \")
                       (n/closest (n/tree state from) n/string?))
                  (u/insertion head "\\\""))
            {:changes {:insert (str open close)
                       :from head}
             :cursor (+ head (count open))})))))

(defn handle-close [state key-name]
  (u/update-ranges state
    (j/fn [^:js {:as range :keys [empty head]}]
      (or (let [unbalanced (some->
                             (n/tree state head -1)
                             (n/ancestors)
                             (->> (filter (every-pred n/coll? (complement n/balanced?))))
                             first)
                closing (some-> unbalanced n/down n/closed-by)
                pos (n/end unbalanced)]
            (when (and closing (= closing key-name))
              {:changes {:from pos
                         :insert closing}
               :cursor (inc pos)}))
          (when-let [close-node-end (and empty
                                         (.iterate (n/tree state)
                                                   #js{:from (inc head)
                                                       :enter (fn [node-type start end]
                                                                (if
                                                                  (n/right-edge-type? node-type)
                                                                  end
                                                                  js/undefined))}))]
            {:cursor close-node-end})
          (u/insertion head key-name)))))

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
                                       (coll-pairs key-name)
                                       (handle-open state key-name)

                                       (#{\) \] \} \"} key-name)
                                       (handle-close state key-name))))))}))
