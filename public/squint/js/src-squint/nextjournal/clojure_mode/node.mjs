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
let temp__25216__auto__6 = up(node4);
if (squint_core.nil_QMARK_(temp__25216__auto__6)) {
return i5;} else {
let parent7 = temp__25216__auto__6;
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
var balanced_QMARK_ = (function (p__15) {
let map__1617 = p__15;
let node18 = map__1617;
let firstChild19 = squint_core.get(map__1617, "firstChild");
let lastChild20 = squint_core.get(map__1617, "lastChild");
let temp__25170__auto__21 = closed_by(firstChild19);
if (temp__25170__auto__21) {
let closing22 = temp__25170__auto__21;
return ((closing22 === name(lastChild20)) && (end(firstChild19) !== end(lastChild20)));} else {
return true;}
})
;
var ancestors = (function (node) {
let temp__25350__auto__23 = up(node);
if (squint_core.nil_QMARK_(temp__25350__auto__23)) {
return null;} else {
let parent24 = temp__25350__auto__23;
return squint_core.cons(parent24, new squint_core.LazySeq((function () {
return ancestors(parent24);
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
 let f25 = (function (var_args) {
let G__2829 = arguments["length"];
switch (G__2829) {case 3:
return f25.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
case 1:
return f25.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f25["cljs$core$IFn$_invoke$arity$3"] = (function (parent, from, dir) {
let temp__25350__auto__31 = (function () {
 let G__3233 = dir;
switch (G__3233) {case 1:
return parent.childAfter(from);
break;
case -1:
return parent.childBefore(from);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3233))}
})();
if (squint_core.nil_QMARK_(temp__25350__auto__31)) {
return null;} else {
let child35 = temp__25350__auto__31;
return squint_core.cons(child35, new squint_core.LazySeq((function () {
return children(parent, (function () {
 let G__3637 = dir;
switch (G__3637) {case 1:
return end(child35);
break;
case -1:
return start(child35);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__3637))}
})(), dir);
})));}
});
f25["cljs$core$IFn$_invoke$arity$1"] = (function (subtree) {
return children(subtree, start(subtree), 1);
});
f25["cljs$lang$maxFixedArity"] = 3;
return f25;
})()
;
var eq_QMARK_ = (function (x, y) {
return ((start(x) == start(y)) && (end(x) == end(y)) && (depth(x) == depth(y)));
})
;
var empty_QMARK_ = (function (node) {
let type_name39 = name(node);
if (coll_QMARK_(node)) {
return eq_QMARK_(right(down(node)), down_last(node));} else {
if (("String" === type_name39)) {
return (end(down(node)) == start(down_last(node)));} else {
if ("else") {
return false;} else {
return null;}}}
})
;
var from_to = (function () {
 let f40 = (function (var_args) {
let G__4344 = arguments["length"];
switch (G__4344) {case 2:
return f40.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 1:
return f40.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f40["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
return ({ "from": from, "to": to });
});
f40["cljs$core$IFn$_invoke$arity$1"] = (function (node) {
return from_to(start(node), end(node));
});
f40["cljs$lang$maxFixedArity"] = 2;
return f40;
})()
;
var range = (function (node) {
return sel.range(start(node), end(node));
})
;
var string = (function () {
 let f46 = (function (var_args) {
let G__4950 = arguments["length"];
switch (G__4950) {case 2:
return f46.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f46.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f46["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return string(state, start(node), end(node));
});
f46["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
return state["doc"].sliceString(from, to, "\n");
});
f46["cljs$lang$maxFixedArity"] = 3;
return f46;
})()
;
var ancestor_QMARK_ = (function (parent, child) {
return squint_core.boolean$(((start(parent) <= start(child)) && (end(parent) >= end(child)) && (depth(parent) < depth(child))));
})
;
var move_toward = (function (node, to_node) {
if (eq_QMARK_(node, to_node)) {
return null;} else {
let G__5253 = compare(start(to_node), start(node));
switch (G__5253) {case 0:
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
throw new Error(squint_core.str("No matching clause: ", G__5253))}}
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
f55["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return language.syntaxTree(state);
});
f55["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return language.syntaxTree(state).resolveInner(pos);
});
f55["cljs$core$IFn$_invoke$arity$3"] = (function (state, pos, dir) {
return language.syntaxTree(state).resolveInner(pos, dir);
});
f55["cljs$lang$maxFixedArity"] = 3;
return f55;
})()
;
var cursor = (function () {
 let f61 = (function (var_args) {
let G__6465 = arguments["length"];
switch (G__6465) {case 1:
return f61.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f61.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f61.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f61["cljs$core$IFn$_invoke$arity$1"] = (function (tree) {
return tree.cursor();
});
f61["cljs$core$IFn$_invoke$arity$2"] = (function (tree, pos) {
return tree.cursorAt(pos);
});
f61["cljs$core$IFn$_invoke$arity$3"] = (function (tree, pos, dir) {
return tree.cursorAt(pos, dir);
});
f61["cljs$lang$maxFixedArity"] = 3;
return f61;
})()
;
var terminal_cursor = (function (tree, pos, dir) {
let i67 = pos;
while(true){
let c68 = cursor(tree, i67, dir);
let type69 = c68["type"];
if (top_type_QMARK_(type69)) {
return null;} else {
if (terminal_type_QMARK_(c68["type"])) {
return c68;} else {
if ("else") {
let G__70 = (dir + i67);
i67 = G__70;
continue;
} else {
return null;}}};break;
}

})
;
var up_here = (function (node) {
let from71 = start(node);
return (highest(node, (function (_PERCENT_1) {
return (from71 === start(_PERCENT_1));
})) || node);
})
;
var topmost_cursor = (function (state, from) {
return up_here(tree(state, from, 1)["node"]).cursor();
})
;
var terminal_nodes = (function (state, from, to) {
let cursor72 = topmost_cursor(state, from);
let found73 = [];
while(true){
let node_type74 = type(cursor72);
if ((start(cursor72) > to)) {
return found73;} else {
if ((terminal_type_QMARK_(node_type74) || error_QMARK_(node_type74))) {
let found75 = squint_core.conj(found73, ({ "type": node_type74, "from": start(cursor72), "to": end(cursor72) }));
cursor72.lastChild();
if (cursor72.next()) {
let G__76 = found75;
found73 = G__76;
continue;
} else {
return found75;}} else {
if ("else") {
if (cursor72.next()) {
let G__77 = found73;
found73 = G__77;
continue;
} else {
return found73;}} else {
return null;}}};break;
}

})
;
var balanced_range = (function () {
 let f78 = (function (var_args) {
let G__8182 = arguments["length"];
switch (G__8182) {case 2:
return f78.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f78.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f78["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return balanced_range(state, start(node), end(node));
});
f78["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
let vec__8490 = squint_core.sort([from, to]);
let from91 = squint_core.nth(vec__8490, 0, null);
let to92 = squint_core.nth(vec__8490, 1, null);
let from_node93 = tree(state, from91, 1);
let to_node94 = tree(state, to92, -1);
let from95 = (require_balance_QMARK_(from_node93)) ? (start(from_node93)) : (from91);
let to96 = (require_balance_QMARK_(to_node94)) ? (end(to_node94)) : (to92);
let vec__8797 = squint_core.reduce((function (p__98, node_between) {
let vec__99102 = p__98;
let left103 = squint_core.nth(vec__99102, 0, null);
let right104 = squint_core.nth(vec__99102, 1, null);
return [(ancestor_QMARK_(node_between, from_node93)) ? (start(node_between)) : (left103), (ancestor_QMARK_(node_between, to_node94)) ? (end(node_between)) : (right104)];
}), [from95, to96], squint_core.map((function (_PERCENT_1) {
let G__105106 = _PERCENT_1;
if (edge_QMARK_(_PERCENT_1)) {
return up(G__105106);} else {
return G__105106;}
}), nodes_between(from_node93, to_node94)));
let left107 = squint_core.nth(vec__8797, 0, null);
let right108 = squint_core.nth(vec__8797, 1, null);
return sel.range(left107, right108);
});
f78["cljs$lang$maxFixedArity"] = 3;
return f78;
})()
;
var inner_span = (function (p__109) {
let map__110111 = p__109;
let node112 = map__110111;
let firstChild113 = squint_core.get(map__110111, "firstChild");
let lastChild114 = squint_core.get(map__110111, "lastChild");
return ({ "from": (left_edge_QMARK_(firstChild113)) ? (end(firstChild113)) : (start(node112)), "to": (right_edge_QMARK_(lastChild114)) ? (start(lastChild114)) : (end(node112)) });
})
;
var within_QMARK__LT_ = (function (parent, child) {
let c1115 = compare(start(parent), start(child));
let c2116 = compare(end(parent), end(child));
return ((squint_core.pos_QMARK_(c1115) || squint_core.neg_QMARK_(c2116)) && !squint_core.neg_QMARK_(c1115) && !squint_core.pos_QMARK_(c2116));
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
let temp__25350__auto__117 = up(node);
if (squint_core.nil_QMARK_(temp__25350__auto__117)) {
return null;} else {
let parent118 = temp__25350__auto__117;
return (u.guard(parent118, prefix_container_QMARK_) || u.guard(down(parent118), prefix_edge_QMARK_));}
})
;
var left_edge_with_prefix = (function (state, node) {
return squint_core.str((function () {
 let G__119120 = prefix(node);
if (squint_core.nil_QMARK_(G__119120)) {
return null;} else {
return string(state, G__119120);}
})(), name(down(node)));
})
;
var with_prefix = (function (node) {
let G__121122 = node;
if (prefix(node)) {
return up(G__121122);} else {
return G__121122;}
})
;
var node_BAR_ = (function (state, pos) {
let G__123124 = tree(state, pos, -1);
if (squint_core.nil_QMARK_(G__123124)) {
return null;} else {
return u.guard(G__123124, (function (_PERCENT_1) {
return (pos === end(_PERCENT_1));
}));}
})
;
var _BAR_node = (function (state, pos) {
let G__125126 = tree(state, pos, 1);
if (squint_core.nil_QMARK_(G__125126)) {
return null;} else {
return u.guard(G__125126, (function (_PERCENT_1) {
return (pos === start(_PERCENT_1));
}));}
})
;
var nearest_touching = (function (state, pos, dir) {
let L127 = (function () {
 let G__128129 = tree(state, pos, -1);
if (squint_core.nil_QMARK_(G__128129)) {
return null;} else {
return u.guard(G__128129, (function (p__130) {
let map__131132 = p__130;
let to133 = squint_core.get(map__131132, "to");
return (pos === to133);
}));}
})();
let R134 = (function () {
 let G__135136 = tree(state, pos, 1);
if (squint_core.nil_QMARK_(G__135136)) {
return null;} else {
return u.guard(G__135136, (function (p__137) {
let map__138139 = p__137;
let from140 = squint_core.get(map__138139, "from");
return (pos === from140);
}));}
})();
let mid141 = tree(state, pos);
let G__142143 = dir;
switch (G__142143) {case 1:
return (u.guard(R134, every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
return (same_edge_QMARK_(_PERCENT_1) || !right_edge_QMARK_(_PERCENT_1));
}))) || L127 || R134 || mid141);
break;
case -1:
return (u.guard(L127, every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
return (same_edge_QMARK_(_PERCENT_1) || !left_edge_QMARK_(_PERCENT_1));
}))) || R134 || L127 || mid141);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__142143))}
})
;
var embedded_QMARK_ = (function () {
 let f145 = (function (var_args) {
let G__148149 = arguments["length"];
switch (G__148149) {case 1:
return f145.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f145.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f145["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return embedded_QMARK_(state, state["selection"]["main"]["head"]);
});
f145["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return squint_core.identical_QMARK_(lezer_markdown.parser.nodeTypes["FencedCode"], state["tree"].resolve(pos)["type"]["id"]);
});
f145["cljs$lang$maxFixedArity"] = 2;
return f145;
})()
;
var within_program_QMARK_ = (function () {
 let f151 = (function (var_args) {
let G__154155 = arguments["length"];
switch (G__154155) {case 1:
return f151.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f151.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f151["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return within_program_QMARK_(state, state["selection"]["main"]["head"]);
});
f151["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
let n157 = tree(state, pos);
return (program_QMARK_(n157) || squint_core.some(program_QMARK_, ancestors(n157)));
});
f151["cljs$lang$maxFixedArity"] = 2;
return f151;
})()
;
squint_core.prn("node-loaded");
null;

export { end_edge_prop, ancestors, range, string_QMARK_, within_QMARK__LT_, edge_QMARK_, right, terminal_nodes, string, same_edge_type_QMARK_, up, line_comment_QMARK_, prefix_coll_prop, prefix, left_edge_with_prefix, top_QMARK_, empty_QMARK_, terminal_type_QMARK_, left_edge_type_QMARK_, children, nodes_between, prefix_edge_QMARK_, discard_QMARK_, right_edge_type_QMARK_, balanced_range, prefix_container_QMARK_, topmost_cursor, coll_prop, closed_by, error_QMARK_, _BAR_node, balanced_QMARK_, start_edge_type_QMARK_, prefix_container_prop, down_last, prefix_QMARK_, name, same_edge_QMARK_, prefix_container_type_QMARK_, rights, with_prefix, start, tree, closest, cursor, node_prop, from_to, follow_edges, start_edge_QMARK_, highest, embedded_QMARK_, opened_by, coll_QMARK_, down, type, terminal_cursor, within_QMARK_, inner_span, depth, prefix_type_QMARK_, same_edge_prop, nearest_touching, regexp_QMARK_, top_type_QMARK_, error_type_QMARK_, up_here, ancestor_QMARK_, end_edge_type_QMARK_, right_edge_QMARK_, start_edge_prop, prefix_edge_prop, node_BAR_, left_edge_QMARK_, coll_type_QMARK_, lefts, require_balance_QMARK_, end, prefix_edge_type_QMARK_, within_program_QMARK_, left, end_edge_QMARK_, program_QMARK_, move_toward, eq_QMARK_ }
