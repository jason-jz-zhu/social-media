"""Full App Evaluator — Playwright browser testing for Run D (all sprints)"""
import json, os
from playwright.sync_api import sync_playwright

APP_DIR = os.path.join(os.path.dirname(__file__), "app")
HTML_PATH = f"file://{os.path.abspath(os.path.join(APP_DIR, 'index.html'))}"
SS_DIR = os.path.join(os.path.dirname(__file__), "screenshots_full")
os.makedirs(SS_DIR, exist_ok=True)

results = []
def log(feat, crit, status, detail=""):
    results.append({"feature": feat, "criterion": crit, "status": status, "detail": detail})
    icon = {"PASS":"✅","FAIL":"❌","PARTIAL":"⚠️"}[status]
    print(f"  {icon} [{status}] {crit}: {detail}")

def ss(page, name):
    page.screenshot(path=os.path.join(SS_DIR, f"{name}.png"))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # Capture JS errors
    js_errors = []
    page.on("console", lambda m: js_errors.append(m.text) if m.type == "error" else None)

    page.goto(HTML_PATH)
    page.wait_for_load_state("networkidle")
    ss(page, "00_initial")

    print("\n=== FULL APP EVALUATION ===\n")

    # ---- SPRINT 1 ----
    print("--- SPRINT 1: Core Shell ---")

    # Sidebar
    sidebar = page.locator(".sidebar").first
    log("S1", "Sidebar exists", "PASS" if sidebar.is_visible() else "FAIL")

    # Navigation — click through all nav items
    nav_items = page.locator(".nav-item").all()
    nav_count = len(nav_items)
    log("S1", f"Nav items ({nav_count})", "PASS" if nav_count >= 6 else "FAIL", f"found {nav_count}")

    working_pages = []
    for item in nav_items:
        try:
            text = item.locator(".nav-item-text").text_content().strip()
            item.click()
            page.wait_for_timeout(300)
            working_pages.append(text)
        except:
            pass
    log("S1", f"Navigable pages", "PASS" if len(working_pages) >= 6 else "PARTIAL", ", ".join(working_pages))

    # Dashboard
    page.locator(".nav-item[data-view='dashboard']").first.click()
    page.wait_for_timeout(300)
    ss(page, "01_dashboard")
    cards = page.locator(".stat-card, .metric-card, .kpi-card, [class*='stat']").all()
    log("S1", f"Dashboard metric cards ({len(cards)})", "PASS" if len(cards) >= 3 else "FAIL")

    # Client list
    page.locator(".nav-item[data-view='clients']").first.click()
    page.wait_for_timeout(300)
    ss(page, "02_clients")
    rows = page.locator("tr, .client-row").all()
    log("S1", f"Client rows ({len(rows)})", "PASS" if len(rows) >= 5 else "FAIL")

    # Search
    search = page.locator("input[placeholder*='earch'], input[type='search']").first
    if search.is_visible():
        search.fill("sarah")
        page.wait_for_timeout(500)
        ss(page, "03_search_sarah")
        search.fill("")
        page.wait_for_timeout(300)
        log("S1", "Client search", "PASS")
    else:
        log("S1", "Client search", "FAIL", "No search input")

    # ---- SPRINT 2 ----
    print("\n--- SPRINT 2: Main Features ---")

    # Client detail — click a client row
    first_row = page.locator("tr.client-row, tr[data-client-id], tbody tr").first
    if first_row.is_visible():
        first_row.click()
        page.wait_for_timeout(500)
        ss(page, "04_client_detail")
        # Check if detail view/modal appeared
        detail = page.locator("[class*='detail'], [class*='modal'], [class*='client-detail']").first
        log("S2", "Client detail opens", "PASS" if detail.is_visible() else "FAIL")
        # Try to close it
        close = page.locator("[class*='close'], button:has-text('×'), button:has-text('Close'), .modal-close").first
        if close.is_visible():
            close.click()
            page.wait_for_timeout(300)
    else:
        log("S2", "Client detail", "FAIL", "No clickable client row")

    # Pipeline/Kanban
    pipeline_nav = page.locator("[data-view='pipeline']").first
    if pipeline_nav.is_visible():
        pipeline_nav.click()
        page.wait_for_timeout(500)
        ss(page, "05_pipeline")
        columns = page.locator("[class*='column'], [class*='kanban-col'], .pipeline-column").all()
        log("S2", f"Pipeline columns ({len(columns)})", "PASS" if len(columns) >= 3 else "FAIL")
        cards = page.locator("[class*='pipeline-card'], [class*='kanban-card'], .card[draggable]").all()
        log("S2", f"Pipeline cards ({len(cards)})", "PASS" if len(cards) >= 5 else "FAIL")
    else:
        log("S2", "Pipeline page", "FAIL", "No pipeline nav")

    # Calendar
    cal_nav = page.locator("[data-view='calendar']").first
    if cal_nav.is_visible():
        cal_nav.click()
        page.wait_for_timeout(500)
        ss(page, "06_calendar")
        events = page.locator("[class*='event'], [class*='calendar-event']").all()
        log("S2", f"Calendar events ({len(events)})", "PASS" if len(events) >= 3 else "PARTIAL", f"found {len(events)}")
    else:
        log("S2", "Calendar page", "FAIL", "No calendar nav")

    # Documents
    doc_nav = page.locator("[data-view='documents']").first
    if doc_nav.is_visible():
        doc_nav.click()
        page.wait_for_timeout(500)
        ss(page, "07_documents")
        docs = page.locator("[class*='doc-row'], [class*='document-item'], tr").all()
        log("S2", f"Document items ({len(docs)})", "PASS" if len(docs) >= 3 else "PARTIAL")
    else:
        log("S2", "Documents page", "FAIL", "No documents nav")

    # ---- SPRINT 3 ----
    print("\n--- SPRINT 3: Advanced Features ---")

    # AI Tools
    ai_nav = page.locator("[data-view='ai-tools']").first
    if ai_nav.is_visible():
        ai_nav.click()
        page.wait_for_timeout(500)
        ss(page, "08_ai_tools")
        log("S3", "AI Tools page loads", "PASS")
    else:
        log("S3", "AI Tools page", "FAIL", "No AI nav")

    # Revenue
    rev_nav = page.locator("[data-view='revenue'], [data-view='invoices']").first
    if rev_nav.is_visible():
        rev_nav.click()
        page.wait_for_timeout(500)
        ss(page, "09_revenue")
        log("S3", "Revenue page loads", "PASS")
    else:
        log("S3", "Revenue page", "PARTIAL", "No revenue nav found")

    # Messaging
    msg_nav = page.locator("[data-view='messaging'], [data-view='messages']").first
    if msg_nav.is_visible():
        msg_nav.click()
        page.wait_for_timeout(500)
        ss(page, "10_messaging")
        convos = page.locator("[class*='conversation'], [class*='chat-item'], [class*='message-item']").all()
        log("S3", f"Messaging conversations ({len(convos)})", "PASS" if len(convos) >= 3 else "PARTIAL")
    else:
        log("S3", "Messaging page", "PARTIAL", "No messaging nav")

    # Analytics
    analytics_nav = page.locator("[data-view='analytics']").first
    if analytics_nav.is_visible():
        analytics_nav.click()
        page.wait_for_timeout(500)
        ss(page, "11_analytics")
        charts = page.locator("[class*='chart'], svg, canvas").all()
        log("S3", f"Analytics charts ({len(charts)})", "PASS" if len(charts) >= 2 else "PARTIAL")
    else:
        log("S3", "Analytics page", "PARTIAL", "No analytics nav")

    # Notifications
    notif_btn = page.locator("[class*='notif'], [class*='bell'], button:has-text('🔔')").first
    if notif_btn.is_visible():
        notif_btn.click()
        page.wait_for_timeout(500)
        ss(page, "12_notifications")
        log("S3", "Notification panel opens", "PASS")
        # Close notification panel before continuing
        page.wait_for_timeout(300)
        # Try clicking overlay to close
        overlay = page.locator("#notif-overlay, .notif-overlay").first
        if overlay.is_visible():
            overlay.click(force=True)
            page.wait_for_timeout(300)
        # If still active, force remove
        page.evaluate("document.querySelector('.notif-overlay')?.classList.remove('active'); document.querySelector('.notif-panel')?.classList.remove('active');")
        page.wait_for_timeout(300)
    else:
        log("S3", "Notification panel", "PARTIAL", "No notification button found")

    # ---- SPRINT 4 ----
    print("\n--- SPRINT 4: Polish ---")

    # Global search (Ctrl+K or search bar)
    page.keyboard.press("Control+k")
    page.wait_for_timeout(500)
    search_modal = page.locator("[class*='search-modal'], [class*='command-palette'], [class*='global-search']").first
    if search_modal.is_visible():
        ss(page, "13_global_search")
        log("S4", "Global search (Ctrl+K)", "PASS")
        page.keyboard.press("Escape")
        page.wait_for_timeout(300)
    else:
        log("S4", "Global search", "PARTIAL", "Ctrl+K didn't open search modal")

    # Settings
    settings_nav = page.locator("[data-view='settings']").first
    if settings_nav.is_visible():
        settings_nav.click()
        page.wait_for_timeout(500)
        ss(page, "14_settings")
        log("S4", "Settings page loads", "PASS")
    else:
        log("S4", "Settings page", "FAIL", "No settings nav")

    # FAB
    fab = page.locator("[class*='fab'], .quick-actions, button[class*='float']").first
    if fab.is_visible():
        fab.click()
        page.wait_for_timeout(300)
        ss(page, "15_fab")
        log("S4", "FAB quick actions", "PASS")
    else:
        log("S4", "FAB", "PARTIAL", "No FAB button found")

    # ---- JS ERRORS ----
    print("\n--- Code Quality ---")
    # Navigate through all pages to trigger any JS errors
    page.goto(HTML_PATH)
    page.wait_for_load_state("networkidle")
    for item in page.locator(".nav-item").all():
        try:
            item.click()
            page.wait_for_timeout(200)
        except:
            pass

    if len(js_errors) == 0:
        log("Quality", "No JS console errors", "PASS")
    else:
        unique_errors = list(set(js_errors))[:5]
        log("Quality", f"JS errors ({len(js_errors)})", "FAIL", "; ".join(unique_errors))

    # Final full-page screenshot
    page.locator(".nav-item[data-view='dashboard']").first.click()
    page.wait_for_timeout(500)
    ss(page, "99_final_dashboard")

    browser.close()

# Summary
print(f"\n{'='*50}")
print(f"FULL EVALUATION SUMMARY")
print(f"{'='*50}")
total = len(results)
passed = sum(1 for r in results if r["status"] == "PASS")
failed = sum(1 for r in results if r["status"] == "FAIL")
partial = sum(1 for r in results if r["status"] == "PARTIAL")
print(f"Total criteria: {total}")
print(f"  PASS:    {passed}")
print(f"  FAIL:    {failed}")
print(f"  PARTIAL: {partial}")
print(f"  Score:   {passed}/{total} ({100*passed//total}%)")

report = {"summary": {"total": total, "pass": passed, "fail": failed, "partial": partial, "score_pct": 100*passed//total}, "results": results, "js_errors": js_errors}
with open(os.path.join(os.path.dirname(__file__), "full_eval.json"), "w") as f:
    json.dump(report, f, indent=2)
print(f"\nReport: full_eval.json")
print(f"Screenshots: {SS_DIR}/")
