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
exports.setupJumpFixer = void 0;
const vscode = require("vscode");
function setupJumpFixer(context) {
    let jumpLineUpdates = new Map();
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(function (event) {
        if (event.document.languageId == 'mlog' && !jumpLineUpdates.get(event.document.uri) && event.reason != vscode.TextDocumentChangeReason.Undo && event.reason != vscode.TextDocumentChangeReason.Redo) {
            //    const document: vscode.TextDocument = event.document;
            //    const edits: readonly vscode.TextDocumentContentChangeEvent[] = event.contentChanges;
            //    const text: string = document.getText();
            //    const lines: string[] = text.split(/\r\n|\r|\n/);
            //    for (let edit of edits) {
            //        const start: number = edit.range.start.line;
            //        const end: number = edit.range.end.line;
            //        const changedLines: number[] = [...Array(end-start+1).keys()].map(i => i + start);
            //        // Correct line numbers in doc, say you have
            //        // ```
            //        //   print "frog"
            //        //   jump 4 notEqual true false
            //        //   print "frog"
            //        //   print "frog"
            //        //   print "frog"
            //        // ```
            //        // and line 2 is deleted
            //        // you would need to correct the line numbers in the jump line like so:
            //        // ```
            //        //   print "frog"
            //        //   jump 3 notEqual true false
            //        //   print "frog"
            //        //   print "frog"
            //        // ```
            //        for (let i = 0; i < lines.length; i++) {
            //            for (let j of changedLines) {
            //                if (lines[i].includes(`jump ${j}`)) {
            //                    const newLine: string = lines[i].replace(`jump ${j}`, `jump ${j - (start-end)}`);
            //                    lines[i] = newLine;
            //                }
            //            }
            //        }
            //        // Write new text to document
            //        const newText: string = [...lines,"edited"].join('\n');
            //        let newEdit = new vscode.WorkspaceEdit();
            //        newEdit.replace(
            //            document.uri,
            //            new vscode.Range(0, 0, lines.length, lines[lines.length-1].length-1),
            //            newText,
            //            {
            //                needsConfirmation: false,
            //                label: 'MLOG Jump Fixer',
            //                description: 'Fixed jump line numbers - vortetty.mlog:jumpFixer'
            //            }
            //        );
            //        jumpLineUpdates.set(document.uri, true);
            //        vscode.workspace.applyEdit(newEdit);
            //    }
            //} else {
            //    if (jumpLineUpdates.get(event.document.uri)) jumpLineUpdates.set(event.document.uri, false);
            //    return;
        }
    }));
}
exports.setupJumpFixer = setupJumpFixer;
