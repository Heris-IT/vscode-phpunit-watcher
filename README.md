# PHPUnit Watcher

PHPUnit watcher extension for VS Code

<img src=https://raw.githubusercontent.com/Heris-IT/vscode-phpunit-watcher/main/images/demo.gif width=420 height=136>

## Features

-   Run PHPUnit on each file save
-   Report PHPUnit status in status bar

## Requirements

-   php needs to be in the PATH variable.
-   PHPUnit

## Extension Settings

This extension contributes the following settings:

-   `phpunit-watcher.projectFolder`: Set the project root folder (only required if not equal to the workspace folder), default: ""
-   `phpunit-watcher.phpunit`: PHPUnit command, default: "phpunit"
-   `phpunit-watcher.php`: PHP command, default: "php"
-   `phpunit-watcher.phpunitArguments`: PHPUnit arguments, default: "tests"
-   `phpunit-watcher.useComposer`: Try to use phpunit from composer, default: true
-   `phpunit-watcher.triggerLanguageIds`: Language Ids that trigger a rerun of the unit tests on save, seperate by commas. Example options: php, html, json. Default: "php"

## Release Notes

### 1.0.1

Make Language Ids that trigger a rerun of the tests configurable.

### 1.0.0

Initial release of PHPUnit Watcher extension for VS Code
