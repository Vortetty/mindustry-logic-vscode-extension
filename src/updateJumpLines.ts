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
import { vscodeGetDiff } from 'winterdiff'

export function setupJumpFixer(context: vscode.ExtensionContext) {
    let jumpLineUpdates: Map<vscode.Uri, boolean> = new Map();

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(function (event: vscode.TextDocumentChangeEvent) {
            if (event.document.languageId == 'mlog' && !jumpLineUpdates.get(event.document.uri) && event.reason != vscode.TextDocumentChangeReason.Undo && event.reason != vscode.TextDocumentChangeReason.Redo) {
                let diff = vscodeGetDiff(event.document, event.contentChanges);
            }
        })
    );
}