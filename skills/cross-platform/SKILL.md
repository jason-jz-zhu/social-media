---
name: cross-platform
description: Orchestrate the "mother content" workflow — create Substack newsletter and decompose into Medium, LinkedIn, YouTube, and Xiaohongshu content
user_invocable: true
---

# Cross-Platform Orchestration Skill

This is an ORCHESTRATION skill, not a content creation skill. It coordinates the creation of a single "mother content" piece (Substack newsletter) and decomposes it into platform-specific content across Medium, LinkedIn, YouTube, and Xiaohongshu.

## Workflow

### Step 1: Create shared/outline.md

User provides a topic. Generate an outline with:

- **Core thesis** — the single sentence this content is arguing
- **Key arguments** — 3-5 supporting points
- **Personal story** — the specific experience that makes this authentic
- **Golden quote** — the one-liner "aha" moment readers will screenshot
- **Platform angles:**
  - **Substack:** full depth analysis angle
  - **Medium:** SEO title + search intent
  - **LinkedIn:** which 1-2 points, professional angle
  - **YouTube:** 中文口播脚本角度
  - **小红书:** 中文故事切入点, slide structure

Output: `shared/outline.md`

### Step 2: Generate Substack mother content

Execute the `substack` skill workflow using the outline.

Output: `substack/newsletter.md`

### Step 3: Derive Medium article

Execute the `medium` skill (input: outline + substack).

Output: `medium/article.md`

### Step 4: Derive LinkedIn post

Execute the `linkedin` skill (input: outline).

Output: `linkedin/post.md`

### Step 5: Derive 小红书 carousel

Execute the `xiaohongshu` skill (input: outline, Chinese rewrite).

Output: `xiaohongshu/content.md` + slides

### Step 6: Derive YouTube script (when ready)

Execute the `youtube` skill (input: outline).

Output: `youtube/script.md`

### Step 7: Generate publish schedule

Output: `shared/publish-schedule.md`

Based on weekly rhythm from content-strategy.md:

| Day | Action |
|-----|--------|
| Wed | Write Substack |
| Thu | Send Substack |
| Fri | Publish Medium |
| Mon | XHS carousel |
| Tue | LinkedIn post |

## Key Rules

- **Each platform content is DIFFERENT, not translated.** Chinese (XHS, YouTube) and English (LinkedIn, Medium, Substack) are independent content systems.
- **Agent teams can parallelize Steps 3-6** since they are independent of each other — they all derive from the outline and mother content.
- **Not all topics need all platforms.** Some are XHS-only (e.g., H1B content), some are English-only (e.g., industry trends). The outline's platform angles section determines which platforms to target.
