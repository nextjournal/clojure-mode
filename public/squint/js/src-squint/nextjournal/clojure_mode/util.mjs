import * as squint_core from 'squint-cljs/core.js';
import * as sel from './selections.mjs';
import { EditorSelection, StateEffect, Transaction } from '@codemirror/state';
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
let test__26256__auto__1 = f(x);
if (test__26256__auto__1 != null && test__26256__auto__1 !== false) {
return x;}
})
;
var from_to = (function (p1, p2) {
let test__26256__auto__2 = (p1 > p2);
if (test__26256__auto__2 != null && test__26256__auto__2 !== false) {
return ({ "from": p2, "to": p1 });} else {
return ({ "from": p1, "to": p2 });}
})
;
var dispatch_some = (function (view, tr) {
if (tr != null && tr !== false) {
view.dispatch(tr);
return true;} else {
return false;}
})
;
var insertion = (function () {
 let f3 = (function (var_args) {
let G__67 = arguments["length"];
switch (G__67) {case 2:
return f3.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f3.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f3["cljs$core$IFn$_invoke$arity$2"] = (function (from, s) {
return insertion(from, from, s);
});
f3["cljs$core$IFn$_invoke$arity$3"] = (function (from, to, s) {
return ({ "changes": ({ "insert": s, "from": from, "to": to }), "cursor": (from + squint_core.count(s)) });
});
f3["cljs$lang$maxFixedArity"] = 3;
return f3;
})()
;
var deletion = (function () {
 let f9 = (function (var_args) {
let G__1213 = arguments["length"];
switch (G__1213) {case 1:
return f9.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f9.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f9["cljs$core$IFn$_invoke$arity$1"] = (function (from) {
return deletion(squint_core.max(0, (from - 1)), from);
});
f9["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
let from15 = (function () {
 let test__26256__auto__16 = (from === to);
if (test__26256__auto__16 != null && test__26256__auto__16 !== false) {
return squint_core.max(0, (from - 1));} else {
return from;}
})();
return ({ "cursor": from15, "changes": ({ "from": from15, "to": to }) });
});
f9["cljs$lang$maxFixedArity"] = 2;
return f9;
})()
;
var line_content_at = (function (state, from) {
return state["doc"].lineAt(from).slice();
})
;
var map_cursor = (function (original_range, state, update_map) {
let map__1718 = guard(update_map, squint_core.map_QMARK_);
let mapped19 = squint_core.get(map__1718, "cursor/mapped");
let cursor20 = squint_core.get(map__1718, "cursor");
let from_to21 = squint_core.get(map__1718, "from-to");
let range22 = squint_core.get(map__1718, "range");
let changes23 = squint_core.get(map__1718, "changes");
let change_desc24 = ((changes23 != null && changes23 !== false) ? (state.changes(changes23)) : (null));
let G__2526 = ({ "range": (function () {
 let or__25460__auto__27 = range22;
if (or__25460__auto__27 != null && or__25460__auto__27 !== false) {
return or__25460__auto__27;} else {
let or__25460__auto__28 = ((mapped19 != null && mapped19 !== false) ? ((function () {
 squint_core.prn("yolo", squint_core.some_QMARK_(range22));
return sel.cursor(change_desc24.mapPos(mapped19));
})()) : ((function () {
 let test__26256__auto__29 = squint_core.some_QMARK_(cursor20);
if (test__26256__auto__29 != null && test__26256__auto__29 !== false) {
return sel.cursor(cursor20);} else {
if (from_to21 != null && from_to21 !== false) {
return sel.range(squint_core.get(from_to21, 0), squint_core.get(from_to21, 1));} else {
return null;}}
})()));
if (or__25460__auto__28 != null && or__25460__auto__28 !== false) {
return or__25460__auto__28;} else {
return original_range;}}
})() });
if (change_desc24 != null && change_desc24 !== false) {
let G__3031 = G__2526;
squint_core.aset(G__3031, "changes", change_desc24);
return G__3031;} else {
return G__2526;}
})
;
var update_ranges = (function () {
 let f32 = (function (var_args) {
let G__3536 = arguments["length"];
switch (G__3536) {case 2:
return f32.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f32.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f32["cljs$core$IFn$_invoke$arity$2"] = (function (state, f) {
return update_ranges(state, null, f);
});
f32["cljs$core$IFn$_invoke$arity$3"] = (function (state, tr_specs, f) {
return state.update((function (_PERCENT_1) {
return Object.assign(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
let or__25460__auto__38 = (function () {
 let temp__25022__auto__39 = f(range);
let test__26256__auto__40 = squint_core.nil_QMARK_(temp__25022__auto__39);
if (test__26256__auto__40 != null && test__26256__auto__40 !== false) {
return null;} else {
let result41 = temp__25022__auto__39;
return map_cursor(range, state, result41);}
})();
if (or__25460__auto__38 != null && or__25460__auto__38 !== false) {
return or__25460__auto__38;} else {
return ({ "range": range });}
}))));
});
f32["cljs$lang$maxFixedArity"] = 3;
return f32;
})()
;
var dispatch_changes = (function (state, dispatch, changes) {
let test__26256__auto__42 = changes["empty"];
if (test__26256__auto__42 != null && test__26256__auto__42 !== false) {
return null;} else {
return dispatch(state.update(({ "changes": changes })));}
})
;
var update_lines = (function () {
 let f43 = (function (var_args) {
let args4449 = [];
let len__24637__auto__50 = arguments["length"];
let i4551 = 0;
while(true){
let test__26256__auto__52 = (i4551 < len__24637__auto__50);
if (test__26256__auto__52 != null && test__26256__auto__52 !== false) {
args4449.push((arguments[i4551]));
let G__53 = (i4551 + 1);
i4551 = G__53;
continue;
};break;
}
;
let argseq__24830__auto__54 = (function () {
 let test__26256__auto__55 = (2 < args4449["length"]);
if (test__26256__auto__55 != null && test__26256__auto__55 !== false) {
return args4449.slice(2);}
})();
return f43.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__24830__auto__54);
});
f43["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__56) {
let vec__5761 = p__56;
let map__6062 = squint_core.nth(vec__5761, 0, null);
let from63 = squint_core.get(map__6062, "from", 0);
let to64 = squint_core.get(map__6062, "to");
let spec65 = squint_core.get(map__6062, "spec");
let iterator66 = state["doc"].iter();
let result67 = iterator66.next();
let changes68 = [];
let from_pos69 = from63;
let line_num70 = 1;
while(true){
let map__7172 = result67;
let done73 = squint_core.get(map__7172, "done");
let lineBreak74 = squint_core.get(map__7172, "lineBreak");
let value75 = squint_core.get(map__7172, "value");
let test__26256__auto__76 = (function () {
 let or__25460__auto__77 = done73;
if (or__25460__auto__77 != null && or__25460__auto__77 !== false) {
return or__25460__auto__77;} else {
return (from63 > to64);}
})();
if (test__26256__auto__76 != null && test__26256__auto__76 !== false) {
return state.update(Object.assign(({ "changes": state.changes(changes68) }), spec65));} else {
let G__78 = iterator66.next();
let G__79 = (function () {
 let temp__24803__auto__80 = (function () {
 let and__25509__auto__81 = !lineBreak74;
if (and__25509__auto__81 != null && and__25509__auto__81 !== false) {
return f(from_pos69, value75, line_num70);} else {
return and__25509__auto__81;}
})();
if (temp__24803__auto__80 != null && temp__24803__auto__80 !== false) {
let change82 = temp__24803__auto__80;
let G__8384 = changes68;
G__8384.push(change82);
return G__8384;} else {
return changes68;}
})();
let G__85 = (from_pos69 + squint_core.count(value75));
let G__86 = (function () {
 let G__8788 = line_num70;
if (lineBreak74 != null && lineBreak74 !== false) {
return (G__8788 + 1);} else {
return G__8788;}
})();
result67 = G__78;
changes68 = G__79;
from_pos69 = G__85;
line_num70 = G__86;
continue;
};break;
}

});
f43["cljs$lang$maxFixedArity"] = 2;
f43["cljs$lang$applyTo"] = (function (seq46) {
let G__4789 = squint_core.first(seq46);
let seq4690 = squint_core.next(seq46);
let G__4891 = squint_core.first(seq4690);
let seq4692 = squint_core.next(seq4690);
let self__24647__auto__93 = this;
return self__24647__auto__93.cljs$core$IFn$_invoke$arity$variadic(G__4789, G__4891, seq4692);
});
return f43;
})()
;
var update_selected_lines = (function (state, f) {
let at_line94 = squint_core.atom(-1);
let doc95 = state["doc"];
return state.changeByRange((function (p__96) {
let map__9798 = p__96;
let range99 = map__9798;
let from100 = squint_core.get(map__9798, "from");
let to101 = squint_core.get(map__9798, "to");
let anchor102 = squint_core.get(map__9798, "anchor");
let head103 = squint_core.get(map__9798, "head");
let changes104 = [];
let line105 = doc95.lineAt(from100);
while(true){
let map__106107 = line105;
let line_number108 = squint_core.get(map__106107, "number");
let line_to109 = squint_core.get(map__106107, "to");
let test__26256__auto__110 = (line105["number"] > squint_core.deref(at_line94));
if (test__26256__auto__110 != null && test__26256__auto__110 !== false) {
squint_core.reset_BANG_(at_line94, line_number108);
f(line105, changes104, range99)};
let temp__24803__auto__111 = (function () {
 let and__25509__auto__112 = (to101 > line_to109);
if (and__25509__auto__112 != null && and__25509__auto__112 !== false) {
return guard(doc95.lineAt((line_to109 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number108);
}));} else {
return and__25509__auto__112;}
})();
if (temp__24803__auto__111 != null && temp__24803__auto__111 !== false) {
let next_line113 = temp__24803__auto__111;
let G__114 = next_line113;
line105 = G__114;
continue;
} else {
let change_set115 = state.changes(changes104);
return ({ "changes": changes104, "range": EditorSelection.range(change_set115.mapPos(anchor102, 1), change_set115.mapPos(head103, 1)) });};break;
}

}));
})
;
var iter_changed_lines = (function (p__116, f) {
let map__117119 = p__116;
let tr120 = map__117119;
let map__118121 = squint_core.get(map__117119, "state");
let state122 = map__118121;
let doc123 = squint_core.get(map__118121, "doc");
let changes124 = squint_core.get(map__117119, "changes");
let effects125 = squint_core.get(map__117119, "effects");
let selection126 = squint_core.get(map__117119, "selection");
let at_line127 = squint_core.atom(-1);
let next_changes128 = [];
let _129 = changes124.iterChanges((function (_from_a, _to_a, from_b, to_b, _inserted) {
let map__130131 = doc123.lineAt(from_b);
let line132 = map__130131;
let line_number133 = squint_core.get(map__130131, "number");
let line_to134 = squint_core.get(map__130131, "to");
let line135 = line132;
while(true){
let test__26256__auto__136 = (line_number133 > squint_core.deref(at_line127));
if (test__26256__auto__136 != null && test__26256__auto__136 !== false) {
squint_core.reset_BANG_(at_line127, line_number133);
f(line135, next_changes128)};
let test__26256__auto__137 = (to_b <= line_to134);
if (test__26256__auto__137 != null && test__26256__auto__137 !== false) {
return null;} else {
let next_line138 = doc123.lineAt((line_to134 + 1));
let test__26256__auto__139 = (function () {
 let and__25509__auto__140 = next_line138;
if (and__25509__auto__140 != null && and__25509__auto__140 !== false) {
return (next_line138["number"] > line135["number"]);} else {
return and__25509__auto__140;}
})();
if (test__26256__auto__139 != null && test__26256__auto__139 !== false) {
let G__141 = next_line138;
line135 = G__141;
continue;
}};break;
}

}));
let next_changeset142 = state122.changes(next_changes128);
let test__26256__auto__143 = squint_core.seq(next_changes128);
if (test__26256__auto__143 != null && test__26256__auto__143 !== false) {
let G__144145 = squint_core.assoc_BANG_(squint_core.select_keys(tr120, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes124.compose(next_changeset142));
let G__144146 = ((selection126 != null && selection126 !== false) ? (squint_core.assoc_BANG_(G__144145, "selection", state122["selection"].map(next_changeset142))) : (G__144145));
if (effects125 != null && effects125 !== false) {
return squint_core.assoc_BANG_(G__144146, "effects", StateEffect.mapEffects(effects125, next_changeset142));} else {
return G__144146;}} else {
return tr120;}
})
;
var something_selected_QMARK_ = (function (p__147) {
let map__148150 = p__147;
let map__149151 = squint_core.get(map__148150, "selection");
let ranges152 = squint_core.get(map__149151, "ranges");
return !squint_core.every_QMARK_((function (_PERCENT_1) {
return _PERCENT_1["empty"];
}), ranges152);
})
;
var range_str = (function (state, p__153) {
let map__154155 = p__153;
let _selection156 = map__154155;
let from157 = squint_core.get(map__154155, "from");
let to158 = squint_core.get(map__154155, "to");
return squint_core.str(state["doc"].slice(from157, to158));
})
;
var push_BANG_ = (function (arr, x) {
let G__159160 = arr;
G__159160.push(x);
return G__159160;
})
;
squint_core.prn("util-loaded");

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, push_BANG_, range_str, something_selected_QMARK_ }
