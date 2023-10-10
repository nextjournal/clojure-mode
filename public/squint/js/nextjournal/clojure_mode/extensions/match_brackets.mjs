import * as squint_core from 'squint-cljs/core.js';
import * as n from '../node.mjs';
import * as u from '../util.mjs';
import { StateField } from '@codemirror/state';
import { EditorView, Decoration } from '@codemirror/view';
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
var state = StateField.define(({ "create": squint_core.constantly(Decoration["none"]), "update": (function (deco, p__316) {
let map__317318 = p__316;
let tr319 = map__317318;
let state320 = squint_core.get(map__317318, "state");
let docChanged321 = squint_core.get(map__317318, "docChanged");
let selection322 = squint_core.get(map__317318, "selection");
let test__60965__auto__323 = (function () {
 let or__32239__auto__324 = docChanged321;
if (or__32239__auto__324 != null && or__32239__auto__324 !== false) {
return or__32239__auto__324;} else {
return selection322;}
})();
if (test__60965__auto__323 != null && test__60965__auto__323 !== false) {
let decos325 = squint_core.reduce((function (out, p__326) {
let map__327328 = p__326;
let head329 = squint_core.get(map__327328, "head");
let empty330 = squint_core.get(map__327328, "empty");
let or__32239__auto__331 = (function () {
 let temp__31807__auto__332 = (function () {
 let and__32262__auto__333 = empty330;
if (and__32262__auto__333 != null && and__32262__auto__333 !== false) {
return squint_core.first(squint_core.filter(squint_core.some_fn(n.start_edge_QMARK_, n.end_edge_QMARK_), [n.tree(state320, head329, -1), n.tree(state320, head329, 1)]));} else {
return and__32262__auto__333;}
})();
if (temp__31807__auto__332 != null && temp__31807__auto__332 !== false) {
let bracket334 = temp__31807__auto__332;
let temp__31754__auto__335 = (function () {
 let test__60965__auto__336 = (function () {
 let and__32262__auto__337 = n.start_edge_QMARK_(bracket334);
if (and__32262__auto__337 != null && and__32262__auto__337 !== false) {
return (n.start(bracket334) === n.start(n.up(bracket334)));} else {
return and__32262__auto__337;}
})();
if (test__60965__auto__336 != null && test__60965__auto__336 !== false) {
return u.guard(n.down_last(n.up(bracket334)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.closed_by(bracket334));
}));} else {
let test__60965__auto__338 = (function () {
 let and__32262__auto__339 = n.end_edge_QMARK_(bracket334);
if (and__32262__auto__339 != null && and__32262__auto__339 !== false) {
return (n.end(bracket334) === n.end(n.up(bracket334)));} else {
return and__32262__auto__339;}
})();
if (test__60965__auto__338 != null && test__60965__auto__338 !== false) {
return u.guard(n.down(n.up(bracket334)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.opened_by(bracket334));
}));} else {
return null;}}
})();
if (temp__31754__auto__335 != null && temp__31754__auto__335 !== false) {
let other_bracket340 = temp__31754__auto__335;
return squint_core.conj(out, mark_node(bracket334, matching_mark), mark_node(other_bracket340, matching_mark));} else {
return squint_core.conj(out, mark_node(bracket334, nonmatching_mark));}}
})();
if (or__32239__auto__331 != null && or__32239__auto__331 !== false) {
return or__32239__auto__331;} else {
let or__32239__auto__341 = (function () {
 let temp__31807__auto__342 = (function () {
 let and__32262__auto__343 = !n.closest(n.tree(state320, head329), n.string_QMARK_);
if (and__32262__auto__343 != null && and__32262__auto__343 !== false) {
return squint_core.contains_QMARK_(new Set(["]", ")", "}"]), tr319["state"]["doc"].slice(head329, (head329 + 1)).toString());} else {
return and__32262__auto__343;}
})();
if (temp__31807__auto__342 != null && temp__31807__auto__342 !== false) {
let _unparsed_bracket344 = temp__31807__auto__342;
return squint_core.conj(out, mark_node(n.from_to(head329, (head329 + 1)), nonmatching_mark));}
})();
if (or__32239__auto__341 != null && or__32239__auto__341 !== false) {
return or__32239__auto__341;} else {
return out;}}
}), [], tr319["state"]["selection"]["ranges"]);
return Decoration.set(squint_core.into_array(decos325), true);} else {
return deco;}
}) }))
;
var extension = (function () {
return [base_theme, state, EditorView["decorations"].from(state)];
})
;
squint_core.prn("match-brackets-loaded");

export { base_theme, matching_mark, nonmatching_mark, mark_node, state, extension }
