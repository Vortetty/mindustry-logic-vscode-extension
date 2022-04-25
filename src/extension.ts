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

import * as vscode from 'vscode';
import * as cp from 'child_process';
import { identifyType, IParsedToken, updateVars } from './parsers/globals';

function getOpenFile(): string | undefined {
    if (vscode.window.activeTextEditor != undefined) {
        let currentlyOpenTabfilePath: string = vscode.window.activeTextEditor.document.fileName;

        if (process.platform === "win32" && (currentlyOpenTabfilePath.startsWith("/") || currentlyOpenTabfilePath.startsWith("\\"))) {
            return currentlyOpenTabfilePath.substring(1).replace("\\", "/");
        }

        return currentlyOpenTabfilePath.replace("\\", "/");
    }
}

function getCurrentWorkspace(): string | undefined {
    if (vscode.workspace.workspaceFolders != undefined) {
        let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;

        if (process.platform === "win32" && (workspaceFolder.startsWith("/") || workspaceFolder.startsWith("\\"))) {
            return workspaceFolder.substring(1).replace("\\", "/");
        }

        return workspaceFolder;
    } else {
        let file = getOpenFile();
        if (file != undefined) {
            return file.replace("\\", "/").substring(0, file.lastIndexOf("/"));
        }
    }
    return undefined;
}

function activate(context: vscode.ExtensionContext) {
    let myExtDir = context.extensionPath;
    let pythonScript = myExtDir + "/python/c2logic/compiler.py";
    let isWin = process.platform === "win32"; // This is a just in case i need it

    const execShell = (cmd: string) =>
        new Promise((resolve, reject) => {
            cp.exec(cmd, (err, out) => {
                if (err) {
                    return reject(err);
                }
                return resolve(out);
            });
        });

    let logic0 = vscode.commands.registerCommand('mindustry-logic.compileLogicO0', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O0`).then(
            (out) => {
                vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O0 optimizations`);
            }
        )
    });
    let logic1 = vscode.commands.registerCommand('mindustry-logic.compileLogicO1', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O1`).then(
            (out) => {
                vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O1 optimizations`);
            }
        )
    });
    let logic2 = vscode.commands.registerCommand('mindustry-logic.compileLogicO2', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O2`).then(
            (out) => {
                vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O2 optimizations`);
            }
        )
    });
    let logic3 = vscode.commands.registerCommand('mindustry-logic.compileLogicO3', function () {
        let currentlyOpenTabfilePath = getOpenFile();
        execShell(`python ${pythonScript} ${currentlyOpenTabfilePath} -o ${currentlyOpenTabfilePath}.mlog -O3`).then(
            (out) => {
                vscode.window.showInformationMessage(`Created ${currentlyOpenTabfilePath}.mlog with O3 optimizations`);
            }
        )
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

            execShell(`python -c "__import__('os').makedirs('${includePath}', exist_ok=True)"`).then(
                (out) => {
                }
            );
            execShell(
                `python -c "import shutil; [shutil.copy(f'${myExtDir}/python/include/{header}', f'${includePath}/{header}') for header in ['builtins.h', 'io.h']]"`
            ).then(
                (out) => {
                    vscode.window.showInformationMessage(`Created ${includePath}/builtins.h and ${includePath}/io.h`);
                }
            )

        } catch (e: any) {
            vscode.window.showErrorMessage(e);
        }
    });
    context.subscriptions.push(createIncludes);

    // Semantic tokens
    let tokenProviderDeactivate = vscode.languages.registerDocumentSemanticTokensProvider({language: 'mlog'}, new DocumentSemanticTokensProvider(), legend);
    context.subscriptions.push(tokenProviderDeactivate);

    let config = vscode.workspace.getConfiguration();
    let oldColorConfig: Record<string, unknown> = config.get("editor.semanticTokenColorCustomizations", {});
    oldColorConfig["enabled"] = true;
    oldColorConfig["rules"] = {
        "*.mlog_invalid:mlog": {
            "fontStyle": "underline",
            "foreground": "#F72343"
        },
        "*.mlog_unknown:mlog": {
            "fontStyle": "underline italic",
        },
        ...(oldColorConfig["rules"] as Record<string, unknown>)
    };
    config.update("editor.semanticTokenColorCustomizations", oldColorConfig, vscode.ConfigurationTarget.Global);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}

//
// Semantic highlighting
//

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

const legend = (function () {
    const tokenTypesLegend = [
        'mlog_method',    // Instructions (e.g. sensor, op, etc.)
        'mlog_keyword',   // Keywords (e.g. pwr, xor, etc.)
        'mlog_parameter', // Parameters (e.g. node1)
        'mlog_variable',  // Variables set by user, also built-in constants
        'mlog_string',    // Strings (e.g. "Hello World")
        'mlog_number',    // Numbers (e.g. 123, -123, 0.123)
        'mlog_comment',   // Comments (e.g. # <comment text>)
        'mlog_unknown',   // Unknown tokens
    ];
    tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

    const tokenModifiersLegend = [
        'readonly', // Built-in constants
        'mlog_invalid',  // Invalid parameter type or syntax
        'mlog_unknown',  // Unknown parameter but correct type
    ];
    tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

    return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();

class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        const allTokens = await this._parseText(document.getText());
        const builder = new vscode.SemanticTokensBuilder(legend);
        allTokens.forEach((token) => {
            builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
        });
        return builder.build();
    }

    private _encodeTokenType(tokenType: string): number {
        return tokenTypes.get(tokenType)!;
    }

    private _encodeTokenModifiers(strTokenModifiers: string[]): number {
        let result = 0;
        for (let i = 0; i < strTokenModifiers.length; i++) {
            const tokenModifier = strTokenModifiers[i];
            if (tokenModifiers.has(tokenModifier)) {
                result = result | (1 << tokenModifiers.get(tokenModifier)!);
            } else if (tokenModifier === 'notInLegend') {
                result = result | (1 << tokenModifiers.size + 2);
            }
        }
        return result;
    }

    private async _parseText(text: string): Promise<IParsedToken[]> {
        const r: IParsedToken[] = [];
        const lines = text.split(/\r\n|\r|\n/);
        updateVars(lines);
        for (let i = 0; i < lines.length; i++) {
            let line: string = lines[i];
            let words: string[] = line.split(/([^\S\s]+|\s+|"[^\S\s]*"|'[^\S\s]*')/g).filter(x => x !== '');
            let comments: string[] = [];

            for (let j = 0; j < words.length; j++) {
                if (words[j].startsWith("#")) {
                    comments = words.slice(j);
                    words = words.slice(0, j);
                    line = line.substring(0, words.join("").length);
                    break;
                }
            }

            let tmpOffset = words.join("").length;
            r.push({
                line: i,
                startCharacter: tmpOffset,
                length: comments.join("").length,
                tokenType: 'mlog_comment',
                tokenModifiers: []
            });

            if (commands.get(words[0]) != undefined) {
                (await commands.get(words[0])!(i, words, line, lines)).forEach((token) => {
                    r.push(token);
                });
            } else if (words[0] != undefined) {
                (await commands.get('__internal_unknown_instruction')!(i, words, line, lines)).forEach((token) => {
                    r.push(token);
                });
            }
        }
        return r;
    }

    private _parseTextToken(text: string): { tokenType: string; tokenModifiers: string[]; } {
        const parts = text.split('.');
        return {
            tokenType: parts[0],
            tokenModifiers: parts.slice(1)
        };
    }
}

let commands: Map<string, (lineNum: number, words: string[], line: string, lines: string[]) => Promise<IParsedToken[]>> = new Map();

// Command order
//  - !Read         | read outvar cell1 0
//  - Write         | write outvar cell1 0
//  - Draw          | draw clear 0 0 0 0 0 0
//  - Print         | print "frog"
//  - Draw Flush    | drawflush display1
//  - Print Flush   | printflush message1
//  - !Get Link     | getlink outvar 0
//  - Control       | control enabled block1 0 0 0 0
//  - Radar         | radar enemy any any distance turret1 1 result
//  - !Sensor       | sensor outvar block1 @copper
//  - !Set          | set outvar 0
//  - !Operation    | op add outvar a b
//  - Wait          | wait 0.5
//  - !Lookup       | lookup item outvar 0
//  - End           | end
//  - Jump          | jump -1 notEqual x false
//  - Unit Bind     | ubind @poly
//  - Unit Control  | ucontrol approach 0 0 0 0 0
//  - !Unit Radar   | uradar enemy any any distance 0 1 outvar
//  - !Unit Locate  | ulocate building core true @copper outx outy outvar outvar
//
// prefix `!` means it defines a new variable or modifies a new variable

import { __internal_unknown_instructionParser } from './parsers/__internal_unknown_instruction';

import { readParser } from './parsers/read';
import { writeParser } from './parsers/write';
//import { drawParser } from './parsers/draw';
import { printParser } from './parsers/print';
import { drawflushParser } from './parsers/drawflush';
import { printflushParser } from './parsers/printflush';
import { getlinkParser } from './parsers/getlink';
//import { controlParser } from './parsers/control';
//import { radarParser } from './parsers/radar';
//import { sensorParser } from './parsers/sensor';
import { setParser } from './parsers/set';
//import { opParser } from './parsers/op';
//import { waitParser } from './parsers/wait';
//import { lookupParser } from './parsers/lookup';
//import { endParser } from './parsers/end';
//import { jumpParser } from './parsers/jump';
//import { ubindParser } from './parsers/ubind';
//import { ucontrolParser } from './parsers/ucontrol';
//import { uradarParser } from './parsers/uradar';
//import { ulocateParser } from './parsers/ulocate';



commands.set("__internal_unknown_instruction", __internal_unknown_instructionParser);

commands.set("read",  readParser);
commands.set("write", writeParser);
//commands.set("draw",  drawParser);
commands.set("print", printParser);
commands.set("drawflush", drawflushParser);
commands.set("printflush", printflushParser);
commands.set("getlink", getlinkParser);
//commands.set("control", controlParser);
//commands.set("radar", radarParser);
//commands.set("sensor", sensorParser);
commands.set("set", setParser);
//commands.set("op", opParser);
//commands.set("wait", waitParser);
//commands.set("lookup", lookupParser);
//commands.set("end", endParser);
//commands.set("jump", jumpParser);
//commands.set("ubind", ubindParser);
//commands.set("ucontrol", ucontrolParser);
//commands.set("uradar", uradarParser);
//commands.set("ulocate", ulocateParser);
