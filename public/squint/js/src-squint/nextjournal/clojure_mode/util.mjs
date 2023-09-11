import * as squint_core from 'squint-cljs/core.js';
import { EditorSelection, StateEffect, Transaction } from '@codemirror/state';
import * as sel from './selections';
var node_js_QMARK_ = squint_core.some_QMARK_(globalThis.process)
;
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
return deletion(squint_core.max(0, (from - 1)), from);
});
f7["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
let from13 = ((from === to)) ? (squint_core.max(0, (from - 1))) : (from);
return ({ "cursor": from13, "changes": ({ "from": from13, "to": to }) });
});
f7["cljs$lang$maxFixedArity"] = 2;
return f7;
})()
;
var line_content_at = (function (state, from) {
return state["doc"].lineAt(from).slice();
})
;
var map_cursor = (function (original_range, state, update_map) {
let map__1415 = guard(update_map, squint_core.map_QMARK_);
let mapped16 = squint_core.get(map__1415, "cursor/mapped");
let cursor17 = squint_core.get(map__1415, "cursor");
let from_to18 = squint_core.get(map__1415, "from-to");
let range19 = squint_core.get(map__1415, "range");
let changes20 = squint_core.get(map__1415, "changes");
let change_desc21 = (changes20) ? (state.changes(changes20)) : (null);
let G__2223 = ({ "range": (range19 || (mapped16) ? (sel.cursor(change_desc21.mapPos(mapped16))) : ((cursor17) ? (sel.cursor(cursor17)) : ((from_to18) ? (sel.range(from_to18(0), from_to18(1))) : (null))) || original_range) });
if (change_desc21) {
return squint_core.aset(G__2223, "changes", change_desc21);} else {
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
return Object.assign(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
return ((function () {
 let temp__27794__auto__30 = f(range);
if (squint_core.nil_QMARK_(temp__27794__auto__30)) {
return null;} else {
let result31 = temp__27794__auto__30;
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
let len__26551__auto__39 = arguments["length"];
let i3440 = 0;
while(true){
if ((i3440 < len__26551__auto__39)) {
args3338.push((arguments[i3440]));
let G__41 = (i3440 + 1);
i3440 = G__41;
continue;
};break;
}
;
let argseq__26872__auto__42 = ((2 < args3338["length"])) ? (args3338.slice(2)) : (null);
return f32.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__26872__auto__42);
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
let map__5859 = result54;
let done60 = squint_core.get(map__5859, "done");
let lineBreak61 = squint_core.get(map__5859, "lineBreak");
let value62 = squint_core.get(map__5859, "value");
if ((done60 || (from50 > to51))) {
return state.update(Object.assign(({ "changes": state.changes(changes55) }), spec52));} else {
let G__63 = iterator53.next();
let G__64 = (function () {
 let temp__27646__auto__65 = (!lineBreak61 && f(from_pos56, value62, line_num57));
if (temp__27646__auto__65) {
let change66 = temp__27646__auto__65;
let G__6768 = changes55;
G__6768.push(change66);
return G__6768;} else {
return changes55;}
})();
let G__69 = (from_pos56 + squint_core.count(value62));
let G__70 = (function () {
 let G__7172 = line_num57;
if (lineBreak61) {
return (G__7172 + 1);} else {
return G__7172;}
})();
result54 = G__63;
changes55 = G__64;
from_pos56 = G__69;
line_num57 = G__70;
continue;
};break;
}

});
f32["cljs$lang$maxFixedArity"] = 2;
f32["cljs$lang$applyTo"] = (function (seq35) {
let G__3673 = squint_core.first(seq35);
let seq3574 = next(seq35);
let G__3775 = squint_core.first(seq3574);
let seq3576 = next(seq3574);
let self__26573__auto__77 = this;
return self__26573__auto__77.cljs$core$IFn$_invoke$arity$variadic(G__3673, G__3775, seq3576);
});
return f32;
})()
;
var update_selected_lines = (function (state, f) {
let at_line78 = squint_core.atom(-1);
let doc79 = state["doc"];
return state.changeByRange((function (p__80) {
let map__8182 = p__80;
let range83 = map__8182;
let from84 = squint_core.get(map__8182, "from");
let to85 = squint_core.get(map__8182, "to");
let anchor86 = squint_core.get(map__8182, "anchor");
let head87 = squint_core.get(map__8182, "head");
let changes88 = [];
let line89 = doc79.lineAt(from84);
while(true){
let map__9091 = line89;
let line_number92 = squint_core.get(map__9091, "number");
let line_to93 = squint_core.get(map__9091, "to");
if ((line89["number"] > squint_core.deref(at_line78))) {
squint_core.reset_BANG_(at_line78, line_number92);
f(line89, changes88, range83)};
let temp__27646__auto__94 = ((to85 > line_to93) && guard(doc79.lineAt((line_to93 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number92);
})));
if (temp__27646__auto__94) {
let next_line95 = temp__27646__auto__94;
let G__96 = next_line95;
line89 = G__96;
continue;
} else {
let change_set97 = state.changes(changes88);
return ({ "changes": changes88, "range": EditorSelection.range(change_set97.mapPos(anchor86, 1), change_set97.mapPos(head87, 1)) });};break;
}

}));
})
;
var iter_changed_lines = (function (p__98, f) {
let map__99101 = p__98;
let tr102 = map__99101;
let map__100103 = squint_core.get(map__99101, "state");
let state104 = map__100103;
let doc105 = squint_core.get(map__100103, "doc");
let changes106 = squint_core.get(map__99101, "changes");
let effects107 = squint_core.get(map__99101, "effects");
let selection108 = squint_core.get(map__99101, "selection");
let at_line109 = squint_core.atom(-1);
let next_changes110 = [];
let _111 = changes106.iterChanges((function (_from_a, _to_a, from_b, to_b, _inserted) {
let map__112113 = doc105.lineAt(from_b);
let line114 = map__112113;
let line_number115 = squint_core.get(map__112113, "number");
let line_to116 = squint_core.get(map__112113, "to");
let line117 = line114;
while(true){
if ((line_number115 > squint_core.deref(at_line109))) {
squint_core.reset_BANG_(at_line109, line_number115);
f(line117, next_changes110)};
if ((to_b <= line_to116)) {
return null;} else {
let next_line118 = doc105.lineAt((line_to116 + 1));
if ((next_line118 && (next_line118["number"] > line117["number"]))) {
let G__119 = next_line118;
line117 = G__119;
continue;
}};break;
}

}));
let next_changeset120 = state104.changes(next_changes110);
if (squint_core.seq(next_changes110)) {
let G__121122 = squint_core.assoc_BANG_(squint_core.select_keys(tr102, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes106.compose(next_changeset120));
let G__121123 = (selection108) ? (squint_core.assoc_BANG_(G__121122, "selection", state104["selection"].map(next_changeset120))) : (G__121122);
if (effects107) {
return squint_core.assoc_BANG_(G__121123, "effects", StateEffect.mapEffects(effects107, next_changeset120));} else {
return G__121123;}} else {
return tr102;}
})
;
var push_BANG_ = (function (arr, x) {
let G__124125 = arr;
G__124125.push(x);
return G__124125;
})
;
squint_core.prn("util-loaded");

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, push_BANG_ }
