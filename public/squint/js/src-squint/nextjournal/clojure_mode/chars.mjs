import * as squint_core from 'squint-cljs/core.js';
import * as text from '@codemirror/text';
var pair_lookup = (function (char_pairs, char$) {
let end260 = squint_core.count(char_pairs);
let ch261 = text.codePointAt(char, 0);
let i262 = 0;
while(true){
let test__26256__auto__263 = (i262 >= end260);
if (test__26256__auto__263 != null && test__26256__auto__263 !== false) {
return text.fromCodePoint((function () {
 let test__26256__auto__264 = (ch261 < 128);
if (test__26256__auto__264 != null && test__26256__auto__264 !== false) {
return ch261;} else {
return (ch261 + 1);}
})());} else {
let test__26256__auto__265 = (ch261 == char_pairs.charCodeAt(i262));
if (test__26256__auto__265 != null && test__26256__auto__265 !== false) {
return char_pairs.charAt((i262 + 1));} else {
if ("else" != null && "else" !== false) {
let G__266 = (i262 + 2);
i262 = G__266;
continue;
} else {
return null;}}};break;
}

})
;
var backspace_QMARK_ = (function (code) {
return (code == 8);
})
;
var next_char = (function (doc, pos) {
let next267 = doc.sliceString(pos, (pos + 2));
return next267.slice(0, text.codePointSize(text.codePointAt(next267, 0)));
})
;
var prev_char = (function (doc, pos) {
let test__26256__auto__268 = pos_int_QMARK_(pos);
if (test__26256__auto__268 != null && test__26256__auto__268 !== false) {
return doc.sliceString((pos - 1), pos);} else {
return "";}
})
;
var whitespace_QMARK_ = squint_core.set(squint_core.map((function (_PERCENT_1) {
return _PERCENT_1.charCodeAt(0);
}), [" ", "n", "r", ","]))
;
null;

export { pair_lookup, backspace_QMARK_, next_char, prev_char, whitespace_QMARK_ }
