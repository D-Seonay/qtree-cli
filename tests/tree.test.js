import { test } from 'node:test';
import assert from 'node:assert';
import { stripAnsi, getIgnoreList, DEFAULT_IGNORE } from '../lib/tree.js';
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TMP_DIR = './tests/tmp';

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

test('getIgnoreList replaces defaults when useDefaults is false', () => {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });
  
  const ignoreFile = join(TMP_DIR, '.quicktreeignore');
  writeFileSync(ignoreFile, 'test-ignore');
  
  const list = getIgnoreList(TMP_DIR, false);
  assert.ok(list.includes('test-ignore'));
  assert.ok(!list.includes('node_modules'));
  
  rmSync(TMP_DIR, { recursive: true, force: true });
});
