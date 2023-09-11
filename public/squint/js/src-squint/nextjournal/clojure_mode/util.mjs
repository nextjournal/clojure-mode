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
console.log("map-cursor range", range19);
console.log("mapped?", mapped16);
console.log("curos?", cursor17);
let G__2223 = ({ "range": (range19 || (mapped16) ? (sel.cursor(change_desc21.mapPos(mapped16))) : ((squint_core.some_QMARK_(cursor17)) ? (sel.cursor(cursor17)) : ((from_to18) ? (sel.range(squint_core.get(from_to18, 0), squint_core.get(from_to18, 1))) : (null))) || original_range) });
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
let G__3435 = map_cursor(range, state, result33);
squint_core.println("mapped", G__3435);
return G__3435;}
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
 let f36 = (function (var_args) {
let args3742 = [];
let len__26551__auto__43 = arguments["length"];
let i3844 = 0;
while(true){
if ((i3844 < len__26551__auto__43)) {
args3742.push((arguments[i3844]));
let G__45 = (i3844 + 1);
i3844 = G__45;
continue;
};break;
}
;
let argseq__26872__auto__46 = ((2 < args3742["length"])) ? (args3742.slice(2)) : (null);
return f36.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__26872__auto__46);
});
f36["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__47) {
let vec__4852 = p__47;
let map__5153 = squint_core.nth(vec__4852, 0, null);
let from54 = squint_core.get(map__5153, "from", 0);
let to55 = squint_core.get(map__5153, "to");
let spec56 = squint_core.get(map__5153, "spec");
let iterator57 = state["doc"].iter();
let result58 = iterator57.next();
let changes59 = [];
let from_pos60 = from54;
let line_num61 = 1;
while(true){
let map__6263 = result58;
let done64 = squint_core.get(map__6263, "done");
let lineBreak65 = squint_core.get(map__6263, "lineBreak");
let value66 = squint_core.get(map__6263, "value");
if ((done64 || (from54 > to55))) {
return state.update(Object.assign(({ "changes": state.changes(changes59) }), spec56));} else {
let G__67 = iterator57.next();
let G__68 = (function () {
 let temp__27646__auto__69 = (!lineBreak65 && f(from_pos60, value66, line_num61));
if (temp__27646__auto__69) {
let change70 = temp__27646__auto__69;
let G__7172 = changes59;
G__7172.push(change70);
return G__7172;} else {
return changes59;}
})();
let G__73 = (from_pos60 + squint_core.count(value66));
let G__74 = (function () {
 let G__7576 = line_num61;
if (lineBreak65) {
return (G__7576 + 1);} else {
return G__7576;}
})();
result58 = G__67;
changes59 = G__68;
from_pos60 = G__73;
line_num61 = G__74;
continue;
};break;
}

});
f36["cljs$lang$maxFixedArity"] = 2;
f36["cljs$lang$applyTo"] = (function (seq39) {
let G__4077 = squint_core.first(seq39);
let seq3978 = next(seq39);
let G__4179 = squint_core.first(seq3978);
let seq3980 = next(seq3978);
let self__26573__auto__81 = this;
return self__26573__auto__81.cljs$core$IFn$_invoke$arity$variadic(G__4077, G__4179, seq3980);
});
return f36;
})()
;
var update_selected_lines = (function (state, f) {
let at_line82 = squint_core.atom(-1);
let doc83 = state["doc"];
return state.changeByRange((function (p__84) {
let map__8586 = p__84;
let range87 = map__8586;
let from88 = squint_core.get(map__8586, "from");
let to89 = squint_core.get(map__8586, "to");
let anchor90 = squint_core.get(map__8586, "anchor");
let head91 = squint_core.get(map__8586, "head");
let changes92 = [];
let line93 = doc83.lineAt(from88);
while(true){
let map__9495 = line93;
let line_number96 = squint_core.get(map__9495, "number");
let line_to97 = squint_core.get(map__9495, "to");
if ((line93["number"] > squint_core.deref(at_line82))) {
squint_core.reset_BANG_(at_line82, line_number96);
f(line93, changes92, range87)};
let temp__27646__auto__98 = ((to89 > line_to97) && guard(doc83.lineAt((line_to97 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number96);
})));
if (temp__27646__auto__98) {
let next_line99 = temp__27646__auto__98;
let G__100 = next_line99;
line93 = G__100;
continue;
} else {
let change_set101 = state.changes(changes92);
return ({ "changes": changes92, "range": EditorSelection.range(change_set101.mapPos(anchor90, 1), change_set101.mapPos(head91, 1)) });};break;
}

}));
})
;
var iter_changed_lines = (function (p__102, f) {
let map__103105 = p__102;
let tr106 = map__103105;
let map__104107 = squint_core.get(map__103105, "state");
let state108 = map__104107;
let doc109 = squint_core.get(map__104107, "doc");
let changes110 = squint_core.get(map__103105, "changes");
let effects111 = squint_core.get(map__103105, "effects");
let selection112 = squint_core.get(map__103105, "selection");
let at_line113 = squint_core.atom(-1);
let next_changes114 = [];
let _115 = changes110.iterChanges((function (_from_a, _to_a, from_b, to_b, _inserted) {
let map__116117 = doc109.lineAt(from_b);
let line118 = map__116117;
let line_number119 = squint_core.get(map__116117, "number");
let line_to120 = squint_core.get(map__116117, "to");
let line121 = line118;
while(true){
if ((line_number119 > squint_core.deref(at_line113))) {
squint_core.reset_BANG_(at_line113, line_number119);
f(line121, next_changes114)};
if ((to_b <= line_to120)) {
return null;} else {
let next_line122 = doc109.lineAt((line_to120 + 1));
if ((next_line122 && (next_line122["number"] > line121["number"]))) {
let G__123 = next_line122;
line121 = G__123;
continue;
}};break;
}

}));
let next_changeset124 = state108.changes(next_changes114);
if (squint_core.seq(next_changes114)) {
let G__125126 = squint_core.assoc_BANG_(squint_core.select_keys(tr106, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes110.compose(next_changeset124));
let G__125127 = (selection112) ? (squint_core.assoc_BANG_(G__125126, "selection", state108["selection"].map(next_changeset124))) : (G__125126);
if (effects111) {
return squint_core.assoc_BANG_(G__125127, "effects", StateEffect.mapEffects(effects111, next_changeset124));} else {
return G__125127;}} else {
return tr106;}
})
;
var push_BANG_ = (function (arr, x) {
let G__128129 = arr;
G__128129.push(x);
return G__128129;
})
;
squint_core.prn("util-loaded");

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, push_BANG_ }
