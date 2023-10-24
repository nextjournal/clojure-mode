import * as squint_core from 'squint-cljs/core.js';
import * as format from './extensions/formatting.mjs';
import * as sel_history from './extensions/selection_history.mjs';
import * as n from './node.mjs';
import * as sel from './selections.mjs';
import * as u from './util.mjs';
import * as commands from '@codemirror/commands';
var view_command = (function (f) {
return function (p__31) {
let map__12 = p__31;
let state3 = squint_core.get(map__12, "state");
let dispatch4 = squint_core.get(map__12, "dispatch");
let G__325 = f(state3);
let test__27847__auto__6 = squint_core.nil_QMARK_(G__325);
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
null} else {
dispatch4(G__325)};
return true;
};
});
var scoped_view_command = (function (f) {
return function (p__33) {
let map__12 = p__33;
let state3 = squint_core.get(map__12, "state");
let dispatch4 = squint_core.get(map__12, "dispatch");
let test__27847__auto__5 = n.within_program_QMARK_(state3);
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
let G__346 = f(state3);
let test__27847__auto__7 = squint_core.nil_QMARK_(G__346);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
null} else {
dispatch4(G__346)};
return true;} else {
return false;}
};
});
var unwrap_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__35) {
let map__12 = p__35;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
let temp__27767__auto__7 = (function () {
 let G__368 = n.tree(state, from4, -1);
let G__369 = (function () {
 let test__27847__auto__10 = squint_core.nil_QMARK_(G__368);
if (test__27847__auto__10 != null && test__27847__auto__10 !== false) {
return null;} else {
return n.closest(G__368, n.coll_QMARK_);}
})();
let test__27847__auto__11 = squint_core.nil_QMARK_(G__369);
if (test__27847__auto__11 != null && test__27847__auto__11 !== false) {
return null;} else {
return u.guard(G__369, n.balanced_QMARK_);}
})();
if (temp__27767__auto__7 != null && temp__27767__auto__7 !== false) {
let nearest_balanced_coll12 = temp__27767__auto__7;
return ({ "cursor": (from4 - 1), "changes": [n.from_to(n.down(nearest_balanced_coll12)), n.from_to(n.down_last(nearest_balanced_coll12))] });}}
}));
});
var copy_to_clipboard_BANG_ = (function (text) {
let focus_el1 = squint_core.get(document, "activeElement");
let input_el2 = document.createElement("textarea");
input_el2.setAttribute("class", "clipboard-input");
squint_core.assoc_BANG_(input_el2, "innerHTML", text);
document["body"].appendChild(input_el2);
input_el2.focus(({ "preventScroll": true }));
input_el2.select();
document.execCommand("copy");
focus_el1.focus(({ "preventScroll": true }));
return document["body"].removeChild(input_el2);
});
var kill_STAR_ = (function (state) {
return u.update_ranges(state, (function (p__37) {
let map__12 = p__37;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
let node7 = n.tree(state, from4);
let parent8 = n.closest(node7, (function (_PERCENT_1) {
let or__28221__auto__9 = n.coll_QMARK_(_PERCENT_1);
if (or__28221__auto__9 != null && or__28221__auto__9 !== false) {
return or__28221__auto__9;} else {
let or__28221__auto__10 = n.string_QMARK_(_PERCENT_1);
if (or__28221__auto__10 != null && or__28221__auto__10 !== false) {
return or__28221__auto__10;} else {
return n.top_QMARK_(_PERCENT_1);}}
}));
let line_end11 = state["doc"].lineAt(from4)["to"];
let next_children12 = ((parent8 != null && parent8 !== false) ? (n.children(parent8, from4, 1)) : (null));
let last_child_on_line13 = ((parent8 != null && parent8 !== false) ? ((function () {
 let G__3814 = next_children12;
let G__3815 = (function () {
 let test__27847__auto__16 = squint_core.nil_QMARK_(G__3814);
if (test__27847__auto__16 != null && test__27847__auto__16 !== false) {
return null;} else {
return squint_core.take_while(squint_core.every_pred((function (_PERCENT_1) {
return (n.start(_PERCENT_1) <= line_end11);
})), G__3814);}
})();
let test__27847__auto__17 = squint_core.nil_QMARK_(G__3815);
if (test__27847__auto__17 != null && test__27847__auto__17 !== false) {
return null;} else {
return squint_core.last(G__3815);}
})()) : (null));
let to18 = (function () {
 let test__27847__auto__19 = n.string_QMARK_(parent8);
if (test__27847__auto__19 != null && test__27847__auto__19 !== false) {
let content20 = squint_core.str(n.string(state, parent8));
let content_from21 = squint_core.subs(content20, (from4 - n.start(parent8)));
let next_newline22 = content_from21.indexOf("\n");
let test__27847__auto__23 = squint_core.neg_QMARK_(next_newline22);
if (test__27847__auto__23 != null && test__27847__auto__23 !== false) {
return (n.end(parent8) - 1);} else {
return (from4 + next_newline22 + 1);}} else {
if (last_child_on_line13 != null && last_child_on_line13 !== false) {
let test__27847__auto__24 = n.end_edge_QMARK_(last_child_on_line13);
if (test__27847__auto__24 != null && test__27847__auto__24 !== false) {
return n.start(last_child_on_line13);} else {
return n.end(last_child_on_line13);}} else {
let test__27847__auto__25 = (function () {
 let G__3926 = squint_core.first(next_children12);
let G__3927 = (function () {
 let test__27847__auto__28 = squint_core.nil_QMARK_(G__3926);
if (test__27847__auto__28 != null && test__27847__auto__28 !== false) {
return null;} else {
return n.start(G__3926);}
})();
let test__27847__auto__29 = squint_core.nil_QMARK_(G__3927);
if (test__27847__auto__29 != null && test__27847__auto__29 !== false) {
return null;} else {
return (G__3927 > line_end11);}
})();
if (test__27847__auto__25 != null && test__27847__auto__25 !== false) {
return n.start(squint_core.first(next_children12));} else {
return null;}}}
})();
if (u.node_js_QMARK_ != null && u.node_js_QMARK_ !== false) {
null} else {
copy_to_clipboard_BANG_(n.string(state, from4, to18))};
if (to18 != null && to18 !== false) {
return ({ "cursor": from4, "changes": ({ "from": from4, "to": to18 }) });}} else {
copy_to_clipboard_BANG_(n.string(state, from4, to5));
return ({ "cursor": from4, "changes": u.from_to(from4, to5) });}
}));
});
var enter_and_indent_STAR_ = (function (state) {
let ctx1 = format.make_indent_context(state);
return u.update_ranges(state, (function (p__40) {
let map__23 = p__40;
let range4 = map__23;
let from5 = squint_core.get(map__23, "from");
let to6 = squint_core.get(map__23, "to");
let empty7 = squint_core.get(map__23, "empty");
let indent_at8 = (function () {
 let G__419 = n.closest(n.tree(state, from5), squint_core.some_fn(n.coll_QMARK_, n.top_QMARK_));
let G__4110 = (function () {
 let test__27847__auto__11 = squint_core.nil_QMARK_(G__419);
if (test__27847__auto__11 != null && test__27847__auto__11 !== false) {
return null;} else {
return n.inner_span(G__419);}
})();
let test__27847__auto__12 = squint_core.nil_QMARK_(G__4110);
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
return null;} else {
return n.start(G__4110);}
})();
let indent13 = ((indent_at8 != null && indent_at8 !== false) ? (format.get_indentation(ctx1, indent_at8)) : (null));
let insertion14 = squint_core.str("\n", ((indent13 != null && indent13 !== false) ? (format.spaces(state, indent13)) : (null)));
return ({ "cursor": (from5 + squint_core.count(insertion14)), "changes": [({ "from": from5, "to": to6, "insert": insertion14 })] });
}));
});
var nav_position = (function (state, from, dir) {
let pos1 = (function () {
 let G__422 = n.closest(n.tree(state, from), (function (_PERCENT_1) {
let or__28221__auto__3 = n.coll_QMARK_(_PERCENT_1);
if (or__28221__auto__3 != null && or__28221__auto__3 !== false) {
return or__28221__auto__3;} else {
let or__28221__auto__4 = n.string_QMARK_(_PERCENT_1);
if (or__28221__auto__4 != null && or__28221__auto__4 !== false) {
return or__28221__auto__4;} else {
return n.top_QMARK_(_PERCENT_1);}}
}));
let G__425 = (function () {
 let test__27847__auto__6 = squint_core.nil_QMARK_(G__422);
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return null;} else {
return n.children(G__422, from, dir);}
})();
let G__427 = (function () {
 let test__27847__auto__8 = squint_core.nil_QMARK_(G__425);
if (test__27847__auto__8 != null && test__27847__auto__8 !== false) {
return null;} else {
return squint_core.first(G__425);}
})();
let test__27847__auto__9 = squint_core.nil_QMARK_(G__427);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
return null;} else {
return squint_core.get(G__427, (function () {
 let G__4310 = dir;
switch (G__4310) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__4310))}
})());}
})();
let test__27847__auto__12 = squint_core.some_QMARK_(pos1);
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
return pos1;} else {
return sel.constrain(state, (from + dir));}
});
var nav = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__44) {
let map__12 = p__44;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
return ({ "cursor": nav_position(state, from4, dir) });} else {
return ({ "cursor": squint_core.get(u.from_to(from4, to5), (function () {
 let G__457 = dir;
switch (G__457) {case -1:
return "from";
break;
case 1:
return "to";
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__457))}
})()) });}
}));
};
});
var nav_select = (function (dir) {
return function (state) {
return u.update_ranges(state, (function (p__46) {
let map__12 = p__46;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
return ({ "range": n.balanced_range(state, from4, nav_position(state, from4, dir)) });} else {
return ({ "range": (function () {
 let map__78 = u.from_to(from4, to5);
let from9 = squint_core.get(map__78, "from");
let to10 = squint_core.get(map__78, "to");
let G__4711 = dir;
switch (G__4711) {case 1:
return n.balanced_range(state, from9, nav_position(state, to10, dir));
break;
case -1:
return n.balanced_range(state, nav_position(state, from9, dir), to10);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__4711))}
})() });}
}));
};
});
var balance_ranges = (function (state) {
return u.update_ranges(state, (function (p__48) {
let map__12 = p__48;
let from3 = squint_core.get(map__12, "from");
let to4 = squint_core.get(map__12, "to");
let empty5 = squint_core.get(map__12, "empty");
if (empty5 != null && empty5 !== false) {
return null;} else {
return ({ "range": n.balanced_range(state, from3, to4) });}
}));
});
var log = console.log;
var slurp = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__49) {
let map__12 = p__49;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
let temp__27767__auto__7 = n.closest(n.tree(state, from4), squint_core.every_pred(n.coll_QMARK_, (function (_PERCENT_1) {
return !(function () {
 let G__508 = direction;
switch (G__508) {case 1:
let G__5110 = _PERCENT_1;
let G__5111 = (function () {
 let test__27847__auto__12 = squint_core.nil_QMARK_(G__5110);
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
return null;} else {
return n.with_prefix(G__5110);}
})();
let G__5113 = (function () {
 let test__27847__auto__14 = squint_core.nil_QMARK_(G__5111);
if (test__27847__auto__14 != null && test__27847__auto__14 !== false) {
return null;} else {
return n.right(G__5111);}
})();
let test__27847__auto__15 = squint_core.nil_QMARK_(G__5113);
if (test__27847__auto__15 != null && test__27847__auto__15 !== false) {
return null;} else {
return n.end_edge_QMARK_(G__5113);}
break;
case -1:
let G__5216 = _PERCENT_1;
let G__5217 = (function () {
 let test__27847__auto__18 = squint_core.nil_QMARK_(G__5216);
if (test__27847__auto__18 != null && test__27847__auto__18 !== false) {
return null;} else {
return n.with_prefix(G__5216);}
})();
let G__5219 = (function () {
 let test__27847__auto__20 = squint_core.nil_QMARK_(G__5217);
if (test__27847__auto__20 != null && test__27847__auto__20 !== false) {
return null;} else {
return n.left(G__5217);}
})();
let test__27847__auto__21 = squint_core.nil_QMARK_(G__5219);
if (test__27847__auto__21 != null && test__27847__auto__21 !== false) {
return null;} else {
return n.start_edge_QMARK_(G__5219);}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__508))}
})();
})));
if (temp__27767__auto__7 != null && temp__27767__auto__7 !== false) {
let parent22 = temp__27767__auto__7;
let temp__27767__auto__23 = (function () {
 let G__5324 = direction;
switch (G__5324) {case 1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.rights(n.with_prefix(parent22))));
break;
case -1:
return squint_core.first(squint_core.remove(n.line_comment_QMARK_, n.lefts(n.with_prefix(parent22))));
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__5324))}
})();
if (temp__27767__auto__23 != null && temp__27767__auto__23 !== false) {
let target26 = temp__27767__auto__23;
return ({ "cursor/mapped": from4, "changes": (function () {
 let G__5427 = direction;
switch (G__5427) {case 1:
let edge29 = n.down_last(parent22);
return [({ "from": n.end(target26), "insert": n.name(edge29) }), squint_core.assoc_BANG_(n.from_to(edge29), "insert", " ")];
break;
case -1:
let edge30 = n.left_edge_with_prefix(state, parent22);
let start31 = n.start(n.with_prefix(parent22));
return [({ "from": start31, "to": (start31 + squint_core.count(edge30)), "insert": " " }), ({ "from": n.start(target26), "insert": edge30 })];
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__5427))}
})() });}}}
}));
};
});
var barf = (function (direction) {
return function (state) {
return u.update_ranges(state, (function (p__55) {
let map__12 = p__55;
let range3 = map__12;
let from4 = squint_core.get(map__12, "from");
let to5 = squint_core.get(map__12, "to");
let empty6 = squint_core.get(map__12, "empty");
if (empty6 != null && empty6 !== false) {
let temp__27767__auto__7 = n.closest(n.tree(state, from4), n.coll_QMARK_);
if (temp__27767__auto__7 != null && temp__27767__auto__7 !== false) {
let parent8 = temp__27767__auto__7;
let G__569 = direction;
switch (G__569) {case 1:
let temp__27767__auto__11 = (function () {
 let G__5712 = n.down_last(parent8);
let G__5713 = (function () {
 let test__27847__auto__14 = squint_core.nil_QMARK_(G__5712);
if (test__27847__auto__14 != null && test__27847__auto__14 !== false) {
return null;} else {
return n.lefts(G__5712);}
})();
let G__5715 = (function () {
 let test__27847__auto__16 = squint_core.nil_QMARK_(G__5713);
if (test__27847__auto__16 != null && test__27847__auto__16 !== false) {
return null;} else {
return squint_core.remove(n.line_comment_QMARK_, G__5713);}
})();
let G__5717 = (function () {
 let test__27847__auto__18 = squint_core.nil_QMARK_(G__5715);
if (test__27847__auto__18 != null && test__27847__auto__18 !== false) {
return null;} else {
return squint_core.drop(1, G__5715);}
})();
let test__27847__auto__19 = squint_core.nil_QMARK_(G__5717);
if (test__27847__auto__19 != null && test__27847__auto__19 !== false) {
return null;} else {
return squint_core.first(G__5717);}
})();
if (temp__27767__auto__11 != null && temp__27767__auto__11 !== false) {
let target20 = temp__27767__auto__11;
return ({ "cursor": squint_core.min(n.end(target20), from4), "changes": [({ "from": n.end(target20), "insert": n.name(n.down_last(parent8)) }), squint_core.assoc_BANG_(n.from_to(n.down_last(parent8)), "insert", " ")] });}
break;
case -1:
let temp__27767__auto__21 = (function () {
 let G__5822 = n.down(parent8);
let G__5823 = (function () {
 let test__27847__auto__24 = squint_core.nil_QMARK_(G__5822);
if (test__27847__auto__24 != null && test__27847__auto__24 !== false) {
return null;} else {
return n.rights(G__5822);}
})();
let G__5825 = (function () {
 let test__27847__auto__26 = squint_core.nil_QMARK_(G__5823);
if (test__27847__auto__26 != null && test__27847__auto__26 !== false) {
return null;} else {
return squint_core.remove(n.line_comment_QMARK_, G__5823);}
})();
let G__5827 = (function () {
 let test__27847__auto__28 = squint_core.nil_QMARK_(G__5825);
if (test__27847__auto__28 != null && test__27847__auto__28 !== false) {
return null;} else {
return squint_core.drop(1, G__5825);}
})();
let test__27847__auto__29 = squint_core.nil_QMARK_(G__5827);
if (test__27847__auto__29 != null && test__27847__auto__29 !== false) {
return null;} else {
return squint_core.first(G__5827);}
})();
if (temp__27767__auto__21 != null && temp__27767__auto__21 !== false) {
let next_first_child30 = temp__27767__auto__21;
let left_edge31 = n.left_edge_with_prefix(state, parent8);
let left_start32 = n.start(n.with_prefix(parent8));
return ({ "cursor": squint_core.max(from4, (n.start(next_first_child30) + (squint_core.count(left_edge31) + 1))), "changes": [({ "from": n.start(next_first_child30), "insert": squint_core.str(" ", left_edge31) }), ({ "from": left_start32, "to": (left_start32 + squint_core.count(left_edge31)), "insert": format.spaces(state, squint_core.count(left_edge31)) })] });}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__569))}}}
}));
};
});
var builtin_index = ({ "cursorLineStart": commands.cursorLineStart, "cursorLineDown": commands.cursorLineDown, "selectAll": commands.selectAll, "selectLineUp": commands.selectLineUp, "cursorLineBoundaryForward": commands.cursorLineBoundaryForward, "selectLineBoundaryBackward": commands.selectLineBoundaryBackward, "deleteCharBackward": commands.deleteCharBackward, "insertNewlineAndIndent": commands.insertNewlineAndIndent, "cursorLineBoundaryBackward": commands.cursorLineBoundaryBackward, "selectCharRight": commands.selectCharRight, "selectPageUp": commands.selectPageUp, "deleteCharForward": commands.deleteCharForward, "cursorCharLeft": commands.cursorCharLeft, "cursorGroupBackward": commands.cursorGroupBackward, "selectDocStart": commands.selectDocStart, "selectGroupBackward": commands.selectGroupBackward, "cursorDocEnd": commands.cursorDocEnd, "deleteGroupBackward": commands.deleteGroupBackward, "selectLineStart": commands.selectLineStart, "deleteGroupForward": commands.deleteGroupForward, "selectDocEnd": commands.selectDocEnd, "selectPageDown": commands.selectPageDown, "cursorPageDown": commands.cursorPageDown, "cursorPageUp": commands.cursorPageUp, "selectLineBoundaryForward": commands.selectLineBoundaryForward, "cursorLineEnd": commands.cursorLineEnd, "cursorGroupForward": commands.cursorGroupForward, "cursorCharRight": commands.cursorCharRight, "selectGroupForward": commands.selectGroupForward, "selectLineEnd": commands.selectLineEnd, "selectCharLeft": commands.selectCharLeft, "splitLine": commands.splitLine, "selectLineDown": commands.selectLineDown, "transposeChars": commands.transposeChars, "cursorLineUp": commands.cursorLineUp, "cursorDocStart": commands.cursorDocStart });
var indent = view_command(format.format);
var unwrap = view_command(unwrap_STAR_);
var kill = scoped_view_command(kill_STAR_);
var nav_right = view_command(nav(1));
var nav_left = view_command(nav(-1));
var nav_select_right = view_command(nav_select(1));
var nav_select_left = view_command(nav_select(-1));
var slurp_forward = view_command(slurp(1));
var slurp_backward = view_command(slurp(-1));
var barf_forward = view_command(barf(1));
var barf_backward = view_command(barf(-1));
var selection_grow = view_command(sel_history.selection_grow_STAR_);
var selection_return = view_command(sel_history.selection_return_STAR_);
var enter_and_indent = view_command(enter_and_indent_STAR_);
var paredit_index = ({ "indent": indent, "nav-left": nav_left, "enter-and-indent": enter_and_indent, "selection-grow": selection_grow, "kill": kill, "slurp-forward": slurp_forward, "nav-select-right": nav_select_right, "nav-select-left": nav_select_left, "barf-forward": barf_forward, "barf-backward": barf_backward, "nav-right": nav_right, "slurp-backward": slurp_backward, "unwrap": unwrap, "selection-return": selection_return });
var index = squint_core.merge(builtin_index, paredit_index);
var reverse_index = squint_core.reduce_kv((function (_PERCENT_1, _PERCENT_2, _PERCENT_3) {
return squint_core.assoc(_PERCENT_1, _PERCENT_3, _PERCENT_2);
}), ({  }), index);
squint_core.prn("commands-loaded");

export { nav_select_left, index, view_command, barf_backward, scoped_view_command, kill_STAR_, enter_and_indent_STAR_, unwrap, enter_and_indent, log, nav_select, slurp, nav_position, indent, nav_select_right, slurp_forward, selection_grow, nav, balance_ranges, nav_left, copy_to_clipboard_BANG_, barf, builtin_index, barf_forward, paredit_index, kill, reverse_index, unwrap_STAR_, nav_right, slurp_backward, selection_return }
