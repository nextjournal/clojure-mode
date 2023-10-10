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
let test__60965__auto__345 = (function () {
 let and__32262__auto__346 = (function () {
 let G__347348 = n.node_BAR_(state, (from - 1));
let test__60965__auto__349 = squint_core.nil_QMARK_(G__347348);
if (test__60965__auto__349 != null && test__60965__auto__349 !== false) {
return null;} else {
return u.guard(G__347348, n.line_comment_QMARK_);}
})();
if (and__32262__auto__346 != null && and__32262__auto__346 !== false) {
return !str.blank_QMARK_(u.line_content_at(state, from));} else {
return and__32262__auto__346;}
})();
if (test__60965__auto__345 != null && test__60965__auto__345 !== false) {
return ({ "cursor": (from - 1) });} else {
return u.deletion(from, to);}
})
;
var handle_backspace = (function (p__350) {
let map__351352 = p__350;
let state353 = map__351352;
let doc354 = squint_core.get(map__351352, "doc");
let test__60965__auto__355 = (function () {
 let and__32262__auto__356 = (1 === state353["selection"]["ranges"]["length"]);
if (and__32262__auto__356 != null && and__32262__auto__356 !== false) {
let range357 = squint_core.get_in(state353, ["selection", "ranges", 0]);
let and__32262__auto__358 = range357["empty"];
if (and__32262__auto__358 != null && and__32262__auto__358 !== false) {
return (0 === range357["from"]);} else {
return and__32262__auto__358;}} else {
return and__32262__auto__356;}
})();
if (test__60965__auto__355 != null && test__60965__auto__355 !== false) {
return null;} else {
return u.update_ranges(state353, ({ "annotations": u.user_event_annotation("delete") }), (function (p__359) {
let map__360361 = p__359;
let _range362 = map__360361;
let head363 = squint_core.get(map__360361, "head");
let empty364 = squint_core.get(map__360361, "empty");
let anchor365 = squint_core.get(map__360361, "anchor");
let map__366367 = from_to(head363, anchor365);
let _range368 = map__366367;
let from369 = squint_core.get(map__366367, "from");
let to370 = squint_core.get(map__366367, "to");
let node_BAR_371 = n.tree(state353).resolveInner(from369, -1);
let parent372 = node_BAR_371["parent"];
let test__60965__auto__373 = (function () {
 let or__32239__auto__374 = !empty364;
if (or__32239__auto__374 != null && or__32239__auto__374 !== false) {
return or__32239__auto__374;} else {
let or__32239__auto__375 = ("StringContent" === n.name(n.tree(state353, from369, -1)));
if (or__32239__auto__375 != null && or__32239__auto__375 !== false) {
return or__32239__auto__375;} else {
let and__32262__auto__376 = parent372;
if (and__32262__auto__376 != null && and__32262__auto__376 !== false) {
let and__32262__auto__377 = !n.balanced_QMARK_(parent372);
if (and__32262__auto__377 != null && and__32262__auto__377 !== false) {
return n.left_edge_QMARK_(node_BAR_371);} else {
return and__32262__auto__377;}} else {
return and__32262__auto__376;}}}
})();
if (test__60965__auto__373 != null && test__60965__auto__373 !== false) {
return u.deletion(from369, to370);} else {
let test__60965__auto__378 = (function () {
 let and__32262__auto__379 = n.right_edge_QMARK_(node_BAR_371);
if (and__32262__auto__379 != null && and__32262__auto__379 !== false) {
return (from369 == n.end(parent372));} else {
return and__32262__auto__379;}
})();
if (test__60965__auto__378 != null && test__60965__auto__378 !== false) {
return ({ "cursor": (from369 - 1) });} else {
let test__60965__auto__380 = (function () {
 let and__32262__auto__381 = (function () {
 let or__32239__auto__382 = n.start_edge_QMARK_(node_BAR_371);
if (or__32239__auto__382 != null && or__32239__auto__382 !== false) {
return or__32239__auto__382;} else {
return n.same_edge_QMARK_(node_BAR_371);}
})();
if (and__32262__auto__381 != null && and__32262__auto__381 !== false) {
return (n.start(node_BAR_371) == n.start(parent372));} else {
return and__32262__auto__381;}
})();
if (test__60965__auto__380 != null && test__60965__auto__380 !== false) {
let test__60965__auto__383 = n.empty_QMARK_(n.up(node_BAR_371));
if (test__60965__auto__383 != null && test__60965__auto__383 !== false) {
return ({ "cursor": n.start(parent372), "changes": [from_to(n.start(parent372), n.end(parent372))] });} else {
return ({ "cursor": from369 });}} else {
let test__60965__auto__384 = "else";
if (test__60965__auto__384 != null && test__60965__auto__384 !== false) {
return backspace_backoff(state353, from369, to370);} else {
return null;}}}}
}));}
})
;
var coll_pairs = ({ "(": ")", "[": "]", "{": "}", "\"": "\"" })
;
var handle_open = (function (state, open) {
let close385 = squint_core.get(coll_pairs, open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__386) {
let map__387388 = p__386;
let from389 = squint_core.get(map__387388, "from");
let to390 = squint_core.get(map__387388, "to");
let head391 = squint_core.get(map__387388, "head");
let anchor392 = squint_core.get(map__387388, "anchor");
let empty393 = squint_core.get(map__387388, "empty");
let test__60965__auto__394 = in_string_QMARK_(state, from389);
if (test__60965__auto__394 != null && test__60965__auto__394 !== false) {
let test__60965__auto__395 = (open === "\"");
if (test__60965__auto__395 != null && test__60965__auto__395 !== false) {
return u.insertion(head391, "\\\"");} else {
return u.insertion(from389, to390, open);}} else {
let test__60965__auto__396 = escaped_QMARK_(state, from389);
if (test__60965__auto__396 != null && test__60965__auto__396 !== false) {
return u.insertion(from389, to390, open);} else {
let test__60965__auto__397 = "else";
if (test__60965__auto__397 != null && test__60965__auto__397 !== false) {
if (empty393 != null && empty393 !== false) {
return ({ "changes": ({ "insert": squint_core.str(open, close385), "from": head391 }), "cursor": (head391 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from389 }), ({ "insert": close385, "from": to390 })], "from-to": [(anchor392 + squint_core.count(open)), (head391 + squint_core.count(open))] });}} else {
return null;}}}
}));
})
;
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__398) {
let map__399400 = p__398;
let _range401 = map__399400;
let empty402 = squint_core.get(map__399400, "empty");
let head403 = squint_core.get(map__399400, "head");
let from404 = squint_core.get(map__399400, "from");
let to405 = squint_core.get(map__399400, "to");
let test__60965__auto__406 = (function () {
 let or__32239__auto__407 = in_string_QMARK_(state, from404);
if (or__32239__auto__407 != null && or__32239__auto__407 !== false) {
return or__32239__auto__407;} else {
return escaped_QMARK_(state, from404);}
})();
if (test__60965__auto__406 != null && test__60965__auto__406 !== false) {
return u.insertion(from404, to405, key_name);} else {
if (empty402 != null && empty402 !== false) {
let or__32239__auto__408 = (function () {
 let unbalanced409 = (function () {
 let G__410411 = n.tree(state, head403, -1);
let G__410412 = (function () {
 let test__60965__auto__413 = squint_core.nil_QMARK_(G__410411);
if (test__60965__auto__413 != null && test__60965__auto__413 !== false) {
return null;} else {
return n.ancestors(G__410411);}
})();
let G__410414 = (function () {
 let test__60965__auto__415 = squint_core.nil_QMARK_(G__410412);
if (test__60965__auto__415 != null && test__60965__auto__415 !== false) {
return null;} else {
return squint_core.filter(squint_core.every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__410412);}
})();
let test__60965__auto__416 = squint_core.nil_QMARK_(G__410414);
if (test__60965__auto__416 != null && test__60965__auto__416 !== false) {
return null;} else {
return squint_core.first(G__410414);}
})();
let closing417 = (function () {
 let G__418419 = unbalanced409;
let G__418420 = (function () {
 let test__60965__auto__421 = squint_core.nil_QMARK_(G__418419);
if (test__60965__auto__421 != null && test__60965__auto__421 !== false) {
return null;} else {
return n.down(G__418419);}
})();
let test__60965__auto__422 = squint_core.nil_QMARK_(G__418420);
if (test__60965__auto__422 != null && test__60965__auto__422 !== false) {
return null;} else {
return n.closed_by(G__418420);}
})();
let pos423 = (function () {
 let G__424425 = unbalanced409;
let test__60965__auto__426 = squint_core.nil_QMARK_(G__424425);
if (test__60965__auto__426 != null && test__60965__auto__426 !== false) {
return null;} else {
return n.end(G__424425);}
})();
let test__60965__auto__427 = (function () {
 let and__32262__auto__428 = closing417;
if (and__32262__auto__428 != null && and__32262__auto__428 !== false) {
return (closing417 === key_name);} else {
return and__32262__auto__428;}
})();
if (test__60965__auto__427 != null && test__60965__auto__427 !== false) {
return ({ "changes": ({ "from": pos423, "insert": closing417 }), "cursor": (pos423 + 1) });}
})();
if (or__32239__auto__408 != null && or__32239__auto__408 !== false) {
return or__32239__auto__408;} else {
let or__32239__auto__429 = (function () {
 let temp__31807__auto__430 = (function () {
 let temp__31807__auto__431 = n.terminal_cursor(n.tree(state), head403, 1);
if (temp__31807__auto__431 != null && temp__31807__auto__431 !== false) {
let cursor432 = temp__31807__auto__431;
while(true){
let test__60965__auto__433 = n.right_edge_type_QMARK_(cursor432["type"]);
if (test__60965__auto__433 != null && test__60965__auto__433 !== false) {
return n.end(cursor432);} else {
let test__60965__auto__434 = cursor432.next();
if (test__60965__auto__434 != null && test__60965__auto__434 !== false) {
continue;
}};break;
}
}
})();
if (temp__31807__auto__430 != null && temp__31807__auto__430 !== false) {
let close_node_end435 = temp__31807__auto__430;
return ({ "cursor": close_node_end435 });}
})();
if (or__32239__auto__429 != null && or__32239__auto__429 !== false) {
return or__32239__auto__429;} else {
return ({ "cursor": head403 });}}}}
}));
})
;
var handle_backspace_cmd = (function (p__436) {
let map__437438 = p__436;
let view439 = map__437438;
let state440 = squint_core.get(map__437438, "state");
return u.dispatch_some(view439, handle_backspace(state440));
})
;
var handle_open_cmd = (function (key_name) {
return function (p__441) {
let map__442443 = p__441;
let view444 = map__442443;
let state445 = squint_core.get(map__442443, "state");
return u.dispatch_some(view444, handle_open(state445, key_name));
};
})
;
var handle_close_cmd = (function (key_name) {
return function (p__446) {
let map__447448 = p__446;
let view449 = map__447448;
let state450 = squint_core.get(map__447448, "state");
return u.dispatch_some(view449, handle_close(state450, key_name));
};
})
;
var guard_scope = (function (cmd) {
return function (p__451) {
let map__452453 = p__451;
let view454 = map__452453;
let state455 = squint_core.get(map__452453, "state");
let test__60965__auto__456 = (function () {
 let or__32239__auto__457 = n.embedded_QMARK_(state455);
if (or__32239__auto__457 != null && or__32239__auto__457 !== false) {
return or__32239__auto__457;} else {
return n.within_program_QMARK_(state455);}
})();
if (test__60965__auto__456 != null && test__60965__auto__456 !== false) {
return cmd(view454);} else {
return false;}
};
})
;
var extension = (function () {
return Prec.high(view.keymap.of([({ "key": "Backspace", "run": guard_scope((function (p__458) {
let map__459460 = p__458;
let view461 = map__459460;
let state462 = squint_core.get(map__459460, "state");
return u.dispatch_some(view461, handle_backspace(state462));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })]));
})
;
squint_core.prn("close-brackets-loaded");

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
