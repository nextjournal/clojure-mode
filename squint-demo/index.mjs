console.log("start")

import { default_extensions, complete_keymap } from '@nextjournal/clojure-mode';

import { EditorView, drawSelection, keymap } from  '@codemirror/view';
import { EditorState } from  '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle, foldGutter } from '@codemirror/language';

console.log("imported")

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

let extensions = [
                   theme,
                   foldGutter(),
                   syntaxHighlighting(defaultHighlightStyle),
                   drawSelection(),
                   keymap.of(complete_keymap),
                   ...default_extensions
                 ];

let state = EditorState.create({doc: "(+ 1 2 3)",
                                 extensions: extensions });
let editorElt = document.querySelector('#editor');
let editor = new EditorView({state: state,
                             parent: editorElt,
                             extensions: extensions });
