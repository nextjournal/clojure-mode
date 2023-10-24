import * as squint_core from 'squint-cljs/core.js';
import * as view from '@codemirror/view';
import { EditorView } from '@codemirror/view';
var theme = EditorView.theme(({ ".cm-content": ({ "white-space": "pre-wrap", "padding": "10px 0", "flex": "1 1 0" }), "&.cm-focused": ({ "outline": "0 !important" }), ".cm-line": ({ "padding": "0 9px", "line-height": "1.6", "font-size": "16px", "font-family": "var(--code-font)" }), ".cm-matchingBracket": ({ "border-bottom": "1px solid var(--teal-color)", "color": "inherit" }), ".cm-gutters": ({ "background": "transparent", "border": "none" }), ".cm-gutterElement": ({ "margin-left": "5px" }), ".cm-cursor": ({ "visibility": "hidden" }), "&.cm-focused .cm-cursor": ({ "visibility": "visible" }) }));

export { theme }
