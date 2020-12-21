(ns codemirror-next.clojure.extensions.temp-selection
  (:require ["@codemirror/next/state" :as state :refer [StateEffect StateField]]
            ["@codemirror/next/view" :as view :refer [EditorView Decoration]]
            ["w3c-keyname" :refer [keyName]]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.util :as u]
            [codemirror-next.clojure.node :as n]
            [codemirror-next.clojure.extensions.selection-history :as sel-history]
            [codemirror-next.clojure.selections :as sel]
            [clojure.string :as str]))

(def event-name "tempselection")

(defn uppermost-edge-here [from node]
  (or (->> (iterate n/up node)
           (take-while (every-pred (complement n/top?)
                                   #(or (= from (n/end %))
                                        (= from (n/start %)))))
           (last))
      node))

(defn primary-selection [state]
  (-> (j/call-in state [:selection :asSingle])
      (j/get-in [:ranges 0])))

(defn node-before-cursor
  ([state] (node-before-cursor state (j/get (primary-selection state) :from)))
  ([^js state from]
   (some->> (n/nearest-touching state from -1)
            (#(when (or (n/terminal-type? (n/type %))
                        (= (n/start %) from)
                        (= (n/end %) from)) %))
            (uppermost-edge-here from)
            (n/balanced-range state))))

(defn selection-before-cursor [^js state]
  (u/update-ranges state
                   #js{:annotations (u/user-event-annotation event-name)}
                   (j/fn [^:js {:as range :keys [from to empty]}]
                     {:range (or (when empty
                                   (node-before-cursor state from))
                                 range)})))

(defn top-level-node [state]
  (->> (n/nearest-touching state (j/get (primary-selection state) :from) -1)
       (iterate n/up)
       (take-while identity)
       (reduce (fn [child parent]
                 (if (n/top? parent)
                   (or child parent)
                   parent)))))

(defn temp? [stack-item] (= event-name (:event stack-item)))

(j/defn return [^:js {:as view :keys [state dispatch]} num]
  (let [temp-count (->> (sel-history/stack state)
                        (take num)
                        (take-while
                         (every-pred temp?
                                     ;; avoid returning after other selection changes
                                     ;; (eg grow/shrink)
                                     (comp #(or (nil? %) (= event-name %)) :prev-event)))
                        count)]
    (when-let [selection (->> (sel-history/stack state)
                              (drop temp-count)
                              first
                              :selection)]
      (dispatch (.update state #js{:selection selection}))
      true)))

(j/defn insert-replace [^:js {:as view :keys [state dispatch]} text]
  (dispatch
   (u/update-ranges state
                    (j/fn [^:js {:as range :keys [from to]}]
                      {:changes [{:from from :to to :insert text}]}))))

(j/defn temp-backspace [^:js {:as view :keys [state]}]
  (u/dispatch-some view
                   (u/update-ranges state
                                    #js{:annotations (u/user-event-annotation "delete")}
                                    (j/fn [^:js {:keys [from to empty]}]
                                      (when-not empty
                                        (u/insertion from to ""))))))

(j/defn select-edge [dir ^:js {:as view :keys [state]}]
  (u/dispatch-some view
                   (u/update-ranges state
                                    #js{:annotations (u/user-event-annotation "keyboardselection")}
                                    (j/fn [^:js {:keys [from to]}]
                                      {:cursor (case dir 1 to -1 from)}))))

(defn as-selection [{:keys [modifier]
                     :or   {modifier "Alt"}}]
  (let [paste (fn [view]
                ;; paste will only work in Safari, after user has approved a request
                (.execCommand js/document "paste")
                true)
        copy (fn [view]
               (.execCommand js/document "copy")
               true)]
    #js[(view/keymap
         (j/lit [
                 ;; delete temporary selections
                 {:key   (str modifier "-Backspace")
                  :shift temp-backspace
                  :run   temp-backspace}

                 ;; copy and paste temporary selections
                 ;; note: paste doesn't work in many browsers
                 {:key   (str modifier "-c")
                  :shift copy
                  :run   copy}
                 {:key   (str modifier "-v")
                  :run   paste
                  :shift paste}

                 ;; when toplevel is selected, left/right should
                 ;; move cursor before/after
                 {:key (str modifier "-Shift-ArrowRight")
                  :run (partial select-edge 1)}
                 {:key (str modifier "-Shift-ArrowLeft")
                  :run (partial select-edge -1)}]))
        (.domEventHandlers view/EditorView
                           (j/lit {:keydown
                                   (j/fn [^js e ^:js {:as view :keys [state dispatch]}]
                                     (condp = (keyName e)
                                       modifier (dispatch (selection-before-cursor state))
                                       "Shift" (when (j/get e (str (str/lower-case modifier) "Key"))
                                                 (temp? (first (sel-history/stack state)))
                                                 (dispatch #js{:selection   (-> state top-level-node sel/range)
                                                               :annotations (u/user-event-annotation event-name)}))
                                       nil))
                                   :keyup
                                   (j/fn [e ^:js {:as view :keys [state dispatch]}]
                                     (condp = (keyName e)
                                       modifier (return view 2)
                                       "Shift" (return view 1)
                                       nil))}))]))

(defonce deco-effect (.define StateEffect))

(defonce deco-field
         (.define StateField
                  (j/lit
                   {:create  (constantly (.-none Decoration))
                    :update  (fn [value ^js tr]
                               (if-let [effect (first (filter #(.is ^js % deco-effect) (.-effects tr)))]
                                 (j/get effect :value)
                                 (if (.-selection tr)
                                   (.-none Decoration)
                                   (cond-> value
                                           (.-docChanged tr)
                                           (.map (.-changes tr))))))
                    :provide [(.-decorations EditorView)]})))

(defonce deco-spec (j/lit {:attributes {:style "background-color: #e4f8f9;"}}))

(defn empty-selection? [^js state]
  (.. state -selection -primary -empty))

(j/defn deco [^:js {:keys [from to]}]
  (-> (.mark Decoration deco-spec)
      (.range from to)))

(defn set-deco-tr [node]
  #js{:effects (.of deco-effect
                    (if node
                      (.set Decoration #js[(deco node)])
                      (.-none Decoration)))})

(defn has-deco? [^js state]
  (not= (.-none Decoration)
        (.field state deco-field)))

(defn temp-range [^js state]
  (if (.. state -selection -primary -empty)
    (node-before-cursor state)
    (.. state -selection -primary)))

(defn as-decoration [{:keys [modifier]
                      :or   {modifier "Alt"}}]
  #js[deco-field
      (.domEventHandlers view/EditorView
                         (j/lit {:keydown
                                 (j/fn [^js e ^:js {:as view :keys [state dispatch]}]
                                   (condp = (keyName e)
                                     modifier (dispatch (set-deco-tr (temp-range state)))
                                     "Shift" (when (j/get e (str (str/lower-case modifier) "Key"))
                                               (dispatch
                                                (set-deco-tr (top-level-node state))))
                                     nil))
                                 :keyup
                                 (j/fn [e ^:js {:as view :keys [^js state dispatch]}]
                                   (condp = (keyName e)
                                     modifier (dispatch (set-deco-tr nil))
                                     "Shift" (when (has-deco? state)
                                               (dispatch (set-deco-tr (temp-range state))))
                                     nil))}))])

(defn current-range [^js state]
  (or (when (.field state deco-field)
        (-> (.field state deco-field)
            (j/call :iter)
            (u/guard #(j/get % :value))))
      (.. state -selection -primary)))

(defn current-string [^js state]
  (some->> (current-range state)
           (u/range-str state)))
