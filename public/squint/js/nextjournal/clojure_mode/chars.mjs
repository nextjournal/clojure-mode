import * as squint_core from 'squint-cljs/core.js';
import * as text from '@codemirror/text';
var pair_lookup = (function (char_pairs, char$) {
let end306 = squint_core.count(char_pairs);
let ch307 = text.codePointAt(char, 0);
let i308 = 0;
while(true){
let test__60965__auto__309 = (i308 >= end306);
if (test__60965__auto__309 != null && test__60965__auto__309 !== false) {
return text.fromCodePoint((function () {
 let test__60965__auto__310 = (ch307 < 128);
if (test__60965__auto__310 != null && test__60965__auto__310 !== false) {
return ch307;} else {
return (ch307 + 1);}
})());} else {
let test__60965__auto__311 = (ch307 == char_pairs.charCodeAt(i308));
if (test__60965__auto__311 != null && test__60965__auto__311 !== false) {
return char_pairs.charAt((i308 + 1));} else {
let test__60965__auto__312 = "else";
if (test__60965__auto__312 != null && test__60965__auto__312 !== false) {
let G__313 = (i308 + 2);
i308 = G__313;
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
let next314 = doc.sliceString(pos, (pos + 2));
return next314.slice(0, text.codePointSize(text.codePointAt(next314, 0)));
})
;
var prev_char = (function (doc, pos) {
let test__60965__auto__315 = pos_int_QMARK_(pos);
if (test__60965__auto__315 != null && test__60965__auto__315 !== false) {
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
