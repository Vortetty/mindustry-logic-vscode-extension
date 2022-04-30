"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diff = require("diff");
let old_doc = `
print "frog"
jump 4 notEqual true false
print "frog1"
print "frog2"
print "frog3"
`;
let old_doc_tmp = old_doc.split(/\n|\r|\r\n/);
let line_count = old_doc_tmp.length;
let numberChars = line_count.toString().length;
let prefixStrLength = `${"0".repeat(numberChars - (0).toString().length)}0|`.length;
for (let i = 0; i < old_doc_tmp.length; i++) {
    old_doc_tmp[i] = `${"0".repeat(numberChars - i.toString().length)}${i}|` + old_doc_tmp[i];
}
old_doc = old_doc_tmp.join('\n');
let new_doc_tmp = old_doc.split(/\n|\r|\r\n/);
let changes = [
    {
        range: {
            start: { line: 3, character: 0 },
            end: { line: 4, character: 3 }
        },
        rangeLength: 0,
        rangeOffset: 0,
        text: ""
    }
];
// Iterate changes and replace the ranges with the new text
for (let change of changes) {
    let start = { line: change.range.start.line, character: change.range.start.character + prefixStrLength };
    let end = { line: change.range.end.line, character: change.range.end.character + prefixStrLength };
    let text = change.text;
    if (start.line == end.line) {
        new_doc_tmp[start.line] = new_doc_tmp[start.line].substring(0, start.character) + text + new_doc_tmp[start.line].substring(end.character, new_doc_tmp[start.line].length);
    }
    else {
        new_doc_tmp[start.line] = new_doc_tmp[start.line].substring(0, start.character) + text;
        let adjusted = 0;
        for (let i = start.line + 1; i < end.line; i++) {
            adjusted++;
            new_doc_tmp.splice(i, 1);
        }
        new_doc_tmp[end.line - adjusted] = new_doc_tmp[end.line - adjusted].substring(0, prefixStrLength) + new_doc_tmp[end.line - adjusted].substring(end.character, new_doc_tmp[end.line - adjusted].length);
    }
}
let new_doc = new_doc_tmp.join("\n");
let diffed = diff.diffLines(old_doc, new_doc, { newlineIsToken: true });
console.log(diffed);
let diffprint = "";
for (let i = 0; i < diffed.length; i++) {
    if (diffed[i].added) {
        diffprint += `\x1b[32m${diffed[i].value}`;
    }
    else if (diffed[i].removed) {
        if (diffed[i + 1] && diffed[i + 1].added) {
            if (diffed[i + 1].value.match(/^[0-9]+\|.+$/gm))
                diffprint += `\x1b[33m${diffed[i].value} -> ${diffed[i + 1].value}`;
            else
                diffprint += `\x1b[31m${diffed[i].value}`;
            i++;
        }
        else {
            //if (diffed[i+1].value.match(`^[0-9]{${prefixStrLength}}}\|.+$`)) diffprint += `\x1b[0m${diffed[i].value}`;
            diffprint += `\x1b[31m${diffed[i].value}`;
        }
    }
    else {
        diffprint += "\x1b[0m" + diffed[i].value;
    }
}
diffprint += "\x1b[0m";
console.log(diffprint);
//# sourceMappingURL=diffing.js.map