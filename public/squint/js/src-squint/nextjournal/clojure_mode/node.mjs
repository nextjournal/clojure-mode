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
let G__727728 = prop_name;
switch (G__727728) {case "prefixColl":
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
throw new Error(squint_core.str("No matching clause: ", G__727728))}
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
let node730 = node;
let i731 = 0;
while(true){
let temp__24849__auto__732 = up(node730);
let test__26256__auto__733 = squint_core.nil_QMARK_(temp__24849__auto__732);
if (test__26256__auto__733 != null && test__26256__auto__733 !== false) {
return i731;} else {
let parent734 = temp__24849__auto__732;
let G__735 = parent734;
let G__736 = (i731 + 1);
node730 = G__735;
i731 = G__736;
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
let or__25460__auto__737 = start_edge_type_QMARK_(t);
if (or__25460__auto__737 != null && or__25460__auto__737 !== false) {
return or__25460__auto__737;} else {
let or__25460__auto__738 = same_edge_type_QMARK_(t);
if (or__25460__auto__738 != null && or__25460__auto__738 !== false) {
return or__25460__auto__738;} else {
return prefix_edge_type_QMARK_(t);}}
})
;
var left_edge_QMARK_ = (function (n) {
return left_edge_type_QMARK_(type(n));
})
;
var right_edge_type_QMARK_ = (function (t) {
let or__25460__auto__739 = end_edge_type_QMARK_(t);
if (or__25460__auto__739 != null && or__25460__auto__739 !== false) {
return or__25460__auto__739;} else {
return same_edge_type_QMARK_(t);}
})
;
var right_edge_QMARK_ = (function (n) {
return right_edge_type_QMARK_(type(n));
})
;
var edge_QMARK_ = (function (n) {
let t740 = type(n);
let or__25460__auto__741 = start_edge_type_QMARK_(t740);
if (or__25460__auto__741 != null && or__25460__auto__741 !== false) {
return or__25460__auto__741;} else {
let or__25460__auto__742 = end_edge_type_QMARK_(t740);
if (or__25460__auto__742 != null && or__25460__auto__742 !== false) {
return or__25460__auto__742;} else {
let or__25460__auto__743 = same_edge_type_QMARK_(t740);
if (or__25460__auto__743 != null && or__25460__auto__743 !== false) {
return or__25460__auto__743;} else {
return prefix_type_QMARK_(t740);}}}
})
;
var closed_by = (function (n) {
let G__744745 = type(n).prop(lz_tree.NodeProp["closedBy"]);
let test__26256__auto__746 = squint_core.nil_QMARK_(G__744745);
if (test__26256__auto__746 != null && test__26256__auto__746 !== false) {
return null;} else {
return G__744745[0];}
})
;
var opened_by = (function (n) {
let G__747748 = type(n).prop(lz_tree.NodeProp["openedBy"]);
let test__26256__auto__749 = squint_core.nil_QMARK_(G__747748);
if (test__26256__auto__749 != null && test__26256__auto__749 !== false) {
return null;} else {
return G__747748[0];}
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
let test__26256__auto__750 = top_type_QMARK_(node_type);
if (test__26256__auto__750 != null && test__26256__auto__750 !== false) {
return false;} else {
let test__26256__auto__751 = node_type.prop(prefix_coll_prop);
if (test__26256__auto__751 != null && test__26256__auto__751 !== false) {
return false;} else {
let test__26256__auto__752 = node_type.prop(coll_prop);
if (test__26256__auto__752 != null && test__26256__auto__752 !== false) {
return false;} else {
let test__26256__auto__753 = squint_core.identical_QMARK_("Meta", name(node_type));
if (test__26256__auto__753 != null && test__26256__auto__753 !== false) {
return false;} else {
let test__26256__auto__754 = squint_core.identical_QMARK_("TaggedLiteral", name(node_type));
if (test__26256__auto__754 != null && test__26256__auto__754 !== false) {
return false;} else {
let test__26256__auto__755 = squint_core.identical_QMARK_("ConstructorCall", name(node_type));
if (test__26256__auto__755 != null && test__26256__auto__755 !== false) {
return false;} else {
if ("else" != null && "else" !== false) {
return true;} else {
return null;}}}}}}}
})
;
var balanced_QMARK_ = (function (p__756) {
let map__757758 = p__756;
let _node759 = map__757758;
let firstChild760 = squint_core.get(map__757758, "firstChild");
let lastChild761 = squint_core.get(map__757758, "lastChild");
let temp__24803__auto__762 = closed_by(firstChild760);
if (temp__24803__auto__762 != null && temp__24803__auto__762 !== false) {
let closing763 = temp__24803__auto__762;
let and__25509__auto__764 = (closing763 === name(lastChild761));
if (and__25509__auto__764 != null && and__25509__auto__764 !== false) {
return (end(firstChild760) !== end(lastChild761));} else {
return and__25509__auto__764;}} else {
return true;}
})
;
var ancestors = (function (node) {
let temp__25022__auto__765 = up(node);
let test__26256__auto__766 = squint_core.nil_QMARK_(temp__25022__auto__765);
if (test__26256__auto__766 != null && test__26256__auto__766 !== false) {
return null;} else {
let parent767 = temp__25022__auto__765;
return squint_core.cons(parent767, new squint_core.LazySeq((function () {
return ancestors(parent767);
})));}
})
;
var closest = (function (node, pred) {
let test__26256__auto__768 = pred(node);
if (test__26256__auto__768 != null && test__26256__auto__768 !== false) {
return node;} else {
return squint_core.reduce((function (_, x) {
let test__26256__auto__769 = pred(x);
if (test__26256__auto__769 != null && test__26256__auto__769 !== false) {
return squint_core.reduced(x);}
}), null, ancestors(node));}
})
;
var highest = (function (node, pred) {
return squint_core.reduce((function (found, x) {
let test__26256__auto__770 = pred(x);
if (test__26256__auto__770 != null && test__26256__auto__770 !== false) {
return x;} else {
return squint_core.reduced(found);}
}), null, squint_core.cons(node, ancestors(node)));
})
;
var children = (function () {
 let f771 = (function (var_args) {
let G__774775 = arguments["length"];
switch (G__774775) {case 3:
return f771.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
case 1:
return f771.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f771["cljs$core$IFn$_invoke$arity$3"] = (function (parent, from, dir) {
let temp__25022__auto__777 = (function () {
 let G__778779 = dir;
switch (G__778779) {case 1:
return parent.childAfter(from);
break;
case -1:
return parent.childBefore(from);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__778779))}
})();
let test__26256__auto__781 = squint_core.nil_QMARK_(temp__25022__auto__777);
if (test__26256__auto__781 != null && test__26256__auto__781 !== false) {
return null;} else {
let child782 = temp__25022__auto__777;
return squint_core.cons(child782, new squint_core.LazySeq((function () {
return children(parent, (function () {
 let G__783784 = dir;
switch (G__783784) {case 1:
return end(child782);
break;
case -1:
return start(child782);
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__783784))}
})(), dir);
})));}
});
f771["cljs$core$IFn$_invoke$arity$1"] = (function (subtree) {
return children(subtree, start(subtree), 1);
});
f771["cljs$lang$maxFixedArity"] = 3;
return f771;
})()
;
var eq_QMARK_ = (function (x, y) {
let and__25509__auto__786 = (start(x) == start(y));
if (and__25509__auto__786 != null && and__25509__auto__786 !== false) {
let and__25509__auto__787 = (end(x) == end(y));
if (and__25509__auto__787 != null && and__25509__auto__787 !== false) {
return (depth(x) == depth(y));} else {
return and__25509__auto__787;}} else {
return and__25509__auto__786;}
})
;
var empty_QMARK_ = (function (node) {
let type_name788 = name(node);
let test__26256__auto__789 = coll_QMARK_(node);
if (test__26256__auto__789 != null && test__26256__auto__789 !== false) {
return eq_QMARK_(right(down(node)), down_last(node));} else {
let test__26256__auto__790 = ("String" === type_name788);
if (test__26256__auto__790 != null && test__26256__auto__790 !== false) {
return (end(down(node)) == start(down_last(node)));} else {
if ("else" != null && "else" !== false) {
return false;} else {
return null;}}}
})
;
var from_to = (function () {
 let f791 = (function (var_args) {
let G__794795 = arguments["length"];
switch (G__794795) {case 2:
return f791.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 1:
return f791.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f791["cljs$core$IFn$_invoke$arity$2"] = (function (from, to) {
return ({ "from": from, "to": to });
});
f791["cljs$core$IFn$_invoke$arity$1"] = (function (node) {
return from_to(start(node), end(node));
});
f791["cljs$lang$maxFixedArity"] = 2;
return f791;
})()
;
var range = (function (node) {
return sel.range(start(node), end(node));
})
;
var string = (function () {
 let f797 = (function (var_args) {
let G__800801 = arguments["length"];
switch (G__800801) {case 2:
return f797.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f797.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f797["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return string(state, start(node), end(node));
});
f797["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
return state["doc"].sliceString(from, to, "\n");
});
f797["cljs$lang$maxFixedArity"] = 3;
return f797;
})()
;
var ancestor_QMARK_ = (function (parent, child) {
return squint_core.boolean$((function () {
 let and__25509__auto__803 = (start(parent) <= start(child));
if (and__25509__auto__803 != null && and__25509__auto__803 !== false) {
let and__25509__auto__804 = (end(parent) >= end(child));
if (and__25509__auto__804 != null && and__25509__auto__804 !== false) {
return (depth(parent) < depth(child));} else {
return and__25509__auto__804;}} else {
return and__25509__auto__803;}
})());
})
;
var move_toward = (function (node, to_node) {
let test__26256__auto__805 = eq_QMARK_(node, to_node);
if (test__26256__auto__805 != null && test__26256__auto__805 !== false) {
return null;} else {
let G__806807 = squint_core.compare(start(to_node), start(node));
switch (G__806807) {case 0:
let test__26256__auto__809 = ancestor_QMARK_(to_node, node);
if (test__26256__auto__809 != null && test__26256__auto__809 !== false) {
return up(node);} else {
let test__26256__auto__810 = ancestor_QMARK_(node, to_node);
if (test__26256__auto__810 != null && test__26256__auto__810 !== false) {
return down(node);} else {
return null;}}
break;
case -1:
let test__26256__auto__811 = ancestor_QMARK_(node, to_node);
if (test__26256__auto__811 != null && test__26256__auto__811 !== false) {
return down_last(node);} else {
let or__25460__auto__812 = left(node);
if (or__25460__auto__812 != null && or__25460__auto__812 !== false) {
return or__25460__auto__812;} else {
return up(node);}}
break;
case 1:
let test__26256__auto__813 = ancestor_QMARK_(node, to_node);
if (test__26256__auto__813 != null && test__26256__auto__813 !== false) {
return down(node);} else {
let or__25460__auto__814 = right(node);
if (or__25460__auto__814 != null && or__25460__auto__814 !== false) {
return or__25460__auto__814;} else {
return up(node);}}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__806807))}}
})
;
var nodes_between = (function (node, to_node) {
return squint_core.take_while(squint_core.identity, squint_core.iterate((function (_PERCENT_1) {
return move_toward(_PERCENT_1, to_node);
}), node));
})
;
var require_balance_QMARK_ = (function (node) {
let or__25460__auto__815 = coll_QMARK_(node);
if (or__25460__auto__815 != null && or__25460__auto__815 !== false) {
return or__25460__auto__815;} else {
let or__25460__auto__816 = string_QMARK_(node);
if (or__25460__auto__816 != null && or__25460__auto__816 !== false) {
return or__25460__auto__816;} else {
return regexp_QMARK_(node);}}
})
;
var tree = (function () {
 let f817 = (function (var_args) {
let G__820821 = arguments["length"];
switch (G__820821) {case 1:
return f817.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f817.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f817.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f817["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return language.syntaxTree(state);
});
f817["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return language.syntaxTree(state).resolveInner(pos);
});
f817["cljs$core$IFn$_invoke$arity$3"] = (function (state, pos, dir) {
return language.syntaxTree(state).resolveInner(pos, dir);
});
f817["cljs$lang$maxFixedArity"] = 3;
return f817;
})()
;
var cursor = (function () {
 let f823 = (function (var_args) {
let G__826827 = arguments["length"];
switch (G__826827) {case 1:
return f823.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f823.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f823.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f823["cljs$core$IFn$_invoke$arity$1"] = (function (tree) {
return tree.cursor();
});
f823["cljs$core$IFn$_invoke$arity$2"] = (function (tree, pos) {
return tree.cursorAt(pos);
});
f823["cljs$core$IFn$_invoke$arity$3"] = (function (tree, pos, dir) {
return tree.cursorAt(pos, dir);
});
f823["cljs$lang$maxFixedArity"] = 3;
return f823;
})()
;
var terminal_cursor = (function (tree, pos, dir) {
let i829 = pos;
while(true){
let c830 = cursor(tree, i829, dir);
let type831 = c830["type"];
let test__26256__auto__832 = top_type_QMARK_(type831);
if (test__26256__auto__832 != null && test__26256__auto__832 !== false) {
return null;} else {
let test__26256__auto__833 = terminal_type_QMARK_(c830["type"]);
if (test__26256__auto__833 != null && test__26256__auto__833 !== false) {
return c830;} else {
if ("else" != null && "else" !== false) {
let G__834 = (dir + i829);
i829 = G__834;
continue;
} else {
return null;}}};break;
}

})
;
var up_here = (function (node) {
let from835 = start(node);
let or__25460__auto__836 = highest(node, (function (_PERCENT_1) {
return (from835 === start(_PERCENT_1));
}));
if (or__25460__auto__836 != null && or__25460__auto__836 !== false) {
return or__25460__auto__836;} else {
return node;}
})
;
var topmost_cursor = (function (state, from) {
return up_here(tree(state, from, 1)["node"]).cursor();
})
;
var terminal_nodes = (function (state, from, to) {
let cursor837 = topmost_cursor(state, from);
let found838 = [];
while(true){
let node_type839 = type(cursor837);
let test__26256__auto__840 = (start(cursor837) > to);
if (test__26256__auto__840 != null && test__26256__auto__840 !== false) {
return found838;} else {
let test__26256__auto__841 = (function () {
 let or__25460__auto__842 = terminal_type_QMARK_(node_type839);
if (or__25460__auto__842 != null && or__25460__auto__842 !== false) {
return or__25460__auto__842;} else {
return error_QMARK_(node_type839);}
})();
if (test__26256__auto__841 != null && test__26256__auto__841 !== false) {
let found843 = squint_core.conj(found838, ({ "type": node_type839, "from": start(cursor837), "to": end(cursor837) }));
cursor837.lastChild();
let test__26256__auto__844 = cursor837.next();
if (test__26256__auto__844 != null && test__26256__auto__844 !== false) {
let G__845 = found843;
found838 = G__845;
continue;
} else {
return found843;}} else {
if ("else" != null && "else" !== false) {
let test__26256__auto__846 = cursor837.next();
if (test__26256__auto__846 != null && test__26256__auto__846 !== false) {
let G__847 = found838;
found838 = G__847;
continue;
} else {
return found838;}} else {
return null;}}};break;
}

})
;
var balanced_range = (function () {
 let f848 = (function (var_args) {
let G__851852 = arguments["length"];
switch (G__851852) {case 2:
return f848.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
case 3:
return f848.cljs$core$IFn$_invoke$arity$3((arguments[0]), (arguments[1]), (arguments[2]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f848["cljs$core$IFn$_invoke$arity$2"] = (function (state, node) {
return balanced_range(state, start(node), end(node));
});
f848["cljs$core$IFn$_invoke$arity$3"] = (function (state, from, to) {
let vec__854860 = squint_core.sort([from, to]);
let from861 = squint_core.nth(vec__854860, 0, null);
let to862 = squint_core.nth(vec__854860, 1, null);
let from_node863 = tree(state, from861, 1);
let to_node864 = tree(state, to862, -1);
let from865 = (function () {
 let test__26256__auto__866 = require_balance_QMARK_(from_node863);
if (test__26256__auto__866 != null && test__26256__auto__866 !== false) {
return start(from_node863);} else {
return from861;}
})();
let to867 = (function () {
 let test__26256__auto__868 = require_balance_QMARK_(to_node864);
if (test__26256__auto__868 != null && test__26256__auto__868 !== false) {
return end(to_node864);} else {
return to862;}
})();
let vec__857869 = squint_core.reduce((function (p__870, node_between) {
let vec__871874 = p__870;
let left875 = squint_core.nth(vec__871874, 0, null);
let right876 = squint_core.nth(vec__871874, 1, null);
return [(function () {
 let test__26256__auto__877 = ancestor_QMARK_(node_between, from_node863);
if (test__26256__auto__877 != null && test__26256__auto__877 !== false) {
return start(node_between);} else {
return left875;}
})(), (function () {
 let test__26256__auto__878 = ancestor_QMARK_(node_between, to_node864);
if (test__26256__auto__878 != null && test__26256__auto__878 !== false) {
return end(node_between);} else {
return right876;}
})()];
}), [from865, to867], squint_core.map((function (_PERCENT_1) {
let G__879880 = _PERCENT_1;
let test__26256__auto__881 = edge_QMARK_(_PERCENT_1);
if (test__26256__auto__881 != null && test__26256__auto__881 !== false) {
return up(G__879880);} else {
return G__879880;}
}), nodes_between(from_node863, to_node864)));
let left882 = squint_core.nth(vec__857869, 0, null);
let right883 = squint_core.nth(vec__857869, 1, null);
return sel.range(left882, right883);
});
f848["cljs$lang$maxFixedArity"] = 3;
return f848;
})()
;
var inner_span = (function (p__884) {
let map__885886 = p__884;
let node887 = map__885886;
let firstChild888 = squint_core.get(map__885886, "firstChild");
let lastChild889 = squint_core.get(map__885886, "lastChild");
return ({ "from": (function () {
 let test__26256__auto__890 = left_edge_QMARK_(firstChild888);
if (test__26256__auto__890 != null && test__26256__auto__890 !== false) {
return end(firstChild888);} else {
return start(node887);}
})(), "to": (function () {
 let test__26256__auto__891 = right_edge_QMARK_(lastChild889);
if (test__26256__auto__891 != null && test__26256__auto__891 !== false) {
return start(lastChild889);} else {
return end(node887);}
})() });
})
;
var within_QMARK__LT_ = (function (parent, child) {
let c1892 = squint_core.compare(start(parent), start(child));
let c2893 = squint_core.compare(end(parent), end(child));
let and__25509__auto__894 = (function () {
 let or__25460__auto__895 = squint_core.pos_QMARK_(c1892);
if (or__25460__auto__895 != null && or__25460__auto__895 !== false) {
return or__25460__auto__895;} else {
return squint_core.neg_QMARK_(c2893);}
})();
if (and__25509__auto__894 != null && and__25509__auto__894 !== false) {
let and__25509__auto__896 = !squint_core.neg_QMARK_(c1892);
if (and__25509__auto__896 != null && and__25509__auto__896 !== false) {
return !squint_core.pos_QMARK_(c2893);} else {
return and__25509__auto__896;}} else {
return and__25509__auto__894;}
})
;
var within_QMARK_ = (function (parent, child) {
let and__25509__auto__897 = !squint_core.neg_QMARK_(squint_core.compare(start(parent), start(child)));
if (and__25509__auto__897 != null && and__25509__auto__897 !== false) {
return !squint_core.pos_QMARK_(squint_core.compare(end(parent), end(child)));} else {
return and__25509__auto__897;}
})
;
var follow_edges = (function (node) {
let test__26256__auto__898 = edge_QMARK_(node);
if (test__26256__auto__898 != null && test__26256__auto__898 !== false) {
return up(node);} else {
return node;}
})
;
var prefix = (function (node) {
let temp__25022__auto__899 = up(node);
let test__26256__auto__900 = squint_core.nil_QMARK_(temp__25022__auto__899);
if (test__26256__auto__900 != null && test__26256__auto__900 !== false) {
return null;} else {
let parent901 = temp__25022__auto__899;
let or__25460__auto__902 = u.guard(parent901, prefix_container_QMARK_);
if (or__25460__auto__902 != null && or__25460__auto__902 !== false) {
return or__25460__auto__902;} else {
return u.guard(down(parent901), prefix_edge_QMARK_);}}
})
;
var left_edge_with_prefix = (function (state, node) {
return squint_core.str((function () {
 let G__903904 = prefix(node);
let test__26256__auto__905 = squint_core.nil_QMARK_(G__903904);
if (test__26256__auto__905 != null && test__26256__auto__905 !== false) {
return null;} else {
return string(state, G__903904);}
})(), name(down(node)));
})
;
var with_prefix = (function (node) {
let G__906907 = node;
let test__26256__auto__908 = prefix(node);
if (test__26256__auto__908 != null && test__26256__auto__908 !== false) {
return up(G__906907);} else {
return G__906907;}
})
;
var node_BAR_ = (function (state, pos) {
let G__909910 = tree(state, pos, -1);
let test__26256__auto__911 = squint_core.nil_QMARK_(G__909910);
if (test__26256__auto__911 != null && test__26256__auto__911 !== false) {
return null;} else {
return u.guard(G__909910, (function (_PERCENT_1) {
return (pos === end(_PERCENT_1));
}));}
})
;
var _BAR_node = (function (state, pos) {
let G__912913 = tree(state, pos, 1);
let test__26256__auto__914 = squint_core.nil_QMARK_(G__912913);
if (test__26256__auto__914 != null && test__26256__auto__914 !== false) {
return null;} else {
return u.guard(G__912913, (function (_PERCENT_1) {
return (pos === start(_PERCENT_1));
}));}
})
;
var nearest_touching = (function (state, pos, dir) {
let L915 = (function () {
 let G__916917 = tree(state, pos, -1);
let test__26256__auto__918 = squint_core.nil_QMARK_(G__916917);
if (test__26256__auto__918 != null && test__26256__auto__918 !== false) {
return null;} else {
return u.guard(G__916917, (function (p__919) {
let map__920921 = p__919;
let to922 = squint_core.get(map__920921, "to");
return (pos === to922);
}));}
})();
let R923 = (function () {
 let G__924925 = tree(state, pos, 1);
let test__26256__auto__926 = squint_core.nil_QMARK_(G__924925);
if (test__26256__auto__926 != null && test__26256__auto__926 !== false) {
return null;} else {
return u.guard(G__924925, (function (p__927) {
let map__928929 = p__927;
let from930 = squint_core.get(map__928929, "from");
return (pos === from930);
}));}
})();
let mid931 = tree(state, pos);
let G__932933 = dir;
switch (G__932933) {case 1:
let or__25460__auto__935 = u.guard(R923, squint_core.every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
let or__25460__auto__936 = same_edge_QMARK_(_PERCENT_1);
if (or__25460__auto__936 != null && or__25460__auto__936 !== false) {
return or__25460__auto__936;} else {
return !right_edge_QMARK_(_PERCENT_1);}
})));
if (or__25460__auto__935 != null && or__25460__auto__935 !== false) {
return or__25460__auto__935;} else {
let or__25460__auto__937 = L915;
if (or__25460__auto__937 != null && or__25460__auto__937 !== false) {
return or__25460__auto__937;} else {
let or__25460__auto__938 = R923;
if (or__25460__auto__938 != null && or__25460__auto__938 !== false) {
return or__25460__auto__938;} else {
return mid931;}}}
break;
case -1:
let or__25460__auto__939 = u.guard(L915, squint_core.every_pred(squint_core.some_QMARK_, (function (_PERCENT_1) {
let or__25460__auto__940 = same_edge_QMARK_(_PERCENT_1);
if (or__25460__auto__940 != null && or__25460__auto__940 !== false) {
return or__25460__auto__940;} else {
return !left_edge_QMARK_(_PERCENT_1);}
})));
if (or__25460__auto__939 != null && or__25460__auto__939 !== false) {
return or__25460__auto__939;} else {
let or__25460__auto__941 = R923;
if (or__25460__auto__941 != null && or__25460__auto__941 !== false) {
return or__25460__auto__941;} else {
let or__25460__auto__942 = L915;
if (or__25460__auto__942 != null && or__25460__auto__942 !== false) {
return or__25460__auto__942;} else {
return mid931;}}}
break;
default:
throw new Error(squint_core.str("No matching clause: ", G__932933))}
})
;
var embedded_QMARK_ = (function () {
 let f943 = (function (var_args) {
let G__946947 = arguments["length"];
switch (G__946947) {case 1:
return f943.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f943.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f943["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return embedded_QMARK_(state, state["selection"]["main"]["head"]);
});
f943["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
return squint_core.identical_QMARK_(lezer_markdown.parser.nodeTypes["FencedCode"], state["tree"].resolve(pos)["type"]["id"]);
});
f943["cljs$lang$maxFixedArity"] = 2;
return f943;
})()
;
var within_program_QMARK_ = (function () {
 let f949 = (function (var_args) {
let G__952953 = arguments["length"];
switch (G__952953) {case 1:
return f949.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
case 2:
return f949.cljs$core$IFn$_invoke$arity$2((arguments[0]), (arguments[1]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f949["cljs$core$IFn$_invoke$arity$1"] = (function (state) {
return within_program_QMARK_(state, state["selection"]["main"]["head"]);
});
f949["cljs$core$IFn$_invoke$arity$2"] = (function (state, pos) {
let n955 = tree(state, pos);
let or__25460__auto__956 = program_QMARK_(n955);
if (or__25460__auto__956 != null && or__25460__auto__956 !== false) {
return or__25460__auto__956;} else {
return squint_core.some(program_QMARK_, ancestors(n955));}
});
f949["cljs$lang$maxFixedArity"] = 2;
return f949;
})()
;
squint_core.prn("node-loaded");
null;

export { end_edge_prop, ancestors, range, string_QMARK_, within_QMARK__LT_, edge_QMARK_, right, terminal_nodes, string, same_edge_type_QMARK_, up, line_comment_QMARK_, prefix_coll_prop, prefix, left_edge_with_prefix, top_QMARK_, empty_QMARK_, terminal_type_QMARK_, left_edge_type_QMARK_, children, nodes_between, prefix_edge_QMARK_, discard_QMARK_, right_edge_type_QMARK_, balanced_range, prefix_container_QMARK_, topmost_cursor, coll_prop, closed_by, error_QMARK_, _BAR_node, balanced_QMARK_, start_edge_type_QMARK_, prefix_container_prop, down_last, prefix_QMARK_, name, same_edge_QMARK_, prefix_container_type_QMARK_, rights, with_prefix, start, tree, closest, cursor, node_prop, from_to, follow_edges, start_edge_QMARK_, highest, embedded_QMARK_, opened_by, coll_QMARK_, down, type, terminal_cursor, within_QMARK_, inner_span, depth, prefix_type_QMARK_, same_edge_prop, nearest_touching, regexp_QMARK_, top_type_QMARK_, error_type_QMARK_, up_here, ancestor_QMARK_, end_edge_type_QMARK_, right_edge_QMARK_, start_edge_prop, prefix_edge_prop, node_BAR_, left_edge_QMARK_, coll_type_QMARK_, lefts, require_balance_QMARK_, end, prefix_edge_type_QMARK_, within_program_QMARK_, left, end_edge_QMARK_, program_QMARK_, move_toward, eq_QMARK_ }
