# codemirror-clojure

Live demo: https://nextjournal.github.io/codemirror.next-clojure/

## Dev Setup

* Install JS deps: `yarn install`
* Start dev server: `shadow-cljs watch app`
* Open demo page at http://localhost:8002/

## Todo

- [ ] "Yank" after kill (https://www.howtogeek.com/293850/how-to-use-macos-built-in-kill-and-yank-as-an-alternative-cut-and-paste/)

## Done

- [x] Expand/contract region
- [x] Barf
- [x] Slurp
- [x] Format whitespace (necessary for commands like Slurp to behave nicely)
- [x] Navigate left/right by sexp
- [x] cannot 'indent-all', changes on one line don't affect measurements taken on subsequent lines
- [x] operators are recognized (lists with symbol in 1st position)
- [x] Unwrap current collection
- [x] Kill (remove all children of current node starting on current line)
- [x] GitHub Action to publish demo site to github.io
- [x] indentation
- [x] odd error recovery behaviour - a `#` token can't be deleted
- [x] deletion
- [x] Copy/paste (only first line copies to clipboard?)
- [x] Ctrl-A => move to beginning of line (first non-whitespace char)