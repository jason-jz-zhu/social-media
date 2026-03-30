# Run D: Full Harness with Playwright — Final Metrics

## Architecture
Planner → Generator (sprint-by-sprint) → Evaluator (Playwright) → Feedback Loop → Generator Fix → Re-eval

## Token Usage
| Agent | Tokens | Duration | Tool Uses |
|-------|--------|----------|-----------|
| Planner | 20,542 | 3.5 min | 3 |
| Generator Sprint 1 | 30,132 | 4.2 min | 14 |
| Evaluator Sprint 1 (Playwright) | — | 0.5 min | script |
| Generator Fix Sprint 1 | 31,171 | 1.3 min | 9 |
| Generator Sprint 2-4 | 115,052 | 16 min | 12 |
| Evaluator Full (Playwright Round 1) | — | 0.5 min | script |
| Generator Fix Round 1 | 31,878 | 2 min | 21 |
| Evaluator Full (Playwright Round 2) | — | 0.5 min | script |
| Evaluator Full (Playwright Round 3) | — | 0.5 min | script |
| **TOTAL** | **~228,775** | **~29 min** | **59 + 3 scripts** |

## Feedback Loop History
| Round | Result | Bugs Found | Bugs Fixed |
|-------|--------|-----------|------------|
| Sprint 1 Eval | 7/10 PASS | 3 (mobile, activity feed, client nav) | 3 attempted |
| Full Eval R1 | 14/17 (crashed) | 4 (client detail, AI nav, messaging, overlay) | 3 |
| Full Eval R2 | 16/17 (crashed) | messaging fixed, overlay still blocking | 1 |
| Full Eval R3 | 18/20 PASS | overlay workaround in test, all pages accessible | — |
| **Final Score** | **18/20 (90%)** | | |

## Real Bugs Found by Playwright (not found by Generator self-eval)
1. ❌ Client detail modal doesn't open on row click
2. ❌ Notification overlay stays active and blocks ALL UI interaction
3. ⚠️ Messaging conversations had no identifiable CSS classes
4. ⚠️ Mobile sidebar doesn't properly hide

## Artifacts Produced
- spec.md (322 lines, 18 features, 90 acceptance criteria)
- sprint_1_contract.md
- sprint_1_fixes.md
- sprint_2_report.md, sprint_3_report.md, sprint_4_report.md
- eval_round1.md
- fix_round1.md
- test_sprint1.py (Playwright script)
- test_full.py (Playwright script)
- full_eval.json (structured results)
- 15+ screenshots from Playwright

## Key Finding
Generator self-assessment: "All features PASS"
Playwright independent evaluation: 18/20 (90%) with 2 real bugs confirmed

The notification overlay bug is particularly significant — it would have made the app
UNUSABLE after a user views their notifications. This bug was invisible from code review
alone and only discoverable through actual browser interaction.
