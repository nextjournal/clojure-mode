import * as squint_core from 'squint-cljs/core.js';
import * as walk from 'clojure.walk';
var deftest = (function () {
 let f1 = (function (var_args) {
let args21 = [];
let len__27398__auto__2 = arguments["length"];
let i33 = 0;
while(true){
let test__27847__auto__4 = (i33 < len__27398__auto__2);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
args21.push((arguments[i33]));
let G__5 = (i33 + 1);
i33 = G__5;
continue;
};break;
}
;
let argseq__27826__auto__6 = (function () {
 let test__27847__auto__7 = (3 < args21["length"]);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return args21.slice(3);}
})();
return f1.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), argseq__27826__auto__6);
});
f1["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, _var_name, body) {
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), body)));
});
f1["cljs$lang$maxFixedArity"] = 3;
f1["cljs$lang$applyTo"] = (function (seq4) {
let G__58 = squint_core.first(seq4);
let seq49 = squint_core.next(seq4);
let G__610 = squint_core.first(seq49);
let seq411 = squint_core.next(seq49);
let G__712 = squint_core.first(seq411);
let seq413 = squint_core.next(seq411);
let self__27415__auto__14 = this;
return self__27415__auto__14.cljs$core$IFn$_invoke$arity$variadic(G__58, G__610, G__712, seq413);
});
return f1;
})();
var testing = (function () {
 let f8 = (function (var_args) {
let args91 = [];
let len__27398__auto__2 = arguments["length"];
let i103 = 0;
while(true){
let test__27847__auto__4 = (i103 < len__27398__auto__2);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
args91.push((arguments[i103]));
let G__5 = (i103 + 1);
i103 = G__5;
continue;
};break;
}
;
let argseq__27826__auto__6 = (function () {
 let test__27847__auto__7 = (3 < args91["length"]);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return args91.slice(3);}
})();
return f8.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), argseq__27826__auto__6);
});
f8["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, _str, body) {
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), body)));
});
f8["cljs$lang$maxFixedArity"] = 3;
f8["cljs$lang$applyTo"] = (function (seq11) {
let G__128 = squint_core.first(seq11);
let seq119 = squint_core.next(seq11);
let G__1310 = squint_core.first(seq119);
let seq1111 = squint_core.next(seq119);
let G__1412 = squint_core.first(seq1111);
let seq1113 = squint_core.next(seq1111);
let self__27415__auto__14 = this;
return self__27415__auto__14.cljs$core$IFn$_invoke$arity$variadic(G__128, G__1310, G__1412, seq1113);
});
return f8;
})();
var apply_template = (function (argv, expr, values) {
let test__27847__auto__1 = squint_core.vector_QMARK_(argv);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (vector? argv)")};
let test__27847__auto__2 = squint_core.every_QMARK_(symbol_QMARK_, argv);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
null} else {
throw new Error("Assert failed: (every? symbol? argv)")};
return clojure.walk.postwalk_replace(zipmap(argv, values), expr);
});
var do_template = (function () {
 let f15 = (function (var_args) {
let args161 = [];
let len__27398__auto__2 = arguments["length"];
let i173 = 0;
while(true){
let test__27847__auto__4 = (i173 < len__27398__auto__2);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
args161.push((arguments[i173]));
let G__5 = (i173 + 1);
i173 = G__5;
continue;
};break;
}
;
let argseq__27826__auto__6 = (function () {
 let test__27847__auto__7 = (4 < args161["length"]);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return args161.slice(4);}
})();
return f15.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), (arguments[3]), argseq__27826__auto__6);
});
f15["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, argv, expr, values) {
let c8 = squint_core.count(argv);
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), squint_core.map((function (a) {
return apply_template(argv, expr, a);
}), squint_core.partition(c8, values)))));
});
f15["cljs$lang$maxFixedArity"] = 4;
f15["cljs$lang$applyTo"] = (function (seq18) {
let G__199 = squint_core.first(seq18);
let seq1810 = squint_core.next(seq18);
let G__2011 = squint_core.first(seq1810);
let seq1812 = squint_core.next(seq1810);
let G__2113 = squint_core.first(seq1812);
let seq1814 = squint_core.next(seq1812);
let G__2215 = squint_core.first(seq1814);
let seq1816 = squint_core.next(seq1814);
let self__27415__auto__17 = this;
return self__27415__auto__17.cljs$core$IFn$_invoke$arity$variadic(G__199, G__2011, G__2113, G__2215, seq1816);
});
return f15;
})();
var __GT_assert = (function (expr) {
return clojure.walk.postwalk((function (expr) {
let test__27847__auto__1 = (function () {
 let and__28236__auto__2 = seq_QMARK_(expr);
if (and__28236__auto__2 != null && and__28236__auto__2 !== false) {
return (symbol("=") === squint_core.first(expr));} else {
return and__28236__auto__2;}
})();
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return list_STAR_(symbol("assert.equal"), squint_core.rest(expr));} else {
return expr;}
}), expr);
});
var are = (function () {
 let f23 = (function (var_args) {
let args241 = [];
let len__27398__auto__2 = arguments["length"];
let i253 = 0;
while(true){
let test__27847__auto__4 = (i253 < len__27398__auto__2);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
args241.push((arguments[i253]));
let G__5 = (i253 + 1);
i253 = G__5;
continue;
};break;
}
;
let argseq__27826__auto__6 = (function () {
 let test__27847__auto__7 = (4 < args241["length"]);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return args241.slice(4);}
})();
return f23.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), (arguments[3]), argseq__27826__auto__6);
});
f23["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, argv, expr, args) {
let test__27847__auto__8 = (function () {
 let or__28221__auto__9 = (function () {
 let and__28236__auto__10 = squint_core.empty_QMARK_(argv);
if (and__28236__auto__10 != null && and__28236__auto__10 !== false) {
return squint_core.empty_QMARK_(args);} else {
return and__28236__auto__10;}
})();
if (or__28221__auto__9 != null && or__28221__auto__9 !== false) {
return or__28221__auto__9;} else {
let and__28236__auto__11 = squint_core.pos_QMARK_(squint_core.count(argv));
if (and__28236__auto__11 != null && and__28236__auto__11 !== false) {
let and__28236__auto__12 = squint_core.pos_QMARK_(squint_core.count(args));
if (and__28236__auto__12 != null && and__28236__auto__12 !== false) {
(mod(squint_core.count(args), squint_core.count(argv)) == 0)} else {
return and__28236__auto__12;}} else {
return and__28236__auto__11;}}
})();
if (test__27847__auto__8 != null && test__27847__auto__8 !== false) {
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), squint_core.map((function (a) {
return apply_template(argv, __GT_assert(expr), a);
}), squint_core.partition(squint_core.count(args), args)))));} else {
throw Error("The number of args doesn't match are's argv.")}
});
f23["cljs$lang$maxFixedArity"] = 4;
f23["cljs$lang$applyTo"] = (function (seq26) {
let G__2713 = squint_core.first(seq26);
let seq2614 = squint_core.next(seq26);
let G__2815 = squint_core.first(seq2614);
let seq2616 = squint_core.next(seq2614);
let G__2917 = squint_core.first(seq2616);
let seq2618 = squint_core.next(seq2616);
let G__3019 = squint_core.first(seq2618);
let seq2620 = squint_core.next(seq2618);
let self__27415__auto__21 = this;
return self__27415__auto__21.cljs$core$IFn$_invoke$arity$variadic(G__2713, G__2815, G__2917, G__3019, seq2620);
});
return f23;
})();

export { deftest, testing, apply_template, do_template, __GT_assert, are }
