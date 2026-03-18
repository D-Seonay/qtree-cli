# Depth Limit Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a `-L, --depth` option to limit the depth of the generated project tree.

**Architecture:** Update the recursive `generateTreeLines` function in `lib/tree.js` to track `currentDepth` and check against a `maxDepth` provided in options.

**Tech Stack:** Node.js (ESM), Commander.js, Node.js Test Runner.

---

## Chunk 1: Library Implementation (TDD)

### Task 1: Add Depth Limiting to Library

**Files:**
- Modify: `lib/tree.js`
- Modify: `tests/tree.test.js`

- [ ] **Step 1: Write failing test for depth limit in `tests/tree.test.js`**

```javascript
test('generateTreeLines respects maxDepth of 1', () => {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(join(TMP_DIR, 'dir1'));
  mkdirSync(join(TMP_DIR, 'dir1', 'sub-dir'));
  writeFileSync(join(TMP_DIR, 'file1.txt'), 'hello');

  const options = {
    theme: THEMES.ascii,
    ignoreList: [],
    chalk: mockChalk,
    maxDepth: 1
  };

  const lines = generateTreeLines(TMP_DIR, options);
  
  // Should show dir1 and file1.txt, but NOT sub-dir
  assert.strictEqual(lines.length, 2);
  assert.strictEqual(lines[0], '├── BLUE_BOLD(dir1)');
  assert.strictEqual(lines[1], '└── GREEN(file1.txt)');

  rmSync(TMP_DIR, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (sub-dir will likely be shown)

- [ ] **Step 3: Update `generateTreeLines` signature and logic in `lib/tree.js`**

```javascript
export function generateTreeLines(dir, options, prefix = '', currentDepth = 0) {
  const { theme, ignoreList, chalk, maxDepth = 0 } = options;
  // ... existing filtering logic ...

  let lines = [];
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? theme.last : theme.item;
    const icon = item.isDir ? (theme.folder || '') : (theme.file || '');
    const name = item.isDir ? chalk.blue.bold(item.name) : chalk.green(item.name);
    
    lines.push(`${prefix}${connector}${icon}${name}`);

    if (item.isDir) {
      // Check depth limit: 0 = unlimited, otherwise check currentDepth
      if (maxDepth === 0 || currentDepth < maxDepth - 1) {
        lines = lines.concat(generateTreeLines(
          item.path, 
          options, 
          prefix + (isLast ? theme.empty : theme.vertical),
          currentDepth + 1
        ));
      }
    }
  });
  return lines;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/tree.js tests/tree.test.js
git commit -m "feat: implement depth limit in tree generation logic"
```

---

## Chunk 2: CLI Integration and Documentation

### Task 2: Add Flag to index.js

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Add `-L, --depth <number>` to Commander options**

```javascript
program
  .option('-d, --dir <type>', 'Répertoire à scanner', '.')
  .option('-e, --export [filename]', 'Exporter l\'arborescence (par défaut: TREE.md)')
  .option('-f, --force', 'Écraser le fichier d\'export sans confirmation')
  .option('-t, --theme <name>', 'Thème (ascii, emoji, minimalist)', 'ascii')
  .option('-L, --depth <number>', 'Limiter la profondeur (0 = illimité)', '0')
  .option('--no-defaults', 'Ne pas utiliser la liste d\'exclusion par défaut')
  .parse(process.argv);
```

- [ ] **Step 2: Parse and validate depth option**

```javascript
const options = program.opts();
const maxDepth = Math.max(0, parseInt(options.depth, 10) || 0);
```

- [ ] **Step 3: Pass `maxDepth` to `generateTreeLines`**

```javascript
  const treeOptions = {
    theme: THEMES[options.theme],
    ignoreList,
    chalk,
    maxDepth
  };
```

- [ ] **Step 4: Verify manually**

Run: `node index.js -L 1`
Expected: Shows only root level items.

- [ ] **Step 5: Commit**

```bash
git add index.js
git commit -m "feat: add -L, --depth flag to CLI"
```

### Task 3: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add `--depth` to Options table and examples**

```markdown
| `--depth` | `-L` | Limiter la profondeur (0 = illimité) | `0` |
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document depth limit feature"
```
