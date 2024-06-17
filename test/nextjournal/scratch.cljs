(ns nextjournal.scratch
  (:require [nextjournal.clojure-mode.commands :as commands]
            [nextjournal.clojure-mode :as cm-clojure]
            [nextjournal.clojure-mode.extensions.eval-region :as eval-region]
            [nextjournal.clojure-mode.test-utils :as test-utils]))

(comment
  (def extensions
    (.concat cm-clojure/default-extensions (eval-region/extension #js {})))

  (def apply-f (partial test-utils/apply-f extensions))

  (js/console.log "a ;; hello\n(|)")
  (js/console.log (apply-f (commands/slurp -1) "a ;; hello\n(|)")))

