import * as squint_core from 'squint-cljs/core.js';
import * as cm_clojure from './clojure_mode.mjs';
import * as commands from './clojure_mode/commands.mjs';
import * as close_brackets from './clojure_mode/extensions/close_brackets.mjs';
import * as format from './clojure_mode/extensions/formatting.mjs';
import * as cm_state from '@codemirror/state';
import { EditorState, EditorSelection } from '@codemirror/state';
import * as assert from 'assert';
import * as str from 'squint-cljs/string.js';
var string_QMARK_ = (function (x) {
return ("string" === typeof x);
})
;
var subs = (function (s, start, end) {
return s.substring(start, end);
})
;
var re_seq_STAR_ = (function (re, s) {
let temp__47623__auto__1 = re.exec(s);
if (squint_core.nil_QMARK_(temp__47623__auto__1)) {
return null;} else {
let matches2 = temp__47623__auto__1;
let match_str3 = matches2[0];
let match_vals4 = (((matches2["length"] == 1)) ? (match_str3) : (squint_core.vec(matches2)));
return squint_core.cons(match_vals4, new squint_core.LazySeq((function () {
let post_idx5 = (matches2["index"] + squint_core.max(1, match_str3["length"]));
if ((post_idx5 <= s["length"])) {
return re_seq_STAR_(re, subs(s, post_idx5));}
})));}
})
;
var re_seq = (function (re, s) {
if (string_QMARK_(s)) {
return re_seq_STAR_(re, s);} else {
throw new TypeError("re-seq must match against a string.")}
})
;
var make_state = (function (extensions, doc) {
let vec__69 = squint_core.reduce((function (p__10, match) {
let vec__1114 = p__10;
let doc15 = squint_core.nth(vec__1114, 0, null);
let ranges16 = squint_core.nth(vec__1114, 1, null);
if ((match === "|")) {
return [doc15, squint_core.conj(ranges16, EditorSelection.cursor(squint_core.count(doc15)))];} else {
if (match.startsWith("<")) {
return [squint_core.str(doc15, subs(match, 1, (squint_core.count(match) - 1))), squint_core.conj(ranges16, EditorSelection.range(squint_core.count(doc15), (squint_core.count(doc15) + (squint_core.count(match) - 2))))];} else {
if ("else") {
return [squint_core.str(doc15, match), ranges16];} else {
return null;}}}
}), ["", []], re_seq(/\||<[^>]*?>|[^<>|]+/, doc));
let doc17 = squint_core.nth(vec__69, 0, null);
let ranges18 = squint_core.nth(vec__69, 1, null);
return EditorState.create(({ "doc": doc17, "selection": ((squint_core.seq(ranges18)) ? (EditorSelection.create(squint_core.into_array(ranges18))) : (undefined)), "extensions": (function () {
 let G__1920 = [EditorState["allowMultipleSelections"].of(true)];
if (extensions) {
let G__2122 = G__1920;
G__2122.push(extensions);
return G__2122;} else {
return G__1920;}
})() }));
})
;
var state_str = (function (state) {
let doc23 = squint_core.str(state["doc"]);
return squint_core.reduce((function (doc, p__24) {
let map__2526 = p__24;
let empty27 = squint_core.get(map__2526, "empty");
let from28 = squint_core.get(map__2526, "from");
let to29 = squint_core.get(map__2526, "to");
if (empty27) {
return squint_core.str(subs(doc, 0, from28), "|", subs(doc, from28));} else {
return squint_core.str(subs(doc, 0, from28), "<", subs(doc, from28, to29), ">", subs(doc, to29));}
}), doc23, squint_core.reverse(state["selection"]["ranges"]));
})
;
var apply_f_STAR_ = (function (extensions, cmd, doc) {
let state30 = make_state(extensions, doc);
let tr31 = cmd(state30);
return state_str(((tr31) ? (tr31["state"]) : (state30)));
})
;
var apply_cmd_STAR_ = (function (extensions, cmd, doc) {
let state32 = make_state(extensions, doc);
let _BANG_tr33 = squint_core.atom(null);
let _34 = cmd(({ "state": state32, "dispatch": (function (_PERCENT_1) {
return squint_core.reset_BANG_(_BANG_tr33, _PERCENT_1);
}) }));
let tr35 = squint_core.deref(_BANG_tr33);
return state_str(squint_core.get(tr35, "state"));
})
;
var extensions = cm_clojure.default_extensions
;
var apply_f = squint_core.partial(apply_f_STAR_, extensions)
;
var apply_cmd = squint_core.partial(apply_cmd_STAR_, extensions)
;
for (let [input, dir, expected] of [["|()", 1, "()|"], ["()|", -1, "|()"], ["a|b", 1, "ab|"], ["a|b", -1, "|ab"], ["| ab", 1, " ab|"], ["ab |", -1, "|ab "], ["(|)", 1, "()|"], ["(|)", -1, "|()"], ["a|\nb", 1, "a\nb|"]]) {
[true, assert.equal(apply_f(commands.nav(dir), input), expected)]
};
null;
for (let [input, dir, expected] of [["|()", 1, "<()>"], ["()|", -1, "<()>"], ["a|b", 1, "a<b>"], ["(|)", 1, "<()>"], ["\"a|b\"", 1, "\"a<b>\""], ["\"a<b>\"", 1, "<\"ab\">"], ["a|b", -1, "<a>b"], ["| ab", 1, "< ab>"], ["ab |", -1, "<ab >"], ["(|)", 1, "<()>"], ["(|)", -1, "<()>"], ["a|\nb", 1, "a<\nb>"]]) {
[true, assert.equal(apply_f(commands.nav_select(dir), input), expected)]
};
null;
for (let [input, insert, expected] of squint_core.partition(3, ["|", "(", "(|)", "(|", "(", "((|)", "|(", "(", "(|)(", "|)", "(", "(|))", "#|", "(", "#(|)", "\"|\"", "(", "\"(|\""])) {
[true, assert.equal(apply_f((function (_PERCENT_1) {
return close_brackets.handle_open(_PERCENT_1, insert);
}), input), expected)]
};
null;
for (let [input, bracket, expected] of squint_core.partition(3, ["|", ")", "|", "|(", ")", "|(", "|)", ")", ")|", "(|)", ")", "()|", "() |()", ")", "() ()|", "[(|)]", ")", "[()|]", "[()|]", ")", "[()]|", "([]| s)", ")", "([] s)|", "(|", ")", "()|", "[(|]", "}", "[(]|", "((|)", "]", "(()|", "((|)", ")", "(())|", "\"|\"", ")", "\")|\""])) {
[true, assert.equal(apply_f((function (_PERCENT_1) {
return close_brackets.handle_close(_PERCENT_1, bracket);
}), input), expected)]
};
null;
for (let [input, expected] of squint_core.partition(2, ["|", "\"|\"", "\"|\"", "\"\\\"|\""])) {
[true, assert.equal(apply_f((function (_PERCENT_1) {
return close_brackets.handle_open(_PERCENT_1, "\"");
}), input), expected)]
};
null;
for (let [input, expected] of squint_core.partition(2, ["|", "|", "(|", "|", "()|", "(|)", "#|()", "|()", "[[]]|", "[[]|]", "(| )", "|", "(| a)", "(| a)", "@|", "|", "@|x", "|x", "\"|\"", "|", "\"\"|", "\"|\"", "\"| \"", "\"| \"", ":x  :a |", ":x  :a|", "\"[|]\"", "\"|]\""])) {
[true, assert.equal(apply_f(close_brackets.handle_backspace, input), expected)]
};
null;

export { extensions, subs, string_QMARK_, apply_cmd, state_str, apply_f_STAR_, re_seq_STAR_, apply_f, re_seq, apply_cmd_STAR_, make_state }
