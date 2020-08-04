(ns codemirror-next.clojure.indent
  (:require ["@codemirror/next/syntax" :as syntax]
            ["@codemirror/next/state" :refer [EditorState IndentContext]]
            [codemirror-next.clojure.node :as node]
            [applied-science.js-interop :as j]
            [codemirror-next.clojure.commands :as commands]))

;; CodeMirror references
;; IndentContext https://codemirror.net/6/docs/ref/#state.IndentContext
;; indentation facet: https://codemirror.net/6/docs/ref/#state.EditorState%5Eindentation
;; indentation commands: https://codemirror.net/6/docs/ref/#commands.indentSelection

;; Clojure formatting reference
;; https://tonsky.me/blog/clojurefmt/

(j/defn indent-node-props [^:js {type-name :name :as type}]
  (j/fn [^:js {:as ^js context :keys [pos unit node ^js state]}]
    (cond (= "Program" type-name)
          0

          (node/coll? type-name)
          (let [left-bracket-end (.. node -firstChild -end)]
            (cond-> (.column context left-bracket-end)
              ;; start at the inner-left edge of the coll.
              ;; if it's a list beginning with a symbol, add 1 space.
              (and (= "List" (node/name node))
                   (= "Operator" (some-> node
                                         (.childAfter (.-end (.-firstChild node)))
                                         node/name)))
              (+ 1)))
          :else -1)))

(def props (.add syntax/indentNodeProp
                 indent-node-props))

(defn indent-spaces [n]
  (loop [^string s ""
         i 0]
    (if (== i n)
      s
      (recur (str s " ")
             (inc i)))))

(j/defn indent-all [^:js {:keys [^js state dispatch]}]
  (let [updated #js{}
        context (new IndentContext state (fn [start] (j/get updated start -1)))
        get-indentation (fn [^js context pos]
                          (->> (.. context -state (facet (.-indentation EditorState)))
                               (reduce
                                (fn [out f]
                                  (let [v (f context pos)]
                                    (if (> v -1) (reduced v) out)))
                                -1)))]
    (commands/update-lines state dispatch
      (fn [from value]
        (let [indent (get-indentation context from)]
          (when-not (< indent 0)
            (let [^string current-spaces (aget (.exec #"^\s*" value) 0)
                  expected-spaces (indent-spaces indent)]
              (when-not (identical? current-spaces expected-spaces)
                (j/!set updated from indent)
                #js{:from from :to (+ from (count current-spaces)) :insert expected-spaces}))))))))

(j/defn prefix-all [prefix ^:js {:keys [^js state dispatch]}]
  (commands/update-lines state dispatch
    (fn [from _ _] #js{:from from :insert prefix})))
