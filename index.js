#!/usr/bin/env node

import { existsSync, readdirSync, lstatSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('quicktree')
  .version('1.0.0')
  .description('Générateur d\'arborescence de projet pour README')
  .option('-d, --dir <type>', 'Répertoire à scanner', '.')
  .parse(process.argv);

const options = program.opts();
const targetDir = resolve(options.dir);

if (!existsSync(targetDir)) {
    console.error(chalk.red.bold(`\nErreur : Le répertoire "${targetDir}" n'existe pas.\n`));
    process.exit(1);
}

// Liste des dossiers/fichiers à ignorer par défaut
const DEFAULT_IGNORE = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.DS_Store',
    'package-lock.json',
    '.gitignore',
    '.env',
    'coverage'
];

function generateTree(dir, prefix = '') {
    let files;
    try {
        files = readdirSync(dir);
    } catch (err) {
        console.error(chalk.red(`\nErreur lors de la lecture du répertoire "${dir}" : ${err.message}`));
        return;
    }

    // Pré-calcul des stats pour le tri plus efficace
    const fileList = files
        .filter(file => !DEFAULT_IGNORE.includes(file))
        .map(file => {
            const filePath = join(dir, file);
            try {
                const stats = lstatSync(filePath);
                return { name: file, path: filePath, isDir: stats.isDirectory() };
            } catch {
                return null;
            }
        })
        .filter(item => item !== null)
        .sort((a, b) => {
            // Dossiers d'abord, puis fichiers (alphabétique)
            if (a.isDir && !b.isDir) return -1;
            if (!a.isDir && b.isDir) return 1;
            return a.name.localeCompare(b.name);
        });

    fileList.forEach((item, index) => {
        const isLast = index === fileList.length - 1;
        
        console.log(`${prefix}${isLast ? '└── ' : '├── '}${item.isDir ? chalk.blue.bold(item.name) : chalk.green(item.name)}`);

        if (item.isDir) {
            generateTree(item.path, prefix + (isLast ? '    ' : '│   '));
        }
    });
}

console.log(chalk.yellow.bold(`\nArborescence de : ${targetDir}\n`));
generateTree(targetDir);
console.log(chalk.yellow.bold('\nPrêt pour le README ! 🚀'));
