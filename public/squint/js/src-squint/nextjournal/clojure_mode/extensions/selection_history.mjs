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
var selection_history_field = "Stores selection history"
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
let node1 = n.nearest_touching(state, end, -1);
return squint_core.first(squint_core.filter((function (p__2) {
let map__34 = p__2;
let a_start5 = squint_core.get(map__34, "from");
let a_end6 = squint_core.get(map__34, "to");
return ((a_start5 <= start) && (a_end6 >= end) && !((a_start5 == start) && (a_end6 == end)));
}), squint_core.cons(node1, squint_core.mapcat(juxt(n.inner_span, squint_core.identity), n.ancestors(node1)))));
})
;
var selection_grow_STAR_ = (function (state) {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (p__7) {
let map__89 = p__7;
let range10 = map__89;
let from11 = squint_core.get(map__89, "from");
let to12 = squint_core.get(map__89, "to");
let empty13 = squint_core.get(map__89, "empty");
if (empty13) {
return ({ "range": ((function () {
 let G__1415 = n.nearest_touching(state, from11, -1);
if (squint_core.nil_QMARK_(G__1415)) {
return null;} else {
return n.balanced_range(state, G__1415);}
})() || range10) });} else {
return ({ "range": ((function () {
 let G__1617 = grow_1(state, from11, to12);
if (squint_core.nil_QMARK_(G__1617)) {
return null;} else {
return n.range(G__1617);}
})() || range10) });}
}));
})
;
var selection_return_STAR_ = (function (state) {
let temp__24970__auto__18 = squint_core.get(squint_core.second(stack(state)), "selection");
if (temp__24970__auto__18) {
let selection19 = temp__24970__auto__18;
return state.update(({ "selection": selection19, "annotations": event_annotation }));} else {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (range) {
return ({ "cursor": range["from"] });
}));}
})
;
squint_core.prn("selection-history-loaded");

export { selection_grow_STAR_, extension, second_last, event_annotation, selection_history_field, selection_return_STAR_, grow_1, ser, something_selected_QMARK_, stack }
