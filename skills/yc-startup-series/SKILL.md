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

### Interaction Flow (Human ↔ AI)

```
User: 贴transcript
  ↓
AI: 总结 + highlight重点（5-8关键观点 + 反常识 + 金句）
  ↓
User: 给个人感受（哪些触动、个人经历、想跳过的）
  ↓
AI: 用agent team读skill，并行生成三平台内容（XHS + LinkedIn + Medium）
  ↓
AI: 截图所有slides和Medium图片
  ↓
User: review → feedback → 发布
```

### Step 1 — Summarize & Highlight

Read the transcript and produce (直接回复用户，不用agent):
- **5-8 key points** with brief explanations
- **2-3 counterintuitive/surprising insights** (标记为反常识 🔥)
- **2-3 best quotes** from the speaker(s)
- **Speaker info** — who they are, what they built

Present this to the user and ask for their personal reactions before generating content.

### Step 2 — User Feedback

User responds with:
- Which points resonate most
- Personal stories/experiences that connect
- Any points they disagree with or want to skip

### Step 3 — Generate All Platform Content (Parallel)

Use **agent teams** that read this skill file and generate content. Each agent receives:
- The skill file path to read
- Day number, speaker, lecture topic
- Key points from the transcript
- User's personal reactions
- Resource links (YouTube + Genius)

Launch 2 agents in parallel:
- **Agent 1 (XHS):** content.md + cover.html + slide-2 to slide-7.html (8 files)
- **Agent 2 (LinkedIn + Medium):** post.md + comment.md + article.md + PUBLISH-GUIDE.md + 4 image HTMLs (8 files)

### Step 4 — Screenshot & Review

After agents complete:
1. Batch screenshot all XHS slides (1080x1440) and Medium images (1200x630)
2. Show key slides to user for review
3. Iterate based on feedback

### Step 5 — Update & Publish

- Update topics/startup.md (move Day from 待写 to 已完成)
- User publishes to platforms

**CRITICAL: Professional Identity Across All Platforms**

The author is NOT a student learning about startups. He is a **10+ year veteran at major tech companies specializing in data and AI**, holds an **MBA from NYU Stern**, and serves as **Adjunct Faculty teaching data courses at Northeastern University (NEU)**. The framing across ALL platforms must reflect this:

| Platform | Identity Framing | Never Say | Instead Say |
|----------|-----------------|-----------|-------------|
| 小红书 | 做了10年data和AI，结合经验聊 | "我在学..." | "做了10年tech，这个观点让我重新想了..." |
| LinkedIn | Revisiting frameworks, pressure-testing | "I'm studying..." | "I'm revisiting...against 10 years of building" |
| Medium | Authority + original analysis | "I learned that..." | "From my experience building data products..." |
| Substack | Deepest personal + professional insight | (N/A) | Add "The AI/Data Angle" section each week |

**Every post should naturally reveal 1-2 of these credentials:**
- 10+ years building data/AI products at major tech companies
- NYU Stern MBA
- Adjunct Faculty at Northeastern University (NEU), teaching data courses
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
  2. 今日拆解 — speaker + topic + key formula/framework
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
  1. Hero image — dark gradient on `.hero` div, body background `#0F3460` (matches gradient endpoint, prevents color band), series badge "20 Days of YC's Startup Bible", Day number, article title, speaker attribution, `border-bottom: 5px solid #7C3AED`
  2. Key insight visual (1-2) — background `#F3F0FA` (light purple, NOT white — matches series color and stands out on Medium's white page)
  3. Quote card — background `#F3F0FA`, featured quote with speaker attribution
  - All images use Noto Sans (not SC), purple #7C3AED accent
  - All content images use `#F3F0FA` background for visual consistency
  - Screenshot at 1200x630 using Chrome headless
  - Insert into article with descriptive alt text for SEO
- **Resources section (at article end):**
  - YouTube lecture link
  - Genius annotated transcript link (if available)
- **Substack CTA link:** `https://substack.com/@jiazhenzhu`
- **PUBLISH-GUIDE.md:** Generate a publishing guide for each article with:
  - How to paste/import into Medium
  - Image upload locations
  - Topics/tags to add
  - Preview image selection

### Step 4 — User Review

Present all 3 platform contents for user feedback. Iterate as needed.

### Step 5 — Generate Slides & Screenshots

After content approval:
1. Generate all HTML slide files (cover + 6 content slides)
2. Screenshot to PNG using Chrome headless
3. **Overflow check (MANDATORY):** After screenshotting, visually inspect EVERY slide image. Check that:
   - All text is fully visible (no cut-off at bottom or right edge)
   - The "从业者视角" / "亲身体验" insight box at slide bottom is completely rendered
   - Page number "N / 7" is visible at bottom-right
   - If ANY content is clipped, reduce padding/margins/font-size and re-screenshot before showing to user
4. Verify all images render correctly

### Step 6 — Update Topics File

In `topics/startup.md`:
- Move the completed Day from 待写 to 已完成
- Format: `- [x] Day N — [topic] → content/startup/[folder]/`

## Weekly Substack Compilation (Every 5 Days)

Every Friday (after Day 5, 10, 15, 20), generate a Substack newsletter:

- **Subject:** "Week N: What I Took Away from YC Lectures X-Y"
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

## Cross-Platform Rules

### Unified Identity
All platforms use the name **Jiazhen Zhu**. XHS uses 朱佳臻 Jiazhen.

### XHS Specific Rules
- **NEVER mention** Medium, Substack, LinkedIn, or any external platform name in posts or bio — triggers shadowban/traffic reduction
- **Safe bio phrasing:** "全平台同名 Jiazhen Zhu" (no platform names)
- **Posting frequency:** Do NOT post this series daily on XHS. Interleave with AI/career posts. Total 4-5 posts/week across all series.
- Example weekly XHS schedule: Mon=创业Day1, Wed=AI帖, Thu=创业Day2, Sat=职场帖

### LinkedIn → Medium Flow
- LinkedIn post is a SHORT hook (150-300 words), NOT the full article
- Medium link goes in the FIRST COMMENT, never in the post body (algorithm penalty)
- After publishing Medium, immediately update `comment.md` with the real URL

### Medium → Substack Flow
- Every Medium article ends with CTA linking to `https://substack.com/@jiazhenzhu`
- Phrasing: "I go deeper there, with angles I don't publish on Medium"
- Substack weekly compilation must include EXCLUSIVE content not on Medium

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
    article.md           # full article
    PUBLISH-GUIDE.md     # publishing instructions (topics, image placement)
    images/
      hero.html + hero.png           # article header (dark gradient, #0F3460 body bg)
      [insight].html + .png          # 1-2 concept visuals (#F3F0FA bg)
      quote.html + quote.png         # featured quote card (#F3F0FA bg)
```

Weekly Substack:
```
content/startup/YYYY-MM-DD_week-N-compilation/
  substack/
    newsletter.md
```
