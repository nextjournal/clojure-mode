import * as squint_core from 'squint-cljs/core.js';
import * as language from '@codemirror/language';
import { IndentContext } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import * as n from './../node.mjs';
import * as u from './../util.mjs';
var spaces = (function (state, n) {
return language.indentString(state, n);
});
var indent_node_props = (function (p__376) {
let map__12 = p__376;
let type3 = map__12;
let type_name4 = squint_core.get(map__12, "name");
return function (p__377) {
let map__56 = p__377;
let context7 = map__56;
let node8 = squint_core.get(map__56, "node");
let test__27847__auto__9 = ("Program" === type_name4);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
return 0;} else {
let test__27847__auto__10 = n.coll_type_QMARK_(type3);
if (test__27847__auto__10 != null && test__27847__auto__10 !== false) {
let G__37811 = context7.column(n.end(n.down(node8)));
let test__27847__auto__12 = (function () {
 let and__28236__auto__13 = ("List" === type_name4);
if (and__28236__auto__13 != null && and__28236__auto__13 !== false) {
return squint_core.contains_QMARK_(new Set(["Operator", "DefLike", "NS"]), (function () {
 let G__37914 = node8;
let G__37915 = (function () {
 let test__27847__auto__16 = squint_core.nil_QMARK_(G__37914);
if (test__27847__auto__16 != null && test__27847__auto__16 !== false) {
return null;} else {
return n.down(G__37914);}
})();
let G__37917 = (function () {
 let test__27847__auto__18 = squint_core.nil_QMARK_(G__37915);
if (test__27847__auto__18 != null && test__27847__auto__18 !== false) {
return null;} else {
return n.right(G__37915);}
})();
let test__27847__auto__19 = squint_core.nil_QMARK_(G__37917);
if (test__27847__auto__19 != null && test__27847__auto__19 !== false) {
return null;} else {
return n.name(G__37917);}
})());} else {
return and__28236__auto__13;}
})();
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
return (G__37811 + 1);} else {
return G__37811;}} else {
let test__27847__auto__20 = "else";
if (test__27847__auto__20 != null && test__27847__auto__20 !== false) {
return -1;} else {
return null;}}}
};
});
var props = language.indentNodeProp.add(indent_node_props);
var get_indentation = (function (context, pos) {
return language.getIndentation(context["state"], pos);
});
var make_indent_context = (function (state) {
return new IndentContext(state);
});
var indent_all = (function (state) {
let context1 = make_indent_context(state);
return u.update_lines(state, (function (from, content, _line_num) {
let current_indent2 = /^\s*/.exec(content)[0]["length"];
let indent3 = u.guard(get_indentation(context1, from), squint_core.complement(squint_core.neg_QMARK_));
if (indent3 != null && indent3 !== false) {
let G__3804 = squint_core.compare(indent3, current_indent2);
switch (G__3804) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent2), "insert": spaces(state, (indent3 - current_indent2)) });
break;
case -1:
return ({ "from": (from + indent3), "to": (from + current_indent2) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3804))}}
}));
});
var expected_space = (function (n1, n2) {
let test__27847__auto__1 = (function () {
 let or__28221__auto__2 = n.start_edge_type_QMARK_(n1);
if (or__28221__auto__2 != null && or__28221__auto__2 !== false) {
return or__28221__auto__2;} else {
let or__28221__auto__3 = n.prefix_edge_type_QMARK_(n1);
if (or__28221__auto__3 != null && or__28221__auto__3 !== false) {
return or__28221__auto__3;} else {
let or__28221__auto__4 = n.end_edge_type_QMARK_(n2);
if (or__28221__auto__4 != null && or__28221__auto__4 !== false) {
return or__28221__auto__4;} else {
return n.same_edge_type_QMARK_(n2);}}}
})();
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return 0;} else {
return 1;}
});
var space_changes = (function (state, from, to) {
let nodes1 = squint_core.reverse(squint_core.filter((function (_PERCENT_1) {
let or__28221__auto__2 = ((from <= n.start(_PERCENT_1)) && (n.start(_PERCENT_1) <= to));
if (or__28221__auto__2 != null && or__28221__auto__2 !== false) {
return or__28221__auto__2;} else {
((from <= n.end(_PERCENT_1)) && (n.end(_PERCENT_1) <= to))}
}), n.terminal_nodes(state, from, to)));
let trim_QMARK_3 = (function () {
 let G__3814 = squint_core.first(nodes1);
let G__3815 = (function () {
 let test__27847__auto__6 = squint_core.nil_QMARK_(G__3814);
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return null;} else {
return n.end(G__3814);}
})();
let test__27847__auto__7 = squint_core.nil_QMARK_(G__3815);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return null;} else {
return (G__3815 < to);}
})();
return squint_core.reduce((function (out, p__382) {
let vec__813 = p__382;
let map__1114 = squint_core.nth(vec__813, 0, null);
let n215 = squint_core.get(map__1114, "type");
let start216 = squint_core.get(map__1114, "from");
let map__1217 = squint_core.nth(vec__813, 1, null);
let n118 = squint_core.get(map__1217, "type");
let end119 = squint_core.get(map__1217, "to");
let expected20 = expected_space(n118, n215);
let actual21 = (start216 - end119);
let G__38322 = squint_core.compare(actual21, expected20);
switch (G__38322) {case 0:
return out;
break;
case 1:
let G__38424 = out;
G__38424.push(({ "from": (function () {
 let test__27847__auto__25 = (expected20 == 0);
if (test__27847__auto__25 != null && test__27847__auto__25 !== false) {
return end119;} else {
return (end119 + 1);}
})(), "to": start216 }));
return G__38424;
break;
case -1:
let G__38526 = out;
G__38526.push(({ "from": end119, "insert": " " }));
return G__38526;
break;
default:
return out;}
}), ((trim_QMARK_3 != null && trim_QMARK_3 !== false) ? ([({ "from": n.end(squint_core.first(nodes1)), "to": to })]) : ([])), squint_core.partition(2, 1, nodes1));
});
var into_arr = (function (arr, items) {
for (let i of items) {
[true, arr.push(i)]
};
null;
return arr;
});
var format_line = (function (state, indent_context, from, text, _line_num, changes, format_spaces_QMARK_) {
let current_indent1 = /^\s*/.exec(text)[0]["length"];
let indent2 = u.guard(get_indentation(indent_context, from), squint_core.complement(squint_core.neg_QMARK_));
let indentation_change3 = ((indent2 != null && indent2 !== false) ? ((function () {
 let G__3864 = squint_core.compare(indent2, current_indent1);
switch (G__3864) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent1), "insert": spaces(state, (indent2 - current_indent1)) });
break;
case -1:
return ({ "from": (from + indent2), "to": (from + current_indent1) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3864))}
})()) : (null));
let space_changes6 = (function () {
 let test__27847__auto__7 = (function () {
 let and__28236__auto__8 = format_spaces_QMARK_;
if (and__28236__auto__8 != null && and__28236__auto__8 !== false) {
let or__28221__auto__9 = n.embedded_QMARK_(state, from);
if (or__28221__auto__9 != null && or__28221__auto__9 !== false) {
return or__28221__auto__9;} else {
return n.within_program_QMARK_(state, from);}} else {
return and__28236__auto__8;}
})();
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return space_changes(state, (from + current_indent1), (from + squint_core.count(text)));}
})();
let G__38710 = changes;
let G__38711 = ((space_changes6 != null && space_changes6 !== false) ? (into_arr(G__38710, space_changes6)) : (G__38710));
if (indentation_change3 != null && indentation_change3 !== false) {
let G__38812 = G__38711;
G__38812.push(indentation_change3);
return G__38812;} else {
return G__38711;}
});
var format_selection = (function (state) {
let context1 = make_indent_context(state);
return u.update_selected_lines(state, (function (p__389, changes, _range) {
let map__23 = p__389;
let _line4 = map__23;
let from5 = squint_core.get(map__23, "from");
let text6 = squint_core.get(map__23, "text");
let number7 = squint_core.get(map__23, "number");
return format_line(state, context1, from5, text6, number7, changes, true);
}));
});
var format_all = (function (state) {
let context1 = make_indent_context(state);
return u.update_lines(state, (function (from, text, line_num) {
return format_line(state, context1, from, text, line_num, [], true);
}));
});
var format_transaction = (function (tr) {
let origin1 = u.get_user_event_annotation(tr);
let temp__27741__auto__2 = (function () {
 let test__27847__auto__3 = n.within_program_QMARK_(tr["startState"]);
if (test__27847__auto__3 != null && test__27847__auto__3 !== false) {
let G__3904 = origin1;
switch (G__3904) {case "input":
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
let test__27847__auto__6 = tr["changes"]["empty"];
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return null;} else {
let state7 = tr["state"];
let context8 = make_indent_context(state7);
return u.iter_changed_lines(tr, (function (line, changes) {
return format_line(state7, context8, line["from"], line["text"], line["number"], changes, true);
}));}}}
})();
let test__27847__auto__9 = squint_core.nil_QMARK_(temp__27741__auto__2);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
return tr;} else {
let changes10 = temp__27741__auto__2;
return tr["startState"].update(squint_core.assoc_BANG_(changes10, "filter", false));}
});
var format = (function (state) {
let test__27847__auto__1 = u.something_selected_QMARK_(state);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return state.update(format_selection(state));} else {
return format_all(state);}
});
var prefix_all = (function (prefix, state) {
return u.update_lines(state, (function (from, _, _1) {
return ({ "from": from, "insert": prefix });
}));
});
var ext_format_changed_lines = (function () {
return EditorState["transactionFilter"].of(format_transaction);
});
squint_core.prn("formatting-loaded");

export { format_selection, expected_space, get_indentation, ext_format_changed_lines, format_all, format_transaction, space_changes, spaces, make_indent_context, indent_all, props, indent_node_props, prefix_all, into_arr, format_line, format }
