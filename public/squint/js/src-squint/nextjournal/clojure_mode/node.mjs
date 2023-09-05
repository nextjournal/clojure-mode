import * as squint_core from 'squint-cljs/core.js';
import * as lz_tree from '@lezer/common';
import * as lezer_markdown from '@lezer/markdown';
import * as language from '@codemirror/language';
import * as lezer_clj from '@nextjournal/lezer-clojure';
import * as u from './util.mjs';
import * as sel from './selections.mjs';
var coll_prop = lezer_clj.props["coll"]
;
var prefix_coll_prop = lezer_clj.props["prefixColl"]
;
var prefix_edge_prop = lezer_clj.props["prefixEdge"]
;
var prefix_container_prop = lezer_clj.props["prefixContainer"]
;
var start_edge_prop = lz_tree.NodeProp["closedBy"]
;
var end_edge_prop = lz_tree.NodeProp["openedBy"]
;
var same_edge_prop = lezer_clj.props["sameEdge"]
;
var node_prop = (function (prop_name) {
let G__12 = prop_name;
switch (G__12) {case "prefixColl":
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
throw new Error(squint_core.str("No matching clause: ", G__12))}
})
;
var type = (function (node) {
return node["type"];
})
;
var start = (function (node) {
assert(node["from"]);
return node["from"];
})
;
var end = (function (node) {
assert(node["to"]);
return node["to"];
})
;
var up = (function (node) {
return node["parent"];
})
;
var down = (function (node) {
assert(!fn_QMARK_(node["lastChild"]));
return node["firstChild"];
})
;
var down_last = (function (node) {
assert(!fn_QMARK_(node["lastChild"]));
return node["lastChild"];
})
;
var depth = (function (node) {
let node4 = node;
let i5 = 0;
while(true){
let temp__25059__auto__6 = up(node4);
if (squint_core.nil_QMARK_(temp__25059__auto__6)) {
return i5;} else {
let parent7 = temp__25059__auto__6;
let G__8 = parent7;
let G__9 = (i5 + 1);
node4 = G__8;
i5 = G__9;
continue;
};break;
}

})
;
var left = (function (node) {
return up(node).childBefore(start(node));
})
;
var lefts = (function (node) {
return squint_core.take_while(squint_core.identity, iterate(left, left(node)));
})
;
var right = (function (node) {
return up(node).childAfter(end(node));
})
;
var rights = (function (node) {
return squint_core.take_while(squint_core.identity, iterate(right, right(node)));
})
;
var coll_type_QMARK_ = (function (node_type) {
return (node_type.prop(coll_prop));
})
;
var prefix_type_QMARK_ = (function (node_type) {
return node_type.prop(prefix_coll_prop);
})
;
var prefix_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(prefix_edge_prop);
})
;
var prefix_container_type_QMARK_ = (function (node_type) {
return node_type.prop(prefix_container_prop);
})
;
var same_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(same_edge_prop);
})
;
var start_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(start_edge_prop);
})
;
var end_edge_type_QMARK_ = (function (node_type) {
return node_type.prop(end_edge_prop);
})
;
var top_type_QMARK_ = (function (node_type) {
return node_type["isTop"];
})
;
var error_type_QMARK_ = (function (node_type) {
return node_type["isError"];
})
;
var prefix_QMARK_ = (function (n) {
return prefix_type_QMARK_(type(n));
})
;
var prefix_edge_QMARK_ = (function (n) {
return prefix_edge_type_QMARK_(type(n));
})
;
var prefix_container_QMARK_ = (function (n) {
return prefix_container_type_QMARK_(type(n));
})
;
var same_edge_QMARK_ = (function (n) {
return same_edge_type_QMARK_(type(n));
})
;
var start_edge_QMARK_ = (function (n) {
return start_edge_type_QMARK_(type(n));
})
;
var end_edge_QMARK_ = (function (n) {
return end_edge_type_QMARK_(type(n));
})
;
var left_edge_type_QMARK_ = (function (t) {
return (start_edge_type_QMARK_(t) || same_edge_type_QMARK_(t) || prefix_edge_type_QMARK_(t));
})
;
var left_edge_QMARK_ = (function (n) {
return left_edge_type_QMARK_(type(n));
})
;
var right_edge_type_QMARK_ = (function (t) {
return (end_edge_type_QMARK_(t) || same_edge_type_QMARK_(t));
})
;
var right_edge_QMARK_ = (function (n) {
return right_edge_type_QMARK_(type(n));
})
;
var edge_QMARK_ = (function (n) {
let t10 = type(n);
return (start_edge_type_QMARK_(t10) || end_edge_type_QMARK_(t10) || same_edge_type_QMARK_(t10) || prefix_type_QMARK_(t10));
})
;
var closed_by = (function (n) {
let G__1112 = type(n).prop(lz_tree.NodeProp["closedBy"]);
if (squint_core.nil_QMARK_(G__1112)) {
return null;} else {
return G__1112[0];}
})
;
var opened_by = (function (n) {
let G__1314 = type(n).prop(lz_tree.NodeProp["openedBy"]);
if (squint_core.nil_QMARK_(G__1314)) {
return null;} else {
return G__1314[0];}
})
;
var name = (function (node) {
return node["name"];
})
;
var error_QMARK_ = (function (node) {
return error_type_QMARK_(node);
})
;
var top_QMARK_ = (function (node) {
return top_type_QMARK_(type(node));
})
;
var program_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("Program", name(node));
})
;
var string_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("String", name(node));
})
;
var regexp_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("RegExp", name(node));
})
;
var line_comment_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("LineComment", name(node));
})
;
var discard_QMARK_ = (function (node) {
return squint_core.identical_QMARK_("Discard", name(node));
})
;
null;
var coll_QMARK_ = (function (node) {
return coll_type_QMARK_(type(node));
})
;
var terminal_type_QMARK_ = (function (node_type) {
if (top_type_QMARK_(node_type)) {
return false;} else {
if (node_type.prop(prefix_coll_prop)) {
return false;} else {
if (node_type.prop(coll_prop)) {
return false;} else {
if (squint_core.identical_QMARK_("Meta", name(node_type))) {
return false;} else {
if (squint_core.identical_QMARK_("TaggedLiteral", name(node_type))) {
return false;} else {
if (squint_core.identical_QMARK_("ConstructorCall", name(node_type))) {
return false;} else {
if ("else") {
return true;} else {
return null;}}}}}}}
})
;
j.defn(balanced_QMARK_, [({ "as": node, "keys": [firstChild, lastChild] })], (function () {
 let temp__24970__auto__15 = closed_by(firstChild);
if (temp__24970__auto__15) {
let closing16 = temp__24970__auto__15;
return ((closing16 === name(lastChild)) && (end(firstChild) !== end(lastChild)));} else {
return true;}
})());
var ancestors = (function (node) {
let temp__25231__auto__17 = up(node);
if (squint_core.nil_QMARK_(temp__25231__auto__17)) {
return null;} else {
let parent18 = temp__25231__auto__17;
return squint_core.cons(parent18, new squint_core.LazySeq((function () {
return ancestors(parent18);
})));}
})
;
var closest = (function (node, pred) {
if (pred(node)) {
return node;} else {
return squint_core.reduce((function (_, x) {
if (pred(x)) {
return squint_core.reduced(x);}
}), null, ancestors(node));}
})
;
var highest = (function (node, pred) {
return squint_core.reduce((function (found, x) {
if (pred(x)) {
return x;} else {
return squint_core.reduced(found);}
}), null, squint_core.cons(node, ancestors(node)));
})
;
var children = (function () {
 let f19 = (function (var_args) {
let G__2223 = arguments["length"];
switch (G__2223) {case 3:
return f19.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
case 1:
return f19.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f19["cljs$core$IFn$_invoke$arity$3"] = (function (parent, from, dir) {
let temp__25231__auto__25 = (function () {
 let G__2627 = dir;
switch (G__2627) {case 1:
return parent.childAfter(from);
break;
case -1:
return parent.childBefore(from);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__2627))}
})();
if (squint_core.nil_QMARK_(temp__25231__auto__25)) {
return null;} else {
let child29 = temp__25231__auto__25;
return squint_core.cons(child29, new squint_core.LazySeq((function () {
return children(parent, (function () {
 let G__3031 = dir;
switch (G__3031) {case 1:
return end(child29);
break;
case -1:
return start(child29);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3031))}
})(), dir);
})));}
});
f19["cljs$core$IFn$_invoke$arity$1"] = (function (subtree) {
return children(subtree, start(subtree), 1);
});
f19["cljs$lang$maxFixedArity"] = 3;
return f19;
})()
;
var eq_QMARK_ = (function (x, y) {
return ((start(x) == start(y)) && (end(x) == end(y)) && (depth(x) == depth(y)));
})
;
var empty_QMARK_ = (function (node) {
let type_name33 = name(node);
if (coll_QMARK_(node)) {
return eq_QMARK_(right(down(node)), down_last(node));} else {
if (("String" === type_name33)) {
return (end(down(node)) == start(down_last(node)));} else {
if ("else") {
return false;} else {
return null;}}}
})
;
var from_to = (function () {
 let f34 = (function (var_args) {
let G__3738 = arguments["length"];
switch (G__3738) {case 2:
return f34.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 1:
return f34.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f34["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
return ({ "from": from, "to": to });
});
f34["cljs$core$IFn$_invoke$arity$1"] = (function (node) {
return from_to(start(node), end(node));
});
f34["cljs$lang$maxFixedArity"] = 2;
return f34;
})()
;
var range = (function (node) {
return sel.range(start(node), end(node));
})
;
var string = (function () {
 let f40 = (function (var_args) {
let G__4344 = arguments["length"];
switch (G__4344) {case 2:
return f40.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f40.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f40["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return string(state, start(node), end(node));
});
f40["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
return state["doc"].sliceString(from, to, "\n");
});
f40["cljs$lang$maxFixedArity"] = 3;
return f40;
})()
;
var ancestor_QMARK_ = (function (parent, child) {
return squint_core.boolean$(((start(parent) <= start(child)) && (end(parent) >= end(child)) && (depth(parent) < depth(child))));
})
;
var move_toward = (function (node, to_node) {
if (eq_QMARK_(node, to_node)) {
return null;} else {
let G__4647 = compare(start(to_node), start(node));
switch (G__4647) {case 0:
if (ancestor_QMARK_(to_node, node)) {
return up(node);} else {
if (ancestor_QMARK_(node, to_node)) {
return down(node);} else {
return null;}}
break;
case -1:
if (ancestor_QMARK_(node, to_node)) {
return down_last(node);} else {
return (left(node) || up(node));}
break;
case 1:
if (ancestor_QMARK_(node, to_node)) {
return down(node);} else {
return (right(node) || up(node));}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__4647))}}
})
;
var nodes_between = (function (node, to_node) {
return squint_core.take_while(squint_core.identity, iterate((function (_PERCENT_1) {
return move_toward(_PERCENT_1, to_node);
}), node));
})
;
var require_balance_QMARK_ = (function (node) {
return (coll_QMARK_(node) || string_QMARK_(node) || regexp_QMARK_(node));
})
;
var tree = (function () {
 let f49 = (function (var_args) {
let G__5253 = arguments["length"];
switch (G__5253) {case 1:
return f49.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f49.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f49.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f49["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return language.syntaxTree(state);
});
f49["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return language.syntaxTree(state).resolveInner(pos);
});
f49["cljs$core$IFn$_invoke$arity$3"] = (function (state, pos, dir) {
return language.syntaxTree(state).resolveInner(pos, dir);
});
f49["cljs$lang$maxFixedArity"] = 3;
return f49;
})()
;
var cursor = (function () {
 let f55 = (function (var_args) {
let G__5859 = arguments["length"];
switch (G__5859) {case 1:
return f55.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f55.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f55.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f55["cljs$core$IFn$_invoke$arity$1"] = (function (tree) {
return tree.cursor();
});
f55["cljs$core$IFn$_invoke$arity$2"] = (function (tree, pos) {
return tree.cursorAt(pos);
});
f55["cljs$core$IFn$_invoke$arity$3"] = (function (tree, pos, dir) {
return tree.cursorAt(pos, dir);
});
f55["cljs$lang$maxFixedArity"] = 3;
return f55;
})()
;
var terminal_cursor = (function (tree, pos, dir) {
let i61 = pos;
while(true){
let c62 = cursor(tree, i61, dir);
let type63 = c62["type"];
if (top_type_QMARK_(type63)) {
return null;} else {
if (terminal_type_QMARK_(c62["type"])) {
return c62;} else {
if ("else") {
let G__64 = (dir + i61);
i61 = G__64;
continue;
} else {
return null;}}};break;
}

})
;
var up_here = (function (node) {
let from65 = start(node);
return (highest(node, (function (_PERCENT_1) {
return (from65 === start(_PERCENT_1));
})) || node);
})
;
var topmost_cursor = (function (state, from) {
return up_here(tree(state, from, 1)["node"]).cursor();
})
;
var terminal_nodes = (function (state, from, to) {
let cursor66 = topmost_cursor(state, from);
let found67 = [];
while(true){
let node_type68 = type(cursor66);
if ((start(cursor66) > to)) {
return found67;} else {
if ((terminal_type_QMARK_(node_type68) || error_QMARK_(node_type68))) {
let found69 = squint_core.conj(found67, ({ "type": node_type68, "from": start(cursor66), "to": end(cursor66) }));
cursor66.lastChild();
if (cursor66.next()) {
let G__70 = found69;
found67 = G__70;
continue;
} else {
return found69;}} else {
if ("else") {
if (cursor66.next()) {
let G__71 = found67;
found67 = G__71;
continue;
} else {
return found67;}} else {
return null;}}};break;
}

})
;
j.defn(balanced_range, [state, node](balanced_range(state, start(node), end(node))), [state, from, to]((function () {
 let vec__7278 = squint_core.sort([from, to]);
let from79 = squint_core.nth(vec__7278, 0, null);
let to80 = squint_core.nth(vec__7278, 1, null);
let from_node81 = tree(state, from79, 1);
let to_node82 = tree(state, to80, -1);
let from83 = (require_balance_QMARK_(from_node81)) ? (start(from_node81)) : (from79);
let to84 = (require_balance_QMARK_(to_node82)) ? (end(to_node82)) : (to80);
let vec__7585 = squint_core.reduce((function (p__86, node_between) {
let vec__8790 = p__86;
let left91 = squint_core.nth(vec__8790, 0, null);
let right92 = squint_core.nth(vec__8790, 1, null);
return [(ancestor_QMARK_(node_between, from_node81)) ? (start(node_between)) : (left91), (ancestor_QMARK_(node_between, to_node82)) ? (end(node_between)) : (right92)];
}), [from83, to84], squint_core.map((function (_PERCENT_1) {
let G__9394 = _PERCENT_1;
if (edge_QMARK_(_PERCENT_1)) {
return up(G__9394);} else {
return G__9394;}
}), nodes_between(from_node81, to_node82)));
let left95 = squint_core.nth(vec__7585, 0, null);
let right96 = squint_core.nth(vec__7585, 1, null);
return sel.range(left95, right96);
})()));
j.defn(inner_span, "Span of collection not including edges", [({ "as": node, "keys": [firstChild, lastChild] })], ({ "from": (left_edge_QMARK_(firstChild)) ? (end(firstChild)) : (start(node)), "to": (right_edge_QMARK_(lastChild)) ? (start(lastChild)) : (end(node)) }));
var within_QMARK__LT_ = (function (parent, child) {
let c197 = compare(start(parent), start(child));
let c298 = compare(end(parent), end(child));
return ((squint_core.pos_QMARK_(c197) || squint_core.neg_QMARK_(c298)) && !squint_core.neg_QMARK_(c197) && !squint_core.pos_QMARK_(c298));
})
;
var within_QMARK_ = (function (parent, child) {
return (!squint_core.neg_QMARK_(compare(start(parent), start(child))) && !squint_core.pos_QMARK_(compare(end(parent), end(child))));
})
;
var follow_edges = (function (node) {
if (edge_QMARK_(node)) {
return up(node);} else {
return node;}
})
;
var prefix = (function (node) {
let temp__25231__auto__99 = up(node);
if (squint_core.nil_QMARK_(temp__25231__auto__99)) {
return null;} else {
let parent100 = temp__25231__auto__99;
return (u.guard(parent100, prefix_container_QMARK_) || u.guard(down(parent100), prefix_edge_QMARK_));}
})
;
var left_edge_with_prefix = (function (state, node) {
return squint_core.str((function () {
 let G__101102 = prefix(node);
if (squint_core.nil_QMARK_(G__101102)) {
return null;} else {
return string(state, G__101102);}
})(), name(down(node)));
})
;
var with_prefix = (function (node) {
let G__103104 = node;
if (prefix(node)) {
return up(G__103104);} else {
return G__103104;}
})
;
var node_BAR_ = (function (state, pos) {
let G__105106 = tree(state, pos, -1);
if (squint_core.nil_QMARK_(G__105106)) {
return null;} else {
return u.guard(G__105106, (function (_PERCENT_1) {
return (pos === end(_PERCENT_1));
}));}
})
;
var _BAR_node = (function (state, pos) {
let G__107108 = tree(state, pos, 1);
if (squint_core.nil_QMARK_(G__107108)) {
return null;} else {
return u.guard(G__107108, (function (_PERCENT_1) {
return (pos === start(_PERCENT_1));
}));}
})
;
var nearest_touching = (function (state, pos, dir) {
let L109 = (function () {
 let G__110111 = tree(state, pos, -1);
if (squint_core.nil_QMARK_(G__110111)) {
return null;} else {
return u.guard(G__110111, j.fn([({ "keys": [to] })], (pos === to)));}
})();
let R112 = (function () {
 let G__113114 = tree(state, pos, 1);
if (squint_core.nil_QMARK_(G__113114)) {
return null;} else {
return u.guard(G__113114, j.fn([({ "keys": [from] })], (pos === from)));}
})();
let mid115 = tree(state, pos);
let G__116117 = dir;
switch (G__116117) {case 1:
return (u.guard(R112, every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
return (same_edge_QMARK_(_PERCENT_1) || !right_edge_QMARK_(_PERCENT_1));
}))) || L109 || R112 || mid115);
break;
case -1:
return (u.guard(L109, every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
return (same_edge_QMARK_(_PERCENT_1) || !left_edge_QMARK_(_PERCENT_1));
}))) || R112 || L109 || mid115);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__116117))}
})
;
var embedded_QMARK_ = (function () {
 let f119 = (function (var_args) {
let G__122123 = arguments["length"];
switch (G__122123) {case 1:
return f119.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f119.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f119["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return embedded_QMARK_(state, state["selection"]["main"]["head"]);
});
f119["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return squint_core.identical_QMARK_(lezer_markdown.parser.nodeTypes["FencedCode"], state["tree"].resolve(pos)["type"]["id"]);
});
f119["cljs$lang$maxFixedArity"] = 2;
return f119;
})()
;
var within_program_QMARK_ = (function () {
 let f125 = (function (var_args) {
let G__128129 = arguments["length"];
switch (G__128129) {case 1:
return f125.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f125.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f125["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return within_program_QMARK_(state, state["selection"]["main"]["head"]);
});
f125["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
let n131 = tree(state, pos);
return (program_QMARK_(n131) || squint_core.some(program_QMARK_, ancestors(n131)));
});
f125["cljs$lang$maxFixedArity"] = 2;
return f125;
})()
;
null;

export { end_edge_prop, ancestors, range, string_QMARK_, within_QMARK__LT_, edge_QMARK_, right, terminal_nodes, string, same_edge_type_QMARK_, up, line_comment_QMARK_, prefix_coll_prop, prefix, left_edge_with_prefix, top_QMARK_, empty_QMARK_, terminal_type_QMARK_, left_edge_type_QMARK_, children, nodes_between, prefix_edge_QMARK_, discard_QMARK_, right_edge_type_QMARK_, prefix_container_QMARK_, topmost_cursor, coll_prop, closed_by, error_QMARK_, _BAR_node, start_edge_type_QMARK_, prefix_container_prop, down_last, prefix_QMARK_, name, same_edge_QMARK_, prefix_container_type_QMARK_, rights, with_prefix, start, tree, closest, cursor, node_prop, from_to, follow_edges, start_edge_QMARK_, highest, embedded_QMARK_, opened_by, coll_QMARK_, down, type, terminal_cursor, within_QMARK_, depth, prefix_type_QMARK_, same_edge_prop, nearest_touching, regexp_QMARK_, top_type_QMARK_, error_type_QMARK_, up_here, ancestor_QMARK_, end_edge_type_QMARK_, right_edge_QMARK_, start_edge_prop, prefix_edge_prop, node_BAR_, left_edge_QMARK_, coll_type_QMARK_, lefts, require_balance_QMARK_, end, prefix_edge_type_QMARK_, within_program_QMARK_, left, end_edge_QMARK_, program_QMARK_, move_toward, eq_QMARK_ }