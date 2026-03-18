# Design Doc: Depth Limit Feature for QTree CLI

## 1. Introduction
QTree CLI is a tool for generating project tree structures. On large projects, the tree can become excessively long. This feature adds the ability to limit the depth of the generated tree.

## 2. Goals & Success Criteria
- Users can specify a maximum depth for the tree using a `-L, --depth` flag.
- By default, the tree has no depth limit (0 or omitted).
- The implementation uses a simple recursive counter to stop traversal.
- The tree's visual structure (indentation/prefix) remains intact.

## 3. Architecture & Components

### 3.1. Tree Generation Engine (`lib/tree.js`)
- The `generateTreeLines` function will be updated to track the current `depth`.
- **Signature**: `generateTreeLines(dir, options, prefix = '', currentDepth = 0)`
- `options` will contain `maxDepth`.
- If `maxDepth > 0` and `currentDepth >= maxDepth - 1`, the function will return early before recursing into children.

### 3.2. Configuration & Options (`index.js`)
- **New Option**: `-L, --depth <number>`.
- The value will be parsed as an integer.
- **Validation**: Any value less than 1 will be coerced to 0 (unlimited).
- The help description will explicitly mention `0 = unlimited`.

## 4. Implementation Details

### 4.1. Updated Recursive Logic
```javascript
export function generateTreeLines(dir, options, prefix = '', currentDepth = 0) {
  const { theme, ignoreList, chalk, maxDepth } = options;
  
  // ... existing file listing and filtering logic ...

  let lines = [];
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    // ... line formatting using prefix ...
    lines.push(formattedLine);

    if (item.isDir) {
      // Check depth limit before recursing
      // If maxDepth is 0 (unlimited) or currentDepth is within limit
      if (maxDepth === 0 || currentDepth < maxDepth - 1) {
        lines = lines.concat(generateTreeLines(
          item.path, 
          options, 
          prefix + (isLast ? theme.empty : theme.vertical),
          currentDepth + 1
        ));
      }
    }
  });
  return lines;
}
```

## 5. Testing Strategy
- **Manual Testing**:
    - Run `qtree -L 1` and verify only root files/folders are shown.
    - Run `qtree -L 2` and verify root children and their children are shown.
    - Verify default behavior (no `-L`) remains unlimited.
- **Edge Cases**:
    - `-L 0` (should be unlimited).
    - `-L -5` (should be coerced to 0, unlimited).
    - `-L 1` on an empty directory.
