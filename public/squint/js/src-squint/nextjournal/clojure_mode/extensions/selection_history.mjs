import * as squint_core from 'squint-cljs/core.js';
import { StateField } from '@codemirror/state';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
import * as sel from '../selections.mjs';
var event_annotation = u.user_event_annotation("selectionhistory")
;
var second_last = (function (arr) {
let test__26256__auto__514 = (arr["length"] > 1);
if (test__26256__auto__514 != null && test__26256__auto__514 !== false) {
return arr[(arr["length"] - 1)];}
})
;
var ser = (function (selection) {
return squint_core.map(squint_core.juxt("anchor", "head"), squint_core.get(js__GT_clj(selection.toJSON(), "keywordize-keys", true), "ranges"));
})
;
var something_selected_QMARK_ = (function (selection) {
return squint_core.some((function (_PERCENT_1) {
return !_PERCENT_1["empty"];
}), selection["ranges"]);
})
;
var selection_history_field = StateField.define(({ "create": (function (state) {
return squint_core.list(({ "selection": state["selection"] }));
}), "update": (function (stack, p__515) {
let map__516518 = p__515;
let tr519 = map__516518;
let map__517520 = squint_core.get(map__516518, "state");
let selection521 = squint_core.get(map__517520, "selection");
let docChanged522 = squint_core.get(map__516518, "docChanged");
let previous_position523 = squint_core.first(squint_core.keep_indexed((function (i, x) {
let test__26256__auto__524 = sel.eq_QMARK_(squint_core.get(x, "selection"), selection521);
if (test__26256__auto__524 != null && test__26256__auto__524 !== false) {
return i;}
}), stack));
if (docChanged522 != null && docChanged522 !== false) {
return squint_core.list(({ "selection": selection521, "event": u.get_user_event_annotation(tr519) }));} else {
let test__26256__auto__525 = !something_selected_QMARK_(selection521);
if (test__26256__auto__525 != null && test__26256__auto__525 !== false) {
return squint_core.list(({ "selection": selection521, "event": u.get_user_event_annotation(tr519) }));} else {
if (previous_position523 != null && previous_position523 !== false) {
let vec__526529 = squint_core.drop(previous_position523, stack);
let seq__527530 = squint_core.seq(vec__526529);
let first__528531 = squint_core.first(seq__527530);
let seq__527532 = squint_core.next(seq__527530);
let f533 = first__528531;
let more534 = seq__527532;
return squint_core.cons(squint_core.assoc(f533, "prev-event", squint_core.get(squint_core.first(stack), "event")), more534);} else {
if ("else" != null && "else" !== false) {
return squint_core.cons(({ "selection": selection521, "event": u.get_user_event_annotation(tr519) }), stack);} else {
return null;}}}}
}) }))
;
var extension = (function () {
return selection_history_field;
})
;
var stack = (function (state) {
return state.field(selection_history_field);
})
;
var grow_1 = (function (state, start, end) {
let node535 = n.nearest_touching(state, end, -1);
return squint_core.first(squint_core.filter((function (p__536) {
let map__537538 = p__536;
let a_start539 = squint_core.get(map__537538, "from");
let a_end540 = squint_core.get(map__537538, "to");
let and__25509__auto__541 = (a_start539 <= start);
if (and__25509__auto__541 != null && and__25509__auto__541 !== false) {
let and__25509__auto__542 = (a_end540 >= end);
if (and__25509__auto__542 != null && and__25509__auto__542 !== false) {
return !(function () {
 let and__25509__auto__543 = (a_start539 == start);
if (and__25509__auto__543 != null && and__25509__auto__543 !== false) {
return (a_end540 == end);} else {
return and__25509__auto__543;}
})();} else {
return and__25509__auto__542;}} else {
return and__25509__auto__541;}
}), squint_core.cons(node535, squint_core.mapcat(squint_core.juxt(n.inner_span, squint_core.identity), n.ancestors(node535)))));
})
;
var selection_grow_STAR_ = (function (state) {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (p__544) {
let map__545546 = p__544;
let range547 = map__545546;
let from548 = squint_core.get(map__545546, "from");
let to549 = squint_core.get(map__545546, "to");
let empty550 = squint_core.get(map__545546, "empty");
if (empty550 != null && empty550 !== false) {
return ({ "range": (function () {
 let or__25460__auto__551 = (function () {
 let G__552553 = n.nearest_touching(state, from548, -1);
let test__26256__auto__554 = squint_core.nil_QMARK_(G__552553);
if (test__26256__auto__554 != null && test__26256__auto__554 !== false) {
return null;} else {
return n.balanced_range(state, G__552553);}
})();
if (or__25460__auto__551 != null && or__25460__auto__551 !== false) {
return or__25460__auto__551;} else {
return range547;}
})() });} else {
return ({ "range": (function () {
 let or__25460__auto__555 = (function () {
 let G__556557 = grow_1(state, from548, to549);
let test__26256__auto__558 = squint_core.nil_QMARK_(G__556557);
if (test__26256__auto__558 != null && test__26256__auto__558 !== false) {
return null;} else {
return n.range(G__556557);}
})();
if (or__25460__auto__555 != null && or__25460__auto__555 !== false) {
return or__25460__auto__555;} else {
return range547;}
})() });}
}));
})
;
var selection_return_STAR_ = (function (state) {
let temp__24803__auto__559 = squint_core.get(squint_core.second(stack(state)), "selection");
if (temp__24803__auto__559 != null && temp__24803__auto__559 !== false) {
let selection560 = temp__24803__auto__559;
return state.update(({ "selection": selection560, "annotations": event_annotation }));} else {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (range) {
return ({ "cursor": range["from"] });
}));}
})
;
squint_core.prn("selection-history-loaded");

export { selection_grow_STAR_, extension, second_last, event_annotation, selection_history_field, selection_return_STAR_, grow_1, ser, something_selected_QMARK_, stack }
