# Full English Transition Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate all source code strings, metadata, and documentation to English and remove all French assets.

**Architecture:** Systematic replacement of French strings in `index.js` and `package.json`, renaming and translating `GEMINI.md`, and cleaning up `README.md`.

**Tech Stack:** Node.js (ESM), Markdown.

---

## Chunk 1: Source Code and Metadata Translation

### Task 1: Translate index.js

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Translate Commander program definition**
```javascript
program
  .name('qtree')
  .version('1.0.0')
  .description('A project tree generator for README files')
  .option('-d, --dir <type>', 'Directory to scan', '.')
  .option('-e, --export [filename]', 'Export the tree (default: TREE.md)')
  .option('-f, --force', 'Overwrite the export file without confirmation')
  .option('-t, --theme <name>', 'Theme (ascii, emoji, minimalist)', 'ascii')
  .option('-L, --depth <number>', 'Limit the depth (0 = unlimited)', '0')
  .option('--no-defaults', 'Do not use the default exclusion list')
  .parse(process.argv);
```

- [ ] **Step 2: Translate error messages and prompts**
- Error for non-existent directory: `Error: Directory "${targetDir}" does not exist.`
- Error for invalid theme: `Error: Theme "${options.theme}" does not exist. Choices: ${Object.keys(THEMES).join(', ')}`
- Overwrite prompt: `already exists. Overwrite? (y/N) `
- Export cancel message: `Export canceled.`
- Export success message: `Tree exported to: ${exportFile}`
- Export error message: `Error during export: ${err.message}`
- Tree header: `Tree for: ${targetDir}`
- Ready message: `Ready for README! 🚀`

- [ ] **Step 3: Commit**
```bash
git add index.js
git commit -m "feat: translate CLI messages and options to English"
```

### Task 2: Update package.json Metadata

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add description and keywords**
```json
"description": "A project tree generator for README files.",
"keywords": ["cli", "tree", "generator", "readme"],
```

- [ ] **Step 2: Commit**
```bash
git add package.json
git commit -m "chore: update package metadata with English description and keywords"
```

---

## Chunk 2: Documentation Restructuring

### Task 3: Translate and Rename GEMINI.md to CONTRIBUTING.md

**Files:**
- Rename: `GEMINI.md` -> `CONTRIBUTING.md`

- [ ] **Step 1: Rename the file**
```bash
git mv GEMINI.md CONTRIBUTING.md
```

- [ ] **Step 2: Translate content to English**
Ensure all technical rules (branch naming, "Grade S" performance, minimal dependencies) are preserved accurately.

- [ ] **Step 3: Commit**
```bash
git add CONTRIBUTING.md
git commit -m "docs: rename GEMINI.md to CONTRIBUTING.md and translate to English"
```

### Task 4: Cleanup README.md and Delete README-fr.md

**Files:**
- Modify: `README.md`
- Delete: `README-fr.md`

- [ ] **Step 1: Remove French language link from README.md**
Delete the line: `[Français (README-fr.md)](README-fr.md)`

- [ ] **Step 2: Delete README-fr.md**
```bash
git rm README-fr.md
```

- [ ] **Step 3: Commit**
```bash
git add README.md
git commit -m "docs: remove French README and language links"
```

---

## Chunk 3: Final Verification

### Task 5: Audit and Test

**Files:**
- Verify: `lib/tree.js`
- Verify: `index.js`
- Test: `tests/tree.test.js`

- [ ] **Step 1: Verify all strings are English**
Grep for French keywords: "Erreur", "Arborescence", "existe".

- [ ] **Step 2: Run automated tests**
```bash
npm test
```

- [ ] **Step 3: Manual verification of --help output**
```bash
node index.js --help
```

- [ ] **Step 4: Commit any final minor fixes**
```bash
git commit -m "chore: final cleanup of English transition"
```
