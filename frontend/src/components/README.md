# Frontend Components

## URLInput Component

The URLInput component provides a user interface for entering and validating website URLs for analysis.

### Features

- **URL Input Field**: Text input for entering website URLs
- **Validation**: Real-time validation for URL format and protocol (HTTP/HTTPS)
- **Submit Button**: Triggers the analysis process
- **Error Display**: Shows validation errors to the user
- **Disabled State**: Prevents input during analysis

### Props

- `onAnalyze` (function): Callback function called when a valid URL is submitted
- `isDisabled` (boolean): Disables the input and button during analysis

### Usage

```jsx
import URLInput from './components/URLInput';

function App() {
  const handleAnalyze = async (url) => {
    // Perform analysis
  };

  return (
    <URLInput 
      onAnalyze={handleAnalyze} 
      isDisabled={false} 
    />
  );
}
```

## URL Validation

The `urlValidator.js` utility provides URL validation logic:

- Checks for empty input
- Validates HTTP/HTTPS protocol
- Validates URL format using the URL constructor

### Example

```javascript
import { validateURL } from '../utils/urlValidator';

const result = validateURL('https://example.com');
// { valid: true }

const result2 = validateURL('invalid-url');
// { valid: false, error: 'HTTP 또는 HTTPS 프로토콜로 시작하는 URL을 입력해주세요.' }
```
