import * as squint_core from 'squint-cljs/core.js';
import { EditorState, Prec } from '@codemirror/state';
import * as view from '@codemirror/view';
import * as str from 'squint-cljs/string.js';
import * as n from './../node.mjs';
import * as u from './../util.mjs';
import { from_to } from './../util.mjs';
var in_string_QMARK_ = (function (state, pos) {
return squint_core.contains_QMARK_(new Set(["StringContent", "String"]), n.name(n.tree(state, pos)));
});
var escaped_QMARK_ = (function (state, pos) {
return ("\\" === state["doc"].slice(squint_core.max(0, (pos - 1)), pos).toString());
});
var backspace_backoff = (function (state, from, to) {
let test__27847__auto__1 = (function () {
 let and__28236__auto__2 = (function () {
 let G__2883 = n.node_BAR_(state, (from - 1));
let test__27847__auto__4 = squint_core.nil_QMARK_(G__2883);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return null;} else {
return u.guard(G__2883, n.line_comment_QMARK_);}
})();
if (and__28236__auto__2 != null && and__28236__auto__2 !== false) {
return !str.blank_QMARK_(u.line_content_at(state, from));} else {
return and__28236__auto__2;}
})();
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return ({ "cursor": (from - 1) });} else {
return u.deletion(from, to);}
});
var handle_backspace = (function (p__289) {
let map__12 = p__289;
let state3 = map__12;
let test__27847__auto__4 = (function () {
 let and__28236__auto__5 = (1 === state3["selection"]["ranges"]["length"]);
if (and__28236__auto__5 != null && and__28236__auto__5 !== false) {
let range6 = squint_core.get_in(state3, ["selection", "ranges", 0]);
let and__28236__auto__7 = range6["empty"];
if (and__28236__auto__7 != null && and__28236__auto__7 !== false) {
return (0 === range6["from"]);} else {
return and__28236__auto__7;}} else {
return and__28236__auto__5;}
})();
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return null;} else {
return u.update_ranges(state3, ({ "annotations": u.user_event_annotation("delete") }), (function (p__290) {
let map__89 = p__290;
let _range10 = map__89;
let head11 = squint_core.get(map__89, "head");
let empty12 = squint_core.get(map__89, "empty");
let anchor13 = squint_core.get(map__89, "anchor");
let map__1415 = from_to(head11, anchor13);
let _range16 = map__1415;
let from17 = squint_core.get(map__1415, "from");
let to18 = squint_core.get(map__1415, "to");
let node_BAR_19 = n.tree(state3).resolveInner(from17, -1);
let parent20 = node_BAR_19["parent"];
let test__27847__auto__21 = (function () {
 let or__28221__auto__22 = !empty12;
if (or__28221__auto__22 != null && or__28221__auto__22 !== false) {
return or__28221__auto__22;} else {
let or__28221__auto__23 = ("StringContent" === n.name(n.tree(state3, from17, -1)));
if (or__28221__auto__23 != null && or__28221__auto__23 !== false) {
return or__28221__auto__23;} else {
let and__28236__auto__24 = parent20;
if (and__28236__auto__24 != null && and__28236__auto__24 !== false) {
let and__28236__auto__25 = !n.balanced_QMARK_(parent20);
if (and__28236__auto__25 != null && and__28236__auto__25 !== false) {
return n.left_edge_QMARK_(node_BAR_19);} else {
return and__28236__auto__25;}} else {
return and__28236__auto__24;}}}
})();
if (test__27847__auto__21 != null && test__27847__auto__21 !== false) {
return u.deletion(from17, to18);} else {
let test__27847__auto__26 = (function () {
 let and__28236__auto__27 = n.right_edge_QMARK_(node_BAR_19);
if (and__28236__auto__27 != null && and__28236__auto__27 !== false) {
return (from17 == n.end(parent20));} else {
return and__28236__auto__27;}
})();
if (test__27847__auto__26 != null && test__27847__auto__26 !== false) {
return ({ "cursor": (from17 - 1) });} else {
let test__27847__auto__28 = (function () {
 let and__28236__auto__29 = (function () {
 let or__28221__auto__30 = n.start_edge_QMARK_(node_BAR_19);
if (or__28221__auto__30 != null && or__28221__auto__30 !== false) {
return or__28221__auto__30;} else {
return n.same_edge_QMARK_(node_BAR_19);}
})();
if (and__28236__auto__29 != null && and__28236__auto__29 !== false) {
return (n.start(node_BAR_19) == n.start(parent20));} else {
return and__28236__auto__29;}
})();
if (test__27847__auto__28 != null && test__27847__auto__28 !== false) {
let test__27847__auto__31 = n.empty_QMARK_(n.up(node_BAR_19));
if (test__27847__auto__31 != null && test__27847__auto__31 !== false) {
return ({ "cursor": n.start(parent20), "changes": [from_to(n.start(parent20), n.end(parent20))] });} else {
return ({ "cursor": from17 });}} else {
let test__27847__auto__32 = "else";
if (test__27847__auto__32 != null && test__27847__auto__32 !== false) {
return backspace_backoff(state3, from17, to18);} else {
return null;}}}}
}));}
});
var coll_pairs = (function (x) {
return squint_core.get(({ "(": ")", "[": "]", "{": "}", "\"": "\"" }), x);
});
var handle_open = (function (state, open) {
let close1 = coll_pairs(open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__291) {
let map__23 = p__291;
let from4 = squint_core.get(map__23, "from");
let to5 = squint_core.get(map__23, "to");
let head6 = squint_core.get(map__23, "head");
let anchor7 = squint_core.get(map__23, "anchor");
let empty8 = squint_core.get(map__23, "empty");
let test__27847__auto__9 = in_string_QMARK_(state, from4);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
let test__27847__auto__10 = (open === "\"");
if (test__27847__auto__10 != null && test__27847__auto__10 !== false) {
return u.insertion(head6, "\\\"");} else {
return u.insertion(from4, to5, open);}} else {
let test__27847__auto__11 = escaped_QMARK_(state, from4);
if (test__27847__auto__11 != null && test__27847__auto__11 !== false) {
return u.insertion(from4, to5, open);} else {
let test__27847__auto__12 = "else";
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
if (empty8 != null && empty8 !== false) {
return ({ "changes": ({ "insert": squint_core.str(open, close1), "from": head6 }), "cursor": (head6 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from4 }), ({ "insert": close1, "from": to5 })], "from-to": [(anchor7 + squint_core.count(open)), (head6 + squint_core.count(open))] });}} else {
return null;}}}
}));
});
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__292) {
let map__12 = p__292;
let _range3 = map__12;
let empty4 = squint_core.get(map__12, "empty");
let head5 = squint_core.get(map__12, "head");
let from6 = squint_core.get(map__12, "from");
let to7 = squint_core.get(map__12, "to");
let test__27847__auto__8 = (function () {
 let or__28221__auto__9 = in_string_QMARK_(state, from6);
if (or__28221__auto__9 != null && or__28221__auto__9 !== false) {
return or__28221__auto__9;} else {
return escaped_QMARK_(state, from6);}
})();
if (test__27847__auto__8 != null && test__27847__auto__8 !== false) {
return u.insertion(from6, to7, key_name);} else {
if (empty4 != null && empty4 !== false) {
let or__28221__auto__10 = (function () {
 let unbalanced11 = (function () {
 let G__29312 = n.tree(state, head5, -1);
let G__29313 = (function () {
 let test__27847__auto__14 = squint_core.nil_QMARK_(G__29312);
if (test__27847__auto__14 != null && test__27847__auto__14 !== false) {
return null;} else {
return n.ancestors(G__29312);}
})();
let G__29315 = (function () {
 let test__27847__auto__16 = squint_core.nil_QMARK_(G__29313);
if (test__27847__auto__16 != null && test__27847__auto__16 !== false) {
return null;} else {
return squint_core.filter(squint_core.every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__29313);}
})();
let test__27847__auto__17 = squint_core.nil_QMARK_(G__29315);
if (test__27847__auto__17 != null && test__27847__auto__17 !== false) {
return null;} else {
return squint_core.first(G__29315);}
})();
let closing18 = (function () {
 let G__29419 = unbalanced11;
let G__29420 = (function () {
 let test__27847__auto__21 = squint_core.nil_QMARK_(G__29419);
if (test__27847__auto__21 != null && test__27847__auto__21 !== false) {
return null;} else {
return n.down(G__29419);}
})();
let test__27847__auto__22 = squint_core.nil_QMARK_(G__29420);
if (test__27847__auto__22 != null && test__27847__auto__22 !== false) {
return null;} else {
return n.closed_by(G__29420);}
})();
let pos23 = (function () {
 let G__29524 = unbalanced11;
let test__27847__auto__25 = squint_core.nil_QMARK_(G__29524);
if (test__27847__auto__25 != null && test__27847__auto__25 !== false) {
return null;} else {
return n.end(G__29524);}
})();
let test__27847__auto__26 = (function () {
 let and__28236__auto__27 = closing18;
if (and__28236__auto__27 != null && and__28236__auto__27 !== false) {
return (closing18 === key_name);} else {
return and__28236__auto__27;}
})();
if (test__27847__auto__26 != null && test__27847__auto__26 !== false) {
return ({ "changes": ({ "from": pos23, "insert": closing18 }), "cursor": (pos23 + 1) });}
})();
if (or__28221__auto__10 != null && or__28221__auto__10 !== false) {
return or__28221__auto__10;} else {
let or__28221__auto__28 = (function () {
 let temp__27767__auto__29 = (function () {
 let temp__27767__auto__30 = n.terminal_cursor(n.tree(state), head5, 1);
if (temp__27767__auto__30 != null && temp__27767__auto__30 !== false) {
let cursor31 = temp__27767__auto__30;
while(true){
let test__27847__auto__32 = n.right_edge_type_QMARK_(cursor31["type"]);
if (test__27847__auto__32 != null && test__27847__auto__32 !== false) {
return n.end(cursor31);} else {
let test__27847__auto__33 = cursor31.next();
if (test__27847__auto__33 != null && test__27847__auto__33 !== false) {
continue;
}};break;
}
}
})();
if (temp__27767__auto__29 != null && temp__27767__auto__29 !== false) {
let close_node_end34 = temp__27767__auto__29;
return ({ "cursor": close_node_end34 });}
})();
if (or__28221__auto__28 != null && or__28221__auto__28 !== false) {
return or__28221__auto__28;} else {
return ({ "cursor": head5 });}}}}
}));
});
var handle_backspace_cmd = (function (p__296) {
let map__12 = p__296;
let view3 = map__12;
let state4 = squint_core.get(map__12, "state");
return u.dispatch_some(view3, handle_backspace(state4));
});
var handle_open_cmd = (function (key_name) {
return function (p__297) {
let map__12 = p__297;
let view3 = map__12;
let state4 = squint_core.get(map__12, "state");
return u.dispatch_some(view3, handle_open(state4, key_name));
};
});
var handle_close_cmd = (function (key_name) {
return function (p__298) {
let map__12 = p__298;
let view3 = map__12;
let state4 = squint_core.get(map__12, "state");
return u.dispatch_some(view3, handle_close(state4, key_name));
};
});
var guard_scope = (function (cmd) {
return function (p__299) {
let map__12 = p__299;
let view3 = map__12;
let state4 = squint_core.get(map__12, "state");
let test__27847__auto__5 = (function () {
 let or__28221__auto__6 = n.embedded_QMARK_(state4);
if (or__28221__auto__6 != null && or__28221__auto__6 !== false) {
return or__28221__auto__6;} else {
return n.within_program_QMARK_(state4);}
})();
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
return cmd(view3);} else {
return false;}
};
});
var extension = (function () {
return Prec.high(view.keymap.of([({ "key": "Backspace", "run": guard_scope((function (p__300) {
let map__12 = p__300;
let view3 = map__12;
let state4 = squint_core.get(map__12, "state");
return u.dispatch_some(view3, handle_backspace(state4));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })]));
});

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
