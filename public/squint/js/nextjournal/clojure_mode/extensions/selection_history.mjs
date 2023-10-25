import * as squint_core from 'squint-cljs/core.js';
import { StateField } from '@codemirror/state';
import * as n from './../node.mjs';
import * as sel from './../selections.mjs';
import * as u from './../util.mjs';
var event_annotation = u.user_event_annotation("selectionhistory");
var second_last = (function (arr) {
let test__27847__auto__1 = (arr["length"] > 1);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return arr[(arr["length"] - 1)];}
});
var ser = (function (selection) {
return squint_core.map(squint_core.juxt("anchor", "head"), squint_core.get(js__GT_clj(selection.toJSON(), "keywordize-keys", true), "ranges"));
});
var something_selected_QMARK_ = (function (selection) {
return squint_core.some((function (_PERCENT_1) {
return !_PERCENT_1["empty"];
}), selection["ranges"]);
});
var selection_history_field = StateField.define(({ "create": (function (state) {
return squint_core.list(({ "selection": state["selection"] }));
}), "update": (function (stack, p__410) {
let map__13 = p__410;
let tr4 = map__13;
let map__25 = squint_core.get(map__13, "state");
let selection6 = squint_core.get(map__25, "selection");
let docChanged7 = squint_core.get(map__13, "docChanged");
let previous_position8 = squint_core.first(squint_core.keep_indexed((function (i, x) {
let test__27847__auto__9 = sel.eq_QMARK_(squint_core.get(x, "selection"), selection6);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
return i;}
}), stack));
if (docChanged7 != null && docChanged7 !== false) {
return squint_core.list(({ "selection": selection6, "event": u.get_user_event_annotation(tr4) }));} else {
let test__27847__auto__10 = !something_selected_QMARK_(selection6);
if (test__27847__auto__10 != null && test__27847__auto__10 !== false) {
return squint_core.list(({ "selection": selection6, "event": u.get_user_event_annotation(tr4) }));} else {
if (previous_position8 != null && previous_position8 !== false) {
let vec__1114 = squint_core.drop(previous_position8, stack);
let seq__1215 = squint_core.seq(vec__1114);
let first__1316 = squint_core.first(seq__1215);
let seq__1217 = squint_core.next(seq__1215);
let f18 = first__1316;
let more19 = seq__1217;
return squint_core.cons(squint_core.assoc(f18, "prev-event", squint_core.get(squint_core.first(stack), "event")), more19);} else {
let test__27847__auto__20 = "else";
if (test__27847__auto__20 != null && test__27847__auto__20 !== false) {
return squint_core.cons(({ "selection": selection6, "event": u.get_user_event_annotation(tr4) }), stack);} else {
return null;}}}}
}) }));
var extension = (function () {
return selection_history_field;
});
var stack = (function (state) {
return state.field(selection_history_field);
});
var grow_1 = (function (state, start, end) {
let node1 = n.nearest_touching(state, end, -1);
return squint_core.first(squint_core.filter((function (p__411) {
let map__23 = p__411;
let a_start4 = squint_core.get(map__23, "from");
let a_end5 = squint_core.get(map__23, "to");
let and__28236__auto__6 = (a_start4 <= start);
if (and__28236__auto__6 != null && and__28236__auto__6 !== false) {
let and__28236__auto__7 = (a_end5 >= end);
if (and__28236__auto__7 != null && and__28236__auto__7 !== false) {
return !(function () {
 let and__28236__auto__8 = (a_start4 == start);
if (and__28236__auto__8 != null && and__28236__auto__8 !== false) {
return (a_end5 == end);} else {
return and__28236__auto__8;}
})();} else {
return and__28236__auto__7;}} else {
return and__28236__auto__6;}
}), squint_core.cons(node1, squint_core.mapcat(squint_core.juxt(n.inner_span, squint_core.identity), n.ancestors(node1)))));
});
var selection_grow_STAR_ = (function (state) {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (p__412) {
let map__12 = p__412;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
return ({ "range": (function () {
 let or__28221__auto__7 = (function () {
 let G__4138 = n.nearest_touching(state, from4, -1);
let test__27847__auto__9 = squint_core.nil_QMARK_(G__4138);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
return null;} else {
return n.balanced_range(state, G__4138);}
})();
if (or__28221__auto__7 != null && or__28221__auto__7 !== false) {
return or__28221__auto__7;} else {
return range3;}
})() });} else {
return ({ "range": (function () {
 let or__28221__auto__10 = (function () {
 let G__41411 = grow_1(state, from4, to5);
let test__27847__auto__12 = squint_core.nil_QMARK_(G__41411);
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
return null;} else {
return n.range(G__41411);}
})();
if (or__28221__auto__10 != null && or__28221__auto__10 !== false) {
return or__28221__auto__10;} else {
return range3;}
})() });}
}));
});
var selection_return_STAR_ = (function (state) {
let temp__27663__auto__1 = squint_core.get(squint_core.second(stack(state)), "selection");
if (temp__27663__auto__1 != null && temp__27663__auto__1 !== false) {
let selection2 = temp__27663__auto__1;
return state.update(({ "selection": selection2, "annotations": event_annotation }));} else {
return u.update_ranges(state, ({ "annotations": event_annotation }), (function (range) {
return ({ "cursor": range["from"] });
}));}
});
squint_core.prn("selection-history-loaded");

export { selection_grow_STAR_, extension, second_last, event_annotation, selection_history_field, selection_return_STAR_, grow_1, ser, something_selected_QMARK_, stack }
