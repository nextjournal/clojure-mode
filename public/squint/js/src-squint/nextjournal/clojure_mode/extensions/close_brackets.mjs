import * as squint_core from 'squint-cljs/core.js';
import * as view from '@codemirror/view';
import { EditorState, Prec } from '@codemirror/state';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
import { from_to } from '../util.mjs';
import * as str from 'squint-cljs/string.js';
var in_string_QMARK_ = (function (state, pos) {
return new Set(["StringContent", "String"])(n.name(n.tree(state, pos)));
})
;
var escaped_QMARK_ = (function (state, pos) {
return ("\\" === state["doc"].slice(max(0, (pos - 1)), pos).toString());
})
;
var backspace_backoff = (function (state, from, to) {
if (((function () {
 let G__12 = n.node_BAR_(state, (from - 1));
if (squint_core.nil_QMARK_(G__12)) {
return null;} else {
return u.guard(G__12, n.line_comment_QMARK_);}
})() && !str.blank_QMARK_(u.line_content_at(state, from)))) {
return ({ "cursor": (from - 1) });} else {
return u.deletion(from, to);}
})
;
var handle_backspace = (function (p__3) {
let map__45 = p__3;
let state6 = map__45;
let doc7 = squint_core.get(map__45, "doc");
if (((1 === state6["selection"]["ranges"]["length"]) && (function () {
 let range8 = squint_core.get_in(state6, ["selection", "ranges", 0]);
return (range8["empty"] && (0 === range8["from"]));
})())) {
return null;} else {
return u.update_ranges(state6, ({ "annotations": u.user_event_annotation("delete") }), (function (p__9) {
let map__1011 = p__9;
let range12 = map__1011;
let head13 = squint_core.get(map__1011, "head");
let empty14 = squint_core.get(map__1011, "empty");
let anchor15 = squint_core.get(map__1011, "anchor");
let map__1617 = from_to(head13, anchor15);
let range18 = map__1617;
let from19 = squint_core.get(map__1617, "from");
let to20 = squint_core.get(map__1617, "to");
let node_BAR_21 = n.tree(state6).resolveInner(from19, -1);
let parent22 = node_BAR_21["parent"];
if ((!empty14 || ("StringContent" === n.name(n.tree(state6, from19, -1))) || (parent22 && !n.balanced_QMARK_(parent22) && n.left_edge_QMARK_(node_BAR_21)))) {
return u.deletion(from19, to20);} else {
if ((n.right_edge_QMARK_(node_BAR_21) && (from19 == n.end(parent22)))) {
return ({ "cursor": (from19 - 1) });} else {
if (((n.start_edge_QMARK_(node_BAR_21) || n.same_edge_QMARK_(node_BAR_21)) && (n.start(node_BAR_21) == n.start(parent22)))) {
if (n.empty_QMARK_(n.up(node_BAR_21))) {
return ({ "cursor": n.start(parent22), "changes": [from_to(n.start(parent22), n.end(parent22))] });} else {
return ({ "cursor": from19 });}} else {
if ("else") {
return backspace_backoff(state6, from19, to20);} else {
return null;}}}}
}));}
})
;
var coll_pairs = ({ "(": ")", "[": "]", "{": "}", "\"": "\"" })
;
var handle_open = (function (state, open) {
let close23 = coll_pairs(open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__24) {
let map__2526 = p__24;
let from27 = squint_core.get(map__2526, "from");
let to28 = squint_core.get(map__2526, "to");
let head29 = squint_core.get(map__2526, "head");
let anchor30 = squint_core.get(map__2526, "anchor");
let empty31 = squint_core.get(map__2526, "empty");
if (in_string_QMARK_(state, from27)) {
if ((open === "\"")) {
return u.insertion(head29, "\\\"");} else {
return u.insertion(from27, to28, open);}} else {
if (escaped_QMARK_(state, from27)) {
return u.insertion(from27, to28, open);} else {
if ("else") {
if (empty31) {
return ({ "changes": ({ "insert": squint_core.str(open, close23), "from": head29 }), "cursor": (head29 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from27 }), ({ "insert": close23, "from": to28 })], "from-to": [(anchor30 + squint_core.count(open)), (head29 + squint_core.count(open))] });}} else {
return null;}}}
}));
})
;
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__32) {
let map__3334 = p__32;
let range35 = map__3334;
let empty36 = squint_core.get(map__3334, "empty");
let head37 = squint_core.get(map__3334, "head");
let from38 = squint_core.get(map__3334, "from");
let to39 = squint_core.get(map__3334, "to");
if ((in_string_QMARK_(state, from38) || escaped_QMARK_(state, from38))) {
return u.insertion(from38, to39, key_name);} else {
if (empty36) {
return ((function () {
 let unbalanced40 = (function () {
 let G__4142 = n.tree(state, head37, -1);
let G__4143 = (squint_core.nil_QMARK_(G__4142)) ? (null) : (n.ancestors(G__4142));
let G__4144 = (squint_core.nil_QMARK_(G__4143)) ? (null) : (squint_core.filter(every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__4143));
if (squint_core.nil_QMARK_(G__4144)) {
return null;} else {
return squint_core.first(G__4144);}
})();
let closing45 = (function () {
 let G__4647 = unbalanced40;
let G__4648 = (squint_core.nil_QMARK_(G__4647)) ? (null) : (n.down(G__4647));
if (squint_core.nil_QMARK_(G__4648)) {
return null;} else {
return n.closed_by(G__4648);}
})();
let pos49 = (function () {
 let G__5051 = unbalanced40;
if (squint_core.nil_QMARK_(G__5051)) {
return null;} else {
return n.end(G__5051);}
})();
if ((closing45 && (closing45 === key_name))) {
return ({ "changes": ({ "from": pos49, "insert": closing45 }), "cursor": (pos49 + 1) });}
})() || (function () {
 let temp__25187__auto__52 = (function () {
 let temp__25187__auto__53 = n.terminal_cursor(n.tree(state), head37, 1);
if (temp__25187__auto__53) {
let cursor54 = temp__25187__auto__53;
while(true){
if (n.right_edge_type_QMARK_(cursor54["type"])) {
return n.end(cursor54);} else {
if (cursor54.next()) {
continue;
}};break;
}
}
})();
if (temp__25187__auto__52) {
let close_node_end55 = temp__25187__auto__52;
return ({ "cursor": close_node_end55 });}
})() || ({ "cursor": head37 }));}}
}));
})
;
var handle_backspace_cmd = (function (p__56) {
let map__5758 = p__56;
let view59 = map__5758;
let state60 = squint_core.get(map__5758, "state");
return u.dispatch_some(view59, handle_backspace(state60));
})
;
var handle_open_cmd = (function (key_name) {
return function (p__61) {
let map__6263 = p__61;
let view64 = map__6263;
let state65 = squint_core.get(map__6263, "state");
return u.dispatch_some(view64, handle_open(state65, key_name));
};
})
;
var handle_close_cmd = (function (key_name) {
return function (p__66) {
let map__6768 = p__66;
let view69 = map__6768;
let state70 = squint_core.get(map__6768, "state");
return u.dispatch_some(view69, handle_close(state70, key_name));
};
})
;
var guard_scope = (function (cmd) {
return function (p__71) {
let map__7273 = p__71;
let view74 = map__7273;
let state75 = squint_core.get(map__7273, "state");
if ((n.embedded_QMARK_(state75) || n.within_program_QMARK_(state75))) {
return cmd(view74);} else {
return false;}
};
})
;
var extension = (function () {
return Prec.high(view.keymap.of([({ "key": "Backspace", "run": guard_scope((function (p__76) {
let map__7778 = p__76;
let view79 = map__7778;
let state80 = squint_core.get(map__7778, "state");
return u.dispatch_some(view79, handle_backspace(state80));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })]));
})
;
squint_core.prn("close-brackets-loaded");

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
