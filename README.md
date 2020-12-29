# phpunit-watcher README

PHPUnit watcher extension for VS Code

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

## Release Notes

### 1.0.0

Initial release of PHPUnit Watcher extension for VS Code
