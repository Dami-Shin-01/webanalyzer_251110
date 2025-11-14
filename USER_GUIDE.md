# User Guide - Project Snapshot

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [Understanding Results](#understanding-results)
6. [Working with Starter Kits](#working-with-starter-kits)
7. [Tips and Best Practices](#tips-and-best-practices)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

### What is Project Snapshot?

Project Snapshot is a web-based tool that automatically analyzes websites and extracts their design systems. It helps developers and designers quickly understand and replicate the visual design of reference websites.

### What Can It Do?

- **Extract Design Tokens**: Automatically identify colors, fonts, spacing, shadows, and other design values
- **Capture Animations**: Extract CSS animations and observe JavaScript-based motion
- **Generate Starter Kits**: Create ready-to-use design system files in multiple formats (CSS, SCSS, JSON)
- **Provide Implementation Guides**: Generate code snippets for recreating observed animations

### Who Is It For?

- **Frontend Developers**: Quickly extract design tokens from reference sites
- **UI/UX Designers**: Analyze design systems of competitor or inspiration sites
- **Design System Creators**: Bootstrap new design systems based on existing sites
- **Solo Developers**: Save time manually copying CSS values

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled
- Screen resolution: 320px+ (mobile-friendly)
- Supports desktop, tablet, and mobile devices

### Accessing the Application

**Development:**
```
http://localhost:3000
```

**Production:**
```
https://your-app.vercel.app
```

### First Time Setup

No setup required! Simply open the application in your browser and start analyzing.

---

## Basic Usage

### Step 1: Enter a URL

1. Open the application
2. Find the URL input field at the top
3. Enter the full URL of the website you want to analyze
   - Example: `https://example.com`
   - Must include `http://` or `https://`

**Valid URLs:**
- ✅ `https://example.com`
- ✅ `http://example.com/page`
- ✅ `https://subdomain.example.com`

**Invalid URLs:**
- ❌ `example.com` (missing protocol)
- ❌ `www.example.com` (missing protocol)
- ❌ `localhost` (local addresses not allowed)
- ❌ `file:///path/to/file.html` (file protocol not supported)

### Step 2: Start Analysis

1. Click the "분석 시작" (Start Analysis) button
2. Wait for the analysis to complete
3. Watch the progress indicator for real-time updates

**Progress Stages:**
- Downloading HTML
- Fetching CSS files
- Parsing styles
- Extracting tokens
- Analyzing animations
- (Optional) Observing dynamic motion

**Typical Analysis Time:**
- Simple sites: 5-10 seconds
- Medium sites: 10-20 seconds
- Complex sites: 20-30 seconds
- With dynamic analysis: 30-60 seconds

### Step 3: Review Results

Once analysis completes, you'll see:

1. **Colors Section**: All unique colors found
2. **Fonts Section**: Typography tokens
3. **Spacing Section**: Padding and margin values
4. **Effects Section**: Shadows and filters
5. **Animations Section**: CSS animations

### Step 4: Map Tokens

Give meaningful names to extracted values:

1. Find a color you want to name
2. Click in the input field next to it
3. Type a semantic name (e.g., "primary-blue", "text-dark")
4. Repeat for other tokens

**Naming Tips:**
- Use semantic names: `primary-color` instead of `blue`
- Be consistent: `text-large`, `text-medium`, `text-small`
- Use kebab-case: `background-light` instead of `backgroundLight`
- Avoid values in names: `heading-font` instead of `font-24px`

### Step 5: Configure Export Options

Before exporting, choose your preferences:

**Unnamed Token Handling:**
- **Exclude**: Only export tokens you've named
- **Include**: Export all tokens with auto-generated names

**Export Formats:**
- CSS Variables (`:root { --token-name: value; }`)
- SCSS Variables (`$token-name: value;`)
- JSON (`{ "tokenName": "value" }`)

### Step 6: Download Starter Kit

1. Click the "내보내기" (Export) button
2. Wait for the ZIP file to generate
3. Save the file to your computer
4. Extract and use in your project

---

## Advanced Features

### Dynamic Analysis

Dynamic analysis uses a headless browser to observe JavaScript-based animations.

**When to Use:**
- Site has scroll-triggered animations
- Hover effects you want to replicate
- Complex motion implemented with JavaScript libraries (GSAP, Anime.js, etc.)

**How to Enable:**
1. Check the "동적 분석 포함" (Include Dynamic Analysis) checkbox
2. Start analysis
3. Wait for extended analysis time (30-60 seconds)

**What You Get:**
- Motion reports with trigger conditions
- Code snippets in multiple formats (CSS, JavaScript, GSAP)
- Property change details (opacity, transform, etc.)

**Limitations:**
- Takes longer to complete
- May not work on all sites
- Requires more server resources

### Filtering and Searching

**Color Filtering:**
- Click on a color to highlight it
- Use browser search (Ctrl+F / Cmd+F) to find specific values

**Font Filtering:**
- Group by font family
- Sort by size or weight

### Bulk Token Naming

**Pattern-Based Naming:**
1. Name one token with a pattern (e.g., `spacing-1`)
2. Continue with the pattern (e.g., `spacing-2`, `spacing-3`)
3. System will suggest similar names

**Import from JSON:**
1. Prepare a JSON file with token mappings
2. Use the import feature (if available)
3. Review and adjust as needed

### Accessibility Features

**Keyboard Navigation:**
- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons and checkboxes
- **Escape**: Clear input fields or close modals
- **Arrow Up/Down**: Navigate between token input fields

**Screen Reader Support:**
- All interactive elements have ARIA labels
- Status updates announced automatically
- Semantic HTML structure
- Descriptive error messages

**Visual Accessibility:**
- High contrast mode support
- Large touch targets (44x44px minimum)
- Clear focus indicators
- Color-blind friendly design (not relying on color alone)

**Motion Preferences:**
- Respects `prefers-reduced-motion` setting
- Animations can be disabled system-wide
- Smooth scrolling optional

---

## Understanding Results

### Color Tokens

**Formats Detected:**
- HEX: `#FF0000`, `#F00`
- RGB: `rgb(255, 0, 0)`
- RGBA: `rgba(255, 0, 0, 0.5)`
- HSL: `hsl(0, 100%, 50%)`
- Named: `red`, `blue`, `transparent`

**Color Preview:**
- Each color shows a visual preview
- Click to copy the value
- Hover to see usage count (if available)

### Font Tokens

**Properties Extracted:**
- **Family**: Font name(s) and fallbacks
- **Size**: Font size with unit (px, rem, em)
- **Weight**: Numeric (400, 700) or named (normal, bold)
- **Line Height**: Unitless or with unit

**Example:**
```
Family: "Helvetica Neue", Arial, sans-serif
Size: 16px
Weight: 400
Line Height: 1.5
```

### Spacing Tokens

**Values Extracted:**
- Padding values
- Margin values
- Gap values (for flexbox/grid)

**Units Supported:**
- Pixels: `8px`, `16px`
- Rem: `1rem`, `2rem`
- Em: `1em`, `1.5em`
- Percentages: `50%`, `100%`

### Effect Tokens

**Shadow Types:**
- Box shadows: `0 2px 4px rgba(0,0,0,0.1)`
- Text shadows: `1px 1px 2px #000`

**Filter Effects:**
- Blur: `blur(5px)`
- Brightness: `brightness(1.2)`
- Contrast: `contrast(1.5)`

### Animation Tokens

**CSS Animations:**
- Full `@keyframes` definition
- Animation name
- Duration and timing function (if specified)

**Example:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Motion Reports

**Dynamic Animations:**
- **Trigger**: When the animation starts (scroll, hover, load)
- **Duration**: How long it takes (milliseconds)
- **Properties**: What changes (opacity, transform, etc.)
- **Code Snippets**: How to implement it

**Example Report:**
```markdown
# Scroll Fade In Animation

**Trigger**: Scroll (when element enters viewport)
**Duration**: 500ms
**Properties**: opacity (0 → 1)

## CSS Implementation
[CSS code here]

## JavaScript Implementation
[JavaScript code here]

## GSAP Implementation
[GSAP code here]
```

---

## Working with Starter Kits

### Starter Kit Structure

```
project-snapshot-kit.zip
├── design_system/
│   ├── tokens.css          # CSS variables
│   ├── tokens.scss         # SCSS variables
│   └── tokens.json         # JSON format
├── motion_library/
│   ├── css/
│   │   ├── fadeIn.css
│   │   └── slideUp.css
│   └── js_motion_reports/
│       ├── scroll-fade.md
│       └── hover-scale.md
└── README.md               # Usage instructions
```

### Using CSS Variables

**1. Import the CSS file:**
```html
<link rel="stylesheet" href="design_system/tokens.css">
```

**2. Use the variables:**
```css
.button {
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: var(--spacing-medium);
  border-radius: var(--radius-small);
}
```

### Using SCSS Variables

**1. Import the SCSS file:**
```scss
@import 'design_system/tokens';
```

**2. Use the variables:**
```scss
.button {
  background-color: $primary-color;
  color: $text-light;
  padding: $spacing-medium;
  border-radius: $radius-small;
}
```

### Using JSON Tokens

**1. Import the JSON file:**
```javascript
import tokens from './design_system/tokens.json';
```

**2. Use in JavaScript:**
```javascript
const styles = {
  backgroundColor: tokens.colors.primary,
  color: tokens.colors.textLight,
  padding: tokens.spacing.medium,
  borderRadius: tokens.effects.radiusSmall
};
```

**3. Use with CSS-in-JS:**
```javascript
const Button = styled.button`
  background-color: ${tokens.colors.primary};
  color: ${tokens.colors.textLight};
  padding: ${tokens.spacing.medium};
`;
```

### Using Animations

**1. Import animation CSS:**
```html
<link rel="stylesheet" href="motion_library/css/fadeIn.css">
```

**2. Apply to elements:**
```html
<div class="fade-in">Content</div>
```

**3. Or copy keyframes to your stylesheet:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.my-element {
  animation: fadeIn 0.3s ease-in-out;
}
```

### Implementing Motion Reports

**1. Read the motion report:**
- Open the `.md` file in `js_motion_reports/`
- Understand the trigger and properties

**2. Choose an implementation:**
- **CSS**: For simple transitions
- **JavaScript**: For complex logic
- **GSAP**: For advanced animations

**3. Copy and adapt the code:**
- Paste the code snippet into your project
- Adjust selectors and values as needed
- Test and refine

---

## Tips and Best Practices

### Choosing Sites to Analyze

**Good Candidates:**
- ✅ Sites with clear design systems
- ✅ Modern CSS practices
- ✅ Publicly accessible
- ✅ Fast loading times

**Avoid:**
- ❌ Sites with heavy JavaScript obfuscation
- ❌ Sites behind authentication
- ❌ Sites with aggressive anti-scraping
- ❌ Sites with CORS restrictions

### Token Naming Strategies

**Color Naming:**
```
// Semantic (Recommended)
--color-primary
--color-secondary
--color-success
--color-danger
--color-text-primary
--color-text-secondary
--color-background

// Descriptive (Alternative)
--color-blue-500
--color-gray-100
--color-red-600
```

**Spacing Naming:**
```
// T-shirt sizes
--spacing-xs
--spacing-sm
--spacing-md
--spacing-lg
--spacing-xl

// Numeric
--spacing-1  // 4px
--spacing-2  // 8px
--spacing-3  // 12px
--spacing-4  // 16px
```

**Font Naming:**
```
// By purpose
--font-heading
--font-body
--font-code

// By size
--font-size-xs
--font-size-sm
--font-size-base
--font-size-lg
--font-size-xl
```

### Optimizing Analysis

**For Faster Results:**
1. Disable dynamic analysis if not needed
2. Analyze specific pages rather than homepages
3. Choose sites with fewer CSS files
4. Use during off-peak hours

**For Better Results:**
1. Analyze the most representative page
2. Enable dynamic analysis for animation-heavy sites
3. Review and clean up extracted tokens
4. Combine with manual inspection

### Integrating into Workflow

**Design Phase:**
1. Analyze reference sites
2. Extract design tokens
3. Create design system documentation
4. Share with team

**Development Phase:**
1. Import starter kit into project
2. Customize token values
3. Apply to components
4. Maintain consistency

**Maintenance Phase:**
1. Re-analyze periodically
2. Update tokens as needed
3. Document changes
4. Version control design system

---

## Troubleshooting

### Analysis Fails

**Problem**: "Failed to analyze website"

**Possible Causes:**
- Website is down or unreachable
- CORS policy blocks access
- Website requires authentication
- Network timeout

**Solutions:**
1. Check if website is accessible in browser
2. Try a different website
3. Increase timeout in settings
4. Check your internet connection

### No Tokens Found

**Problem**: Analysis completes but no tokens extracted

**Possible Causes:**
- Website uses inline styles
- CSS is dynamically generated
- CSS files are blocked
- Website uses CSS-in-JS

**Solutions:**
1. Try analyzing a different page
2. Check browser console for errors
3. Verify CSS files are accessible
4. Use browser DevTools to inspect styles

### Incomplete Results

**Problem**: Some expected tokens are missing

**Possible Causes:**
- CSS files failed to download
- Tokens are in external stylesheets
- Values are computed dynamically
- Tokens are in shadow DOM

**Solutions:**
1. Check analysis metadata for CSS file count
2. Manually inspect missing values
3. Try dynamic analysis
4. Supplement with manual extraction

### Export Fails

**Problem**: Cannot download starter kit

**Possible Causes:**
- Browser blocks downloads
- Insufficient memory
- Too many tokens
- Browser extension interference

**Solutions:**
1. Check browser download settings
2. Allow popups and downloads
3. Disable browser extensions
4. Try a different browser
5. Reduce number of tokens

### Dynamic Analysis Fails

**Problem**: Dynamic analysis doesn't complete

**Possible Causes:**
- Server timeout
- Puppeteer error
- Website blocks headless browsers
- Insufficient server resources

**Solutions:**
1. Disable dynamic analysis
2. Try again later
3. Use static analysis only
4. Contact support if persistent

---

## FAQ

### General Questions

**Q: Is Project Snapshot free to use?**
A: Yes, it's open source and free to use.

**Q: Do I need to create an account?**
A: No, no account required.

**Q: Is my data stored on the server?**
A: No, all processing happens in real-time and nothing is stored.

**Q: Can I analyze password-protected sites?**
A: No, only publicly accessible sites can be analyzed.

**Q: How accurate is the extraction?**
A: Very accurate for standard CSS. Some edge cases may require manual review.

### Technical Questions

**Q: What CSS properties are extracted?**
A: Colors, fonts, spacing (padding/margin), shadows, border-radius, and animations.

**Q: Does it work with CSS-in-JS?**
A: Partially. Computed styles are extracted, but variable names may be lost.

**Q: Can it extract from Tailwind CSS sites?**
A: Yes, but you'll get computed values, not Tailwind classes.

**Q: Does it support CSS preprocessors?**
A: It extracts compiled CSS. Original SCSS/LESS variables are not preserved.

**Q: What about CSS Grid and Flexbox?**
A: Layout properties are not currently extracted, only design tokens.

### Usage Questions

**Q: How many sites can I analyze?**
A: 10 per 15 minutes due to rate limiting.

**Q: Can I analyze localhost sites?**
A: No, only public URLs are supported.

**Q: Can I re-analyze the same site?**
A: Yes, but results may be cached for a short time.

**Q: Can I edit tokens before exporting?**
A: Yes, you can name and organize tokens before export.

**Q: Can I import existing token names?**
A: Not currently, but you can manually name tokens.

### Troubleshooting Questions

**Q: Why do I get CORS errors?**
A: Some websites block cross-origin requests. Try a different site.

**Q: Why is analysis so slow?**
A: Large CSS files or dynamic analysis can take time. Be patient.

**Q: Why are some colors missing?**
A: Colors in images, SVGs, or dynamically generated may not be extracted.

**Q: Can I analyze mobile-specific styles?**
A: The tool analyzes desktop styles. Mobile-specific media queries are included.

**Q: Does the app work on mobile devices?**
A: Yes! The application is fully responsive and optimized for mobile phones, tablets, and desktops.

**Q: Can I use keyboard only (no mouse)?**
A: Yes! Full keyboard navigation is supported with Tab, Enter, Space, Escape, and Arrow keys.

**Q: Is the app accessible for screen reader users?**
A: Yes! All interactive elements have ARIA labels and the app follows WCAG AA accessibility guidelines.

**Q: What if I find a bug?**
A: Report it on GitHub Issues with details and steps to reproduce.

---

## Getting Help

### Documentation

- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) - Configuration

### Support Channels

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check existing docs first
- **Community**: Share tips and tricks

### Reporting Issues

When reporting issues, include:

1. **Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Exact steps to trigger the issue
3. **URL**: The website you were analyzing (if public)
4. **Browser**: Browser name and version
5. **Screenshots**: Visual evidence if applicable
6. **Error Messages**: Any error messages shown

**Example Issue Report:**
```
Title: Analysis fails for example.com

Description:
When I try to analyze https://example.com, the analysis fails 
with a network error after about 10 seconds.

Steps to Reproduce:
1. Open the app
2. Enter "https://example.com"
3. Click "Start Analysis"
4. Wait for error

Expected: Analysis completes successfully
Actual: Error message "Failed to fetch target website"

Browser: Chrome 120.0.6099.109
Screenshot: [attached]
```

---

## Glossary

**Design Token**: A reusable design value (color, font, spacing, etc.)

**Static Analysis**: Extracting values from CSS files

**Dynamic Analysis**: Observing animations with a headless browser

**Starter Kit**: Generated package of design tokens and animations

**Token Mapping**: Assigning semantic names to extracted values

**Motion Report**: Documentation for recreating observed animations

**CORS**: Cross-Origin Resource Sharing, a browser security feature

**Headless Browser**: Browser without UI, used for automation

**Rate Limiting**: Restriction on number of requests per time period

---

**Last Updated**: November 14, 2025

**Version**: 1.0.0

---

**Happy analyzing! 🎨**
