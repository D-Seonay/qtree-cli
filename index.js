#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import { THEMES, getIgnoreList, generateTreeLines, stripAnsi } from './lib/tree.js';
import readline from 'node:readline/promises';
import { writeFileSync } from 'node:fs';

const program = new Command();

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

const options = program.opts();
const targetDir = resolve(options.dir);
const maxDepth = Math.max(0, parseInt(options.depth, 10) || 0);

if (!existsSync(targetDir)) {
    console.error(chalk.red.bold(`\nError: Directory "${targetDir}" does not exist.\n`));
    process.exit(1);
}

// Theme validation
if (!THEMES[options.theme]) {
  console.error(chalk.red.bold(`\nError: Theme "${options.theme}" does not exist. Choices: ${Object.keys(THEMES).join(', ')}\n`));
  process.exit(1);
}

async function handleExport(filename, content, force) {
  const exportFile = typeof filename === 'string' ? filename : 'TREE.md';
  if (existsSync(exportFile) && !force) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(chalk.yellow(`${exportFile} already exists. Overwrite? (y/N) `));
    rl.close();
    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.cyan('Export canceled.'));
      return;
    }
  }
  try {
    writeFileSync(exportFile, stripAnsi(content));
    console.log(chalk.green(`\nTree exported to: ${exportFile}`));
  } catch (err) {
    console.error(chalk.red.bold(`\nError during export: ${err.message}`));
  }
}

async function main() {
  const ignoreList = getIgnoreList(targetDir, options.defaults);
  
  console.log(chalk.yellow.bold(`\nTree for: ${targetDir}\n`));
  
  const treeOptions = {
    theme: THEMES[options.theme],
    ignoreList,
    chalk,
    maxDepth
  };

  const lines = generateTreeLines(targetDir, treeOptions);
  const treeContent = lines.join('\n');
  
  console.log(treeContent);
  console.log(chalk.yellow.bold('\nReady for README! 🚀'));

  if (options.export !== undefined) {
    await handleExport(options.export, treeContent, options.force);
  }
}

main();
