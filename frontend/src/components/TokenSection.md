# TokenSection Component

## Overview
TokenSection is a reusable component that displays a list of tokens for a specific category (colors, fonts, spacing, etc.) and provides input fields for mapping token names.

## Features

### 1. Flexible Token Display
- Accepts custom render function for different token types
- Supports any token data structure
- Consistent layout across all token categories

### 2. Real-time Feedback
- Live preview badge shows mapped token name
- Temporary notification when token is mapped
- Visual feedback on input focus

### 3. Token Management
- Individual input field for each token
- Placeholder text guides users
- Mapped names stored in parent component

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | String | Yes | Section title (e.g., "색상 토큰") |
| icon | String | Yes | Emoji icon for the section |
| tokens | Array | Yes | Array of token objects |
| mappings | Object | Yes | Current token name mappings |
| onMap | Function | Yes | Callback when token is mapped |
| renderToken | Function | Yes | Custom render function for token display |
| getTokenKey | Function | Yes | Function to generate unique key for token |

## Usage

```javascript
import TokenSection from './components/TokenSection';

function DesignStudio({ tokens }) {
  const [mappings, setMappings] = useState({});

  const handleMap = (value, name) => {
    setMappings(prev => ({
      ...prev,
      [value]: name
    }));
  };

  const renderColorToken = (color) => (
    <div className="color-preview">
      <div style={{ backgroundColor: color }} />
      <span>{color}</span>
    </div>
  );

  return (
    <TokenSection
      title="색상 토큰"
      icon="🎨"
      tokens={tokens.colors}
      mappings={mappings}
      onMap={handleMap}
      renderToken={renderColorToken}
      getTokenKey={(color) => color}
    />
  );
}
```

## Custom Render Functions

### Color Tokens
```javascript
const renderColorToken = (color) => (
  <div className="token-preview color-preview">
    <div className="color-swatch" style={{ backgroundColor: color }} />
    <span className="token-value">{color}</span>
  </div>
);
```

### Font Tokens
```javascript
const renderFontToken = (font) => (
  <div className="token-preview font-preview">
    <div className="font-info">
      <div className="font-family">{font.family}</div>
      <div className="font-details">
        <span>{font.size}</span>
        <span>Weight: {font.weight}</span>
        <span>Line: {font.lineHeight}</span>
      </div>
    </div>
  </div>
);
```

### Spacing Tokens
```javascript
const renderSpacingToken = (spacing) => (
  <div className="token-preview spacing-preview">
    <span className="token-value">{spacing}</span>
  </div>
);
```

## Token Key Generation

The `getTokenKey` function generates a unique identifier for each token:

```javascript
// Simple tokens (colors, spacing)
getTokenKey={(value) => value}

// Complex tokens (fonts)
getTokenKey={(font) => `${font.family}-${font.size}-${font.weight}-${font.lineHeight}`}

// Object tokens (effects)
getTokenKey={(effect) => `${effect.type}-${effect.value}`}
```

## Live Preview Feature

When a user types a token name:
1. The input value is immediately saved via `onMap` callback
2. A preview badge appears below the input showing the mapped name
3. A temporary notification slides in for 2 seconds
4. The notification automatically fades out

## Styling

### Token Item States
- **Default**: Light border, white background
- **Hover**: Blue border, subtle shadow
- **Focus**: Blue border with glow effect

### Input Field
- Monospace font for token names
- Clear placeholder text
- Focus state with blue border and shadow
- Full width on mobile

### Preview Badge
- Light gray background
- Displays "미리보기: token-name"
- Monospace font for token name
- Rounded corners

### Live Preview Notification
- Green gradient background
- Slide-in animation
- Auto-dismiss after 2 seconds
- Sparkle icon for visual appeal

## Accessibility

- Input fields have descriptive aria-labels
- Keyboard navigation fully supported
- Focus states clearly visible
- Color contrast meets WCAG AA standards

## Responsive Behavior

### Desktop (> 768px)
- Two-column layout: token display | input field
- Side-by-side preview badge

### Tablet (768px)
- Adjusted spacing
- Smaller fonts

### Mobile (< 768px)
- Single column layout
- Token display stacked above input
- Full-width inputs
- Vertical preview badge layout

## Performance Considerations

- Preview timeout cleared on component unmount
- Minimal re-renders using React state
- Efficient key generation for list rendering

## Future Enhancements

- Token search/filter within section
- Bulk rename functionality
- Token validation (naming conventions)
- Copy token name to clipboard
- Token favorites/pinning
