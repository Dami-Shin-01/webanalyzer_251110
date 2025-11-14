# ProgressIndicator Component

## Overview
A comprehensive progress indicator component that displays the analysis progress with step-by-step visual feedback.

## Features

### 1. Step-by-Step Progress Display
- **5 Analysis Steps**:
  - 📥 HTML 다운로드 (Fetching)
  - 🔍 CSS 파싱 (Parsing)
  - 🎨 토큰 추출 (Extracting)
  - ⚙️ 분석 중 (Analyzing)
  - ✨ 완료 중 (Completing)

### 2. Visual Indicators
- **Completed Steps**: Green gradient background with checkmark
- **Active Step**: Purple gradient with pulsing animation
- **Pending Steps**: Grayed out with reduced opacity

### 3. Animations
- **Spinner**: Rotating loading indicator
- **Pulse Effect**: Active step pulses to draw attention
- **Progress Bar**: Animated bar showing overall completion percentage
- **Slide In**: Smooth entrance animation

### 4. Detailed Status Messages
- Real-time details about current operation
- URL being analyzed
- Specific action being performed

### 5. Responsive Design
- Desktop: Horizontal step layout
- Mobile/Tablet: Vertical step layout with adjusted sizing

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentStep` | string | Yes | Current step ID ('fetching', 'parsing', 'extracting', 'analyzing', 'completing') |
| `details` | string | No | Detailed message about current operation |
| `isVisible` | boolean | Yes | Controls visibility of the component |

## Usage

```jsx
import ProgressIndicator from './components/ProgressIndicator';

<ProgressIndicator
  currentStep="parsing"
  details="CSS 파일을 파싱하고 있습니다..."
  isVisible={isAnalyzing}
/>
```

## Integration with App Component

The App component manages the progress state:
- `progressStep`: Tracks current step
- `progressDetails`: Provides detailed status message
- `isAnalyzing`: Controls visibility and input field disabling

## Requirements Satisfied

- ✅ 7.1: Progress indicator displayed when analysis starts
- ✅ 7.2: Specific status messages for each analysis stage
- ✅ 7.3: Details of current operation displayed
- ✅ 7.4: Input field disabled during analysis (via `isDisabled` prop)
- ✅ 7.5: Progress indicator removed when analysis completes/fails
