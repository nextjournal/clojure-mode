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
if (("Program" === type_name5)) {
return 0;} else {
if (n.coll_type_QMARK_(type4)) {
let G__1415 = context9.column(n.end(n.down(node12)));
if ((("List" === type_name5) && new Set(["Operator", "DefLike", "NS"])((function () {
 let G__1617 = node12;
let G__1618 = (squint_core.nil_QMARK_(G__1617)) ? (null) : (n.down(G__1617));
let G__1619 = (squint_core.nil_QMARK_(G__1618)) ? (null) : (n.right(G__1618));
if (squint_core.nil_QMARK_(G__1619)) {
return null;} else {
return n.name(G__1619);}
})()))) {
return (G__1415 + 1);} else {
return G__1415;}} else {
if ("else") {
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
let context20 = make_indent_context(state);
return u.update_lines(state, (function (from, content, line_num) {
let current_indent21 = /^\s*/.exec(content)[0]["length"];
let indent22 = u.guard(get_indentation(context20, from), squint_core.complement(squint_core.neg_QMARK_));
if (indent22) {
let G__2324 = compare(indent22, current_indent21);
switch (G__2324) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent21), "insert": spaces(state, (indent22 - current_indent21)) });
break;
case -1:
return ({ "from": (from + indent22), "to": (from + current_indent21) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__2324))}}
}));
})
;
var expected_space = (function (n1, n2) {
if ((n.start_edge_type_QMARK_(n1) || n.prefix_edge_type_QMARK_(n1) || n.end_edge_type_QMARK_(n2) || n.same_edge_type_QMARK_(n2))) {
return 0;} else {
return 1;}
})
;
var space_changes = (function (state, from, to) {
let nodes26 = squint_core.reverse(squint_core.filter((function (_PERCENT_1) {
return (((from <= n.start(_PERCENT_1)) && (n.start(_PERCENT_1) <= to)) || ((from <= n.end(_PERCENT_1)) && (n.end(_PERCENT_1) <= to)));
}), n.terminal_nodes(state, from, to)));
let trim_QMARK_27 = (function () {
 let G__2829 = squint_core.first(nodes26);
let G__2830 = (squint_core.nil_QMARK_(G__2829)) ? (null) : (n.end(G__2829));
if (squint_core.nil_QMARK_(G__2830)) {
return null;} else {
return (G__2830 < to);}
})();
return squint_core.reduce((function (out, p__31) {
let vec__3237 = p__31;
let map__3538 = squint_core.nth(vec__3237, 0, null);
let n239 = squint_core.get(map__3538, "type");
let start240 = squint_core.get(map__3538, "from");
let end241 = squint_core.get(map__3538, "to");
let map__3642 = squint_core.nth(vec__3237, 1, null);
let n143 = squint_core.get(map__3642, "type");
let start144 = squint_core.get(map__3642, "from");
let end145 = squint_core.get(map__3642, "to");
let expected46 = expected_space(n143, n239);
let actual47 = (start240 - end145);
let G__4849 = compare(actual47, expected46);
switch (G__4849) {case 0:
return out;
break;
case 1:
return u.push_BANG_(out, ({ "from": ((expected46 == 0)) ? (end145) : ((end145 + 1)), "to": start240 }));
break;
case -1:
return u.push_BANG_(out, ({ "from": end145, "insert": " " }));
break;
default:
return out;}
}), (trim_QMARK_27) ? ([({ "from": n.end(squint_core.first(nodes26)), "to": to })]) : ([]), squint_core.partition(2, 1, nodes26));
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
assert(squint_core.some_QMARK_(text));
let current_indent51 = /^\s*/.exec(text)[0]["length"];
let indent52 = u.guard(get_indentation(indent_context, from), squint_core.complement(squint_core.neg_QMARK_));
let indentation_change53 = (indent52) ? ((function () {
 let G__5455 = compare(indent52, current_indent51);
switch (G__5455) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent51), "insert": spaces(state, (indent52 - current_indent51)) });
break;
case -1:
return ({ "from": (from + indent52), "to": (from + current_indent51) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__5455))}
})()) : (null);
let space_changes57 = ((format_spaces_QMARK_ && (n.embedded_QMARK_(state, from) || n.within_program_QMARK_(state, from)))) ? (space_changes(state, (from + current_indent51), (from + squint_core.count(text)))) : (null);
let G__5859 = changes;
let G__5860 = (space_changes57) ? (into_arr(G__5859, space_changes57)) : (G__5859);
if (indentation_change53) {
return u.push_BANG_(G__5860, indentation_change53);} else {
return G__5860;}
})
;
var format_selection = (function (state) {
let context61 = make_indent_context(state);
return u.update_selected_lines(state, (function (p__62, changes, range) {
let map__6364 = p__62;
let line65 = map__6364;
let from66 = squint_core.get(map__6364, "from");
let text67 = squint_core.get(map__6364, "text");
let number68 = squint_core.get(map__6364, "number");
return format_line(state, context61, from66, text67, number68, changes, true);
}));
})
;
var format_all = (function (state) {
let context69 = make_indent_context(state);
return u.update_lines(state, (function (from, text, line_num) {
return format_line(state, context69, from, text, line_num, [], true);
}));
})
;
var format_transaction = (function (tr) {
let origin70 = u.get_user_event_annotation(tr);
let temp__25059__auto__71 = (n.within_program_QMARK_(tr["startState"])) ? ((function () {
 let G__7273 = origin70;
switch (G__7273) {case "input":
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
if (tr["changes"]["empty"]) {
return null;} else {
let state75 = tr["state"];
let context76 = make_indent_context(state75);
return u.iter_changed_lines(tr, (function (line, changes) {
return format_line(state75, context76, line["from"], line["text"], line["number"], changes, true);
}));}}
})()) : (null);
if (squint_core.nil_QMARK_(temp__25059__auto__71)) {
return tr;} else {
let changes77 = temp__25059__auto__71;
return tr["startState"].update(squint_core.assoc_BANG_(changes77, "filter", false));}
})
;
var format = (function (state) {
if (u.something_selected_QMARK_(state)) {
return state.update(format_selection(state));} else {
return format_all(state);}
})
;
var prefix_all = (function (prefix, state) {
return u.update_lines(state, (function (from, _, _78) {
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
