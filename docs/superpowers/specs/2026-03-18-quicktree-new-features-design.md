# Design Doc: New Features for QuickTree CLI (Export, Ignore, Themes)

## 1. Introduction
QuickTree CLI is a lightweight tool for generating project tree structures for READMEs. This document outlines the design for three new features:
1.  **Export**: Ability to save the tree to a `TREE.md` file.
2.  **Ignore**: Custom ignore list via a `.quicktreeignore` file.
3.  **Themes**: Multiple tree styles (ASCII, Emoji, Minimalist).

## 2. Goals & Success Criteria
-   Users can export the tree to a file with confirmation if it exists.
-   Users can define a custom list of files/folders to ignore, replacing the defaults.
-   Users can switch between different visual styles for the tree.
-   The core tool remains lightweight with minimal dependencies.

## 3. Architecture & Components
The current `index.js` will be refactored to separate tree generation from output.

### 3.1. Tree Generation Engine
-   Modified to return a string or an array of lines instead of printing directly to `stdout`.
-   Takes a `theme` object as a parameter to define the prefix characters.
-   Takes an `ignoreList` array as a parameter.

### 3.2. Configuration & Options
-   **Export**: Added `-e, --export [filename]` option. Defaults to `TREE.md`.
-   **Ignore**: Logic to check for `.quicktreeignore` in the target directory. If present, its lines replace the default `DEFAULT_IGNORE` list.
-   **Themes**: Added `-t, --theme <name>` option. Supports `ascii` (default), `emoji`, and `minimalist`.

### 3.3. Output Handler
-   Always prints the tree to the console (using `chalk` for colors).
-   If `--export` is used, writes the *uncolored* (plain text) tree to the specified file.
-   Includes a confirmation prompt using `node:readline` if the export file already exists.

## 4. Implementation Details

### 4.1. Themes Definition
```javascript
const THEMES = {
  ascii: {
    item: '├── ',
    last: '└── ',
    vertical: '│   ',
    empty: '    '
  },
  emoji: {
    folder: '📁 ',
    file: '📄 ',
    item: '',
    last: '',
    vertical: '    ',
    empty: '    '
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
-   Search for `.quicktreeignore` in `targetDir`.
-   If found, read and split by newlines, filtering out empty lines and comments.
-   This list *replaces* the internal `DEFAULT_IGNORE`.

### 4.3. Export Logic
-   Collect tree lines into an array.
-   Join with `\n` to create the full tree string.
-   Check if the file exists using `fs.existsSync`.
-   If it exists, prompt the user for overwrite using `readline`.

## 5. Testing Strategy
-   **Manual Testing**:
    -   Run `quicktree --export` and verify `TREE.md` content and overwrite prompt.
    -   Create a `.quicktreeignore` and verify it correctly replaces the default ignore list.
    -   Test all three themes: `ascii`, `emoji`, and `minimalist`.
-   **Edge Cases**:
    -   Exporting to a directory that doesn't exist.
    -   Empty `.quicktreeignore` file.
    -   Invalid theme name passed to `--theme`.
