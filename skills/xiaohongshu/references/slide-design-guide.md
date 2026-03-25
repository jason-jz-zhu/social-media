# Carousel Slide Design Guide

Design system for Xiaohongshu carousel (轮播图) content slides. All slides are self-contained HTML files (1080 x 1440 px) screenshotted to PNG.

## Why Carousel

- Multi-slide posts get ~37% more saves and ~30% higher engagement than single-image posts
- Image-based content drives screenshots and saves — core content belongs on slides, not in body text
- Optimal slide count: 6-9 (cover + 4-6 content + CTA)
- Each slide should be digestible in 3-5 seconds of scrolling

## Global Design Tokens (All Slides)

```css
/* Dimensions */
width: 1080px;
height: 1440px;

/* Background */
background: #FFF9F5;  /* cream white */

/* Accent */
accent: #FF6B35;  /* warm orange */

/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Noto+Serif+SC:wght@400;600;700;900&display=swap');

/* Content padding */
padding: 100px;
max-width: 880px (content area);

/* Page number */
position: absolute; bottom: 50px; right: 60px;
font-size: 28px; color: #BBBBBB;
format: "N / total"

/* Grain texture */
opacity: 0.03; /* SVG feTurbulence noise */

/* Background shapes */
2 radial gradient circles, filter: blur(120px), opacity 0.05-0.08
```

## Slide Types

### Type 1: Cover (Slide 1)

**封面设计与内容页完全不同。** 封面在信息流中竞争点击，必须醒目。详见 `design-guide.md`。

关键区别：
- **背景：深色渐变/高饱和色块**（不是奶白）
- **标题：100-120px，无衬线 900 weight，占画面 60%+**
- **必须有视觉元素**（手绘涂鸦/emoji/插图）
- **关键词用荧光标记笔效果**
- **不放标签药丸和底部装饰**（省空间给标题）
- **每篇封面用不同的背景模板**

### Type 2: Intro Slide

Purpose: build relatability, create suspense.

```css
.body-text {
  font-size: 42px;
  font-weight: 400;
  color: #333333;
  line-height: 1.75;
  letter-spacing: 1px;
  text-align: left;
}
.highlight {
  color: #FF6B35;
  font-weight: 700;
}
```

- Left-aligned, vertically centered
- 2-3 text blocks separated by `gap: 48px`
- Last line uses `.highlight` to create cliffhanger
- ~50-80 characters total

### Type 3: Point Slide (原因一/二/三/四...)

Purpose: one key argument per slide.

```css
.label {
  display: inline-block;
  background: #FF6B35;
  color: #FFFFFF;
  font-size: 32px;
  font-weight: 700;
  padding: 10px 28px;
  border-radius: 20px;
  letter-spacing: 2px;
}
.point-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 52px;
  font-weight: 700;
  color: #1A1A1A;
}
.body-text {
  font-size: 42px;
  font-weight: 400;
  color: #333333;
  line-height: 1.75;
}
```

Layout (top to bottom):
1. Orange label pill (`原因一`)
2. Bold heading (one-line summary)
3. Body text (2-3 short paragraphs)
4. Punch line in orange highlight

Left-aligned, vertically centered, ~50-80 characters.

### Type 4: Golden Quote Slide

Purpose: core insight — the most saveable/screenshottable slide.

```css
.golden {
  font-family: 'Noto Serif SC', serif;
  font-size: 52px;
  font-weight: 900;
  color: #1A1A1A;
  line-height: 1.5;
  text-align: center;
}
.solution-label {
  background: rgba(255, 107, 53, 0.1);
  color: #FF6B35;
  font-size: 30px;
  font-weight: 700;
  padding: 10px 28px;
  border-radius: 20px;
}
```

Layout (top to bottom):
1. Golden quote text (key words in orange)
2. Supporting line in lighter gray
3. Divider (line · dot · line)
4. Solution label pill (`我的做法`)
5. Solution body text, centered

Center-aligned, ~80-100 characters.

### Type 5: CTA Slide (Last)

Purpose: drive comments, follows, engagement.

```css
.cta-text {
  font-family: 'Noto Serif SC', serif;
  font-size: 56px;
  font-weight: 700;
  color: #1A1A1A;
}
.cta-sub {
  font-size: 40px;
  font-weight: 400;
  color: #666666;
}
.tag {
  font-size: 30px;
  font-weight: 500;
  color: #888888;
  background: rgba(255, 107, 53, 0.06);
  border: 1px solid rgba(255, 107, 53, 0.12);
  padding: 10px 28px;
  border-radius: 24px;
}
```

Layout (top to bottom):
1. Chat bubble SVG icon (orange stroke)
2. CTA question (e.g., "你们有类似感觉吗？")
3. Engagement prompt (e.g., "评论区聊聊 👋")
4. Divider
5. Hashtag pills

Center-aligned, ~40 characters + tags.

## Content Splitting Rules

1. **One idea per slide** — never stack multiple arguments
2. **50-100 characters per slide** — readable in 3-5 seconds
3. **Hook at the end** — each slide should end with something that makes you swipe
4. **Structure pattern**: Hook → Points (one per slide) → Insight → Solution → CTA
5. **Numbered labels** (原因一/二/三...) for point slides help users track progress
6. **Golden quote slide** is the climax — place the most quotable, screenshot-worthy insight here

## Accent Color Variation

Each post should use a different accent color to create visual differentiation across the account. Stay within warm, high-saturation range:

| Post mood | Suggested accent | Hex |
|-----------|-----------------|-----|
| Default / energy | Warm orange | `#FF6B35` |
| Growth / positive | Coral | `#FF6B6B` |
| Calm / reflective | Teal | `#2EABB0` |
| Urgency / warning | Amber | `#F5A623` |
| Professional | Deep blue | `#3B82F6` |

Change the accent color for content slides (2-8) — their background (`#FFF9F5`) and typography stay fixed.

**Cover (slide 1) uses a completely different design system** — see `design-guide.md`. The cover background should be dark/colorful, NOT cream white.
