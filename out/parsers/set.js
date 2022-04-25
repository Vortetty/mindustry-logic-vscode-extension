"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setParser = void 0;
const globals_1 = require("./globals");
let expected_token_count = 3;
async function setParser(lineNum, words, line, lines) {
    let tokens = [];
    let offset = 0;
    let parsedWords = 0;
    for (let i = 0; i < Math.ceil(words.length / 2); i++) {
        let token = words[i * 2] == undefined ? "" : words[i * 2];
        let spaces = words[i * 2 + 1] == undefined ? 0 : words[i * 2 + 1].length;
        let tokenType = '';
        if (i == 0)
            tokenType = 'mlog_method';
        else if (i == 1)
            tokenType = 'mlog_variable';
        else
            tokenType = (0, globals_1.identifyType)(token);
        let _tokenModifiers = [...(0, globals_1.identifyModifiers)(token, [tokenType], i, expected_token_count)];
        if (i > 2)
            _tokenModifiers.push('mlog_invalid');
        tokens.push({
            line: lineNum,
            startCharacter: offset,
            length: token.length + spaces,
            tokenType: tokenType,
            tokenModifiers: _tokenModifiers
        });
        offset += token.length + spaces;
        parsedWords++;
    }
    return tokens;
}
exports.setParser = setParser;
//# sourceMappingURL=set.js.map