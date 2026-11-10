# Changelog

## 0.3.4

- Make Option+S run `unwrap` on macOS with `@codemirror/view` 6.38.1 or later
- Make Backspace delete an escape sequence in a string as a whole, instead of leaving a backslash that escapes the closing quote
- Fix [#63](https://github.com/nextjournal/clojure-mode/issues/63): typing `"` before the closing quote of a string moves past it
- Handle a bracket typed after the `\\` character literal as code
- Fix wrapping a selection in brackets with the squint build
- Insert a closing bracket typed in a line comment, instead of dropping it and jumping to the next closing bracket after the comment

## 0.3.3

- Fix [#54](https://github.com/nextjournal/clojure-mode/issues/54): support slurping from within string literal

## 0.3.2

- Bump squint to 0.7.105
- Fix [#49](https://github.com/nextjournal/clojure-mode/issues/49): bug with hitting backspace after line comment

## 0.3.1

- Fix [#45](https://github.com/nextjournal/clojure-mode/issues/45): cursor after Discard node should evaluate child
