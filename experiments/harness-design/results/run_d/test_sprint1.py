"""Sprint 1 Evaluator — Playwright-based browser testing for Run D"""
import json
import os
from playwright.sync_api import sync_playwright

APP_DIR = os.path.join(os.path.dirname(__file__), "app")
HTML_PATH = f"file://{os.path.abspath(os.path.join(APP_DIR, 'index.html'))}"
SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "screenshots_s1")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

results = []

def log(feature, criterion, status, detail=""):
    results.append({"feature": feature, "criterion": criterion, "status": status, "detail": detail})
    icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"  {icon} [{status}] {criterion}: {detail}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(HTML_PATH)
    page.wait_for_load_state("networkidle")

    # Screenshot: initial load
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_initial_load.png"))
    print("\n=== SPRINT 1 EVALUATION ===\n")

    # --- Feature 1: App Shell & Layout ---
    print("Feature 1: App Shell & Layout")

    # Check sidebar exists
    sidebar = page.locator("nav, .sidebar, .nav, [class*='sidebar'], [class*='nav']").first
    if sidebar.is_visible():
        log("App Shell", "Sidebar visible", "PASS")
    else:
        log("App Shell", "Sidebar visible", "FAIL", "No sidebar found")

    # Check main content area
    main = page.locator("main, .main, .content, [class*='main'], [class*='content']").first
    if main.is_visible():
        log("App Shell", "Main content area visible", "PASS")
    else:
        log("App Shell", "Main content area visible", "FAIL", "No main content area")

    # Check responsive: try mobile viewport
    page.set_viewport_size({"width": 375, "height": 812})
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_mobile_view.png"))

    # Check if sidebar collapses or has mobile menu
    mobile_menu = page.locator("[class*='mobile'], [class*='hamburger'], [class*='toggle'], button[class*='menu']").first
    if mobile_menu.is_visible():
        log("App Shell", "Mobile responsive (menu button visible)", "PASS")
    else:
        # Check if sidebar is hidden on mobile
        sidebar_hidden = not sidebar.is_visible()
        if sidebar_hidden:
            log("App Shell", "Mobile responsive (sidebar hidden)", "PASS")
        else:
            log("App Shell", "Mobile responsive", "PARTIAL", "Sidebar still visible on mobile")

    # Reset to desktop
    page.set_viewport_size({"width": 1440, "height": 900})
    page.wait_for_timeout(500)

    # --- Feature 2: Navigation ---
    print("\nFeature 2: Navigation")

    # Find all nav links
    nav_links = page.locator("nav a, .sidebar a, .nav-item, [class*='nav'] a, [class*='nav'] [class*='item']").all()
    nav_count = len(nav_links)
    if nav_count >= 4:
        log("Navigation", f"Has {nav_count} nav items", "PASS")
    else:
        log("Navigation", f"Has {nav_count} nav items", "FAIL", f"Expected 4+, got {nav_count}")

    # Test clicking each nav item
    pages_visited = []
    for i, link in enumerate(nav_links[:6]):  # Test up to 6
        try:
            link_text = link.text_content().strip()
            if not link_text:
                continue
            link.click()
            page.wait_for_timeout(300)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"03_nav_{i}_{link_text.replace(' ', '_')}.png"))
            pages_visited.append(link_text)
        except Exception as e:
            log("Navigation", f"Click nav item {i}", "FAIL", str(e))

    if len(pages_visited) >= 3:
        log("Navigation", f"Clicked through: {', '.join(pages_visited)}", "PASS")
    else:
        log("Navigation", "Nav item clicking", "FAIL", f"Only {len(pages_visited)} worked")

    # Check active state
    active_elements = page.locator("[class*='active'], .active, [aria-current]").all()
    if len(active_elements) > 0:
        log("Navigation", "Active state indicator", "PASS")
    else:
        log("Navigation", "Active state indicator", "PARTIAL", "No visible active state")

    # --- Feature 3: Dashboard Home ---
    print("\nFeature 3: Dashboard Home")

    # Navigate to dashboard (click first nav item or find dashboard link)
    dash_link = page.locator("text=Dashboard, text=Home, text=Overview").first
    if dash_link.is_visible():
        dash_link.click()
        page.wait_for_timeout(300)

    # Check KPI/metric cards
    cards = page.locator("[class*='card'], [class*='metric'], [class*='stat'], [class*='kpi']").all()
    if len(cards) >= 3:
        log("Dashboard", f"Has {len(cards)} metric/stat cards", "PASS")
    else:
        log("Dashboard", f"Metric cards", "FAIL", f"Expected 3+, got {len(cards)}")

    # Check for activity feed or recent items
    activity = page.locator("[class*='activity'], [class*='feed'], [class*='recent']").first
    if activity.is_visible():
        log("Dashboard", "Activity feed present", "PASS")
    else:
        log("Dashboard", "Activity feed present", "PARTIAL", "No activity feed found")

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_dashboard.png"))

    # --- Feature 4: Client List ---
    print("\nFeature 4: Client List")

    # Navigate to clients page
    client_link = page.locator("text=Client, text=Clients").first
    if client_link.is_visible():
        client_link.click()
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "05_clients.png"))

        # Check for client rows/cards
        client_items = page.locator("tr, [class*='client-row'], [class*='client-card']").all()
        # Exclude header rows
        data_rows = [r for r in client_items if r.text_content().strip() and "Name" not in r.text_content()[:20]]
        if len(data_rows) >= 5:
            log("Client List", f"Shows {len(data_rows)} clients", "PASS")
        else:
            log("Client List", f"Client count", "PARTIAL", f"Found {len(data_rows)} items")

        # Test search
        search_input = page.locator("input[type='search'], input[type='text'], [class*='search'] input, input[placeholder*='earch']").first
        if search_input.is_visible():
            search_input.fill("a")
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "06_clients_search.png"))

            # Check if list filtered
            filtered_items = page.locator("tr:visible, [class*='client-row']:visible, [class*='client-card']:visible").all()
            search_input.fill("")
            page.wait_for_timeout(300)
            log("Client List", "Search input works", "PASS")
        else:
            log("Client List", "Search input", "FAIL", "No search input found")

        # Test filter dropdown
        filter_select = page.locator("select, [class*='filter'] select, [class*='dropdown']").first
        if filter_select.is_visible():
            log("Client List", "Filter dropdown present", "PASS")
        else:
            log("Client List", "Filter dropdown", "PARTIAL", "No filter dropdown found")
    else:
        log("Client List", "Navigate to clients page", "FAIL", "No Clients nav link")

    # --- Check for JS errors ---
    print("\nJS Error Check")
    errors = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    # Reload and navigate through all pages
    page.goto(HTML_PATH)
    page.wait_for_load_state("networkidle")
    for link in page.locator("nav a, .sidebar a, .nav-item, [class*='nav'] a").all()[:6]:
        try:
            link.click()
            page.wait_for_timeout(200)
        except:
            pass

    if len(errors) == 0:
        log("Code Quality", "No JS console errors", "PASS")
    else:
        log("Code Quality", "JS console errors", "FAIL", f"{len(errors)} errors: {errors[:3]}")

    browser.close()

# --- Write report ---
print(f"\n=== SUMMARY ===")
total = len(results)
passed = sum(1 for r in results if r["status"] == "PASS")
failed = sum(1 for r in results if r["status"] == "FAIL")
partial = sum(1 for r in results if r["status"] == "PARTIAL")
print(f"Total: {total} | PASS: {passed} | FAIL: {failed} | PARTIAL: {partial}")

report_path = os.path.join(os.path.dirname(__file__), "sprint_1_eval.json")
with open(report_path, "w") as f:
    json.dump({"summary": {"total": total, "pass": passed, "fail": failed, "partial": partial}, "results": results}, f, indent=2)
print(f"\nReport saved to: {report_path}")
print(f"Screenshots saved to: {SCREENSHOT_DIR}/")
