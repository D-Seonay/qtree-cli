# 🌳 QTree CLI

Générateur d'arborescence de projet simple et élégant pour vos fichiers README.

## ✨ Fonctionnalités

- 🚀 Rapide et léger (zéro dépendance lourde)
- 🎨 Sortie colorée dans le terminal
- 📁 Dossiers en gras/bleu, fichiers en vert
- 🧹 Ignore automatiquement les dossiers inutiles (`node_modules`, `.git`, `.worktrees`, etc.)
- 💾 Export direct vers un fichier (ex: `TREE.md`)
- 🎭 Plusieurs thèmes (ASCII, Emoji, Minimalist)
- 🛠️ Support de `.gitignore` et `.quicktreeignore`

## 🚀 Installation

```bash
npm install -g quicktree-cli
```

## 📖 Usage

### Commande de base
```bash
qtree
```

### Options disponibles

| Option | Alias | Description | Par défaut |
|--------|-------|-------------|------------|
| `--dir` | `-d` | Répertoire à scanner | `.` |
| `--export` | `-e` | Exporter dans un fichier | `TREE.md` |
| `--force` | `-f` | Écraser le fichier d'export sans confirmation | `false` |
| `--theme` | `-t` | Thème (`ascii`, `emoji`, `minimalist`) | `ascii` |
| `--no-defaults` | | Ne pas utiliser la liste d'exclusion par défaut | `false` |

### Exemples

**Scanner un dossier spécifique :**
```bash
qtree --dir src/
```

**Utiliser le thème Emoji :**
```bash
qtree --theme emoji
```

**Exporter l'arborescence :**
```bash
qtree --export MY_PROJECT_TREE.md
```

## 🛠️ Configuration de l'exclusion

### `.quicktreeignore`
Vous pouvez créer un fichier `.quicktreeignore` à la racine de votre projet pour exclure des fichiers ou dossiers spécifiques. Chaque ligne correspond à un nom exact de fichier ou dossier.

```text
# Mon ignore personnalisé
private_folder
secret_file.txt
```

Par défaut, QTree cumule la liste par défaut, votre `.gitignore` et votre `.quicktreeignore`. Utilisez `--no-defaults` pour n'utiliser que vos propres fichiers d'exclusion.


---

## 🚀 Workflow de Contribution

Consultez le fichier `GEMINI.md` pour les instructions de contribution.

## 📄 Licence
ISC
