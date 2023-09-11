import * as squint_core from 'squint-cljs/core.js';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
import { from_to } from '../util.mjs';
import { EditorState, Prec } from '@codemirror/state';
import * as view from '@codemirror/view';
import * as str from 'squint-cljs/string.js';
var in_string_QMARK_ = (function (state, pos) {
return squint_core.contains_QMARK_(new Set(["StringContent", "String"]), n.name(n.tree(state, pos)));
})
;
var escaped_QMARK_ = (function (state, pos) {
return ("\\" === state["doc"].slice(squint_core.max(0, (pos - 1)), pos).toString());
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
let _range12 = map__1011;
let head13 = squint_core.get(map__1011, "head");
let empty14 = squint_core.get(map__1011, "empty");
let anchor15 = squint_core.get(map__1011, "anchor");
let map__1617 = from_to(head13, anchor15);
let _range18 = map__1617;
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
let G__2324 = ({ "cursor": n.start(parent22), "changes": [from_to(n.start(parent22), n.end(parent22))] });
squint_core.println(G__2324);
return G__2324;} else {
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
let close25 = squint_core.get(coll_pairs, open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__26) {
let map__2728 = p__26;
let from29 = squint_core.get(map__2728, "from");
let to30 = squint_core.get(map__2728, "to");
let head31 = squint_core.get(map__2728, "head");
let anchor32 = squint_core.get(map__2728, "anchor");
let empty33 = squint_core.get(map__2728, "empty");
if (in_string_QMARK_(state, from29)) {
if ((open === "\"")) {
return u.insertion(head31, "\\\"");} else {
return u.insertion(from29, to30, open);}} else {
if (escaped_QMARK_(state, from29)) {
return u.insertion(from29, to30, open);} else {
if ("else") {
if (empty33) {
return ({ "changes": ({ "insert": squint_core.str(open, close25), "from": head31 }), "cursor": (head31 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from29 }), ({ "insert": close25, "from": to30 })], "from-to": [(anchor32 + squint_core.count(open)), (head31 + squint_core.count(open))] });}} else {
return null;}}}
}));
})
;
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__34) {
let map__3536 = p__34;
let _range37 = map__3536;
let empty38 = squint_core.get(map__3536, "empty");
let head39 = squint_core.get(map__3536, "head");
let from40 = squint_core.get(map__3536, "from");
let to41 = squint_core.get(map__3536, "to");
if ((in_string_QMARK_(state, from40) || escaped_QMARK_(state, from40))) {
return u.insertion(from40, to41, key_name);} else {
if (empty38) {
return ((function () {
 let unbalanced42 = (function () {
 let G__4344 = n.tree(state, head39, -1);
let G__4345 = (squint_core.nil_QMARK_(G__4344)) ? (null) : (n.ancestors(G__4344));
let G__4346 = (squint_core.nil_QMARK_(G__4345)) ? (null) : (squint_core.filter(every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__4345));
if (squint_core.nil_QMARK_(G__4346)) {
return null;} else {
return squint_core.first(G__4346);}
})();
let closing47 = (function () {
 let G__4849 = unbalanced42;
let G__4850 = (squint_core.nil_QMARK_(G__4849)) ? (null) : (n.down(G__4849));
if (squint_core.nil_QMARK_(G__4850)) {
return null;} else {
return n.closed_by(G__4850);}
})();
let pos51 = (function () {
 let G__5253 = unbalanced42;
if (squint_core.nil_QMARK_(G__5253)) {
return null;} else {
return n.end(G__5253);}
})();
if ((closing47 && (closing47 === key_name))) {
return ({ "changes": ({ "from": pos51, "insert": closing47 }), "cursor": (pos51 + 1) });}
})() || (function () {
 let temp__27701__auto__54 = (function () {
 let temp__27701__auto__55 = n.terminal_cursor(n.tree(state), head39, 1);
if (temp__27701__auto__55) {
let cursor56 = temp__27701__auto__55;
while(true){
if (n.right_edge_type_QMARK_(cursor56["type"])) {
return n.end(cursor56);} else {
if (cursor56.next()) {
continue;
}};break;
}
}
})();
if (temp__27701__auto__54) {
let close_node_end57 = temp__27701__auto__54;
return ({ "cursor": close_node_end57 });}
})() || ({ "cursor": head39 }));}}
}));
})
;
var handle_backspace_cmd = (function (p__58) {
let map__5960 = p__58;
let view61 = map__5960;
let state62 = squint_core.get(map__5960, "state");
return u.dispatch_some(view61, handle_backspace(state62));
})
;
var handle_open_cmd = (function (key_name) {
return function (p__63) {
let map__6465 = p__63;
let view66 = map__6465;
let state67 = squint_core.get(map__6465, "state");
return u.dispatch_some(view66, handle_open(state67, key_name));
};
})
;
var handle_close_cmd = (function (key_name) {
return function (p__68) {
let map__6970 = p__68;
let view71 = map__6970;
let state72 = squint_core.get(map__6970, "state");
return u.dispatch_some(view71, handle_close(state72, key_name));
};
})
;
var guard_scope = (function (cmd) {
return function (p__73) {
let map__7475 = p__73;
let view76 = map__7475;
let state77 = squint_core.get(map__7475, "state");
if ((n.embedded_QMARK_(state77) || n.within_program_QMARK_(state77))) {
return cmd(view76);} else {
return false;}
};
})
;
var extension = (function () {
return Prec.high(view.keymap.of([({ "key": "Backspace", "run": guard_scope((function (p__78) {
let map__7980 = p__78;
let view81 = map__7980;
let state82 = squint_core.get(map__7980, "state");
return u.dispatch_some(view81, handle_backspace(state82));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })]));
})
;
squint_core.prn("close-brackets-loaded");

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
