# Harness Design Experiment — Final Comparison (A/B/C/D)

## Same Input, Four Architectures

| Metric | Run A (Solo) | Run B (Gen+Eval) | Run C (3-Agent) | Run D (Full Harness) |
|--------|-------------|-----------------|-----------------|---------------------|
| **Architecture** | 1 agent | 1 agent (self-eval) | 3 agents (no browser test) | 3 agents + Playwright + feedback loop |
| **Duration** | 7 min | 8 min | 25 min | 29 min |
| **Tokens** | 51K | 56K | 243K | 229K |
| **Files** | 3 | 5 | 5 + reports | 5 + reports + test scripts + screenshots |
| **Spec** | None | Self-decomposed | 322-line spec | Same spec + sprint contracts |
| **Self-eval** | None | 13/14 PASS | 90/90 PASS | 90/90 PASS |
| **Independent eval** | None | None | 88/90 (code review) | 18/20 (Playwright browser test) |
| **Real bugs found** | 0 | 1 | 3 (code-level) | 4 (interaction-level) |
| **Feedback loops** | 0 | 0 | 0 | 3 rounds |
| **Bugs fixed** | 0 | 1 | 0 | 3 of 4 |
| **Browser testing** | No | No | No | Yes (Playwright) |

## The Evolution of Evaluation Quality

```
Run A: "I'm done" (no evaluation)
Run B: "I checked myself, 93% pass" (self-evaluation bias)
Run C: "Independent reviewer says 98% pass" (code review only)
Run D: "Browser test says 90% pass, found overlay bug that breaks the entire app" (interaction testing)
```

## The Notification Overlay Bug — Why This Matters

Run D's Playwright evaluator discovered that after opening the notification panel,
an overlay element stays active and BLOCKS ALL POINTER EVENTS on the entire page.

- Generator self-eval: "PASS — notification panel works"
- Run C code reviewer: "PASS — toggle logic looks correct"
- Run D Playwright: "FAIL — overlay intercepts all clicks after opening notifications"

This bug makes the app UNUSABLE after viewing notifications. It was invisible from
code review and only discoverable by actually clicking things in a browser.

This is the CORE argument for harness design: browser-based evaluation catches
interaction bugs that code review cannot.

## Cost vs Confidence

| Run | Approx Cost | Confidence Level |
|-----|-------------|-----------------|
| A | ~$1 | Unknown (no testing) |
| B | ~$1 | Low (self-eval bias) |
| C | ~$5 | Medium (code review) |
| D | ~$5 | High (browser-verified, bugs fixed) |

Run D costs the same as Run C but provides dramatically higher confidence
because of real browser testing and the feedback-fix cycle.

## What Each Architecture Level Adds

| Level | What It Adds | What It Catches |
|-------|-------------|----------------|
| Solo (A) | Nothing | Nothing |
| Self-Eval (B) | Feature decomposition, progress tracking | Obvious logic errors |
| Independent Eval (C) | Separate perspective, code review | Code-level bugs, missing functionality |
| Full Harness (D) | Browser testing, feedback loop, fix cycles | **Interaction bugs, state bugs, UX blockers** |
