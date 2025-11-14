# DesignStudio Component

## Overview
The DesignStudio component provides a comprehensive interface for mapping extracted design tokens to meaningful names. It displays all token categories (colors, fonts, spacing, effects, animations) and allows users to assign custom names to each token.

## Features

### 1. Token Mapping Interface
- Displays extracted tokens organized by category
- Provides input fields for assigning token names
- Real-time preview of mapped tokens
- Visual representation of each token type

### 2. Token Categories Supported
- **Colors**: Visual color swatches with hex/rgb values
- **Typography**: Font family, size, weight, and line-height
- **Spacing**: Padding and margin values
- **Effects**: Shadows and filters
- **Animations**: CSS keyframe animations

### 3. State Management
- Maintains `tokenMappings` state with the following structure:
```javascript
{
  colors: { "#FF0000": "primary-color" },
  fonts: { "Arial-16px-400-1.5": "body-text" },
  spacing: { "16px": "spacing-md" },
  effects: { "shadow-0 2px 4px rgba(0,0,0,0.1)": "card-shadow" },
  animations: { "fadeIn": "fade-in-animation" }
}
```

### 4. Real-time Preview
- Shows live preview when user types token names
- Preview badge displays the mapped name
- Temporary notification appears when token is mapped

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| tokens | Object | Yes | Extracted tokens from analysis |
| onClose | Function | Yes | Callback to close the studio |

### tokens Object Structure
```javascript
{
  colors: ["#FF0000", "#00FF00"],
  fonts: [
    {
      family: "Arial",
      size: "16px",
      weight: "400",
      lineHeight: "1.5"
    }
  ],
  spacing: ["8px", "16px"],
  effects: [
    {
      type: "shadow",
      value: "0 2px 4px rgba(0,0,0,0.1)"
    }
  ],
  animations: [
    {
      name: "fadeIn",
      keyframes: "@keyframes fadeIn { ... }",
      duration: "300ms"
    }
  ]
}
```

## Usage

```javascript
import DesignStudio from './components/DesignStudio';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div>
      {analysisResult && (
        <DesignStudio
          tokens={analysisResult.tokens}
          onClose={() => setAnalysisResult(null)}
        />
      )}
    </div>
  );
}
```

## Implementation Details

### Token Rendering
Each token type has a custom render function:
- **Colors**: Color swatch + hex value
- **Fonts**: Font family + size/weight/line-height details
- **Spacing**: Value display
- **Effects**: Type + value
- **Animations**: Name + duration

### Token Key Generation
Each token needs a unique key for mapping:
- Colors: Use the color value itself
- Fonts: Combine family-size-weight-lineHeight
- Spacing: Use the spacing value
- Effects: Combine type-value
- Animations: Use animation name

## Accessibility
- Close button has aria-label
- Input fields have descriptive aria-labels
- Keyboard navigation supported
- Focus states clearly visible

## Responsive Design
- Desktop: Full layout with side-by-side token display and input
- Tablet: Adjusted spacing and font sizes
- Mobile: Stacked layout, full-width inputs

## Future Enhancements
- Export functionality (Task 5)
- Bulk token naming
- Token search/filter
- Token grouping
- Undo/redo functionality
