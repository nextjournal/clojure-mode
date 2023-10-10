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
var indent_node_props = (function (p__463) {
let map__464465 = p__463;
let type466 = map__464465;
let type_name467 = squint_core.get(map__464465, "name");
return function (p__468) {
let map__469470 = p__468;
let context471 = map__469470;
let pos472 = squint_core.get(map__469470, "pos");
let unit473 = squint_core.get(map__469470, "unit");
let node474 = squint_core.get(map__469470, "node");
let state475 = squint_core.get(map__469470, "state");
let test__60965__auto__476 = ("Program" === type_name467);
if (test__60965__auto__476 != null && test__60965__auto__476 !== false) {
return 0;} else {
let test__60965__auto__477 = n.coll_type_QMARK_(type466);
if (test__60965__auto__477 != null && test__60965__auto__477 !== false) {
let G__478479 = context471.column(n.end(n.down(node474)));
let test__60965__auto__480 = (function () {
 let and__32262__auto__481 = ("List" === type_name467);
if (and__32262__auto__481 != null && and__32262__auto__481 !== false) {
return squint_core.contains_QMARK_(new Set(["Operator", "DefLike", "NS"]), (function () {
 let G__482483 = node474;
let G__482484 = (function () {
 let test__60965__auto__485 = squint_core.nil_QMARK_(G__482483);
if (test__60965__auto__485 != null && test__60965__auto__485 !== false) {
return null;} else {
return n.down(G__482483);}
})();
let G__482486 = (function () {
 let test__60965__auto__487 = squint_core.nil_QMARK_(G__482484);
if (test__60965__auto__487 != null && test__60965__auto__487 !== false) {
return null;} else {
return n.right(G__482484);}
})();
let test__60965__auto__488 = squint_core.nil_QMARK_(G__482486);
if (test__60965__auto__488 != null && test__60965__auto__488 !== false) {
return null;} else {
return n.name(G__482486);}
})());} else {
return and__32262__auto__481;}
})();
if (test__60965__auto__480 != null && test__60965__auto__480 !== false) {
return (G__478479 + 1);} else {
return G__478479;}} else {
let test__60965__auto__489 = "else";
if (test__60965__auto__489 != null && test__60965__auto__489 !== false) {
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
let context490 = make_indent_context(state);
return u.update_lines(state, (function (from, content, line_num) {
let current_indent491 = /^\s*/.exec(content)[0]["length"];
let indent492 = u.guard(get_indentation(context490, from), squint_core.complement(squint_core.neg_QMARK_));
if (indent492 != null && indent492 !== false) {
let G__493494 = squint_core.compare(indent492, current_indent491);
switch (G__493494) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent491), "insert": spaces(state, (indent492 - current_indent491)) });
break;
case -1:
return ({ "from": (from + indent492), "to": (from + current_indent491) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__493494))}}
}));
})
;
var expected_space = (function (n1, n2) {
let test__60965__auto__496 = (function () {
 let or__32239__auto__497 = n.start_edge_type_QMARK_(n1);
if (or__32239__auto__497 != null && or__32239__auto__497 !== false) {
return or__32239__auto__497;} else {
let or__32239__auto__498 = n.prefix_edge_type_QMARK_(n1);
if (or__32239__auto__498 != null && or__32239__auto__498 !== false) {
return or__32239__auto__498;} else {
let or__32239__auto__499 = n.end_edge_type_QMARK_(n2);
if (or__32239__auto__499 != null && or__32239__auto__499 !== false) {
return or__32239__auto__499;} else {
return n.same_edge_type_QMARK_(n2);}}}
})();
if (test__60965__auto__496 != null && test__60965__auto__496 !== false) {
return 0;} else {
return 1;}
})
;
var space_changes = (function (state, from, to) {
let nodes500 = squint_core.reverse(squint_core.filter((function (_PERCENT_1) {
let or__32239__auto__501 = ((from <= n.start(_PERCENT_1)) && (n.start(_PERCENT_1) <= to));
if (or__32239__auto__501 != null && or__32239__auto__501 !== false) {
return or__32239__auto__501;} else {
((from <= n.end(_PERCENT_1)) && (n.end(_PERCENT_1) <= to))}
}), n.terminal_nodes(state, from, to)));
let trim_QMARK_502 = (function () {
 let G__503504 = squint_core.first(nodes500);
let G__503505 = (function () {
 let test__60965__auto__506 = squint_core.nil_QMARK_(G__503504);
if (test__60965__auto__506 != null && test__60965__auto__506 !== false) {
return null;} else {
return n.end(G__503504);}
})();
let test__60965__auto__507 = squint_core.nil_QMARK_(G__503505);
if (test__60965__auto__507 != null && test__60965__auto__507 !== false) {
return null;} else {
return (G__503505 < to);}
})();
return squint_core.reduce((function (out, p__508) {
let vec__509514 = p__508;
let map__512515 = squint_core.nth(vec__509514, 0, null);
let n2516 = squint_core.get(map__512515, "type");
let start2517 = squint_core.get(map__512515, "from");
let end2518 = squint_core.get(map__512515, "to");
let map__513519 = squint_core.nth(vec__509514, 1, null);
let n1520 = squint_core.get(map__513519, "type");
let start1521 = squint_core.get(map__513519, "from");
let end1522 = squint_core.get(map__513519, "to");
let expected523 = expected_space(n1520, n2516);
let actual524 = (start2517 - end1522);
let G__525526 = squint_core.compare(actual524, expected523);
switch (G__525526) {case 0:
return out;
break;
case 1:
return u.push_BANG_(out, ({ "from": (function () {
 let test__60965__auto__528 = (expected523 == 0);
if (test__60965__auto__528 != null && test__60965__auto__528 !== false) {
return end1522;} else {
return (end1522 + 1);}
})(), "to": start2517 }));
break;
case -1:
return u.push_BANG_(out, ({ "from": end1522, "insert": " " }));
break;
default:
return out;}
}), ((trim_QMARK_502 != null && trim_QMARK_502 !== false) ? ([({ "from": n.end(squint_core.first(nodes500)), "to": to })]) : ([])), squint_core.partition(2, 1, nodes500));
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
let current_indent529 = /^\s*/.exec(text)[0]["length"];
let indent530 = u.guard(get_indentation(indent_context, from), squint_core.complement(squint_core.neg_QMARK_));
let indentation_change531 = ((indent530 != null && indent530 !== false) ? ((function () {
 let G__532533 = squint_core.compare(indent530, current_indent529);
switch (G__532533) {case 0:
return null;
break;
case 1:
return ({ "from": (from + current_indent529), "insert": spaces(state, (indent530 - current_indent529)) });
break;
case -1:
return ({ "from": (from + indent530), "to": (from + current_indent529) });
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__532533))}
})()) : (null));
let space_changes535 = (function () {
 let test__60965__auto__536 = (function () {
 let and__32262__auto__537 = format_spaces_QMARK_;
if (and__32262__auto__537 != null && and__32262__auto__537 !== false) {
let or__32239__auto__538 = n.embedded_QMARK_(state, from);
if (or__32239__auto__538 != null && or__32239__auto__538 !== false) {
return or__32239__auto__538;} else {
return n.within_program_QMARK_(state, from);}} else {
return and__32262__auto__537;}
})();
if (test__60965__auto__536 != null && test__60965__auto__536 !== false) {
return space_changes(state, (from + current_indent529), (from + squint_core.count(text)));}
})();
let G__539540 = changes;
let G__539541 = ((space_changes535 != null && space_changes535 !== false) ? (into_arr(G__539540, space_changes535)) : (G__539540));
if (indentation_change531 != null && indentation_change531 !== false) {
return u.push_BANG_(G__539541, indentation_change531);} else {
return G__539541;}
})
;
var format_selection = (function (state) {
let context542 = make_indent_context(state);
return u.update_selected_lines(state, (function (p__543, changes, range) {
let map__544545 = p__543;
let line546 = map__544545;
let from547 = squint_core.get(map__544545, "from");
let text548 = squint_core.get(map__544545, "text");
let number549 = squint_core.get(map__544545, "number");
return format_line(state, context542, from547, text548, number549, changes, true);
}));
})
;
var format_all = (function (state) {
let context550 = make_indent_context(state);
return u.update_lines(state, (function (from, text, line_num) {
return format_line(state, context550, from, text, line_num, [], true);
}));
})
;
var format_transaction = (function (tr) {
let origin551 = u.get_user_event_annotation(tr);
let temp__31789__auto__552 = (function () {
 let test__60965__auto__553 = n.within_program_QMARK_(tr["startState"]);
if (test__60965__auto__553 != null && test__60965__auto__553 !== false) {
let G__554555 = origin551;
switch (G__554555) {case "input":
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
let test__60965__auto__557 = tr["changes"]["empty"];
if (test__60965__auto__557 != null && test__60965__auto__557 !== false) {
return null;} else {
let state558 = tr["state"];
let context559 = make_indent_context(state558);
return u.iter_changed_lines(tr, (function (line, changes) {
return format_line(state558, context559, line["from"], line["text"], line["number"], changes, true);
}));}}}
})();
let test__60965__auto__560 = squint_core.nil_QMARK_(temp__31789__auto__552);
if (test__60965__auto__560 != null && test__60965__auto__560 !== false) {
return tr;} else {
let changes561 = temp__31789__auto__552;
return tr["startState"].update(squint_core.assoc_BANG_(changes561, "filter", false));}
})
;
var format = (function (state) {
let test__60965__auto__562 = u.something_selected_QMARK_(state);
if (test__60965__auto__562 != null && test__60965__auto__562 !== false) {
return state.update(format_selection(state));} else {
return format_all(state);}
})
;
var prefix_all = (function (prefix, state) {
return u.update_lines(state, (function (from, _, _563) {
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
