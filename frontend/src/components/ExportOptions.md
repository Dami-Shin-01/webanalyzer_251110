# ExportOptions Component

## Overview
The ExportOptions component provides a user interface for configuring export settings before generating the design system starter kit.

## Features
- **Unnamed Token Handling**: Toggle to include/exclude tokens without custom names
- **Format Preview**: Shows all formats that will be included in the export
- **Export Button**: Triggers the ZIP file generation and download

## Props

| Prop | Type | Description |
|------|------|-------------|
| `includeUnnamed` | boolean | Whether to include unnamed tokens in the export |
| `onToggleUnnamed` | function | Callback when the unnamed toggle changes |
| `onExport` | function | Callback to trigger the export process |
| `isExporting` | boolean | Whether export is in progress |

## Usage

```jsx
import ExportOptions from './components/ExportOptions';

function MyComponent() {
  const [includeUnnamed, setIncludeUnnamed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Export logic here
    setIsExporting(false);
  };

  return (
    <ExportOptions
      includeUnnamed={includeUnnamed}
      onToggleUnnamed={setIncludeUnnamed}
      onExport={handleExport}
      isExporting={isExporting}
    />
  );
}
```

## Export Formats

The component displays that the following formats will be included:
- ✅ CSS Custom Properties (.css)
- ✅ SCSS Variables (.scss)
- ✅ JSON (.json)
- ✅ README.md

## Styling

The component uses `ExportOptions.css` for styling and follows the application's design system with:
- Gradient primary button
- Hover effects
- Responsive layout
- Disabled states during export

## Related Components
- `DesignStudio`: Parent component that uses ExportOptions
- `StarterKitBuilder`: Utility functions for generating export files
- `zipGenerator`: Handles ZIP file creation and download
