---
name: medium
description: Generate a Medium article from shared outline — long-form English, SEO-optimized, 2000-3000 words
user_invocable: true
---

# Medium Article Skill

## Input

Takes input from one of two sources:
- `shared/outline.md` — a shared topic outline
- `substack/newsletter.md` — the mother content newsletter

When deriving from the Substack mother content, this is a near-complete transfer of substance but with significant structural and tonal adjustments for the Medium platform.

## Content Formula

Follow this structure:

1. **SEO Title** — keyword-rich, compelling, 60-70 characters ideal; include the primary keyword near the front
2. **Subtitle** — high SEO weight on Medium; use secondary keywords, expand on the title's promise
3. **Lead Paragraph** — hook the reader in the first 100 words; include primary keyword naturally; establish credibility and stakes
4. **Structured Body** — organized with clear H2 and H3 sections; each section should be scannable with a clear point; use data, examples, comparisons, and frameworks
5. **Practical Steps** — numbered or bulleted actionable content readers can implement
6. **Conclusion** — summarize key insights, restate the core argument
7. **CTA to Substack** — end with a natural invitation to subscribe to the newsletter for deeper, more personal content

## Length

2000-3000 words (targeting 7-12 minute read time), English only.

## SEO Rules

- Primary keyword must appear in: title, subtitle, first 100 words, and at least one H2 heading
- Secondary keywords distributed naturally through H2/H3 headings
- Use the subtitle field intentionally — Medium gives it high SEO weight
- Alt text on all images should include relevant keywords
- Internal linking to your other Medium articles where relevant

## From Mother Content: Adaptation Guide

When converting from the Substack newsletter:

| Aspect | Substack (Mother) | Medium (Adapted) |
|---|---|---|
| Title | Curiosity-driven, personal | SEO-optimized, keyword-rich |
| Tone | Intimate, letter-like | Authoritative, thought-leader |
| Structure | Flowing narrative | Heavy use of H2/H3, scannable |
| Opening | Personal anecdote | Hook + credibility + keyword |
| CTA | "Reply to this email" | "Subscribe to my newsletter" |
| Links | Free linking everywhere | Link to Substack in CTA |
| Personal stories | Central | Supporting evidence, not the focus |

**What to keep:** All substance, data, frameworks, practical steps, original insights.

**What to change:** Title (rewrite for SEO), remove Substack-specific personal tone, add more headings and structure, front-load keywords.

**What to remove:** Personal greeting, signature, decomposition notes, email-specific CTAs.

## Publishing Schedule

- **Publish window:** Tuesday through Thursday, morning ET
- **Frequency:** Once per week
- **Typical day:** Friday (after Thursday Substack publish)

## Tags

Select up to 5 Medium tags per article. Choose tags that:
- Have high follower counts on Medium
- Are directly relevant to the article content
- Mix broad tags (e.g., "Artificial Intelligence") with specific ones (e.g., "AI Tools")

Common tags for this content:
- Artificial Intelligence, Technology, Career Advice, Productivity, Self Improvement
- Machine Learning, ChatGPT, Leadership, Remote Work, MBA

## Content Pillars

| Pillar | Share | Topics |
|---|---|---|
| AI Tools / Workflows | 50% | Claude vs ChatGPT, AI coding, tool reviews |
| Career / Identity | 30% | Job switching, MBA value, interviews |
| Growth / Mindset | 20% | Learning methods, career reflections |

Note: H1B/visa topics are XHS-only (Chinese audience). Do not include them in Medium content.

## Cross-Platform Linking

- End every article with a CTA linking to Substack newsletter
- Do not put external links in LinkedIn posts — instead, place Medium article links in LinkedIn comments
- Medium articles serve as the SEO long-tail engine driving organic discovery

## Output

Generate a file named `article.md` using the template in `references/content-template.md`.
