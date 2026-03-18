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
