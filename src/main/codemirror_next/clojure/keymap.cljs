(ns codemirror-next.clojure.keymap
  (:require ["@codemirror/next/commands" :as commands :refer [defaultKeymap]]
            [clojure.set :as set]
            [codemirror-next.clojure.commands :as cmd]))

(defn update-some
  "Updates keys of map when key has value"
  [m updates]
  (reduce-kv (fn [m k f]
               (if-some [existing (get m k)]
                 (assoc m k (f existing))
                 (dissoc m k))) m updates))

;; (de)serializing commands from keyword-id to function
(defn serialize [command] (update-some command {:run cmd/reverse-index :shift cmd/reverse-index}))
(defn deserialize [command] (update-some command {:run cmd/index :shift cmd/index}))


(defn group
  "Returns a grouped map of bindings for a list of CodeMirror keymap entries"
  [commands]
  (->> commands
       (map serialize)
       (reduce (fn [out {:as cmd :keys [run]}]
                 (update out run (fnil conj []) (dissoc cmd :run))) {})))

(defn ungroup
  "Returns a list of CodeMirror keymap entries for a grouped map of bindings"
  [commands]
  (->> commands
       (reduce-kv
        (fn [out k bindings]
          (into out (map #(deserialize (assoc % :run k)) bindings))) [])
       (clj->js)))

(comment
 (->> [commands/standardKeymap #_historyKeymap]
      (mapcat #(js->clj % :keywordize-keys true))
      group
      cljs.pprint/pprint))

(def builtin-keymap*
  {:cursorLineDown
   [{:key "ArrowDown", :shift :selectLineDown}
    {:mac "Ctrl-n", :shift :selectLineDown}],
   :selectAll [{:key "Mod-a"}],
   :cursorLineBoundaryForward
   [{:key "End", :shift :selectLineBoundaryForward}],
   :deleteCharBackward [{:key "Backspace"} {:mac "Ctrl-h"}],
   :insertNewlineAndIndent [{:key "Enter"}],
   :cursorLineBoundaryBackward
   [{:key "Home", :shift :selectLineBoundaryBackward
     :mac "Ctrl-a"}
    {:mac "Cmd-ArrowLeft" :shift :selectLineBoundaryBackward}],
   :deleteCharForward [{:key "Delete"} {:mac "Ctrl-d"}],
   :cursorCharLeft
   [{:key "ArrowLeft", :shift :selectCharLeft}
    {:mac "Ctrl-b", :shift :selectCharLeft}],
   :cursorGroupBackward [{:mac "Alt-b", :shift :selectGroupBackward}],
   :cursorDocEnd
   [{:mac "Cmd-ArrowDown", :shift :selectDocEnd}
    {:key "Mod-End", :shift :selectDocEnd}
    {:mac "Alt->"}],
   :deleteGroupBackward
   [{:key "Mod-Backspace", :mac "Ctrl-Alt-Backspace"}
    {:mac "Ctrl-Alt-h"}],
   :deleteGroupForward
   [{:key "Mod-Delete", :mac "Alt-Backspace"}
    {:mac "Alt-Delete"}
    {:mac "Alt-d"}],
   :cursorPageDown
   [{:mac "Ctrl-ArrowDown", :shift :selectPageDown}
    {:key "PageDown", :shift :selectPageDown}
    {:mac "Ctrl-v"}],
   :cursorPageUp
   [{:mac "Ctrl-ArrowUp", :shift :selectPageUp}
    {:key "PageUp", :shift :selectPageUp}
    {:mac "Alt-v"}],
   :cursorLineEnd
   [{:mac "Cmd-ArrowRight"}
    {:mac "Ctrl-e", :shift :selectLineEnd}],
   :cursorGroupForward [{:mac "Alt-f", :shift :selectGroupForward}],
   :undoSelection [{:key "Mod-u", :preventDefault true}],
   :cursorCharRight
   [{:key "ArrowRight", :shift :selectCharRight}
    {:mac "Ctrl-f", :shift :selectCharRight}],
   :splitLine [{:mac "Ctrl-o"}],
   :transposeChars [{:mac "Ctrl-t"}],
   :cursorLineUp
   [{:key "ArrowUp", :shift :selectLineUp}
    {:mac "Ctrl-p", :shift :selectLineUp}],
   :cursorDocStart
   [{:mac "Cmd-ArrowUp", :shift :selectDocStart}
    {:key "Mod-Home", :shift :selectDocStart}
    {:mac "Alt-<"}]})

(def paredit-keymap*
  {:indent
   [{:key "Tab"
     :doc "Indent document (or selection)"}]
   :unwrap
   [{:key "Alt-s"
     :doc "Lift contents of collection into parent"
     :preventDefault true}]
   :kill
   [{:key "Ctrl-k"
     :doc "Remove all forms from cursor to end of line"
     :preventDefault true}]
   :nav-left
   [{:key "Alt-ArrowLeft"
     :shift :nav-select-left
     :doc "Move cursor one unit to the left (shift: selects this region)"
     :preventDefault true}]
   :nav-right
   [{:key "Alt-ArrowRight"
     :shift :nav-select-right
     :doc "Move cursor one unit to the right (shift: selects this region)"
     :preventDefault true}]

   :slurp-forward
   [{:key "Ctrl-ArrowRight"
     :doc "Expand collection to include form to the right"
     :preventDefault true}
    {:key "Mod-Shift-k" :preventDefault true}]
   :slurp-backward
   [{:doc "Grow collection backwards by one form"
     :key "Ctrl-Alt-ArrowLeft"
     :preventDefault true}]

   :barf-forward
   [{:key "Ctrl-ArrowLeft"
     :doc "Shrink collection forwards by one form"
     :preventDefault true}
    {:key "Mod-Shift-j" :preventDefault true}]
   :barf-backward
   [{:doc "Shrink collection backwards by one form"
     :key "Ctrl-Alt-ArrowRight"}]

   :selection-grow
   [{:doc "Grow selections"
     :key "Alt-ArrowUp"}
    {:key "Mod-1"}]
   :selection-return
   [{:doc "Shrink selections"
     :key "Alt-ArrowDown"}
    {:key "Mod-2"}]})

(def builtin (ungroup builtin-keymap*))
(def paredit (ungroup paredit-keymap*))
(def complete (.concat paredit builtin))

(comment
 (ungroup default-keymap))



