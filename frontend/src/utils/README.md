# Utility Functions

This directory contains utility functions used throughout the Project Snapshot application.

## Files

### starterKitBuilder.js
Converts token mappings to various design system formats.

**Functions:**
- `buildCSS(tokenMappings, includeUnnamed)` - Generates CSS custom properties
- `buildSCSS(tokenMappings, includeUnnamed)` - Generates SCSS variables
- `buildJSON(tokenMappings, includeUnnamed)` - Generates JSON format
- `buildAnimationCSS(animations, animationMappings, includeUnnamed)` - Generates animation CSS files
- `buildReadme(metadata, tokenMappings)` - Generates README.md content

**Example:**
```javascript
import { buildCSS, buildSCSS, buildJSON } from './starterKitBuilder';

const tokenMappings = {
  colors: {
    '#FF0000': 'primary-red',
    '#00FF00': 'success-green'
  },
  fonts: {
    'Arial-16px-400-1.5': 'body-text'
  }
};

const css = buildCSS(tokenMappings, false);
// Output:
// :root {
//   --primary-red: #FF0000;
//   --success-green: #00FF00;
//   --body-text-family: Arial;
//   --body-text-size: 16px;
//   --body-text-weight: 400;
//   --body-text-line-height: 1.5;
// }

const scss = buildSCSS(tokenMappings, false);
// Output:
// // Colors
// $primary-red: #FF0000;
// $success-green: #00FF00;
// 
// // Typography
// $body-text-family: Arial;
// $body-text-size: 16px;
// $body-text-weight: 400;
// $body-text-line-height: 1.5;

const json = buildJSON(tokenMappings, false);
// Output: JSON string with structured token data
```

### zipGenerator.js
Handles ZIP file generation and browser download.

**Functions:**
- `generateAndDownloadZip(tokenMappings, animations, metadata, includeUnnamed)` - Creates and downloads ZIP file

**Example:**
```javascript
import { generateAndDownloadZip } from './zipGenerator';

await generateAndDownloadZip(
  tokenMappings,
  animations,
  { analyzedUrl: 'https://example.com', timestamp: new Date().toISOString() },
  false
);
// Downloads: project-snapshot-kit.zip
```

**ZIP Structure:**
```
project-snapshot-kit.zip
├── design_system/
│   ├── tokens.css
│   ├── tokens.scss
│   └── tokens.json
├── motion_library/
│   └── css/
│       └── [animation-name].css
└── README.md
```

### urlValidator.js
Validates and sanitizes user-provided URLs.

**Functions:**
- `validateUrl(url)` - Validates URL format and protocol

**Example:**
```javascript
import { validateUrl } from './urlValidator';

const result = validateUrl('https://example.com');
// { isValid: true, error: null }

const result2 = validateUrl('invalid-url');
// { isValid: false, error: 'Invalid URL format' }
```

## Testing

Tests are located in `__tests__/` directory. Run tests with:

```bash
npm test
```

## Token Mapping Format

Token mappings follow this structure:

```javascript
{
  colors: {
    '#FF0000': 'primary-red',  // value: name
    '#00FF00': 'success-green',
    '#0000FF': ''  // empty string = unnamed
  },
  fonts: {
    'Arial-16px-400-1.5': 'body-text',  // key format: family-size-weight-lineHeight
    'Helvetica-24px-700-1.2': 'heading'
  },
  spacing: {
    '8px': 'spacing-xs',
    '16px': 'spacing-sm'
  },
  effects: {
    'shadow-0 2px 4px rgba(0,0,0,0.1)': 'card-shadow',  // key format: type-value
    'shadow-0 4px 8px rgba(0,0,0,0.2)': 'elevated-shadow'
  },
  animations: {
    'fadeIn': 'fade-in-animation',  // animation name: custom name
    'slideUp': 'slide-up-animation'
  }
}
```

## Unnamed Token Handling

When `includeUnnamed` is `false`:
- Only tokens with non-empty names are included in the output

When `includeUnnamed` is `true`:
- All tokens are included
- Unnamed tokens get auto-generated names using a hash function
- Format: `{category}-{hash}` (e.g., `color-a3f2b1`)
