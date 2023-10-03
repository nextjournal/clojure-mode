import * as squint_core from 'squint-cljs/core.js';
import * as format from './extensions/formatting.mjs';
import * as sel_history from './extensions/selection_history.mjs';
import * as n from './node.mjs';
import * as sel from './selections.mjs';
import * as u from './util.mjs';
import * as commands from '@codemirror/commands';
var view_command = (function (f) {
return function (p__50) {
let map__5152 = p__50;
let state53 = squint_core.get(map__5152, "state");
let dispatch54 = squint_core.get(map__5152, "dispatch");
let G__5556 = f(state53);
let test__26256__auto__57 = squint_core.nil_QMARK_(G__5556);
if (test__26256__auto__57 != null && test__26256__auto__57 !== false) {
null} else {
dispatch54(G__5556)};
return true;
};
})
;
var scoped_view_command = (function (f) {
return function (p__58) {
let map__5960 = p__58;
let state61 = squint_core.get(map__5960, "state");
let dispatch62 = squint_core.get(map__5960, "dispatch");
let test__26256__auto__63 = n.within_program_QMARK_(state61);
if (test__26256__auto__63 != null && test__26256__auto__63 !== false) {
let G__6465 = f(state61);
let test__26256__auto__66 = squint_core.nil_QMARK_(G__6465);
if (test__26256__auto__66 != null && test__26256__auto__66 !== false) {
null} else {
dispatch62(G__6465)};
return true;} else {
return false;}
};
})
;
var unwrap_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__67) {
let map__6869 = p__67;
let range70 = map__6869;
let from71 = squint_core.get(map__6869, "from");
let to72 = squint_core.get(map__6869, "to");
let empty73 = squint_core.get(map__6869, "empty");
if (empty73 != null && empty73 !== false) {
let temp__24938__auto__74 = (function () {
 let G__7576 = n.tree(state, from71, -1);
let G__7577 = (function () {
 let test__26256__auto__78 = squint_core.nil_QMARK_(G__7576);
if (test__26256__auto__78 != null && test__26256__auto__78 !== false) {
return null;} else {
return n.closest(G__7576, n.coll_QMARK_);}
})();
let test__26256__auto__79 = squint_core.nil_QMARK_(G__7577);
if (test__26256__auto__79 != null && test__26256__auto__79 !== false) {
return null;} else {
return u.guard(G__7577, n.balanced_QMARK_);}
})();
if (temp__24938__auto__74 != null && temp__24938__auto__74 !== false) {
let nearest_balanced_coll80 = temp__24938__auto__74;
return ({ "cursor": (from71 - 1), "changes": [n.from_to(n.down(nearest_balanced_coll80)), n.from_to(n.down_last(nearest_balanced_coll80))] });}}
}));
})
;
var copy_to_clipboard_BANG_ = (function (text) {
let focus_el81 = squint_core.get(document, "activeElement");
let input_el82 = document.createElement("textarea");
input_el82.setAttribute("class", "clipboard-input");
squint_core.assoc_BANG_(input_el82, "innerHTML", text);
document["body"].appendChild(input_el82);
input_el82.focus(({ "preventScroll": true }));
input_el82.select();
document.execCommand("copy");
focus_el81.focus(({ "preventScroll": true }));
return document["body"].removeChild(input_el82);
})
;
var kill_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__83) {
let map__8485 = p__83;
let range86 = map__8485;
let from87 = squint_core.get(map__8485, "from");
let to88 = squint_core.get(map__8485, "to");
let empty89 = squint_core.get(map__8485, "empty");
if (empty89 != null && empty89 !== false) {
let node90 = n.tree(state, from87);
let parent91 = n.closest(node90, (function (_PERCENT_1) {
let or__25460__auto__92 = n.coll_QMARK_(_PERCENT_1);
if (or__25460__auto__92 != null && or__25460__auto__92 !== false) {
return or__25460__auto__92;} else {
let or__25460__auto__93 = n.string_QMARK_(_PERCENT_1);
if (or__25460__auto__93 != null && or__25460__auto__93 !== false) {
return or__25460__auto__93;} else {
return n.top_QMARK_(_PERCENT_1);}}
}));
let line_end94 = state["doc"].lineAt(from87)["to"];
let next_children95 = ((parent91 != null && parent91 !== false) ? (n.children(parent91, from87, 1)) : (null));
let last_child_on_line96 = ((parent91 != null && parent91 !== false) ? ((function () {
 let G__9798 = next_children95;
let G__9799 = (function () {
 let test__26256__auto__100 = squint_core.nil_QMARK_(G__9798);
if (test__26256__auto__100 != null && test__26256__auto__100 !== false) {
return null;} else {
return squint_core.take_while(squint_core.every_pred((function (_PERCENT_1) {
return (n.start(_PERCENT_1) <= line_end94);
})), G__9798);}
})();
let test__26256__auto__101 = squint_core.nil_QMARK_(G__9799);
if (test__26256__auto__101 != null && test__26256__auto__101 !== false) {
return null;} else {
return squint_core.last(G__9799);}
})()) : (null));
let to102 = (function () {
 let test__26256__auto__103 = n.string_QMARK_(parent91);
if (test__26256__auto__103 != null && test__26256__auto__103 !== false) {
let content104 = squint_core.str(n.string(state, parent91));
let content_from105 = subs(content104, (from87 - n.start(parent91)));
let next_newline106 = content_from105.indexOf("\n");
let test__26256__auto__107 = squint_core.neg_QMARK_(next_newline106);
if (test__26256__auto__107 != null && test__26256__auto__107 !== false) {
return (n.end(parent91) - 1);} else {
return (from87 + next_newline106 + 1);}} else {
if (last_child_on_line96 != null && last_child_on_line96 !== false) {
let test__26256__auto__108 = n.end_edge_QMARK_(last_child_on_line96);
if (test__26256__auto__108 != null && test__26256__auto__108 !== false) {
return n.start(last_child_on_line96);} else {
return n.end(last_child_on_line96);}} else {
let test__26256__auto__109 = (function () {
 let G__110111 = squint_core.first(next_children95);
let G__110112 = (function () {
 let test__26256__auto__113 = squint_core.nil_QMARK_(G__110111);
if (test__26256__auto__113 != null && test__26256__auto__113 !== false) {
return null;} else {
return n.start(G__110111);}
})();
let test__26256__auto__114 = squint_core.nil_QMARK_(G__110112);
if (test__26256__auto__114 != null && test__26256__auto__114 !== false) {
return null;} else {
return (G__110112 > line_end94);}
})();
if (test__26256__auto__109 != null && test__26256__auto__109 !== false) {
return n.start(squint_core.first(next_children95));} else {
return null;}}}
})();
if (u.node_js_QMARK_ != null && u.node_js_QMARK_ !== false) {
null} else {
copy_to_clipboard_BANG_(n.string(state, from87, to102))};
if (to102 != null && to102 !== false) {
return ({ "cursor": from87, "changes": ({ "from": from87, "to": to102 }) });}} else {
copy_to_clipboard_BANG_(n.string(state, from87, to88));
return ({ "cursor": from87, "changes": u.from_to(from87, to88) });}
}));
})
;
var enter_and_indent_STAR_ = (function (state) {
let ctx115 = format.make_indent_context(state);
return u.update_ranges(state, (function (p__116) {
let map__117118 = p__116;
let range119 = map__117118;
let from120 = squint_core.get(map__117118, "from");
let to121 = squint_core.get(map__117118, "to");
let empty122 = squint_core.get(map__117118, "empty");
let indent_at123 = (function () {
 let G__124125 = n.closest(n.tree(state, from120), squint_core.some_fn(n.coll_QMARK_, n.top_QMARK_));
let G__124126 = (function () {
 let test__26256__auto__127 = squint_core.nil_QMARK_(G__124125);
if (test__26256__auto__127 != null && test__26256__auto__127 !== false) {
return null;} else {
return n.inner_span(G__124125);}
})();
let test__26256__auto__128 = squint_core.nil_QMARK_(G__124126);
if (test__26256__auto__128 != null && test__26256__auto__128 !== false) {
return null;} else {
return n.start(G__124126);}
})();
let indent129 = ((indent_at123 != null && indent_at123 !== false) ? (format.get_indentation(ctx115, indent_at123)) : (null));
let insertion130 = squint_core.str("\n", ((indent129 != null && indent129 !== false) ? (format.spaces(state, indent129)) : (null)));
return ({ "cursor": (from120 + squint_core.count(insertion130)), "changes": [({ "from": from120, "to": to121, "insert": insertion130 })] });
}));
})
;
var nav_position = (function (state, from, dir) {
let pos131 = (function () {
 let G__132133 = n.closest(n.tree(state, from), (function (_PERCENT_1) {
let or__25460__auto__134 = n.coll_QMARK_(_PERCENT_1);
if (or__25460__auto__134 != null && or__25460__auto__134 !== false) {
return or__25460__auto__134;} else {
let or__25460__auto__135 = n.string_QMARK_(_PERCENT_1);
if (or__25460__auto__135 != null && or__25460__auto__135 !== false) {
return or__25460__auto__135;} else {
return n.top_QMARK_(_PERCENT_1);}}
}));
let G__132136 = (function () {
 let test__26256__auto__137 = squint_core.nil_QMARK_(G__132133);
if (test__26256__auto__137 != null && test__26256__auto__137 !== false) {
return null;} else {
return n.children(G__132133, from, dir);}
})();
let G__132138 = (function () {
 let test__26256__auto__139 = squint_core.nil_QMARK_(G__132136);
if (test__26256__auto__139 != null && test__26256__auto__139 !== false) {
return null;} else {
return squint_core.first(G__132136);}
})();
let test__26256__auto__140 = squint_core.nil_QMARK_(G__132138);
if (test__26256__auto__140 != null && test__26256__auto__140 !== false) {
return null;} else {
return squint_core.get(G__132138, (function () {
 let G__141142 = dir;
switch (G__141142) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__141142))}
})());}
})();
let test__26256__auto__144 = squint_core.some_QMARK_(pos131);
if (test__26256__auto__144 != null && test__26256__auto__144 !== false) {
return pos131;} else {
return sel.constrain(state, (from + dir));}
})
;
var nav = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__145) {
let map__146147 = p__145;
let range148 = map__146147;
let from149 = squint_core.get(map__146147, "from");
let to150 = squint_core.get(map__146147, "to");
let empty151 = squint_core.get(map__146147, "empty");
if (empty151 != null && empty151 !== false) {
return ({ "cursor": nav_position(state, from149, dir) });} else {
return ({ "cursor": squint_core.get(u.from_to(from149, to150), (function () {
 let G__152153 = dir;
switch (G__152153) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__152153))}
})()) });}
}));
};
})
;
var nav_select = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__155) {
let map__156157 = p__155;
let range158 = map__156157;
let from159 = squint_core.get(map__156157, "from");
let to160 = squint_core.get(map__156157, "to");
let empty161 = squint_core.get(map__156157, "empty");
if (empty161 != null && empty161 !== false) {
return ({ "range": n.balanced_range(state, from159, nav_position(state, from159, dir)) });} else {
return ({ "range": (function () {
 let map__162163 = u.from_to(from159, to160);
let from164 = squint_core.get(map__162163, "from");
let to165 = squint_core.get(map__162163, "to");
let G__166167 = dir;
switch (G__166167) {case 1:
return n.balanced_range(state, from164, nav_position(state, to165, dir));
break;
case -1:
return n.balanced_range(state, nav_position(state, from164, dir), to165);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__166167))}
})() });}
}));
};
})
;
var balance_ranges = (function (state) {
return u.update_ranges(state, (function (p__169) {
let map__170171 = p__169;
let from172 = squint_core.get(map__170171, "from");
let to173 = squint_core.get(map__170171, "to");
let empty174 = squint_core.get(map__170171, "empty");
if (empty174 != null && empty174 !== false) {
return null;} else {
return ({ "range": n.balanced_range(state, from172, to173) });}
}));
})
;
var log = console.log
;
var slurp = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__175) {
let map__176177 = p__175;
let range178 = map__176177;
let from179 = squint_core.get(map__176177, "from");
let to180 = squint_core.get(map__176177, "to");
let empty181 = squint_core.get(map__176177, "empty");
if (empty181 != null && empty181 !== false) {
let temp__24938__auto__182 = n.closest(n.tree(state, from179), squint_core.every_pred(n.coll_QMARK_, (function (_PERCENT_1) {
return !(function () {
 let G__183184 = direction;
switch (G__183184) {case 1:
let G__186187 = _PERCENT_1;
let G__186188 = (function () {
 let test__26256__auto__189 = squint_core.nil_QMARK_(G__186187);
if (test__26256__auto__189 != null && test__26256__auto__189 !== false) {
return null;} else {
return n.with_prefix(G__186187);}
})();
let G__186190 = (function () {
 let test__26256__auto__191 = squint_core.nil_QMARK_(G__186188);
if (test__26256__auto__191 != null && test__26256__auto__191 !== false) {
return null;} else {
return n.right(G__186188);}
})();
let test__26256__auto__192 = squint_core.nil_QMARK_(G__186190);
if (test__26256__auto__192 != null && test__26256__auto__192 !== false) {
return null;} else {
return n.end_edge_QMARK_(G__186190);}
break;
case -1:
let G__193194 = _PERCENT_1;
let G__193195 = (function () {
 let test__26256__auto__196 = squint_core.nil_QMARK_(G__193194);
if (test__26256__auto__196 != null && test__26256__auto__196 !== false) {
return null;} else {
return n.with_prefix(G__193194);}
})();
let G__193197 = (function () {
 let test__26256__auto__198 = squint_core.nil_QMARK_(G__193195);
if (test__26256__auto__198 != null && test__26256__auto__198 !== false) {
return null;} else {
return n.left(G__193195);}
})();
let test__26256__auto__199 = squint_core.nil_QMARK_(G__193197);
if (test__26256__auto__199 != null && test__26256__auto__199 !== false) {
return null;} else {
return n.start_edge_QMARK_(G__193197);}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__183184))}
})();
})));
if (temp__24938__auto__182 != null && temp__24938__auto__182 !== false) {
let parent200 = temp__24938__auto__182;
let temp__24938__auto__201 = (function () {
 let G__202203 = direction;
switch (G__202203) {case 1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.rights(n.with_prefix(parent200))));
break;
case -1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.lefts(n.with_prefix(parent200))));
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__202203))}
})();
if (temp__24938__auto__201 != null && temp__24938__auto__201 !== false) {
let target205 = temp__24938__auto__201;
return ({ "cursor/mapped": from179, "changes": (function () {
 let G__206207 = direction;
switch (G__206207) {case 1:
let edge209 = n.down_last(parent200);
return [({ "from": n.end(target205), "insert": n.name(edge209) }), squint_core.assoc_BANG_(n.from_to(edge209), "insert", " ")];
break;
case -1:
let edge210 = n.left_edge_with_prefix(state, parent200);
let start211 = n.start(n.with_prefix(parent200));
return [({ "from": start211, "to": (start211 + squint_core.count(edge210)), "insert": " " }), ({ "from": n.start(target205), "insert": edge210 })];
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__206207))}
})() });}}}
}));
};
})
;
var barf = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__212) {
let map__213214 = p__212;
let range215 = map__213214;
let from216 = squint_core.get(map__213214, "from");
let to217 = squint_core.get(map__213214, "to");
let empty218 = squint_core.get(map__213214, "empty");
if (empty218 != null && empty218 !== false) {
let temp__24938__auto__219 = n.closest(n.tree(state, from216), n.coll_QMARK_);
if (temp__24938__auto__219 != null && temp__24938__auto__219 !== false) {
let parent220 = temp__24938__auto__219;
let G__221222 = direction;
switch (G__221222) {case 1:
let temp__24938__auto__224 = (function () {
 let G__225226 = n.down_last(parent220);
let G__225227 = (function () {
 let test__26256__auto__228 = squint_core.nil_QMARK_(G__225226);
if (test__26256__auto__228 != null && test__26256__auto__228 !== false) {
return null;} else {
return n.lefts(G__225226);}
})();
let G__225229 = (function () {
 let test__26256__auto__230 = squint_core.nil_QMARK_(G__225227);
if (test__26256__auto__230 != null && test__26256__auto__230 !== false) {
return null;} else {
return squint_core.remove(n.line_comment_QMARK_, G__225227);}
})();
let G__225231 = (function () {
 let test__26256__auto__232 = squint_core.nil_QMARK_(G__225229);
if (test__26256__auto__232 != null && test__26256__auto__232 !== false) {
return null;} else {
return squint_core.drop(1, G__225229);}
})();
let test__26256__auto__233 = squint_core.nil_QMARK_(G__225231);
if (test__26256__auto__233 != null && test__26256__auto__233 !== false) {
return null;} else {
return squint_core.first(G__225231);}
})();
if (temp__24938__auto__224 != null && temp__24938__auto__224 !== false) {
let target234 = temp__24938__auto__224;
return ({ "cursor": squint_core.min(n.end(target234), from216), "changes": [({ "from": n.end(target234), "insert": n.name(n.down_last(parent220)) }), squint_core.assoc_BANG_(n.from_to(n.down_last(parent220)), "insert", " ")] });}
break;
case -1:
let temp__24938__auto__235 = (function () {
 let G__236237 = n.down(parent220);
let G__236238 = (function () {
 let test__26256__auto__239 = squint_core.nil_QMARK_(G__236237);
if (test__26256__auto__239 != null && test__26256__auto__239 !== false) {
return null;} else {
return n.rights(G__236237);}
})();
let G__236240 = (function () {
 let test__26256__auto__241 = squint_core.nil_QMARK_(G__236238);
if (test__26256__auto__241 != null && test__26256__auto__241 !== false) {
return null;} else {
return squint_core.remove(n.line_comment_QMARK_, G__236238);}
})();
let G__236242 = (function () {
 let test__26256__auto__243 = squint_core.nil_QMARK_(G__236240);
if (test__26256__auto__243 != null && test__26256__auto__243 !== false) {
return null;} else {
return squint_core.drop(1, G__236240);}
})();
let test__26256__auto__244 = squint_core.nil_QMARK_(G__236242);
if (test__26256__auto__244 != null && test__26256__auto__244 !== false) {
return null;} else {
return squint_core.first(G__236242);}
})();
if (temp__24938__auto__235 != null && temp__24938__auto__235 !== false) {
let next_first_child245 = temp__24938__auto__235;
let left_edge246 = n.left_edge_with_prefix(state, parent220);
let left_start247 = n.start(n.with_prefix(parent220));
return ({ "cursor": squint_core.max(from216, (n.start(next_first_child245) + (squint_core.count(left_edge246) + 1))), "changes": [({ "from": n.start(next_first_child245), "insert": squint_core.str(" ", left_edge246) }), ({ "from": left_start247, "to": (left_start247 + squint_core.count(left_edge246)), "insert": format.spaces(state, squint_core.count(left_edge246)) })] });}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__221222))}}}
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
