import * as squint_core from 'squint-cljs/core.js';
import * as lz_tree from '@lezer/common';
import * as lezer_markdown from '@lezer/markdown';
import * as language from '@codemirror/language';
import * as lezer_clj from '@nextjournal/lezer-clojure';
import * as u from './util.mjs';
import * as sel from './selections.mjs';
var coll_prop = lezer_clj.props["coll"];
var prefix_coll_prop = lezer_clj.props["prefixColl"];
var prefix_edge_prop = lezer_clj.props["prefixEdge"];
var prefix_container_prop = lezer_clj.props["prefixContainer"];
var start_edge_prop = lz_tree.NodeProp["closedBy"];
var end_edge_prop = lz_tree.NodeProp["openedBy"];
var same_edge_prop = lezer_clj.props["sameEdge"];
var node_prop = (function (prop_name) {
let G__3141 = prop_name;
switch (G__3141) {case "prefixColl":
return prefix_coll_prop;
break;
case "coll":
return coll_prop;
break;
case "prefixEdge":
return prefix_edge_prop;
break;
case "prefixContainer":
return prefix_container_prop;
break;
case "sameEdge":
return same_edge_prop;
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3141))}
});
var type = (function (node) {
return node["type"];
});
var start = (function (node) {
let test__27847__auto__1 = node["from"];
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (.-from node)")};
return node["from"];
});
var end = (function (node) {
let test__27847__auto__1 = node["to"];
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (.-to node)")};
return node["to"];
});
var up = (function (node) {
return node["parent"];
});
var down = (function (node) {
let test__27847__auto__1 = !squint_core.fn_QMARK_(node["lastChild"]);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (not (fn? (.-lastChild node)))")};
return node["firstChild"];
});
var down_last = (function (node) {
let test__27847__auto__1 = !squint_core.fn_QMARK_(node["lastChild"]);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
null} else {
throw new Error("Assert failed: (not (fn? (.-lastChild node)))")};
return node["lastChild"];
});
var depth = (function (node) {
let node1 = node;
let i2 = 0;
while(true){
let temp__27741__auto__3 = up(node1);
let test__27847__auto__4 = squint_core.nil_QMARK_(temp__27741__auto__3);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return i2;} else {
let parent5 = temp__27741__auto__3;
let G__6 = parent5;
let G__7 = (i2 + 1);
node1 = G__6;
i2 = G__7;
continue;
};break;
}

});
var left = (function (node) {
return up(node).childBefore(start(node));
});
var lefts = (function (node) {
return squint_core.take_while(squint_core.identity, squint_core.iterate(left, left(node)));
});
var right = (function (node) {
return up(node).childAfter(end(node));
});
var rights = (function (node) {
return squint_core.take_while(squint_core.identity, squint_core.iterate(right, right(node)));
});
var coll_type_QMARK_ = (function (node_type) {
return node_type.prop(coll_prop);
});
var prefix_type_QMARK_ = (function (node_type) {
return node_type.prop(prefix_coll_prop);
});
var prefix_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(prefix_edge_prop);
});
var prefix_container_type_QMARK_ = (function (node_type) {
return node_type.prop(prefix_container_prop);
});
var same_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(same_edge_prop);
});
var start_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(start_edge_prop);
});
var end_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(end_edge_prop);
});
var top_type_QMARK_ = (function (node_type) {
return node_type["isTop"];
});
var error_type_QMARK_ = (function (node_type) {
return node_type["isError"];
});
var prefix_QMARK_ = (function (n) {
return prefix_type_QMARK_(type(n));
});
var prefix_edge_QMARK_ = (function (n) {
return prefix_edge_type_QMARK_(type(n));
});
var prefix_container_QMARK_ = (function (n) {
return prefix_container_type_QMARK_(type(n));
});
var same_edge_QMARK_ = (function (n) {
return same_edge_type_QMARK_(type(n));
});
var start_edge_QMARK_ = (function (n) {
return start_edge_type_QMARK_(type(n));
});
var end_edge_QMARK_ = (function (n) {
return end_edge_type_QMARK_(type(n));
});
var left_edge_type_QMARK_ = (function (t) {
let or__28221__auto__1 = start_edge_type_QMARK_(t);
if (or__28221__auto__1 != null && or__28221__auto__1 !== false) {
return or__28221__auto__1;} else {
let or__28221__auto__2 = same_edge_type_QMARK_(t);
if (or__28221__auto__2 != null && or__28221__auto__2 !== false) {
return or__28221__auto__2;} else {
return prefix_edge_type_QMARK_(t);}}
});
var left_edge_QMARK_ = (function (n) {
return left_edge_type_QMARK_(type(n));
});
var right_edge_type_QMARK_ = (function (t) {
let or__28221__auto__1 = end_edge_type_QMARK_(t);
if (or__28221__auto__1 != null && or__28221__auto__1 !== false) {
return or__28221__auto__1;} else {
return same_edge_type_QMARK_(t);}
});
var right_edge_QMARK_ = (function (n) {
return right_edge_type_QMARK_(type(n));
});
var edge_QMARK_ = (function (n) {
let t1 = type(n);
let or__28221__auto__2 = start_edge_type_QMARK_(t1);
if (or__28221__auto__2 != null && or__28221__auto__2 !== false) {
return or__28221__auto__2;} else {
let or__28221__auto__3 = end_edge_type_QMARK_(t1);
if (or__28221__auto__3 != null && or__28221__auto__3 !== false) {
return or__28221__auto__3;} else {
let or__28221__auto__4 = same_edge_type_QMARK_(t1);
if (or__28221__auto__4 != null && or__28221__auto__4 !== false) {
return or__28221__auto__4;} else {
return prefix_type_QMARK_(t1);}}}
});
var closed_by = (function (n) {
let G__3151 = type(n).prop(lz_tree.NodeProp["closedBy"]);
let test__27847__auto__2 = squint_core.nil_QMARK_(G__3151);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
return G__3151[0];}
});
var opened_by = (function (n) {
let G__3161 = type(n).prop(lz_tree.NodeProp["openedBy"]);
let test__27847__auto__2 = squint_core.nil_QMARK_(G__3161);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
return G__3161[0];}
});
var name = (function (node) {
return node["name"];
});
var error_QMARK_ = (function (node) {
return error_type_QMARK_(node);
});
var top_QMARK_ = (function (node) {
return top_type_QMARK_(type(node));
});
var program_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("Program", name(node));
});
var string_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("String", name(node));
});
var regexp_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("RegExp", name(node));
});
var line_comment_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("LineComment", name(node));
});
var discard_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("Discard", name(node));
});
null;
var coll_QMARK_ = (function (node) {
return coll_type_QMARK_(type(node));
});
var terminal_type_QMARK_ = (function (node_type) {
let test__27847__auto__1 = top_type_QMARK_(node_type);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return false;} else {
let test__27847__auto__2 = node_type.prop(prefix_coll_prop);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return false;} else {
let test__27847__auto__3 = node_type.prop(coll_prop);
if (test__27847__auto__3 != null && test__27847__auto__3 !== false) {
return false;} else {
let test__27847__auto__4 = squint_core.identical_QMARK_("Meta", name(node_type));
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return false;} else {
let test__27847__auto__5 = squint_core.identical_QMARK_("TaggedLiteral", name(node_type));
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
return false;} else {
let test__27847__auto__6 = squint_core.identical_QMARK_("ConstructorCall", name(node_type));
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return false;} else {
let test__27847__auto__7 = "else";
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return true;} else {
return null;}}}}}}}
});
var balanced_QMARK_ = (function (p__317) {
let map__12 = p__317;
let _node3 = map__12;
let firstChild4 = squint_core.get(map__12, "firstChild");
let lastChild5 = squint_core.get(map__12, "lastChild");
let temp__27663__auto__6 = closed_by(firstChild4);
if (temp__27663__auto__6 != null && temp__27663__auto__6 !== false) {
let closing7 = temp__27663__auto__6;
let and__28236__auto__8 = (closing7 === name(lastChild5));
if (and__28236__auto__8 != null && and__28236__auto__8 !== false) {
return (end(firstChild4) !== end(lastChild5));} else {
return and__28236__auto__8;}} else {
return true;}
});
var ancestors = (function (node) {
let temp__27820__auto__1 = up(node);
let test__27847__auto__2 = squint_core.nil_QMARK_(temp__27820__auto__1);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
let parent3 = temp__27820__auto__1;
return squint_core.cons(parent3, new squint_core.LazySeq((function () {
return ancestors(parent3);
})));}
});
var closest = (function (node, pred) {
let test__27847__auto__1 = pred(node);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return node;} else {
return squint_core.reduce((function (_, x) {
let test__27847__auto__2 = pred(x);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return squint_core.reduced(x);}
}), null, ancestors(node));}
});
var highest = (function (node, pred) {
return squint_core.reduce((function (found, x) {
let test__27847__auto__1 = pred(x);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return x;} else {
return squint_core.reduced(found);}
}), null, squint_core.cons(node, ancestors(node)));
});
var children = (function () {
 let f318 = (function (var_args) {
let G__3211 = arguments["length"];
switch (G__3211) {case 3:
return f318.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
case 1:
return f318.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f318["cljs$core$IFn$_invoke$arity$3"] = (function (parent, from, dir) {
let temp__27820__auto__3 = (function () {
 let G__3224 = dir;
switch (G__3224) {case 1:
return parent.childAfter(from);
break;
case -1:
return parent.childBefore(from);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3224))}
})();
let test__27847__auto__6 = squint_core.nil_QMARK_(temp__27820__auto__3);
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return null;} else {
let child7 = temp__27820__auto__3;
return squint_core.cons(child7, new squint_core.LazySeq((function () {
return children(parent, (function () {
 let G__3238 = dir;
switch (G__3238) {case 1:
return end(child7);
break;
case -1:
return start(child7);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3238))}
})(), dir);
})));}
});
f318["cljs$core$IFn$_invoke$arity$1"] = (function (subtree) {
return children(subtree, start(subtree), 1);
});
f318["cljs$lang$maxFixedArity"] = 3;
return f318;
})();
var eq_QMARK_ = (function (x, y) {
let and__28236__auto__1 = (start(x) == start(y));
if (and__28236__auto__1 != null && and__28236__auto__1 !== false) {
let and__28236__auto__2 = (end(x) == end(y));
if (and__28236__auto__2 != null && and__28236__auto__2 !== false) {
return (depth(x) == depth(y));} else {
return and__28236__auto__2;}} else {
return and__28236__auto__1;}
});
var empty_QMARK_ = (function (node) {
let type_name1 = name(node);
let test__27847__auto__2 = coll_QMARK_(node);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return eq_QMARK_(right(down(node)), down_last(node));} else {
let test__27847__auto__3 = ("String" === type_name1);
if (test__27847__auto__3 != null && test__27847__auto__3 !== false) {
return (end(down(node)) == start(down_last(node)));} else {
let test__27847__auto__4 = "else";
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return false;} else {
return null;}}}
});
var from_to = (function () {
 let f324 = (function (var_args) {
let G__3271 = arguments["length"];
switch (G__3271) {case 2:
return f324.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 1:
return f324.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f324["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
return ({ "from": from, "to": to });
});
f324["cljs$core$IFn$_invoke$arity$1"] = (function (node) {
return from_to(start(node), end(node));
});
f324["cljs$lang$maxFixedArity"] = 2;
return f324;
})();
var range = (function (node) {
return sel.range(start(node), end(node));
});
var string = (function () {
 let f328 = (function (var_args) {
let G__3311 = arguments["length"];
switch (G__3311) {case 2:
return f328.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f328.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f328["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return string(state, start(node), end(node));
});
f328["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
return state["doc"].sliceString(from, to, "\n");
});
f328["cljs$lang$maxFixedArity"] = 3;
return f328;
})();
var ancestor_QMARK_ = (function (parent, child) {
return squint_core.boolean$((function () {
 let and__28236__auto__1 = (start(parent) <= start(child));
if (and__28236__auto__1 != null && and__28236__auto__1 !== false) {
let and__28236__auto__2 = (end(parent) >= end(child));
if (and__28236__auto__2 != null && and__28236__auto__2 !== false) {
return (depth(parent) < depth(child));} else {
return and__28236__auto__2;}} else {
return and__28236__auto__1;}
})());
});
var move_toward = (function (node, to_node) {
let test__27847__auto__1 = eq_QMARK_(node, to_node);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return null;} else {
let G__3322 = squint_core.compare(start(to_node), start(node));
switch (G__3322) {case 0:
let test__27847__auto__4 = ancestor_QMARK_(to_node, node);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return up(node);} else {
let test__27847__auto__5 = ancestor_QMARK_(node, to_node);
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
return down(node);} else {
return null;}}
break;
case -1:
let test__27847__auto__6 = ancestor_QMARK_(node, to_node);
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return down_last(node);} else {
let or__28221__auto__7 = left(node);
if (or__28221__auto__7 != null && or__28221__auto__7 !== false) {
return or__28221__auto__7;} else {
return up(node);}}
break;
case 1:
let test__27847__auto__8 = ancestor_QMARK_(node, to_node);
if (test__27847__auto__8 != null && test__27847__auto__8 !== false) {
return down(node);} else {
let or__28221__auto__9 = right(node);
if (or__28221__auto__9 != null && or__28221__auto__9 !== false) {
return or__28221__auto__9;} else {
return up(node);}}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3322))}}
});
var nodes_between = (function (node, to_node) {
return squint_core.take_while(squint_core.identity, squint_core.iterate((function (_PERCENT_1) {
return move_toward(_PERCENT_1, to_node);
}), node));
});
var require_balance_QMARK_ = (function (node) {
let or__28221__auto__1 = coll_QMARK_(node);
if (or__28221__auto__1 != null && or__28221__auto__1 !== false) {
return or__28221__auto__1;} else {
let or__28221__auto__2 = string_QMARK_(node);
if (or__28221__auto__2 != null && or__28221__auto__2 !== false) {
return or__28221__auto__2;} else {
return regexp_QMARK_(node);}}
});
var tree = (function () {
 let f333 = (function (var_args) {
let G__3361 = arguments["length"];
switch (G__3361) {case 1:
return f333.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f333.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f333.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f333["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return language.syntaxTree(state);
});
f333["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return language.syntaxTree(state).resolveInner(pos);
});
f333["cljs$core$IFn$_invoke$arity$3"] = (function (state, pos, dir) {
return language.syntaxTree(state).resolveInner(pos, dir);
});
f333["cljs$lang$maxFixedArity"] = 3;
return f333;
})();
var cursor = (function () {
 let f337 = (function (var_args) {
let G__3401 = arguments["length"];
switch (G__3401) {case 1:
return f337.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f337.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f337.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f337["cljs$core$IFn$_invoke$arity$1"] = (function (tree) {
return tree.cursor();
});
f337["cljs$core$IFn$_invoke$arity$2"] = (function (tree, pos) {
return tree.cursorAt(pos);
});
f337["cljs$core$IFn$_invoke$arity$3"] = (function (tree, pos, dir) {
return tree.cursorAt(pos, dir);
});
f337["cljs$lang$maxFixedArity"] = 3;
return f337;
})();
var terminal_cursor = (function (tree, pos, dir) {
let i1 = pos;
while(true){
let c2 = cursor(tree, i1, dir);
let type3 = c2["type"];
let test__27847__auto__4 = top_type_QMARK_(type3);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return null;} else {
let test__27847__auto__5 = terminal_type_QMARK_(c2["type"]);
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
return c2;} else {
let test__27847__auto__6 = "else";
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
let G__7 = (dir + i1);
i1 = G__7;
continue;
} else {
return null;}}};break;
}

});
var up_here = (function (node) {
let from1 = start(node);
let or__28221__auto__2 = highest(node, (function (_PERCENT_1) {
return (from1 === start(_PERCENT_1));
}));
if (or__28221__auto__2 != null && or__28221__auto__2 !== false) {
return or__28221__auto__2;} else {
return node;}
});
var topmost_cursor = (function (state, from) {
return up_here(tree(state, from, 1)["node"]).cursor();
});
var terminal_nodes = (function (state, from, to) {
let cursor1 = topmost_cursor(state, from);
let found2 = [];
while(true){
let node_type3 = type(cursor1);
let test__27847__auto__4 = (start(cursor1) > to);
if (test__27847__auto__4 != null && test__27847__auto__4 !== false) {
return found2;} else {
let test__27847__auto__5 = (function () {
 let or__28221__auto__6 = terminal_type_QMARK_(node_type3);
if (or__28221__auto__6 != null && or__28221__auto__6 !== false) {
return or__28221__auto__6;} else {
return error_QMARK_(node_type3);}
})();
if (test__27847__auto__5 != null && test__27847__auto__5 !== false) {
let found7 = squint_core.conj(found2, ({ "type": node_type3, "from": start(cursor1), "to": end(cursor1) }));
cursor1.lastChild();
let test__27847__auto__8 = cursor1.next();
if (test__27847__auto__8 != null && test__27847__auto__8 !== false) {
let G__9 = found7;
found2 = G__9;
continue;
} else {
return found7;}} else {
let test__27847__auto__10 = "else";
if (test__27847__auto__10 != null && test__27847__auto__10 !== false) {
let test__27847__auto__11 = cursor1.next();
if (test__27847__auto__11 != null && test__27847__auto__11 !== false) {
let G__12 = found2;
found2 = G__12;
continue;
} else {
return found2;}} else {
return null;}}};break;
}

});
var balanced_range = (function () {
 let f341 = (function (var_args) {
let G__3441 = arguments["length"];
switch (G__3441) {case 2:
return f341.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f341.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f341["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return balanced_range(state, start(node), end(node));
});
f341["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
let vec__39 = squint_core.sort([from, to]);
let from10 = squint_core.nth(vec__39, 0, null);
let to11 = squint_core.nth(vec__39, 1, null);
let from_node12 = tree(state, from10, 1);
let to_node13 = tree(state, to11, -1);
let from14 = (function () {
 let test__27847__auto__15 = require_balance_QMARK_(from_node12);
if (test__27847__auto__15 != null && test__27847__auto__15 !== false) {
return start(from_node12);} else {
return from10;}
})();
let to16 = (function () {
 let test__27847__auto__17 = require_balance_QMARK_(to_node13);
if (test__27847__auto__17 != null && test__27847__auto__17 !== false) {
return end(to_node13);} else {
return to11;}
})();
let vec__618 = squint_core.reduce((function (p__345, node_between) {
let vec__1922 = p__345;
let left23 = squint_core.nth(vec__1922, 0, null);
let right24 = squint_core.nth(vec__1922, 1, null);
return [(function () {
 let test__27847__auto__25 = ancestor_QMARK_(node_between, from_node12);
if (test__27847__auto__25 != null && test__27847__auto__25 !== false) {
return start(node_between);} else {
return left23;}
})(), (function () {
 let test__27847__auto__26 = ancestor_QMARK_(node_between, to_node13);
if (test__27847__auto__26 != null && test__27847__auto__26 !== false) {
return end(node_between);} else {
return right24;}
})()];
}), [from14, to16], squint_core.map((function (_PERCENT_1) {
let G__34627 = _PERCENT_1;
let test__27847__auto__28 = edge_QMARK_(_PERCENT_1);
if (test__27847__auto__28 != null && test__27847__auto__28 !== false) {
return up(G__34627);} else {
return G__34627;}
}), nodes_between(from_node12, to_node13)));
let left29 = squint_core.nth(vec__618, 0, null);
let right30 = squint_core.nth(vec__618, 1, null);
return sel.range(left29, right30);
});
f341["cljs$lang$maxFixedArity"] = 3;
return f341;
})();
var inner_span = (function (p__347) {
let map__12 = p__347;
let node3 = map__12;
let firstChild4 = squint_core.get(map__12, "firstChild");
let lastChild5 = squint_core.get(map__12, "lastChild");
return ({ "from": (function () {
 let test__27847__auto__6 = left_edge_QMARK_(firstChild4);
if (test__27847__auto__6 != null && test__27847__auto__6 !== false) {
return end(firstChild4);} else {
return start(node3);}
})(), "to": (function () {
 let test__27847__auto__7 = right_edge_QMARK_(lastChild5);
if (test__27847__auto__7 != null && test__27847__auto__7 !== false) {
return start(lastChild5);} else {
return end(node3);}
})() });
});
var within_QMARK__LT_ = (function (parent, child) {
let c11 = squint_core.compare(start(parent), start(child));
let c22 = squint_core.compare(end(parent), end(child));
let and__28236__auto__3 = (function () {
 let or__28221__auto__4 = squint_core.pos_QMARK_(c11);
if (or__28221__auto__4 != null && or__28221__auto__4 !== false) {
return or__28221__auto__4;} else {
return squint_core.neg_QMARK_(c22);}
})();
if (and__28236__auto__3 != null && and__28236__auto__3 !== false) {
let and__28236__auto__5 = !squint_core.neg_QMARK_(c11);
if (and__28236__auto__5 != null && and__28236__auto__5 !== false) {
return !squint_core.pos_QMARK_(c22);} else {
return and__28236__auto__5;}} else {
return and__28236__auto__3;}
});
var within_QMARK_ = (function (parent, child) {
let and__28236__auto__1 = !squint_core.neg_QMARK_(squint_core.compare(start(parent), start(child)));
if (and__28236__auto__1 != null && and__28236__auto__1 !== false) {
return !squint_core.pos_QMARK_(squint_core.compare(end(parent), end(child)));} else {
return and__28236__auto__1;}
});
var follow_edges = (function (node) {
let test__27847__auto__1 = edge_QMARK_(node);
if (test__27847__auto__1 != null && test__27847__auto__1 !== false) {
return up(node);} else {
return node;}
});
var prefix = (function (node) {
let temp__27820__auto__1 = up(node);
let test__27847__auto__2 = squint_core.nil_QMARK_(temp__27820__auto__1);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
let parent3 = temp__27820__auto__1;
let or__28221__auto__4 = u.guard(parent3, prefix_container_QMARK_);
if (or__28221__auto__4 != null && or__28221__auto__4 !== false) {
return or__28221__auto__4;} else {
return u.guard(down(parent3), prefix_edge_QMARK_);}}
});
var left_edge_with_prefix = (function (state, node) {
return squint_core.str((function () {
 let G__3481 = prefix(node);
let test__27847__auto__2 = squint_core.nil_QMARK_(G__3481);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
return string(state, G__3481);}
})(), name(down(node)));
});
var with_prefix = (function (node) {
let G__3491 = node;
let test__27847__auto__2 = prefix(node);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return up(G__3491);} else {
return G__3491;}
});
var node_BAR_ = (function (state, pos) {
let G__3501 = tree(state, pos, -1);
let test__27847__auto__2 = squint_core.nil_QMARK_(G__3501);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
return u.guard(G__3501, (function (_PERCENT_1) {
return (pos === end(_PERCENT_1));
}));}
});
var _BAR_node = (function (state, pos) {
let G__3511 = tree(state, pos, 1);
let test__27847__auto__2 = squint_core.nil_QMARK_(G__3511);
if (test__27847__auto__2 != null && test__27847__auto__2 !== false) {
return null;} else {
return u.guard(G__3511, (function (_PERCENT_1) {
return (pos === start(_PERCENT_1));
}));}
});
var nearest_touching = (function (state, pos, dir) {
let L1 = (function () {
 let G__3522 = tree(state, pos, -1);
let test__27847__auto__3 = squint_core.nil_QMARK_(G__3522);
if (test__27847__auto__3 != null && test__27847__auto__3 !== false) {
return null;} else {
return u.guard(G__3522, (function (p__353) {
let map__45 = p__353;
let to6 = squint_core.get(map__45, "to");
return (pos === to6);
}));}
})();
let R7 = (function () {
 let G__3548 = tree(state, pos, 1);
let test__27847__auto__9 = squint_core.nil_QMARK_(G__3548);
if (test__27847__auto__9 != null && test__27847__auto__9 !== false) {
return null;} else {
return u.guard(G__3548, (function (p__355) {
let map__1011 = p__355;
let from12 = squint_core.get(map__1011, "from");
return (pos === from12);
}));}
})();
let mid13 = tree(state, pos);
let G__35614 = dir;
switch (G__35614) {case 1:
let or__28221__auto__16 = u.guard(R7, squint_core.every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
let or__28221__auto__17 = same_edge_QMARK_(_PERCENT_1);
if (or__28221__auto__17 != null && or__28221__auto__17 !== false) {
return or__28221__auto__17;} else {
return !right_edge_QMARK_(_PERCENT_1);}
})));
if (or__28221__auto__16 != null && or__28221__auto__16 !== false) {
return or__28221__auto__16;} else {
let or__28221__auto__18 = L1;
if (or__28221__auto__18 != null && or__28221__auto__18 !== false) {
return or__28221__auto__18;} else {
let or__28221__auto__19 = R7;
if (or__28221__auto__19 != null && or__28221__auto__19 !== false) {
return or__28221__auto__19;} else {
return mid13;}}}
break;
case -1:
let or__28221__auto__20 = u.guard(L1, squint_core.every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
let or__28221__auto__21 = same_edge_QMARK_(_PERCENT_1);
if (or__28221__auto__21 != null && or__28221__auto__21 !== false) {
return or__28221__auto__21;} else {
return !left_edge_QMARK_(_PERCENT_1);}
})));
if (or__28221__auto__20 != null && or__28221__auto__20 !== false) {
return or__28221__auto__20;} else {
let or__28221__auto__22 = R7;
if (or__28221__auto__22 != null && or__28221__auto__22 !== false) {
return or__28221__auto__22;} else {
let or__28221__auto__23 = L1;
if (or__28221__auto__23 != null && or__28221__auto__23 !== false) {
return or__28221__auto__23;} else {
return mid13;}}}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__35614))}
});
var embedded_QMARK_ = (function () {
 let f357 = (function (var_args) {
let G__3601 = arguments["length"];
switch (G__3601) {case 1:
return f357.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f357.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f357["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return embedded_QMARK_(state, state["selection"]["main"]["head"]);
});
f357["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return squint_core.identical_QMARK_(lezer_markdown.parser.nodeTypes["FencedCode"], state["tree"].resolve(pos)["type"]["id"]);
});
f357["cljs$lang$maxFixedArity"] = 2;
return f357;
})();
var within_program_QMARK_ = (function () {
 let f361 = (function (var_args) {
let G__3641 = arguments["length"];
switch (G__3641) {case 1:
return f361.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f361.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f361["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return within_program_QMARK_(state, state["selection"]["main"]["head"]);
});
f361["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
let n3 = tree(state, pos);
let or__28221__auto__4 = program_QMARK_(n3);
if (or__28221__auto__4 != null && or__28221__auto__4 !== false) {
return or__28221__auto__4;} else {
return squint_core.some(program_QMARK_, ancestors(n3));}
});
f361["cljs$lang$maxFixedArity"] = 2;
return f361;
})();
null;

export { end_edge_prop, ancestors, range, string_QMARK_, within_QMARK__LT_, edge_QMARK_, right, terminal_nodes, string, same_edge_type_QMARK_, up, line_comment_QMARK_, prefix_coll_prop, prefix, left_edge_with_prefix, top_QMARK_, empty_QMARK_, terminal_type_QMARK_, left_edge_type_QMARK_, children, nodes_between, prefix_edge_QMARK_, discard_QMARK_, right_edge_type_QMARK_, balanced_range, prefix_container_QMARK_, topmost_cursor, coll_prop, closed_by, error_QMARK_, _BAR_node, balanced_QMARK_, start_edge_type_QMARK_, prefix_container_prop, down_last, prefix_QMARK_, name, same_edge_QMARK_, prefix_container_type_QMARK_, rights, with_prefix, start, tree, closest, cursor, node_prop, from_to, follow_edges, start_edge_QMARK_, highest, embedded_QMARK_, opened_by, coll_QMARK_, down, type, terminal_cursor, within_QMARK_, inner_span, depth, prefix_type_QMARK_, same_edge_prop, nearest_touching, regexp_QMARK_, top_type_QMARK_, error_type_QMARK_, up_here, ancestor_QMARK_, end_edge_type_QMARK_, right_edge_QMARK_, start_edge_prop, prefix_edge_prop, node_BAR_, left_edge_QMARK_, coll_type_QMARK_, lefts, require_balance_QMARK_, end, prefix_edge_type_QMARK_, within_program_QMARK_, left, end_edge_QMARK_, program_QMARK_, move_toward, eq_QMARK_ }
