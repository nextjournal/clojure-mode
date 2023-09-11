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
let G__2223 = ({ "range": (range19 || (mapped16) ? (sel.cursor(change_desc21.mapPos(mapped16))) : ((cursor17) ? (sel.cursor(cursor17)) : ((from_to18) ? (sel.range(squint_core.get(from_to18, 0), squint_core.get(from_to18, 1))) : (null))) || original_range) });
if (change_desc21) {
let G__2425 = G__2223;
squint_core.aset(G__2425, "changes", change_desc21);
return G__2425;} else {
return G__2223;}
})
;
var update_ranges = (function () {
 let f26 = (function (var_args) {
let G__2930 = arguments["length"];
switch (G__2930) {case 2:
return f26.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f26.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f26["cljs$core$IFn$_invoke$arity$2"] = (function (state, f) {
return update_ranges(state, null, f);
});
f26["cljs$core$IFn$_invoke$arity$3"] = (function (state, tr_specs, f) {
return state.update((function (_PERCENT_1) {
return Object.assign(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
console.log("range", range);
return ((function () {
 let temp__27794__auto__32 = f(range);
if (squint_core.nil_QMARK_(temp__27794__auto__32)) {
return null;} else {
let result33 = temp__27794__auto__32;
return map_cursor(range, state, result33);}
})() || ({ "range": range }));
}))));
});
f26["cljs$lang$maxFixedArity"] = 3;
return f26;
})()
;
var dispatch_changes = (function (state, dispatch, changes) {
if (changes["empty"]) {
return null;} else {
return dispatch(state.update(({ "changes": changes })));}
})
;
var update_lines = (function () {
 let f34 = (function (var_args) {
let args3540 = [];
let len__26551__auto__41 = arguments["length"];
let i3642 = 0;
while(true){
if ((i3642 < len__26551__auto__41)) {
args3540.push((arguments[i3642]));
let G__43 = (i3642 + 1);
i3642 = G__43;
continue;
};break;
}
;
let argseq__26872__auto__44 = ((2 < args3540["length"])) ? (args3540.slice(2)) : (null);
return f34.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__26872__auto__44);
});
f34["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__45) {
let vec__4650 = p__45;
let map__4951 = squint_core.nth(vec__4650, 0, null);
let from52 = squint_core.get(map__4951, "from", 0);
let to53 = squint_core.get(map__4951, "to");
let spec54 = squint_core.get(map__4951, "spec");
let iterator55 = state["doc"].iter();
let result56 = iterator55.next();
let changes57 = [];
let from_pos58 = from52;
let line_num59 = 1;
while(true){
let map__6061 = result56;
let done62 = squint_core.get(map__6061, "done");
let lineBreak63 = squint_core.get(map__6061, "lineBreak");
let value64 = squint_core.get(map__6061, "value");
if ((done62 || (from52 > to53))) {
return state.update(Object.assign(({ "changes": state.changes(changes57) }), spec54));} else {
let G__65 = iterator55.next();
let G__66 = (function () {
 let temp__27646__auto__67 = (!lineBreak63 && f(from_pos58, value64, line_num59));
if (temp__27646__auto__67) {
let change68 = temp__27646__auto__67;
let G__6970 = changes57;
G__6970.push(change68);
return G__6970;} else {
return changes57;}
})();
let G__71 = (from_pos58 + squint_core.count(value64));
let G__72 = (function () {
 let G__7374 = line_num59;
if (lineBreak63) {
return (G__7374 + 1);} else {
return G__7374;}
})();
result56 = G__65;
changes57 = G__66;
from_pos58 = G__71;
line_num59 = G__72;
continue;
};break;
}

});
f34["cljs$lang$maxFixedArity"] = 2;
f34["cljs$lang$applyTo"] = (function (seq37) {
let G__3875 = squint_core.first(seq37);
let seq3776 = next(seq37);
let G__3977 = squint_core.first(seq3776);
let seq3778 = next(seq3776);
let self__26573__auto__79 = this;
return self__26573__auto__79.cljs$core$IFn$_invoke$arity$variadic(G__3875, G__3977, seq3778);
});
return f34;
})()
;
var update_selected_lines = (function (state, f) {
let at_line80 = squint_core.atom(-1);
let doc81 = state["doc"];
return state.changeByRange((function (p__82) {
let map__8384 = p__82;
let range85 = map__8384;
let from86 = squint_core.get(map__8384, "from");
let to87 = squint_core.get(map__8384, "to");
let anchor88 = squint_core.get(map__8384, "anchor");
let head89 = squint_core.get(map__8384, "head");
let changes90 = [];
let line91 = doc81.lineAt(from86);
while(true){
let map__9293 = line91;
let line_number94 = squint_core.get(map__9293, "number");
let line_to95 = squint_core.get(map__9293, "to");
if ((line91["number"] > squint_core.deref(at_line80))) {
squint_core.reset_BANG_(at_line80, line_number94);
f(line91, changes90, range85)};
let temp__27646__auto__96 = ((to87 > line_to95) && guard(doc81.lineAt((line_to95 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number94);
})));
if (temp__27646__auto__96) {
let next_line97 = temp__27646__auto__96;
let G__98 = next_line97;
line91 = G__98;
continue;
} else {
let change_set99 = state.changes(changes90);
return ({ "changes": changes90, "range": EditorSelection.range(change_set99.mapPos(anchor88, 1), change_set99.mapPos(head89, 1)) });};break;
}

}));
})
;
var iter_changed_lines = (function (p__100, f) {
let map__101103 = p__100;
let tr104 = map__101103;
let map__102105 = squint_core.get(map__101103, "state");
let state106 = map__102105;
let doc107 = squint_core.get(map__102105, "doc");
let changes108 = squint_core.get(map__101103, "changes");
let effects109 = squint_core.get(map__101103, "effects");
let selection110 = squint_core.get(map__101103, "selection");
let at_line111 = squint_core.atom(-1);
let next_changes112 = [];
let _113 = changes108.iterChanges((function (_from_a, _to_a, from_b, to_b, _inserted) {
let map__114115 = doc107.lineAt(from_b);
let line116 = map__114115;
let line_number117 = squint_core.get(map__114115, "number");
let line_to118 = squint_core.get(map__114115, "to");
let line119 = line116;
while(true){
if ((line_number117 > squint_core.deref(at_line111))) {
squint_core.reset_BANG_(at_line111, line_number117);
f(line119, next_changes112)};
if ((to_b <= line_to118)) {
return null;} else {
let next_line120 = doc107.lineAt((line_to118 + 1));
if ((next_line120 && (next_line120["number"] > line119["number"]))) {
let G__121 = next_line120;
line119 = G__121;
continue;
}};break;
}

}));
let next_changeset122 = state106.changes(next_changes112);
if (squint_core.seq(next_changes112)) {
let G__123124 = squint_core.assoc_BANG_(squint_core.select_keys(tr104, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes108.compose(next_changeset122));
let G__123125 = (selection110) ? (squint_core.assoc_BANG_(G__123124, "selection", state106["selection"].map(next_changeset122))) : (G__123124);
if (effects109) {
return squint_core.assoc_BANG_(G__123125, "effects", StateEffect.mapEffects(effects109, next_changeset122));} else {
return G__123125;}} else {
return tr104;}
})
;
var push_BANG_ = (function (arr, x) {
let G__126127 = arr;
G__126127.push(x);
return G__126127;
})
;
squint_core.prn("util-loaded");

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, push_BANG_ }
