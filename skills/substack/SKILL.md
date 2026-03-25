---
name: substack
description: Generate a Substack newsletter as "mother content" — the deepest version of a topic, English, personal voice
user_invocable: true
---

# Substack Newsletter Skill

## Input

User provides a topic, outline, or rough idea. This skill generates a complete Substack newsletter draft.

## Role: Mother Content

This is the MOTHER CONTENT — the most complete, most detailed version of any topic. All other platform content (Medium, LinkedIn, XHS) derives from this piece. Write it deep, write it thorough, write it personal.

The content funnel:

```
Substack (mother content, most detailed)
    ├→ Medium (rewrite title for SEO, add structure, remove personal tone)
    ├→ LinkedIn (extract 1-2 key insights, 500-1200 words)
    └→ XHS (Chinese rewrite, story-driven, carousel slides)
```

## Content Formula

Follow this structure in order:

1. **Email Subject** (50 characters max) — concise, curiosity-driven, no clickbait
2. **Preview Text** (100 characters max) — complements the subject, adds context
3. **Personal Greeting** — warm, direct, like opening a letter to a friend
4. **Story Intro** — a personal anecdote, observation, or moment that grounds the topic in real experience
5. **Deep Analysis** — the core of the piece; break down the topic with depth, nuance, and original thinking; use data, examples, and frameworks where relevant
6. **Practical Section** — actionable takeaways, step-by-step guides, tool recommendations, or frameworks readers can use immediately
7. **Reflection** — step back, zoom out; what does this mean in the bigger picture? connect to broader themes (AI, career, identity)
8. **CTA** — ask readers to reply to the email or forward it to someone who would benefit; keep it natural, not salesy
9. **Signature** — consistent sign-off with name and links

## Length

2500-4000 words, English only.

## Tone

Personal, intimate, like writing to a smart friend over coffee. You are a tech veteran (10+ years in US tech), heavy AI user, NYU Stern MBA. Write with authority but without arrogance. Share what you actually think, not what sounds impressive.

- First person throughout
- Conversational but substantive
- Okay to be vulnerable, uncertain, or contrarian
- No corporate jargon, no filler, no fluff

## Decomposition Notes

Every newsletter MUST end with a "Decomposition Notes" section that maps out how this mother content will be adapted:

- **LinkedIn angle:** Which 1-2 insights to extract, what hook to use, professional framing
- **Medium SEO title suggestion:** A search-optimized title rewrite (include target keyword)
- **XHS Chinese story angle:** Which personal story or data point to lead with, carousel structure idea

## Publishing Schedule

- **Writing day:** Wednesday
- **Publish day:** Every Thursday, 9:00 AM ET
- **Time investment:** ~2 hours for writing + editing

## Content Pillars (from strategy)

| Pillar | Share | Topics |
|---|---|---|
| AI Tools / Workflows | 50% | Claude vs ChatGPT, AI coding, tool reviews |
| Career / Identity | 30% | H1B, job switching, MBA, interviews |
| Growth / Mindset | 20% | Anxiety, learning methods, career reflections |

## Cross-Platform Linking

Substack is the private domain — link freely to all platforms:
- Link to Medium articles for SEO depth
- Link to LinkedIn for professional context
- Link to Calendly (future) for consulting
- Include all social links in signature

## Output

Generate a file named `newsletter.md` using the template in `references/content-template.md`.
