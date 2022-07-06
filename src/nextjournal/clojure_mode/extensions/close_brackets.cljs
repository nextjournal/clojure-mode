(ns nextjournal.clojure-mode.extensions.close-brackets
  (:require ["w3c-keyname" :refer [keyName]]
            ["@codemirror/view" :as view]
            ["@codemirror/state" :refer [EditorState
                                         EditorSelection
                                         Transaction
                                         CharCategory
                                         Extension]]
            [applied-science.js-interop :as j]
            [nextjournal.clojure-mode.node :as n]
            [nextjournal.clojure-mode.util :as u :refer [from-to]]
            [clojure.string :as str]))

(defn in-string? [state pos]
  (#{"StringContent" "String"} (n/name (n/tree state pos))))

(defn escaped? [state pos]
  (= \\ (.. state -doc (slice (max 0 (dec pos)) pos) toString)))

(defn backspace-backoff [state from to]
  (if
   ;; handle line-comments (backspace should not drag forms up into line comments)
   (and
    ;; we are directly in front of a line-comment
    (some-> (n/node| state (dec from)) (u/guard n/line-comment?))
    ;; current line is blank
    (not (str/blank? (u/line-content-at state from))))
    {:cursor (dec from)}
    (u/deletion from to)))

(j/defn handle-backspace
  "- skips over closing brackets
   - when deleting an opening bracket of an empty list, removes both brackets"
  [^:js {:as ^EditorState state :keys [doc]}]
  (when-not (and (= 1 (.. state -selection -ranges -length))
                 (let [^js range (j/get-in state [:selection :ranges 0])]
                   (and (.-empty range) (= 0 (.-from range)))))
    (u/update-ranges state
      #js{:annotations (u/user-event-annotation "delete")}
      (j/fn [^:js {:as range :keys [head empty anchor]}]
        (j/let [^:js {:as range from :from to :to} (from-to head anchor)
                ^js node| (.resolve (n/tree state) from -1) ;; node immediately to the left of cursor
                ^js parent (.-parent node|)]
          (cond

            (or (not empty)                                 ;; selection
                (= "StringContent" (n/name (n/tree state from -1))) ;; inside a string
                (and parent (not (n/balanced? parent)) (n/left-edge? node|))) ;; unbalanced left-paren
            (u/deletion from to)

            ;; entering right edge of collection - skip
            (and (n/right-edge? node|) (== from (n/end parent)))
            {:cursor (dec from)}

            ;; inside left edge of collection - remove or stop
            (and (or (n/start-edge? node|)
                     (n/same-edge? node|)) (== (n/start node|) (n/start parent)))
            (if (n/empty? (n/up node|))
              ;; remove empty collection
              {:cursor  (n/start parent)
               :changes [(from-to (n/start parent) (n/end parent))]}
              ;; stop cursor at inner-left of collection
              {:cursor from})

            :else (backspace-backoff state from to)))))))

(def coll-pairs {"(" ")"
                 "[" "]"
                 "{" "}"
                 \" \"})

(defn handle-open [^EditorState state ^string open]
  (let [^string close (coll-pairs open)]
    (u/update-ranges state
      #js{:annotations (u/user-event-annotation "input")}
      (j/fn [^:js {:keys [from to head anchor empty]}]
        (cond
          (in-string? state from)
          (if (= open \")
            (u/insertion head "\\\"")
            (u/insertion from to open))
          ;; allow typing escaped bracket
          (escaped? state from)
          (u/insertion from to open)
          :else
          (if empty
            {:changes {:insert (str open close)
                       :from   head}
             :cursor  (+ head (count open))}
            ;; wrap selections with brackets
            {:changes [{:insert open :from from}
                       {:insert close :from to}]
             :from-to [(+ anchor (count open)) (+ head (count open))]}))))))

(defn handle-close [state key-name]
  (u/update-ranges state
    #js{:annotations (u/user-event-annotation "input")}
    (j/fn [^:js {:as range :keys [empty head from to]}]
      (if (or (in-string? state from)
              (escaped? state from))
        (u/insertion from to key-name)
        (when empty
          (or
           ;; close unbalanced (open) collection
           (let [unbalanced (some->
                             (n/tree state head -1)
                             (n/ancestors)
                             (->> (filter (every-pred n/coll? (complement n/balanced?))))
                             first)
                 closing (some-> unbalanced n/down n/closed-by)
                 pos (some-> unbalanced n/end)]
             (when (and closing (= closing key-name))
               {:changes {:from   pos
                          :insert closing}
                :cursor  (inc pos)}))

           ;; jump to next closing bracket
           (when-let [close-node-end
                      (when-let [^js cursor (-> state n/tree
                                                (n/terminal-cursor head 1))]
                        (loop []
                          (if (n/right-edge-type? (.-type cursor))
                            (n/end cursor)
                            (when (.next cursor)
                              (recur)))))]
             {:cursor close-node-end})
           ;; no-op
           {:cursor head}
           #_(u/insertion head key-name)))))))

(j/defn handle-backspace-cmd [^:js {:as view :keys [state]}]
  (u/dispatch-some view (handle-backspace state)))

(defn handle-open-cmd [key-name]
  (j/fn [^:js {:as view :keys [state]}]
    (u/dispatch-some view (handle-open state key-name))))

(defn handle-close-cmd [key-name]
  (j/fn [^:js {:as view :keys [state]}]
    (u/dispatch-some view (handle-close state key-name))))

(defn extension []
  (.of view/keymap
       (j/lit
        [{:key "Backspace"
          :run (j/fn [^:js {:as view :keys [state]}]
                 (u/dispatch-some view (handle-backspace state)))}
         {:key "(" :run (handle-open-cmd "(")}
         {:key "[" :run (handle-open-cmd "[")}
         {:key "{" :run (handle-open-cmd "{")}
         {:key \" :run (handle-open-cmd \")}
         {:key \) :run (handle-close-cmd \))}
         {:key \] :run (handle-close-cmd \])}
         {:key \} :run (handle-close-cmd \})}])))
