import * as squint_core from 'squint-cljs/core.js';
import * as cm_clojure from './clojure_mode.mjs';
import * as commands from './clojure_mode/commands.mjs';
import * as close_brackets from './clojure_mode/extensions/close_brackets.mjs';
import * as format from './clojure_mode/extensions/formatting.mjs';
import * as cm_state from '@codemirror/state';
import { EditorState, EditorSelection } from '@codemirror/state';
import * as assert from 'assert';
var make_state = (function (extensions, doc) {
let vec__14 = squint_core.reduce((function (p__281, match) {
let vec__58 = p__281;
let doc9 = squint_core.nth(vec__58, 0, null);
let ranges10 = squint_core.nth(vec__58, 1, null);
let test__27847__auto__11 = (match === "|");
if (test__27847__auto__11 != null && test__27847__auto__11 !== false) {
return [doc9, squint_core.conj(ranges10, EditorSelection.cursor(squint_core.count(doc9)))];} else {
let test__27847__auto__12 = match.startsWith("<");
if (test__27847__auto__12 != null && test__27847__auto__12 !== false) {
return [squint_core.str(doc9, squint_core.subs(match, 1, (squint_core.count(match) - 1))), squint_core.conj(ranges10, EditorSelection.range(squint_core.count(doc9), (squint_core.count(doc9) + (squint_core.count(match) - 2))))];} else {
let test__27847__auto__13 = "else";
if (test__27847__auto__13 != null && test__27847__auto__13 !== false) {
return [squint_core.str(doc9, match), ranges10];} else {
return null;}}}
}), ["", []], squint_core.re_seq(/\||<[^>]*?>|[^<>|]+/, doc));
let doc14 = squint_core.nth(vec__14, 0, null);
let ranges15 = squint_core.nth(vec__14, 1, null);
return EditorState.create(({ "doc": doc14, "selection": (function () {
 let test__27847__auto__16 = squint_core.seq(ranges15);
if (test__27847__auto__16 != null && test__27847__auto__16 !== false) {
return EditorSelection.create(squint_core.into_array(ranges15));} else {
return undefined;}
})(), "extensions": (function () {
 let G__28217 = [EditorState["allowMultipleSelections"].of(true)];
if (extensions != null && extensions !== false) {
let G__28318 = G__28217;
G__28318.push(extensions);
return G__28318;} else {
return G__28217;}
})() }));
});
var state_str = (function (state) {
let doc1 = squint_core.str(state["doc"]);
return squint_core.reduce((function (doc, p__284) {
let map__23 = p__284;
let empty4 = squint_core.get(map__23, "empty");
let from5 = squint_core.get(map__23, "from");
let to6 = squint_core.get(map__23, "to");
if (empty4 != null && empty4 !== false) {
return squint_core.str(squint_core.subs(doc, 0, from5), "|", squint_core.subs(doc, from5));} else {
return squint_core.str(squint_core.subs(doc, 0, from5), "<", squint_core.subs(doc, from5, to6), ">", squint_core.subs(doc, to6));}
}), doc1, squint_core.reverse(state["selection"]["ranges"]));
});
var apply_f_STAR_ = (function (extensions, cmd, doc) {
let state1 = make_state(extensions, doc);
let tr2 = cmd(state1);
return state_str(((tr2 != null && tr2 !== false) ? (tr2["state"]) : (state1)));
});
var apply_cmd_STAR_ = (function (extensions, cmd, doc) {
let state1 = make_state(extensions, doc);
let _BANG_tr2 = squint_core.atom(null);
let _3 = cmd(({ "state": state1, "dispatch": (function (_PERCENT_1) {
return squint_core.reset_BANG_(_BANG_tr2, _PERCENT_1);
}) }));
let tr4 = squint_core.deref(_BANG_tr2);
return state_str(squint_core.get(tr4, "state"));
});
var extensions = cm_clojure.default_extensions;
var apply_f = squint_core.partial(apply_f_STAR_, extensions);
var apply_cmd = squint_core.partial(apply_cmd_STAR_, extensions);
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
for (let [input, dir, expected] of squint_core.partition(3, ["|()", 1, "()|", "()|", -1, "|()", "a|b", 1, "ab|", "a|b", -1, "|ab", "| ab", 1, " ab|", "ab |", -1, "|ab ", "(|)", 1, "()|", "(|)", -1, "|()", "a|\nb", 1, "a\nb|"])) {
[true, assert.equal(apply_f(commands.nav(dir), input), expected)]
};
null;
for (let [input, dir, expected] of squint_core.partition(3, ["|()", 1, "<()>", "()|", -1, "<()>", "a|b", 1, "a<b>", "(|)", 1, "<()>", "\"a|b\"", 1, "\"a<b>\"", "\"a<b>\"", 1, "<\"ab\">", "a|b", -1, "<a>b", "| ab", 1, "< ab>", "ab |", -1, "<ab >", "(|)", 1, "<()>", "(|)", -1, "<()>", "a|\nb", 1, "a<\nb>"])) {
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
null;
null;
assert.equal(apply_f((function (_PERCENT_1) {
return close_brackets.handle_open(_PERCENT_1, "\"");
}), "|"), "\"|\"");
assert.equal(apply_f(close_brackets.handle_backspace, "|"), "|");
assert.equal(apply_f(format.format, squint_core.str("<", " ()", ">")), squint_core.str("<", "()", ">"));
assert.equal(apply_f(squint_core.partial(format.prefix_all, "a"), "z|z\nzz|\n|zz"), "az|z\nazz|\n|azz");
assert.equal(apply_f(format.indent_all, "| ()"), "|()");
assert.equal(apply_f(format.format_all, "a  :b  3 |"), "a :b 3|");
assert.equal(apply_f(format.format, "<a  b>\nc  d"), "<a b>\nc  d");
assert.equal(apply_cmd(commands.kill, "| ()\nx"), "|\nx");
assert.equal(apply_cmd(commands.unwrap, "(|)"), "|");
assert.equal(apply_f(commands.balance_ranges, "<a>"), "<a>");
assert.equal(apply_f(commands.slurp(1), "(|) a"), "(|a)");
assert.equal(apply_f(commands.barf(1), "(|a)"), "(|) a");
assert.equal(apply_cmd(commands.selection_grow, "(|)"), "<()>");
assert.equal(apply_cmd(commands.enter_and_indent, "(|)"), "(\n |)");

export { make_state, state_str, apply_f_STAR_, apply_cmd_STAR_, extensions, apply_f, apply_cmd }
