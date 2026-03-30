# Sprint 1 Fixes

## Issues Found by Evaluator

### 1. FAIL: Client List page navigation
**Problem:** Playwright could not find a clickable "Clients" link using `text=Clients` locator.
**Root cause:** The nav link used `href="#"` which may have caused navigation issues. The link text "Clients" was inside a `<span class="nav-item-text">` but the `<a>` tag lacked an accessible label.
**Fix:** Changed `href="#"` to `href="#clients"` and added `aria-label="Clients"` to the anchor element in `index.html` (line 40). This makes the link more discoverable by Playwright's text-based locators and ensures proper accessibility.

### 2. PARTIAL: Mobile responsive - sidebar visible at 375px
**Problem:** Sidebar remained visible on mobile viewport (375px width) instead of being hidden with a hamburger toggle.
**Root cause:** The `<aside class="sidebar">` element had an inline `style="position:relative"` attribute, which overrode the `position: fixed` rule in the `@media (max-width: 768px)` CSS block. Without `position: fixed`, the sidebar stayed in the normal document flow and `transform: translateX(-100%)` did not visually hide it from the layout.
**Fix:**
- Removed the inline `style="position:relative"` from the sidebar element in `index.html`.
- Added `position: relative` to the base `.sidebar` CSS rule so desktop layout is preserved.
- Added `!important` to `position: fixed` and `width` in the 768px media query to guarantee the sidebar is taken out of flow on mobile.
- Added `display: none` for `.sidebar-toggle` on mobile (the collapse toggle is not needed when the sidebar is off-canvas).
- Added `transform` to the sidebar's `transition` property for smooth slide-in/out animation.

### 3. PARTIAL: Activity feed not found
**Problem:** No element with a class containing "activity", "feed", or "recent" was found on the dashboard.
**Root cause:** The activity panel existed in the DOM (with heading "Recent Activity" and `<ul class="activity-list">`), but the parent `<div>` only had class `panel` -- no class containing "activity" or "feed" for the evaluator's selector to match.
**Fix:** Added class `activity-feed` to the activity panel's `<div>` element in `index.html` (changed `class="panel"` to `class="panel activity-feed"`).
