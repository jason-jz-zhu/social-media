# Operator Dashboard - Product Specification

## 1. Product Vision

The Operator Dashboard is a web-based command center for career coaching professionals ("operators") who use JobAgent AI to manage multiple job-seeking clients at scale. It exists because career coaches today juggle spreadsheets, email threads, LinkedIn DMs, and scattered notes to track dozens of clients simultaneously -- losing hours to admin work that should go toward high-value coaching. This dashboard consolidates client management, AI-assisted resume/interview tooling, revenue tracking, and scheduling into a single interface, enabling operators to run their career service business like a well-oiled SaaS operation rather than a chaotic freelance practice.

---

## 2. User Persona

**Name:** Sarah Chen
**Title:** Independent Career Strategist & Executive Coach
**Age:** 38
**Background:** Former tech recruiter at a Fortune 500 company, now running her own career coaching practice for 3 years. Has 25-40 active clients at any time, charging $150-500/month per client depending on the tier (resume-only vs. full coaching). Revenue: $8K-15K/month.

**Her typical day:**
- 7:00 AM: Checks email and Slack for overnight client messages. Three clients applied to jobs yesterday and want feedback.
- 8:00 AM: Morning coaching calls (3 back-to-back, 30 min each). Takes notes in Google Docs, sometimes forgets which doc belongs to which client.
- 11:00 AM: Reviews and edits two resumes. Manually tailors each to specific job descriptions by copying bullet points between documents.
- 1:00 PM: Follows up with 5 clients who haven't responded in a week. Scrolls through her spreadsheet to figure out where each one is in their job search.
- 3:00 PM: Onboards a new client. Sends intake form via Typeform, creates a new row in her tracker spreadsheet, sets up a shared Google Drive folder.
- 5:00 PM: Invoices two clients whose monthly billing is due. Uses Stripe manually.
- 6:00 PM: Updates her own LinkedIn to attract new clients. Responds to 3 DMs from potential leads.

**Her pain points:**
1. **No single source of truth.** Client data is scattered across Google Sheets, Docs, email, calendar, and Stripe. She wastes 5-8 hours/week just context-switching and searching.
2. **Can't scale past ~35 clients.** The admin overhead per client is too high. She hits a ceiling where adding one more client means dropping quality for others.
3. **No visibility into client progress.** She can't quickly answer: "How many of my clients got interviews this month?" or "Who hasn't updated their resume in 2 weeks?"
4. **Revenue leakage.** She sometimes forgets to invoice clients or loses track of who's on which plan. Estimates she loses $500-1000/month to billing gaps.
5. **Repetitive AI work.** She uses ChatGPT for resume bullets and interview prep, but re-explains context every time. No memory across sessions or clients.

---

## 3. Feature List

### Feature 1: App Shell & Navigation
- **Description:** The foundational layout with a persistent left sidebar, top header bar, and main content area. The sidebar contains navigation links to all major sections with icons, a collapsed/expanded toggle, and visual indicators for the active page. The header shows the operator's name, avatar, notification bell, and a global search bar.
- **Priority:** P0
- **Sprint:** Sprint 1
- **Definition of Done:**
  1. Sidebar renders with all navigation items (Dashboard, Clients, Pipeline, Calendar, Documents, AI Tools, Revenue, Settings) and clicking each one switches the main content area without a page reload.
  2. Sidebar can be collapsed to icon-only mode and expanded back, with the state visually persisting during the session.
  3. The currently active navigation item is visually highlighted (distinct background color or left border accent).
  4. Header displays operator name ("Sarah Chen"), a placeholder avatar circle, and a notification bell icon with a red badge showing a count (e.g., "3").
  5. The layout is responsive: on viewports below 768px, the sidebar becomes a hamburger-triggered overlay.

### Feature 2: Dashboard Home / Overview
- **Description:** The landing page after login. Shows a high-level snapshot of the operator's business: key metric cards across the top (active clients, interviews this month, revenue this month, pending tasks), a "needs attention" list of clients requiring follow-up, and a daily agenda sidebar showing today's scheduled sessions. This is the operator's "morning coffee" screen.
- **Priority:** P0
- **Sprint:** Sprint 1
- **Definition of Done:**
  1. Four metric cards are visible at the top: "Active Clients" (number), "Interviews This Month" (number), "Monthly Revenue" (dollar amount), "Pending Tasks" (number). Each card shows the metric value and a small trend indicator (up/down arrow with percentage vs. last month).
  2. A "Needs Attention" section lists at least 5 clients with actionable reasons (e.g., "Resume not updated in 14 days", "Invoice overdue", "New application submitted -- review needed"). Each item is clickable and navigates to that client's detail page.
  3. A "Today's Schedule" panel shows at least 3 calendar entries with time, client name, and session type (e.g., "10:00 AM - Resume Review - James Park").
  4. All data is populated from realistic mock data (not lorem ipsum or placeholder text).
  5. The layout arranges cards in a row, needs-attention list in the center, and schedule in a right column (or stacked on mobile).

### Feature 3: Client List & Table
- **Description:** A searchable, sortable, filterable table of all clients. Each row shows client name, avatar, plan tier, status (active/paused/completed), last activity date, next session date, and a quick-action menu. The table supports pagination and bulk actions. This is the operator's primary client management view.
- **Priority:** P0
- **Sprint:** Sprint 1
- **Definition of Done:**
  1. Table displays at least 15 mock clients with columns: Name (with avatar), Plan (Basic/Pro/Premium), Status (color-coded badge: green=active, yellow=paused, gray=completed), Last Activity (relative date like "2 days ago"), Next Session (date or "Not scheduled"), and an Actions column with a "..." menu.
  2. A search bar above the table filters clients by name in real time (typing "ja" shows only clients whose names contain "ja", case-insensitive).
  3. Clicking column headers sorts the table by that column (at minimum: Name alphabetically, Last Activity by date). A sort direction indicator (arrow) appears on the active sort column.
  4. Filter dropdowns for Status and Plan are available and functional -- selecting "Active" + "Pro" shows only clients matching both criteria.
  5. Selecting multiple clients via checkboxes enables a bulk action bar (e.g., "Send Message", "Export") that appears above the table.

### Feature 4: Client Detail / Profile Page
- **Description:** A comprehensive single-client view accessed by clicking a client row. Organized in tabs: Overview (contact info, plan, key dates, notes), Documents (resumes, cover letters), Activity Timeline (chronological log of all interactions and milestones), and Applications (jobs they've applied to). This is where the operator does deep work on an individual client.
- **Priority:** P0
- **Sprint:** Sprint 2
- **Definition of Done:**
  1. The page header shows client name, avatar, plan badge, status badge, email, phone, and LinkedIn URL. A "Back to Clients" breadcrumb link is visible.
  2. Four tabs are present and switchable without page reload: Overview, Documents, Activity, Applications.
  3. The Overview tab displays: a bio/summary section, coaching start date, plan details, total sessions completed, and a freeform "Operator Notes" textarea that is editable and retains its content during the session.
  4. The Activity tab shows a vertical timeline with at least 8 entries mixing different types (session completed, resume updated, application submitted, interview scheduled, message sent) with timestamps, each styled with a distinct icon or color per type.
  5. The Applications tab shows a mini-table of jobs applied to with columns: Company, Role, Date Applied, Status (Applied/Interviewing/Offer/Rejected), and each status is color-coded.

### Feature 5: Client Onboarding Flow
- **Description:** A multi-step wizard for adding a new client. Steps: (1) Basic Info (name, email, phone, LinkedIn), (2) Select Plan & Pricing, (3) Intake Questionnaire (career goals, target roles, experience level), (4) Review & Confirm. Each step validates inputs before allowing progression. On completion, the client appears in the client list.
- **Priority:** P1
- **Sprint:** Sprint 2
- **Definition of Done:**
  1. A prominent "Add Client" button on the Client List page opens the wizard as a modal or full-page flow.
  2. The wizard shows a step indicator (1/4, 2/4, etc.) with visual progress. Back/Next buttons work correctly; Next is disabled until required fields are filled.
  3. Step 1 validates that Name and Email are non-empty and Email matches a basic email pattern. An inline error message appears for invalid fields.
  4. Step 2 presents three plan cards (Basic $150/mo, Pro $300/mo, Premium $500/mo) with feature lists; exactly one must be selected to proceed.
  5. On completing Step 4 (Review), a success confirmation appears and the new client is added to the Client List table with correct data, visible without a page refresh of the entire app.

### Feature 6: Pipeline / Kanban Board
- **Description:** A visual kanban board showing client application pipelines. Columns represent stages: "Preparing", "Applied", "Screening", "Interviewing", "Offer", "Closed". Each card shows the client name, target company/role, and days in current stage. Cards are draggable between columns. Operators use this to track where all their clients' job applications stand at a glance.
- **Priority:** P0
- **Sprint:** Sprint 2
- **Definition of Done:**
  1. Six columns are rendered with headers: Preparing, Applied, Screening, Interviewing, Offer, Closed. Each column displays a count of cards it contains.
  2. At least 12 cards are distributed across columns. Each card shows: client name, company name, job title, and "X days" badge indicating time in current stage.
  3. Cards can be dragged from one column to another, and the card count in each column header updates accordingly.
  4. Cards in the "Interviewing" and "Offer" columns have a distinct visual treatment (e.g., highlighted border or background) to draw attention to high-priority items.
  5. Clicking a card opens a detail popover or panel showing additional info: application date, source (LinkedIn/Company Site/Referral), notes field, and a link to the client profile.

### Feature 7: Calendar & Scheduling
- **Description:** A weekly calendar view showing all scheduled coaching sessions, follow-ups, and deadlines. Supports day/week/month toggle views. Sessions are color-coded by type (coaching call, resume review, mock interview). Clicking an empty time slot opens a quick-add form. Clicking an existing event shows details and allows editing.
- **Priority:** P1
- **Sprint:** Sprint 2
- **Definition of Done:**
  1. The default view is a weekly calendar grid showing 7 days with hourly rows from 8 AM to 7 PM. Day/Week/Month toggle buttons are present and functional.
  2. At least 10 pre-populated events are shown across the week, color-coded by type: blue for coaching calls, green for resume reviews, orange for mock interviews, gray for internal/admin blocks.
  3. Clicking an empty time slot opens a form to create a new event with fields: Client (dropdown of client names), Type (dropdown), Date, Start Time, End Time, and Notes. Submitting adds the event to the calendar visually.
  4. Clicking an existing event opens a detail panel showing all event info, with an "Edit" button that makes fields editable and a "Delete" button that removes the event from the calendar.
  5. A "Today" button exists that scrolls/navigates the view to the current date and highlights today's column.

### Feature 8: Document Manager
- **Description:** A file-management interface for client documents (resumes, cover letters, interview prep sheets). Organized by client with folder-like navigation. Shows document name, type, last modified date, and version number. Supports document preview in a side panel. Operators need this because they handle 50-100+ documents across all clients.
- **Priority:** P1
- **Sprint:** Sprint 2
- **Definition of Done:**
  1. A left panel shows a tree/list of clients as "folders." Clicking a client shows their documents in the main area.
  2. Documents are listed with columns: Name, Type (Resume/Cover Letter/Prep Sheet/Other with icon), Last Modified (date), Version (e.g., "v3"). At least 3 clients have 2-4 documents each.
  3. Clicking a document shows a preview panel on the right side with mock document content (formatted text representing a resume or cover letter -- not an image or PDF, but styled HTML that looks like a document).
  4. A "New Document" button allows creating a document by selecting a client and document type, entering a name, and confirming. The new document appears in the list.
  5. Each document row has a version badge, and hovering or clicking a "history" icon shows a dropdown of previous versions with dates (e.g., "v1 - Mar 15", "v2 - Mar 20").

### Feature 9: AI Resume Tailor Tool
- **Description:** An interactive tool where the operator pastes a job description on one side and selects a client's resume on the other. Clicking "Tailor" triggers a simulated AI analysis that highlights matching skills, suggests bullet point rewrites, and gives an overall match score. This is the core AI-powered feature that differentiates JobAgent from a generic CRM.
- **Priority:** P0
- **Sprint:** Sprint 3
- **Definition of Done:**
  1. A split-panel layout shows "Job Description" on the left (textarea, paste-able) and "Client Resume" on the right (dropdown to select client + their resume, then displays resume content).
  2. A "Tailor Resume" button is prominent between the panels. Clicking it triggers a loading animation (at least 1.5 seconds to simulate AI processing).
  3. After loading, results appear: (a) an overall match score (0-100%) displayed as a circular progress gauge, (b) a "Matching Skills" section listing 4-6 skills found in both the JD and resume with green checkmarks, (c) a "Missing Skills" section listing 2-3 skills from the JD not found in the resume with red X marks.
  4. A "Suggested Rewrites" section shows at least 3 resume bullet points with "Before" (original) and "After" (improved) versions. Each has an "Apply" button that replaces the Before text with the After text in the resume display.
  5. The match score, matching skills, and suggestions are generated from realistic mock data that is contextually appropriate to the job description and resume shown (not random or clearly mismatched).

### Feature 10: AI Interview Prep Generator
- **Description:** An interface where the operator selects a client and a target role/company, then generates a simulated set of interview questions with model answers, behavioral prompts, and company-specific talking points. Results can be "sent" to the client (simulated). This saves operators 30-60 minutes of manual prep per interview.
- **Priority:** P1
- **Sprint:** Sprint 3
- **Definition of Done:**
  1. The interface has input fields: Client (dropdown), Company Name (text input), Role Title (text input), Interview Type (dropdown: Phone Screen / Technical / Behavioral / Final Round).
  2. A "Generate Prep Kit" button triggers generation with a loading state. Results appear organized in collapsible sections.
  3. Results include at least: (a) 5 role-specific interview questions with model answers, (b) 3 behavioral/STAR-format questions with framework answers, (c) a "Company Research" blurb with 3-4 bullet points about the company (realistic mock data).
  4. Each question/answer pair has an "Edit" capability allowing the operator to modify the suggested answer text inline.
  5. A "Send to Client" button exists that, when clicked, shows a confirmation toast/notification saying "Prep kit sent to [client name] via email" and the button changes to "Sent" with a checkmark.

### Feature 11: Revenue & Billing Dashboard
- **Description:** A financial overview showing monthly recurring revenue (MRR), revenue by plan tier, outstanding invoices, and payment history. Includes a revenue chart showing the last 6 months trend. An invoice table lists all invoices with status (paid/pending/overdue). This gives operators financial clarity without needing a separate accounting tool.
- **Priority:** P1
- **Sprint:** Sprint 3
- **Definition of Done:**
  1. Top metric cards show: MRR (e.g., "$12,450"), Total Clients by Plan (breakdown), Outstanding Balance (e.g., "$1,800"), and Collection Rate (e.g., "94%").
  2. A bar or line chart visualizes monthly revenue for the past 6 months with labeled axes and data points. Revenue should show a realistic growth trend (not flat or wildly erratic).
  3. An invoice table lists at least 10 invoices with columns: Invoice # (e.g., "INV-2026-042"), Client Name, Amount, Due Date, Status (Paid with green badge / Pending with yellow / Overdue with red). Table is sortable by at least Due Date and Status.
  4. Clicking an invoice row expands or opens a detail view showing: line items (plan name, period), payment method on file, and payment date (if paid).
  5. An "Overdue" filter highlights or isolates overdue invoices, and each overdue row has a "Send Reminder" button that shows a toast notification "Reminder sent to [client]" when clicked.

### Feature 12: Messaging / Communication Center
- **Description:** An internal messaging interface where the operator can view and send messages to clients. Organized as a conversation list on the left (like iMessage/Slack DMs) with the active conversation on the right. Supports quick-reply templates for common messages (e.g., "Session reminder", "Resume ready for review"). All messages are mock data with realistic timestamps.
- **Priority:** P1
- **Sprint:** Sprint 3
- **Definition of Done:**
  1. Left panel shows a conversation list with at least 8 clients, each showing client name, avatar, last message preview (truncated), timestamp, and an unread indicator (blue dot) for 2-3 conversations.
  2. Clicking a conversation loads the message thread in the right panel with alternating bubbles (operator messages right-aligned in a brand color, client messages left-aligned in gray). At least 6 messages per conversation.
  3. A text input at the bottom of the conversation panel allows typing a new message. Pressing Enter or clicking Send adds the message to the thread immediately, right-aligned, with a "just now" timestamp.
  4. A "Templates" button near the input opens a dropdown of at least 4 pre-written message templates (e.g., "Hi [name], just a reminder about our session tomorrow at [time]."). Clicking a template inserts its text into the input field with [name] replaced by the client's actual name.
  5. The conversation list re-sorts to show the most recently messaged client at the top after sending a message.

### Feature 13: Analytics & Reports
- **Description:** A data visualization page showing business performance metrics: client success rates (interviews per application, offer rates), operator workload (sessions per week trend), client retention (average engagement duration), and pipeline velocity (average days per stage). Uses charts and graphs to make patterns visible at a glance.
- **Priority:** P2
- **Sprint:** Sprint 3
- **Definition of Done:**
  1. At least 4 distinct charts are displayed: (a) a line chart for "Sessions Per Week" over 8 weeks, (b) a donut/pie chart for "Client Status Distribution" (active/paused/completed), (c) a bar chart for "Applications by Stage" matching pipeline columns, (d) a horizontal bar chart for "Average Days Per Pipeline Stage."
  2. Each chart has a clear title, legend (if applicable), and labeled axes. Data is realistic and internally consistent (e.g., the pipeline stage counts in the bar chart should roughly match the kanban board card counts).
  3. A "Client Success Metrics" summary card shows: Interview Rate (interviews / applications as percentage), Offer Rate, Average Time to First Interview, and Average Engagement Duration. All values are realistic.
  4. A date range selector (e.g., "Last 30 Days", "Last 90 Days", "This Year") is present and clicking different options changes at least one chart's data visibly.
  5. Charts render using pure HTML/CSS/JS (canvas-based or SVG-based drawing, or a lightweight library like Chart.js included via CDN) -- no broken or placeholder chart areas.

### Feature 14: Notification Center
- **Description:** A slide-out panel triggered by clicking the notification bell in the header. Shows a chronological list of notifications grouped by "Today", "Yesterday", and "Earlier." Notification types include: new client messages, upcoming sessions, overdue invoices, client milestone alerts (e.g., "client got an interview"), and system notifications. Each can be marked as read.
- **Priority:** P2
- **Sprint:** Sprint 3
- **Definition of Done:**
  1. Clicking the bell icon in the header opens a slide-out panel from the right (or a dropdown) with a "Notifications" header and a "Mark all as read" link.
  2. Notifications are grouped under "Today", "Yesterday", and "Earlier" headings. At least 12 notifications total across groups.
  3. Each notification shows: an icon indicating type (message, calendar, money, celebration), a description (e.g., "James Park has an interview at Google on Friday"), a relative timestamp ("2 hours ago"), and unread notifications have a blue dot or highlighted background.
  4. Clicking a notification marks it as read (visual change: dot disappears, background normalizes) and the bell badge count in the header decrements.
  5. Clicking "Mark all as read" clears all unread indicators and sets the bell badge count to 0.

### Feature 15: Global Search
- **Description:** A search bar in the header that searches across all entities: clients, documents, calendar events, and pipeline cards. Results appear in a dropdown organized by category. This is the operator's fastest path to finding anything. Think Spotlight/Cmd+K.
- **Priority:** P2
- **Sprint:** Sprint 4
- **Definition of Done:**
  1. Clicking the search bar or pressing Ctrl/Cmd+K focuses the search input with an expanded overlay/dropdown area below it.
  2. Typing at least 2 characters triggers results grouped by category: "Clients", "Documents", "Events", "Applications." Each result shows relevant context (e.g., for a client: name + plan; for a document: name + client it belongs to).
  3. At least 3 categories return results for a common search term (e.g., searching "James" returns the client James Park, his resume document, and his upcoming coaching session).
  4. Clicking a search result navigates to the relevant page/view (client profile, document manager with document selected, calendar with event highlighted).
  5. Pressing Escape or clicking outside the dropdown closes the search overlay and clears the input.

### Feature 16: Settings & Operator Profile
- **Description:** A settings page where the operator can edit their business profile (name, business name, email, avatar placeholder), configure default session duration, set working hours, manage plan/pricing templates, and toggle notification preferences. This is the back-office configuration screen.
- **Priority:** P2
- **Sprint:** Sprint 4
- **Definition of Done:**
  1. A "Profile" section shows editable fields: Operator Name, Business Name, Email, Phone, and a placeholder avatar with an "Upload" button (upload simulated -- clicking shows a file-selected toast but uses a default image).
  2. A "Business Settings" section allows setting: Default Session Duration (dropdown: 30/45/60 min), Working Hours (start time and end time dropdowns), and Time Zone (dropdown).
  3. A "Plans & Pricing" section shows the three plan tiers as editable cards. The operator can change the price for each plan, and clicking "Save" shows a success toast.
  4. A "Notifications" section has toggle switches for: Email notifications, Session reminders, Payment alerts, Client activity alerts. Toggles visually switch on/off.
  5. All changes trigger a "Save Settings" confirmation toast when the Save button is clicked, and the changed values persist in the UI during the current session.

### Feature 17: Quick Actions Bar
- **Description:** A floating action button (FAB) or a persistent quick-actions toolbar at the bottom-right of the screen. Provides one-click access to the most common operator actions: Add Client, Schedule Session, Create Document, and Send Message. Expands into a radial or vertical menu on hover/click.
- **Priority:** P2
- **Sprint:** Sprint 4
- **Definition of Done:**
  1. A circular FAB with a "+" icon is fixed to the bottom-right corner of the viewport, visible on all pages.
  2. Clicking or hovering the FAB expands to show 4 action buttons with labels: "Add Client", "Schedule Session", "New Document", "Send Message." The expansion is animated (scale, fade, or slide).
  3. Clicking "Add Client" opens the onboarding wizard (Feature 5). Clicking "Schedule Session" opens the calendar with the quick-add form (Feature 7). Each action routes to the correct feature.
  4. The FAB collapses back when clicking outside it or pressing Escape.
  5. On mobile viewports (below 768px), the FAB remains accessible and the expanded actions don't overflow the screen.

### Feature 18: Client Health Score
- **Description:** An automated "health score" for each client (0-100) calculated from engagement signals: days since last session, resume freshness, application activity, response rate. Displayed as a colored bar on the client list and client profile. Alerts the operator when clients drop below a threshold. This helps operators proactively prevent client churn.
- **Priority:** P2
- **Sprint:** Sprint 4
- **Definition of Done:**
  1. Each client row in the Client List table includes a "Health" column showing a score (0-100) with a colored indicator: green (70-100), yellow (40-69), red (0-39).
  2. The Client Detail page shows the health score prominently with a breakdown: 4 contributing factors (e.g., "Last Session: 3 days ago (+25)", "Resume Updated: 1 week ago (+20)", "Active Applications: 4 (+30)", "Response Rate: 85% (+15)").
  3. On the Dashboard Home (Feature 2), the "Needs Attention" list prioritizes clients with health scores below 40, and their score is visible.
  4. At least 2 clients in the mock data have "red" health scores, at least 5 have "green", and the rest are "yellow" -- reflecting a realistic distribution.
  5. Hovering over the health score bar on the Client List shows a tooltip with the numeric score and primary concern (e.g., "Score: 35 -- No session in 21 days").

---

## 4. Design Direction

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Deep Indigo | `#4F46E5` | Navigation active states, primary buttons, links, accent borders |
| Primary Hover | Darker Indigo | `#4338CA` | Button hover states |
| Secondary | Warm Amber | `#F59E0B` | Warnings, attention badges, premium plan highlights |
| Success | Emerald | `#10B981` | Active status, paid invoices, health score green, positive trends |
| Danger | Rose | `#EF4444` | Overdue invoices, red health scores, error states, delete actions |
| Neutral Dark | Slate 900 | `#0F172A` | Headings, primary text |
| Neutral Medium | Slate 500 | `#64748B` | Secondary text, labels, timestamps |
| Neutral Light | Slate 100 | `#F1F5F9` | Page background, card backgrounds |
| Surface | White | `#FFFFFF` | Card surfaces, content panels, modals |
| Border | Slate 200 | `#E2E8F0` | Dividers, table borders, card borders |

### Typography
- **Headings:** Inter (or system sans-serif fallback), semibold weight (600)
- **Body:** Inter, regular weight (400), 14px base size
- **Monospace (data):** JetBrains Mono or `monospace` fallback for invoice numbers, IDs
- Load Inter from Google Fonts CDN

### Layout Structure
- **Left Sidebar:** 260px expanded, 64px collapsed. Fixed position. Contains: operator logo/name at top, navigation items with icons, collapse toggle at bottom.
- **Top Header Bar:** 64px height. Fixed position. Contains: breadcrumb/page title on left, global search bar centered, notification bell + operator avatar on right.
- **Main Content Area:** Fills remaining space. Max-width 1400px with auto margins for very wide screens. Internal padding of 24px.
- **Content Pattern:** Most pages use a cards-based layout. Metric cards in rows of 4 (responsive to 2 per row on tablet, 1 on mobile). Data tables span full width. Detail pages use a 2/3 + 1/3 column split.

### Visual Inspiration
- **Feels like:** Linear meets Notion -- clean, minimal, purposeful. Every element earns its place.
- **Card style:** Subtle shadows (`box-shadow: 0 1px 3px rgba(0,0,0,0.08)`), 8px border-radius, no harsh borders.
- **Whitespace:** Generous. 24px gaps between cards, 16px internal padding. The dashboard should feel spacious, not cramped.
- **Data presentation:** Emphasize clarity over decoration. Numbers are large (24-32px) and bold. Labels are small (12px) and muted. Trend arrows are subtle but color-coded.
- **Interactions:** Smooth transitions (150-200ms) on hover states, panel opens, tab switches. No jarring instant changes. Buttons have hover state changes (slight darken + subtle transform scale).
- **Empty states:** If any list/table has no data, show a centered illustration placeholder with a helpful message and a CTA button, not just blank space.

---

## 5. Technical Constraints

### Stack
- **HTML5 / CSS3 / Vanilla JavaScript** only. No React, Vue, Angular, or any framework.
- **No build tools.** No npm, webpack, vite, or compilation steps. The project must work by opening `index.html` directly in a browser.
- **CSS approach:** A single `styles.css` file or a few logically split CSS files. CSS custom properties (variables) for the color palette. Flexbox and Grid for layout. No CSS preprocessors (no Sass/Less).
- **JavaScript approach:** A single `app.js` or a few logically split JS files using ES6+ module patterns (IIFE or module pattern -- avoid `import/export` that requires a server). All state management in-memory using plain objects/arrays.
- **External dependencies allowed:** Google Fonts (Inter) via CDN. Optionally Chart.js via CDN for the analytics charts. No other libraries.

### Mock Data
- All data must be realistic and internally consistent. Client names should be diverse and real-sounding (not "Client 1" or "John Doe"). Companies should be real companies (Google, Stripe, Airbnb, etc.). Job titles should be specific (not just "Engineer" but "Senior Product Designer" or "Staff Software Engineer").
- Mock data should be defined in a separate `data.js` file as JavaScript objects/arrays, not hardcoded in HTML.
- At least 15 clients, 12 pipeline cards, 10 calendar events, 10 invoices, 8 conversations.
- Dates should be relative to the current viewing session (use JS Date calculations), not hardcoded absolute dates that will look stale.

### Interaction Requirements
- All buttons must do something visible when clicked (navigate, open modal, show toast, update data). No dead buttons.
- All form submissions must validate required fields and show inline error messages for invalid input.
- Drag-and-drop on the kanban board must function (use native HTML5 drag and drop API).
- Tab switches, sidebar navigation, and modal open/close must work without page reload.
- Toast notifications should auto-dismiss after 3 seconds with a fade-out animation.
- Data changes (adding a client, moving a kanban card, sending a message) should be reflected immediately in all relevant views during the current session.

### File Structure
```
operator-dashboard/
  index.html          -- Main entry point, contains the app shell
  styles.css          -- All styles
  app.js              -- Main application logic, routing, state management
  data.js             -- All mock data definitions
  components/         -- Optional: separate JS files per feature/component
    dashboard.js
    clients.js
    pipeline.js
    calendar.js
    documents.js
    ai-tools.js
    revenue.js
    messaging.js
    analytics.js
    settings.js
    notifications.js
    search.js
```

### Browser Support
- Must work in latest Chrome and Safari. Firefox compatibility is nice-to-have.
- No IE11 support needed.
