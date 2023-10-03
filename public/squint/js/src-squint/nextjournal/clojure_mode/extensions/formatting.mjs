import * as squint_core from 'squint-cljs/core.js';
import * as language from '@codemirror/language';
import { IndentContext } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
var spaces = (function (state, n) {
return language.indentString(state, n);
})
;
var indent_node_props = (function (p__1) {
let map__23 = p__1;
let type4 = map__23;
let type_name5 = squint_core.get(map__23, "name");
return function (p__6) {
let map__78 = p__6;
let context9 = map__78;
let pos10 = squint_core.get(map__78, "pos");
let unit11 = squint_core.get(map__78, "unit");
let node12 = squint_core.get(map__78, "node");
let state13 = squint_core.get(map__78, "state");
let test__26256__auto__14 = ("Program" === type_name5);
if (test__26256__auto__14 != null && test__26256__auto__14 !== false) {
return 0;} else {
let test__26256__auto__15 = n.coll_type_QMARK_(type4);
if (test__26256__auto__15 != null && test__26256__auto__15 !== false) {
let G__1617 = context9.column(n.end(n.down(node12)));
let test__26256__auto__18 = (function () {
 let and__25509__auto__19 = ("List" === type_name5);
if (and__25509__auto__19 != null && and__25509__auto__19 !== false) {
return squint_core.contains_QMARK_(new Set(["Operator", "DefLike", "NS"]), (function () {
 let G__2021 = node12;
let G__2022 = (function () {
 let test__26256__auto__23 = squint_core.nil_QMARK_(G__2021);
if (test__26256__auto__23 != null && test__26256__auto__23 !== false) {
return null;} else {
return n.down(G__2021);}
})();
let G__2024 = (function () {
 let test__26256__auto__25 = squint_core.nil_QMARK_(G__2022);
if (test__26256__auto__25 != null && test__26256__auto__25 !== false) {
return null;} else {
return n.right(G__2022);}
})();
let test__26256__auto__26 = squint_core.nil_QMARK_(G__2024);
if (test__26256__auto__26 != null && test__26256__auto__26 !== false) {
return null;} else {
return n.name(G__2024);}
})());} else {
return and__25509__auto__19;}
})();
if (test__26256__auto__18 != null && test__26256__auto__18 !== false) {
return (G__1617 + 1);} else {
return G__1617;}} else {
if ("else" != null && "else" !== false) {
return -1;} else {
return null;}}}
};
})
;
var props = language.indentNodeProp.add(indent_node_props)
;
var get_indentation = (function (context, pos) {
return language.getIndentation(context["state"], pos);
})
;
var make_indent_context = (function (state) {
return new IndentContext(state);
})
;
var indent_all = (function (state) {
let context27 = make_indent_context(state);
return u.update_lines(state, (function (from, content, line_num) {
let current_indent28 = /^\s*/.exec(content)[0]["length"];
let indent29 = u.guard(get_indentation(context27, from), squint_core.complement(squint_core.neg_QMARK_));
if (indent29 != null && indent29 !== false) {
let G__3031 = squint_core.compare(indent29, current_indent28);
switch (G__3031) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent28), "insert": spaces(state, (indent29 - current_indent28)) });
break;
case -1:
return ({ "from": (from + indent29), "to": (from + current_indent28) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3031))}}
}));
})
;
var expected_space = (function (n1, n2) {
let test__26256__auto__33 = (function () {
 let or__25460__auto__34 = n.start_edge_type_QMARK_(n1);
if (or__25460__auto__34 != null && or__25460__auto__34 !== false) {
return or__25460__auto__34;} else {
let or__25460__auto__35 = n.prefix_edge_type_QMARK_(n1);
if (or__25460__auto__35 != null && or__25460__auto__35 !== false) {
return or__25460__auto__35;} else {
let or__25460__auto__36 = n.end_edge_type_QMARK_(n2);
if (or__25460__auto__36 != null && or__25460__auto__36 !== false) {
return or__25460__auto__36;} else {
return n.same_edge_type_QMARK_(n2);}}}
})();
if (test__26256__auto__33 != null && test__26256__auto__33 !== false) {
return 0;} else {
return 1;}
})
;
var space_changes = (function (state, from, to) {
let nodes37 = squint_core.reverse(squint_core.filter((function (_PERCENT_1) {
let or__25460__auto__38 = ((from <= n.start(_PERCENT_1)) && (n.start(_PERCENT_1) <= to));
if (or__25460__auto__38 != null && or__25460__auto__38 !== false) {
return or__25460__auto__38;} else {
((from <= n.end(_PERCENT_1)) && (n.end(_PERCENT_1) <= to))}
}), n.terminal_nodes(state, from, to)));
let trim_QMARK_39 = (function () {
 let G__4041 = squint_core.first(nodes37);
let G__4042 = (function () {
 let test__26256__auto__43 = squint_core.nil_QMARK_(G__4041);
if (test__26256__auto__43 != null && test__26256__auto__43 !== false) {
return null;} else {
return n.end(G__4041);}
})();
let test__26256__auto__44 = squint_core.nil_QMARK_(G__4042);
if (test__26256__auto__44 != null && test__26256__auto__44 !== false) {
return null;} else {
return (G__4042 < to);}
})();
return squint_core.reduce((function (out, p__45) {
let vec__4651 = p__45;
let map__4952 = squint_core.nth(vec__4651, 0, null);
let n253 = squint_core.get(map__4952, "type");
let start254 = squint_core.get(map__4952, "from");
let end255 = squint_core.get(map__4952, "to");
let map__5056 = squint_core.nth(vec__4651, 1, null);
let n157 = squint_core.get(map__5056, "type");
let start158 = squint_core.get(map__5056, "from");
let end159 = squint_core.get(map__5056, "to");
let expected60 = expected_space(n157, n253);
let actual61 = (start254 - end159);
let G__6263 = squint_core.compare(actual61, expected60);
switch (G__6263) {case 0:
return out;
break;
case 1:
return u.push_BANG_(out, ({ "from": (function () {
 let test__26256__auto__65 = (expected60 == 0);
if (test__26256__auto__65 != null && test__26256__auto__65 !== false) {
return end159;} else {
return (end159 + 1);}
})(), "to": start254 }));
break;
case -1:
return u.push_BANG_(out, ({ "from": end159, "insert": " " }));
break;
default:
return out;}
}), ((trim_QMARK_39 != null && trim_QMARK_39 !== false) ? ([({ "from": n.end(squint_core.first(nodes37)), "to": to })]) : ([])), squint_core.partition(2, 1, nodes37));
})
;
var into_arr = (function (arr, items) {
for (let i of items) {
[true, arr.push(i)]
};
null;
return arr;
})
;
var format_line = (function (state, indent_context, from, text, line_num, changes, format_spaces_QMARK_) {
let current_indent66 = /^\s*/.exec(text)[0]["length"];
let indent67 = u.guard(get_indentation(indent_context, from), squint_core.complement(squint_core.neg_QMARK_));
let indentation_change68 = ((indent67 != null && indent67 !== false) ? ((function () {
 let G__6970 = squint_core.compare(indent67, current_indent66);
switch (G__6970) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent66), "insert": spaces(state, (indent67 - current_indent66)) });
break;
case -1:
return ({ "from": (from + indent67), "to": (from + current_indent66) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__6970))}
})()) : (null));
let space_changes72 = (function () {
 let test__26256__auto__73 = (function () {
 let and__25509__auto__74 = format_spaces_QMARK_;
if (and__25509__auto__74 != null && and__25509__auto__74 !== false) {
let or__25460__auto__75 = n.embedded_QMARK_(state, from);
if (or__25460__auto__75 != null && or__25460__auto__75 !== false) {
return or__25460__auto__75;} else {
return n.within_program_QMARK_(state, from);}} else {
return and__25509__auto__74;}
})();
if (test__26256__auto__73 != null && test__26256__auto__73 !== false) {
return space_changes(state, (from + current_indent66), (from + squint_core.count(text)));}
})();
let G__7677 = changes;
let G__7678 = ((space_changes72 != null && space_changes72 !== false) ? (into_arr(G__7677, space_changes72)) : (G__7677));
if (indentation_change68 != null && indentation_change68 !== false) {
return u.push_BANG_(G__7678, indentation_change68);} else {
return G__7678;}
})
;
var format_selection = (function (state) {
let context79 = make_indent_context(state);
return u.update_selected_lines(state, (function (p__80, changes, range) {
let map__8182 = p__80;
let line83 = map__8182;
let from84 = squint_core.get(map__8182, "from");
let text85 = squint_core.get(map__8182, "text");
let number86 = squint_core.get(map__8182, "number");
return format_line(state, context79, from84, text85, number86, changes, true);
}));
})
;
var format_all = (function (state) {
let context87 = make_indent_context(state);
return u.update_lines(state, (function (from, text, line_num) {
return format_line(state, context87, from, text, line_num, [], true);
}));
})
;
var format_transaction = (function (tr) {
let origin88 = u.get_user_event_annotation(tr);
let temp__24849__auto__89 = (function () {
 let test__26256__auto__90 = n.within_program_QMARK_(tr["startState"]);
if (test__26256__auto__90 != null && test__26256__auto__90 !== false) {
let G__9192 = origin88;
switch (G__9192) {case "input":
return null;
break;
case "input.type":
return null;
break;
case "delete":
return null;
break;
case "keyboardselection":
return null;
break;
case "pointerselection":
return null;
break;
case "select.pointer":
return null;
break;
case "cut":
return null;
break;
case "noformat":
return null;
break;
case "evalregion":
return null;
break;
case "format-selections":
return format_selection(tr["state"]);
break;
default:
let test__26256__auto__94 = tr["changes"]["empty"];
if (test__26256__auto__94 != null && test__26256__auto__94 !== false) {
return null;} else {
let state95 = tr["state"];
let context96 = make_indent_context(state95);
return u.iter_changed_lines(tr, (function (line, changes) {
return format_line(state95, context96, line["from"], line["text"], line["number"], changes, true);
}));}}}
})();
let test__26256__auto__97 = squint_core.nil_QMARK_(temp__24849__auto__89);
if (test__26256__auto__97 != null && test__26256__auto__97 !== false) {
return tr;} else {
let changes98 = temp__24849__auto__89;
return tr["startState"].update(squint_core.assoc_BANG_(changes98, "filter", false));}
})
;
var format = (function (state) {
let test__26256__auto__99 = u.something_selected_QMARK_(state);
if (test__26256__auto__99 != null && test__26256__auto__99 !== false) {
return state.update(format_selection(state));} else {
return format_all(state);}
})
;
var prefix_all = (function (prefix, state) {
return u.update_lines(state, (function (from, _, _100) {
return ({ "from": from, "insert": prefix });
}));
})
;
var ext_format_changed_lines = (function () {
return EditorState["transactionFilter"].of(format_transaction);
})
;
squint_core.prn("formatting-loaded");

export { format_selection, expected_space, get_indentation, ext_format_changed_lines, format_all, format_transaction, space_changes, spaces, make_indent_context, indent_all, props, indent_node_props, prefix_all, into_arr, format_line, format }
