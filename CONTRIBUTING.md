# 🚀 Contribution Guide - QuickTree CLI

Welcome! If you're here, it's because you want to help make **QuickTree** even more powerful. To keep the project clean and prevent the code from becoming a battlefield, please follow these golden rules.

---

## 🛠️ The Workflow (The Golden Rule)

NEVER work directly on the `main` branch. For each modification, follow this lifecycle:

1. **Identify an Issue**: Choose an existing issue or create one to discuss your idea.
2. **Create a Branch**: Create a dedicated branch with a clear name.
   - Format: `feat/feature-name` or `fix/bug-name`.
   - Command: `git checkout -b feat/my-super-improvement`
3. **Clean Code**: Respect the current code style (simple and readable Node.js).
4. **Update Documentation**: If you add a feature, you MUST update the `README.md` (options, examples, screenshots).
5. **Pull Request**: Submit your PR to `main` with a description of what you've done.

---

## 📋 Basic Rules for Smooth Operation

To keep QuickTree light and fast ("Grade S" standard!), here are the prerequisites:

### 1. Minimal Dependencies
Before installing a new NPM package, ask yourself: *"Can I do this in pure Node.js?"*. We want to avoid having a 500 MB `node_modules`.

### 2. Basic Tests
Before pushing your code, verify that the basic command still works:
```bash
node index.js --dir .
```

### 3. Automatic Documentation
Each new option added in `commander` must be documented in the **"Usage"** section of the `README.md`. A tool without documentation is a tool that doesn't exist.

### 4. Commit Style
Use explicit commit messages (Conventional Commits recommended):
- `feat: add .gitignore support`
- `fix: correct bug on relative paths`
- `docs: update README for --copy option`

---

## ✨ Note on "Stars"
We aim for excellence. If your code brings a visual improvement or a major time gain, it will be merged as a priority!
