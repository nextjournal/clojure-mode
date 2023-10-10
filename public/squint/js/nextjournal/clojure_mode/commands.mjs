import * as squint_core from 'squint-cljs/core.js';
import * as format from './extensions/formatting.mjs';
import * as sel_history from './extensions/selection_history.mjs';
import * as n from './node.mjs';
import * as sel from './selections.mjs';
import * as u from './util.mjs';
import * as commands from '@codemirror/commands';
var view_command = (function (f) {
return function (p__96) {
let map__9798 = p__96;
let state99 = squint_core.get(map__9798, "state");
let dispatch100 = squint_core.get(map__9798, "dispatch");
let G__101102 = f(state99);
let test__60965__auto__103 = squint_core.nil_QMARK_(G__101102);
if (test__60965__auto__103 != null && test__60965__auto__103 !== false) {
null} else {
dispatch100(G__101102)};
return true;
};
})
;
var scoped_view_command = (function (f) {
return function (p__104) {
let map__105106 = p__104;
let state107 = squint_core.get(map__105106, "state");
let dispatch108 = squint_core.get(map__105106, "dispatch");
let test__60965__auto__109 = n.within_program_QMARK_(state107);
if (test__60965__auto__109 != null && test__60965__auto__109 !== false) {
let G__110111 = f(state107);
let test__60965__auto__112 = squint_core.nil_QMARK_(G__110111);
if (test__60965__auto__112 != null && test__60965__auto__112 !== false) {
null} else {
dispatch108(G__110111)};
return true;} else {
return false;}
};
})
;
var unwrap_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__113) {
let map__114115 = p__113;
let range116 = map__114115;
let from117 = squint_core.get(map__114115, "from");
let to118 = squint_core.get(map__114115, "to");
let empty119 = squint_core.get(map__114115, "empty");
if (empty119 != null && empty119 !== false) {
let temp__31807__auto__120 = (function () {
 let G__121122 = n.tree(state, from117, -1);
let G__121123 = (function () {
 let test__60965__auto__124 = squint_core.nil_QMARK_(G__121122);
if (test__60965__auto__124 != null && test__60965__auto__124 !== false) {
return null;} else {
return n.closest(G__121122, n.coll_QMARK_);}
})();
let test__60965__auto__125 = squint_core.nil_QMARK_(G__121123);
if (test__60965__auto__125 != null && test__60965__auto__125 !== false) {
return null;} else {
return u.guard(G__121123, n.balanced_QMARK_);}
})();
if (temp__31807__auto__120 != null && temp__31807__auto__120 !== false) {
let nearest_balanced_coll126 = temp__31807__auto__120;
return ({ "cursor": (from117 - 1), "changes": [n.from_to(n.down(nearest_balanced_coll126)), n.from_to(n.down_last(nearest_balanced_coll126))] });}}
}));
})
;
var copy_to_clipboard_BANG_ = (function (text) {
let focus_el127 = squint_core.get(document, "activeElement");
let input_el128 = document.createElement("textarea");
input_el128.setAttribute("class", "clipboard-input");
squint_core.assoc_BANG_(input_el128, "innerHTML", text);
document["body"].appendChild(input_el128);
input_el128.focus(({ "preventScroll": true }));
input_el128.select();
document.execCommand("copy");
focus_el127.focus(({ "preventScroll": true }));
return document["body"].removeChild(input_el128);
})
;
var kill_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__129) {
let map__130131 = p__129;
let range132 = map__130131;
let from133 = squint_core.get(map__130131, "from");
let to134 = squint_core.get(map__130131, "to");
let empty135 = squint_core.get(map__130131, "empty");
if (empty135 != null && empty135 !== false) {
let node136 = n.tree(state, from133);
let parent137 = n.closest(node136, (function (_PERCENT_1) {
let or__32239__auto__138 = n.coll_QMARK_(_PERCENT_1);
if (or__32239__auto__138 != null && or__32239__auto__138 !== false) {
return or__32239__auto__138;} else {
let or__32239__auto__139 = n.string_QMARK_(_PERCENT_1);
if (or__32239__auto__139 != null && or__32239__auto__139 !== false) {
return or__32239__auto__139;} else {
return n.top_QMARK_(_PERCENT_1);}}
}));
let line_end140 = state["doc"].lineAt(from133)["to"];
let next_children141 = ((parent137 != null && parent137 !== false) ? (n.children(parent137, from133, 1)) : (null));
let last_child_on_line142 = ((parent137 != null && parent137 !== false) ? ((function () {
 let G__143144 = next_children141;
let G__143145 = (function () {
 let test__60965__auto__146 = squint_core.nil_QMARK_(G__143144);
if (test__60965__auto__146 != null && test__60965__auto__146 !== false) {
return null;} else {
return squint_core.take_while(squint_core.every_pred((function (_PERCENT_1) {
return (n.start(_PERCENT_1) <= line_end140);
})), G__143144);}
})();
let test__60965__auto__147 = squint_core.nil_QMARK_(G__143145);
if (test__60965__auto__147 != null && test__60965__auto__147 !== false) {
return null;} else {
return squint_core.last(G__143145);}
})()) : (null));
let to148 = (function () {
 let test__60965__auto__149 = n.string_QMARK_(parent137);
if (test__60965__auto__149 != null && test__60965__auto__149 !== false) {
let content150 = squint_core.str(n.string(state, parent137));
let content_from151 = squint_core.subs(content150, (from133 - n.start(parent137)));
let next_newline152 = content_from151.indexOf("\n");
let test__60965__auto__153 = squint_core.neg_QMARK_(next_newline152);
if (test__60965__auto__153 != null && test__60965__auto__153 !== false) {
return (n.end(parent137) - 1);} else {
return (from133 + next_newline152 + 1);}} else {
if (last_child_on_line142 != null && last_child_on_line142 !== false) {
let test__60965__auto__154 = n.end_edge_QMARK_(last_child_on_line142);
if (test__60965__auto__154 != null && test__60965__auto__154 !== false) {
return n.start(last_child_on_line142);} else {
return n.end(last_child_on_line142);}} else {
let test__60965__auto__155 = (function () {
 let G__156157 = squint_core.first(next_children141);
let G__156158 = (function () {
 let test__60965__auto__159 = squint_core.nil_QMARK_(G__156157);
if (test__60965__auto__159 != null && test__60965__auto__159 !== false) {
return null;} else {
return n.start(G__156157);}
})();
let test__60965__auto__160 = squint_core.nil_QMARK_(G__156158);
if (test__60965__auto__160 != null && test__60965__auto__160 !== false) {
return null;} else {
return (G__156158 > line_end140);}
})();
if (test__60965__auto__155 != null && test__60965__auto__155 !== false) {
return n.start(squint_core.first(next_children141));} else {
return null;}}}
})();
if (u.node_js_QMARK_ != null && u.node_js_QMARK_ !== false) {
null} else {
copy_to_clipboard_BANG_(n.string(state, from133, to148))};
if (to148 != null && to148 !== false) {
return ({ "cursor": from133, "changes": ({ "from": from133, "to": to148 }) });}} else {
copy_to_clipboard_BANG_(n.string(state, from133, to134));
return ({ "cursor": from133, "changes": u.from_to(from133, to134) });}
}));
})
;
var enter_and_indent_STAR_ = (function (state) {
let ctx161 = format.make_indent_context(state);
return u.update_ranges(state, (function (p__162) {
let map__163164 = p__162;
let range165 = map__163164;
let from166 = squint_core.get(map__163164, "from");
let to167 = squint_core.get(map__163164, "to");
let empty168 = squint_core.get(map__163164, "empty");
let indent_at169 = (function () {
 let G__170171 = n.closest(n.tree(state, from166), squint_core.some_fn(n.coll_QMARK_, n.top_QMARK_));
let G__170172 = (function () {
 let test__60965__auto__173 = squint_core.nil_QMARK_(G__170171);
if (test__60965__auto__173 != null && test__60965__auto__173 !== false) {
return null;} else {
return n.inner_span(G__170171);}
})();
let test__60965__auto__174 = squint_core.nil_QMARK_(G__170172);
if (test__60965__auto__174 != null && test__60965__auto__174 !== false) {
return null;} else {
return n.start(G__170172);}
})();
let indent175 = ((indent_at169 != null && indent_at169 !== false) ? (format.get_indentation(ctx161, indent_at169)) : (null));
let insertion176 = squint_core.str("\n", ((indent175 != null && indent175 !== false) ? (format.spaces(state, indent175)) : (null)));
return ({ "cursor": (from166 + squint_core.count(insertion176)), "changes": [({ "from": from166, "to": to167, "insert": insertion176 })] });
}));
})
;
var nav_position = (function (state, from, dir) {
let pos177 = (function () {
 let G__178179 = n.closest(n.tree(state, from), (function (_PERCENT_1) {
let or__32239__auto__180 = n.coll_QMARK_(_PERCENT_1);
if (or__32239__auto__180 != null && or__32239__auto__180 !== false) {
return or__32239__auto__180;} else {
let or__32239__auto__181 = n.string_QMARK_(_PERCENT_1);
if (or__32239__auto__181 != null && or__32239__auto__181 !== false) {
return or__32239__auto__181;} else {
return n.top_QMARK_(_PERCENT_1);}}
}));
let G__178182 = (function () {
 let test__60965__auto__183 = squint_core.nil_QMARK_(G__178179);
if (test__60965__auto__183 != null && test__60965__auto__183 !== false) {
return null;} else {
return n.children(G__178179, from, dir);}
})();
let G__178184 = (function () {
 let test__60965__auto__185 = squint_core.nil_QMARK_(G__178182);
if (test__60965__auto__185 != null && test__60965__auto__185 !== false) {
return null;} else {
return squint_core.first(G__178182);}
})();
let test__60965__auto__186 = squint_core.nil_QMARK_(G__178184);
if (test__60965__auto__186 != null && test__60965__auto__186 !== false) {
return null;} else {
return squint_core.get(G__178184, (function () {
 let G__187188 = dir;
switch (G__187188) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__187188))}
})());}
})();
let test__60965__auto__190 = squint_core.some_QMARK_(pos177);
if (test__60965__auto__190 != null && test__60965__auto__190 !== false) {
return pos177;} else {
return sel.constrain(state, (from + dir));}
})
;
var nav = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__191) {
let map__192193 = p__191;
let range194 = map__192193;
let from195 = squint_core.get(map__192193, "from");
let to196 = squint_core.get(map__192193, "to");
let empty197 = squint_core.get(map__192193, "empty");
if (empty197 != null && empty197 !== false) {
return ({ "cursor": nav_position(state, from195, dir) });} else {
return ({ "cursor": squint_core.get(u.from_to(from195, to196), (function () {
 let G__198199 = dir;
switch (G__198199) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__198199))}
})()) });}
}));
};
})
;
var nav_select = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__201) {
let map__202203 = p__201;
let range204 = map__202203;
let from205 = squint_core.get(map__202203, "from");
let to206 = squint_core.get(map__202203, "to");
let empty207 = squint_core.get(map__202203, "empty");
if (empty207 != null && empty207 !== false) {
return ({ "range": n.balanced_range(state, from205, nav_position(state, from205, dir)) });} else {
return ({ "range": (function () {
 let map__208209 = u.from_to(from205, to206);
let from210 = squint_core.get(map__208209, "from");
let to211 = squint_core.get(map__208209, "to");
let G__212213 = dir;
switch (G__212213) {case 1:
return n.balanced_range(state, from210, nav_position(state, to211, dir));
break;
case -1:
return n.balanced_range(state, nav_position(state, from210, dir), to211);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__212213))}
})() });}
}));
};
})
;
var balance_ranges = (function (state) {
return u.update_ranges(state, (function (p__215) {
let map__216217 = p__215;
let from218 = squint_core.get(map__216217, "from");
let to219 = squint_core.get(map__216217, "to");
let empty220 = squint_core.get(map__216217, "empty");
if (empty220 != null && empty220 !== false) {
return null;} else {
return ({ "range": n.balanced_range(state, from218, to219) });}
}));
})
;
var log = console.log
;
var slurp = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__221) {
let map__222223 = p__221;
let range224 = map__222223;
let from225 = squint_core.get(map__222223, "from");
let to226 = squint_core.get(map__222223, "to");
let empty227 = squint_core.get(map__222223, "empty");
if (empty227 != null && empty227 !== false) {
let temp__31807__auto__228 = n.closest(n.tree(state, from225), squint_core.every_pred(n.coll_QMARK_, (function (_PERCENT_1) {
return !(function () {
 let G__229230 = direction;
switch (G__229230) {case 1:
let G__232233 = _PERCENT_1;
let G__232234 = (function () {
 let test__60965__auto__235 = squint_core.nil_QMARK_(G__232233);
if (test__60965__auto__235 != null && test__60965__auto__235 !== false) {
return null;} else {
return n.with_prefix(G__232233);}
})();
let G__232236 = (function () {
 let test__60965__auto__237 = squint_core.nil_QMARK_(G__232234);
if (test__60965__auto__237 != null && test__60965__auto__237 !== false) {
return null;} else {
return n.right(G__232234);}
})();
let test__60965__auto__238 = squint_core.nil_QMARK_(G__232236);
if (test__60965__auto__238 != null && test__60965__auto__238 !== false) {
return null;} else {
return n.end_edge_QMARK_(G__232236);}
break;
case -1:
let G__239240 = _PERCENT_1;
let G__239241 = (function () {
 let test__60965__auto__242 = squint_core.nil_QMARK_(G__239240);
if (test__60965__auto__242 != null && test__60965__auto__242 !== false) {
return null;} else {
return n.with_prefix(G__239240);}
})();
let G__239243 = (function () {
 let test__60965__auto__244 = squint_core.nil_QMARK_(G__239241);
if (test__60965__auto__244 != null && test__60965__auto__244 !== false) {
return null;} else {
return n.left(G__239241);}
})();
let test__60965__auto__245 = squint_core.nil_QMARK_(G__239243);
if (test__60965__auto__245 != null && test__60965__auto__245 !== false) {
return null;} else {
return n.start_edge_QMARK_(G__239243);}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__229230))}
})();
})));
if (temp__31807__auto__228 != null && temp__31807__auto__228 !== false) {
let parent246 = temp__31807__auto__228;
let temp__31807__auto__247 = (function () {
 let G__248249 = direction;
switch (G__248249) {case 1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.rights(n.with_prefix(parent246))));
break;
case -1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.lefts(n.with_prefix(parent246))));
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__248249))}
})();
if (temp__31807__auto__247 != null && temp__31807__auto__247 !== false) {
let target251 = temp__31807__auto__247;
return ({ "cursor/mapped": from225, "changes": (function () {
 let G__252253 = direction;
switch (G__252253) {case 1:
let edge255 = n.down_last(parent246);
return [({ "from": n.end(target251), "insert": n.name(edge255) }), squint_core.assoc_BANG_(n.from_to(edge255), "insert", " ")];
break;
case -1:
let edge256 = n.left_edge_with_prefix(state, parent246);
let start257 = n.start(n.with_prefix(parent246));
return [({ "from": start257, "to": (start257 + squint_core.count(edge256)), "insert": " " }), ({ "from": n.start(target251), "insert": edge256 })];
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__252253))}
})() });}}}
}));
};
})
;
var barf = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__258) {
let map__259260 = p__258;
let range261 = map__259260;
let from262 = squint_core.get(map__259260, "from");
let to263 = squint_core.get(map__259260, "to");
let empty264 = squint_core.get(map__259260, "empty");
if (empty264 != null && empty264 !== false) {
let temp__31807__auto__265 = n.closest(n.tree(state, from262), n.coll_QMARK_);
if (temp__31807__auto__265 != null && temp__31807__auto__265 !== false) {
let parent266 = temp__31807__auto__265;
let G__267268 = direction;
switch (G__267268) {case 1:
let temp__31807__auto__270 = (function () {
 let G__271272 = n.down_last(parent266);
let G__271273 = (function () {
 let test__60965__auto__274 = squint_core.nil_QMARK_(G__271272);
if (test__60965__auto__274 != null && test__60965__auto__274 !== false) {
return null;} else {
return n.lefts(G__271272);}
})();
let G__271275 = (function () {
 let test__60965__auto__276 = squint_core.nil_QMARK_(G__271273);
if (test__60965__auto__276 != null && test__60965__auto__276 !== false) {
return null;} else {
return squint_core.remove(n.line_comment_QMARK_, G__271273);}
})();
let G__271277 = (function () {
 let test__60965__auto__278 = squint_core.nil_QMARK_(G__271275);
if (test__60965__auto__278 != null && test__60965__auto__278 !== false) {
return null;} else {
return squint_core.drop(1, G__271275);}
})();
let test__60965__auto__279 = squint_core.nil_QMARK_(G__271277);
if (test__60965__auto__279 != null && test__60965__auto__279 !== false) {
return null;} else {
return squint_core.first(G__271277);}
})();
if (temp__31807__auto__270 != null && temp__31807__auto__270 !== false) {
let target280 = temp__31807__auto__270;
return ({ "cursor": squint_core.min(n.end(target280), from262), "changes": [({ "from": n.end(target280), "insert": n.name(n.down_last(parent266)) }), squint_core.assoc_BANG_(n.from_to(n.down_last(parent266)), "insert", " ")] });}
break;
case -1:
let temp__31807__auto__281 = (function () {
 let G__282283 = n.down(parent266);
let G__282284 = (function () {
 let test__60965__auto__285 = squint_core.nil_QMARK_(G__282283);
if (test__60965__auto__285 != null && test__60965__auto__285 !== false) {
return null;} else {
return n.rights(G__282283);}
})();
let G__282286 = (function () {
 let test__60965__auto__287 = squint_core.nil_QMARK_(G__282284);
if (test__60965__auto__287 != null && test__60965__auto__287 !== false) {
return null;} else {
return squint_core.remove(n.line_comment_QMARK_, G__282284);}
})();
let G__282288 = (function () {
 let test__60965__auto__289 = squint_core.nil_QMARK_(G__282286);
if (test__60965__auto__289 != null && test__60965__auto__289 !== false) {
return null;} else {
return squint_core.drop(1, G__282286);}
})();
let test__60965__auto__290 = squint_core.nil_QMARK_(G__282288);
if (test__60965__auto__290 != null && test__60965__auto__290 !== false) {
return null;} else {
return squint_core.first(G__282288);}
})();
if (temp__31807__auto__281 != null && temp__31807__auto__281 !== false) {
let next_first_child291 = temp__31807__auto__281;
let left_edge292 = n.left_edge_with_prefix(state, parent266);
let left_start293 = n.start(n.with_prefix(parent266));
return ({ "cursor": squint_core.max(from262, (n.start(next_first_child291) + (squint_core.count(left_edge292) + 1))), "changes": [({ "from": n.start(next_first_child291), "insert": squint_core.str(" ", left_edge292) }), ({ "from": left_start293, "to": (left_start293 + squint_core.count(left_edge292)), "insert": format.spaces(state, squint_core.count(left_edge292)) })] });}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__267268))}}}
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
