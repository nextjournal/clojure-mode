import * as squint_core from 'squint-cljs/core.js';
import * as commands from '@codemirror/commands';
import * as cmd from './commands.mjs';
var update_some = (function (m, updates) {
return squint_core.reduce_kv((function (m, k, f) {
let temp__27741__auto__1 = squint_core.get(m, k);
let test__78824__auto__2 = squint_core.nil_QMARK_(temp__27741__auto__1);
if (test__78824__auto__2 != null && test__78824__auto__2 !== false) {
return squint_core.dissoc(m, k);} else {
let existing3 = temp__27741__auto__1;
return squint_core.assoc(m, k, (function () {
 let test__78824__auto__4 = (function () {
 let c__28208__auto__5 = Function;
let x__28209__auto__6 = f;
let ret__28210__auto__7 = (x__28209__auto__6 instanceof c__28208__auto__5);
return ret__28210__auto__7;
})();
if (test__78824__auto__4 != null && test__78824__auto__4 !== false) {
return f(existing3);} else {
return squint_core.get(f, existing3);}
})());}
}), m, updates);
});
var serialize = (function (command) {
return update_some(command, ({ "run": cmd.reverse_index, "shift": cmd.reverse_index }));
});
var deserialize = (function (command) {
return update_some(command, ({ "run": cmd.index, "shift": cmd.index }));
});
var group = (function (commands) {
return squint_core.reduce((function (out, p__59) {
let map__12 = p__59;
let cmd3 = map__12;
let run4 = squint_core.get(map__12, "run");
return squint_core.update(out, run4, squint_core.fnil(squint_core.conj, []), squint_core.dissoc(cmd3, "run"));
}), ({  }), squint_core.map(serialize, commands));
});
var ungroup = (function (commands) {
return squint_core.reduce_kv((function (out, k, bindings) {
return squint_core.into(out, squint_core.map((function (_PERCENT_1) {
return deserialize(squint_core.assoc(_PERCENT_1, "run", k));
}), bindings));
}), [], commands);
});
null;
var builtin_keymap_STAR_ = ({ "cursorLineDown": [({ "key": "ArrowDown", "shift": "selectLineDown" }), ({ "mac": "Ctrl-n", "shift": "selectLineDown" })], "selectAll": [({ "key": "Mod-a" })], "cursorLineBoundaryForward": [({ "key": "End", "shift": "selectLineBoundaryForward" })], "deleteCharBackward": [({ "key": "Backspace" }), ({ "mac": "Ctrl-h" })], "cursorLineBoundaryBackward": [({ "key": "Home", "shift": "selectLineBoundaryBackward", "mac": "Ctrl-a" }), ({ "mac": "Cmd-ArrowLeft", "shift": "selectLineBoundaryBackward" })], "deleteCharForward": [({ "key": "Delete" }), ({ "mac": "Ctrl-d" })], "cursorCharLeft": [({ "key": "ArrowLeft", "shift": "selectCharLeft" }), ({ "mac": "Ctrl-b", "shift": "selectCharLeft" })], "cursorGroupBackward": [({ "mac": "Alt-b", "shift": "selectGroupBackward" })], "cursorDocEnd": [({ "mac": "Cmd-ArrowDown", "shift": "selectDocEnd" }), ({ "key": "Mod-End", "shift": "selectDocEnd" }), ({ "mac": "Alt->" })], "deleteGroupBackward": [({ "key": "Mod-Backspace", "mac": "Alt-Backspace" }), ({ "mac": "Ctrl-Alt-h" })], "deleteGroupForward": [({ "key": "Mod-Delete", "mac": "Ctrl-Alt-Backspace" }), ({ "mac": "Alt-Delete" }), ({ "mac": "Alt-d" })], "cursorPageDown": [({ "mac": "Ctrl-ArrowDown", "shift": "selectPageDown" }), ({ "key": "PageDown", "shift": "selectPageDown" }), ({ "mac": "Ctrl-v" })], "cursorPageUp": [({ "mac": "Ctrl-ArrowUp", "shift": "selectPageUp" }), ({ "key": "PageUp", "shift": "selectPageUp" }), ({ "mac": "Alt-v" })], "cursorLineEnd": [({ "mac": "Cmd-ArrowRight" }), ({ "mac": "Ctrl-e", "shift": "selectLineEnd" })], "cursorGroupForward": [({ "mac": "Alt-f", "shift": "selectGroupForward" })], "undoSelection": [({ "key": "Mod-u", "preventDefault": true })], "cursorCharRight": [({ "key": "ArrowRight", "shift": "selectCharRight" }), ({ "mac": "Ctrl-f", "shift": "selectCharRight" })], "splitLine": [({ "mac": "Ctrl-o" })], "transposeChars": [({ "mac": "Ctrl-t" })], "cursorLineUp": [({ "key": "ArrowUp", "shift": "selectLineUp" }), ({ "mac": "Ctrl-p", "shift": "selectLineUp" })], "cursorDocStart": [({ "mac": "Cmd-ArrowUp", "shift": "selectDocStart" }), ({ "key": "Mod-Home", "shift": "selectDocStart" }), ({ "mac": "Alt-<" })] });
var paredit_keymap_STAR_ = ({ "indent": [({ "key": "Tab", "doc": "Indent document (or selection)" })], "nav-left": [({ "key": "Alt-ArrowLeft", "shift": "nav-select-left", "doc": "Move cursor one unit to the left (shift: selects this region)", "preventDefault": true })], "enter-and-indent": [({ "key": "Enter", "doc": "Insert newline and indent" })], "selection-grow": [({ "doc": "Grow selections", "key": "Alt-ArrowUp" }), ({ "key": "Mod-1" })], "kill": [({ "key": "Ctrl-k", "doc": "Remove all forms from cursor to end of line" })], "slurp-forward": [({ "key": "Ctrl-ArrowRight", "doc": "Expand collection to include form to the right", "preventDefault": true }), ({ "key": "Mod-Shift-k", "preventDefault": true })], "barf-forward": [({ "key": "Ctrl-ArrowLeft", "doc": "Shrink collection forwards by one form", "preventDefault": true }), ({ "key": "Mod-Shift-j", "preventDefault": true })], "barf-backward": [({ "doc": "Shrink collection backwards by one form", "key": "Ctrl-Alt-ArrowRight" })], "nav-right": [({ "key": "Alt-ArrowRight", "shift": "nav-select-right", "doc": "Move cursor one unit to the right (shift: selects this region)", "preventDefault": true })], "slurp-backward": [({ "doc": "Grow collection backwards by one form", "key": "Ctrl-Alt-ArrowLeft", "preventDefault": true })], "unwrap": [({ "key": "Alt-s", "doc": "Lift contents of collection into parent", "preventDefault": true })], "selection-return": [({ "doc": "Shrink selections", "key": "Alt-ArrowDown" }), ({ "key": "Mod-2" })] });
var builtin = ungroup(builtin_keymap_STAR_);
var paredit = ungroup(paredit_keymap_STAR_);
var complete = paredit.concat(builtin);
null;
squint_core.prn("keymap-loaded");

export { serialize, ungroup, group, complete, paredit_keymap_STAR_, update_some, paredit, builtin, builtin_keymap_STAR_, deserialize }
