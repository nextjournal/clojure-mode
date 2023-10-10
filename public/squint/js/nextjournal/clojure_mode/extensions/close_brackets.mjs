import * as squint_core from 'squint-cljs/core.js';
import * as view from '@codemirror/view';
import { EditorState, Prec } from '@codemirror/state';
import * as n from './../node.mjs';
import * as u from './../util.mjs';
import { from_to } from './../util.mjs';
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
let doc10 = squint_core.get(map__78, "doc");
let test__60965__auto__11 = (function () {
 let and__32262__auto__12 = (1 === state9["selection"]["ranges"]["length"]);
if (and__32262__auto__12 != null && and__32262__auto__12 !== false) {
let range13 = squint_core.get_in(state9, ["selection", "ranges", 0]);
let and__32262__auto__14 = range13["empty"];
if (and__32262__auto__14 != null && and__32262__auto__14 !== false) {
return (0 === range13["from"]);} else {
return and__32262__auto__14;}} else {
return and__32262__auto__12;}
})();
if (test__60965__auto__11 != null && test__60965__auto__11 !== false) {
return null;} else {
return u.update_ranges(state9, ({ "annotations": u.user_event_annotation("delete") }), (function (p__15) {
let map__1617 = p__15;
let _range18 = map__1617;
let head19 = squint_core.get(map__1617, "head");
let empty20 = squint_core.get(map__1617, "empty");
let anchor21 = squint_core.get(map__1617, "anchor");
let map__2223 = from_to(head19, anchor21);
let _range24 = map__2223;
let from25 = squint_core.get(map__2223, "from");
let to26 = squint_core.get(map__2223, "to");
let node_BAR_27 = n.tree(state9).resolveInner(from25, -1);
let parent28 = node_BAR_27["parent"];
let test__60965__auto__29 = (function () {
 let or__32239__auto__30 = !empty20;
if (or__32239__auto__30 != null && or__32239__auto__30 !== false) {
return or__32239__auto__30;} else {
let or__32239__auto__31 = ("StringContent" === n.name(n.tree(state9, from25, -1)));
if (or__32239__auto__31 != null && or__32239__auto__31 !== false) {
return or__32239__auto__31;} else {
let and__32262__auto__32 = parent28;
if (and__32262__auto__32 != null && and__32262__auto__32 !== false) {
let and__32262__auto__33 = !n.balanced_QMARK_(parent28);
if (and__32262__auto__33 != null && and__32262__auto__33 !== false) {
return n.left_edge_QMARK_(node_BAR_27);} else {
return and__32262__auto__33;}} else {
return and__32262__auto__32;}}}
})();
if (test__60965__auto__29 != null && test__60965__auto__29 !== false) {
return u.deletion(from25, to26);} else {
let test__60965__auto__34 = (function () {
 let and__32262__auto__35 = n.right_edge_QMARK_(node_BAR_27);
if (and__32262__auto__35 != null && and__32262__auto__35 !== false) {
return (from25 == n.end(parent28));} else {
return and__32262__auto__35;}
})();
if (test__60965__auto__34 != null && test__60965__auto__34 !== false) {
return ({ "cursor": (from25 - 1) });} else {
let test__60965__auto__36 = (function () {
 let and__32262__auto__37 = (function () {
 let or__32239__auto__38 = n.start_edge_QMARK_(node_BAR_27);
if (or__32239__auto__38 != null && or__32239__auto__38 !== false) {
return or__32239__auto__38;} else {
return n.same_edge_QMARK_(node_BAR_27);}
})();
if (and__32262__auto__37 != null && and__32262__auto__37 !== false) {
return (n.start(node_BAR_27) == n.start(parent28));} else {
return and__32262__auto__37;}
})();
if (test__60965__auto__36 != null && test__60965__auto__36 !== false) {
let test__60965__auto__39 = n.empty_QMARK_(n.up(node_BAR_27));
if (test__60965__auto__39 != null && test__60965__auto__39 !== false) {
return ({ "cursor": n.start(parent28), "changes": [from_to(n.start(parent28), n.end(parent28))] });} else {
return ({ "cursor": from25 });}} else {
let test__60965__auto__40 = "else";
if (test__60965__auto__40 != null && test__60965__auto__40 !== false) {
return backspace_backoff(state9, from25, to26);} else {
return null;}}}}
}));}
})
;
var coll_pairs = ({ "(": ")", "[": "]", "{": "}", "\"": "\"" })
;
var handle_open = (function (state, open) {
let close41 = squint_core.get(coll_pairs, open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__42) {
let map__4344 = p__42;
let from45 = squint_core.get(map__4344, "from");
let to46 = squint_core.get(map__4344, "to");
let head47 = squint_core.get(map__4344, "head");
let anchor48 = squint_core.get(map__4344, "anchor");
let empty49 = squint_core.get(map__4344, "empty");
let test__60965__auto__50 = in_string_QMARK_(state, from45);
if (test__60965__auto__50 != null && test__60965__auto__50 !== false) {
let test__60965__auto__51 = (open === "\"");
if (test__60965__auto__51 != null && test__60965__auto__51 !== false) {
return u.insertion(head47, "\\\"");} else {
return u.insertion(from45, to46, open);}} else {
let test__60965__auto__52 = escaped_QMARK_(state, from45);
if (test__60965__auto__52 != null && test__60965__auto__52 !== false) {
return u.insertion(from45, to46, open);} else {
let test__60965__auto__53 = "else";
if (test__60965__auto__53 != null && test__60965__auto__53 !== false) {
if (empty49 != null && empty49 !== false) {
return ({ "changes": ({ "insert": squint_core.str(open, close41), "from": head47 }), "cursor": (head47 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from45 }), ({ "insert": close41, "from": to46 })], "from-to": [(anchor48 + squint_core.count(open)), (head47 + squint_core.count(open))] });}} else {
return null;}}}
}));
})
;
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__54) {
let map__5556 = p__54;
let _range57 = map__5556;
let empty58 = squint_core.get(map__5556, "empty");
let head59 = squint_core.get(map__5556, "head");
let from60 = squint_core.get(map__5556, "from");
let to61 = squint_core.get(map__5556, "to");
let test__60965__auto__62 = (function () {
 let or__32239__auto__63 = in_string_QMARK_(state, from60);
if (or__32239__auto__63 != null && or__32239__auto__63 !== false) {
return or__32239__auto__63;} else {
return escaped_QMARK_(state, from60);}
})();
if (test__60965__auto__62 != null && test__60965__auto__62 !== false) {
return u.insertion(from60, to61, key_name);} else {
if (empty58 != null && empty58 !== false) {
let or__32239__auto__64 = (function () {
 let unbalanced65 = (function () {
 let G__6667 = n.tree(state, head59, -1);
let G__6668 = (function () {
 let test__60965__auto__69 = squint_core.nil_QMARK_(G__6667);
if (test__60965__auto__69 != null && test__60965__auto__69 !== false) {
return null;} else {
return n.ancestors(G__6667);}
})();
let G__6670 = (function () {
 let test__60965__auto__71 = squint_core.nil_QMARK_(G__6668);
if (test__60965__auto__71 != null && test__60965__auto__71 !== false) {
return null;} else {
return squint_core.filter(squint_core.every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__6668);}
})();
let test__60965__auto__72 = squint_core.nil_QMARK_(G__6670);
if (test__60965__auto__72 != null && test__60965__auto__72 !== false) {
return null;} else {
return squint_core.first(G__6670);}
})();
let closing73 = (function () {
 let G__7475 = unbalanced65;
let G__7476 = (function () {
 let test__60965__auto__77 = squint_core.nil_QMARK_(G__7475);
if (test__60965__auto__77 != null && test__60965__auto__77 !== false) {
return null;} else {
return n.down(G__7475);}
})();
let test__60965__auto__78 = squint_core.nil_QMARK_(G__7476);
if (test__60965__auto__78 != null && test__60965__auto__78 !== false) {
return null;} else {
return n.closed_by(G__7476);}
})();
let pos79 = (function () {
 let G__8081 = unbalanced65;
let test__60965__auto__82 = squint_core.nil_QMARK_(G__8081);
if (test__60965__auto__82 != null && test__60965__auto__82 !== false) {
return null;} else {
return n.end(G__8081);}
})();
let test__60965__auto__83 = (function () {
 let and__32262__auto__84 = closing73;
if (and__32262__auto__84 != null && and__32262__auto__84 !== false) {
return (closing73 === key_name);} else {
return and__32262__auto__84;}
})();
if (test__60965__auto__83 != null && test__60965__auto__83 !== false) {
return ({ "changes": ({ "from": pos79, "insert": closing73 }), "cursor": (pos79 + 1) });}
})();
if (or__32239__auto__64 != null && or__32239__auto__64 !== false) {
return or__32239__auto__64;} else {
let or__32239__auto__85 = (function () {
 let temp__31807__auto__86 = (function () {
 let temp__31807__auto__87 = n.terminal_cursor(n.tree(state), head59, 1);
if (temp__31807__auto__87 != null && temp__31807__auto__87 !== false) {
let cursor88 = temp__31807__auto__87;
while(true){
let test__60965__auto__89 = n.right_edge_type_QMARK_(cursor88["type"]);
if (test__60965__auto__89 != null && test__60965__auto__89 !== false) {
return n.end(cursor88);} else {
let test__60965__auto__90 = cursor88.next();
if (test__60965__auto__90 != null && test__60965__auto__90 !== false) {
continue;
}};break;
}
}
})();
if (temp__31807__auto__86 != null && temp__31807__auto__86 !== false) {
let close_node_end91 = temp__31807__auto__86;
return ({ "cursor": close_node_end91 });}
})();
if (or__32239__auto__85 != null && or__32239__auto__85 !== false) {
return or__32239__auto__85;} else {
return ({ "cursor": head59 });}}}}
}));
})
;
var handle_backspace_cmd = (function (p__92) {
let map__9394 = p__92;
let view95 = map__9394;
let state96 = squint_core.get(map__9394, "state");
return u.dispatch_some(view95, handle_backspace(state96));
})
;
var handle_open_cmd = (function (key_name) {
return function (p__97) {
let map__9899 = p__97;
let view100 = map__9899;
let state101 = squint_core.get(map__9899, "state");
return u.dispatch_some(view100, handle_open(state101, key_name));
};
})
;
var handle_close_cmd = (function (key_name) {
return function (p__102) {
let map__103104 = p__102;
let view105 = map__103104;
let state106 = squint_core.get(map__103104, "state");
return u.dispatch_some(view105, handle_close(state106, key_name));
};
})
;
var guard_scope = (function (cmd) {
return function (p__107) {
let map__108109 = p__107;
let view110 = map__108109;
let state111 = squint_core.get(map__108109, "state");
let test__60965__auto__112 = (function () {
 let or__32239__auto__113 = n.embedded_QMARK_(state111);
if (or__32239__auto__113 != null && or__32239__auto__113 !== false) {
return or__32239__auto__113;} else {
return n.within_program_QMARK_(state111);}
})();
if (test__60965__auto__112 != null && test__60965__auto__112 !== false) {
return cmd(view110);} else {
return false;}
};
})
;
var extension = (function () {
return Prec.high(view.keymap.of([({ "key": "Backspace", "run": guard_scope((function (p__114) {
let map__115116 = p__114;
let view117 = map__115116;
let state118 = squint_core.get(map__115116, "state");
return u.dispatch_some(view117, handle_backspace(state118));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })]));
})
;
squint_core.prn("close-brackets-loaded");

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
