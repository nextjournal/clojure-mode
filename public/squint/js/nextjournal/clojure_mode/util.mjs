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
let test__60965__auto__612 = f(x);
if (test__60965__auto__612 != null && test__60965__auto__612 !== false) {
return x;}
})
;
var from_to = (function (p1, p2) {
let test__60965__auto__613 = (p1 > p2);
if (test__60965__auto__613 != null && test__60965__auto__613 !== false) {
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
 let f614 = (function (var_args) {
let G__617618 = arguments["length"];
switch (G__617618) {case 2:
return f614.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f614.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f614["cljs$core$IFn$_invoke$arity$2"] = (function (from, s) {
return insertion(from, from, s);
});
f614["cljs$core$IFn$_invoke$arity$3"] = (function (from, to, s) {
return ({ "changes": ({ "insert": s, "from": from, "to": to }), "cursor": (from + squint_core.count(s)) });
});
f614["cljs$lang$maxFixedArity"] = 3;
return f614;
})()
;
var deletion = (function () {
 let f620 = (function (var_args) {
let G__623624 = arguments["length"];
switch (G__623624) {case 1:
return f620.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f620.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f620["cljs$core$IFn$_invoke$arity$1"] = (function (from) {
return deletion(squint_core.max(0, (from - 1)), from);
});
f620["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
let from626 = (function () {
 let test__60965__auto__627 = (from === to);
if (test__60965__auto__627 != null && test__60965__auto__627 !== false) {
return squint_core.max(0, (from - 1));} else {
return from;}
})();
return ({ "cursor": from626, "changes": ({ "from": from626, "to": to }) });
});
f620["cljs$lang$maxFixedArity"] = 2;
return f620;
})()
;
var line_content_at = (function (state, from) {
return state["doc"].lineAt(from).slice();
})
;
var map_cursor = (function (original_range, state, update_map) {
let map__628629 = guard(update_map, squint_core.map_QMARK_);
let mapped630 = squint_core.get(map__628629, "cursor/mapped");
let cursor631 = squint_core.get(map__628629, "cursor");
let from_to632 = squint_core.get(map__628629, "from-to");
let range633 = squint_core.get(map__628629, "range");
let changes634 = squint_core.get(map__628629, "changes");
let change_desc635 = ((changes634 != null && changes634 !== false) ? (state.changes(changes634)) : (null));
let G__636637 = ({ "range": (function () {
 let or__32239__auto__638 = range633;
if (or__32239__auto__638 != null && or__32239__auto__638 !== false) {
return or__32239__auto__638;} else {
let or__32239__auto__639 = ((mapped630 != null && mapped630 !== false) ? ((function () {
 squint_core.prn("yolo", squint_core.some_QMARK_(range633));
return sel.cursor(change_desc635.mapPos(mapped630));
})()) : ((function () {
 let test__60965__auto__640 = squint_core.some_QMARK_(cursor631);
if (test__60965__auto__640 != null && test__60965__auto__640 !== false) {
return sel.cursor(cursor631);} else {
if (from_to632 != null && from_to632 !== false) {
return sel.range(squint_core.get(from_to632, 0), squint_core.get(from_to632, 1));} else {
return null;}}
})()));
if (or__32239__auto__639 != null && or__32239__auto__639 !== false) {
return or__32239__auto__639;} else {
return original_range;}}
})() });
if (change_desc635 != null && change_desc635 !== false) {
let G__641642 = G__636637;
squint_core.aset(G__641642, "changes", change_desc635);
return G__641642;} else {
return G__636637;}
})
;
var update_ranges = (function () {
 let f643 = (function (var_args) {
let G__646647 = arguments["length"];
switch (G__646647) {case 2:
return f643.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f643.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f643["cljs$core$IFn$_invoke$arity$2"] = (function (state, f) {
return update_ranges(state, null, f);
});
f643["cljs$core$IFn$_invoke$arity$3"] = (function (state, tr_specs, f) {
return state.update((function (_PERCENT_1) {
return Object.assign(_PERCENT_1, tr_specs);
})(state.changeByRange((function (range) {
let or__32239__auto__649 = (function () {
 let temp__31858__auto__650 = f(range);
let test__60965__auto__651 = squint_core.nil_QMARK_(temp__31858__auto__650);
if (test__60965__auto__651 != null && test__60965__auto__651 !== false) {
return null;} else {
let result652 = temp__31858__auto__650;
return map_cursor(range, state, result652);}
})();
if (or__32239__auto__649 != null && or__32239__auto__649 !== false) {
return or__32239__auto__649;} else {
return ({ "range": range });}
}))));
});
f643["cljs$lang$maxFixedArity"] = 3;
return f643;
})()
;
var dispatch_changes = (function (state, dispatch, changes) {
let test__60965__auto__653 = changes["empty"];
if (test__60965__auto__653 != null && test__60965__auto__653 !== false) {
return null;} else {
return dispatch(state.update(({ "changes": changes })));}
})
;
var update_lines = (function () {
 let f654 = (function (var_args) {
let args655660 = [];
let len__31167__auto__661 = arguments["length"];
let i656662 = 0;
while(true){
let test__60965__auto__663 = (i656662 < len__31167__auto__661);
if (test__60965__auto__663 != null && test__60965__auto__663 !== false) {
args655660.push((arguments[i656662]));
let G__664 = (i656662 + 1);
i656662 = G__664;
continue;
};break;
}
;
let argseq__31481__auto__665 = (function () {
 let test__60965__auto__666 = (2 < args655660["length"]);
if (test__60965__auto__666 != null && test__60965__auto__666 !== false) {
return args655660.slice(2);}
})();
return f654.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), argseq__31481__auto__665);
});
f654["cljs$core$IFn$_invoke$arity$variadic"] = (function (state, f, p__667) {
let vec__668672 = p__667;
let map__671673 = squint_core.nth(vec__668672, 0, null);
let from674 = squint_core.get(map__671673, "from", 0);
let to675 = squint_core.get(map__671673, "to");
let spec676 = squint_core.get(map__671673, "spec");
let iterator677 = state["doc"].iter();
let result678 = iterator677.next();
let changes679 = [];
let from_pos680 = from674;
let line_num681 = 1;
while(true){
let map__682683 = result678;
let done684 = squint_core.get(map__682683, "done");
let lineBreak685 = squint_core.get(map__682683, "lineBreak");
let value686 = squint_core.get(map__682683, "value");
let test__60965__auto__687 = (function () {
 let or__32239__auto__688 = done684;
if (or__32239__auto__688 != null && or__32239__auto__688 !== false) {
return or__32239__auto__688;} else {
return (from674 > to675);}
})();
if (test__60965__auto__687 != null && test__60965__auto__687 !== false) {
return state.update(Object.assign(({ "changes": state.changes(changes679) }), spec676));} else {
let G__689 = iterator677.next();
let G__690 = (function () {
 let temp__31754__auto__691 = (function () {
 let and__32262__auto__692 = !lineBreak685;
if (and__32262__auto__692 != null && and__32262__auto__692 !== false) {
return f(from_pos680, value686, line_num681);} else {
return and__32262__auto__692;}
})();
if (temp__31754__auto__691 != null && temp__31754__auto__691 !== false) {
let change693 = temp__31754__auto__691;
let G__694695 = changes679;
G__694695.push(change693);
return G__694695;} else {
return changes679;}
})();
let G__696 = (from_pos680 + squint_core.count(value686));
let G__697 = (function () {
 let G__698699 = line_num681;
if (lineBreak685 != null && lineBreak685 !== false) {
return (G__698699 + 1);} else {
return G__698699;}
})();
result678 = G__689;
changes679 = G__690;
from_pos680 = G__696;
line_num681 = G__697;
continue;
};break;
}

});
f654["cljs$lang$maxFixedArity"] = 2;
f654["cljs$lang$applyTo"] = (function (seq657) {
let G__658700 = squint_core.first(seq657);
let seq657701 = squint_core.next(seq657);
let G__659702 = squint_core.first(seq657701);
let seq657703 = squint_core.next(seq657701);
let self__31216__auto__704 = this;
return self__31216__auto__704.cljs$core$IFn$_invoke$arity$variadic(G__658700, G__659702, seq657703);
});
return f654;
})()
;
var update_selected_lines = (function (state, f) {
let at_line705 = squint_core.atom(-1);
let doc706 = state["doc"];
return state.changeByRange((function (p__707) {
let map__708709 = p__707;
let range710 = map__708709;
let from711 = squint_core.get(map__708709, "from");
let to712 = squint_core.get(map__708709, "to");
let anchor713 = squint_core.get(map__708709, "anchor");
let head714 = squint_core.get(map__708709, "head");
let changes715 = [];
let line716 = doc706.lineAt(from711);
while(true){
let map__717718 = line716;
let line_number719 = squint_core.get(map__717718, "number");
let line_to720 = squint_core.get(map__717718, "to");
let test__60965__auto__721 = (line716["number"] > squint_core.deref(at_line705));
if (test__60965__auto__721 != null && test__60965__auto__721 !== false) {
squint_core.reset_BANG_(at_line705, line_number719);
f(line716, changes715, range710)};
let temp__31754__auto__722 = (function () {
 let and__32262__auto__723 = (to712 > line_to720);
if (and__32262__auto__723 != null && and__32262__auto__723 !== false) {
return guard(doc706.lineAt((line_to720 + 1)), (function (_PERCENT_1) {
return (_PERCENT_1["number"] > line_number719);
}));} else {
return and__32262__auto__723;}
})();
if (temp__31754__auto__722 != null && temp__31754__auto__722 !== false) {
let next_line724 = temp__31754__auto__722;
let G__725 = next_line724;
line716 = G__725;
continue;
} else {
let change_set726 = state.changes(changes715);
return ({ "changes": changes715, "range": EditorSelection.range(change_set726.mapPos(anchor713, 1), change_set726.mapPos(head714, 1)) });};break;
}

}));
})
;
var iter_changed_lines = (function (p__727, f) {
let map__728730 = p__727;
let tr731 = map__728730;
let map__729732 = squint_core.get(map__728730, "state");
let state733 = map__729732;
let doc734 = squint_core.get(map__729732, "doc");
let changes735 = squint_core.get(map__728730, "changes");
let effects736 = squint_core.get(map__728730, "effects");
let selection737 = squint_core.get(map__728730, "selection");
let at_line738 = squint_core.atom(-1);
let next_changes739 = [];
let _740 = changes735.iterChanges((function (_from_a, _to_a, from_b, to_b, _inserted) {
let map__741742 = doc734.lineAt(from_b);
let line743 = map__741742;
let line_number744 = squint_core.get(map__741742, "number");
let line_to745 = squint_core.get(map__741742, "to");
let line746 = line743;
while(true){
let test__60965__auto__747 = (line_number744 > squint_core.deref(at_line738));
if (test__60965__auto__747 != null && test__60965__auto__747 !== false) {
squint_core.reset_BANG_(at_line738, line_number744);
f(line746, next_changes739)};
let test__60965__auto__748 = (to_b <= line_to745);
if (test__60965__auto__748 != null && test__60965__auto__748 !== false) {
return null;} else {
let next_line749 = doc734.lineAt((line_to745 + 1));
let test__60965__auto__750 = (function () {
 let and__32262__auto__751 = next_line749;
if (and__32262__auto__751 != null && and__32262__auto__751 !== false) {
return (next_line749["number"] > line746["number"]);} else {
return and__32262__auto__751;}
})();
if (test__60965__auto__750 != null && test__60965__auto__750 !== false) {
let G__752 = next_line749;
line746 = G__752;
continue;
}};break;
}

}));
let next_changeset753 = state733.changes(next_changes739);
let test__60965__auto__754 = squint_core.seq(next_changes739);
if (test__60965__auto__754 != null && test__60965__auto__754 !== false) {
let G__755756 = squint_core.assoc_BANG_(squint_core.select_keys(tr731, ["annotations", "scrollIntoView", "reconfigure"]), "changes", changes735.compose(next_changeset753));
let G__755757 = ((selection737 != null && selection737 !== false) ? (squint_core.assoc_BANG_(G__755756, "selection", state733["selection"].map(next_changeset753))) : (G__755756));
if (effects736 != null && effects736 !== false) {
return squint_core.assoc_BANG_(G__755757, "effects", StateEffect.mapEffects(effects736, next_changeset753));} else {
return G__755757;}} else {
return tr731;}
})
;
var something_selected_QMARK_ = (function (p__758) {
let map__759761 = p__758;
let map__760762 = squint_core.get(map__759761, "selection");
let ranges763 = squint_core.get(map__760762, "ranges");
return !squint_core.every_QMARK_((function (_PERCENT_1) {
return _PERCENT_1["empty"];
}), ranges763);
})
;
var range_str = (function (state, p__764) {
let map__765766 = p__764;
let _selection767 = map__765766;
let from768 = squint_core.get(map__765766, "from");
let to769 = squint_core.get(map__765766, "to");
return squint_core.str(state["doc"].slice(from768, to769));
})
;
var push_BANG_ = (function (arr, x) {
let G__770771 = arr;
G__770771.push(x);
return G__770771;
})
;
squint_core.prn("util-loaded");

export { dispatch_some, guard, node_js_QMARK_, dispatch_changes, insertion, deletion, line_content_at, update_selected_lines, map_cursor, get_user_event_annotation, user_event_annotation, update_ranges, from_to, iter_changed_lines, update_lines, push_BANG_, range_str, something_selected_QMARK_ }
