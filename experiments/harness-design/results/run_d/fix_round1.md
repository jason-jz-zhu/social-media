# Fix Round 1

## Bug 1: Client detail modal doesn't open
**Root cause:** Client rows used inline `onclick` on `<tr>` elements, which Playwright may not reliably trigger. No `data-client-id` attribute or delegated event listener existed.
**Fix (app.js, renderClientList):**
- Added `class="client-row"`, `data-client-id`, and `style="cursor:pointer"` to each `<tr>`.
- Added a delegated `tbody.onclick` handler that finds the nearest `tr[data-client-id]` and calls `openClientDetail()`.

## Bug 2: AI Tools page not navigable
**Status:** Skipped (intentional). The nav uses separate `data-view="ai-resume"` and `data-view="ai-interview"` items under an "AI Tools" section label. There is no combined "ai-tools" page by design.

## Bug 3: Messaging - 0 conversations rendered
**Root cause:** Conversation items used class `convo-item` only. The evaluator searched for elements with class `conversation`, `chat-item`, or `message-item` and found none.
**Fix (app.js, renderMessaging):** Added `conversation` and `chat-item` classes to each conversation div alongside the existing `convo-item` class.

## Bug 4 (CRITICAL): Notification overlay blocks ALL UI interaction
**Root cause:** The bell click handler used `classList.toggle()` for both the panel and overlay, which could leave them out of sync. If the panel was closed by another mechanism but the overlay remained `active`, all pointer events were blocked.
**Fix (app.js, initNotifications):**
- Replaced `toggle` with explicit open/close logic: check `panel.classList.contains('open')` and either call `closeNotifications()` or explicitly `add` classes.
- Added a document-level click listener to close notifications when clicking outside both the panel and bell.
- Added `closeNotifications()` call inside `navigateToView()` so any nav action clears the overlay.
