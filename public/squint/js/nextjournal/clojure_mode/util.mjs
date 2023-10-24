import * as squint_core from 'squint-cljs/core.js';
import { EditorSelection, StateEffect, Transaction } from '@codemirror/state';
import * as sel from './selections.mjs';
var node_js_QMARK_ = squint_core.some_QMARK_(globalThis.process);
var user_event_annotation = (function (event_name) {
return Transaction["userEvent"].of(event_name);
});
var get_user_event_annotation = (function (tr) {
return tr.annotation(Transaction["userEvent"]);
});
var guard = (function (x, f) {
let test__23320__auto__1 = f(x);
if (test__23320__auto__1 != null && test__23320__auto__1 !== false) {
return x;}
});
var from_to = (function (p1, p2) {
let test__23320__auto__1 = (p1 > p2);
if (test__23320__auto__1 != null && test__23320__auto__1 !== false) {
return ({ "from": p2, "to": p1 });} else {
return ({ "from": p1, "to": p2 });}
});
var dispatch_some = (function (view, tr) {
if (tr != null && tr !== false) {
view.dispatch(tr);
return true;} else {
return false;}
});
var insertion = (function () {
 let f115 = (function (var_args) {
let G__1181 = arguments["length"];
switch (G__1181) {case 2:
return f115.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f115.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f115["cljs$core$IFn$_invoke$arity$2"] = (function (from, s) {
return insertion(from, from, s);
});
f115["cljs$core$IFn$_invoke$arity$3"] = (function (from, to, s) {
return ({ "changes": ({ "insert": s, "from": from, "to": to }), "cursor": (from + squint_core.count(s)) });
});
f115["cljs$lang$maxFixedArity"] = 3;
return f115;
})();
var deletion = (function () {
 let f119 = (function (var_args) {
let G__1221 = arguments["length"];
switch (G__1221) {case 1:
return f119.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f119.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f119["cljs$core$IFn$_invoke$arity$1"] = (function (from) {
return deletion(squint_core.max(0, (from - 1)), from);
});
f119["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
let from3 = (function () {
 let test__23320__auto__4 = (from === to);
if (test__23320__auto__4 != null && test__23320__auto__4 !== false) {
return squint_core.max(0, (from - 1));} else {
return from;}
})();
return ({ "cursor": from3, "changes": ({ "from": from3, "to": to }) });
});
f119["cljs$lang$maxFixedArity"] = 2;
return f119;
})();
var line_content_at = (function (state, from) {
return state["doc"].lineAt(from).slice();
});
var map_cursor = (function (original_range, state, update_map) {
let map__12 = guard(update_map, squint_core.map_QMARK_);
let mapped3 = squint_core.get(map__12, "cursor/mapped");
let cursor4 = squint_core.get(map__12, "cursor");
let from_to5 = squint_core.get(map__12, "from-to");
let range6 = squint_core.get(map__12, "range");
let changes7 = squint_core.get(map__12, "changes");
let change_desc8 = ((changes7 != null && changes7 !== false) ? (state.changes(changes7)) : (null));
let G__1239 = ({ "range": (function () {
 let or__25455__auto__10 = range6;
if (or__25455__auto__10 != null && or__25455__auto__10 !== false) {
return or__25455__auto__10;} else {
let or__25455__auto__11 = ((mapped3 != null && mapped3 !== false) ? ((function () {
 squint_core.prn("yolo", squint_core.some_QMARK_(range6));
return sel.cursor(change_desc8.mapPos(mapped3));
})()) : ((function () {
 let test__23320__auto__12 = squint_core.some_QMARK_(cursor4);
if (test__23320__auto__12 != null && test__23320__auto__12 !== false) {
return sel.cursor(cursor4);} else {
if (from_to5 != null && from_to5 !== false) {
return sel.range(squint_core.get(from_to5, 0), squint_core.get(from_to5, 1));} else {
return null;}}
})()));
if (or__25455__auto__11 != null && or__25455__auto__11 !== false) {
return or__25455__auto__11;} else {
return original_range;}}
})() });
if (change_desc8 != null && change_desc8 !== false) {
let G__12413 = G__1239;
squint_core.aset(G__12413, "changes", change_desc8);
return G__12413;} else {
return G__1239;}
});
var update_ranges = (function () {
 let f125 = (function (var_args) {
let G__1281 = arguments["length"];
switch (G__1281) {case 2:
return f125.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f125.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f125["cljs$core$IFn$_invoke$arity$2"] = (function (state, f) {
return update_ranges(state, null, f);
});
f125["cljs$core$IFn$_invoke$arity$3"] = (function (state, tr_specs, f) {
return state.update((function (_PERCENT_1) {
return Object.assign(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
let or__25455__auto__3 = (function () {
 let temp__24947__auto__4 = f(range);
let test__23320__auto__5 = squint_core.nil_QMARK_(temp__24947__auto__4);
if (test__23320__auto__5 != null && test__23320__auto__5 !== false) {
return null;} else {
let result6 = temp__24947__auto__4;
return map_cursor(range, state, result6);}
})();
if (or__25455__auto__3 != null && or__25455__auto__3 !== false) {
return or__25455__auto__3;} else {
return ({ "range": range });}
}))));
});
f125["cljs$lang$maxFixedArity"] = 3;
return f125;
})();
var dispatch_changes = (function (state, dispatch, changes) {
let test__23320__auto__1 = changes["empty"];
if (test__23320__auto__1 != null && test__23320__auto__1 !== false) {
return null;} else {
return dispatch(state.update(({ "changes": changes })));}
});
var update_lines = (function () {
 let f129 = (function (var_args) {
let args1301 = [];
let len__24704__auto__2 = arguments["length"];
let i1313 = 0;
while(true){
let test__23320__auto__4 = (i1313 < len__24704__auto__2);
if (test__23320__auto__4 != null && test__23320__auto__4 !== false) {
args1301.push((arguments[i1313]));
let G__5 = (i1313 + 1);
i1313 = G__5;
continue;
};break;
}
;
let argseq__25028__auto__6 = (function () {
 let test__23320__auto__7 = (2 < args1301["length"]);
if (test__23320__auto__7 != null && test__23320__auto__7 !== false) {
return args1301.slice(2);}
})();
return f129.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__25028__auto__6);
});
f129["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__135) {
let vec__812 = p__135;
let map__1113 = squint_core.nth(vec__812, 0, null);
let from14 = squint_core.get(map__1113, "from", 0);
let to15 = squint_core.get(map__1113, "to");
let spec16 = squint_core.get(map__1113, "spec");
let iterator17 = state["doc"].iter();
let result18 = iterator17.next();
let changes19 = [];
let from_pos20 = from14;
let line_num21 = 1;
while(true){
let map__2223 = result18;
let done24 = squint_core.get(map__2223, "done");
let lineBreak25 = squint_core.get(map__2223, "lineBreak");
let value26 = squint_core.get(map__2223, "value");
let test__23320__auto__27 = (function () {
 let or__25455__auto__28 = done24;
if (or__25455__auto__28 != null && or__25455__auto__28 !== false) {
return or__25455__auto__28;} else {
return (from14 > to15);}
})();
if (test__23320__auto__27 != null && test__23320__auto__27 !== false) {
return state.update(Object.assign(({ "changes": state.changes(changes19) }), spec16));} else {
let G__29 = iterator17.next();
let G__30 = (function () {
 let temp__24840__auto__31 = (function () {
 let and__25489__auto__32 = !lineBreak25;
if (and__25489__auto__32 != null && and__25489__auto__32 !== false) {
return f(from_pos20, value26, line_num21);} else {
return and__25489__auto__32;}
})();
if (temp__24840__auto__31 != null && temp__24840__auto__31 !== false) {
let change33 = temp__24840__auto__31;
let G__13634 = changes19;
G__13634.push(change33);
return G__13634;} else {
return changes19;}
})();
let G__35 = (from_pos20 + squint_core.count(value26));
let G__36 = (function () {
 let G__13737 = line_num21;
if (lineBreak25 != null && lineBreak25 !== false) {
return (G__13737 + 1);} else {
return G__13737;}
})();
result18 = G__29;
changes19 = G__30;
from_pos20 = G__35;
line_num21 = G__36;
continue;
};break;
}

});
f129["cljs$lang$maxFixedArity"] = 2;
f129["cljs$lang$applyTo"] = (function (seq132) {
let G__13338 = squint_core.first(seq132);
let seq13239 = squint_core.next(seq132);
let G__13440 = squint_core.first(seq13239);
let seq13241 = squint_core.next(seq13239);
let self__24715__auto__42 = this;
return self__24715__auto__42.cljs$core$IFn$_invoke$arity$variadic(G__13338, G__13440, seq13241);
});
return f129;
})();
var update_selected_lines = (function (state, f) {
let at_line1 = squint_core.atom(-1);
let doc2 = state["doc"];
return state.changeByRange((function (p__138) {
let map__34 = p__138;
let range5 = map__34;
let from6 = squint_core.get(map__34, "from");
let to7 = squint_core.get(map__34, "to");
let anchor8 = squint_core.get(map__34, "anchor");
let head9 = squint_core.get(map__34, "head");
let changes10 = [];
let line11 = doc2.lineAt(from6);
while(true){
let map__1213 = line11;
let line_number14 = squint_core.get(map__1213, "number");
let line_to15 = squint_core.get(map__1213, "to");
let test__23320__auto__16 = (line11["number"] > squint_core.deref(at_line1));
if (test__23320__auto__16 != null && test__23320__auto__16 !== false) {
squint_core.reset_BANG_(at_line1, line_number14);
f(line11, changes10, range5)};
let temp__24840__auto__17 = (function () {
 let and__25489__auto__18 = (to7 > line_to15);
if (and__25489__auto__18 != null && and__25489__auto__18 !== false) {
return guard(doc2.lineAt((line_to15 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number14);
}));} else {
return and__25489__auto__18;}
})();
if (temp__24840__auto__17 != null && temp__24840__auto__17 !== false) {
let next_line19 = temp__24840__auto__17;
let G__20 = next_line19;
line11 = G__20;
continue;
} else {
let change_set21 = state.changes(changes10);
return ({ "changes": changes10, "range": EditorSelection.range(change_set21.mapPos(anchor8, 1), change_set21.mapPos(head9, 1)) });};break;
}

}));
});
var iter_changed_lines = (function (p__139, f) {
let map__13 = p__139;
let tr4 = map__13;
let map__25 = squint_core.get(map__13, "state");
let state6 = map__25;
let doc7 = squint_core.get(map__25, "doc");
let changes8 = squint_core.get(map__13, "changes");
let effects9 = squint_core.get(map__13, "effects");
let selection10 = squint_core.get(map__13, "selection");
let at_line11 = squint_core.atom(-1);
let next_changes12 = [];
let _13 = changes8.iterChanges((function (_from_a, _to_a, from_b, to_b, _inserted) {
let map__1415 = doc7.lineAt(from_b);
let line16 = map__1415;
let line_number17 = squint_core.get(map__1415, "number");
let line_to18 = squint_core.get(map__1415, "to");
let line19 = line16;
while(true){
let test__23320__auto__20 = (line_number17 > squint_core.deref(at_line11));
if (test__23320__auto__20 != null && test__23320__auto__20 !== false) {
squint_core.reset_BANG_(at_line11, line_number17);
f(line19, next_changes12)};
let test__23320__auto__21 = (to_b <= line_to18);
if (test__23320__auto__21 != null && test__23320__auto__21 !== false) {
return null;} else {
let next_line22 = doc7.lineAt((line_to18 + 1));
let test__23320__auto__23 = (function () {
 let and__25489__auto__24 = next_line22;
if (and__25489__auto__24 != null && and__25489__auto__24 !== false) {
return (next_line22["number"] > line19["number"]);} else {
return and__25489__auto__24;}
})();
if (test__23320__auto__23 != null && test__23320__auto__23 !== false) {
let G__25 = next_line22;
line19 = G__25;
continue;
}};break;
}

}));
let next_changeset26 = state6.changes(next_changes12);
let test__23320__auto__27 = squint_core.seq(next_changes12);
if (test__23320__auto__27 != null && test__23320__auto__27 !== false) {
let G__14028 = squint_core.assoc_BANG_(squint_core.select_keys(tr4, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes8.compose(next_changeset26));
let G__14029 = ((selection10 != null && selection10 !== false) ? (squint_core.assoc_BANG_(G__14028, "selection", state6["selection"].map(next_changeset26))) : (G__14028));
if (effects9 != null && effects9 !== false) {
return squint_core.assoc_BANG_(G__14029, "effects", StateEffect.mapEffects(effects9, next_changeset26));} else {
return G__14029;}} else {
return tr4;}
});
var something_selected_QMARK_ = (function (p__141) {
let map__13 = p__141;
let map__24 = squint_core.get(map__13, "selection");
let ranges5 = squint_core.get(map__24, "ranges");
return !squint_core.every_QMARK_((function (_PERCENT_1) {
return _PERCENT_1["empty"];
}), ranges5);
});
var range_str = (function (state, p__142) {
let map__12 = p__142;
let _selection3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
return squint_core.str(state["doc"].slice(from4, to5));
});
var push_BANG_ = (function (arr, x) {
let G__1431 = arr;
G__1431.push(x);
return G__1431;
});
squint_core.prn("util-loaded");

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, push_BANG_, range_str, something_selected_QMARK_ }
