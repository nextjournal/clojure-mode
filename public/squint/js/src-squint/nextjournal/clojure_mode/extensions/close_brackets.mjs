import * as squint_core from 'squint-cljs/core.js';
import { keyName } from 'w3c-keyname';
import * as view from '@codemirror/view';
import { EditorState, EditorSelection, Transaction, CharCategory, Extension, Prec } from '@codemirror/state';
import * as n from 'nextjournal.clojure-mode.node';
import * as u from 'nextjournal.clojure-mode.util';
import { from_to } from 'nextjournal.clojure-mode.util';
import * as str from 'squint-cljs/string.js';
var in_string_QMARK_ = (function (state, pos) {
return new Set(["StringContent", "String"])(nextjournal.clojure_mode.node.name(nextjournal.clojure_mode.node.tree(state, pos)));
})
;
var escaped_QMARK_ = (function (state, pos) {
return ("\\" === state["doc"].slice(max(0, (pos - 1)), pos).toString());
})
;
var backspace_backoff = (function (state, from, to) {
if (((function () {
 let G__12 = nextjournal.clojure_mode.node.node_BAR_(state, (from - 1));
if (squint_core.nil_QMARK_(G__12)) {
return null;} else {
return nextjournal.clojure_mode.util.guard(G__12, nextjournal.clojure_mode.node.line_comment_QMARK_);}
})() && !str.blank_QMARK_(nextjournal.clojure_mode.util.line_content_at(state, from)))) {
return ({ "cursor": (from - 1) });} else {
return nextjournal.clojure_mode.util.deletion(from, to);}
})
;
j.defn(handle_backspace, "- skips over closing brackets\n   - when deleting an opening bracket of an empty list, removes both brackets", [({ "as": state, "keys": [doc] })], (((1 === state["selection"]["ranges"]["length"]) && (function () {
 let range3 = j.get_in(state, ["selection", "ranges", 0]);
return (range3["empty"] && (0 === range3["from"]));
})())) ? (null) : (nextjournal.clojure_mode.util.update_ranges(state, ({ "annotations": nextjournal.clojure_mode.util.user_event_annotation("delete") }), j.fn([({ "as": squint_core.range, "keys": [head, squint_core.empty, anchor] })], j.let$([({ "as": squint_core.range, "from": "from", "to": "to" }), from_to(head, anchor), node_BAR_, nextjournal.clojure_mode.node.tree(state).resolveInner(from, -1), parent, node_BAR_["parent"]], ((!squint_core.empty || ("StringContent" === nextjournal.clojure_mode.node.name(nextjournal.clojure_mode.node.tree(state, from, -1))) || (parent && !nextjournal.clojure_mode.node.balanced_QMARK_(parent) && nextjournal.clojure_mode.node.left_edge_QMARK_(node_BAR_)))) ? (nextjournal.clojure_mode.util.deletion(from, to)) : (((nextjournal.clojure_mode.node.right_edge_QMARK_(node_BAR_) && (from == nextjournal.clojure_mode.node.end(parent)))) ? (({ "cursor": (from - 1) })) : ((((nextjournal.clojure_mode.node.start_edge_QMARK_(node_BAR_) || nextjournal.clojure_mode.node.same_edge_QMARK_(node_BAR_)) && (nextjournal.clojure_mode.node.start(node_BAR_) == nextjournal.clojure_mode.node.start(parent)))) ? ((nextjournal.clojure_mode.node.empty_QMARK_(nextjournal.clojure_mode.node.up(node_BAR_))) ? (({ "cursor": nextjournal.clojure_mode.node.start(parent), "changes": [from_to(nextjournal.clojure_mode.node.start(parent), nextjournal.clojure_mode.node.end(parent))] })) : (({ "cursor": from }))) : (("else") ? (backspace_backoff(state, from, to)) : (null)))))))));
var coll_pairs = ({ "(": ")", "[": "]", "{": "}", "\"": "\"" })
;
var handle_open = (function (state, open) {
let close4 = coll_pairs(open);
return nextjournal.clojure_mode.util.update_ranges(state, ({ "annotations": nextjournal.clojure_mode.util.user_event_annotation("input") }), j.fn([({ "keys": [from, to, head, anchor, squint_core.empty] })], (in_string_QMARK_(state, from)) ? (((open === "\"")) ? (nextjournal.clojure_mode.util.insertion(head, "\\\"")) : (nextjournal.clojure_mode.util.insertion(from, to, open))) : ((escaped_QMARK_(state, from)) ? (nextjournal.clojure_mode.util.insertion(from, to, open)) : (("else") ? ((squint_core.empty) ? (({ "changes": ({ "insert": squint_core.str(open, close4), "from": head }), "cursor": (head + squint_core.count(open)) })) : (({ "changes": [({ "insert": open, "from": from }), ({ "insert": close4, "from": to })], "from-to": [(anchor + squint_core.count(open)), (head + squint_core.count(open))] }))) : (null)))));
})
;
var handle_close = (function (state, key_name) {
return nextjournal.clojure_mode.util.update_ranges(state, ({ "annotations": nextjournal.clojure_mode.util.user_event_annotation("input") }), j.fn([({ "as": squint_core.range, "keys": [squint_core.empty, head, from, to] })], ((in_string_QMARK_(state, from) || escaped_QMARK_(state, from))) ? (nextjournal.clojure_mode.util.insertion(from, to, key_name)) : ((squint_core.empty) ? (((function () {
 let unbalanced5 = (function () {
 let G__67 = nextjournal.clojure_mode.node.tree(state, head, -1);
let G__68 = (squint_core.nil_QMARK_(G__67)) ? (null) : (nextjournal.clojure_mode.node.ancestors(G__67));
let G__69 = (squint_core.nil_QMARK_(G__68)) ? (null) : (squint_core.filter(every_pred(nextjournal.clojure_mode.node.coll_QMARK_, squint_core.complement(nextjournal.clojure_mode.node.balanced_QMARK_)), G__68));
if (squint_core.nil_QMARK_(G__69)) {
return null;} else {
return squint_core.first(G__69);}
})();
let closing10 = (function () {
 let G__1112 = unbalanced5;
let G__1113 = (squint_core.nil_QMARK_(G__1112)) ? (null) : (nextjournal.clojure_mode.node.down(G__1112));
if (squint_core.nil_QMARK_(G__1113)) {
return null;} else {
return nextjournal.clojure_mode.node.closed_by(G__1113);}
})();
let pos14 = (function () {
 let G__1516 = unbalanced5;
if (squint_core.nil_QMARK_(G__1516)) {
return null;} else {
return nextjournal.clojure_mode.node.end(G__1516);}
})();
if ((closing10 && (closing10 === key_name))) {
return ({ "changes": ({ "from": pos14, "insert": closing10 }), "cursor": (pos14 + 1) });}
})() || (function () {
 let temp__25187__auto__17 = (function () {
 let temp__25187__auto__18 = nextjournal.clojure_mode.node.terminal_cursor(nextjournal.clojure_mode.node.tree(state), head, 1);
if (temp__25187__auto__18) {
let cursor19 = temp__25187__auto__18;
while(true){
if (nextjournal.clojure_mode.node.right_edge_type_QMARK_(cursor19["type"])) {
return nextjournal.clojure_mode.node.end(cursor19);} else {
if (cursor19.next()) {
continue;
}};break;
}
}
})();
if (temp__25187__auto__17) {
let close_node_end20 = temp__25187__auto__17;
return ({ "cursor": close_node_end20 });}
})() || ({ "cursor": head }))) : (null))));
})
;
j.defn(handle_backspace_cmd, [({ "as": view, "keys": [state] })], nextjournal.clojure_mode.util.dispatch_some(view, handle_backspace(state)));
var handle_open_cmd = (function (key_name) {
return j.fn([({ "as": view, "keys": [state] })], nextjournal.clojure_mode.util.dispatch_some(view, handle_open(state, key_name)));
})
;
var handle_close_cmd = (function (key_name) {
return j.fn([({ "as": view, "keys": [state] })], nextjournal.clojure_mode.util.dispatch_some(view, handle_close(state, key_name)));
})
;
var guard_scope = (function (cmd) {
return j.fn([({ "as": view, "keys": [state] })], ((nextjournal.clojure_mode.node.embedded_QMARK_(state) || nextjournal.clojure_mode.node.within_program_QMARK_(state))) ? (cmd(view)) : (false));
})
;
var extension = (function () {
return Prec.high(view.keymap.of(j.lit([({ "key": "Backspace", "run": guard_scope(j.fn([({ "as": view, "keys": [state] })], nextjournal.clojure_mode.util.dispatch_some(view, handle_backspace(state)))) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })])));
})
;

export { handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
