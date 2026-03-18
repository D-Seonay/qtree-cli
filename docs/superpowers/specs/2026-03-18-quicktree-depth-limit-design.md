# Design Doc: Depth Limit Feature for QTree CLI

## 1. Introduction
QTree CLI is a tool for generating project tree structures. On large projects, the tree can become excessively long. This feature adds the ability to limit the depth of the generated tree.

## 2. Goals & Success Criteria
- Users can specify a maximum depth for the tree using a `--depth` flag.
- By default, the tree has no depth limit (Infinity).
- The implementation uses a simple recursive counter to stop traversal.

## 3. Architecture & Components

### 3.1. Tree Generation Engine (`lib/tree.js`)
- The `generateTreeLines` function will be updated to accept a `maxDepth` parameter (default: 0).
- It will also track the current `depth` (starting at 0).
- If `maxDepth > 0` and `depth >= maxDepth`, the function will return an empty array for children of the current directory.

### 3.2. Configuration & Options (`index.js`)
- **New Option**: `-p, --depth <number>`.
- The value will be parsed as an integer.
- A value of `0` (or omitted) means no limit.

## 4. Implementation Details

### 4.1. Updated Recursive Logic
```javascript
export function generateTreeLines(dir, options, currentDepth = 0) {
  const { theme, ignoreList, chalk, maxDepth } = options;
  
  // ... existing file listing and filtering logic ...

  let lines = [];
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    // ... line formatting ...
    lines.push(formattedLine);

    if (item.isDir) {
      // Check depth limit before recursing
      if (maxDepth === 0 || currentDepth < maxDepth - 1) {
        lines = lines.concat(generateTreeLines(item.path, options, currentDepth + 1));
      }
    }
  });
  return lines;
}
```

## 5. Testing Strategy
- **Manual Testing**:
    - Run `qtree --depth 1` and verify only root files/folders are shown.
    - Run `qtree --depth 2` and verify root children and their children are shown.
    - Verify default behavior (no `--depth`) remains unlimited.
- **Edge Cases**:
    - `--depth 0` (should be unlimited).
    - `--depth 1` on an empty directory.
    - Negative depth values (should be treated as 0).
