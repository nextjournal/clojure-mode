import * as squint_core from 'squint-cljs/core.js';
import * as cm_clojure from './clojure_mode.mjs';
import * as commands from './clojure_mode/commands.mjs';
import * as close_brackets from './clojure_mode/extensions/close_brackets.mjs';
import * as format from './clojure_mode/extensions/formatting.mjs';
import * as cm_state from '@codemirror/state';
import { EditorState, EditorSelection } from '@codemirror/state';
import * as assert from 'assert';
var make_state = (function (extensions, doc) {
let vec__5558 = squint_core.reduce((function (p__59, match) {
let vec__6063 = p__59;
let doc64 = squint_core.nth(vec__6063, 0, null);
let ranges65 = squint_core.nth(vec__6063, 1, null);
let test__27714__auto__66 = (match === "|");
if (test__27714__auto__66 != null && test__27714__auto__66 !== false) {
return [doc64, squint_core.conj(ranges65, EditorSelection.cursor(squint_core.count(doc64)))];} else {
let test__27714__auto__67 = match.startsWith("<");
if (test__27714__auto__67 != null && test__27714__auto__67 !== false) {
return [squint_core.str(doc64, squint_core.subs(match, 1, (squint_core.count(match) - 1))), squint_core.conj(ranges65, EditorSelection.range(squint_core.count(doc64), (squint_core.count(doc64) + (squint_core.count(match) - 2))))];} else {
let test__27714__auto__68 = "else";
if (test__27714__auto__68 != null && test__27714__auto__68 !== false) {
return [squint_core.str(doc64, match), ranges65];} else {
return null;}}}
}), ["", []], squint_core.re_seq(/\||<[^>]*?>|[^<>|]+/, doc));
let doc69 = squint_core.nth(vec__5558, 0, null);
let ranges70 = squint_core.nth(vec__5558, 1, null);
return EditorState.create(({ "doc": doc69, "selection": (function () {
 let test__27714__auto__71 = squint_core.seq(ranges70);
if (test__27714__auto__71 != null && test__27714__auto__71 !== false) {
return EditorSelection.create(squint_core.into_array(ranges70));} else {
return undefined;}
})(), "extensions": (function () {
 let G__7273 = [EditorState["allowMultipleSelections"].of(true)];
if (extensions != null && extensions !== false) {
let G__7475 = G__7273;
G__7475.push(extensions);
return G__7475;} else {
return G__7273;}
})() }));
})
;
var state_str = (function (state) {
let doc76 = squint_core.str(state["doc"]);
return squint_core.reduce((function (doc, p__77) {
let map__7879 = p__77;
let empty80 = squint_core.get(map__7879, "empty");
let from81 = squint_core.get(map__7879, "from");
let to82 = squint_core.get(map__7879, "to");
if (empty80 != null && empty80 !== false) {
return squint_core.str(squint_core.subs(doc, 0, from81), "|", squint_core.subs(doc, from81));} else {
return squint_core.str(squint_core.subs(doc, 0, from81), "<", squint_core.subs(doc, from81, to82), ">", squint_core.subs(doc, to82));}
}), doc76, squint_core.reverse(state["selection"]["ranges"]));
})
;
var apply_f_STAR_ = (function (extensions, cmd, doc) {
let state83 = make_state(extensions, doc);
let tr84 = cmd(state83);
return state_str(((tr84 != null && tr84 !== false) ? (tr84["state"]) : (state83)));
})
;
var apply_cmd_STAR_ = (function (extensions, cmd, doc) {
let state85 = make_state(extensions, doc);
let _BANG_tr86 = squint_core.atom(null);
let _87 = cmd(({ "state": state85, "dispatch": (function (_PERCENT_1) {
return squint_core.reset_BANG_(_BANG_tr86, _PERCENT_1);
}) }));
let tr88 = squint_core.deref(_BANG_tr86);
return state_str(squint_core.get(tr88, "state"));
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
