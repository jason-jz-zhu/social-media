# Sprint 1 Contract - Run D

## What Was Built

### 1. App Layout
Sidebar + main content area with responsive behavior. Sidebar collapses via toggle button. On mobile (<768px), sidebar becomes an overlay with a hamburger menu trigger.

### 2. Navigation
Sidebar navigation with Material Symbols icons, active state highlighting (white background + amber left accent bar), section groupings (Main, Finance, System). Clicking nav items switches the active view and updates the page header.

### 3. Dashboard Home
Four summary metric cards (Total Revenue, Active Clients, Pending Invoices, Hours This Week) with colored top borders and trend indicators. Below: a two-column grid with Recent Activity feed (7 items) and Quick Stats panel.

### 4. Client List
Table view showing 10 clients with columns: Client (name + email + avatar), Company, Status, Projects, Last Contact. Search box filters by name or company in real time. Status filter dropdown (All, Active, Inactive, Lead). Color-coded status badges.

## Definition of Done Assessment

| Criterion | Status |
|-----------|--------|
| Sidebar renders with logo, nav items, and user avatar | PASS |
| Nav items: Dashboard, Clients, Projects, Invoices, Time, Settings | PASS |
| Clicking nav items switches active state and shows correct view | PASS |
| Dashboard shows 4 summary metric cards with realistic numbers | PASS |
| Dashboard shows recent activity feed (5+ items) | PASS (7 items) |
| Client list displays 8+ clients in a table | PASS (10 clients) |
| Client table has columns: Name, Company, Status, Projects, Last Contact | PASS |
| Search box filters clients by name or company | PASS |
| Status filter dropdown works (All, Active, Inactive, Lead) | PASS |
| Client status badges use color coding | PASS (green/gray/amber) |
| Layout is responsive (sidebar collapses on small screens) | PASS |
| All colors follow deep indigo + amber palette | PASS |
| Mock data lives in separate data.js file | PASS |

## Known Issues / Shortcuts

- **Font loading**: Inter font and Material Symbols are loaded from Google Fonts CDN. If offline, falls back to system fonts.
- **No transitions on view switch**: Views swap instantly with display:none/block rather than animated transitions.
- **Placeholder views**: Projects, Invoices, Time Tracking, and Settings show placeholder screens (intentional -- these are Sprint 2-4 features).
- **No persistent state**: Navigation state, search, and filter reset on page reload.
- **Avatar colors**: Client avatars use a simple modulo-based color rotation rather than deterministic hashing.
- **Sidebar toggle button**: Positioned with `position:absolute` relative to sidebar; on collapsed state the button may overlap slightly on very narrow viewports.
