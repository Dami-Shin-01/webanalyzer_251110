# Design Studio Usage Guide

## How It Works

### 1. Analysis Flow
```
User enters URL → Analysis runs → DesignStudio appears
```

### 2. Component Hierarchy
```
App
└── DesignStudio
    ├── TokenSection (Colors)
    ├── TokenSection (Fonts)
    ├── TokenSection (Spacing)
    ├── TokenSection (Effects)
    └── TokenSection (Animations)
```

### 3. User Interaction Flow

#### Step 1: View Extracted Tokens
After analysis completes, the Design Studio opens automatically showing all extracted tokens organized by category.

#### Step 2: Map Token Names
For each token:
1. View the visual preview (color swatch, font info, etc.)
2. Type a meaningful name in the input field
3. See real-time preview badge appear
4. Get confirmation notification

#### Step 3: Review Mappings
- Token counter shows total mapped tokens
- Each section shows count of tokens in that category
- Preview badges show all mapped names

#### Step 4: Export (Coming in Task 5)
- Click export button to generate starter kit
- Choose export options
- Download ZIP file

## Example Token Mapping

### Colors
```
Visual: [Red Swatch] #FF0000
Input:  primary-color
Result: --primary-color: #FF0000;
```

### Fonts
```
Visual: Arial, 16px, Weight: 400, Line: 1.5
Input:  body-text
Result: --body-text-family: Arial;
        --body-text-size: 16px;
        --body-text-weight: 400;
        --body-text-line-height: 1.5;
```

### Spacing
```
Visual: 16px
Input:  spacing-md
Result: --spacing-md: 16px;
```

## UI Elements

### Header
- Title: "🎨 디자인 스튜디오"
- Subtitle: "추출된 토큰에 의미 있는 이름을 부여하세요"
- Close button (✕)

### Token Sections
Each section includes:
- Icon + Title (e.g., "🎨 색상 토큰")
- Token count badge
- List of token items

### Token Items
Each item shows:
- Visual preview (left side)
- Input field (right side)
- Preview badge (when named)
- Live notification (temporary)

### Footer
- Token summary: "매핑된 토큰: X개"
- Export button (disabled until Task 5)

## Keyboard Navigation

- **Tab**: Move between input fields
- **Enter**: Submit current input (moves to next)
- **Esc**: Close Design Studio

## Visual Feedback

### Input States
- **Default**: Light gray border
- **Focus**: Blue border with glow
- **Filled**: Shows preview badge

### Token Item States
- **Default**: White background, light border
- **Hover**: Blue border, subtle shadow
- **Active**: Blue border, stronger shadow

### Notifications
- **Live Preview**: Green gradient, 2-second display
- **Animation**: Slide-in from top

## Best Practices

### Token Naming Conventions

#### Colors
```
✅ Good: primary-color, secondary-bg, accent-text
❌ Bad: color1, red, c1
```

#### Fonts
```
✅ Good: heading-large, body-text, caption-small
❌ Bad: font1, arial, f1
```

#### Spacing
```
✅ Good: spacing-xs, spacing-md, spacing-xl
❌ Bad: space1, 16px, s1
```

#### Effects
```
✅ Good: card-shadow, button-shadow, text-glow
❌ Bad: shadow1, effect1, e1
```

#### Animations
```
✅ Good: fade-in, slide-up, bounce-in
❌ Bad: animation1, anim1, a1
```

### Naming Tips

1. **Be Descriptive**: Use names that describe purpose, not appearance
   - ✅ `primary-action` instead of `blue-button`
   - ✅ `error-text` instead of `red-text`

2. **Use Consistent Patterns**: Follow a naming system
   - Size scale: xs, sm, md, lg, xl
   - Semantic: primary, secondary, tertiary
   - Context: header, body, footer

3. **Avoid Abbreviations**: Unless widely understood
   - ✅ `background` instead of `bg` (unless team standard)
   - ✅ `button` instead of `btn` (unless team standard)

4. **Use Kebab-Case**: Consistent with CSS variables
   - ✅ `primary-color`
   - ❌ `primaryColor` or `primary_color`

## Troubleshooting

### Token Not Saving
- Ensure you're typing in the input field
- Check that the preview badge appears
- Verify the live notification shows

### Preview Not Showing
- Make sure you've entered a name
- Check that the name is not empty/whitespace
- Wait for the 2-second notification

### Can't See All Tokens
- Scroll within the Design Studio content area
- Check if tokens were extracted (count badge)
- Verify analysis completed successfully

### Export Button Disabled
- This is expected - export functionality is Task 5
- All other features are working correctly

## Mobile Usage

### Portrait Mode
- Tokens stack vertically
- Full-width input fields
- Larger touch targets
- Simplified layout

### Landscape Mode
- Similar to tablet view
- Adjusted spacing
- Optimized for smaller screens

## Accessibility Features

- **Screen Readers**: All inputs have descriptive labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear visual focus states
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 44x44px on mobile

## Performance

- **Rendering**: Optimized React rendering
- **Animations**: GPU-accelerated CSS
- **Scrolling**: Smooth scrolling with custom scrollbar
- **Memory**: Efficient state management

## Next Steps

After mapping tokens, you'll be able to:
1. Choose export options (Task 5)
2. Generate starter kit files
3. Download as ZIP
4. Use in your project

---

**Ready to map your tokens!** 🎨
