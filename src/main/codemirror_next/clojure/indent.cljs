(ns codemirror-next.clojure.indent
  (:require ["@codemirror/next/syntax" :as syntax]
            [codemirror-next.clojure.node :as node]
            [applied-science.js-interop :as j]))

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

