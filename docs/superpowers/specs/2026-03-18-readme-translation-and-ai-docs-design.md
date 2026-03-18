# Design Doc: README Translation and AI Documentation for QTree CLI

## 1. Introduction
QTree CLI is a tool for generating project tree structures. To increase its reach and provide better support for AI-based workflows, this feature involves translating the README to English and adding dedicated documentation for AI/LLM integration.

## 2. Goals & Success Criteria
- The primary `README.md` is translated to English.
- The original French version is preserved as `README-fr.md`.
- A new "AI & LLM Integration" section is added to the English README.
- AI documentation includes tool usage, parsing tips, and concrete examples.

## 3. Architecture & Components

### 3.1. README Structure
- `README-fr.md`: Original French documentation.
- `README.md`: New English documentation (primary).

### 3.2. AI & LLM Integration Section
- **Purpose**: Explain how `qtree` can be used to provide context to Large Language Models.
- **Topics**:
    - **Context Providing**: Using `qtree` for a project's structural overview in prompts.
    - **Parsing**: Tips on how LLMs can best interpret the tree output.
    - **Concrete Examples**: 
        - `qtree -L 2 --export context.md`: For a high-level structural overview.
        - Using the `--theme emoji` for visually distinct folder/file recognition in LLM contexts.

## 4. Implementation Details

### 4.1. README Translation
- Translate all existing sections: Features, Installation, Usage, Options, Examples, Ignore configuration, Contribution, and License.

### 4.2. AI Usage Documentation
- Add a new "AI & LLM Integration" section.
- Provide a sample prompt for context.
- Highlight the `-L` (depth limit) and `--export` options as key tools for AI integration.

## 5. Testing Strategy
- **Manual Review**:
    - Verify the accuracy of the English translation.
    - Check the clarity and usefulness of the AI documentation.
    - Ensure all links and examples work as intended.
- **Consistency**:
    - Verify that both English and French READMEs contain equivalent information (except for the AI section, which may be English-only for now).
