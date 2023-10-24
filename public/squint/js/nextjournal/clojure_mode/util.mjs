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
let test__27847__auto__1 = f(x);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return x;}
});
var from_to = (function (p1, p2) {
let test__27847__auto__1 = (p1 > p2);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
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
 let f513 = (function (var_args) {
let G__5161 = arguments["length"];
switch (G__5161) {case 2:
return f513.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f513.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f513["cljs$core$IFn$_invoke$arity$2"] = (function (from, s) {
return insertion(from, from, s);
});
f513["cljs$core$IFn$_invoke$arity$3"] = (function (from, to, s) {
return ({ "changes": ({ "insert": s, "from": from, "to": to }), "cursor": (from + squint_core.count(s)) });
});
f513["cljs$lang$maxFixedArity"] = 3;
return f513;
})();
var deletion = (function () {
 let f517 = (function (var_args) {
let G__5201 = arguments["length"];
switch (G__5201) {case 1:
return f517.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f517.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f517["cljs$core$IFn$_invoke$arity$1"] = (function (from) {
return deletion(squint_core.max(0, (from - 1)), from);
});
f517["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
let from3 = (function () {
 let test__27847__auto__4 = (from === to);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return squint_core.max(0, (from - 1));} else {
return from;}
})();
return ({ "cursor": from3, "changes": ({ "from": from3, "to": to }) });
});
f517["cljs$lang$maxFixedArity"] = 2;
return f517;
})();
var line_content_at = (function (state, from) {
return state["_COLON_doc"]["_COLON_lineAt"].from()._COLON_slice();
});
var map_cursor = (function (original_range, state, update_map) {
let test__27847__auto__1 = squint_core.map_QMARK_(update_map);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (map? update-map)")};
let map__23 = guard(update_map, squint_core.map_QMARK_);
let mapped4 = squint_core.get(map__23, "cursor/mapped");
let cursor5 = squint_core.get(map__23, "cursor");
let from_to6 = squint_core.get(map__23, "from-to");
let range7 = squint_core.get(map__23, "range");
let changes8 = squint_core.get(map__23, "changes");
let change_desc9 = ((changes8 != null && changes8 !== false) ? (state.changes(changes8)) : (null));
let G__52110 = ({ "range": (function () {
 let or__28221__auto__11 = range7;
if (or__28221__auto__11 != null && or__28221__auto__11 !== false) {
return or__28221__auto__11;} else {
let or__28221__auto__12 = ((mapped4 != null && mapped4 !== false) ? (sel.cursor(change_desc9.mapPos(mapped4))) : (((cursor5 != null && cursor5 !== false) ? (sel.cursor(cursor5)) : (((from_to6 != null && from_to6 !== false) ? (sel.range(from_to6(0), from_to6(1))) : (null))))));
if (or__28221__auto__12 != null && or__28221__auto__12 !== false) {
return or__28221__auto__12;} else {
return original_range;}}
})() });
if (change_desc9 != null && change_desc9 !== false) {
G__52110["changes"] = change_desc9;
return G__52110;} else {
return G__52110;}
});
var update_ranges = (function () {
 let f522 = (function (var_args) {
let G__5251 = arguments["length"];
switch (G__5251) {case 2:
return f522.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f522.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f522["cljs$core$IFn$_invoke$arity$2"] = (function (state, f) {
return update_ranges(state, null, f);
});
f522["cljs$core$IFn$_invoke$arity$3"] = (function (state, tr_specs, f) {
return state.update((function (_PERCENT_1) {
return Object.assign(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
let or__28221__auto__3 = (function () {
 let temp__27820__auto__4 = f(range);
let test__27847__auto__5 = squint_core.nil_QMARK_(temp__27820__auto__4);
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
return null;} else {
let result6 = temp__27820__auto__4;
return map_cursor(range, state, result6);}
})();
if (or__28221__auto__3 != null && or__28221__auto__3 !== false) {
return or__28221__auto__3;} else {
return ({ "range": range });}
}))));
});
f522["cljs$lang$maxFixedArity"] = 3;
return f522;
})();
var dispatch_changes = (function (state, dispatch, changes) {
let test__27847__auto__1 = changes["empty"];
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return null;} else {
return dispatch(state.update(({ "changes": changes })));}
});
var update_lines = (function () {
 let f526 = (function (var_args) {
let args5271 = [];
let len__27398__auto__2 = arguments["length"];
let i5283 = 0;
while(true){
let test__27847__auto__4 = (i5283 < len__27398__auto__2);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
args5271.push((arguments[i5283]));
let G__5 = (i5283 + 1);
i5283 = G__5;
continue;
};break;
}
;
let argseq__27826__auto__6 = (function () {
 let test__27847__auto__7 = (2 < args5271["length"]);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return args5271.slice(2);}
})();
return f526.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__27826__auto__6);
});
f526["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__532) {
let vec__812 = p__532;
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
let test__27847__auto__27 = (function () {
 let or__28221__auto__28 = done24;
if (or__28221__auto__28 != null && or__28221__auto__28 !== false) {
return or__28221__auto__28;} else {
return (from14 > to15);}
})();
if (test__27847__auto__27 != null && test__27847__auto__27 !== false) {
return state.update(Object.assign(({ "changes": state.changes(changes19) }), spec16));} else {
let G__29 = iterator17.next();
let G__30 = (function () {
 let temp__27663__auto__31 = (function () {
 let and__28236__auto__32 = !lineBreak25;
if (and__28236__auto__32 != null && and__28236__auto__32 !== false) {
return f(from_pos20, value26, line_num21);} else {
return and__28236__auto__32;}
})();
if (temp__27663__auto__31 != null && temp__27663__auto__31 !== false) {
let change33 = temp__27663__auto__31;
let G__53334 = changes19;
G__53334.push(change33);
return G__53334;} else {
return changes19;}
})();
let G__35 = (from_pos20 + squint_core.count(value26));
let G__36 = (function () {
 let G__53437 = line_num21;
if (lineBreak25 != null && lineBreak25 !== false) {
return (G__53437 + 1);} else {
return G__53437;}
})();
result18 = G__29;
changes19 = G__30;
from_pos20 = G__35;
line_num21 = G__36;
continue;
};break;
}

});
f526["cljs$lang$maxFixedArity"] = 2;
f526["cljs$lang$applyTo"] = (function (seq529) {
let G__53038 = squint_core.first(seq529);
let seq52939 = squint_core.next(seq529);
let G__53140 = squint_core.first(seq52939);
let seq52941 = squint_core.next(seq52939);
let self__27415__auto__42 = this;
return self__27415__auto__42.cljs$core$IFn$_invoke$arity$variadic(G__53038, G__53140, seq52941);
});
return f526;
})();
var update_selected_lines = (function (state, f) {
let at_line1 = squint_core.atom(-1);
let doc2 = state["doc"];
return state.changeByRange((function (p__535) {
let map__34 = p__535;
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
let test__27847__auto__16 = (line11["number"] > squint_core.deref(at_line1));
if (test__27847__auto__16 != null && test__27847__auto__16 !== false) {
squint_core.reset_BANG_(at_line1, line_number14);
f(line11, changes10, range5)};
let temp__27663__auto__17 = (function () {
 let and__28236__auto__18 = (to7 > line_to15);
if (and__28236__auto__18 != null && and__28236__auto__18 !== false) {
return guard(doc2.lineAt((line_to15 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number14);
}));} else {
return and__28236__auto__18;}
})();
if (temp__27663__auto__17 != null && temp__27663__auto__17 !== false) {
let next_line19 = temp__27663__auto__17;
let G__20 = next_line19;
line11 = G__20;
continue;
} else {
let change_set21 = state.changes(changes10);
return ({ "changes": changes10, "range": EditorSelection.range(change_set21.mapPos(anchor8, 1), change_set21.mapPos(head9, 1)) });};break;
}

}));
});
var iter_changed_lines = (function (p__536, f) {
let map__13 = p__536;
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
let test__27847__auto__20 = (line_number17 > squint_core.deref(at_line11));
if (test__27847__auto__20 != null && test__27847__auto__20 !== false) {
squint_core.reset_BANG_(at_line11, line_number17);
f(line19, next_changes12)};
let test__27847__auto__21 = (to_b <= line_to18);
if (test__27847__auto__21 != null && test__27847__auto__21 !== false) {
return null;} else {
let next_line22 = doc7.lineAt((line_to18 + 1));
let test__27847__auto__23 = (function () {
 let and__28236__auto__24 = next_line22;
if (and__28236__auto__24 != null && and__28236__auto__24 !== false) {
return (next_line22["number"] > line19["number"]);} else {
return and__28236__auto__24;}
})();
if (test__27847__auto__23 != null && test__27847__auto__23 !== false) {
let G__25 = next_line22;
line19 = G__25;
continue;
}};break;
}

}));
let next_changeset26 = state6.changes(next_changes12);
let test__27847__auto__27 = squint_core.seq(next_changes12);
if (test__27847__auto__27 != null && test__27847__auto__27 !== false) {
let G__53728 = squint_core.assoc_BANG_(squint_core.select_keys(tr4, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes8.compose(next_changeset26));
let G__53729 = ((selection10 != null && selection10 !== false) ? (squint_core.assoc_BANG_(G__53728, "selection", state6["selection"].map(next_changeset26))) : (G__53728));
if (effects9 != null && effects9 !== false) {
return squint_core.assoc_BANG_(G__53729, "effects", StateEffect.mapEffects(effects9, next_changeset26));} else {
return G__53729;}} else {
return tr4;}
});
var something_selected_QMARK_ = (function (p__538) {
let map__13 = p__538;
let map__24 = squint_core.get(map__13, "selection");
let ranges5 = squint_core.get(map__24, "ranges");
return !squint_core.every_QMARK_((function (_PERCENT_1) {
return _PERCENT_1["empty"];
}), ranges5);
});
var range_str = (function (state, p__539) {
let map__12 = p__539;
let _selection3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
return squint_core.str(state["_COLON_doc"]["_COLON_slice"].from().to());
});

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, range_str, something_selected_QMARK_ }
