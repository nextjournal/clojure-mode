import './src-squint/nextjournal/clojure_mode/util.mjs';
import './src-squint/nextjournal/clojure_mode/node.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/close_brackets.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/match_brackets.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/formatting.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/selection_history.mjs';
import './src-squint/nextjournal/clojure_mode/commands.mjs';
import './src-squint/nextjournal/clojure_mode/keymap.mjs';
import './src-squint/nextjournal/clojure_mode.mjs';

import { EditorView } from  '@codemirror/view';
import { EditorState } from  '@codemirror/state';


let state = EditorState.create({doc: "(+ 1 2 3)"});
let editorElt = document.querySelector('#editor');
let editor = new EditorView({state: state,
                             parent: editorElt });

console.log();
console.log('hello');
