# codemirror-clojure

dev: `shadow-cljs watch app`

In progress:
- [ ] indentation.
  - operators are recognized (lists with symbol in 1st position)
  - cannot 'indent-all', changes on one line don't affect measurements taken on subsequent lines
- [ ] deletion
  - odd error recovery behaviour - a `#` token can't be deleted

Next
- Kill (remove all children of current node starting on current line)
- Navigate left/right by sexp
- GitHub Action to publish demo site to github.io
- Expand/contract region
- Unwrap current collection
- Slurp
