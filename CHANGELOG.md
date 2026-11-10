# Changelog

## 0.3.4

- Make Option+S run `unwrap` on macOS with `@codemirror/view` 6.38.1 or later ([#62](https://github.com/nextjournal/clojure-mode/pull/62))
- Make Backspace delete an escape sequence in a string as a whole, instead of leaving a backslash that escapes the closing quote ([@bbatsov](https://github.com/bbatsov))
- Fix [#63](https://github.com/nextjournal/clojure-mode/issues/63): typing `"` before the closing quote of a string moves past it
- Handle a bracket typed after the `\\` character literal as code ([#66](https://github.com/nextjournal/clojure-mode/pull/66))
- Fix wrapping a selection in brackets with the squint build ([#67](https://github.com/nextjournal/clojure-mode/pull/67))
- Insert a closing bracket typed in a line comment, instead of dropping it and jumping to the next closing bracket after the comment ([@bbatsov](https://github.com/bbatsov))
- Bump `squint-cljs` to `0.11.188`

## 0.3.3

- Fix [#54](https://github.com/nextjournal/clojure-mode/issues/54): support slurping from within string literal

## 0.3.2

- Bump squint to 0.7.105
- Fix [#49](https://github.com/nextjournal/clojure-mode/issues/49): bug with hitting backspace after line comment

## 0.3.1

- Fix [#45](https://github.com/nextjournal/clojure-mode/issues/45): cursor after Discard node should evaluate child
