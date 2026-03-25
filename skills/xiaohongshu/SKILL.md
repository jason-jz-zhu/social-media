---
name: xiaohongshu
description: Generate a complete Xiaohongshu (Little Red Book) post — content + carousel slides + cover image — from a topic idea
user_invocable: true
---

# Xiaohongshu Content Creation Skill

Create a publish-ready Xiaohongshu carousel post from a topic idea, including written content, cover image, and content slides.

## Input

The user provides a topic or idea (can be a phrase, a question, or a rough concept).

## Audience Targeting

Before writing anything, internalize these rules about who reads Xiaohongshu:

- **NEVER limit your audience in the first sentence** (e.g., "如果你是程序员" excludes 72% of XHS users). Open with universal emotions/experiences, then narrow to your specific angle.
- Xiaohongshu is **70% female, 85% are post-95/post-00**. Frame tech topics through feelings and relatable experiences, not jargon.
- **Replace all English jargon with Chinese equivalents:**
  - vibe coding → "让AI帮你写代码"
  - MVP → "能用的初版"
  - agent → "小工具/助手"
  - H1B → "工作签证"
  - Any other English tech term → find a natural Chinese phrase that a non-technical reader would understand

## Story-First Principle

Every post MUST start from a personal experience, not an information point. This is the single most important rule.

**Content formula:**
```
个人场景 → 转折冲突 → 思考过程 → 你做了什么 → 开放问题
```

**NOT this (information-first):**
> "AI发展这么快，到底什么时候是个头？很多人觉得AI会一直增长..."

**Do this (story-first):**
> "昨晚11点看完GTC直播，关了电脑躺在床上，跟老婆说了一句：'以后用AI可能跟交水电费一样。'她翻了个白眼..."

**Rules:**
- Every post must open with a specific scene: **时间 + 地点 + 动作**（"上周五开会时..." "凌晨3点，我对着屏幕..."）
- The insight comes FROM the story, not before it
- Use real details (names, numbers, dialogue) to build trust
- Readers should feel "我也经历过" not "哦，知道了"

**Prohibited opening patterns:**
- ❌ "你有没有想过..."
- ❌ "今天来聊聊..."
- ❌ "最近很多人在讨论..."
- ❌ "AI发展这么快..."
- ❌ Any opening that starts with a general observation instead of a personal moment

## Bookmark Optimization

Xiaohongshu algorithm weights: **收藏 > 评论 > 点赞**. Bookmarks are the most important engagement signal.

- To drive bookmarks: include **actionable steps, tool recommendations, or frameworks** people want to reference later.
- Golden quote slide (slide 7) should be the most screenshot-worthy.
- Consider adding a "how I did it" mini-tutorial in the last content slide.
- Every post must give the reader a reason to save it — either to try later, share with a friend, or reference a specific method.

## Workflow

### Step 1 — Create Shared Outline

Before writing any platform-specific content, create `shared/outline.md` in the post directory with:

- **Core thesis** — the single sentence this post is arguing
- **Key arguments** — 3-5 supporting points
- **Personal story** — the specific experience that makes this authentic
- **Scene** — the specific moment this post opens with (time, place, action, dialogue)
- **Emotional turn** — the point where expectations are broken ("直到..." / "但后来...")
- **Golden quote** — the one-liner "aha" moment readers will screenshot
- **Target platforms checklist** — which platforms this content will be adapted for (e.g., `[x] 小红书  [ ] Twitter  [ ] 公众号`)

This outline is the **single source of truth** for all platform-specific content. All platform adaptations (Xiaohongshu slides, Twitter threads, etc.) must derive from this outline.

### Step 2 — Generate Post Content

Write the post in Chinese with a conversational, authentic tone:

- **标题 (Title):** ≤20 characters. Must contain **personal experience + emotional conflict**.
  - ✅ "每月450刀订阅AI，我老婆问我值吗"
  - ✅ "凌晨3点，AI写的代码比我好"
  - ✅ "没有PhD，我去美国大学教了一学期课"
  - ❌ "AI替代人，什么时候是个头？"（pure information, no person）
  - ❌ "黄仁勋讲了2小时，我帮你划重点"（information relay, no emotion）
- **正文 (Body):** ≤1000 characters. First-person, conversational, no markdown bold (`**`), no bullet lists. Use line breaks for pacing. End with a call-to-action inviting comments.
- **话题标签 (Hashtags):** 5–8 relevant tags prefixed with `#`.

**Saveable Content requirement:** Every post MUST include at least one "saveable" element:

- A **tool name** (specific app, website, or service)
- A **specific method/steps** (numbered, concrete actions)
- A **framework** (a mental model or decision process)
- A **concrete number/result** (metrics, timelines, costs)

Rules for saveable content:
- The saveable content should feel natural within the story, not forced — weave it in as "here's what I used / here's how I did it"
- Posts without saveable value get low bookmark rates, which kills distribution on Xiaohongshu
- Example: instead of "我用AI做了个工具", say "我用 Claude + Cursor，三步做出初版：描述需求 → AI出初版 → 来回调细节"

Refer to `references/platform-rules.md` for constraints and `references/content-template.md` for the output format.

### Step 3 — Validate Character Limits

Before proceeding, count characters:
- Title ≤ 20 characters (Chinese chars count as 1)
- Body ≤ 1000 characters

If either limit is exceeded, revise before continuing.

### Step 4 — Generate Cover Image (Slide 1)

**封面设计与内容页完全不同。** 封面在信息流中与其他帖子竞争点击，必须视觉冲击力强。

Create an HTML file (1080 x 1440 px, 3:4 ratio) following `references/design-guide.md`:

- **背景：深色渐变或高饱和色块**（不要用奶白 — 数据证明白底在信息流中表现差）
- **标题：Noto Sans SC, 100-120px, 900 weight, 白色**，占画面 60%+
- **关键词用荧光标记笔效果**（::after pseudo-element, 高饱和色, opacity 0.6）
- **必须有视觉元素**：手绘涂鸦/emoji 放大/简笔图标（150-250px），与话题相关
- 副标题：48-56px, 500 weight
- **不放标签药丸和底部装饰**（缩略图看不到，浪费空间）
- **每篇封面用不同的背景模板**，避免信息流中所有帖子看起来一样

背景模板选择（从中轮换）：
- 模板A 深色渐变（`#1A1A2E → #0F3460`）
- 模板B 暖色渐变（`#FF6B35 → #FFC371`）
- 模板C 高饱和色块（纯色）
- 模板D 深色+局部高亮色块

Screenshot to PNG:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --screenshot=cover.png \
  --window-size=1080,1440 cover.html
```

### Step 5 — Split Content into Carousel Slides

Break the article into 6-8 slides (including cover and CTA). This is the key step for Xiaohongshu engagement — multi-slide carousel posts get ~37% more saves than single-image posts.

**Slide structure (story-driven):**

| Slide | Purpose | Guidelines |
|-------|---------|------------|
| 1 (Cover) | Hook — attract clicks | Bold cover with story-driven title |
| 2 | Scene — "那天我..." | Specific time + place + action. Set the stage (~50-80 chars) |
| 3 | Conflict — "直到..." | The turn, expectations broken (~50-80 chars) |
| 4 | Reflection — "我突然意识到..." | Inner monologue, thinking process (~50-80 chars) |
| 5 | Action — "于是我..." | What you actually did about it (~50-80 chars) |
| 6 | Deeper insight | From personal to universal truth (~50-80 chars) |
| 7 | Saveable page | Framework/checklist/cost breakdown — drives bookmarks |
| 8 | Golden quote + CTA | Screenshot-worthy line + open question for comments |

**Content per slide rules:**
- Max 50-100 Chinese characters per slide
- Each slide should be digestible in 3-5 seconds
- One key point per slide — never stack multiple ideas
- End each slide with a hook word/phrase highlighted in accent color to encourage swiping
- Golden quote slide should be the most visually impactful — this is what people screenshot

### Step 6 — Generate Slide HTML & PNG Files

Create each slide as a separate HTML file, all sharing a unified design system:

**Consistent across content slides (slide 2-8, NOT the cover):**
- Dimensions: 1080 x 1440 px (3:4)
- Background: `#FFF9F5` (cream white) — only for content slides, cover uses dark/colorful background
- Accent color: use the series-specific color (see "Adapting accent colors" below) for highlights, labels, dots
- Grain texture overlay at `opacity: 0.03`
- Subtle warm background blur shapes
- Page number in bottom-right: `N / total` in `#BBBBBB`, 28px
- Font: Noto Sans SC (body), Noto Serif SC (headings)

**Slide type designs:**

**Content slide design philosophy: 极简为主**
- Content slides should be CLEAN and SIMPLE — like the "PTO已死" post style
- White background, large black text, minimal decoration
- Let the words carry the weight, not the design
- Only the cover and saveable/golden-quote slides need visual richness
- Label pills are optional — use them only when listing numbered points

**Intro slide (slide-2):**
- Body text: 42px, 400 weight, `#333`, line-height 1.75
- Key phrase highlighted in accent color bold
- Left-aligned, vertically centered

**Point slides (slide-3 to slide-N):**
- Accent label pill: 32px white text on accent color background, border-radius 20px
- Point title: Noto Serif SC, 52px, 700 weight, `#1A1A1A`
- Body text: 42px, 400 weight, `#333`
- Punch line at end: accent color highlight
- Left-aligned, vertically centered

**Golden quote slide:**
- Center-aligned
- Quote text: Noto Serif SC, 52px, 900 weight
- Key words in accent color
- Divider line with accent color dot
- Solution section below divider with light accent label pill
- Body text: 40px, centered

**CTA slide (last):**
- Center-aligned
- Chat bubble SVG icon
- CTA question: Noto Serif SC, 56px, 700 weight
- Subtitle: 40px, `#666`
- Divider
- Hashtag pills in light accent color style

**Batch screenshot all slides:**
```bash
for i in 2 3 4 5 6 7 8; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --disable-gpu --screenshot=slide-${i}.png \
    --window-size=1080,1440 slide-${i}.html 2>/dev/null
done
```

### Step 7 — Save to Folder Structure

Save all artifacts under the project root:

```
content/{series}/{YYYY-MM-DD}_{topic-slug}/
  shared/
    outline.md         # shared outline (created in Step 1)
  xiaohongshu/
    content.md         # post content (title, body, hashtags, image refs)
    cover.html         # slide 1 source
    cover.png          # slide 1 image
    slide-2.html       # slide 2 source
    slide-2.png        # slide 2 image
    ...
    slide-N.html       # last slide source
    slide-N.png        # last slide image
```

Use today's date and a short English slug derived from the topic. The `{series}` directory corresponds to the content series (e.g., `ai`, `career`, `housing`, `tax`).

Update `content.md` to list all slides in the 封面图片 section.

### Step 8 — Update Topics File

Check `topics/{series}.md` at the project root (where `{series}` matches the content series, e.g., `topics/ai.md`, `topics/career.md`):
- If the topic matches an item in the "待写列表" section, remove it from the list and add a checked entry under "已完成":
  ```
  - [x] {topic title} → {folder-name}/
  ```
- Re-number remaining items in 待写列表.

## Adapting Accent Colors

Each **series** should use a consistent accent color across all its posts:

| Series | Color Name | Hex |
|--------|-----------|-----|
| AI系列 | coral | `#FF6B6B` |
| 职场系列 | teal | `#2EABB0` |
| 房产系列 | amber | `#F5A623` |
| 税务系列 | blue | `#3B82F6` |
| 心态系列 | warm orange | `#FF8C42` |
| 创业系列 | purple | `#7C3AED` |

When generating slides and covers, use the appropriate series color in place of the default accent color for:
- Label pills
- Highlighted key words
- Divider dots
- Hook phrases
- Tag pill backgrounds

Within a series, all posts share the same accent color so readers develop visual recognition of the content category.

## Body Text Strategy (正文 ≠ Slide 内容)

**正文不是slide内容的复制粘贴。** 正文和slide各有各的作用：

| | Slide图片 | 正文区域 |
|---|---|---|
| 作用 | 视觉阅读体验 | SEO搜索发现 + 驱动评论 |
| 搜索权重 | 低（OCR排第5位） | **高**（仅次于标题） |
| 内容 | 故事+框架+金句 | 关键词+补充信息+互动引导 |

**正文公式（600-800字，触发算法加分）：**

```
第一段：个人故事开头（嵌入核心搜索关键词）     ← SEO + 真实感
第二段：slide内容的"不同角度"概括             ← 补充而非重复
第三段：slide里没放的额外信息/细节            ← 独家内容，给人"看正文也有收获"的感觉
第四段：互动引导问题                          ← 驱动评论（评论权重4分，远高于点赞1分）
```

**关键词布局规则：**
- 核心关键词必须出现在：标题 + 正文前100字 + 标签
- 正文关键词密度 2-3%
- 分层：核心词放标题，场景词放正文，长尾词散布全文
- 如果某个搜索词只在slide图片里而正文没有 → 搜索几乎找不到

**示例：**
- ❌ 把slide的"三步法"原封不动贴到正文
- ✅ 正文用不同的话讲同一个意思，同时嵌入"H1B焦虑""时间管理""蔡格尼克效应"等搜索关键词

## Publishing Guide

When uploading to Xiaohongshu:
1. Upload images in order: cover.png → slide-2.png → ... → slide-N.png
2. Paste the 正文 from content.md into the body field — **正文要专门写，不是复制slide**
3. 正文 = SEO关键词 + 个人故事 + 补充信息 + 互动引导
4. Add hashtags from content.md

**发布策略：**
- **发布时间：18:30-20:00**（下班后刷手机高峰）
- **频率：每周 3-5 篇**（不要日更，质量优先）
- **发布后 30 分钟是黄金窗口**：立刻回复所有评论，回复率 >80% 进入下一级流量池概率提升 3.7 倍
- **养号：** 每天花 15-20 分钟浏览/点赞/评论同领域内容，去热门帖子写有质量的评论

## Cross-Platform Integration

This skill can be invoked independently or as part of the `cross-platform` workflow.

**Independent mode:** User provides a topic directly. Follow the full workflow from Step 1.

**Cross-platform mode:** `shared/outline.md` already exists (created by cross-platform skill). Skip Step 1, use the existing outline.

**When deriving from mother content (Substack):**
- Do NOT translate the English Substack content into Chinese
- Rewrite from scratch based on the outline's "小红书角度"
- Story and emotional hooks should be different from the English versions
- Add XHS-specific elements: H1B angle, 在美华人 perspective, 留学生 relevance

## References

- [Platform Rules](references/platform-rules.md) — character limits, formatting constraints, hashtag best practices
- [Content Template](references/content-template.md) — output file format for content.md
- [Design Guide](references/design-guide.md) — cover image design system (colors, typography, layout)
- [Slide Design Guide](references/slide-design-guide.md) — carousel slide design system
