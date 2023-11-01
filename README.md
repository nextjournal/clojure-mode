# Clojure/Script mode for [CodeMirror 6](https://codemirror.net/6/)

Enabling a decent Clojure/Script editor experience in the browser. Built for and by [Nextjournal](https://nextjournal.com/).

* **[🤹‍♀️ Live demo with in-browser eval](https://nextjournal.github.io/clojure-mode/)**
* [🐢 Try it in Nextjournal](https://nextjournal.com/try/clojure?cm6=1)
* [📦 Use it in your project](#use-it-in-your-project)

## ✨ Features

**⚡️ Lightning-fast thanks to [lezer incremental parsing](https://lezer.codemirror.net/)**
* Try pasting [`clojure/core.clj`](https://raw.githubusercontent.com/clojure/clojure/master/src/clj/clojure/core.clj) into the [live demo](https://nextjournal.github.io/clojure-mode/).

**🥤 Slurping & 🤮 Barfing**  
* Forward: <kbd>Ctrl</kbd> + <kbd>←</kbd> / <kbd>→</kbd> or <kbd>Mod</kbd> + <kbd>⇧</kbd> + <kbd>J</kbd> / <kbd>K</kbd>  
* Backward: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>←</kbd> / <kbd>→</kbd>

**💗 Semantic Selections**
* Expand/Contract: <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>	or <kbd>Mod</kbd> + <kbd>1</kbd> / <kbd>2</kbd>

🧙 **Prepared for evaluation**
* At Cursor: <kbd>Alt</kbd> + <kbd>⏎</kbd>
* Top-level form: <kbd>Alt</kbd> + <kbd>⇧</kbd> + <kbd>⏎</kbd>
* Cell: <kbd>Mod</kbd> + <kbd>⏎</kbd>

**🧹 Autoformatting** following [Tonsky’s Better Clojure Formatting](https://tonsky.me/blog/clojurefmt/)

🎹 **And lots of more useful [key bindings](https://nextjournal.github.io/clojure-mode/#keybindings)**

## 📦 Use it in your project

### Include it in your `deps.edn`

```clojure
{:deps {io.github.nextjournal/clojure-mode {:git/sha "<SHA>"}}}
```

### Use if from [NPM](https://www.npmjs.com/package/@nextjournal/clojure-mode)

```js
import { default_extensions, complete_keymap } from '@nextjournal/clojure-mode';
import { EditorView, drawSelection, keymap } from  '@codemirror/view';
import { EditorState } from  '@codemirror/state';

let extensions = [keymap.of(complete_keymap),
                  ...default_extensions
                 ];

let state = EditorState.create({doc: "... some clojure code...",
                                 extensions: extensions });
let editorElt = document.querySelector('#editor');
let editor = new EditorView({state: state,
                             parent: editorElt,
                             extensions: extensions });
```

## 🛠 Development Setup

* Install JS dependencies: `yarn install`
* Start dev server: `yarn watch`
* Open the demo page at http://localhost:8002/

## ⚖️ License

Licensed under the EPL License, Copyright © 2020-present Nextjournal GmbH.

See [LICENSE](https://github.com/nextjournal/clojure-mode/blob/master/LICENSE) for more information.
