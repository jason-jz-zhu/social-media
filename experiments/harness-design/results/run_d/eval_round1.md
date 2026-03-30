# Run D: Evaluator Round 1 Results (Playwright)

## Scores: 14 PASS, 2 FAIL, 1 PARTIAL (out of 17 tested before crash)

## PASS (14):
- Sidebar exists
- 11 nav items
- 11 navigable pages (all work)
- Dashboard metric cards
- Client rows (41)
- Client search works
- Pipeline columns (10)
- Pipeline cards (61)
- Calendar events (6)
- Document items
- Revenue page loads
- Analytics charts (34)
- Notification panel opens
- Global search (Ctrl+K) works

## FAIL (2):
1. **Client detail modal doesn't open** — clicking client row doesn't show detail view
2. **AI Tools page** — nav item uses different data-view than expected (resume-tailor/interview-prep exist as separate pages, not combined ai-tools)

## PARTIAL (1):
3. **Messaging** — page loads but conversation items not found (0 conversations rendered)

## BUG FOUND (blocking):
4. **Notification overlay blocks all UI** — after opening notification panel, the overlay (notif-overlay) stays active and intercepts ALL pointer events. Settings nav click times out because overlay is in the way. This would block any user from interacting with the app after viewing notifications.

## Next: Feed these 4 issues back to Generator for fix
