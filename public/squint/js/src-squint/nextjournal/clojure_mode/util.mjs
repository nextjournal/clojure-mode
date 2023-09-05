import * as squint_core from 'squint-cljs/core.js';
import { EditorSelection, ChangeSet, ChangeDesc, TransactionSpec, StrictTransactionSpec, StateEffect, Transaction } from '@codemirror/state';
import * as sel from './selections';
goog_define(node_js_QMARK_, false);
var user_event_annotation = (function (event_name) {
return Transaction["userEvent"].of(event_name);
})
;
var get_user_event_annotation = (function (tr) {
return tr.annotation(Transaction["userEvent"]);
})
;
var guard = (function (x, f) {
if (f(x)) {
return x;}
})
;
var from_to = (function (p1, p2) {
if ((p1 > p2)) {
return ({ "from": p2, "to": p1 });} else {
return ({ "from": p1, "to": p2 });}
})
;
var dispatch_some = (function (view, tr) {
if (tr) {
view.dispatch(tr);
return true;} else {
return false;}
})
;
var insertion = (function () {
 let f1 = (function (var_args) {
let G__45 = arguments["length"];
switch (G__45) {case 2:
return f1.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f1.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f1["cljs$core$IFn$_invoke$arity$2"] = (function (from, s) {
return insertion(from, from, s);
});
f1["cljs$core$IFn$_invoke$arity$3"] = (function (from, to, s) {
return ({ "changes": ({ "insert": s, "from": from, "to": to }), "cursor": (from + squint_core.count(s)) });
});
f1["cljs$lang$maxFixedArity"] = 3;
return f1;
})()
;
var deletion = (function () {
 let f7 = (function (var_args) {
let G__1011 = arguments["length"];
switch (G__1011) {case 1:
return f7.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f7.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f7["cljs$core$IFn$_invoke$arity$1"] = (function (from) {
return deletion(max(0, (from - 1)), from);
});
f7["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
let from13 = ((from === to)) ? (max(0, (from - 1))) : (from);
return ({ "cursor": from13, "changes": ({ "from": from13, "to": to }) });
});
f7["cljs$lang$maxFixedArity"] = 2;
return f7;
})()
;
var line_content_at = (function (state, from) {
return j.call(j.call_in(state, ["doc", "lineAt"], from), "slice");
})
;
var map_cursor = (function (original_range, state, update_map) {
assert(map_QMARK_(update_map));
let map__1415 = guard(update_map, map_QMARK_);
let mapped16 = squint_core.get(map__1415, "cursor/mapped");
let cursor17 = squint_core.get(map__1415, "cursor");
let from_to18 = squint_core.get(map__1415, "from-to");
let range19 = squint_core.get(map__1415, "range");
let changes20 = squint_core.get(map__1415, "changes");
let change_desc21 = (changes20) ? (state.changes(clj__GT_js(changes20))) : (null);
let G__2223 = ({ "range": (range19 || (mapped16) ? (sel.cursor(change_desc21.mapPos(mapped16))) : ((cursor17) ? (sel.cursor(cursor17)) : ((from_to18) ? (sel.range(from_to18(0), from_to18(1))) : (null))) || original_range) });
if (change_desc21) {
return j._BANG_set(G__2223, "changes", change_desc21);} else {
return G__2223;}
})
;
var update_ranges = (function () {
 let f24 = (function (var_args) {
let G__2728 = arguments["length"];
switch (G__2728) {case 2:
return f24.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f24.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f24["cljs$core$IFn$_invoke$arity$2"] = (function (state, f) {
return update_ranges(state, null, f);
});
f24["cljs$core$IFn$_invoke$arity$3"] = (function (state, tr_specs, f) {
return state.update((function (_PERCENT_1) {
return j.extend_BANG_(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
return ((function () {
 let temp__25231__auto__30 = f(range);
if (squint_core.nil_QMARK_(temp__25231__auto__30)) {
return null;} else {
let result31 = temp__25231__auto__30;
return map_cursor(range, state, result31);}
})() || ({ "range": range }));
}))));
});
f24["cljs$lang$maxFixedArity"] = 3;
return f24;
})()
;
var dispatch_changes = (function (state, dispatch, changes) {
if (changes["empty"]) {
return null;} else {
return dispatch(state.update(({ "changes": changes })));}
})
;
var update_lines = (function () {
 let f32 = (function (var_args) {
let args3338 = [];
let len__24329__auto__39 = arguments["length"];
let i3440 = 0;
while(true){
if ((i3440 < len__24329__auto__39)) {
args3338.push((arguments[i3440]));
let G__41 = (i3440 + 1);
i3440 = G__41;
continue;
};break;
}
;
let argseq__24575__auto__42 = ((2 < args3338["length"])) ? (args3338.slice(2)) : (null);
return f32.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__24575__auto__42);
});
f32["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__43) {
let vec__4448 = p__43;
let map__4749 = squint_core.nth(vec__4448, 0, null);
let from50 = squint_core.get(map__4749, "from", 0);
let to51 = squint_core.get(map__4749, "to");
let spec52 = squint_core.get(map__4749, "spec");
let iterator53 = state["doc"].iter();
let result54 = iterator53.next();
let changes55 = [];
let from_pos56 = from50;
let line_num57 = 1;
while(true){
return j.let$([({ "keys": [done, lineBreak, value] }), result54], ((done || (from50 > to51))) ? (state.update(j.extend_BANG_(({ "changes": state.changes(changes55) }), spec52))) : (let G__58 = iterator53.next();
let G__59 = (function () {
 let temp__24970__auto__60 = (!lineBreak && f(from_pos56, value, line_num57));
if (temp__24970__auto__60) {
let change61 = temp__24970__auto__60;
return j.push_BANG_(changes55, change61);} else {
return changes55;}
})();
let G__62 = (from_pos56 + squint_core.count(value));
let G__63 = (function () {
 let G__6465 = line_num57;
if (lineBreak) {
return (G__6465 + 1);} else {
return G__6465;}
})();
result54 = G__58;
changes55 = G__59;
from_pos56 = G__62;
line_num57 = G__63;
continue;
));;break;
}

});
f32["cljs$lang$maxFixedArity"] = 2;
f32["cljs$lang$applyTo"] = (function (seq35) {
let G__3666 = squint_core.first(seq35);
let seq3567 = next(seq35);
let G__3768 = squint_core.first(seq3567);
let seq3569 = next(seq3567);
let self__24359__auto__70 = this;
return self__24359__auto__70.cljs$core$IFn$_invoke$arity$variadic(G__3666, G__3768, seq3569);
});
return f32;
})()
;
var update_selected_lines = (function (state, f) {
let at_line71 = squint_core.atom(-1);
let doc72 = state["doc"];
return state.changeByRange(j.fn([({ "as": squint_core.range, "keys": [from, to, anchor, head] })], j.let$([changes, []], (function () {
 let line73 = doc72.lineAt(from);
while(true){
return j.let$([({ "line-number": "number", "line-to": "to" }), line73], ((line73["number"] > squint_core.deref(at_line71))) ? ((function () {
 squint_core.reset_BANG_(at_line71, line_number);
return f(line73, changes, squint_core.range);
})()) : (null), (function () {
 let temp__24970__auto__74 = ((to > line_to) && guard(doc72.lineAt((line_to + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number);
})));
if (temp__24970__auto__74) {
let next_line75 = temp__24970__auto__74;
let G__76 = next_line75;
line73 = G__76;
continue;
} else {
let change_set77 = state.changes(changes);
return ({ "changes": changes, "range": EditorSelection.range(change_set77.mapPos(anchor, 1), change_set77.mapPos(head, 1)) });}
})());;break;
}

})())));
})
;
var iter_changed_lines = (function (p__78, f) {
let map__7981 = p__78;
let tr82 = map__7981;
let map__8083 = squint_core.get(map__7981, "state");
let state84 = map__8083;
let doc85 = squint_core.get(map__8083, "doc");
let changes86 = squint_core.get(map__7981, "changes");
let effects87 = squint_core.get(map__7981, "effects");
let selection88 = squint_core.get(map__7981, "selection");
let at_line89 = squint_core.atom(-1);
let next_changes90 = [];
let _91 = changes86.iterChanges((function (from_a, to_a, from_b, to_b, inserted) {
return j.let$([({ "as": line, "line-number": "number", "line-to": "to" }), doc85.lineAt(from_b)], (function () {
 let line92 = line;
while(true){
if ((line_number > squint_core.deref(at_line89))) {
squint_core.reset_BANG_(at_line89, line_number);
f(line92, next_changes90)};
if ((to_b <= line_to)) {
return null;} else {
let next_line93 = doc85.lineAt((line_to + 1));
if ((next_line93 && (next_line93["number"] > line92["number"]))) {
let G__94 = next_line93;
line92 = G__94;
continue;
}};break;
}

})());
}));
let next_changeset95 = state84.changes(next_changes90);
if (squint_core.seq(next_changes90)) {
let G__9697 = j.assoc_BANG_(j.select_keys(tr82, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes86.compose(next_changeset95));
let G__9698 = (selection88) ? (j.assoc_BANG_(G__9697, "selection", state84["selection"].map(next_changeset95))) : (G__9697);
if (effects87) {
return j.assoc_BANG_(G__9698, "effects", StateEffect.mapEffects(effects87, next_changeset95));} else {
return G__9698;}} else {
return tr82;}
})
;

export { dispatch_some, guard, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines }
