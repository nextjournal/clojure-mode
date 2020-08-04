(ns codemirror-next.clojure-tests
  (:require [cljs.test :refer [is are testing deftest]]
            [codemirror-next.clojure :as cm-clojure]
            [codemirror-next.test-utils :as test-utils]
            [codemirror-next.clojure.extensions.close-brackets :as close-brackets]))

;; TODO
;; set up testing flow

(test-utils/test #(close-brackets/handle-open % "(") cm-clojure/extensions
                 "|" "(|)"
                 "(|" "((|)"
                 "|(" "(|)("
                 "|)" "(|))"
                 "#|" "#(|)")

(test-utils/test #(close-brackets/handle-open % \") cm-clojure/extensions
                 "|" "\"|\""
                 "\"|\"" "\"\\\"|\""
                 )

(test-utils/test close-brackets/handle-backspace cm-clojure/extensions
                 "|" "|"
                 "(|" "|"
                 "()|" "(|)"
                 "#|()" "|()"
                 "[[]]|" "[[]|]"
                 )



