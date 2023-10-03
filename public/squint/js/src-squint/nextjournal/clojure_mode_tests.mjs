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
let temp__25022__auto__1 = re.exec(s);
let test__26256__auto__2 = squint_core.nil_QMARK_(temp__25022__auto__1);
if (test__26256__auto__2 != null && test__26256__auto__2 !== false) {
return null;} else {
let matches3 = temp__25022__auto__1;
let match_str4 = matches3[0];
let match_vals5 = (function () {
 let test__26256__auto__6 = (matches3["length"] == 1);
if (test__26256__auto__6 != null && test__26256__auto__6 !== false) {
return match_str4;} else {
return squint_core.vec(matches3);}
})();
return squint_core.cons(match_vals5, new squint_core.LazySeq((function () {
let post_idx7 = (matches3["index"] + squint_core.max(1, match_str4["length"]));
let test__26256__auto__8 = (post_idx7 <= s["length"]);
if (test__26256__auto__8 != null && test__26256__auto__8 !== false) {
return re_seq_STAR_(re, subs(s, post_idx7));}
})));}
})
;
var re_seq = (function (re, s) {
let test__26256__auto__9 = string_QMARK_(s);
if (test__26256__auto__9 != null && test__26256__auto__9 !== false) {
return re_seq_STAR_(re, s);} else {
throw new TypeError("re-seq must match against a string.")}
})
;
var make_state = (function (extensions, doc) {
let vec__1013 = squint_core.reduce((function (p__14, match) {
let vec__1518 = p__14;
let doc19 = squint_core.nth(vec__1518, 0, null);
let ranges20 = squint_core.nth(vec__1518, 1, null);
let test__26256__auto__21 = (match === "|");
if (test__26256__auto__21 != null && test__26256__auto__21 !== false) {
return [doc19, squint_core.conj(ranges20, EditorSelection.cursor(squint_core.count(doc19)))];} else {
let test__26256__auto__22 = match.startsWith("<");
if (test__26256__auto__22 != null && test__26256__auto__22 !== false) {
return [squint_core.str(doc19, subs(match, 1, (squint_core.count(match) - 1))), squint_core.conj(ranges20, EditorSelection.range(squint_core.count(doc19), (squint_core.count(doc19) + (squint_core.count(match) - 2))))];} else {
if ("else" != null && "else" !== false) {
return [squint_core.str(doc19, match), ranges20];} else {
return null;}}}
}), ["", []], re_seq(/\||<[^>]*?>|[^<>|]+/, doc));
let doc23 = squint_core.nth(vec__1013, 0, null);
let ranges24 = squint_core.nth(vec__1013, 1, null);
return EditorState.create(({ "doc": doc23, "selection": (function () {
 let test__26256__auto__25 = squint_core.seq(ranges24);
if (test__26256__auto__25 != null && test__26256__auto__25 !== false) {
return EditorSelection.create(squint_core.into_array(ranges24));} else {
return undefined;}
})(), "extensions": (function () {
 let G__2627 = [EditorState["allowMultipleSelections"].of(true)];
if (extensions != null && extensions !== false) {
let G__2829 = G__2627;
G__2829.push(extensions);
return G__2829;} else {
return G__2627;}
})() }));
})
;
var state_str = (function (state) {
let doc30 = squint_core.str(state["doc"]);
return squint_core.reduce((function (doc, p__31) {
let map__3233 = p__31;
let empty34 = squint_core.get(map__3233, "empty");
let from35 = squint_core.get(map__3233, "from");
let to36 = squint_core.get(map__3233, "to");
if (empty34 != null && empty34 !== false) {
return squint_core.str(subs(doc, 0, from35), "|", subs(doc, from35));} else {
return squint_core.str(subs(doc, 0, from35), "<", subs(doc, from35, to36), ">", subs(doc, to36));}
}), doc30, squint_core.reverse(state["selection"]["ranges"]));
})
;
var apply_f_STAR_ = (function (extensions, cmd, doc) {
let state37 = make_state(extensions, doc);
let tr38 = cmd(state37);
return state_str(((tr38 != null && tr38 !== false) ? (tr38["state"]) : (state37)));
})
;
var apply_cmd_STAR_ = (function (extensions, cmd, doc) {
let state39 = make_state(extensions, doc);
let _BANG_tr40 = squint_core.atom(null);
let _41 = cmd(({ "state": state39, "dispatch": (function (_PERCENT_1) {
return squint_core.reset_BANG_(_BANG_tr40, _PERCENT_1);
}) }));
let tr42 = squint_core.deref(_BANG_tr40);
return state_str(squint_core.get(tr42, "state"));
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
for (let [input, expected] of squint_core.partition(2, [" ()", "()", "(\n)", "(\n )", "(b\n)", "(b\n  )", "(0\n)", "(0\n )", "(:a\n)", "(:a\n )", "(a\n\nb)", "(a\n  \n  b)"])) {
[true, assert.equal(apply_f(format.format, squint_core.str("<", input, ">")), squint_core.str("<", expected, ">"))]
};
null;

export { extensions, subs, string_QMARK_, apply_cmd, state_str, apply_f_STAR_, re_seq_STAR_, apply_f, re_seq, apply_cmd_STAR_, make_state }
