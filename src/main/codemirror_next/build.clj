(ns codemirror-next.build
  (:refer-clojure :exclude [slurp])
  (:require [clojure.core :as core]))

(defmacro slurp [path] (core/slurp path))
