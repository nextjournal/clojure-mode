import * as squint_core from 'squint-cljs/core.js';
import * as walk from 'clojure.walk';
var deftest = (function () {
 let f5 = (function (var_args) {
let args61 = [];
let len__24575__auto__2 = arguments["length"];
let i73 = 0;
while(true){
let test__23322__auto__4 = (i73 < len__24575__auto__2);
if (test__23322__auto__4 != null && test__23322__auto__4 !== false) {
args61.push((arguments[i73]));
let G__5 = (i73 + 1);
i73 = G__5;
continue;
};break;
}
;
let argseq__24897__auto__6 = (function () {
 let test__23322__auto__7 = (3 < args61["length"]);
if (test__23322__auto__7 != null && test__23322__auto__7 !== false) {
return args61.slice(3);}
})();
return f5.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), argseq__24897__auto__6);
});
f5["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, _var_name, body) {
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), body)));
});
f5["cljs$lang$maxFixedArity"] = 3;
f5["cljs$lang$applyTo"] = (function (seq8) {
let G__98 = squint_core.first(seq8);
let seq89 = squint_core.next(seq8);
let G__1010 = squint_core.first(seq89);
let seq811 = squint_core.next(seq89);
let G__1112 = squint_core.first(seq811);
let seq813 = squint_core.next(seq811);
let self__24577__auto__14 = this;
return self__24577__auto__14.cljs$core$IFn$_invoke$arity$variadic(G__98, G__1010, G__1112, seq813);
});
return f5;
})();
var testing = (function () {
 let f12 = (function (var_args) {
let args131 = [];
let len__24575__auto__2 = arguments["length"];
let i143 = 0;
while(true){
let test__23322__auto__4 = (i143 < len__24575__auto__2);
if (test__23322__auto__4 != null && test__23322__auto__4 !== false) {
args131.push((arguments[i143]));
let G__5 = (i143 + 1);
i143 = G__5;
continue;
};break;
}
;
let argseq__24897__auto__6 = (function () {
 let test__23322__auto__7 = (3 < args131["length"]);
if (test__23322__auto__7 != null && test__23322__auto__7 !== false) {
return args131.slice(3);}
})();
return f12.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), argseq__24897__auto__6);
});
f12["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, _str, body) {
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), body)));
});
f12["cljs$lang$maxFixedArity"] = 3;
f12["cljs$lang$applyTo"] = (function (seq15) {
let G__168 = squint_core.first(seq15);
let seq159 = squint_core.next(seq15);
let G__1710 = squint_core.first(seq159);
let seq1511 = squint_core.next(seq159);
let G__1812 = squint_core.first(seq1511);
let seq1513 = squint_core.next(seq1511);
let self__24577__auto__14 = this;
return self__24577__auto__14.cljs$core$IFn$_invoke$arity$variadic(G__168, G__1710, G__1812, seq1513);
});
return f12;
})();
var apply_template = (function (argv, expr, values) {
let test__23322__auto__1 = squint_core.vector_QMARK_(argv);
if (test__23322__auto__1 != null && test__23322__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (vector? argv)")};
let test__23322__auto__2 = squint_core.every_QMARK_(symbol_QMARK_, argv);
if (test__23322__auto__2 != null && test__23322__auto__2 !== false) {
null} else {
throw new Error("Assert failed: (every? symbol? argv)")};
return clojure.walk.postwalk_replace(zipmap(argv, values), expr);
});
var do_template = (function () {
 let f19 = (function (var_args) {
let args201 = [];
let len__24575__auto__2 = arguments["length"];
let i213 = 0;
while(true){
let test__23322__auto__4 = (i213 < len__24575__auto__2);
if (test__23322__auto__4 != null && test__23322__auto__4 !== false) {
args201.push((arguments[i213]));
let G__5 = (i213 + 1);
i213 = G__5;
continue;
};break;
}
;
let argseq__24897__auto__6 = (function () {
 let test__23322__auto__7 = (4 < args201["length"]);
if (test__23322__auto__7 != null && test__23322__auto__7 !== false) {
return args201.slice(4);}
})();
return f19.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), (arguments[3]), argseq__24897__auto__6);
});
f19["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, argv, expr, values) {
let c8 = squint_core.count(argv);
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), squint_core.map((function (a) {
return apply_template(argv, expr, a);
}), squint_core.partition(c8, values)))));
});
f19["cljs$lang$maxFixedArity"] = 4;
f19["cljs$lang$applyTo"] = (function (seq22) {
let G__239 = squint_core.first(seq22);
let seq2210 = squint_core.next(seq22);
let G__2411 = squint_core.first(seq2210);
let seq2212 = squint_core.next(seq2210);
let G__2513 = squint_core.first(seq2212);
let seq2214 = squint_core.next(seq2212);
let G__2615 = squint_core.first(seq2214);
let seq2216 = squint_core.next(seq2214);
let self__24577__auto__17 = this;
return self__24577__auto__17.cljs$core$IFn$_invoke$arity$variadic(G__239, G__2411, G__2513, G__2615, seq2216);
});
return f19;
})();
var __GT_assert = (function (expr) {
return clojure.walk.postwalk((function (expr) {
let test__23322__auto__1 = (function () {
 let and__25548__auto__2 = seq_QMARK_(expr);
if (and__25548__auto__2 != null && and__25548__auto__2 !== false) {
return (symbol("=") === squint_core.first(expr));} else {
return and__25548__auto__2;}
})();
if (test__23322__auto__1 != null && test__23322__auto__1 !== false) {
return list_STAR_(symbol("assert.equal"), squint_core.rest(expr));} else {
return expr;}
}), expr);
});
var are = (function () {
 let f27 = (function (var_args) {
let args281 = [];
let len__24575__auto__2 = arguments["length"];
let i293 = 0;
while(true){
let test__23322__auto__4 = (i293 < len__24575__auto__2);
if (test__23322__auto__4 != null && test__23322__auto__4 !== false) {
args281.push((arguments[i293]));
let G__5 = (i293 + 1);
i293 = G__5;
continue;
};break;
}
;
let argseq__24897__auto__6 = (function () {
 let test__23322__auto__7 = (4 < args281["length"]);
if (test__23322__auto__7 != null && test__23322__auto__7 !== false) {
return args281.slice(4);}
})();
return f27.cljs$core$IFn$_invoke$arity$variadic((arguments[0]), (arguments[1]), (arguments[2]), (arguments[3]), argseq__24897__auto__6);
});
f27["cljs$core$IFn$_invoke$arity$variadic"] = (function (_AMPERSAND_form, _AMPERSAND_env, argv, expr, args) {
let test__23322__auto__8 = (function () {
 let or__25526__auto__9 = (function () {
 let and__25548__auto__10 = squint_core.empty_QMARK_(argv);
if (and__25548__auto__10 != null && and__25548__auto__10 !== false) {
return squint_core.empty_QMARK_(args);} else {
return and__25548__auto__10;}
})();
if (or__25526__auto__9 != null && or__25526__auto__9 !== false) {
return or__25526__auto__9;} else {
let and__25548__auto__11 = squint_core.pos_QMARK_(squint_core.count(argv));
if (and__25548__auto__11 != null && and__25548__auto__11 !== false) {
let and__25548__auto__12 = squint_core.pos_QMARK_(squint_core.count(args));
if (and__25548__auto__12 != null && and__25548__auto__12 !== false) {
(mod(squint_core.count(args), squint_core.count(argv)) == 0)} else {
return and__25548__auto__12;}} else {
return and__25548__auto__11;}}
})();
if (test__23322__auto__8 != null && test__23322__auto__8 !== false) {
return sequence(squint_core.seq(squint_core.concat(squint_core.list(symbol("do")), squint_core.map((function (a) {
return apply_template(argv, __GT_assert(expr), a);
}), squint_core.partition(squint_core.count(args), args)))));} else {
throw Error("The number of args doesn't match are's argv.")}
});
f27["cljs$lang$maxFixedArity"] = 4;
f27["cljs$lang$applyTo"] = (function (seq30) {
let G__3113 = squint_core.first(seq30);
let seq3014 = squint_core.next(seq30);
let G__3215 = squint_core.first(seq3014);
let seq3016 = squint_core.next(seq3014);
let G__3317 = squint_core.first(seq3016);
let seq3018 = squint_core.next(seq3016);
let G__3419 = squint_core.first(seq3018);
let seq3020 = squint_core.next(seq3018);
let self__24577__auto__21 = this;
return self__24577__auto__21.cljs$core$IFn$_invoke$arity$variadic(G__3113, G__3215, G__3317, G__3419, seq3020);
});
return f27;
})();

export { deftest, testing, apply_template, do_template, __GT_assert, are }
