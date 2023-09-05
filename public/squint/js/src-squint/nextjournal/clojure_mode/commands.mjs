import * as squint_core from 'squint-cljs/core.js';
import * as commands from '@codemirror/commands';
import * as u from './util.mjs';
import * as sel from './selections.mjs';
import * as n from './node.mjs';
import * as format from './extensions/formatting.mjs';
import * as sel_history from './extensions/selection_history.mjs';
var view_command = (function (f) {
return function (p__1) {
let map__23 = p__1;
let state4 = squint_core.get(map__23, "state");
let dispatch5 = squint_core.get(map__23, "dispatch");
let G__67 = f(state4);
if (squint_core.nil_QMARK_(G__67)) {
null} else {
dispatch5(G__67)};
return true;
};
})
;
var scoped_view_command = (function (f) {
return function (p__8) {
let map__910 = p__8;
let state11 = squint_core.get(map__910, "state");
let dispatch12 = squint_core.get(map__910, "dispatch");
if (n.within_program_QMARK_(state11)) {
let G__1314 = f(state11);
if (squint_core.nil_QMARK_(G__1314)) {
null} else {
dispatch12(G__1314)};
return true;} else {
return false;}
};
})
;
var unwrap_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__15) {
let map__1617 = p__15;
let range18 = map__1617;
let from19 = squint_core.get(map__1617, "from");
let to20 = squint_core.get(map__1617, "to");
let empty21 = squint_core.get(map__1617, "empty");
if (empty21) {
let temp__25269__auto__22 = (function () {
 let G__2324 = n.tree(state, from19, -1);
let G__2325 = (squint_core.nil_QMARK_(G__2324)) ? (null) : (n.closest(G__2324, n.coll_QMARK_));
if (squint_core.nil_QMARK_(G__2325)) {
return null;} else {
return u.guard(G__2325, n.balanced_QMARK_);}
})();
if (temp__25269__auto__22) {
let nearest_balanced_coll26 = temp__25269__auto__22;
return ({ "cursor": (from19 - 1), "changes": [n.from_to(n.down(nearest_balanced_coll26)), n.from_to(n.down_last(nearest_balanced_coll26))] });}}
}));
})
;
var copy_to_clipboard_BANG_ = (function (text) {
let focus_el27 = squint_core.get(document, "activeElement");
let input_el28 = document.createElement("textarea");
input_el28.setAttribute("class", "clipboard-input");
squint_core.assoc_BANG_(input_el28, "innerHTML", text);
document["body"].appendChild(input_el28);
input_el28.focus(({ "preventScroll": true }));
input_el28.select();
document.execCommand("copy");
focus_el27.focus(({ "preventScroll": true }));
return document["body"].removeChild(input_el28);
})
;
var kill_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__29) {
let map__3031 = p__29;
let range32 = map__3031;
let from33 = squint_core.get(map__3031, "from");
let to34 = squint_core.get(map__3031, "to");
let empty35 = squint_core.get(map__3031, "empty");
if (empty35) {
let node36 = n.tree(state, from33);
let parent37 = n.closest(node36, (function (_PERCENT_1) {
return (n.coll_QMARK_(_PERCENT_1) || n.string_QMARK_(_PERCENT_1) || n.top_QMARK_(_PERCENT_1));
}));
let line_end38 = state["doc"].lineAt(from33)["to"];
let next_children39 = (parent37) ? (n.children(parent37, from33, 1)) : (null);
let last_child_on_line40 = (parent37) ? ((function () {
 let G__4142 = next_children39;
let G__4143 = (squint_core.nil_QMARK_(G__4142)) ? (null) : (squint_core.take_while(every_pred((function (_PERCENT_1) {
return (n.start(_PERCENT_1) <= line_end38);
})), G__4142));
if (squint_core.nil_QMARK_(G__4143)) {
return null;} else {
return squint_core.last(G__4143);}
})()) : (null);
let to44 = (n.string_QMARK_(parent37)) ? ((function () {
 let content45 = squint_core.str(n.string(state, parent37));
let content_from46 = subs(content45, (from33 - n.start(parent37)));
let next_newline47 = content_from46.indexOf("\n");
if (squint_core.neg_QMARK_(next_newline47)) {
return (n.end(parent37) - 1);} else {
return (from33 + next_newline47 + 1);}
})()) : ((last_child_on_line40) ? ((n.end_edge_QMARK_(last_child_on_line40)) ? (n.start(last_child_on_line40)) : (n.end(last_child_on_line40))) : (((function () {
 let G__4849 = squint_core.first(next_children39);
let G__4850 = (squint_core.nil_QMARK_(G__4849)) ? (null) : (n.start(G__4849));
if (squint_core.nil_QMARK_(G__4850)) {
return null;} else {
return (G__4850 > line_end38);}
})()) ? (n.start(squint_core.first(next_children39))) : (null)));
if (u.node_js_QMARK_) {
null} else {
copy_to_clipboard_BANG_(n.string(state, from33, to44))};
if (to44) {
return ({ "cursor": from33, "changes": ({ "from": from33, "to": to44 }) });}} else {
copy_to_clipboard_BANG_(n.string(state, from33, to34));
return ({ "cursor": from33, "changes": u.from_to(from33, to34) });}
}));
})
;
var enter_and_indent_STAR_ = (function (state) {
let ctx51 = format.make_indent_context(state);
return u.update_ranges(state, (function (p__52) {
let map__5354 = p__52;
let range55 = map__5354;
let from56 = squint_core.get(map__5354, "from");
let to57 = squint_core.get(map__5354, "to");
let empty58 = squint_core.get(map__5354, "empty");
let indent_at59 = (function () {
 let G__6061 = n.closest(n.tree(state, from56), some_fn(n.coll_QMARK_, n.top_QMARK_));
let G__6062 = (squint_core.nil_QMARK_(G__6061)) ? (null) : (n.inner_span(G__6061));
if (squint_core.nil_QMARK_(G__6062)) {
return null;} else {
return n.start(G__6062);}
})();
let indent63 = (indent_at59) ? (format.get_indentation(ctx51, indent_at59)) : (null);
let insertion64 = squint_core.str("\n", (indent63) ? (format.spaces(state, indent63)) : (null));
return ({ "cursor": (from56 + squint_core.count(insertion64)), "changes": [({ "from": from56, "to": to57, "insert": insertion64 })] });
}));
})
;
var nav_position = (function (state, from, dir) {
return ((function () {
 let G__6566 = n.closest(n.tree(state, from), (function (_PERCENT_1) {
return (n.coll_QMARK_(_PERCENT_1) || n.string_QMARK_(_PERCENT_1) || n.top_QMARK_(_PERCENT_1));
}));
let G__6567 = (squint_core.nil_QMARK_(G__6566)) ? (null) : (n.children(G__6566, from, dir));
let G__6568 = (squint_core.nil_QMARK_(G__6567)) ? (null) : (squint_core.first(G__6567));
if (squint_core.nil_QMARK_(G__6568)) {
return null;} else {
return squint_core.get(G__6568, (function () {
 let G__6970 = dir;
switch (G__6970) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__6970))}
})());}
})() || sel.constrain(state, (from + dir)));
})
;
var nav = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__72) {
let map__7374 = p__72;
let range75 = map__7374;
let from76 = squint_core.get(map__7374, "from");
let to77 = squint_core.get(map__7374, "to");
let empty78 = squint_core.get(map__7374, "empty");
if (empty78) {
return ({ "cursor": nav_position(state, from76, dir) });} else {
return ({ "cursor": squint_core.get(u.from_to(from76, to77), (function () {
 let G__7980 = dir;
switch (G__7980) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__7980))}
})()) });}
}));
};
})
;
var nav_select = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__82) {
let map__8384 = p__82;
let range85 = map__8384;
let from86 = squint_core.get(map__8384, "from");
let to87 = squint_core.get(map__8384, "to");
let empty88 = squint_core.get(map__8384, "empty");
if (empty88) {
return ({ "range": n.balanced_range(state, from86, nav_position(state, from86, dir)) });} else {
return ({ "range": (function () {
 let map__8990 = u.from_to(from86, to87);
let from91 = squint_core.get(map__8990, "from");
let to92 = squint_core.get(map__8990, "to");
let G__9394 = dir;
switch (G__9394) {case 1:
return n.balanced_range(state, from91, nav_position(state, to92, dir));
break;
case -1:
return n.balanced_range(state, nav_position(state, from91, dir), to92);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__9394))}
})() });}
}));
};
})
;
var balance_ranges = (function (state) {
return u.update_ranges(state, (function (p__96) {
let map__9798 = p__96;
let from99 = squint_core.get(map__9798, "from");
let to100 = squint_core.get(map__9798, "to");
let empty101 = squint_core.get(map__9798, "empty");
if (empty101) {
return null;} else {
return ({ "range": n.balanced_range(state, from99, to100) });}
}));
})
;
var log = console.log
;
var slurp = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__102) {
let map__103104 = p__102;
let range105 = map__103104;
let from106 = squint_core.get(map__103104, "from");
let to107 = squint_core.get(map__103104, "to");
let empty108 = squint_core.get(map__103104, "empty");
if (empty108) {
let temp__25269__auto__109 = n.closest(n.tree(state, from106), every_pred(n.coll_QMARK_, (function (_PERCENT_1) {
return !(function () {
 let G__110111 = direction;
switch (G__110111) {case 1:
let G__113114 = _PERCENT_1;
let G__113115 = (squint_core.nil_QMARK_(G__113114)) ? (null) : (n.with_prefix(G__113114));
let G__113116 = (squint_core.nil_QMARK_(G__113115)) ? (null) : (n.right(G__113115));
if (squint_core.nil_QMARK_(G__113116)) {
return null;} else {
return n.end_edge_QMARK_(G__113116);}
break;
case -1:
let G__117118 = _PERCENT_1;
let G__117119 = (squint_core.nil_QMARK_(G__117118)) ? (null) : (n.with_prefix(G__117118));
let G__117120 = (squint_core.nil_QMARK_(G__117119)) ? (null) : (n.left(G__117119));
if (squint_core.nil_QMARK_(G__117120)) {
return null;} else {
return n.start_edge_QMARK_(G__117120);}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__110111))}
})();
})));
if (temp__25269__auto__109) {
let parent121 = temp__25269__auto__109;
let temp__25269__auto__122 = (function () {
 let G__123124 = direction;
switch (G__123124) {case 1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.rights(n.with_prefix(parent121))));
break;
case -1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.lefts(n.with_prefix(parent121))));
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__123124))}
})();
if (temp__25269__auto__122) {
let target126 = temp__25269__auto__122;
return ({ "cursor/mapped": from106, "changes": (function () {
 let G__127128 = direction;
switch (G__127128) {case 1:
let edge130 = n.down_last(parent121);
return [({ "from": n.end(target126), "insert": n.name(edge130) }), squint_core.assoc_BANG_(n.from_to(edge130), "insert", " ")];
break;
case -1:
let edge131 = n.left_edge_with_prefix(state, parent121);
let start132 = n.start(n.with_prefix(parent121));
return [({ "from": start132, "to": (start132 + squint_core.count(edge131)), "insert": " " }), ({ "from": n.start(target126), "insert": edge131 })];
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__127128))}
})() });}}}
}));
};
})
;
var barf = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__133) {
let map__134135 = p__133;
let range136 = map__134135;
let from137 = squint_core.get(map__134135, "from");
let to138 = squint_core.get(map__134135, "to");
let empty139 = squint_core.get(map__134135, "empty");
if (empty139) {
let temp__25269__auto__140 = n.closest(n.tree(state, from137), n.coll_QMARK_);
if (temp__25269__auto__140) {
let parent141 = temp__25269__auto__140;
let G__142143 = direction;
switch (G__142143) {case 1:
let temp__25269__auto__145 = (function () {
 let G__146147 = n.down_last(parent141);
let G__146148 = (squint_core.nil_QMARK_(G__146147)) ? (null) : (n.lefts(G__146147));
let G__146149 = (squint_core.nil_QMARK_(G__146148)) ? (null) : (squint_core.remove(n.line_comment_QMARK_, G__146148));
let G__146150 = (squint_core.nil_QMARK_(G__146149)) ? (null) : (squint_core.drop(1, G__146149));
if (squint_core.nil_QMARK_(G__146150)) {
return null;} else {
return squint_core.first(G__146150);}
})();
if (temp__25269__auto__145) {
let target151 = temp__25269__auto__145;
return ({ "cursor": min(n.end(target151), from137), "changes": [({ "from": n.end(target151), "insert": n.name(n.down_last(parent141)) }), squint_core.assoc_BANG_(n.from_to(n.down_last(parent141)), "insert", " ")] });}
break;
case -1:
let temp__25269__auto__152 = (function () {
 let G__153154 = n.down(parent141);
let G__153155 = (squint_core.nil_QMARK_(G__153154)) ? (null) : (n.rights(G__153154));
let G__153156 = (squint_core.nil_QMARK_(G__153155)) ? (null) : (squint_core.remove(n.line_comment_QMARK_, G__153155));
let G__153157 = (squint_core.nil_QMARK_(G__153156)) ? (null) : (squint_core.drop(1, G__153156));
if (squint_core.nil_QMARK_(G__153157)) {
return null;} else {
return squint_core.first(G__153157);}
})();
if (temp__25269__auto__152) {
let next_first_child158 = temp__25269__auto__152;
let left_edge159 = n.left_edge_with_prefix(state, parent141);
let left_start160 = n.start(n.with_prefix(parent141));
return ({ "cursor": max(from137, (n.start(next_first_child158) + (squint_core.count(left_edge159) + 1))), "changes": [({ "from": n.start(next_first_child158), "insert": squint_core.str(" ", left_edge159) }), ({ "from": left_start160, "to": (left_start160 + squint_core.count(left_edge159)), "insert": format.spaces(state, squint_core.count(left_edge159)) })] });}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__142143))}}}
}));
};
})
;
var builtin_index = ({ "cursorLineStart": commands.cursorLineStart, "cursorLineDown": commands.cursorLineDown, "selectAll": commands.selectAll, "selectLineUp": commands.selectLineUp, "cursorLineBoundaryForward": commands.cursorLineBoundaryForward, "selectLineBoundaryBackward": commands.selectLineBoundaryBackward, "deleteCharBackward": commands.deleteCharBackward, "insertNewlineAndIndent": commands.insertNewlineAndIndent, "cursorLineBoundaryBackward": commands.cursorLineBoundaryBackward, "selectCharRight": commands.selectCharRight, "selectPageUp": commands.selectPageUp, "deleteCharForward": commands.deleteCharForward, "cursorCharLeft": commands.cursorCharLeft, "cursorGroupBackward": commands.cursorGroupBackward, "selectDocStart": commands.selectDocStart, "selectGroupBackward": commands.selectGroupBackward, "cursorDocEnd": commands.cursorDocEnd, "deleteGroupBackward": commands.deleteGroupBackward, "selectLineStart": commands.selectLineStart, "deleteGroupForward": commands.deleteGroupForward, "selectDocEnd": commands.selectDocEnd, "selectPageDown": commands.selectPageDown, "cursorPageDown": commands.cursorPageDown, "cursorPageUp": commands.cursorPageUp, "selectLineBoundaryForward": commands.selectLineBoundaryForward, "cursorLineEnd": commands.cursorLineEnd, "cursorGroupForward": commands.cursorGroupForward, "cursorCharRight": commands.cursorCharRight, "selectGroupForward": commands.selectGroupForward, "selectLineEnd": commands.selectLineEnd, "selectCharLeft": commands.selectCharLeft, "splitLine": commands.splitLine, "selectLineDown": commands.selectLineDown, "transposeChars": commands.transposeChars, "cursorLineUp": commands.cursorLineUp, "cursorDocStart": commands.cursorDocStart })
;
var indent = view_command(format.format)
;
var unwrap = view_command(unwrap_STAR_)
;
var kill = scoped_view_command(kill_STAR_)
;
var nav_right = view_command(nav(1))
;
var nav_left = view_command(nav(-1))
;
var nav_select_right = view_command(nav_select(1))
;
var nav_select_left = view_command(nav_select(-1))
;
var slurp_forward = view_command(slurp(1))
;
var slurp_backward = view_command(slurp(-1))
;
var barf_forward = view_command(barf(1))
;
var barf_backward = view_command(barf(-1))
;
var selection_grow = view_command(sel_history.selection_grow_STAR_)
;
var selection_return = view_command(sel_history.selection_return_STAR_)
;
var enter_and_indent = view_command(enter_and_indent_STAR_)
;
var paredit_index = ({ "indent": indent, "nav-left": nav_left, "enter-and-indent": enter_and_indent, "selection-grow": selection_grow, "kill": kill, "slurp-forward": slurp_forward, "nav-select-right": nav_select_right, "nav-select-left": nav_select_left, "barf-forward": barf_forward, "barf-backward": barf_backward, "nav-right": nav_right, "slurp-backward": slurp_backward, "unwrap": unwrap, "selection-return": selection_return })
;
var index = squint_core.merge(builtin_index, paredit_index)
;
var reverse_index = squint_core.reduce_kv((function (_PERCENT_1, _PERCENT_2, _PERCENT_3) {
return squint_core.assoc(_PERCENT_1, _PERCENT_3, _PERCENT_2);
}), ({  }), index)
;
squint_core.prn("commands-loaded");

export { nav_select_left, index, view_command, barf_backward, scoped_view_command, kill_STAR_, enter_and_indent_STAR_, unwrap, enter_and_indent, log, nav_select, slurp, nav_position, indent, nav_select_right, slurp_forward, selection_grow, nav, balance_ranges, nav_left, copy_to_clipboard_BANG_, barf, builtin_index, barf_forward, paredit_index, kill, reverse_index, unwrap_STAR_, nav_right, slurp_backward, selection_return }
