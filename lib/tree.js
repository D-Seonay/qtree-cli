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
