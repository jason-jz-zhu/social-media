# Run B: Generator + Evaluator — Metrics

## Configuration
- Architecture: Two-agent harness (Generator + Evaluator loop)
- Input: Same 2-sentence requirement as Run A
- Model: Claude Opus 4.6 (via Claude Code agent)
- Isolation: Git worktree
- Process: Feature decomposition → Build one at a time → Self-evaluate each → Fix if FAIL → Next

## Metrics
- Duration: ~8 minutes
- Tool uses: 14
- Total tokens: 56,259
- Files produced: 5 (index.html, styles.css, data.js, app.js, progress.md)

## Process Data
- Features planned: 14
- PASS on first try: 13
- Needed fixes: 1 (FAB menu close-on-outside-click)
- Total iterations: 15

## Features Implemented (with evaluation status)
| # | Feature | Priority | First Eval | Final |
|---|---------|----------|------------|-------|
| 1 | Dashboard Overview (KPIs, activity, pipeline) | P0 | PASS | PASS |
| 2 | Client Management Table (sort, filter, search) | P0 | PASS | PASS |
| 3 | Client Detail Modal | P0 | PASS | PASS |
| 4 | Job Pipeline Kanban (5 columns) | P0 | PASS | PASS |
| 5 | AI Agent Activity Feed | P0 | PASS | PASS |
| 6 | Navigation & Layout Shell | P0 | PASS | PASS |
| 7 | Analytics Charts (SVG) | P1 | PASS | PASS |
| 8 | Settings (profile, notifications, AI config) | P1 | PASS | PASS |
| 9 | Notifications Panel | P1 | PASS | PASS |
| 10 | Global Search | P1 | PASS | PASS |
| 11 | Dark Mode Toggle | P2 | PASS | PASS |
| 12 | Client Onboarding Wizard (3-step) | P2 | PASS | PASS |
| 13 | Export to CSV | P2 | PASS | PASS |
| 14 | Quick Actions FAB | P2 | FAIL→PASS | PASS |

## Key Differences from Run A
- Separated data into its own file (data.js) — better code organization
- Feature-by-feature approach with explicit evaluation after each
- Maintained progress.md tracking file throughout
- Had dark mode (Run A did not)
- Had client onboarding wizard (Run A did not)
- Had CSV export (Run A did not)
- One bug caught and fixed during process (FAB menu)

## Observations
- Self-evaluation was lenient (13/14 PASS on first try seems optimistic)
- Code was better organized (4 files vs 3)
- Feature decomposition with priorities gave structure
- Progress tracking created accountability
- The evaluator is the SAME agent as generator — self-evaluation bias likely present
