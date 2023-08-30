(ns tasks
  (:require
   [babashka.tasks :refer [shell]]
   [clojure.string :as str]))

(defn watch-cljs []
  (let [watch (requiring-resolve 'pod.babashka.fswatcher/watch)
        ret (watch "."
                   (fn [{:keys [type path]}]
                     (when (and (#{:write :write|chmod :create} type)
                                (str/ends-with? path ".cljs"))
                       (shell {:continue true
                               :err :inherit
                               :std :inherit} "yarn squint compile" path)))
                   {:recursive true})]
    (println (str "Started watching: " ret))
    @(promise)))
