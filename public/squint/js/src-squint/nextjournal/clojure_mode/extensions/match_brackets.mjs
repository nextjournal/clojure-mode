import * as squint_core from 'squint-cljs/core.js';
import { StateField } from '@codemirror/state';
import { EditorView, Decoration } from '@codemirror/view';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
var base_theme = EditorView.baseTheme(({ "$matchingBracket": ({ "color": "#0b0" }), "$nonmatchingBracket": ({ "color": "#a22" }) }))
;
var matching_mark = Decoration.mark(({ "class": "cm-matchingBracket" }))
;
var nonmatching_mark = Decoration.mark(({ "class": "cm-nonmatchingBracket" }))
;
var mark_node = (function (node, mark) {
return mark.range(n.start(node), n.end(node));
})
;
var state = StateField.define(({ "create": squint_core.constantly(Decoration["none"]), "update": (function (deco, p__1) {
let map__23 = p__1;
let tr4 = map__23;
let state5 = squint_core.get(map__23, "state");
let docChanged6 = squint_core.get(map__23, "docChanged");
let selection7 = squint_core.get(map__23, "selection");
if ((docChanged6 || selection7)) {
let decos8 = squint_core.reduce((function (out, p__9) {
let map__1011 = p__9;
let head12 = squint_core.get(map__1011, "head");
let empty13 = squint_core.get(map__1011, "empty");
return ((function () {
 let temp__25187__auto__14 = (empty13 && squint_core.first(squint_core.filter(some_fn(n.start_edge_QMARK_, n.end_edge_QMARK_), [n.tree(state5, head12, -1), n.tree(state5, head12, 1)])));
if (temp__25187__auto__14) {
let bracket15 = temp__25187__auto__14;
let temp__24970__auto__16 = ((n.start_edge_QMARK_(bracket15) && (n.start(bracket15) === n.start(n.up(bracket15))))) ? (u.guard(n.down_last(n.up(bracket15)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.closed_by(bracket15));
}))) : (((n.end_edge_QMARK_(bracket15) && (n.end(bracket15) === n.end(n.up(bracket15))))) ? (u.guard(n.down(n.up(bracket15)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.opened_by(bracket15));
}))) : (null));
if (temp__24970__auto__16) {
let other_bracket17 = temp__24970__auto__16;
return squint_core.conj(out, mark_node(bracket15, matching_mark), mark_node(other_bracket17, matching_mark));} else {
return squint_core.conj(out, mark_node(bracket15, nonmatching_mark));}}
})() || (function () {
 let temp__25187__auto__18 = (!n.closest(n.tree(state5, head12), n.string_QMARK_) && new Set(["]", ")", "}"])(tr4["state"]["doc"].slice(head12, (head12 + 1)).toString()));
if (temp__25187__auto__18) {
let _unparsed_bracket19 = temp__25187__auto__18;
return squint_core.conj(out, mark_node(n.from_to(head12, (head12 + 1)), nonmatching_mark));}
})() || out);
}), [], tr4["state"]["selection"]["ranges"]);
return Decoration.set(into_array(decos8), true);} else {
return deco;}
}) }))
;
var extension = (function () {
return [base_theme, state, EditorView["decorations"].from(state)];
})
;
squint_core.prn("match-brackets-loaded");

export { base_theme, matching_mark, nonmatching_mark, mark_node, state, extension }
