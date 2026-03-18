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
  .description('Générateur d\'arborescence de projet pour README')
  .option('-d, --dir <type>', 'Répertoire à scanner', '.')
  .option('-e, --export [filename]', 'Exporter l\'arborescence (par défaut: TREE.md)')
  .option('-f, --force', 'Écraser le fichier d\'export sans confirmation')
  .option('-t, --theme <name>', 'Thème (ascii, emoji, minimalist)', 'ascii')
  .option('-L, --depth <number>', 'Limiter la profondeur (0 = illimité)', '0')
  .option('--no-defaults', 'Ne pas utiliser la liste d\'exclusion par défaut')
  .parse(process.argv);

const options = program.opts();
const targetDir = resolve(options.dir);
const maxDepth = Math.max(0, parseInt(options.depth, 10) || 0);

if (!existsSync(targetDir)) {
    console.error(chalk.red.bold(`\nErreur : Le répertoire "${targetDir}" n'existe pas.\n`));
    process.exit(1);
}

// Validation du thème
if (!THEMES[options.theme]) {
  console.error(chalk.red.bold(`\nErreur : Le thème "${options.theme}" n'existe pas. Choix possibles : ${Object.keys(THEMES).join(', ')}\n`));
  process.exit(1);
}

async function handleExport(filename, content, force) {
  const exportFile = typeof filename === 'string' ? filename : 'TREE.md';
  if (existsSync(exportFile) && !force) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(chalk.yellow(`${exportFile} existe déjà. Écraser ? (y/N) `));
    rl.close();
    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.cyan('Export annulé.'));
      return;
    }
  }
  try {
    writeFileSync(exportFile, stripAnsi(content));
    console.log(chalk.green(`\nArborescence exportée dans : ${exportFile}`));
  } catch (err) {
    console.error(chalk.red.bold(`\nErreur lors de l'export : ${err.message}`));
  }
}

async function main() {
  const ignoreList = getIgnoreList(targetDir, options.defaults);
  
  console.log(chalk.yellow.bold(`\nArborescence de : ${targetDir}\n`));
  
  const treeOptions = {
    theme: THEMES[options.theme],
    ignoreList,
    chalk,
    maxDepth
  };

  const lines = generateTreeLines(targetDir, treeOptions);
  const treeContent = lines.join('\n');
  
  console.log(treeContent);
  console.log(chalk.yellow.bold('\nPrêt pour le README ! 🚀'));

  if (options.export !== undefined) {
    await handleExport(options.export, treeContent, options.force);
  }
}

main();
