import * as squint_core from 'squint-cljs/core.js';
import { EditorSelection } from '@codemirror/state';
var range = (function () {
 let f721 = (function (var_args) {
let G__724725 = arguments["length"];
switch (G__724725) {case 2:
return f721.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 1:
return f721.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f721["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
return EditorSelection.range(from, to);
});
f721["cljs$core$IFn$_invoke$arity$1"] = (function (range) {
return EditorSelection.range(range["from"], range["to"]);
});
f721["cljs$lang$maxFixedArity"] = 2;
return f721;
})()
;
var cursor = (function (from) {
return EditorSelection.cursor(from);
})
;
var create = (function (ranges, index) {
return EditorSelection.create(ranges, index);
})
;
var constrain = (function (state, from) {
return squint_core.min(squint_core.max(from, 0), state["doc"]["length"]);
})
;
var eq_QMARK_ = (function (sel1, sel2) {
return sel1.eq(sel2);
})
;

export { range, cursor, create, constrain, eq_QMARK_ }
