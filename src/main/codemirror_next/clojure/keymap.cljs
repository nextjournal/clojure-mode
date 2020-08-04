(ns codemirror-next.clojure.keymap
  (:require ["@codemirror/next/commands" :as commands :refer [defaultKeymap]]
            ["@codemirror/next/history" :as history :refer [historyKeymap]]
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

(do
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
   (->> [commands/standardKeymap historyKeymap]
        (mapcat #(js->clj % :keywordize-keys true))
        group
        cljs.pprint/pprint)))

(def builtin-keymap
  {:cursorLineStart
   [{:mac "Cmd-ArrowLeft", :shift :selectLineStart}
    {:mac "Ctrl-a", :shift :selectLineStart}],
   :cursorLineDown
   [{:key "ArrowDown", :shift :selectLineDown}
    {:mac "Ctrl-n", :shift :selectLineDown}],
   :selectAll [{:key "Mod-a"}],
   :cursorLineBoundaryForward
   [{:key "End", :shift :selectLineBoundaryForward}],
   :deleteCharBackward [{:key "Backspace"} {:mac "Ctrl-h"}],
   :redo [{:key "Mod-y", :mac "Mod-Shift-z", :preventDefault true}],
   :insertNewlineAndIndent [{:key "Enter"}],
   :cursorLineBoundaryBackward
   [{:key "Home", :shift :selectLineBoundaryBackward}],
   :cursorGroupLeft
   [{:key "Mod-ArrowLeft",
     :mac "Alt-ArrowLeft",
     :shift :selectGroupLeft}],
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
   :undo [{:key "Mod-z", :preventDefault true}],
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
   :cursorGroupRight
   [{:key "Mod-ArrowRight",
     :mac "Alt-ArrowRight",
     :shift :selectGroupRight}],
   :cursorLineEnd
   [{:mac "Cmd-ArrowRight", :shift :selectLineEnd}
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
   :redoSelection
   [{:key "Alt-u", :mac "Mod-Shift-u", :preventDefault true}],
   :cursorDocStart
   [{:mac "Cmd-ArrowUp", :shift :selectDocStart}
    {:key "Mod-Home", :shift :selectDocStart}
    {:mac "Alt-<"}]})

(def paredit-keymap
  {:cursorSyntaxLeft
   [{:key "Alt-ArrowLeft" :shift :selectSyntaxLeft}]
   :cursorSyntaxRight
   [{:key "Alt-ArrowRight" :shift :selectSyntaxRight}]
   :indent
   [{:key "Alt-Tab"}]
   :unwrap
   [{:key "Alt-s" :preventDefault true}]
   :kill
   [{:key "Ctrl-k" :preventDefault true}]})

(def default-keymap
  (merge-with conj builtin-keymap paredit-keymap))

(comment
 (ungroup default-keymap))



