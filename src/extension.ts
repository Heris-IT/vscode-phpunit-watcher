// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from "child_process";

let myStatusBarItem: vscode.StatusBarItem;

let running: boolean = false;

let outputChannel = vscode.window.createOutputChannel('PHPUnit Watcher');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate({ subscriptions }: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "phpunit-watcher" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('phpunit-watcher.runTests', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Running all PHPUnit tests!');
		updateStatusBarItem();
	});

	subscriptions.push(disposable);

	const myCommandId = 'phpunit-watcher.runTests';
	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
	myStatusBarItem.command = myCommandId;

	// subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	// subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
	subscriptions.push(vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		if (document.languageId === "php") {
			// do work
			updateStatusBarItem();
		}
	}));
	// update status bar item once at start
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? '';
	if (!running) {
		running = true;
		exec(
			`phpunit tests`,
			{
				cwd: workspaceFolder
			},
			(error, stdout, stderr) => {
				running = false;
				console.log(stdout);
				outputChannel.clear();
				outputChannel.append(stdout);
				if (error) {
					console.log(`error: ${error.message}`);
					//return;
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					return;
				}

				const result = parseResults(stdout);

				myStatusBarItem.text = showResults(result);
				myStatusBarItem.show();
			}
		);
		myStatusBarItem.text = `PHPUnit running...`;
		myStatusBarItem.show();
	}
}

type Status = 'OK' | 'FAIL';

type Results = {
	okTasks: number,
	totalTasks: number,
	percentage: number,
	time: string,
	memory: string,
	status: Status,
	tests: number,
	assertions: number,
	failures: number,
	success: boolean,
};

function parseResults(results: string): Results {
	const regex = new RegExp(/(\d+) \/ (\d+) \((\d\d?\d?)\%\).*\r?\n\r?\nTime: (\d{2}:\d{2}.\d{3}), Memory: (\d+(?:.\d+)? (?:M|G)B)\r?\n\r?\n(?:(OK) \((\d+) tests, (\d+) assertions\)|(?:.*\r?\n)*(FAIL)URES!\r?\nTests: (\d+), Assertions: (\d+), Failures: (\d+))/, 'gm');
	const a = regex.exec(results);
	const [, okTasks, totalTasks, percentage, time, memory, successStatus, successTests, successAssertions, failStatus, failTests, failAssertions, failures] = a ?? [];
	const result: Results = {
		okTasks: +okTasks,
		totalTasks: +totalTasks,
		percentage: +percentage,
		time,
		memory,
		status: (successStatus ?? failStatus) as Status,
		tests: +(successTests ?? failTests),
		assertions: +(successAssertions ?? failAssertions),
		failures: +(failures ?? 0),
		success: successStatus === 'OK'
	};
	console.log(result);
	return result;
}

function showResults({ success, failures }: Results): string {
	if (success) {
		return `PHPUnit Success`;
	} else {
		return `PHPUnit Failure (${failures} failures)`;
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
