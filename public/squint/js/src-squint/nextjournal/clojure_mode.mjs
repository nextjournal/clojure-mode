import * as squint_core from 'squint-cljs/core.js';
import * as highlight from '@lezer/highlight';
import { tags } from '@lezer/highlight';
import * as language from '@codemirror/language';
import { LRLanguage, LanguageSupport } from '@codemirror/language';
import * as lezer_clj from '@nextjournal/lezer-clojure';
import * as close_brackets from './clojure_mode/extensions/close_brackets.mjs';
import * as match_brackets from './clojure_mode/extensions/match_brackets.mjs';
import * as format from './Clojure_mode/extensions/formatting.mjs';
import * as sel_history from './clojure_mode/extensions/selection_history.mjs';
import * as keymap from './clojure_mode/keymap.mjs';
import * as n from './clojure_mode/node.mjs';
var fold_node_props = (function () {
 let coll_span43 = (function (tree) {
return ({ "from": (n.start(tree) + 1), "to": (n.end(tree) - 1) });
});
return ({ "Vector": coll_span43, "Map": coll_span43, "List": coll_span43 });
})()
;
var style_tags = ({ "LineComment": tags["lineComment"], "NS": tags["keyword"], "\"\\\"\"": tags["string"], "VarName/Symbol": tags.definition(tags["variableName"]), "DocString/...": tags["emphasis"], "Boolean": tags["atom"], "Keyword": tags["atom"], "Number": tags["number"], "RegExp": tags["regexp"], "StringContent": tags["string"], "Operator/Symbol": tags["keyword"], "Discard!": tags["comment"], "DefLike": tags["keyword"], "Nil": tags["null"] })
;
var parser = lezer_clj.parser
;
null;
var syntax = (function () {
 let f44 = (function (var_args) {
let G__4748 = arguments["length"];
switch (G__4748) {case 0:
return f44.cljs$core$IFn$_invoke$arity$0();
break;
case 1:
return f44.cljs$core$IFn$_invoke$arity$1((arguments[0]));
break;
default:
throw new Error(squint_core.str("Invalid arity: ", squint_core.alength(arguments)))}
});
f44["cljs$core$IFn$_invoke$arity$0"] = (function () {
return syntax(parser);
});
f44["cljs$core$IFn$_invoke$arity$1"] = (function (parser) {
return LRLanguage.define(({ "parser": parser.configure(({ "props": [format.props, language.foldNodeProp.add(fold_node_props), highlight.styleTags(style_tags)] })) }));
});
f44["cljs$lang$maxFixedArity"] = 1;
return f44;
})()
;
var complete_keymap = keymap.complete
;
var builtin_keymap = keymap.builtin
;
var paredit_keymap = keymap.paredit
;
var default_extensions = [syntax(lezer_clj.parser), close_brackets.extension(), match_brackets.extension(), sel_history.extension(), format.ext_format_changed_lines()]
;
var language_support = "Eases embedding clojure mode into other languages (e.g. markdown).\n  See https://codemirror.net/docs/ref/#language.LanguageSupport for motivations"
;
null;
squint_core.prn("clojure-mode-loaded");

export { paredit_keymap, parser, style_tags, complete_keymap, default_extensions, builtin_keymap, fold_node_props, syntax, language_support }
