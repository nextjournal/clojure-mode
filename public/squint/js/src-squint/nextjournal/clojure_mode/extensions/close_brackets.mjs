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
let test__26256__auto__298 = (function () {
 let and__25509__auto__299 = (function () {
 let G__300301 = n.node_BAR_(state, (from - 1));
let test__26256__auto__302 = squint_core.nil_QMARK_(G__300301);
if (test__26256__auto__302 != null && test__26256__auto__302 !== false) {
return null;} else {
return u.guard(G__300301, n.line_comment_QMARK_);}
})();
if (and__25509__auto__299 != null && and__25509__auto__299 !== false) {
return !str.blank_QMARK_(u.line_content_at(state, from));} else {
return and__25509__auto__299;}
})();
if (test__26256__auto__298 != null && test__26256__auto__298 !== false) {
return ({ "cursor": (from - 1) });} else {
return u.deletion(from, to);}
})
;
var handle_backspace = (function (p__303) {
let map__304305 = p__303;
let state306 = map__304305;
let doc307 = squint_core.get(map__304305, "doc");
let test__26256__auto__308 = (function () {
 let and__25509__auto__309 = (1 === state306["selection"]["ranges"]["length"]);
if (and__25509__auto__309 != null && and__25509__auto__309 !== false) {
let range310 = squint_core.get_in(state306, ["selection", "ranges", 0]);
let and__25509__auto__311 = range310["empty"];
if (and__25509__auto__311 != null && and__25509__auto__311 !== false) {
return (0 === range310["from"]);} else {
return and__25509__auto__311;}} else {
return and__25509__auto__309;}
})();
if (test__26256__auto__308 != null && test__26256__auto__308 !== false) {
return null;} else {
return u.update_ranges(state306, ({ "annotations": u.user_event_annotation("delete") }), (function (p__312) {
let map__313314 = p__312;
let _range315 = map__313314;
let head316 = squint_core.get(map__313314, "head");
let empty317 = squint_core.get(map__313314, "empty");
let anchor318 = squint_core.get(map__313314, "anchor");
let map__319320 = from_to(head316, anchor318);
let _range321 = map__319320;
let from322 = squint_core.get(map__319320, "from");
let to323 = squint_core.get(map__319320, "to");
let node_BAR_324 = n.tree(state306).resolveInner(from322, -1);
let parent325 = node_BAR_324["parent"];
let test__26256__auto__326 = (function () {
 let or__25460__auto__327 = !empty317;
if (or__25460__auto__327 != null && or__25460__auto__327 !== false) {
return or__25460__auto__327;} else {
let or__25460__auto__328 = ("StringContent" === n.name(n.tree(state306, from322, -1)));
if (or__25460__auto__328 != null && or__25460__auto__328 !== false) {
return or__25460__auto__328;} else {
let and__25509__auto__329 = parent325;
if (and__25509__auto__329 != null && and__25509__auto__329 !== false) {
let and__25509__auto__330 = !n.balanced_QMARK_(parent325);
if (and__25509__auto__330 != null && and__25509__auto__330 !== false) {
return n.left_edge_QMARK_(node_BAR_324);} else {
return and__25509__auto__330;}} else {
return and__25509__auto__329;}}}
})();
if (test__26256__auto__326 != null && test__26256__auto__326 !== false) {
return u.deletion(from322, to323);} else {
let test__26256__auto__331 = (function () {
 let and__25509__auto__332 = n.right_edge_QMARK_(node_BAR_324);
if (and__25509__auto__332 != null && and__25509__auto__332 !== false) {
return (from322 == n.end(parent325));} else {
return and__25509__auto__332;}
})();
if (test__26256__auto__331 != null && test__26256__auto__331 !== false) {
return ({ "cursor": (from322 - 1) });} else {
let test__26256__auto__333 = (function () {
 let and__25509__auto__334 = (function () {
 let or__25460__auto__335 = n.start_edge_QMARK_(node_BAR_324);
if (or__25460__auto__335 != null && or__25460__auto__335 !== false) {
return or__25460__auto__335;} else {
return n.same_edge_QMARK_(node_BAR_324);}
})();
if (and__25509__auto__334 != null && and__25509__auto__334 !== false) {
return (n.start(node_BAR_324) == n.start(parent325));} else {
return and__25509__auto__334;}
})();
if (test__26256__auto__333 != null && test__26256__auto__333 !== false) {
let test__26256__auto__336 = n.empty_QMARK_(n.up(node_BAR_324));
if (test__26256__auto__336 != null && test__26256__auto__336 !== false) {
return ({ "cursor": n.start(parent325), "changes": [from_to(n.start(parent325), n.end(parent325))] });} else {
return ({ "cursor": from322 });}} else {
if ("else" != null && "else" !== false) {
return backspace_backoff(state306, from322, to323);} else {
return null;}}}}
}));}
})
;
var coll_pairs = ({ "(": ")", "[": "]", "{": "}", "\"": "\"" })
;
var handle_open = (function (state, open) {
let close337 = squint_core.get(coll_pairs, open);
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__338) {
let map__339340 = p__338;
let from341 = squint_core.get(map__339340, "from");
let to342 = squint_core.get(map__339340, "to");
let head343 = squint_core.get(map__339340, "head");
let anchor344 = squint_core.get(map__339340, "anchor");
let empty345 = squint_core.get(map__339340, "empty");
let test__26256__auto__346 = in_string_QMARK_(state, from341);
if (test__26256__auto__346 != null && test__26256__auto__346 !== false) {
let test__26256__auto__347 = (open === "\"");
if (test__26256__auto__347 != null && test__26256__auto__347 !== false) {
return u.insertion(head343, "\\\"");} else {
return u.insertion(from341, to342, open);}} else {
let test__26256__auto__348 = escaped_QMARK_(state, from341);
if (test__26256__auto__348 != null && test__26256__auto__348 !== false) {
return u.insertion(from341, to342, open);} else {
if ("else" != null && "else" !== false) {
if (empty345 != null && empty345 !== false) {
return ({ "changes": ({ "insert": squint_core.str(open, close337), "from": head343 }), "cursor": (head343 + squint_core.count(open)) });} else {
return ({ "changes": [({ "insert": open, "from": from341 }), ({ "insert": close337, "from": to342 })], "from-to": [(anchor344 + squint_core.count(open)), (head343 + squint_core.count(open))] });}} else {
return null;}}}
}));
})
;
var handle_close = (function (state, key_name) {
return u.update_ranges(state, ({ "annotations": u.user_event_annotation("input") }), (function (p__349) {
let map__350351 = p__349;
let _range352 = map__350351;
let empty353 = squint_core.get(map__350351, "empty");
let head354 = squint_core.get(map__350351, "head");
let from355 = squint_core.get(map__350351, "from");
let to356 = squint_core.get(map__350351, "to");
let test__26256__auto__357 = (function () {
 let or__25460__auto__358 = in_string_QMARK_(state, from355);
if (or__25460__auto__358 != null && or__25460__auto__358 !== false) {
return or__25460__auto__358;} else {
return escaped_QMARK_(state, from355);}
})();
if (test__26256__auto__357 != null && test__26256__auto__357 !== false) {
return u.insertion(from355, to356, key_name);} else {
if (empty353 != null && empty353 !== false) {
let or__25460__auto__359 = (function () {
 let unbalanced360 = (function () {
 let G__361362 = n.tree(state, head354, -1);
let G__361363 = (function () {
 let test__26256__auto__364 = squint_core.nil_QMARK_(G__361362);
if (test__26256__auto__364 != null && test__26256__auto__364 !== false) {
return null;} else {
return n.ancestors(G__361362);}
})();
let G__361365 = (function () {
 let test__26256__auto__366 = squint_core.nil_QMARK_(G__361363);
if (test__26256__auto__366 != null && test__26256__auto__366 !== false) {
return null;} else {
return squint_core.filter(squint_core.every_pred(n.coll_QMARK_, squint_core.complement(n.balanced_QMARK_)), G__361363);}
})();
let test__26256__auto__367 = squint_core.nil_QMARK_(G__361365);
if (test__26256__auto__367 != null && test__26256__auto__367 !== false) {
return null;} else {
return squint_core.first(G__361365);}
})();
let closing368 = (function () {
 let G__369370 = unbalanced360;
let G__369371 = (function () {
 let test__26256__auto__372 = squint_core.nil_QMARK_(G__369370);
if (test__26256__auto__372 != null && test__26256__auto__372 !== false) {
return null;} else {
return n.down(G__369370);}
})();
let test__26256__auto__373 = squint_core.nil_QMARK_(G__369371);
if (test__26256__auto__373 != null && test__26256__auto__373 !== false) {
return null;} else {
return n.closed_by(G__369371);}
})();
let pos374 = (function () {
 let G__375376 = unbalanced360;
let test__26256__auto__377 = squint_core.nil_QMARK_(G__375376);
if (test__26256__auto__377 != null && test__26256__auto__377 !== false) {
return null;} else {
return n.end(G__375376);}
})();
let test__26256__auto__378 = (function () {
 let and__25509__auto__379 = closing368;
if (and__25509__auto__379 != null && and__25509__auto__379 !== false) {
return (closing368 === key_name);} else {
return and__25509__auto__379;}
})();
if (test__26256__auto__378 != null && test__26256__auto__378 !== false) {
return ({ "changes": ({ "from": pos374, "insert": closing368 }), "cursor": (pos374 + 1) });}
})();
if (or__25460__auto__359 != null && or__25460__auto__359 !== false) {
return or__25460__auto__359;} else {
let or__25460__auto__380 = (function () {
 let temp__24938__auto__381 = (function () {
 let temp__24938__auto__382 = n.terminal_cursor(n.tree(state), head354, 1);
if (temp__24938__auto__382 != null && temp__24938__auto__382 !== false) {
let cursor383 = temp__24938__auto__382;
while(true){
let test__26256__auto__384 = n.right_edge_type_QMARK_(cursor383["type"]);
if (test__26256__auto__384 != null && test__26256__auto__384 !== false) {
return n.end(cursor383);} else {
let test__26256__auto__385 = cursor383.next();
if (test__26256__auto__385 != null && test__26256__auto__385 !== false) {
continue;
}};break;
}
}
})();
if (temp__24938__auto__381 != null && temp__24938__auto__381 !== false) {
let close_node_end386 = temp__24938__auto__381;
return ({ "cursor": close_node_end386 });}
})();
if (or__25460__auto__380 != null && or__25460__auto__380 !== false) {
return or__25460__auto__380;} else {
return ({ "cursor": head354 });}}}}
}));
})
;
var handle_backspace_cmd = (function (p__387) {
let map__388389 = p__387;
let view390 = map__388389;
let state391 = squint_core.get(map__388389, "state");
return u.dispatch_some(view390, handle_backspace(state391));
})
;
var handle_open_cmd = (function (key_name) {
return function (p__392) {
let map__393394 = p__392;
let view395 = map__393394;
let state396 = squint_core.get(map__393394, "state");
return u.dispatch_some(view395, handle_open(state396, key_name));
};
})
;
var handle_close_cmd = (function (key_name) {
return function (p__397) {
let map__398399 = p__397;
let view400 = map__398399;
let state401 = squint_core.get(map__398399, "state");
return u.dispatch_some(view400, handle_close(state401, key_name));
};
})
;
var guard_scope = (function (cmd) {
return function (p__402) {
let map__403404 = p__402;
let view405 = map__403404;
let state406 = squint_core.get(map__403404, "state");
let test__26256__auto__407 = (function () {
 let or__25460__auto__408 = n.embedded_QMARK_(state406);
if (or__25460__auto__408 != null && or__25460__auto__408 !== false) {
return or__25460__auto__408;} else {
return n.within_program_QMARK_(state406);}
})();
if (test__26256__auto__407 != null && test__26256__auto__407 !== false) {
return cmd(view405);} else {
return false;}
};
})
;
var extension = (function () {
return Prec.high(view.keymap.of([({ "key": "Backspace", "run": guard_scope((function (p__409) {
let map__410411 = p__409;
let view412 = map__410411;
let state413 = squint_core.get(map__410411, "state");
return u.dispatch_some(view412, handle_backspace(state413));
})) }), ({ "key": "(", "run": guard_scope(handle_open_cmd("(")) }), ({ "key": "[", "run": guard_scope(handle_open_cmd("[")) }), ({ "key": "{", "run": guard_scope(handle_open_cmd("{")) }), ({ "key": "\"", "run": guard_scope(handle_open_cmd("\"")) }), ({ "key": ")", "run": guard_scope(handle_close_cmd(")")) }), ({ "key": "]", "run": guard_scope(handle_close_cmd("]")) }), ({ "key": "}", "run": guard_scope(handle_close_cmd("}")) })]));
})
;
squint_core.prn("close-brackets-loaded");

export { handle_backspace_cmd, handle_backspace, handle_close_cmd, backspace_backoff, escaped_QMARK_, guard_scope, handle_close, handle_open_cmd, extension, in_string_QMARK_, handle_open, coll_pairs }
