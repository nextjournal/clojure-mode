(ns codemirror-next.clojure.indent
  (:require ["@codemirror/next/syntax" :as syntax]
            [codemirror-next.clojure.node :as node]
            [applied-science.js-interop :as j]))

(j/defn indent-node-props [^:js {type-name :name :as type}]
        (j/fn [^:js {:as context :keys [unit node ^js state]}]
              (if-some [closest-coll (node/closest node (comp node/coll? node/type-name))]
                (let [node-indent (- (.-start closest-coll)
                                     (.. state -doc (lineAt (.-start closest-coll)) -from))]
                  (+ node-indent
                     (if (and (= (node/type-name closest-coll) "List")
                              (= "Operator" (j/get-in closest-coll [:firstChild :type :name])))
                       unit
                       (node/left-edge-width type-name))))
                -1)))

(def props (.add syntax/indentNodeProp
                 indent-node-props))
