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
const vscode = require("vscode");
const cp = require("child_process");
function getOpenFile() {
    if (vscode.window.activeTextEditor != undefined) {
        let currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
        if (process.platform === "win32" && (currentlyOpenTabfilePath.startsWith("/") || currentlyOpenTabfilePath.startsWith("\\"))) {
            return currentlyOpenTabfilePath.substring(1).replace("\\", "/");
        }
        return currentlyOpenTabfilePath.replace("\\", "/");
    }
}
function getCurrentWorkspace() {
    if (vscode.workspace.workspaceFolders != undefined) {
        let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
        if (process.platform === "win32" && (workspaceFolder.startsWith("/") || workspaceFolder.startsWith("\\"))) {
            return workspaceFolder.substring(1).replace("\\", "/");
        }
        return workspaceFolder;
    }
    else {
        let file = getOpenFile();
        if (file != undefined) {
            return file.replace("\\", "/").substring(0, file.lastIndexOf("/"));
        }
    }
    return undefined;
}
function activate(context) {
    let myExtDir = context.extensionPath;
    let pythonScript = myExtDir + "/python/c2logic/compiler.py";
    var isWin = process.platform === "win32"; // This is a just in case i need it
    const execShell = (cmd) => new Promise((resolve, reject) => {
        cp.exec(cmd, (err, out) => {
            if (err) {
                return reject(err);
            }
            return resolve(out);
        });
    });
    let logic0 = vscode.commands.registerCommand('mindustry-logic.compileLogicO0', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O0`).then((out) => {
            vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O0 optimizations`);
        });
    });
    let logic1 = vscode.commands.registerCommand('mindustry-logic.compileLogicO1', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O1`).then((out) => {
            vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O1 optimizations`);
        });
    });
    let logic2 = vscode.commands.registerCommand('mindustry-logic.compileLogicO2', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O2`).then((out) => {
            vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O2 optimizations`);
        });
    });
    let logic3 = vscode.commands.registerCommand('mindustry-logic.compileLogicO3', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O3`).then((out) => {
            vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O3 optimizations`);
        });
    });
    context.subscriptions.push(logic0);
    context.subscriptions.push(logic1);
    context.subscriptions.push(logic2);
    context.subscriptions.push(logic3);
    let createIncludes = vscode.commands.registerCommand('mindustry-logic.createIncludes', async function () {
        try {
            let workspaceFolder = getCurrentWorkspace();
            let userPath = await vscode.window.showInputBox({
                placeHolder: "include/",
                prompt: "Path (relative to workspace root)",
                value: "include/"
            });
            let includePath = workspaceFolder + "/" + userPath + "/c2logic";
            execShell(`python -c "__import__('os').makedirs('${includePath}', exist_ok=True)"`).then((out) => {
            });
            execShell(`python -c "import shutil; [shutil.copy(f'${myExtDir}/python/include/{header}', f'${includePath}/{header}') for header in ['builtins.h', 'io.h']]"`).then((out) => {
                vscode.window.showInformationMessage(`Created ${includePath}/builtins.h and ${includePath}/io.h`);
            });
        }
        catch (e) {
            vscode.window.showErrorMessage(e);
        }
    });
    context.subscriptions.push(createIncludes);
    // Semantic tokens
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'mlog' }, new DocumentSemanticTokensProvider(), legend));
}
function deactivate() { }
module.exports = {
    activate,
    deactivate
};
const tokenTypes = new Map();
const tokenModifiers = new Map();
const legend = (function () {
    const tokenTypesLegend = [
        'mlog_method',
        'mlog_keyword',
        'mlog_parameter',
        'mlog_variable',
        'mlog_string',
        'mlog_number',
        'mlog_comment',
        'mlog_unknown', // Unknown tokens
    ];
    tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));
    const tokenModifiersLegend = [
        'mlog_readonly',
        'mlog_invalid',
        'mlog_unknown', // Unknown parameter but correct type
    ];
    tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));
    return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();
class DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document, token) {
        const allTokens = await this._parseText(document.getText());
        const builder = new vscode.SemanticTokensBuilder(legend);
        allTokens.forEach((token) => {
            builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
        });
        return builder.build();
    }
    _encodeTokenType(tokenType) {
        return tokenTypes.get(tokenType);
    }
    _encodeTokenModifiers(strTokenModifiers) {
        let result = 0;
        for (let i = 0; i < strTokenModifiers.length; i++) {
            const tokenModifier = strTokenModifiers[i];
            if (tokenModifiers.has(tokenModifier)) {
                result = result | (1 << tokenModifiers.get(tokenModifier));
            }
            else if (tokenModifier === 'notInLegend') {
                result = result | (1 << tokenModifiers.size + 2);
            }
        }
        return result;
    }
    async _parseText(text) {
        const r = [];
        const lines = text.split(/\r\n|\r|\n/);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const words = line.split(/(\w+|\s+|".*"|'.*')/g).filter(x => x !== '');
            if (commands.get(words[0]) != undefined) {
                (await commands.get(words[0])(i, words, line)).forEach((token) => {
                    r.push(token);
                });
            }
            else if (words[0] != undefined) {
                (await commands.get('__internal_unknown_instruction')(i, words, line)).forEach((token) => {
                    r.push(token);
                });
            }
        }
        return r;
    }
    _parseTextToken(text) {
        const parts = text.split('.');
        return {
            tokenType: parts[0],
            tokenModifiers: parts.slice(1)
        };
    }
}
function identifyType(text) {
    if (text.startsWith("\"") || text.startsWith("'") && text.endsWith(text.substring(0, 1))) {
        return "mlog_string";
    }
    else if (/\d+/.test(text)) {
        return "mlog_number";
    }
    else {
        return "mlog_keyword";
    }
}
;
let commands = new Map();
commands.set('set', async function (lineNum, words, line) {
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
            tokenType = identifyType(token);
        let _tokenModifiers = i > 2 ? ['invalid'] : [];
        tokens.push({
            line: lineNum,
            startCharacter: offset,
            length: token.length,
            tokenType: tokenType,
            tokenModifiers: _tokenModifiers
        });
        offset += token.length + spaces;
        parsedWords++;
    }
    return tokens;
});
commands.set("__internal_unknown_instruction", async function (lineNum, words, line) {
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
            tokenType = identifyType(token);
        let _tokenModifiers = ['unknown'];
        tokens.push({
            line: lineNum,
            startCharacter: offset,
            length: token.length,
            tokenType: tokenType,
            tokenModifiers: _tokenModifiers
        });
        offset += token.length + spaces;
        parsedWords++;
    }
    return tokens;
});
//# sourceMappingURL=extension.js.map