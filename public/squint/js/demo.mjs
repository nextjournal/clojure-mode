import { default_extensions, complete_keymap } from '@nextjournal/clojure-mode';
import { extension as eval_ext, cursor_node_string } from '@nextjournal/clojure-mode/extensions/eval_region';
import { EditorView, drawSelection, keymap } from  '@codemirror/view';
import { EditorState } from  '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle, foldGutter } from '@codemirror/language';
import { compileString } from 'squint-cljs';

let theme = EditorView.theme({
  ".cm-content": {whitespace: "pre-wrap",
                  passing: "10px 0",
                  flex: "1 1 0"},

  "&.cm-focused": {outline: "0 !important"},
  ".cm-line": {"padding": "0 9px",
               "line-height": "1.6",
               "font-size": "16px",
               "font-family": "var(--code-font)"},
  ".cm-matchingBracket": {"border-bottom": "1px solid var(--teal-color)",
                          "color": "inherit"},
  ".cm-gutters": {background: "transparent",
                  border: "none"},
  ".cm-gutterElement": {"margin-left": "5px"},
  // only show cursor when focused
  ".cm-cursor": {visibility: "hidden"},
  "&.cm-focused .cm-cursor": {visibility: "visible"}
});

let evalCode = async function (code) {
  let js = compileString(`(do ${code})`, {repl: true,
                                          context: 'return',
                                          "elide-exports": true})
  let result;
  try {
    result = {value: await eval(`(async function() { ${js} })()`)};
  }
  catch (e) {
    result = {error: true, ex: e};
  }
  if (result.error) {
    document.getElementById("result").innerText = result.ex;
  } else {
    document.getElementById("result").innerText = '' + JSONstringify(result.value);
  }
}

let evalCell = (opts) => {
  let code = opts.state.doc.toString();
  evalCode(code);
}

function JSONstringify(json) {
  json = JSON.stringify(json, function(key, value) {
    if (!value) return value;
    if (typeof value === 'string') return value;
    if (Array.isArray(value) || value.constructor === Object) return value;
    if (value[Symbol.iterator]) {
      return [...value];
    }
    if (typeof value === 'object') {
      return `#object[${value.constructor.name}]`;
    } else {
      return value;
    }
  });
  return json;
}

let evalAtCursor = function (opts) {
  let state = opts.state;
  let code = cursor_node_string(state);
  evalCode(code);
}

let squintExtension = ( opts ) => {
  return keymap.of([{key: "Alt-Enter", run: evalCell},
                    {key: opts.modifier + "-Enter",
                     run: evalAtCursor}])}


let extensions = [ theme, foldGutter(),
                   syntaxHighlighting(defaultHighlightStyle),
                   drawSelection(),
                   keymap.of(complete_keymap),
                   ...default_extensions,
                   eval_ext({modifier: "Meta"}),
                   squintExtension({modifier: "Meta"})
                 ];

export let doc = `(comment
  (fizz-buzz 1)
  (fizz-buzz 3)
  (fizz-buzz 5)
  (fizz-buzz 15)
  (fizz-buzz 17)
  (fizz-buzz 42))

(defn fizz-buzz [n]
  (condp (fn [a b] (zero? (mod b a))) n
    15 "fizzbuzz"
    3  "fizz"
    5  "buzz"
    n))


(require '["https://esm.sh/canvas-confetti@1.6.0$default" :as confetti])
(confetti)
`  ;

evalCode(doc);

let state = EditorState.create( {doc: doc,
                                 extensions: extensions });

let editorElt = document.querySelector('#editor');
let editor = new EditorView({state: state,
                             parent: editorElt,
                             extensions: extensions })
