"use strict";
// Copyright 2022 Winter/Vortetty
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeParser = void 0;
const globals_1 = require("./globals");
let expected_token_count = 4;
async function writeParser(lineNum, words, line, lines) {
    let tokens = [];
    let offset = 0;
    let parsedWords = 0;
    for (let i = 0; i < Math.ceil(words.length / 2); i++) {
        let token = words[i * 2] == undefined ? "" : words[i * 2];
        let spaces = words[i * 2 + 1] == undefined ? 0 : words[i * 2 + 1].length;
        let tokenType = '';
        if (i == 0)
            tokenType = 'mlog_method';
        else
            tokenType = (0, globals_1.identifyType)(token, i, expected_token_count);
        let _tokenModifiers = [...(0, globals_1.identifyModifiers)(token, [tokenType], i, expected_token_count)];
        //if (i == 2 && !/^cell\d+$/.test(token)) _tokenModifiers.push('mlog_invalid');
        //else if (i == 3 && !/^\d+$/.test(token)) _tokenModifiers.push('mlog_invalid');
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
exports.writeParser = writeParser;
