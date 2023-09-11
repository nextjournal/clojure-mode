import * as squint_core from 'squint-cljs/core.js';
import { StateField } from '@codemirror/state';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
import * as sel from '../selections.mjs';
var event_annotation = u.user_event_annotation("selectionhistory")
;
var second_last = (function (arr) {
if ((arr["length"] > 1)) {
return arr[(arr["length"] - 1)];}
})
;
var ser = (function (selection) {
return squint_core.map(juxt("anchor", "head"), squint_core.get(js__GT_clj(selection.toJSON(), "keywordize-keys", true), "ranges"));
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
}), "update": (function (stack, p__1) {
let map__24 = p__1;
let tr5 = map__24;
let map__36 = squint_core.get(map__24, "state");
let selection7 = squint_core.get(map__36, "selection");
let docChanged8 = squint_core.get(map__24, "docChanged");
let previous_position9 = squint_core.first(squint_core.keep_indexed((function (i, x) {
if (sel.eq_QMARK_(squint_core.get(x, "selection"), selection7)) {
return i;}
}), stack));
if (docChanged8) {
return squint_core.list(({ "selection": selection7, "event": u.get_user_event_annotation(tr5) }));} else {
if (!something_selected_QMARK_(selection7)) {
return squint_core.list(({ "selection": selection7, "event": u.get_user_event_annotation(tr5) }));} else {
if (previous_position9) {
let vec__1013 = squint_core.drop(previous_position9, stack);
let seq__1114 = squint_core.seq(vec__1013);
let first__1215 = squint_core.first(seq__1114);
let seq__1116 = next(seq__1114);
let f17 = first__1215;
let more18 = seq__1116;
return squint_core.cons(squint_core.assoc(f17, "prev-event", squint_core.get(squint_core.first(stack), "event")), more18);} else {
if ("else") {
return squint_core.cons(({ "selection": selection7, "event": u.get_user_event_annotation(tr5) }), stack);} else {
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
let node19 = n.nearest_touching(state, end, -1);
return squint_core.first(squint_core.filter((function (p__20) {
let map__2122 = p__20;
let a_start23 = squint_core.get(map__2122, "from");
let a_end24 = squint_core.get(map__2122, "to");
return ((a_start23 <= start) && (a_end24 >= end) && !((a_start23 == start) && (a_end24 == end)));
}), squint_core.cons(node19, squint_core.mapcat(juxt(n.inner_span, squint_core.identity), n.ancestors(node19)))));
})
;
var selection_grow_STAR_ = (function (state) {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (p__25) {
let map__2627 = p__25;
let range28 = map__2627;
let from29 = squint_core.get(map__2627, "from");
let to30 = squint_core.get(map__2627, "to");
let empty31 = squint_core.get(map__2627, "empty");
if (empty31) {
return ({ "range": ((function () {
 let G__3233 = n.nearest_touching(state, from29, -1);
if (squint_core.nil_QMARK_(G__3233)) {
return null;} else {
return n.balanced_range(state, G__3233);}
})() || range28) });} else {
return ({ "range": ((function () {
 let G__3435 = grow_1(state, from29, to30);
if (squint_core.nil_QMARK_(G__3435)) {
return null;} else {
return n.range(G__3435);}
})() || range28) });}
}));
})
;
var selection_return_STAR_ = (function (state) {
let temp__27662__auto__36 = squint_core.get(squint_core.second(stack(state)), "selection");
if (temp__27662__auto__36) {
let selection37 = temp__27662__auto__36;
return state.update(({ "selection": selection37, "annotations": event_annotation }));} else {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (range) {
return ({ "cursor": range["from"] });
}));}
})
;
squint_core.prn("selection-history-loaded");

export { selection_grow_STAR_, extension, second_last, event_annotation, selection_history_field, selection_return_STAR_, grow_1, ser, something_selected_QMARK_, stack }
