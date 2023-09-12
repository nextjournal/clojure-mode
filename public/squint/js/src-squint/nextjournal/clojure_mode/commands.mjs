import * as squint_core from 'squint-cljs/core.js';
import * as format from './extensions/formatting.mjs';
import * as sel_history from './extensions/selection_history.mjs';
import * as n from './node.mjs';
import * as sel from './selections.mjs';
import * as u from './util.mjs';
import * as commands from '@codemirror/commands';
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
let temp__47610__auto__22 = (function () {
 let G__2324 = n.tree(state, from19, -1);
let G__2325 = ((squint_core.nil_QMARK_(G__2324)) ? (null) : (n.closest(G__2324, n.coll_QMARK_)));
if (squint_core.nil_QMARK_(G__2325)) {
return null;} else {
return u.guard(G__2325, n.balanced_QMARK_);}
})();
if (temp__47610__auto__22) {
let nearest_balanced_coll26 = temp__47610__auto__22;
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
let next_children39 = ((parent37) ? (n.children(parent37, from33, 1)) : (null));
let last_child_on_line40 = ((parent37) ? ((function () {
 let G__4142 = next_children39;
let G__4143 = ((squint_core.nil_QMARK_(G__4142)) ? (null) : (squint_core.take_while(squint_core.every_pred((function (_PERCENT_1) {
return (n.start(_PERCENT_1) <= line_end38);
})), G__4142)));
if (squint_core.nil_QMARK_(G__4143)) {
return null;} else {
return squint_core.last(G__4143);}
})()) : (null));
let to44 = ((n.string_QMARK_(parent37)) ? ((function () {
 let content45 = squint_core.str(n.string(state, parent37));
let content_from46 = subs(content45, (from33 - n.start(parent37)));
let next_newline47 = content_from46.indexOf("\n");
if (squint_core.neg_QMARK_(next_newline47)) {
return (n.end(parent37) - 1);} else {
return (from33 + next_newline47 + 1);}
})()) : (((last_child_on_line40) ? (((n.end_edge_QMARK_(last_child_on_line40)) ? (n.start(last_child_on_line40)) : (n.end(last_child_on_line40)))) : ((((function () {
 let G__4849 = squint_core.first(next_children39);
let G__4850 = ((squint_core.nil_QMARK_(G__4849)) ? (null) : (n.start(G__4849)));
if (squint_core.nil_QMARK_(G__4850)) {
return null;} else {
return (G__4850 > line_end38);}
})()) ? (n.start(squint_core.first(next_children39))) : (null))))));
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
 let G__6061 = n.closest(n.tree(state, from56), squint_core.some_fn(n.coll_QMARK_, n.top_QMARK_));
let G__6062 = ((squint_core.nil_QMARK_(G__6061)) ? (null) : (n.inner_span(G__6061)));
if (squint_core.nil_QMARK_(G__6062)) {
return null;} else {
return n.start(G__6062);}
})();
let indent63 = ((indent_at59) ? (format.get_indentation(ctx51, indent_at59)) : (null));
let insertion64 = squint_core.str("\n", ((indent63) ? (format.spaces(state, indent63)) : (null)));
return ({ "cursor": (from56 + squint_core.count(insertion64)), "changes": [({ "from": from56, "to": to57, "insert": insertion64 })] });
}));
})
;
var nav_position = (function (state, from, dir) {
let pos65 = (function () {
 let G__6667 = n.closest(n.tree(state, from), (function (_PERCENT_1) {
return (n.coll_QMARK_(_PERCENT_1) || n.string_QMARK_(_PERCENT_1) || n.top_QMARK_(_PERCENT_1));
}));
let G__6668 = ((squint_core.nil_QMARK_(G__6667)) ? (null) : (n.children(G__6667, from, dir)));
let G__6669 = ((squint_core.nil_QMARK_(G__6668)) ? (null) : (squint_core.first(G__6668)));
if (squint_core.nil_QMARK_(G__6669)) {
return null;} else {
return squint_core.get(G__6669, (function () {
 let G__7071 = dir;
switch (G__7071) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__7071))}
})());}
})();
if (squint_core.some_QMARK_(pos65)) {
return pos65;} else {
return sel.constrain(state, (from + dir));}
})
;
var nav = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__73) {
let map__7475 = p__73;
let range76 = map__7475;
let from77 = squint_core.get(map__7475, "from");
let to78 = squint_core.get(map__7475, "to");
let empty79 = squint_core.get(map__7475, "empty");
if (empty79) {
return ({ "cursor": nav_position(state, from77, dir) });} else {
return ({ "cursor": squint_core.get(u.from_to(from77, to78), (function () {
 let G__8081 = dir;
switch (G__8081) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__8081))}
})()) });}
}));
};
})
;
var nav_select = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__83) {
let map__8485 = p__83;
let range86 = map__8485;
let from87 = squint_core.get(map__8485, "from");
let to88 = squint_core.get(map__8485, "to");
let empty89 = squint_core.get(map__8485, "empty");
if (empty89) {
return ({ "range": n.balanced_range(state, from87, nav_position(state, from87, dir)) });} else {
return ({ "range": (function () {
 let map__9091 = u.from_to(from87, to88);
let from92 = squint_core.get(map__9091, "from");
let to93 = squint_core.get(map__9091, "to");
let G__9495 = dir;
switch (G__9495) {case 1:
return n.balanced_range(state, from92, nav_position(state, to93, dir));
break;
case -1:
return n.balanced_range(state, nav_position(state, from92, dir), to93);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__9495))}
})() });}
}));
};
})
;
var balance_ranges = (function (state) {
return u.update_ranges(state, (function (p__97) {
let map__9899 = p__97;
let from100 = squint_core.get(map__9899, "from");
let to101 = squint_core.get(map__9899, "to");
let empty102 = squint_core.get(map__9899, "empty");
if (empty102) {
return null;} else {
return ({ "range": n.balanced_range(state, from100, to101) });}
}));
})
;
var log = console.log
;
var slurp = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__103) {
let map__104105 = p__103;
let range106 = map__104105;
let from107 = squint_core.get(map__104105, "from");
let to108 = squint_core.get(map__104105, "to");
let empty109 = squint_core.get(map__104105, "empty");
if (empty109) {
let temp__47610__auto__110 = n.closest(n.tree(state, from107), squint_core.every_pred(n.coll_QMARK_, (function (_PERCENT_1) {
return !(function () {
 let G__111112 = direction;
switch (G__111112) {case 1:
let G__114115 = _PERCENT_1;
let G__114116 = ((squint_core.nil_QMARK_(G__114115)) ? (null) : (n.with_prefix(G__114115)));
let G__114117 = ((squint_core.nil_QMARK_(G__114116)) ? (null) : (n.right(G__114116)));
if (squint_core.nil_QMARK_(G__114117)) {
return null;} else {
return n.end_edge_QMARK_(G__114117);}
break;
case -1:
let G__118119 = _PERCENT_1;
let G__118120 = ((squint_core.nil_QMARK_(G__118119)) ? (null) : (n.with_prefix(G__118119)));
let G__118121 = ((squint_core.nil_QMARK_(G__118120)) ? (null) : (n.left(G__118120)));
if (squint_core.nil_QMARK_(G__118121)) {
return null;} else {
return n.start_edge_QMARK_(G__118121);}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__111112))}
})();
})));
if (temp__47610__auto__110) {
let parent122 = temp__47610__auto__110;
let temp__47610__auto__123 = (function () {
 let G__124125 = direction;
switch (G__124125) {case 1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.rights(n.with_prefix(parent122))));
break;
case -1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.lefts(n.with_prefix(parent122))));
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__124125))}
})();
if (temp__47610__auto__123) {
let target127 = temp__47610__auto__123;
return ({ "cursor/mapped": from107, "changes": (function () {
 let G__128129 = direction;
switch (G__128129) {case 1:
let edge131 = n.down_last(parent122);
return [({ "from": n.end(target127), "insert": n.name(edge131) }), squint_core.assoc_BANG_(n.from_to(edge131), "insert", " ")];
break;
case -1:
let edge132 = n.left_edge_with_prefix(state, parent122);
let start133 = n.start(n.with_prefix(parent122));
return [({ "from": start133, "to": (start133 + squint_core.count(edge132)), "insert": " " }), ({ "from": n.start(target127), "insert": edge132 })];
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__128129))}
})() });}}}
}));
};
})
;
var barf = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__134) {
let map__135136 = p__134;
let range137 = map__135136;
let from138 = squint_core.get(map__135136, "from");
let to139 = squint_core.get(map__135136, "to");
let empty140 = squint_core.get(map__135136, "empty");
if (empty140) {
let temp__47610__auto__141 = n.closest(n.tree(state, from138), n.coll_QMARK_);
if (temp__47610__auto__141) {
let parent142 = temp__47610__auto__141;
let G__143144 = direction;
switch (G__143144) {case 1:
let temp__47610__auto__146 = (function () {
 let G__147148 = n.down_last(parent142);
let G__147149 = ((squint_core.nil_QMARK_(G__147148)) ? (null) : (n.lefts(G__147148)));
let G__147150 = ((squint_core.nil_QMARK_(G__147149)) ? (null) : (squint_core.remove(n.line_comment_QMARK_, G__147149)));
let G__147151 = ((squint_core.nil_QMARK_(G__147150)) ? (null) : (squint_core.drop(1, G__147150)));
if (squint_core.nil_QMARK_(G__147151)) {
return null;} else {
return squint_core.first(G__147151);}
})();
if (temp__47610__auto__146) {
let target152 = temp__47610__auto__146;
return ({ "cursor": squint_core.min(n.end(target152), from138), "changes": [({ "from": n.end(target152), "insert": n.name(n.down_last(parent142)) }), squint_core.assoc_BANG_(n.from_to(n.down_last(parent142)), "insert", " ")] });}
break;
case -1:
let temp__47610__auto__153 = (function () {
 let G__154155 = n.down(parent142);
let G__154156 = ((squint_core.nil_QMARK_(G__154155)) ? (null) : (n.rights(G__154155)));
let G__154157 = ((squint_core.nil_QMARK_(G__154156)) ? (null) : (squint_core.remove(n.line_comment_QMARK_, G__154156)));
let G__154158 = ((squint_core.nil_QMARK_(G__154157)) ? (null) : (squint_core.drop(1, G__154157)));
if (squint_core.nil_QMARK_(G__154158)) {
return null;} else {
return squint_core.first(G__154158);}
})();
if (temp__47610__auto__153) {
let next_first_child159 = temp__47610__auto__153;
let left_edge160 = n.left_edge_with_prefix(state, parent142);
let left_start161 = n.start(n.with_prefix(parent142));
return ({ "cursor": squint_core.max(from138, (n.start(next_first_child159) + (squint_core.count(left_edge160) + 1))), "changes": [({ "from": n.start(next_first_child159), "insert": squint_core.str(" ", left_edge160) }), ({ "from": left_start161, "to": (left_start161 + squint_core.count(left_edge160)), "insert": format.spaces(state, squint_core.count(left_edge160)) })] });}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__143144))}}}
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
