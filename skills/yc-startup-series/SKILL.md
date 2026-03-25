---
name: yc-startup-series
description: Generate cross-platform content for "6点起床学创业" series — from YC lecture transcript to XHS slides + LinkedIn hook + Medium article
user_invocable: true
---

# YC Startup Series Skill — 6点起床学创业

Generate daily cross-platform content from a YC "How to Start a Startup" lecture transcript. One skill call produces content for 3 platforms + weekly Substack compilation.

## Input

User provides:
1. **Lecture transcript** (pasted or linked)
2. **Personal reactions** — which points resonated, personal stories/connections
3. **Day number** (1-20)

## Workflow

### Step 1 — Summarize & Highlight

Read the transcript and produce:
- **5-8 key points** with brief explanations
- **2-3 counterintuitive/surprising insights** (标记为反常识)
- **2-3 best quotes** from the speaker(s)
- **Speaker info** — who they are, what they built

Present this to the user and ask for their personal reactions before generating content.

### Step 2 — User Feedback

User responds with:
- Which points resonate most
- Personal stories/experiences that connect
- Any points they disagree with or want to skip

### Step 3 — Generate All Platform Content (Parallel)

Generate content for 3 platforms simultaneously using agent teams.

**CRITICAL: Professional Identity Across All Platforms**

The author is NOT a student learning about startups. He is a **10-year tech veteran specializing in AI and data**, currently finishing an MBA at NYU Stern, and teaching CS as a guest lecturer. The framing across ALL platforms must reflect this:

| Platform | Identity Framing | Never Say | Instead Say |
|----------|-----------------|-----------|-------------|
| 小红书 | 做了10年data和AI，结合经验聊 | "我在学..." | "做了10年tech，这个观点让我重新想了..." |
| LinkedIn | Revisiting frameworks, pressure-testing | "I'm studying..." | "I'm revisiting...against 10 years of building" |
| Medium | Authority + original analysis | "I learned that..." | "From my experience building data products..." |
| Substack | Deepest personal + professional insight | (N/A) | Add "The AI/Data Angle" section each week |

**Every post should naturally reveal 1-2 of these credentials:**
- 10+ years building data/AI products
- NYU Stern MBA (finishing)
- University CS guest lecturer
- Heavy AI user ($450/month in AI tools)
- Built chat-to-data, data platforms, AI features

Don't list them. Weave them in as "I've seen this in my own experience..." or "In my MBA classes we learned X, but YC says Y..."

#### 小红书 (XHS)
- **Series name:** 6点起床学创业 Day N
- **Accent color:** purple #7C3AED
- **Title:** ≤20 characters, format "6点起床学创业DayN：[金句]"
- **Body:** 600-800 characters, Chinese, tutorial/learning-notes style
  - Opening: light touch on 6am scene (1-2 sentences, not forced)
  - What the lecture taught (with personal connections)
  - Series continuity: mention tomorrow's topic
  - CTA question
- **Slides:** 7 pages
  1. Cover — dark #1A1A1A background, purple accent, "Day N" large, today's key insight, series badge
  2. 今天学了什么 — speaker + topic + key formula/framework
  3. Core insight 1 — with examples from the lecture
  4. Core insight 2 — with visual comparison or framework
  5. Core insight 3 or personal connection — deeper point
  6. 收藏页 — "Day N 核心观点" numbered list (drives bookmarks)
  7. 金句 + CTA — quote + "明天Day N+1：[next topic]" + hashtag pills

**Cover design (consistent across series):**
- Background: #1A1A1A (dark base)
- Series badge: "6点起床学创业" in purple #7C3AED pill, 56px
- "Day N" in 140px, 900 weight, white, with purple glow behind
- Today's key insight in 80px, keyword highlighted with purple marker effect
- Speaker attribution in 44px, rgba(255,255,255,0.7)
- Visual elements: lightbulb SVG (top-right), clock SVG (top-left)

**Content slide design (consistent across series):**
- Background: #FFFFFF
- Series badge top-left: "6点起床学创业 Day N" purple pill, 24px
- Accent: #7C3AED for labels, highlights, numbers
- Page number bottom-right: "N / 7" in #CCC

#### LinkedIn (Hook → Medium)
- **Series name:** What YC Teaches About Startups (Day N/20)
- **Length:** 150-300 words MAX (short hook, not full article)
- **Format:** Plain text, no markdown, CAPS for emphasis
- **Structure:**
  1. Hook — 1-2 punchy sentences (counterintuitive insight or striking example)
  2. Authority frame — 1 sentence positioning as experienced practitioner ("revisiting against 10 years of building in tech")
  3. Key insight — 2-3 sentences expanding the hook, with a brief personal domain connection
  4. Drive to Medium — "Full breakdown in comments 👇"
  5. Hashtags — 3-5 (always include #AIStrategy or #DataStrategy)
- **Comment:** Prepare a separate comment with Medium article link
- **Tone:** Expert revisiting fundamentals, NOT student learning. Never use "studying" or "learning" — use "revisiting", "pressure-testing", "re-examining"
- **Goal:** Make people think "this person has deep domain expertise AND startup insight" → click to Medium

#### Medium (Full Article)
- **Series name:** 20 Days of YC's Startup Bible
- **Title:** SEO-optimized, format "YC's Startup Lesson #N: [Insight]"
- **Subtitle:** Speaker name + topic summary
- **Length:** 1500-2000 words, English
- **Structure:**
  1. Introduction — position as experienced practitioner revisiting fundamentals, lecture overview
  2. Key insight sections (2-3, each with H2 heading)
  3. Personal connection section — tie to own data/AI experience
  4. "The AI/Data Angle" — how this 2014 advice applies (or doesn't) in the AI era. This is the author's unique value-add, not just summarizing the lecture.
  5. "What Surprised Me Most" — reflection
  6. Key Takeaways — bullet list (saveable)
  7. What's Next — preview Day N+1, CTA to Substack ("I go deeper there, with angles I don't publish on Medium")
- **Tone:** Authoritative but personal, thought-leader
- **SEO:** Primary keyword in title, subtitle, first 100 words, at least one H2
- **CTA:** Subscribe to Substack ("I go deeper there, with angles I don't publish on Medium")
- **Images (English, 1200x630px):** Generate 3-4 images per article:
  1. Hero image — dark gradient, series badge "20 Days of YC's Startup Bible", Day number, article title, speaker attribution
  2. Key insight visual (1-2) — clean white background, data visualization or comparison chart illustrating a core concept
  3. Quote card — light purple #F8F5FF background, featured quote with speaker attribution
  - All images use Noto Sans (not SC), purple #7C3AED accent
  - Screenshot at 1200x630 using Chrome headless
  - Insert into article with descriptive alt text for SEO

### Step 4 — User Review

Present all 3 platform contents for user feedback. Iterate as needed.

### Step 5 — Generate Slides & Screenshots

After content approval:
1. Generate all HTML slide files (cover + 6 content slides)
2. Screenshot to PNG using Chrome headless
3. Verify all images render correctly

### Step 6 — Update Topics File

In `topics/startup.md`:
- Move the completed Day from 待写 to 已完成
- Format: `- [x] Day N — [topic] → content/startup/[folder]/`

## Weekly Substack Compilation (Every 5 Days)

Every Friday (after Day 5, 10, 15, 20), generate a Substack newsletter:

- **Subject:** "Week N: 从YC创业课第X-Y节我学到的"
- **Length:** 2500-3500 words, English
- **Structure:**
  1. Personal greeting
  2. Week overview — what 5 lectures covered, the arc
  3. Cross-lecture insights — themes that connect multiple lectures (NOT just 5 summaries pasted together)
  4. MBA perspective — compare YC teaching vs MBA curriculum
  5. Personal reflection — what changed in your thinking this week
  6. Exclusive content — something NOT in the daily Medium articles (a personal story, a deeper take, a contrarian view)
  7. Next week preview
  8. CTA — reply to email, forward to a friend
- **Goal:** Give subscribers content they can't get on Medium. Build the "I know this person" feeling.

## Platform Funnel

```
LinkedIn (hook, 150-300 words)
    → comments: Medium link
Medium (full daily article, 1500-2000 words)
    → CTA: subscribe to Substack
小红书 (Chinese carousel, independent)
    → Chinese audience, independent funnel
Substack (weekly compilation, exclusive content)
    → deepest relationship, trust building
    → eventually: Calendly consulting
```

## Trust → Consulting Funnel

The ultimate goal of this series is building credibility for consulting:

```
看到你 (LinkedIn/小红书)     → "这人有意思"
读你的文章 (Medium)          → "这人懂行"
订阅你 (Substack)           → "这人我信"
找你聊 (Calendly)           → "这人能帮我"
```

- **Day 1-10:** Pure value, no selling. Build audience.
- **Day 15:** Soft mention: "If you're working through these ideas for your own startup, happy to chat"
- **Day 20 (final):** Wrap-up post with clear CTA: "I've spent 20 days studying this. If you want to talk through your startup idea, here's my Calendly."

## Lecture Reference

| Day | Topic | Speaker(s) |
|-----|-------|-----------|
| 1 | Ideas, Products | Sam Altman, Dustin Moskovitz |
| 2 | Teams and Execution | Sam Altman |
| 3 | Counterintuitive Parts of Startups | Paul Graham |
| 4 | Building Product, Talking to Users | Adora Cheung |
| 5 | Business Strategy and Monopoly Theory | Peter Thiel |
| 6 | Growth | Alex Schultz |
| 7 | How to Build Products Users Love | Kevin Hale |
| 8 | Doing Things That Don't Scale, PR | Walker Williams, Justin Kan, Stanley Tang |
| 9 | How to Raise Money | Marc Andreessen, Ron Conway, Parker Conrad |
| 10 | Company Culture Part I | Alfred Lin, Brian Chesky |
| 11 | Company Culture Part II | Patrick Collison, John Collison, Ben Silbermann |
| 12 | Building for the Enterprise | Aaron Levie |
| 13 | How to Be a Great Founder | Reid Hoffman |
| 14 | How to Operate | Keith Rabois |
| 15 | How to Manage | Ben Horowitz |
| 16 | How to Run a User Interview | Emmett Shear |
| 17 | How to Design Hardware Products | Hosain Rahman |
| 18 | Legal and Accounting Basics | Kirsty Nathoo, Carolynn Levy |
| 19 | Sales, Marketing, How to Pitch | Tyler Bosmeny, Michael Seibel, Dalton Caldwell, Qasar Younis |
| 20 | Closing Thoughts | Sam Altman |

## File Structure

```
content/startup/YYYY-MM-DD_dayN-topic-slug/
  shared/
    outline.md
  xiaohongshu/
    content.md
    cover.html + cover.png
    slide-2.html + slide-2.png
    ...
    slide-7.html + slide-7.png
  linkedin/
    post.md          # short hook post
    comment.md       # Medium link for comments
  medium/
    article.md       # full article
    images/
      hero.html + hero.png         # article header
      [insight].html + .png        # 1-2 concept visuals
      quote.html + quote.png       # featured quote card
```

Weekly Substack:
```
content/startup/YYYY-MM-DD_week-N-compilation/
  substack/
    newsletter.md
```
