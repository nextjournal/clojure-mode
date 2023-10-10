import * as squint_core from 'squint-cljs/core.js';
import { StateField } from '@codemirror/state';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
import * as sel from '../selections.mjs';
var event_annotation = u.user_event_annotation("selectionhistory")
;
var second_last = (function (arr) {
let test__60965__auto__564 = (arr["length"] > 1);
if (test__60965__auto__564 != null && test__60965__auto__564 !== false) {
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
}), "update": (function (stack, p__565) {
let map__566568 = p__565;
let tr569 = map__566568;
let map__567570 = squint_core.get(map__566568, "state");
let selection571 = squint_core.get(map__567570, "selection");
let docChanged572 = squint_core.get(map__566568, "docChanged");
let previous_position573 = squint_core.first(squint_core.keep_indexed((function (i, x) {
let test__60965__auto__574 = sel.eq_QMARK_(squint_core.get(x, "selection"), selection571);
if (test__60965__auto__574 != null && test__60965__auto__574 !== false) {
return i;}
}), stack));
if (docChanged572 != null && docChanged572 !== false) {
return squint_core.list(({ "selection": selection571, "event": u.get_user_event_annotation(tr569) }));} else {
let test__60965__auto__575 = !something_selected_QMARK_(selection571);
if (test__60965__auto__575 != null && test__60965__auto__575 !== false) {
return squint_core.list(({ "selection": selection571, "event": u.get_user_event_annotation(tr569) }));} else {
if (previous_position573 != null && previous_position573 !== false) {
let vec__576579 = squint_core.drop(previous_position573, stack);
let seq__577580 = squint_core.seq(vec__576579);
let first__578581 = squint_core.first(seq__577580);
let seq__577582 = squint_core.next(seq__577580);
let f583 = first__578581;
let more584 = seq__577582;
return squint_core.cons(squint_core.assoc(f583, "prev-event", squint_core.get(squint_core.first(stack), "event")), more584);} else {
let test__60965__auto__585 = "else";
if (test__60965__auto__585 != null && test__60965__auto__585 !== false) {
return squint_core.cons(({ "selection": selection571, "event": u.get_user_event_annotation(tr569) }), stack);} else {
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
let node586 = n.nearest_touching(state, end, -1);
return squint_core.first(squint_core.filter((function (p__587) {
let map__588589 = p__587;
let a_start590 = squint_core.get(map__588589, "from");
let a_end591 = squint_core.get(map__588589, "to");
let and__32262__auto__592 = (a_start590 <= start);
if (and__32262__auto__592 != null && and__32262__auto__592 !== false) {
let and__32262__auto__593 = (a_end591 >= end);
if (and__32262__auto__593 != null && and__32262__auto__593 !== false) {
return !(function () {
 let and__32262__auto__594 = (a_start590 == start);
if (and__32262__auto__594 != null && and__32262__auto__594 !== false) {
return (a_end591 == end);} else {
return and__32262__auto__594;}
})();} else {
return and__32262__auto__593;}} else {
return and__32262__auto__592;}
}), squint_core.cons(node586, squint_core.mapcat(squint_core.juxt(n.inner_span, squint_core.identity), n.ancestors(node586)))));
})
;
var selection_grow_STAR_ = (function (state) {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (p__595) {
let map__596597 = p__595;
let range598 = map__596597;
let from599 = squint_core.get(map__596597, "from");
let to600 = squint_core.get(map__596597, "to");
let empty601 = squint_core.get(map__596597, "empty");
if (empty601 != null && empty601 !== false) {
return ({ "range": (function () {
 let or__32239__auto__602 = (function () {
 let G__603604 = n.nearest_touching(state, from599, -1);
let test__60965__auto__605 = squint_core.nil_QMARK_(G__603604);
if (test__60965__auto__605 != null && test__60965__auto__605 !== false) {
return null;} else {
return n.balanced_range(state, G__603604);}
})();
if (or__32239__auto__602 != null && or__32239__auto__602 !== false) {
return or__32239__auto__602;} else {
return range598;}
})() });} else {
return ({ "range": (function () {
 let or__32239__auto__606 = (function () {
 let G__607608 = grow_1(state, from599, to600);
let test__60965__auto__609 = squint_core.nil_QMARK_(G__607608);
if (test__60965__auto__609 != null && test__60965__auto__609 !== false) {
return null;} else {
return n.range(G__607608);}
})();
if (or__32239__auto__606 != null && or__32239__auto__606 !== false) {
return or__32239__auto__606;} else {
return range598;}
})() });}
}));
})
;
var selection_return_STAR_ = (function (state) {
let temp__31754__auto__610 = squint_core.get(squint_core.second(stack(state)), "selection");
if (temp__31754__auto__610 != null && temp__31754__auto__610 !== false) {
let selection611 = temp__31754__auto__610;
return state.update(({ "selection": selection611, "annotations": event_annotation }));} else {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (range) {
return ({ "cursor": range["from"] });
}));}
})
;
squint_core.prn("selection-history-loaded");

export { selection_grow_STAR_, extension, second_last, event_annotation, selection_history_field, selection_return_STAR_, grow_1, ser, something_selected_QMARK_, stack }
