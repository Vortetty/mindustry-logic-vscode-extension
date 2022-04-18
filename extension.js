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

const vscode = require('vscode');
const cp = require('child_process');

function getOpenFile() {
	let currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;

	if (process.platform === "win32" && (currentlyOpenTabfilePath.startsWith("/") || currentlyOpenTabfilePath.startsWith("\\"))) {
		return currentlyOpenTabfilePath.substring(1);
	}

	return currentlyOpenTabfilePath;
}

function getCurrentWorkspace() {
	let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;

	if (process.platform === "win32" && (workspaceFolder.startsWith("/") || workspaceFolder.startsWith("\\"))) {
		return workspaceFolder.substring(1);
	}

	return workspaceFolder;
}

function activate(context) {
	let myExtDir = vscode.extensions.getExtension("vortetty.mindustry-logic").extensionPath;
	let pythonScript = myExtDir + "/python/c2logic/compiler.py";
	var isWin = process.platform === "win32";

	// 

	const execShell = (cmd) =>
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

		} catch (e) {
			vscode.window.showErrorMessage(e);
		}
	});
	context.subscriptions.push(createIncludes);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
