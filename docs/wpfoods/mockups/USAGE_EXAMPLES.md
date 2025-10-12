# 🎨 WPFoods Mockups - Usage Examples

Quick reference guide for inserting mockups into different presentation formats.

---

## 1. PowerPoint / Keynote

### Method A: Direct Text Insert (Best for editing)

```
1. Create text box
2. Select font: Courier New, 10pt
3. Set line spacing: Exactly 1.0
4. Copy entire mockup content
5. Paste into text box
6. Add background color: RGB(245, 245, 245)
```

**Pros:** Editable, searchable, small file size
**Cons:** Requires monospace font, alignment can break

### Method B: Screenshot Insert (Best for consistency)

```
1. Open mockup in VS Code with monospace font
2. Zoom to comfortable reading size
3. Take screenshot of mockup area only
4. Insert image into slide
5. Add subtle drop shadow (optional)
```

**Pros:** Perfect alignment, no formatting issues
**Cons:** Not editable, larger file size

### Recommended Slide Layout:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Slide Title]                                  │
│                                                 │
│  ┌──────────────────┐   ┌──────────────────┐   │
│  │                  │   │  Key Metrics:    │   │
│  │   MOCKUP HERE    │   │  • Order in 2min │   │
│  │   (60% width)    │   │  • 96% complete  │   │
│  │                  │   │  • 4.8 rating    │   │
│  └──────────────────┘   └──────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 2. Google Slides

### Best Practice:

1. **Create Master Slide with Mockup Template:**
   ```
   Format → Slide size → Custom → 16:9
   Insert → Text box → Format: Courier New, 10pt
   Background: #F5F5F5
   ```

2. **Copy Mockup Content:**
   ```
   Open .txt file
   Select all (Cmd+A / Ctrl+A)
   Copy (Cmd+C / Ctrl+C)
   Paste into text box (Cmd+V / Ctrl+V)
   ```

3. **Preserve Formatting:**
   ```
   Format → Line spacing → Custom → 1.0
   Format → Align → Left
   Ensure "Autofit" is OFF
   ```

### Google Slides Limitations:
- Emoji rendering may vary by browser
- Box drawing characters may not render perfectly
- **Solution:** Use screenshot method instead

---

## 3. PDF Export

### High-Quality PDF Creation:

```bash
# Using VS Code + Print to PDF:

1. Open mockup .txt file in VS Code
2. Set font: Courier New, 11pt
3. View → Word Wrap → OFF
4. File → Print (Cmd+P)
5. Choose "Save as PDF"
6. Settings:
   - Paper: A4 or Letter
   - Margins: Normal
   - Background graphics: ON
```

### Multi-Mockup PDF (All 6 in one):

```
Create document with each mockup on separate page
Add page numbers
Add header: "WPFoods - Investor Mockups"
Export as PDF
```

---

## 4. Web / HTML Presentation

### HTML Code Example:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .whatsapp-mockup {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.0;
      background: #F5F5F5;
      padding: 20px;
      border-radius: 10px;
      white-space: pre;
      overflow-x: auto;
      max-width: 500px;
      margin: 20px auto;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="whatsapp-mockup">
    <!-- Paste mockup content here -->
╔══════════════════════════════════════════╗
║ ← WPFoods                       🔍 💬 ⋮ ║
╠══════════════════════════════════════════╣
...
  </div>
</body>
</html>
```

### React Component Example:

```jsx
import React from 'react';

const WhatsAppMockup = ({ content }) => {
  return (
    <pre
      style={{
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        lineHeight: 1.0,
        background: '#F5F5F5',
        padding: '20px',
        borderRadius: '10px',
        whiteSpace: 'pre',
        overflowX: 'auto',
        maxWidth: '500px',
        margin: '20px auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      {content}
    </pre>
  );
};

// Usage:
import customerOrdering from './mockups/customer_ordering.txt';

<WhatsAppMockup content={customerOrdering} />
```

---

## 5. Markdown / GitHub

### Raw Text Display:

````markdown
## Customer Ordering Experience

```
╔══════════════════════════════════════════╗
║ ← WPFoods                       🔍 💬 ⋮ ║
╠══════════════════════════════════════════╣
║                                          ║
║              Today 6:15 PM               ║
...
```
````

### With Syntax Highlighting:

```markdown
## Customer Ordering Experience

<pre>
<code class="language-text">
[Paste mockup content here]
</code>
</pre>
```

---

## 6. Notion

### Best Method for Notion:

1. **Create Code Block:**
   ```
   Type: /code
   Select: Plain Text
   Paste mockup content
   ```

2. **Format Code Block:**
   ```
   Click "..." menu
   Select "Wrap Lines" → OFF
   Font size: Small or Normal
   ```

3. **Add Context:**
   ```
   Add callout above:
   💡 "Customer orders pizza in 2 minutes using natural language"
   ```

### Notion Limitations:
- Emojis may render differently
- Box drawing characters supported but smaller
- **Tip:** Use full-width blocks for better readability

---

## 7. Figma / Design Tools

### Creating Editable Mockup in Figma:

```
1. Create frame (375x812px - iPhone size)
2. Add text layer
3. Font: SF Mono or Courier New, 10pt
4. Line height: 100%
5. Paste mockup content
6. Background: #F5F5F5
7. Add phone frame from UI kit (optional)
```

### Creating Realistic Phone Mockup:

```
1. Use mockup text as base
2. Import phone frame (iPhone mockup)
3. Add WhatsApp UI elements:
   - Top bar (9:41, signal, battery)
   - WhatsApp green header
   - Bottom input field
4. Place mockup text in message area
5. Export as PNG (2x resolution)
```

**Pro Tip:** Use Figma's "Phone Mockup" community files for realistic frames

---

## 8. Video / Animation (Loom, Keynote)

### Animated Mockup Presentation:

```
Keynote Magic Move:
1. Slide 1: Show empty WhatsApp screen
2. Slide 2: Add first user message
3. Slide 3: Add bot response
4. Apply "Magic Move" transition
5. Duration: 0.5-1 second per transition

Result: Messages appear to type in real-time
```

### Screen Recording with Mockups:

```
1. Open mockup in VS Code (full screen)
2. Start recording (QuickTime, Loom)
3. Slowly scroll through mockup
4. Pause at key moments
5. Add voiceover explaining each step
```

---

## 9. Print Materials (Flyers, Brochures)

### Print-Optimized Version:

```
Adobe InDesign / Illustrator:
1. Import mockup as text
2. Font: Courier New, 9-10pt (smaller for print)
3. Convert to outlines (prevents font issues)
4. Add phone frame graphic
5. Print settings:
   - Resolution: 300 DPI minimum
   - Color mode: CMYK
   - Bleed: 3mm
```

### QR Code Addition:

```
Print mockup + QR code linking to:
- Live demo
- Video walkthrough
- Interactive prototype

"Scan to see it in action"
```

---

## 10. Slack / Discord / Chat Platforms

### Sharing in Slack:

```
Method 1 - Code Block:
```
[Paste mockup here]
```

Method 2 - File Upload:
Drag .txt file directly into Slack
Recipients can download and view

Method 3 - Screenshot:
Take screenshot of mockup
Upload as image (renders immediately)
```

### Slack Canvas (Best for Pitch):

```
1. Create new Canvas
2. Add heading: "WPFoods Customer Experience"
3. Insert code block with mockup
4. Add annotations with highlights
5. Share Canvas with team/investors
```

---

## 🎯 Recommended Combinations by Use Case

### Investor Pitch Deck (PowerPoint):
```
✅ Use: Screenshot method
✅ Add: Drop shadow for depth
✅ Layout: Mockup (60%) + Metrics (40%)
✅ Quality: High-res PNG
```

### Website / Landing Page:
```
✅ Use: HTML <pre> with styling
✅ Add: Subtle animation on scroll
✅ Layout: Centered, max-width 500px
✅ Responsive: Hide on mobile, show summary
```

### Email Campaign:
```
✅ Use: Screenshot PNG
✅ Add: Alt text for accessibility
✅ Link: To full demo or video
✅ CTA: "See it in action"
```

### Demo Day Presentation:
```
✅ Use: Keynote with Magic Move
✅ Add: Voiceover narration
✅ Timing: 30-45 seconds per mockup
✅ Highlight: Key differentiators
```

### GitHub README:
```
✅ Use: Markdown code blocks
✅ Add: Collapsible sections
✅ Link: To video demo
✅ Note: "View in monospace font"
```

### Product Hunt Launch:
```
✅ Use: Animated GIF (multiple mockups)
✅ Add: 3-second pause per mockup
✅ Format: 1200x630px (optimal)
✅ File size: <5MB
```

---

## 🛠️ Troubleshooting Common Issues

### Issue: Alignment breaks in PowerPoint
**Solution:**
```
1. Ensure Courier New (not "Courier")
2. Turn OFF "AutoFit Text"
3. Set line spacing to EXACTLY 1.0 (not "single")
4. Use screenshot method as fallback
```

### Issue: Emojis don't show
**Solution:**
```
1. Check UTF-8 encoding
2. Use system font with emoji support
3. Replace with Unicode emoji codes
4. Use screenshot method (emojis baked in)
```

### Issue: Box characters render as ???
**Solution:**
```
1. Ensure Unicode support enabled
2. Try different monospace font
3. Use screenshot method (most reliable)
```

### Issue: Text too small to read in presentation
**Solution:**
```
1. Increase font size to 12pt
2. Maintain monospace font
3. May need to adjust slide layout
4. Consider showing partial mockup (key sections only)
```

---

## 💡 Pro Tips

### Tip 1: Create Mockup Variations
```
Full mockup: For detailed analysis
Key moments: 3-5 lines for quick impact
Before/after: Show problem → solution
```

### Tip 2: Add Annotations
```
Use arrows/callouts to highlight:
- AI understanding
- Speed (timestamps)
- Transparency (pricing)
- Simplicity (1-tap actions)
```

### Tip 3: Animate for Impact
```
Keynote/PowerPoint:
- Build in messages one by one
- Simulate typing effect
- Add sound effects (optional)
- Pause at key moments
```

### Tip 4: Customize for Audience
```
Technical audience: Show full mockups
Business audience: Focus on metrics
Investors: Highlight unit economics
Users: Emphasize simplicity
```

---

## 📊 Mockup Performance Metrics

Track which mockups resonate most:

```
A/B Test in pitch deck:
- customer_ordering.txt vs restaurant_analytics.txt
- Track: Questions asked, time spent on slide
- Optimize: Lead with highest-impact mockup

Conversion tracking:
- Landing page mockup → Demo signups
- Email mockup → Click-through rate
- Social media mockup → Engagement rate
```

---

## 📞 Quick Reference

| Format | Best Method | Font Size | Quality |
|--------|-------------|-----------|---------|
| PowerPoint | Screenshot | N/A | ⭐⭐⭐⭐⭐ |
| Google Slides | Screenshot | N/A | ⭐⭐⭐⭐ |
| Web/HTML | Pre tag | 11px | ⭐⭐⭐⭐⭐ |
| PDF | VS Code Print | 11pt | ⭐⭐⭐⭐⭐ |
| Markdown | Code block | N/A | ⭐⭐⭐ |
| Figma | Text layer | 10pt | ⭐⭐⭐⭐ |
| Print | Illustrator | 9pt | ⭐⭐⭐⭐ |

**Legend:** ⭐⭐⭐⭐⭐ = Perfect | ⭐⭐⭐ = Good enough

---

**Need Help?** If you're having trouble with a specific format not covered here, check README.md or create an issue with your use case.
