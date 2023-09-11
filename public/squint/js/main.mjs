import './src-squint/nextjournal/clojure_mode/util.mjs';
import './src-squint/nextjournal/clojure_mode/node.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/close_brackets.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/match_brackets.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/formatting.mjs';
import './src-squint/nextjournal/clojure_mode/extensions/selection_history.mjs';
import './src-squint/nextjournal/clojure_mode/commands.mjs';
import './src-squint/nextjournal/clojure_mode/keymap.mjs';
import { default_extensions } from './src-squint/nextjournal/clojure_mode.mjs';
import { theme } from './src-squint/nextjournal/clojure_mode/demo.mjs';

import { EditorView } from  '@codemirror/view';
import { EditorState } from  '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle, foldGutter } from '@codemirror/language';

console.log(default_extensions);

let extensions = [ theme, foldGutter(),
                   (syntaxHighlighting(defaultHighlightStyle)),
                    ...default_extensions
                 ];

let state = EditorState.create( {doc: "(+ 1 2 3)",
                                 extensions: extensions });
let editorElt = document.querySelector('#editor');
let editor = new EditorView({state: state,
                             parent: editorElt,
                             extensions: extensions });

