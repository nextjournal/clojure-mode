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
            [codemirror-next.clojure.util :as u :refer [from-to]]))

;; like CodeMirror's `closeBrackets` extension, but handles strings better
;; (inserts quoted quotes inside strings)

(def bracket-pairs "()[]{}\"\"")
(def brackets (vec (take-nth 2 bracket-pairs)))
(defn closing-bracket [open-bracket] (chars/pair-lookup bracket-pairs open-bracket))

#_(defn config-at-pos [^EditorState state ^number pos]
    (j/get (.languageDataAt state "closeBrackets" pos) 0 brackets))

(defn guard [x f] (when (f x) x))

(defn dispatch-some [^view/EditorView view tr]
  (if (some? tr)
    (do (.dispatch view tr)
        true)
    false))

(defn node-start [^EditorState state ^number pos]
  (let [^js tree (.. state -tree (resolve (inc pos)))]
    (and (.-parent tree) (== pos (.-start tree)))))

(defn node-end [^EditorState state ^number pos]
  (let [^js tree (.. state -tree (resolve pos))]
    (and (.-parent tree) (== (inc pos) (.-end tree)))))

(defn categorize [^EditorState state pos tok]
  ((.charCategorizer state pos) tok))

(j/defn remove-child [^:js {:keys [start end]}] (j/lit {:from start :to end}))

(defn ^js at-outside-right [^js tree pos]
  (-> (.resolve tree pos -1)
      (u/guard (every-pred node/brackets? #(== pos (j/get % :end))))))

(defn ^js at-inside-left [^js tree pos]
  (-> (.resolve tree pos -1)
      (u/guard (every-pred node/brackets? #(== pos (+ (node/left-edge-width %) (j/get % :start)))))))

(j/defn handle-backspace
  "- skips over closing brackets
   - when deleting an opening bracket of an empty list, removes both brackets"
  [^:js {:as ^EditorState state :keys [doc]}]
  (let [changes (.changeByRange state
                                (j/fn [^:js {:as range :keys [head empty anchor]}]
                                  (j/let [^:js {:as range :keys [from to]} (from-to head anchor)]
                                    (if (not empty)
                                      ;; delete selections as normal
                                      (j/lit {:range (sel/cursor from)
                                              :changes range})
                                      (or
                                       ;; hop inside collections from the right
                                       (when-some [outside-right (at-outside-right (.-tree state) from)]
                                         (j/lit {:range (sel/cursor (.-to (node/inner-span outside-right)))}))
                                       ;; if at inner-left...
                                       (when-some [inner-left (at-inside-left (.-tree state) from)]
                                         (if (node/empty? inner-left)
                                           ;; delete empty collections
                                           (j/lit {:range (sel/cursor (.-start inner-left))
                                                   :changes [(from-to (.-start inner-left) (.-end inner-left))]})
                                           ;; do not move cursor, nor delete, collections with content
                                           (j/lit {:range (sel/cursor from)})))
                                       (j/lit {:range (sel/cursor (dec from))
                                               :changes (from-to (dec from) from)}))))))]
    (.update state changes #js{:scrollIntoView true})))

(j/defn handle-same [^:js {:as state :keys [doc]} bracket-char]
  (let [changes (.changeByRange state
                                (j/fn [^:js {:as range :keys [from to head anchor empty]}]
                                  (if (not empty)           ;; selection
                                    (j/lit {:changes [{:insert bracket-char :from from}
                                                      {:insert bracket-char :from to}]
                                            :range (sel/range (+ anchor (count bracket-char))
                                                              (+ head (count bracket-char)))})
                                    (let [next-char (chars/next-char doc head)]
                                      (cond
                                        ;; always skip bracket in front of cursor
                                        (identical? next-char bracket-char)
                                        (j/lit {:range (sel/cursor (+ head (count bracket-char)))})

                                        ;; insert escaped quote inside strings
                                        (and (identical? bracket-char \")
                                             (= "String" (-> state .-tree (.resolve head) (j/get-in [:type :name]))))
                                        (j/lit {:range (sel/cursor (+ head 2))
                                                :changes {:insert (str \\ bracket-char)
                                                          :from from}})

                                        ;; insert double bracket
                                        :else (j/lit {:range (sel/cursor (inc head))
                                                      :changes {:insert (str bracket-char bracket-char)
                                                                :from from}}))))))]
    (.update state changes #js{:scrollIntoView true})))

(defn handle-open [^EditorState state ^string open ^string close]
  (let [changes
        (.changeByRange state
                        (j/fn [^:js {:as range :keys [from to head anchor empty]}]
                          (if (not empty)
                            (j/lit {:changes [{:insert open :from from}
                                              {:insert close :from to}]
                                    :range (sel/range (+ anchor (count open)) (+ head (count open)))})
                            (j/lit {:changes {:insert (str open close)
                                              :from head}
                                    :range (sel/cursor (+ head (count open)))}))))]
    (.update state changes #js{:scrollIntoView true})))

(j/defn handle-close [^:js {:as state :keys [doc]
                            {:keys [primaryIndex ranges]} :selection} ^string close]
  (when-some [moved (reduce (j/fn [out ^:js {:keys [empty head]}]
                              (if (and empty (identical? close (chars/next-char doc head)))
                                (j/push! out (sel/cursor (+ head (count close))))
                                (reduced nil))) #js[] ranges)]
    (.update state #js{:selection (sel/create moved primaryIndex)
                       :scrollIntoView true})))

(defn handle-insertion [^EditorState state key-to-insert]
  #_(config-at-pos state (j/get-in state [:selection :primary :head]))
  (->> brackets
       (reduce (fn [_ open-bracket]
                 (let [close-bracket (chars/pair-lookup bracket-pairs open-bracket)]
                   (cond (identical? key-to-insert open-bracket)
                         (reduced (if (identical? close-bracket open-bracket)
                                    (handle-same state open-bracket)
                                    (handle-open state open-bracket close-bracket)))
                         (identical? key-to-insert close-bracket)
                         (reduced (handle-close state close-bracket))))) nil)))

(def extension
  (.domEventHandlers view/EditorView
                     #js{:keydown
                         (j/fn [^:js {:as event :keys [ctrlKey metaKey keyCode]} ^:js {:as view :keys [state]}]
                           (cond (or ctrlKey metaKey) false
                                 ;; backspace
                                 (== 8 keyCode) (dispatch-some view (handle-backspace state))
                                 :else
                                 (let [^string key (keyName event)]
                                   (cond (> (count key) 2) false
                                         (and (== (count key) 2) (== 1 (text/codePointSize (text/codePointAt key 0)))) false
                                         :else (dispatch-some view (handle-insertion state key))))))}))
