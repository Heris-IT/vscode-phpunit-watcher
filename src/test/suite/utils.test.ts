import * as assert from 'assert';
import * as vscode from 'vscode';
import { showPlural, parseLanguageIds, parseResults, getPUPUnitVersion, Version } from '../../utils';

suite('Utils Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Show plural', () => {
        assert.strictEqual('1 error', showPlural(1, 'errors', 'error'));
        assert.strictEqual('2 errors', showPlural(2, 'errors', 'error'));
    });

    test('parseLanguageIds', () => {
        assert.deepStrictEqual(['php', 'html'], parseLanguageIds('php,html'));
        assert.deepStrictEqual(['php', 'html'], parseLanguageIds('php,.html'));
        assert.deepStrictEqual(['php', 'html'], parseLanguageIds('', 'php,html'));
    });

    test('getPUPUnitVersion 10', () => {
        const data = `PHPUnit 10.5.0 by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 00:00.018, Memory: 4.00 MB

OK (9 tests, 15 assertions)`;
        assert.strictEqual(getPUPUnitVersion(data), Version.v10x);
    });

    test('getPUPUnitVersion 9', () => {
        const data = `PHPUnit 9.5.0 by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 00:00.018, Memory: 4.00 MB

OK (9 tests, 15 assertions)`;
        assert.strictEqual(getPUPUnitVersion(data), Version.v9x);
    });

    test('getPUPUnitVersion 8', () => {
        const data = `PHPUnit 8.5.14 by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 44 ms, Memory: 4.00 MB

OK (9 tests, 15 assertions)`;
        assert.strictEqual(getPUPUnitVersion(data), Version.v8x);
    });

    test('getPUPUnitVersion 7', () => {
        const data = `PHPUnit 7.5.0 by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 00:00.018, Memory: 4.00 MB

OK (9 tests, 15 assertions)`;
        assert.strictEqual(getPUPUnitVersion(data), Version.other);
    });

    test('parseResults OK PHPUnit 9', () => {
        const data = `PHPUnit 9.5.0 by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 00:00.018, Memory: 4.00 MB

OK (9 tests, 15 assertions)`;
        assert.deepStrictEqual(parseResults(data), {
            assertions: 15,
            errors: 0,
            failures: 0,
            memory: "4.00 MB",
            okTasks: 9,
            percentage: 100,
            status: "OK",
            success: true,
            tests: 9,
            time: "00:00.018",
            totalTasks: 9,
        });
    });

    test('parseResults OK PHPUnit 9 - 1 test', () => {
        const data = `PHPUnit 9.5.0 by Sebastian Bergmann and contributors.

.........                                                           1 / 1 (100%)

Time: 00:00.018, Memory: 4.00 MB

OK (1 test, 1 assertion)`;
        assert.deepStrictEqual(parseResults(data), {
            assertions: 1,
            errors: 0,
            failures: 0,
            memory: "4.00 MB",
            okTasks: 1,
            percentage: 100,
            status: "OK",
            success: true,
            tests: 1,
            time: "00:00.018",
            totalTasks: 1,
        });
    });

    test('parseResults FAIL PHPUnit 9', () => {
        const data = `PHPUnit 9.5.0 by Sebastian Bergmann and contributors.

F........                                                           9 / 9 (100%)

Time: 00:00.018, Memory: 4.00 MB

There was 1 failure:

1) HelperTest::testString
Failed asserting that two strings are identical.
--- Expected
+++ Actual
@@ @@
-'test'
+'the test'

C:\project\tests\HelperTest.php:20

FAILURES!
Tests: 9, Assertions: 15, Failures: 1.`;
        assert.deepStrictEqual(parseResults(data), {
            assertions: 15,
            errors: 0,
            failures: 1,
            memory: "4.00 MB",
            okTasks: 9,
            percentage: 100,
            status: "FAIL",
            success: false,
            tests: 9,
            time: "00:00.018",
            totalTasks: 9,
        });
    });

    test('parseResults OK PHPUnit 8', () => {
        const data = `PHPUnit 8.5.14 by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 44 ms, Memory: 4.00 MB

OK (9 tests, 15 assertions)`;
        assert.deepStrictEqual(parseResults(data), {
            assertions: 15,
            errors: 0,
            failures: 0,
            memory: "4.00 MB",
            okTasks: 9,
            percentage: 100,
            status: "OK",
            success: true,
            tests: 9,
            time: "44 ms",
            totalTasks: 9,
        });
    });

    test('parseResults OK PHPUnit 8 - 1 test', () => {
        const data = `PHPUnit 8.5.14 by Sebastian Bergmann and contributors.

.........                                                           1 / 1 (100%)

Time: 44 ms, Memory: 4.00 MB

OK (1 test, 1 assertion)`;
        assert.deepStrictEqual(parseResults(data), {
            assertions: 1,
            errors: 0,
            failures: 0,
            memory: "4.00 MB",
            okTasks: 1,
            percentage: 100,
            status: "OK",
            success: true,
            tests: 1,
            time: "44 ms",
            totalTasks: 1,
        });
    });

    test('parseResults FAIL PHPUnit 8', () => {
        const data = `PHPUnit 8.5.14 by Sebastian Bergmann and contributors.

F........                                                           9 / 9 (100%)

Time: 48 ms, Memory: 4.00 MB

There was 1 failure:

1) HelperTest::testString
Failed asserting that two strings are identical.
--- Expected
+++ Actual
@@ @@
-'test'
+'the test'

C:\project\tests\HelperTest.php:20

FAILURES!
Tests: 9, Assertions: 15, Failures: 1.`;
        assert.deepStrictEqual(parseResults(data), {
            assertions: 15,
            errors: 0,
            failures: 1,
            memory: "4.00 MB",
            okTasks: 9,
            percentage: 100,
            status: "FAIL",
            success: false,
            tests: 9,
            time: "48 ms",
            totalTasks: 9,
        });
    });
});
