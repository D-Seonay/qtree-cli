# Design Doc: New Features for QuickTree CLI (Export, Ignore, Themes)

## 1. Introduction
QuickTree CLI is a lightweight tool for generating project tree structures for READMEs. This document outlines the design for three new features:
1.  **Export**: Ability to save the tree to a `TREE.md` file.
2.  **Ignore**: Custom ignore list via a `.quicktreeignore` file and `.gitignore` support.
3.  **Themes**: Multiple tree styles (ASCII, Emoji, Minimalist).

## 2. Goals & Success Criteria
-   Users can export the tree to a file with confirmation if it exists (bypassable with `--force`).
-   Users can define a custom list of files/folders to ignore, extending or replacing the defaults.
-   The tool can automatically respect `.gitignore` rules.
-   Users can switch between different visual styles for the tree.
-   The exported file contains clean plain text without ANSI escape codes.
-   The core tool remains lightweight with minimal dependencies.

## 3. Architecture & Components
The current `index.js` will be refactored to separate tree generation from output.

### 3.1. Tree Generation Engine
-   Modified to return a string or an array of lines instead of printing directly to `stdout`.
-   Takes a `theme` object as a parameter to define the prefix characters.
-   Takes an `ignoreList` array as a parameter.
-   Validates paths to prevent directory traversal or invalid characters.

### 3.2. Configuration & Options
-   **Export**: 
    -   `-e, --export [filename]`: Defaults to `TREE.md`.
    -   `-f, --force`: Overwrite existing export file without confirmation.
-   **Ignore**:
    -   Logic to check for `.quicktreeignore` and `.gitignore`.
    -   `--no-defaults`: If used, the custom ignore lists *replace* the default `DEFAULT_IGNORE`. Otherwise, they *extend* it.
-   **Themes**:
    -   `-t, --theme <name>`: Supports `ascii` (default), `emoji`, and `minimalist`.
    -   Validated against allowed theme names.

### 3.3. Output Handler
-   Always prints the tree to the console (using `chalk` for colors).
-   If `--export` is used, writes the *uncolored* (plain text) tree to the specified file.
-   ANSI escape codes will be stripped using a simple regex (`/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g`) to avoid adding new dependencies.
-   Includes a confirmation prompt using `node:readline` if the export file already exists and `--force` is not provided.

## 4. Implementation Details

### 4.1. Themes Definition
To ensure consistency, all themes will use the same keys. The rendering logic will handle folders and files accordingly.
```javascript
const THEMES = {
  ascii: {
    item: '├── ',
    last: '└── ',
    vertical: '│   ',
    empty: '    '
  },
  emoji: {
    item: '├── ', // Optional connector
    last: '└── ',  // Optional connector
    vertical: '│   ',
    empty: '    ',
    folder: '📁 ',
    file: '📄 '
  },
  minimalist: {
    item: '+ ',
    last: '- ',
    vertical: '| ',
    empty: '  '
  }
};
```

### 4.2. Ignore Logic
1.  Start with `DEFAULT_IGNORE`.
2.  If `.gitignore` exists and `--no-gitignore` is not used, add its patterns.
3.  If `.quicktreeignore` exists, add its patterns.
4.  If `--no-defaults` is passed, *only* use patterns from `.gitignore` and `.quicktreeignore`.

### 4.3. Export Logic
1.  Collect tree lines into an array.
2.  Strip ANSI colors from the combined string.
3.  Check if the file exists using `fs.existsSync`.
4.  If exists and NOT `--force`, prompt for overwrite.
5.  Write to file using `fs.writeFileSync`.

## 5. Testing Strategy
-   **Automated Tests**:
    -   Implement a basic test suite (e.g., using Node's built-in `test` runner) to verify:
        -   Theme output consistency.
        -   Ignore list merging logic.
        -   File export and ANSI stripping.
-   **Manual Testing**:
    -   Run `quicktree --export` and verify `TREE.md` content and overwrite prompt.
    -   Test `--force` in a non-interactive shell.
    -   Verify `.gitignore` integration.
-   **Edge Cases**:
    -   Exporting to an invalid path.
    -   Deeply nested directories.
    -   Non-existent theme name.
