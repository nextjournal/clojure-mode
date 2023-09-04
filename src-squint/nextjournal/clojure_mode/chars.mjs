import * as squint_core from 'squint-cljs/core.js';
import * as text from '@codemirror/text';
var pair_lookup = (function (char_pairs, char$) {
let end1 = squint_core.count(char_pairs);
let ch2 = text.codePointAt(char, 0);
let i3 = 0;
while(true){
if ((i3 >= end1)) {
return text.fromCodePoint(((ch2 < 128)) ? (ch2) : ((ch2 + 1)));} else {
if ((ch2 == char_pairs.charCodeAt(i3))) {
return char_pairs.charAt((i3 + 1));} else {
if ("else") {
let G__4 = (i3 + 2);
i3 = G__4;
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
let next5 = doc.sliceString(pos, (pos + 2));
return next5.slice(0, text.codePointSize(text.codePointAt(next5, 0)));
})
;
var prev_char = (function (doc, pos) {
if (pos_int_QMARK_(pos)) {
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
