// import './src-squint/nextjournal/clojure_mode/node.mjs';
// import './src-squint/nextjournal/clojure_mode/extensions/close_brackets.mjs';
// import './src-squint/nextjournal/clojure_mode/extensions/match_brackets.mjs';
// import './src-squint/nextjournal/clojure_mode/extensions/formatting.mjs';
// import './src-squint/nextjournal/clojure_mode/extensions/selection_history.mjs';
// import './src-squint/nextjournal/clojure_mode/commands.mjs';
// import './src-squint/nextjournal/clojure_mode/keymap.mjs';
import { default_extensions, complete_keymap } from './src-squint/nextjournal/clojure_mode.mjs';
import { theme } from './src-squint/nextjournal/clojure_mode/demo.mjs';

import { EditorView, drawSelection, keymap } from  '@codemirror/view';
import { EditorState } from  '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle, foldGutter } from '@codemirror/language';

let extensions = [ theme, foldGutter(),
                   syntaxHighlighting(defaultHighlightStyle),
                   drawSelection(),
                   keymap.of(complete_keymap),
                    ...default_extensions
                 ];

let state = EditorState.create( {doc: "(+ 1 2 3)",
                                 extensions: extensions });
let editorElt = document.querySelector('#editor');
let editor = new EditorView({state: state,
                             parent: editorElt,
                             extensions: extensions });


// TODO:

// fix failing test

// node:internal/process/esm_loader:94
// internalBinding('errors').triggerUncaughtException(
//     ^

//   AssertionError [ERR_ASSERTION]: '< ()>' == '<()>'
//   at file:///Users/borkdude/dev/clojure-mode/public/squint/js/src-squint/nextjournal/clojure_mode_tests.mjs:129:15
//   at ModuleJob.run (node:internal/modules/esm/module_job:198:25)
//   at async Promise.all (index 0)
//   at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
//   at async loadESM (node:internal/process/esm_loader:88:5)
//   at async handleMainPromise (node:internal/modules/run_main:61:12) {
//     generatedMessage: true,
//     code: 'ERR_ASSERTION',
//     actual: '< ()>',
//     expected: '<()>',
//     operator: '=='
//   }

// - [ ] resolve symbolic namespaces to local JS files
// and transitively compile them?
// - [ ] tests
// - [ ] bun loader experiment
