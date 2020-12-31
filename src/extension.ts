// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from "child_process";
import { parseLanguageIds, parseResults, showResults } from './utils';

let myStatusBarItem: vscode.StatusBarItem;

let running: boolean = false;

let outputChannel = vscode.window.createOutputChannel('PHPUnit Watcher');

let triggerLanguageIds: string[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate({ subscriptions }: vscode.ExtensionContext) {
	triggerLanguageIds = parseLanguageIds(vscode.workspace.getConfiguration('phpunit-watcher').get<string>('triggerLanguageIds'));
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
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
	myStatusBarItem.command = myCommandId;

	subscriptions.push(vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		if (triggerLanguageIds.includes(document.languageId)) {
			// do work
			updateStatusBarItem();
		}
	}));
	// update status bar item once at start
	updateStatusBarItem();
}

async function updateStatusBarItem(): Promise<void> {
	const configuration = vscode.workspace.getConfiguration('phpunit-watcher');
	const workspaceFolder = ((configuration?.projectFolder !== '${workspaceFolder}' ? configuration?.projectFolder : undefined) || vscode.workspace.workspaceFolders?.[0].uri.fsPath) ?? '';
	const phpunit = configuration?.phpunit || 'phpunit';
	const php = configuration?.php || 'php';
	let files: vscode.Uri[] = [];
	if (configuration?.useComposer) {
		files = await vscode.workspace.findFiles('vendor/phpunit/phpunit/phpunit', '', 10);
	}
	const useComposer = configuration?.useComposer && files[0] ? `${php} ${files[0].fsPath}` : false;

	const phpunitArguments = configuration?.phpunitArguments || 'tests';
	const phpunitCommand = `${useComposer || phpunit} ${phpunitArguments}`;
	if (!running) {
		running = true;
		exec(
			phpunitCommand,
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
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					outputChannel.clear();
					outputChannel.append(stderr);
					myStatusBarItem.text = 'PHPUnit Fatal error';
					myStatusBarItem.show();
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

// this method is called when your extension is deactivated
export function deactivate() { }
