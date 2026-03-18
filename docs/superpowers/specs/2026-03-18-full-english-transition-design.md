# Design Doc: Full English Transition and French Removal for QTree CLI

## 1. Introduction
QTree CLI is transitioning to a global audience. This design document outlines the process for making all development assets, code, and documentation English-only and removing all French references.

## 2. Goals & Success Criteria
- All CLI messages, error strings, and prompts are in English.
- `package.json` contains an English description.
- `README-fr.md` is deleted.
- `README.md` is updated to remove the link to the French version.
- `GEMINI.md` is renamed to `CONTRIBUTING.md` and translated to English.
- No French strings remain in the codebase or documentation.

## 3. Architecture & Components

### 3.1. CLI Entry Point (`index.js`)
- All strings in `index.js` (including Commander options, error messages, and interactive prompts) will be translated to English.

### 3.2. Project Documentation
- `README.md`: Remove the link to `README-fr.md`.
- `CONTRIBUTING.md`: Rename and translate from `GEMINI.md`.
- Delete `README-fr.md`.

### 3.3. Project Metadata (`package.json`)
- Add an English description.

## 4. Implementation Details

### 4.1. Translation of `index.js`
- Translate Commander options:
    - `Générateur d'arborescence de projet pour README` -> `A project tree generator for README files`
    - `Répertoire à scanner` -> `Directory to scan`
    - `Exporter l'arborescence (par défaut: TREE.md)` -> `Export the tree (default: TREE.md)`
    - `Écraser le fichier d'export sans confirmation` -> `Overwrite the export file without confirmation`
    - `Thème (ascii, emoji, minimalist)` -> `Theme (ascii, emoji, minimalist)`
    - `Limiter la profondeur (0 = illimité)` -> `Limit the depth (0 = unlimited)`
    - `Ne pas utiliser la liste d'exclusion par défaut` -> `Do not use the default exclusion list`
- Translate error and status messages:
    - `Erreur : Le répertoire "${targetDir}" n'existe pas.` -> `Error: Directory "${targetDir}" does not exist.`
    - `Erreur : Le thème "${options.theme}" n'existe pas.` -> `Error: Theme "${options.theme}" does not exist.`
    - `existe déjà. Écraser ? (y/N)` -> `already exists. Overwrite? (y/N)`
    - `Export annulé.` -> `Export canceled.`
    - `Arborescence exportée dans :` -> `Tree exported to:`
    - `Erreur lors de l'export :` -> `Error during export:`
    - `Arborescence de :` -> `Tree for:`
    - `Prêt pour le README ! 🚀` -> `Ready for README! 🚀`

### 4.2. File Renaming and Deletion
- `git mv GEMINI.md CONTRIBUTING.md`
- `git rm README-fr.md`

## 5. Testing Strategy
- **Manual Verification**:
    - Run `node index.js --help` to verify all descriptions are in English.
    - Test the export functionality to verify prompts and status messages are in English.
    - Test error cases (invalid directory, invalid theme) to verify error messages are in English.
- **Code Review**:
    - Grep for French keywords (e.g., "Erreur", "Arborescence", "existe") to ensure no strings were missed.
