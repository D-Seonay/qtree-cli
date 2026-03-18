import { test } from 'node:test';
import assert from 'node:assert';
import { stripAnsi } from '../lib/tree.js';

test('stripAnsi removes chalk colors', () => {
  const colored = '\u001b[31mHello\u001b[39m';
  assert.strictEqual(stripAnsi(colored), 'Hello');
});
