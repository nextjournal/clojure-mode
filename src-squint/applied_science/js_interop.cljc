(ns applied-science.js-interop
  (:refer-clojure :exclude [defn get-in fn let select-keys assoc!]))

(defmacro lit [x] x)

(defmacro defn [& body]
  `(clojure.core/defn ~@body))

(defmacro get-in [& body]
  `(clojure.core/get-in ~@body))

(defmacro fn [& body]
  `(clojure.core/fn ~@body))

(defmacro let [& body]
  `(clojure.core/let ~@body))

(defmacro call-in [obj path & fs]
  `(.. ~obj ~@(map #(symbol (str "-" %)) path) ~@(map list fs)))

(defmacro call [obj f]
  (list (symbol (str "." f)) obj))

(defmacro !set [obj k v]
  `(do (cljs.core/set! (list (symbol (str ".-" ~(name k))) ~obj) ~v)
       ~obj))

(defmacro extend! [obj other]
  `(js/Object.assign ~obj ~other))

(defmacro push! [obj v]
  `(doto ~obj
     (.push ~v)))

(defmacro select-keys [obj ks]
  `(clojure.core/select-keys ~obj ~ks))

(defmacro assoc! [& body]
  `(clojure.core/assoc! ~@body))

