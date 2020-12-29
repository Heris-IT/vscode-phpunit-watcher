import * as assert from 'assert';
import * as vscode from 'vscode';
import { showPlural } from '../../utils';

suite('Utils Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Show plural', () => {
        assert.strictEqual('1 error', showPlural(1, 'errors', 'error'));
        assert.strictEqual('2 errors', showPlural(2, 'errors', 'error'));
    });
});
