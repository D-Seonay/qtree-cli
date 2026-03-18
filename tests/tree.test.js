import { test } from 'node:test';
import assert from 'node:assert';
import { stripAnsi, getIgnoreList, DEFAULT_IGNORE, generateTreeLines, THEMES } from '../lib/tree.js';
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TMP_DIR = './tests/tmp';

// Mock chalk for consistent test output
const mockChalk = {
  blue: { bold: (s) => `BLUE_BOLD(${s})` },
  green: (s) => `GREEN(${s})`
};

test('stripAnsi removes chalk colors', () => {
  const colored = '\u001b[31mHello\u001b[39m';
  assert.strictEqual(stripAnsi(colored), 'Hello');
});

test('getIgnoreList returns defaults when no files present', () => {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });
  
  const list = getIgnoreList(TMP_DIR, true);
  assert.deepStrictEqual(list, DEFAULT_IGNORE);
  
  rmSync(TMP_DIR, { recursive: true, force: true });
});

test('generateTreeLines produces correct structure with ascii theme', () => {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(join(TMP_DIR, 'dir1'));
  writeFileSync(join(TMP_DIR, 'file1.txt'), 'hello');

  const options = {
    theme: THEMES.ascii,
    ignoreList: [],
    chalk: mockChalk
  };

  const lines = generateTreeLines(TMP_DIR, options);
  
  // Folders first then files
  assert.strictEqual(lines[0], '├── BLUE_BOLD(dir1)');
  assert.strictEqual(lines[1], '└── GREEN(file1.txt)');

  rmSync(TMP_DIR, { recursive: true, force: true });
});

test('generateTreeLines produces correct structure with emoji theme', () => {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });
  writeFileSync(join(TMP_DIR, 'file1.txt'), 'hello');

  const options = {
    theme: THEMES.emoji,
    ignoreList: [],
    chalk: mockChalk
  };

  const lines = generateTreeLines(TMP_DIR, options);
  
  assert.strictEqual(lines[0], '└── 📄 GREEN(file1.txt)');

  rmSync(TMP_DIR, { recursive: true, force: true });
});
