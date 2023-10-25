import * as squint_core from 'squint-cljs/core.js';
import * as text from '@codemirror/text';
var pair_lookup = (function (char_pairs, char$) {
let end1 = squint_core.count(char_pairs);
let ch2 = text.codePointAt(char, 0);
let i3 = 0;
while(true){
let test__78824__auto__4 = (i3 >= end1);
if (test__78824__auto__4 != null && test__78824__auto__4 !== false) {
return text.fromCodePoint((function () {
 let test__78824__auto__5 = (ch2 < 128);
if (test__78824__auto__5 != null && test__78824__auto__5 !== false) {
return ch2;} else {
return (ch2 + 1);}
})());} else {
let test__78824__auto__6 = (ch2 == char_pairs.charCodeAt(i3));
if (test__78824__auto__6 != null && test__78824__auto__6 !== false) {
return char_pairs.charAt((i3 + 1));} else {
let test__78824__auto__7 = "else";
if (test__78824__auto__7 != null && test__78824__auto__7 !== false) {
let G__8 = (i3 + 2);
i3 = G__8;
continue;
} else {
return null;}}};break;
}

});
var backspace_QMARK_ = (function (code) {
return (code == 8);
});
var next_char = (function (doc, pos) {
let next1 = doc.sliceString(pos, (pos + 2));
return next1.slice(0, text.codePointSize(text.codePointAt(next1, 0)));
});
var prev_char = (function (doc, pos) {
let test__78824__auto__1 = pos_int_QMARK_(pos);
if (test__78824__auto__1 != null && test__78824__auto__1 !== false) {
return doc.sliceString((pos - 1), pos);} else {
return "";}
});
var whitespace_QMARK_ = squint_core.set(squint_core.map((function (_PERCENT_1) {
return _PERCENT_1.charCodeAt(0);
}), [" ", "n", "r", ","]));
null;

export { pair_lookup, backspace_QMARK_, next_char, prev_char, whitespace_QMARK_ }
