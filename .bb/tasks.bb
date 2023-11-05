(ns tasks
  (:require
   [babashka.tasks :refer [shell]]
   [clojure.string :as str]))

(defn watch-cljs []
  (let [watch (requiring-resolve 'pod.babashka.fswatcher/watch)
        ret (watch "src-squint"
                   (fn [{:keys [type path]}]
                     (when (and (#{:write :write|chmod :create} type)
                                (or (str/ends-with? path ".cljs")
                                    (str/ends-with? path ".cljc"))
                                ;; emacs shit:
                                (not (str/includes? path ".#")))
                       (shell {:continue true
                               :err :inherit
                               :std :inherit} "yarn squint compile --output-dir public/squint/js" path)))
                   {:recursive true})]
    (println (str "Started watching: " ret))
    @(promise)))
