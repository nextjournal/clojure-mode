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
let G__778779 = prop_name;
switch (G__778779) {case "prefixColl":
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
throw new Error(squint_core.str("No matching clause: ", G__778779))}
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
return node["to"];
})
;
var up = (function (node) {
return node["parent"];
})
;
var down = (function (node) {
return node["firstChild"];
})
;
var down_last = (function (node) {
return node["lastChild"];
})
;
var depth = (function (node) {
let node781 = node;
let i782 = 0;
while(true){
let temp__31789__auto__783 = up(node781);
let test__60965__auto__784 = squint_core.nil_QMARK_(temp__31789__auto__783);
if (test__60965__auto__784 != null && test__60965__auto__784 !== false) {
return i782;} else {
let parent785 = temp__31789__auto__783;
let G__786 = parent785;
let G__787 = (i782 + 1);
node781 = G__786;
i782 = G__787;
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
return squint_core.take_while(squint_core.identity, squint_core.iterate(left, left(node)));
})
;
var right = (function (node) {
return up(node).childAfter(end(node));
})
;
var rights = (function (node) {
return squint_core.take_while(squint_core.identity, squint_core.iterate(right, right(node)));
})
;
var coll_type_QMARK_ = (function (node_type) {
return node_type.prop(coll_prop);
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
let or__32239__auto__788 = start_edge_type_QMARK_(t);
if (or__32239__auto__788 != null && or__32239__auto__788 !== false) {
return or__32239__auto__788;} else {
let or__32239__auto__789 = same_edge_type_QMARK_(t);
if (or__32239__auto__789 != null && or__32239__auto__789 !== false) {
return or__32239__auto__789;} else {
return prefix_edge_type_QMARK_(t);}}
})
;
var left_edge_QMARK_ = (function (n) {
return left_edge_type_QMARK_(type(n));
})
;
var right_edge_type_QMARK_ = (function (t) {
let or__32239__auto__790 = end_edge_type_QMARK_(t);
if (or__32239__auto__790 != null && or__32239__auto__790 !== false) {
return or__32239__auto__790;} else {
return same_edge_type_QMARK_(t);}
})
;
var right_edge_QMARK_ = (function (n) {
return right_edge_type_QMARK_(type(n));
})
;
var edge_QMARK_ = (function (n) {
let t791 = type(n);
let or__32239__auto__792 = start_edge_type_QMARK_(t791);
if (or__32239__auto__792 != null && or__32239__auto__792 !== false) {
return or__32239__auto__792;} else {
let or__32239__auto__793 = end_edge_type_QMARK_(t791);
if (or__32239__auto__793 != null && or__32239__auto__793 !== false) {
return or__32239__auto__793;} else {
let or__32239__auto__794 = same_edge_type_QMARK_(t791);
if (or__32239__auto__794 != null && or__32239__auto__794 !== false) {
return or__32239__auto__794;} else {
return prefix_type_QMARK_(t791);}}}
})
;
var closed_by = (function (n) {
let G__795796 = type(n).prop(lz_tree.NodeProp["closedBy"]);
let test__60965__auto__797 = squint_core.nil_QMARK_(G__795796);
if (test__60965__auto__797 != null && test__60965__auto__797 !== false) {
return null;} else {
return G__795796[0];}
})
;
var opened_by = (function (n) {
let G__798799 = type(n).prop(lz_tree.NodeProp["openedBy"]);
let test__60965__auto__800 = squint_core.nil_QMARK_(G__798799);
if (test__60965__auto__800 != null && test__60965__auto__800 !== false) {
return null;} else {
return G__798799[0];}
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
let test__60965__auto__801 = top_type_QMARK_(node_type);
if (test__60965__auto__801 != null && test__60965__auto__801 !== false) {
return false;} else {
let test__60965__auto__802 = node_type.prop(prefix_coll_prop);
if (test__60965__auto__802 != null && test__60965__auto__802 !== false) {
return false;} else {
let test__60965__auto__803 = node_type.prop(coll_prop);
if (test__60965__auto__803 != null && test__60965__auto__803 !== false) {
return false;} else {
let test__60965__auto__804 = squint_core.identical_QMARK_("Meta", name(node_type));
if (test__60965__auto__804 != null && test__60965__auto__804 !== false) {
return false;} else {
let test__60965__auto__805 = squint_core.identical_QMARK_("TaggedLiteral", name(node_type));
if (test__60965__auto__805 != null && test__60965__auto__805 !== false) {
return false;} else {
let test__60965__auto__806 = squint_core.identical_QMARK_("ConstructorCall", name(node_type));
if (test__60965__auto__806 != null && test__60965__auto__806 !== false) {
return false;} else {
let test__60965__auto__807 = "else";
if (test__60965__auto__807 != null && test__60965__auto__807 !== false) {
return true;} else {
return null;}}}}}}}
})
;
var balanced_QMARK_ = (function (p__808) {
let map__809810 = p__808;
let _node811 = map__809810;
let firstChild812 = squint_core.get(map__809810, "firstChild");
let lastChild813 = squint_core.get(map__809810, "lastChild");
let temp__31754__auto__814 = closed_by(firstChild812);
if (temp__31754__auto__814 != null && temp__31754__auto__814 !== false) {
let closing815 = temp__31754__auto__814;
let and__32262__auto__816 = (closing815 === name(lastChild813));
if (and__32262__auto__816 != null && and__32262__auto__816 !== false) {
return (end(firstChild812) !== end(lastChild813));} else {
return and__32262__auto__816;}} else {
return true;}
})
;
var ancestors = (function (node) {
let temp__31858__auto__817 = up(node);
let test__60965__auto__818 = squint_core.nil_QMARK_(temp__31858__auto__817);
if (test__60965__auto__818 != null && test__60965__auto__818 !== false) {
return null;} else {
let parent819 = temp__31858__auto__817;
return squint_core.cons(parent819, new squint_core.LazySeq((function () {
return ancestors(parent819);
})));}
})
;
var closest = (function (node, pred) {
let test__60965__auto__820 = pred(node);
if (test__60965__auto__820 != null && test__60965__auto__820 !== false) {
return node;} else {
return squint_core.reduce((function (_, x) {
let test__60965__auto__821 = pred(x);
if (test__60965__auto__821 != null && test__60965__auto__821 !== false) {
return squint_core.reduced(x);}
}), null, ancestors(node));}
})
;
var highest = (function (node, pred) {
return squint_core.reduce((function (found, x) {
let test__60965__auto__822 = pred(x);
if (test__60965__auto__822 != null && test__60965__auto__822 !== false) {
return x;} else {
return squint_core.reduced(found);}
}), null, squint_core.cons(node, ancestors(node)));
})
;
var children = (function () {
 let f823 = (function (var_args) {
let G__826827 = arguments["length"];
switch (G__826827) {case 3:
return f823.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
case 1:
return f823.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f823["cljs$core$IFn$_invoke$arity$3"] = (function (parent, from, dir) {
let temp__31858__auto__829 = (function () {
 let G__830831 = dir;
switch (G__830831) {case 1:
return parent.childAfter(from);
break;
case -1:
return parent.childBefore(from);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__830831))}
})();
let test__60965__auto__833 = squint_core.nil_QMARK_(temp__31858__auto__829);
if (test__60965__auto__833 != null && test__60965__auto__833 !== false) {
return null;} else {
let child834 = temp__31858__auto__829;
return squint_core.cons(child834, new squint_core.LazySeq((function () {
return children(parent, (function () {
 let G__835836 = dir;
switch (G__835836) {case 1:
return end(child834);
break;
case -1:
return start(child834);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__835836))}
})(), dir);
})));}
});
f823["cljs$core$IFn$_invoke$arity$1"] = (function (subtree) {
return children(subtree, start(subtree), 1);
});
f823["cljs$lang$maxFixedArity"] = 3;
return f823;
})()
;
var eq_QMARK_ = (function (x, y) {
let and__32262__auto__838 = (start(x) == start(y));
if (and__32262__auto__838 != null && and__32262__auto__838 !== false) {
let and__32262__auto__839 = (end(x) == end(y));
if (and__32262__auto__839 != null && and__32262__auto__839 !== false) {
return (depth(x) == depth(y));} else {
return and__32262__auto__839;}} else {
return and__32262__auto__838;}
})
;
var empty_QMARK_ = (function (node) {
let type_name840 = name(node);
let test__60965__auto__841 = coll_QMARK_(node);
if (test__60965__auto__841 != null && test__60965__auto__841 !== false) {
return eq_QMARK_(right(down(node)), down_last(node));} else {
let test__60965__auto__842 = ("String" === type_name840);
if (test__60965__auto__842 != null && test__60965__auto__842 !== false) {
return (end(down(node)) == start(down_last(node)));} else {
let test__60965__auto__843 = "else";
if (test__60965__auto__843 != null && test__60965__auto__843 !== false) {
return false;} else {
return null;}}}
})
;
var from_to = (function () {
 let f844 = (function (var_args) {
let G__847848 = arguments["length"];
switch (G__847848) {case 2:
return f844.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 1:
return f844.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f844["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
return ({ "from": from, "to": to });
});
f844["cljs$core$IFn$_invoke$arity$1"] = (function (node) {
return from_to(start(node), end(node));
});
f844["cljs$lang$maxFixedArity"] = 2;
return f844;
})()
;
var range = (function (node) {
return sel.range(start(node), end(node));
})
;
var string = (function () {
 let f850 = (function (var_args) {
let G__853854 = arguments["length"];
switch (G__853854) {case 2:
return f850.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f850.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f850["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return string(state, start(node), end(node));
});
f850["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
return state["doc"].sliceString(from, to, "\n");
});
f850["cljs$lang$maxFixedArity"] = 3;
return f850;
})()
;
var ancestor_QMARK_ = (function (parent, child) {
return squint_core.boolean$((function () {
 let and__32262__auto__856 = (start(parent) <= start(child));
if (and__32262__auto__856 != null && and__32262__auto__856 !== false) {
let and__32262__auto__857 = (end(parent) >= end(child));
if (and__32262__auto__857 != null && and__32262__auto__857 !== false) {
return (depth(parent) < depth(child));} else {
return and__32262__auto__857;}} else {
return and__32262__auto__856;}
})());
})
;
var move_toward = (function (node, to_node) {
let test__60965__auto__858 = eq_QMARK_(node, to_node);
if (test__60965__auto__858 != null && test__60965__auto__858 !== false) {
return null;} else {
let G__859860 = squint_core.compare(start(to_node), start(node));
switch (G__859860) {case 0:
let test__60965__auto__862 = ancestor_QMARK_(to_node, node);
if (test__60965__auto__862 != null && test__60965__auto__862 !== false) {
return up(node);} else {
let test__60965__auto__863 = ancestor_QMARK_(node, to_node);
if (test__60965__auto__863 != null && test__60965__auto__863 !== false) {
return down(node);} else {
return null;}}
break;
case -1:
let test__60965__auto__864 = ancestor_QMARK_(node, to_node);
if (test__60965__auto__864 != null && test__60965__auto__864 !== false) {
return down_last(node);} else {
let or__32239__auto__865 = left(node);
if (or__32239__auto__865 != null && or__32239__auto__865 !== false) {
return or__32239__auto__865;} else {
return up(node);}}
break;
case 1:
let test__60965__auto__866 = ancestor_QMARK_(node, to_node);
if (test__60965__auto__866 != null && test__60965__auto__866 !== false) {
return down(node);} else {
let or__32239__auto__867 = right(node);
if (or__32239__auto__867 != null && or__32239__auto__867 !== false) {
return or__32239__auto__867;} else {
return up(node);}}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__859860))}}
})
;
var nodes_between = (function (node, to_node) {
return squint_core.take_while(squint_core.identity, squint_core.iterate((function (_PERCENT_1) {
return move_toward(_PERCENT_1, to_node);
}), node));
})
;
var require_balance_QMARK_ = (function (node) {
let or__32239__auto__868 = coll_QMARK_(node);
if (or__32239__auto__868 != null && or__32239__auto__868 !== false) {
return or__32239__auto__868;} else {
let or__32239__auto__869 = string_QMARK_(node);
if (or__32239__auto__869 != null && or__32239__auto__869 !== false) {
return or__32239__auto__869;} else {
return regexp_QMARK_(node);}}
})
;
var tree = (function () {
 let f870 = (function (var_args) {
let G__873874 = arguments["length"];
switch (G__873874) {case 1:
return f870.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f870.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f870.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f870["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return language.syntaxTree(state);
});
f870["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return language.syntaxTree(state).resolveInner(pos);
});
f870["cljs$core$IFn$_invoke$arity$3"] = (function (state, pos, dir) {
return language.syntaxTree(state).resolveInner(pos, dir);
});
f870["cljs$lang$maxFixedArity"] = 3;
return f870;
})()
;
var cursor = (function () {
 let f876 = (function (var_args) {
let G__879880 = arguments["length"];
switch (G__879880) {case 1:
return f876.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f876.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f876.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f876["cljs$core$IFn$_invoke$arity$1"] = (function (tree) {
return tree.cursor();
});
f876["cljs$core$IFn$_invoke$arity$2"] = (function (tree, pos) {
return tree.cursorAt(pos);
});
f876["cljs$core$IFn$_invoke$arity$3"] = (function (tree, pos, dir) {
return tree.cursorAt(pos, dir);
});
f876["cljs$lang$maxFixedArity"] = 3;
return f876;
})()
;
var terminal_cursor = (function (tree, pos, dir) {
let i882 = pos;
while(true){
let c883 = cursor(tree, i882, dir);
let type884 = c883["type"];
let test__60965__auto__885 = top_type_QMARK_(type884);
if (test__60965__auto__885 != null && test__60965__auto__885 !== false) {
return null;} else {
let test__60965__auto__886 = terminal_type_QMARK_(c883["type"]);
if (test__60965__auto__886 != null && test__60965__auto__886 !== false) {
return c883;} else {
let test__60965__auto__887 = "else";
if (test__60965__auto__887 != null && test__60965__auto__887 !== false) {
let G__888 = (dir + i882);
i882 = G__888;
continue;
} else {
return null;}}};break;
}

})
;
var up_here = (function (node) {
let from889 = start(node);
let or__32239__auto__890 = highest(node, (function (_PERCENT_1) {
return (from889 === start(_PERCENT_1));
}));
if (or__32239__auto__890 != null && or__32239__auto__890 !== false) {
return or__32239__auto__890;} else {
return node;}
})
;
var topmost_cursor = (function (state, from) {
return up_here(tree(state, from, 1)["node"]).cursor();
})
;
var terminal_nodes = (function (state, from, to) {
let cursor891 = topmost_cursor(state, from);
let found892 = [];
while(true){
let node_type893 = type(cursor891);
let test__60965__auto__894 = (start(cursor891) > to);
if (test__60965__auto__894 != null && test__60965__auto__894 !== false) {
return found892;} else {
let test__60965__auto__895 = (function () {
 let or__32239__auto__896 = terminal_type_QMARK_(node_type893);
if (or__32239__auto__896 != null && or__32239__auto__896 !== false) {
return or__32239__auto__896;} else {
return error_QMARK_(node_type893);}
})();
if (test__60965__auto__895 != null && test__60965__auto__895 !== false) {
let found897 = squint_core.conj(found892, ({ "type": node_type893, "from": start(cursor891), "to": end(cursor891) }));
cursor891.lastChild();
let test__60965__auto__898 = cursor891.next();
if (test__60965__auto__898 != null && test__60965__auto__898 !== false) {
let G__899 = found897;
found892 = G__899;
continue;
} else {
return found897;}} else {
let test__60965__auto__900 = "else";
if (test__60965__auto__900 != null && test__60965__auto__900 !== false) {
let test__60965__auto__901 = cursor891.next();
if (test__60965__auto__901 != null && test__60965__auto__901 !== false) {
let G__902 = found892;
found892 = G__902;
continue;
} else {
return found892;}} else {
return null;}}};break;
}

})
;
var balanced_range = (function () {
 let f903 = (function (var_args) {
let G__906907 = arguments["length"];
switch (G__906907) {case 2:
return f903.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f903.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f903["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return balanced_range(state, start(node), end(node));
});
f903["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
let vec__909915 = squint_core.sort([from, to]);
let from916 = squint_core.nth(vec__909915, 0, null);
let to917 = squint_core.nth(vec__909915, 1, null);
let from_node918 = tree(state, from916, 1);
let to_node919 = tree(state, to917, -1);
let from920 = (function () {
 let test__60965__auto__921 = require_balance_QMARK_(from_node918);
if (test__60965__auto__921 != null && test__60965__auto__921 !== false) {
return start(from_node918);} else {
return from916;}
})();
let to922 = (function () {
 let test__60965__auto__923 = require_balance_QMARK_(to_node919);
if (test__60965__auto__923 != null && test__60965__auto__923 !== false) {
return end(to_node919);} else {
return to917;}
})();
let vec__912924 = squint_core.reduce((function (p__925, node_between) {
let vec__926929 = p__925;
let left930 = squint_core.nth(vec__926929, 0, null);
let right931 = squint_core.nth(vec__926929, 1, null);
return [(function () {
 let test__60965__auto__932 = ancestor_QMARK_(node_between, from_node918);
if (test__60965__auto__932 != null && test__60965__auto__932 !== false) {
return start(node_between);} else {
return left930;}
})(), (function () {
 let test__60965__auto__933 = ancestor_QMARK_(node_between, to_node919);
if (test__60965__auto__933 != null && test__60965__auto__933 !== false) {
return end(node_between);} else {
return right931;}
})()];
}), [from920, to922], squint_core.map((function (_PERCENT_1) {
let G__934935 = _PERCENT_1;
let test__60965__auto__936 = edge_QMARK_(_PERCENT_1);
if (test__60965__auto__936 != null && test__60965__auto__936 !== false) {
return up(G__934935);} else {
return G__934935;}
}), nodes_between(from_node918, to_node919)));
let left937 = squint_core.nth(vec__912924, 0, null);
let right938 = squint_core.nth(vec__912924, 1, null);
return sel.range(left937, right938);
});
f903["cljs$lang$maxFixedArity"] = 3;
return f903;
})()
;
var inner_span = (function (p__939) {
let map__940941 = p__939;
let node942 = map__940941;
let firstChild943 = squint_core.get(map__940941, "firstChild");
let lastChild944 = squint_core.get(map__940941, "lastChild");
return ({ "from": (function () {
 let test__60965__auto__945 = left_edge_QMARK_(firstChild943);
if (test__60965__auto__945 != null && test__60965__auto__945 !== false) {
return end(firstChild943);} else {
return start(node942);}
})(), "to": (function () {
 let test__60965__auto__946 = right_edge_QMARK_(lastChild944);
if (test__60965__auto__946 != null && test__60965__auto__946 !== false) {
return start(lastChild944);} else {
return end(node942);}
})() });
})
;
var within_QMARK__LT_ = (function (parent, child) {
let c1947 = squint_core.compare(start(parent), start(child));
let c2948 = squint_core.compare(end(parent), end(child));
let and__32262__auto__949 = (function () {
 let or__32239__auto__950 = squint_core.pos_QMARK_(c1947);
if (or__32239__auto__950 != null && or__32239__auto__950 !== false) {
return or__32239__auto__950;} else {
return squint_core.neg_QMARK_(c2948);}
})();
if (and__32262__auto__949 != null && and__32262__auto__949 !== false) {
let and__32262__auto__951 = !squint_core.neg_QMARK_(c1947);
if (and__32262__auto__951 != null && and__32262__auto__951 !== false) {
return !squint_core.pos_QMARK_(c2948);} else {
return and__32262__auto__951;}} else {
return and__32262__auto__949;}
})
;
var within_QMARK_ = (function (parent, child) {
let and__32262__auto__952 = !squint_core.neg_QMARK_(squint_core.compare(start(parent), start(child)));
if (and__32262__auto__952 != null && and__32262__auto__952 !== false) {
return !squint_core.pos_QMARK_(squint_core.compare(end(parent), end(child)));} else {
return and__32262__auto__952;}
})
;
var follow_edges = (function (node) {
let test__60965__auto__953 = edge_QMARK_(node);
if (test__60965__auto__953 != null && test__60965__auto__953 !== false) {
return up(node);} else {
return node;}
})
;
var prefix = (function (node) {
let temp__31858__auto__954 = up(node);
let test__60965__auto__955 = squint_core.nil_QMARK_(temp__31858__auto__954);
if (test__60965__auto__955 != null && test__60965__auto__955 !== false) {
return null;} else {
let parent956 = temp__31858__auto__954;
let or__32239__auto__957 = u.guard(parent956, prefix_container_QMARK_);
if (or__32239__auto__957 != null && or__32239__auto__957 !== false) {
return or__32239__auto__957;} else {
return u.guard(down(parent956), prefix_edge_QMARK_);}}
})
;
var left_edge_with_prefix = (function (state, node) {
return squint_core.str((function () {
 let G__958959 = prefix(node);
let test__60965__auto__960 = squint_core.nil_QMARK_(G__958959);
if (test__60965__auto__960 != null && test__60965__auto__960 !== false) {
return null;} else {
return string(state, G__958959);}
})(), name(down(node)));
})
;
var with_prefix = (function (node) {
let G__961962 = node;
let test__60965__auto__963 = prefix(node);
if (test__60965__auto__963 != null && test__60965__auto__963 !== false) {
return up(G__961962);} else {
return G__961962;}
})
;
var node_BAR_ = (function (state, pos) {
let G__964965 = tree(state, pos, -1);
let test__60965__auto__966 = squint_core.nil_QMARK_(G__964965);
if (test__60965__auto__966 != null && test__60965__auto__966 !== false) {
return null;} else {
return u.guard(G__964965, (function (_PERCENT_1) {
return (pos === end(_PERCENT_1));
}));}
})
;
var _BAR_node = (function (state, pos) {
let G__967968 = tree(state, pos, 1);
let test__60965__auto__969 = squint_core.nil_QMARK_(G__967968);
if (test__60965__auto__969 != null && test__60965__auto__969 !== false) {
return null;} else {
return u.guard(G__967968, (function (_PERCENT_1) {
return (pos === start(_PERCENT_1));
}));}
})
;
var nearest_touching = (function (state, pos, dir) {
let L970 = (function () {
 let G__971972 = tree(state, pos, -1);
let test__60965__auto__973 = squint_core.nil_QMARK_(G__971972);
if (test__60965__auto__973 != null && test__60965__auto__973 !== false) {
return null;} else {
return u.guard(G__971972, (function (p__974) {
let map__975976 = p__974;
let to977 = squint_core.get(map__975976, "to");
return (pos === to977);
}));}
})();
let R978 = (function () {
 let G__979980 = tree(state, pos, 1);
let test__60965__auto__981 = squint_core.nil_QMARK_(G__979980);
if (test__60965__auto__981 != null && test__60965__auto__981 !== false) {
return null;} else {
return u.guard(G__979980, (function (p__982) {
let map__983984 = p__982;
let from985 = squint_core.get(map__983984, "from");
return (pos === from985);
}));}
})();
let mid986 = tree(state, pos);
let G__987988 = dir;
switch (G__987988) {case 1:
let or__32239__auto__990 = u.guard(R978, squint_core.every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
let or__32239__auto__991 = same_edge_QMARK_(_PERCENT_1);
if (or__32239__auto__991 != null && or__32239__auto__991 !== false) {
return or__32239__auto__991;} else {
return !right_edge_QMARK_(_PERCENT_1);}
})));
if (or__32239__auto__990 != null && or__32239__auto__990 !== false) {
return or__32239__auto__990;} else {
let or__32239__auto__992 = L970;
if (or__32239__auto__992 != null && or__32239__auto__992 !== false) {
return or__32239__auto__992;} else {
let or__32239__auto__993 = R978;
if (or__32239__auto__993 != null && or__32239__auto__993 !== false) {
return or__32239__auto__993;} else {
return mid986;}}}
break;
case -1:
let or__32239__auto__994 = u.guard(L970, squint_core.every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
let or__32239__auto__995 = same_edge_QMARK_(_PERCENT_1);
if (or__32239__auto__995 != null && or__32239__auto__995 !== false) {
return or__32239__auto__995;} else {
return !left_edge_QMARK_(_PERCENT_1);}
})));
if (or__32239__auto__994 != null && or__32239__auto__994 !== false) {
return or__32239__auto__994;} else {
let or__32239__auto__996 = R978;
if (or__32239__auto__996 != null && or__32239__auto__996 !== false) {
return or__32239__auto__996;} else {
let or__32239__auto__997 = L970;
if (or__32239__auto__997 != null && or__32239__auto__997 !== false) {
return or__32239__auto__997;} else {
return mid986;}}}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__987988))}
})
;
var embedded_QMARK_ = (function () {
 let f998 = (function (var_args) {
let G__10011002 = arguments["length"];
switch (G__10011002) {case 1:
return f998.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f998.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f998["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return embedded_QMARK_(state, state["selection"]["main"]["head"]);
});
f998["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return squint_core.identical_QMARK_(lezer_markdown.parser.nodeTypes["FencedCode"], state["tree"].resolve(pos)["type"]["id"]);
});
f998["cljs$lang$maxFixedArity"] = 2;
return f998;
})()
;
var within_program_QMARK_ = (function () {
 let f1004 = (function (var_args) {
let G__10071008 = arguments["length"];
switch (G__10071008) {case 1:
return f1004.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f1004.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f1004["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return within_program_QMARK_(state, state["selection"]["main"]["head"]);
});
f1004["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
let n1010 = tree(state, pos);
let or__32239__auto__1011 = program_QMARK_(n1010);
if (or__32239__auto__1011 != null && or__32239__auto__1011 !== false) {
return or__32239__auto__1011;} else {
return squint_core.some(program_QMARK_, ancestors(n1010));}
});
f1004["cljs$lang$maxFixedArity"] = 2;
return f1004;
})()
;
squint_core.prn("node-loaded");
null;

export { end_edge_prop, ancestors, range, string_QMARK_, within_QMARK__LT_, edge_QMARK_, right, terminal_nodes, string, same_edge_type_QMARK_, up, line_comment_QMARK_, prefix_coll_prop, prefix, left_edge_with_prefix, top_QMARK_, empty_QMARK_, terminal_type_QMARK_, left_edge_type_QMARK_, children, nodes_between, prefix_edge_QMARK_, discard_QMARK_, right_edge_type_QMARK_, balanced_range, prefix_container_QMARK_, topmost_cursor, coll_prop, closed_by, error_QMARK_, _BAR_node, balanced_QMARK_, start_edge_type_QMARK_, prefix_container_prop, down_last, prefix_QMARK_, name, same_edge_QMARK_, prefix_container_type_QMARK_, rights, with_prefix, start, tree, closest, cursor, node_prop, from_to, follow_edges, start_edge_QMARK_, highest, embedded_QMARK_, opened_by, coll_QMARK_, down, type, terminal_cursor, within_QMARK_, inner_span, depth, prefix_type_QMARK_, same_edge_prop, nearest_touching, regexp_QMARK_, top_type_QMARK_, error_type_QMARK_, up_here, ancestor_QMARK_, end_edge_type_QMARK_, right_edge_QMARK_, start_edge_prop, prefix_edge_prop, node_BAR_, left_edge_QMARK_, coll_type_QMARK_, lefts, require_balance_QMARK_, end, prefix_edge_type_QMARK_, within_program_QMARK_, left, end_edge_QMARK_, program_QMARK_, move_toward, eq_QMARK_ }
