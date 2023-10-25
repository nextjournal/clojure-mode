import * as squint_core from 'squint-cljs/core.js';
import { StateField } from '@codemirror/state';
import { EditorView, Decoration } from '@codemirror/view';
import * as n from './../node.mjs';
import * as u from './../util.mjs';
var base_theme = EditorView.baseTheme(({ "$matchingBracket": ({ "color": "#0b0" }), "$nonmatchingBracket": ({ "color": "#a22" }) }));
var matching_mark = Decoration.mark(squint_core.js_obj("class", "cm-matchingBracket"));
var nonmatching_mark = Decoration.mark(squint_core.js_obj("class", "cm-nonmatchingBracket"));
var mark_node = (function (node, mark) {
return mark.range(n.start(node), n.end(node));
});
var state = StateField.define(({ "create": squint_core.constantly(Decoration["none"]), "update": (function (deco, p__410) {
let map__12 = p__410;
let tr3 = map__12;
let state4 = squint_core.get(map__12, "state");
let docChanged5 = squint_core.get(map__12, "docChanged");
let selection6 = squint_core.get(map__12, "selection");
let test__78824__auto__7 = (function () {
 let or__28221__auto__8 = docChanged5;
if (or__28221__auto__8 != null && or__28221__auto__8 !== false) {
return or__28221__auto__8;} else {
return selection6;}
})();
if (test__78824__auto__7 != null && test__78824__auto__7 !== false) {
let decos9 = squint_core.reduce((function (out, p__411) {
let map__1011 = p__411;
let head12 = squint_core.get(map__1011, "head");
let empty13 = squint_core.get(map__1011, "empty");
let or__28221__auto__14 = (function () {
 let temp__27767__auto__15 = (function () {
 let and__28236__auto__16 = empty13;
if (and__28236__auto__16 != null && and__28236__auto__16 !== false) {
return squint_core.first(squint_core.filter(squint_core.some_fn(n.start_edge_QMARK_, n.end_edge_QMARK_), [n.tree(state4, head12, -1), n.tree(state4, head12, 1)]));} else {
return and__28236__auto__16;}
})();
if (temp__27767__auto__15 != null && temp__27767__auto__15 !== false) {
let bracket17 = temp__27767__auto__15;
let temp__27663__auto__18 = (function () {
 let test__78824__auto__19 = (function () {
 let and__28236__auto__20 = n.start_edge_QMARK_(bracket17);
if (and__28236__auto__20 != null && and__28236__auto__20 !== false) {
return (n.start(bracket17) === n.start(n.up(bracket17)));} else {
return and__28236__auto__20;}
})();
if (test__78824__auto__19 != null && test__78824__auto__19 !== false) {
return u.guard(n.down_last(n.up(bracket17)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.closed_by(bracket17));
}));} else {
let test__78824__auto__21 = (function () {
 let and__28236__auto__22 = n.end_edge_QMARK_(bracket17);
if (and__28236__auto__22 != null && and__28236__auto__22 !== false) {
return (n.end(bracket17) === n.end(n.up(bracket17)));} else {
return and__28236__auto__22;}
})();
if (test__78824__auto__21 != null && test__78824__auto__21 !== false) {
return u.guard(n.down(n.up(bracket17)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.opened_by(bracket17));
}));} else {
return null;}}
})();
if (temp__27663__auto__18 != null && temp__27663__auto__18 !== false) {
let other_bracket23 = temp__27663__auto__18;
return squint_core.conj(out, mark_node(bracket17, matching_mark), mark_node(other_bracket23, matching_mark));} else {
return squint_core.conj(out, mark_node(bracket17, nonmatching_mark));}}
})();
if (or__28221__auto__14 != null && or__28221__auto__14 !== false) {
return or__28221__auto__14;} else {
let or__28221__auto__24 = (function () {
 let temp__27767__auto__25 = (function () {
 let and__28236__auto__26 = !n.closest(n.tree(state4, head12), n.string_QMARK_);
if (and__28236__auto__26 != null && and__28236__auto__26 !== false) {
return squint_core.contains_QMARK_(new Set(["]", ")", "}"]), tr3["state"]["doc"].slice(head12, (head12 + 1)).toString());} else {
return and__28236__auto__26;}
})();
if (temp__27767__auto__25 != null && temp__27767__auto__25 !== false) {
let _unparsed_bracket27 = temp__27767__auto__25;
return squint_core.conj(out, mark_node(n.from_to(head12, (head12 + 1)), nonmatching_mark));}
})();
if (or__28221__auto__24 != null && or__28221__auto__24 !== false) {
return or__28221__auto__24;} else {
return out;}}
}), [], tr3["state"]["selection"]["ranges"]);
return Decoration.set(squint_core.into_array(decos9), true);} else {
return deco;}
}) }));
var extension = (function () {
return [base_theme, state, EditorView["decorations"].from(state)];
});

export { base_theme, matching_mark, nonmatching_mark, mark_node, state, extension }
