import * as squint_core from 'squint-cljs/core.js';
import { EditorState, Prec } from '@codemirror/state';
import * as view from '@codemirror/view';
import * as j from './../../../applied_science/js_interop.mjs';
import * as str from 'squint-cljs/string.js';
import * as n from './../node.mjs';
import * as u from './../util.mjs';
import { from_to } from './../util.mjs';
squint_core.prn("dude");
var in_string_QMARK_ = (function (state, pos) {
return squint_core.get(new Set(["StringContent", "String"]), n.name(n.tree(state, pos)));
})
;
var escaped_QMARK_ = (function (state, pos) {
return ("\\" === state["doc"].slice(squint_core.max(0, (pos - 1)), pos).toString());
})
;
var backspace_backoff = (function (state, from, to) {
let test__60965__auto__1 = (function () {
 let and__32262__auto__2 = (function () {
 let G__34 = n.node_BAR_(state, (from - 1));
let test__60965__auto__5 = squint_core.nil_QMARK_(G__34);
if (test__60965__auto__5 != null && test__60965__auto__5 !== false) {
return null;} else {
return u.guard(G__34, n.line_comment_QMARK_);}
})();
if (and__32262__auto__2 != null && and__32262__auto__2 !== false) {
return !str.blank_QMARK_(u.line_content_at(state, from));} else {
return and__32262__auto__2;}
})();
if (test__60965__auto__1 != null && test__60965__auto__1 !== false) {
return ({ "cursor": (from - 1) });} else {
return u.deletion(from, to);}
})
;
var handle_backspace = (function (p__6) {
let map__78 = p__6;
let state9 = map__78;
let test__60965__auto__10 = (function () {
 let and__32262__auto__11 = (1 === state9["selection"]["ranges"]["length"]);
if (and__32262__auto__11 != null && and__32262__auto__11 !== false) {
let range12 = squint_core.get_in(state9, ["selection", "ranges", 0]);
let and__32262__auto__13 = range12["empty"];
if (and__32262__auto__13 != null && and__32262__auto__13 !== false) {
return (0 === range12["from"]);} else {
return and__32262__auto__13;}} else {
return and__32262__auto__11;}
})();
if (test__60965__auto__10 != null && test__60965__auto__10 !== false) {
return null;} else {
return u.update_ranges(state9, ({ "annotations": u.user_event_annotation("delete") }), (function (p__14) {
let map__1516 = p__14;
let range17 = map__1516;
let head18 = squint_core.get(map__1516, "head");
let empty19 = squint_core.get(map__1516, "empty");
let anchor20 = squint_core.get(map__1516, "anchor");
let map__2122 = from_to(head18, anchor20);
let _range23 = map__2122;
let from24 = squint_core.get(map__2122, "from");
let to25 = squint_core.get(map__2122, "to");
let node_BAR_26 = n.tree(state9).resolveInner(from24, -1);
let parent27 = node_BAR_26["parent"];
let test__60965__auto__28 = (function () {
 let or__32239__auto__29 = !empty19;
if (or__32239__auto__29 != null && or__32239__auto__29 !== false) {
return or__32239__auto__29;} else {
let or__32239__auto__30 = ("StringContent" === n.name(n.tree(state9, from24, -1)));
if (or__32239__auto__30 != null && or__32239__auto__30 !== false) {
return or__32239__auto__30;} else {
let and__32262__auto__31 = parent27;
if (and__32262__auto__31 != null && and__32262__auto__31 !== false) {
let and__32262__auto__32 = !n.balanced_QMARK_(parent27);
if (and__32262__auto__32 != null && and__32262__auto__32 !== false) {
return n.left_edge_QMARK_(node_BAR_26);} else {
return and__32262__auto__32;}} else {
return and__32262__auto__31;}}}
})();
if (test__60965__auto__28 != null && test__60965__auto__28 !== false) {
return u.deletion(from24, to25);} else {
let test__60965__auto__33 = (function () {
 let and__32262__auto__34 = n.right_edge_QMARK_(node_BAR_26);
if (and__32262__auto__34 != null && and__32262__auto__34 !== false) {
return (from24 == n.end(parent27));} else {
return and__32262__auto__34;}
})();
if (test__60965__auto__33 != null && test__60965__auto__33 !== false) {
return ({ "cursor": (from24 - 1) });} else {
let test__60965__auto__35 = (function () {
 let and__32262__auto__36 = (function () {
 let or__32239__auto__37 = n.start_edge_QMARK_(node_BAR_26);
if (or__32239__auto__37 != null && or__32239__auto__37 !== false) {
return or__32239__auto__37;} else {
return n.same_edge_QMARK_(node_BAR_26);}
})();
if (and__32262__auto__36 != null && and__32262__auto__36 !== false) {
return (n.start(node_BAR_26) == n.start(parent27));} else {
return and__32262__auto__36;}
})();
if (test__60965__auto__35 != null && test__60965__auto__35 !== false) {
let test__60965__auto__38 = n.empty_QMARK_(n.up(node_BAR_26));
if (test__60965__auto__38 != null && test__60965__auto__38 !== false) {
return ({ "cursor": n.start(parent27), "changes": [from_to(n.start(parent27), n.end(parent27))] });} else {
return ({ "cursor": from24 });}} else {
let test__60965__auto__39 = "else";
if (test__60965__auto__39 != null && test__60965__auto__39 !== false) {
return backspace_backoff(state9, from24, to25);} else {
return null;}}}}
}));}
})
;
var coll_pairs = (function (x) {
return squint_core.get(({ "(": ")", "[": "]", "{": "}", "\"": "\"" }), x);
})
;
var handle_open = (function (state, open) {
let close40 = coll_pairs(open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__41) {
let map__4243 = p__41;
let from44 = squint_core.get(map__4243, "from");
let to45 = squint_core.get(map__4243, "to");
let head46 = squint_core.get(map__4243, "head");
let anchor47 = squint_core.get(map__4243, "anchor");
let empty48 = squint_core.get(map__4243, "empty");
let test__60965__auto__49 = in_string_QMARK_(state, from44);
if (test__60965__auto__49 != null && test__60965__auto__49 !== false) {
let test__60965__auto__50 = (open === "\"");
if (test__60965__auto__50 != null && test__60965__auto__50 !== false) {
return u.insertion(head46, "\\\"");} else {
return u.insertion(from44, to45, open);}} else {
let test__60965__auto__51 = escaped_QMARK_(state, from44);
if (test__60965__auto__51 != null && test__60965__auto__51 !== false) {
return u.insertion(from44, to45, open);} else {
let test__60965__auto__52 = "else";
if (test__60965__auto__52 != null && test__60965__auto__52 !== false) {
if (empty48 != null && empty48 !== false) {
return ({ "changes": ({ "insert": squint_core.str(open, close40), "from": head46 }), "cursor": (head46 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from44 }), ({ "insert": close40, "from": to45 })], "from-to": [(anchor47 + squint_core.count(open)), (head46 + squint_core.count(open))] });}} else {
return null;}}}
}));
})
;
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__53) {
let map__5455 = p__53;
let _range56 = map__5455;
let empty57 = squint_core.get(map__5455, "empty");
let head58 = squint_core.get(map__5455, "head");
let from59 = squint_core.get(map__5455, "from");
let to60 = squint_core.get(map__5455, "to");
let test__60965__auto__61 = (function () {
 let or__32239__auto__62 = in_string_QMARK_(state, from59);
if (or__32239__auto__62 != null && or__32239__auto__62 !== false) {
return or__32239__auto__62;} else {
return escaped_QMARK_(state, from59);}
})();
if (test__60965__auto__61 != null && test__60965__auto__61 !== false) {
return u.insertion(from59, to60, key_name);} else {
if (empty57 != null && empty57 !== false) {
let or__32239__auto__63 = (function () {
 let unbalanced64 = (function () {
 let G__6566 = n.tree(state, head58, -1);
let G__6567 = (function () {
 let test__60965__auto__68 = squint_core.nil_QMARK_(G__6566);
if (test__60965__auto__68 != null && test__60965__auto__68 !== false) {
return null;} else {
return n.ancestors(G__6566);}
})();
let G__6569 = (function () {
 let test__60965__auto__70 = squint_core.nil_QMARK_(G__6567);
if (test__60965__auto__70 != null && test__60965__auto__70 !== false) {
return null;} else {
return squint_core.filter(squint_core.every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__6567);}
})();
let test__60965__auto__71 = squint_core.nil_QMARK_(G__6569);
if (test__60965__auto__71 != null && test__60965__auto__71 !== false) {
return null;} else {
return squint_core.first(G__6569);}
})();
let closing72 = (function () {
 let G__7374 = unbalanced64;
let G__7375 = (function () {
 let test__60965__auto__76 = squint_core.nil_QMARK_(G__7374);
if (test__60965__auto__76 != null && test__60965__auto__76 !== false) {
return null;} else {
return n.down(G__7374);}
})();
let test__60965__auto__77 = squint_core.nil_QMARK_(G__7375);
if (test__60965__auto__77 != null && test__60965__auto__77 !== false) {
return null;} else {
return n.closed_by(G__7375);}
})();
let pos78 = (function () {
 let G__7980 = unbalanced64;
let test__60965__auto__81 = squint_core.nil_QMARK_(G__7980);
if (test__60965__auto__81 != null && test__60965__auto__81 !== false) {
return null;} else {
return n.end(G__7980);}
})();
let test__60965__auto__82 = (function () {
 let and__32262__auto__83 = closing72;
if (and__32262__auto__83 != null && and__32262__auto__83 !== false) {
return (closing72 === key_name);} else {
return and__32262__auto__83;}
})();
if (test__60965__auto__82 != null && test__60965__auto__82 !== false) {
return ({ "changes": ({ "from": pos78, "insert": closing72 }), "cursor": (pos78 + 1) });}
})();
if (or__32239__auto__63 != null && or__32239__auto__63 !== false) {
return or__32239__auto__63;} else {
let or__32239__auto__84 = (function () {
 let temp__31807__auto__85 = (function () {
 let temp__31807__auto__86 = n.terminal_cursor(n.tree(state), head58, 1);
if (temp__31807__auto__86 != null && temp__31807__auto__86 !== false) {
let cursor87 = temp__31807__auto__86;
while(true){
let test__60965__auto__88 = n.right_edge_type_QMARK_(cursor87["type"]);
if (test__60965__auto__88 != null && test__60965__auto__88 !== false) {
return n.end(cursor87);} else {
let test__60965__auto__89 = cursor87.next();
if (test__60965__auto__89 != null && test__60965__auto__89 !== false) {
continue;
}};break;
}
}
})();
if (temp__31807__auto__85 != null && temp__31807__auto__85 !== false) {
let close_node_end90 = temp__31807__auto__85;
return ({ "cursor": close_node_end90 });}
})();
if (or__32239__auto__84 != null && or__32239__auto__84 !== false) {
return or__32239__auto__84;} else {
return ({ "cursor": head58 });}}}}
}));
})
;
var handle_backspace_cmd = (function (p__91) {
let map__9293 = p__91;
let view94 = map__9293;
let state95 = squint_core.get(map__9293, "state");
return u.dispatch_some(view94, handle_backspace(state95));
})
;
var handle_open_cmd = (function (key_name) {
return function (p__96) {
let map__9798 = p__96;
let view99 = map__9798;
let state100 = squint_core.get(map__9798, "state");
return u.dispatch_some(view99, handle_open(state100, key_name));
};
})
;
var handle_close_cmd = (function (key_name) {
return function (p__101) {
let map__102103 = p__101;
let view104 = map__102103;
let state105 = squint_core.get(map__102103, "state");
return u.dispatch_some(view104, handle_close(state105, key_name));
};
})
;
var guard_scope = (function (cmd) {
return function (p__106) {
let map__107108 = p__106;
let view109 = map__107108;
let state110 = squint_core.get(map__107108, "state");
let test__60965__auto__111 = (function () {
 let or__32239__auto__112 = n.embedded_QMARK_(state110);
if (or__32239__auto__112 != null && or__32239__auto__112 !== false) {
return or__32239__auto__112;} else {
return n.within_program_QMARK_(state110);}
})();
if (test__60965__auto__111 != null && test__60965__auto__111 !== false) {
return cmd(view109);} else {
return false;}
};
})
;
var extension = (function () {
return Prec.high(view.keymap.of(j.lit([({ "key": "Backspace", "run": guard_scope((function (p__113) {
let map__114115 = p__113;
let view116 = map__114115;
let state117 = squint_core.get(map__114115, "state");
return u.dispatch_some(view116, handle_backspace(state117));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })])));
})
;

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
