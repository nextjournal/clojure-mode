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
var spy = (function (x) {
squint_core.prn("spy", x);
return x;
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
return ({ "cursor": (function () {
 let G__8081 = nav_position(state, from77, dir);
squint_core.prn(G__8081, "nav");
return G__8081;
})() });} else {
return ({ "cursor": squint_core.get(u.from_to(from77, to78), (function () {
 let G__8283 = dir;
switch (G__8283) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__8283))}
})()) });}
}));
};
})
;
var nav_select = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__85) {
let map__8687 = p__85;
let range88 = map__8687;
let from89 = squint_core.get(map__8687, "from");
let to90 = squint_core.get(map__8687, "to");
let empty91 = squint_core.get(map__8687, "empty");
if (empty91) {
return ({ "range": n.balanced_range(state, from89, nav_position(state, from89, dir)) });} else {
return ({ "range": (function () {
 let map__9293 = u.from_to(from89, to90);
let from94 = squint_core.get(map__9293, "from");
let to95 = squint_core.get(map__9293, "to");
let G__9697 = dir;
switch (G__9697) {case 1:
return n.balanced_range(state, from94, nav_position(state, to95, dir));
break;
case -1:
return n.balanced_range(state, nav_position(state, from94, dir), to95);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__9697))}
})() });}
}));
};
})
;
var balance_ranges = (function (state) {
return u.update_ranges(state, (function (p__99) {
let map__100101 = p__99;
let from102 = squint_core.get(map__100101, "from");
let to103 = squint_core.get(map__100101, "to");
let empty104 = squint_core.get(map__100101, "empty");
if (empty104) {
return null;} else {
return ({ "range": n.balanced_range(state, from102, to103) });}
}));
})
;
var log = console.log
;
var slurp = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__105) {
let map__106107 = p__105;
let range108 = map__106107;
let from109 = squint_core.get(map__106107, "from");
let to110 = squint_core.get(map__106107, "to");
let empty111 = squint_core.get(map__106107, "empty");
if (empty111) {
let temp__47610__auto__112 = n.closest(n.tree(state, from109), squint_core.every_pred(n.coll_QMARK_, (function (_PERCENT_1) {
return !(function () {
 let G__113114 = direction;
switch (G__113114) {case 1:
let G__116117 = _PERCENT_1;
let G__116118 = ((squint_core.nil_QMARK_(G__116117)) ? (null) : (n.with_prefix(G__116117)));
let G__116119 = ((squint_core.nil_QMARK_(G__116118)) ? (null) : (n.right(G__116118)));
if (squint_core.nil_QMARK_(G__116119)) {
return null;} else {
return n.end_edge_QMARK_(G__116119);}
break;
case -1:
let G__120121 = _PERCENT_1;
let G__120122 = ((squint_core.nil_QMARK_(G__120121)) ? (null) : (n.with_prefix(G__120121)));
let G__120123 = ((squint_core.nil_QMARK_(G__120122)) ? (null) : (n.left(G__120122)));
if (squint_core.nil_QMARK_(G__120123)) {
return null;} else {
return n.start_edge_QMARK_(G__120123);}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__113114))}
})();
})));
if (temp__47610__auto__112) {
let parent124 = temp__47610__auto__112;
let temp__47610__auto__125 = (function () {
 let G__126127 = direction;
switch (G__126127) {case 1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.rights(n.with_prefix(parent124))));
break;
case -1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.lefts(n.with_prefix(parent124))));
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__126127))}
})();
if (temp__47610__auto__125) {
let target129 = temp__47610__auto__125;
return ({ "cursor/mapped": from109, "changes": (function () {
 let G__130131 = direction;
switch (G__130131) {case 1:
let edge133 = n.down_last(parent124);
return [({ "from": n.end(target129), "insert": n.name(edge133) }), squint_core.assoc_BANG_(n.from_to(edge133), "insert", " ")];
break;
case -1:
let edge134 = n.left_edge_with_prefix(state, parent124);
let start135 = n.start(n.with_prefix(parent124));
return [({ "from": start135, "to": (start135 + squint_core.count(edge134)), "insert": " " }), ({ "from": n.start(target129), "insert": edge134 })];
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__130131))}
})() });}}}
}));
};
})
;
var barf = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__136) {
let map__137138 = p__136;
let range139 = map__137138;
let from140 = squint_core.get(map__137138, "from");
let to141 = squint_core.get(map__137138, "to");
let empty142 = squint_core.get(map__137138, "empty");
if (empty142) {
let temp__47610__auto__143 = n.closest(n.tree(state, from140), n.coll_QMARK_);
if (temp__47610__auto__143) {
let parent144 = temp__47610__auto__143;
let G__145146 = direction;
switch (G__145146) {case 1:
let temp__47610__auto__148 = (function () {
 let G__149150 = n.down_last(parent144);
let G__149151 = ((squint_core.nil_QMARK_(G__149150)) ? (null) : (n.lefts(G__149150)));
let G__149152 = ((squint_core.nil_QMARK_(G__149151)) ? (null) : (squint_core.remove(n.line_comment_QMARK_, G__149151)));
let G__149153 = ((squint_core.nil_QMARK_(G__149152)) ? (null) : (squint_core.drop(1, G__149152)));
if (squint_core.nil_QMARK_(G__149153)) {
return null;} else {
return squint_core.first(G__149153);}
})();
if (temp__47610__auto__148) {
let target154 = temp__47610__auto__148;
return ({ "cursor": squint_core.min(n.end(target154), from140), "changes": [({ "from": n.end(target154), "insert": n.name(n.down_last(parent144)) }), squint_core.assoc_BANG_(n.from_to(n.down_last(parent144)), "insert", " ")] });}
break;
case -1:
let temp__47610__auto__155 = (function () {
 let G__156157 = n.down(parent144);
let G__156158 = ((squint_core.nil_QMARK_(G__156157)) ? (null) : (n.rights(G__156157)));
let G__156159 = ((squint_core.nil_QMARK_(G__156158)) ? (null) : (squint_core.remove(n.line_comment_QMARK_, G__156158)));
let G__156160 = ((squint_core.nil_QMARK_(G__156159)) ? (null) : (squint_core.drop(1, G__156159)));
if (squint_core.nil_QMARK_(G__156160)) {
return null;} else {
return squint_core.first(G__156160);}
})();
if (temp__47610__auto__155) {
let next_first_child161 = temp__47610__auto__155;
let left_edge162 = n.left_edge_with_prefix(state, parent144);
let left_start163 = n.start(n.with_prefix(parent144));
return ({ "cursor": squint_core.max(from140, (n.start(next_first_child161) + (squint_core.count(left_edge162) + 1))), "changes": [({ "from": n.start(next_first_child161), "insert": squint_core.str(" ", left_edge162) }), ({ "from": left_start163, "to": (left_start163 + squint_core.count(left_edge162)), "insert": format.spaces(state, squint_core.count(left_edge162)) })] });}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__145146))}}}
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

export { nav_select_left, index, view_command, barf_backward, scoped_view_command, kill_STAR_, enter_and_indent_STAR_, unwrap, enter_and_indent, log, nav_select, slurp, nav_position, indent, nav_select_right, slurp_forward, selection_grow, nav, balance_ranges, nav_left, copy_to_clipboard_BANG_, barf, builtin_index, barf_forward, paredit_index, kill, reverse_index, unwrap_STAR_, spy, nav_right, slurp_backward, selection_return }
