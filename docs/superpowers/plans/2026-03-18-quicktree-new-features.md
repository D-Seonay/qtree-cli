# QuickTree New Features Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Export, custom Ignore (including .gitignore), and Themes (ASCII, Emoji, Minimalist) for QuickTree CLI.

**Architecture:** Refactor `index.js` to extract tree generation logic into a testable `lib/tree.js` module. Use Node's built-in `fs`, `path`, and `readline` for file operations and interactivity.

**Tech Stack:** Node.js (ESM), Commander.js, Chalk, Node.js Test Runner.

---

## Chunk 1: Refactoring and Testing Infrastructure

### Task 1: Setup Testing and Directory Structure

**Files:**
- Modify: `package.json`
- Create: `lib/tree.js`
- Create: `tests/tree.test.js`

- [ ] **Step 1: Add test script to package.json**
```json
"scripts": {
  "test": "node --test tests/*.test.js"
}
```

- [ ] **Step 2: Create lib/tree.js with basic structure**
```javascript
import { readFileSync, existsSync, readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';

export const DEFAULT_IGNORE = [
    'node_modules', '.git', 'dist', 'build', '.DS_Store',
    'package-lock.json', '.gitignore', '.env', 'coverage'
];

export const THEMES = {
  ascii: { item: '├── ', last: '└── ', vertical: '│   ', empty: '    ' },
  emoji: { item: '├── ', last: '└── ', vertical: '│   ', empty: '    ', folder: '📁 ', file: '📄 ' },
  minimalist: { item: '+ ', last: '- ', vertical: '| ', empty: '  ' }
};

export function stripAnsi(str) {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}
```

- [ ] **Step 3: Create tests/tree.test.js with stripAnsi test**
```javascript
import { test } from 'node:test';
import assert from 'node:assert';
import { stripAnsi } from '../lib/tree.js';

test('stripAnsi removes chalk colors', () => {
  const colored = '\u001b[31mHello\u001b[39m';
  assert.strictEqual(stripAnsi(colored), 'Hello');
});
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: 1 test passed

- [ ] **Step 5: Commit**
```bash
git add package.json lib/tree.js tests/tree.test.js
git commit -m "chore: setup testing and lib structure"
```

---

## Chunk 2: Tree Generation Logic (Themes & Ignore)

### Task 2: Implement Ignore List Logic (TDD)

**Files:**
- Modify: `lib/tree.js`
- Modify: `tests/tree.test.js`

- [ ] **Step 1: Write test for `getIgnoreList` in `tests/tree.test.js`**
```javascript
import { getIgnoreList, DEFAULT_IGNORE } from '../lib/tree.js';
import { writeFileSync, unlinkSync } from 'node:fs';

test('getIgnoreList returns defaults when no files present', () => {
  const list = getIgnoreList('.', true);
  assert.deepStrictEqual(list, DEFAULT_IGNORE);
});

test('getIgnoreList replaces defaults when useDefaults is false', () => {
  writeFileSync('.quicktreeignore', 'test-ignore');
  const list = getIgnoreList('.', false);
  assert.ok(list.includes('test-ignore'));
  assert.ok(!list.includes('node_modules'));
  unlinkSync('.quicktreeignore');
});
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `getIgnoreList` in `lib/tree.js`**
```javascript
export function getIgnoreList(targetDir, useDefaults = true) {
  let list = useDefaults ? [...DEFAULT_IGNORE] : [];
  
  ['.gitignore', '.quicktreeignore'].forEach(file => {
    const path = join(targetDir, file);
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf8');
      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      list = [...new Set([...list, ...lines])];
    }
  });
  return list;
}
```
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**
```bash
git add lib/tree.js tests/tree.test.js
git commit -m "feat: implement ignore logic with .gitignore and .quicktreeignore support"
```

### Task 3: Implement Themed Tree Generation (TDD)

**Files:**
- Modify: `lib/tree.js`
- Modify: `tests/tree.test.js`

- [ ] **Step 1: Write test for `generateTreeLines` in `tests/tree.test.js`**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `generateTreeLines` in `lib/tree.js`**
```javascript
export function generateTreeLines(dir, options, prefix = '') {
  const { theme, ignoreList, chalk } = options;
  let files;
  try {
    files = readdirSync(dir);
  } catch (err) {
    return [`Error reading ${dir}: ${err.message}`];
  }

  const items = files
    .filter(file => !ignoreList.includes(file))
    .map(file => {
      const path = join(dir, file);
      try {
        const stats = lstatSync(path);
        return { name: file, path, isDir: stats.isDirectory() };
      } catch { return null; }
    })
    .filter(item => item !== null)
    .sort((a, b) => (a.isDir === b.isDir ? a.name.localeCompare(b.name) : a.isDir ? -1 : 1));

  let lines = [];
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? theme.last : theme.item;
    const icon = item.isDir ? (theme.folder || '') : (theme.file || '');
    const name = item.isDir ? chalk.blue.bold(item.name) : chalk.green(item.name);
    
    lines.push(`${prefix}${connector}${icon}${name}`);

    if (item.isDir) {
      lines = lines.concat(generateTreeLines(item.path, options, prefix + (isLast ? theme.empty : theme.vertical)));
    }
  });
  return lines;
}
```
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**
```bash
git add lib/tree.js tests/tree.test.js
git commit -m "feat: implement recursive tree generation with themes"
```

---

## Chunk 3: CLI Integration (Export & User Prompt)

### Task 4: Refactor index.js to use lib/tree.js and add Themes/Ignore flags

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Update `index.js` with new options**
```javascript
program
  .option('-d, --dir <type>', 'Répertoire à scanner', '.')
  .option('-e, --export [filename]', 'Exporter l\'arborescence (par défaut: TREE.md)')
  .option('-f, --force', 'Écraser le fichier d\'export sans confirmation')
  .option('-t, --theme <name>', 'Thème (ascii, emoji, minimalist)', 'ascii')
  .option('--no-defaults', 'Ne pas utiliser la liste d\'exclusion par défaut')
  .parse(process.argv);
```

- [ ] **Step 2: Update `index.js` logic to call `generateTreeLines`**
- [ ] **Step 3: Verify basic functionality manually: `node index.js --theme emoji`**
- [ ] **Step 4: Commit**
```bash
git add index.js
git commit -m "refactor: integrate lib/tree.js and add CLI flags"
```

### Task 5: Implement Export with Confirmation

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Implement `readline` confirmation in `index.js`**
```javascript
import readline from 'node:readline/promises';
import { writeFileSync, existsSync } from 'node:fs';

async function handleExport(filename, content, force) {
  if (existsSync(filename) && !force) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(chalk.yellow(`${filename} existe déjà. Écraser ? (y/N) `));
    rl.close();
    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.cyan('Export annulé.'));
      return;
    }
  }
  writeFileSync(filename, stripAnsi(content));
  console.log(chalk.green(`\nArborescence exportée dans : ${filename}`));
}
```

- [ ] **Step 2: Call `handleExport` in `index.js` main flow**
- [ ] **Step 3: Test manually: `node index.js --export` and check `TREE.md` for clean text**
- [ ] **Step 4: Commit**
```bash
git add index.js
git commit -m "feat: add export functionality with confirmation prompt"
```

---

## Chunk 4: Documentation and Final Polish

### Task 6: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add documentation for `--export`, `--theme`, `--no-defaults`**
- [ ] **Step 2: Add examples for `.quicktreeignore`**
- [ ] **Step 3: Commit**
```bash
git add README.md
git commit -m "docs: update README with new features"
```
