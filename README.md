# 🌳 QTree CLI

A simple and elegant project tree generator for your README files.

## ✨ Features

- 🚀 Fast and lightweight (zero heavy dependencies)
- 🎨 Colored output in the terminal
- 📁 Folders in bold/blue, files in green
- 🧹 Automatically ignores unnecessary folders (`node_modules`, `.git`, `.worktrees`, etc.)
- 💾 Direct export to a file (e.g., `TREE.md`)
- 🎭 Multiple themes (ASCII, Emoji, Minimalist)
- 🛠️ Support for `.gitignore` and `.quicktreeignore`
- 📏 Depth limit control (`-L, --depth`)

## 🚀 Installation

```bash
npm install -g quicktree-cli
```

## 📖 Usage

### Basic Command
```bash
qtree
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--dir` | `-d` | Directory to scan | `.` |
| `--export` | `-e` | Export to a file | `TREE.md` |
| `--force` | `-f` | Overwrite export file without confirmation | `false` |
| `--theme` | `-t` | Theme (`ascii`, `emoji`, `minimalist`) | `ascii` |
| `--depth` | `-L` | Limit depth (0 = unlimited) | `0` |
| `--no-defaults` | | Do not use the default exclusion list | `false` |

### Examples

**Scan a specific directory:**
```bash
qtree --dir src/
```

**Use the Emoji theme:**
```bash
qtree --theme emoji
```

**Limit depth to 2 levels:**
```bash
qtree -L 2
```

**Export the tree:**
```bash
qtree --export MY_PROJECT_TREE.md
```

## 🛠️ Exclusion Configuration

### `.quicktreeignore`
You can create a `.quicktreeignore` file in your project root to exclude specific files or folders. Each line corresponds to an exact file or folder name.

```text
# My custom ignore list
private_folder
secret_file.txt
```

By default, QTree combines the default list, your `.gitignore`, and your `.quicktreeignore`. Use `--no-defaults` to use only your own exclusion files.

## 📄 License
ISC
