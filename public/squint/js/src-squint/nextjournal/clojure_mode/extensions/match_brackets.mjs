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
var state = StateField.define(({ "create": squint_core.constantly(Decoration["none"]), "update": (function (deco, p__269) {
let map__270271 = p__269;
let tr272 = map__270271;
let state273 = squint_core.get(map__270271, "state");
let docChanged274 = squint_core.get(map__270271, "docChanged");
let selection275 = squint_core.get(map__270271, "selection");
let test__26256__auto__276 = (function () {
 let or__25460__auto__277 = docChanged274;
if (or__25460__auto__277 != null && or__25460__auto__277 !== false) {
return or__25460__auto__277;} else {
return selection275;}
})();
if (test__26256__auto__276 != null && test__26256__auto__276 !== false) {
let decos278 = squint_core.reduce((function (out, p__279) {
let map__280281 = p__279;
let head282 = squint_core.get(map__280281, "head");
let empty283 = squint_core.get(map__280281, "empty");
let or__25460__auto__284 = (function () {
 let temp__24938__auto__285 = (function () {
 let and__25509__auto__286 = empty283;
if (and__25509__auto__286 != null && and__25509__auto__286 !== false) {
return squint_core.first(squint_core.filter(squint_core.some_fn(n.start_edge_QMARK_, n.end_edge_QMARK_), [n.tree(state273, head282, -1), n.tree(state273, head282, 1)]));} else {
return and__25509__auto__286;}
})();
if (temp__24938__auto__285 != null && temp__24938__auto__285 !== false) {
let bracket287 = temp__24938__auto__285;
let temp__24803__auto__288 = (function () {
 let test__26256__auto__289 = (function () {
 let and__25509__auto__290 = n.start_edge_QMARK_(bracket287);
if (and__25509__auto__290 != null && and__25509__auto__290 !== false) {
return (n.start(bracket287) === n.start(n.up(bracket287)));} else {
return and__25509__auto__290;}
})();
if (test__26256__auto__289 != null && test__26256__auto__289 !== false) {
return u.guard(n.down_last(n.up(bracket287)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.closed_by(bracket287));
}));} else {
let test__26256__auto__291 = (function () {
 let and__25509__auto__292 = n.end_edge_QMARK_(bracket287);
if (and__25509__auto__292 != null && and__25509__auto__292 !== false) {
return (n.end(bracket287) === n.end(n.up(bracket287)));} else {
return and__25509__auto__292;}
})();
if (test__26256__auto__291 != null && test__26256__auto__291 !== false) {
return u.guard(n.down(n.up(bracket287)), (function (_PERCENT_1) {
return (n.name(_PERCENT_1) === n.opened_by(bracket287));
}));} else {
return null;}}
})();
if (temp__24803__auto__288 != null && temp__24803__auto__288 !== false) {
let other_bracket293 = temp__24803__auto__288;
return squint_core.conj(out, mark_node(bracket287, matching_mark), mark_node(other_bracket293, matching_mark));} else {
return squint_core.conj(out, mark_node(bracket287, nonmatching_mark));}}
})();
if (or__25460__auto__284 != null && or__25460__auto__284 !== false) {
return or__25460__auto__284;} else {
let or__25460__auto__294 = (function () {
 let temp__24938__auto__295 = (function () {
 let and__25509__auto__296 = !n.closest(n.tree(state273, head282), n.string_QMARK_);
if (and__25509__auto__296 != null && and__25509__auto__296 !== false) {
return squint_core.contains_QMARK_(new Set(["]", ")", "}"]), tr272["state"]["doc"].slice(head282, (head282 + 1)).toString());} else {
return and__25509__auto__296;}
})();
if (temp__24938__auto__295 != null && temp__24938__auto__295 !== false) {
let _unparsed_bracket297 = temp__24938__auto__295;
return squint_core.conj(out, mark_node(n.from_to(head282, (head282 + 1)), nonmatching_mark));}
})();
if (or__25460__auto__294 != null && or__25460__auto__294 !== false) {
return or__25460__auto__294;} else {
return out;}}
}), [], tr272["state"]["selection"]["ranges"]);
return Decoration.set(squint_core.into_array(decos278), true);} else {
return deco;}
}) }))
;
var extension = (function () {
return [base_theme, state, EditorView["decorations"].from(state)];
})
;
squint_core.prn("match-brackets-loaded");

export { base_theme, matching_mark, nonmatching_mark, mark_node, state, extension }
