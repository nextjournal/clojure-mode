export const foldNodeProps = {
    Vector(tree) { return {from: tree.start + 1, to: tree.end - 1} },
    Map(tree) { return {from: tree.start + 1, to: tree.end - 1} },
    Set(tree) { return {from: tree.start + 1, to: tree.end - 1} },
    List(tree) { return {from: tree.start + 1, to: tree.end - 1} }
}

export const styleTags = {
    "VarName/Symbol": "variableName definition",
    Def: "atom",
    Defn: "atom",
    Boolean: "atom",
    DocString: "+emphasis",
    Ignored: "comment",
    Comment: "lineComment",
    Number: "number",
    String: "string",
    Keyword: "atom",
    Nil: "null",
    Symbol: "labelName",
    LineComment: "lineComment",
    RegExp: "regexp"
}

export const languageData = {
    // closeBrackets: {brackets: ["(", "[", "{", "'", '"', "'''", '"""']},
    commentTokens: {line: ";;"}
}
