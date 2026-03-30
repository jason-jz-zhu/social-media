// ============================================
// Client Management Dashboard - Sprints 1-4
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Sprint 1
  initNavigation();
  renderDashboard();
  renderClientList();
  initSidebarToggle();
  initMobileMenu();
  initClientSearch();
  initClientFilter();
  // Sprint 2
  initOnboardingWizard();
  renderPipeline();
  renderCalendar();
  renderDocuments();
  initClientDetailTabs();
  // Sprint 3
  initAIResumeTailor();
  initAIInterviewPrep();
  renderRevenue();
  renderMessaging();
  renderAnalytics();
  initNotifications();
  // Sprint 4
  initGlobalSearch();
  renderSettings();
  initFAB();
  initClientHealthScores();
});

// =============================================
// SPRINT 1: Navigation, Dashboard, Client List
// =============================================

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.dataset.view;
      switchView(viewId);
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      updatePageHeader(viewId);
      closeMobileMenu();
    });
  });
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
}

function navigateToView(viewId) {
  switchView(viewId);
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  if (navItem) navItem.classList.add('active');
  updatePageHeader(viewId);
  // Always close notification panel when navigating
  if (typeof closeNotifications === 'function') closeNotifications();
}

function updatePageHeader(viewId) {
  const headers = {
    'dashboard': { title: 'Dashboard', subtitle: 'Welcome back, Alex. Here\'s your overview.' },
    'clients': { title: 'Clients', subtitle: 'Manage your client relationships.' },
    'client-detail': { title: 'Client Profile', subtitle: 'View and manage client details.' },
    'pipeline': { title: 'Pipeline', subtitle: 'Track project progress across stages.' },
    'calendar': { title: 'Calendar', subtitle: 'Your schedule and upcoming sessions.' },
    'documents': { title: 'Documents', subtitle: 'Manage client documents and deliverables.' },
    'ai-resume': { title: 'AI Resume Tailor', subtitle: 'Match resumes to job descriptions.' },
    'ai-interview': { title: 'AI Interview Prep', subtitle: 'Generate interview preparation kits.' },
    'revenue': { title: 'Revenue', subtitle: 'Track billing and financial performance.' },
    'messaging': { title: 'Messages', subtitle: 'Communicate with your clients.' },
    'analytics': { title: 'Analytics', subtitle: 'Business performance insights.' },
    'settings': { title: 'Settings', subtitle: 'Configure your preferences.' }
  };
  const h = headers[viewId] || headers['dashboard'];
  document.getElementById('page-title').textContent = h.title;
  document.getElementById('page-subtitle').textContent = h.subtitle;
}

function initSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = toggle.querySelector('.material-symbols-outlined');
      icon.textContent = sidebar.classList.contains('collapsed') ? 'chevron_right' : 'chevron_left';
    });
  }
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (btn) btn.addEventListener('click', () => { sidebar.classList.add('mobile-open'); overlay.classList.add('active'); });
  if (overlay) overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobile-overlay').classList.remove('active');
}

// ---- Dashboard ----
function renderDashboard() {
  const metricsData = [
    { icon: 'payments', value: formatCurrency(DASHBOARD_METRICS.totalRevenue), label: 'Total Revenue', change: '+12.5%', direction: 'up' },
    { icon: 'group', value: DASHBOARD_METRICS.activeClients, label: 'Active Clients', change: '+2', direction: 'up' },
    { icon: 'receipt_long', value: DASHBOARD_METRICS.pendingInvoices, label: 'Pending Invoices', change: '$16,150', direction: 'down' },
    { icon: 'schedule', value: DASHBOARD_METRICS.hoursThisWeek, label: 'Hours This Week', change: '+4.5h', direction: 'up' }
  ];

  document.getElementById('metrics-grid').innerHTML = metricsData.map(m => `
    <div class="metric-card">
      <div class="metric-icon"><span class="material-symbols-outlined">${m.icon}</span></div>
      <div class="metric-value">${m.value}</div>
      <div class="metric-label">${m.label}</div>
      <div class="metric-change ${m.direction}">
        <span class="material-symbols-outlined" style="font-size:14px">${m.direction === 'up' ? 'trending_up' : 'trending_down'}</span>
        ${m.change}
      </div>
    </div>
  `).join('');

  // Needs Attention list - prioritize low health scores
  const attentionClients = CLIENTS
    .filter(c => c.healthScore !== null)
    .sort((a, b) => (a.healthScore || 100) - (b.healthScore || 100))
    .slice(0, 7);

  const attentionReasons = {
    18: 'No contact in 56 days - at risk of churn',
    22: 'Inactive for 41 days - re-engagement needed',
    32: 'Overdue invoice - follow up required',
    45: 'Resume not updated in 14 days',
    55: 'No session scheduled - book follow-up',
    65: 'Project review pending approval',
    71: 'Integration deliverable due this week'
  };

  document.getElementById('activity-list').innerHTML = attentionClients.map(c => {
    const reason = attentionReasons[c.healthScore] || 'Review needed';
    const scoreColor = c.healthScore >= 70 ? '#16a34a' : c.healthScore >= 40 ? '#f59e0b' : '#dc2626';
    return `
      <li class="activity-item" onclick="openClientDetail(${c.id})">
        <div class="activity-icon" style="background: ${scoreColor}15; color: ${scoreColor}">
          <span class="material-symbols-outlined">${c.healthScore < 40 ? 'warning' : c.healthScore < 70 ? 'info' : 'check_circle'}</span>
        </div>
        <div class="activity-content">
          <div class="activity-message">${c.name}</div>
          <div class="activity-detail">${reason}</div>
        </div>
        <div class="activity-time" style="color:${scoreColor};font-weight:600">${c.healthScore}</div>
      </li>
    `;
  }).join('');

  // Today's schedule
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayEvents = CALENDAR_EVENTS.filter(e => e.date === todayStr || e.date === '2026-03-27');
  const quickStats = document.getElementById('quick-stats');

  if (todayEvents.length === 0) {
    quickStats.innerHTML = '<div style="padding:24px;text-align:center;color:var(--slate-500)">No sessions scheduled for today.</div>';
  } else {
    quickStats.innerHTML = todayEvents.map(e => {
      const typeColors = { coaching: '#4338ca', review: '#16a34a', workshop: '#ea580c', admin: '#64748b' };
      const color = typeColors[e.type] || '#4338ca';
      return `
        <div class="stat-row">
          <div class="stat-row-left">
            <div class="stat-dot" style="background:${color}"></div>
            <div>
              <div class="stat-row-label">${e.title}</div>
              <div style="font-size:12px;color:var(--slate-500)">${e.clientName}</div>
            </div>
          </div>
          <div class="stat-row-value" style="font-size:13px">${e.startTime} - ${e.endTime}</div>
        </div>
      `;
    }).join('');
  }
}

// ---- Client List ----
let currentFilter = 'all';
let currentPlanFilter = 'all';
let currentSearch = '';
let currentSort = { field: null, dir: 'asc' };

function renderClientList() {
  const filtered = getFilteredClients();
  const tbody = document.getElementById('client-tbody');
  const countEl = document.getElementById('client-count');
  countEl.textContent = `${filtered.length} client${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--slate-500)">No clients match your search.</td></tr>`;
    return;
  }

  // Add delegated click handler for client rows (robust for Playwright)
  tbody.onclick = function(e) {
    const row = e.target.closest('tr[data-client-id]');
    if (row) openClientDetail(parseInt(row.dataset.clientId));
  };

  tbody.innerHTML = filtered.map(client => {
    const initials = client.name.split(' ').map(n => n[0]).join('');
    const avatarColors = [
      { bg: '#e0e7ff', fg: '#4338ca' }, { bg: '#fef3c7', fg: '#d97706' },
      { bg: '#dcfce7', fg: '#16a34a' }, { bg: '#ede9fe', fg: '#7c3aed' },
      { bg: '#fee2e2', fg: '#dc2626' }
    ];
    const ac = avatarColors[client.id % avatarColors.length];
    const hs = client.healthScore;
    const hsColor = hs === null ? 'slate' : hs >= 70 ? 'green' : hs >= 40 ? 'yellow' : 'red';
    const hsTooltip = hs === null ? 'N/A' : `Score: ${hs}${hs < 40 ? ' - Needs attention' : hs < 70 ? ' - Monitor closely' : ' - Healthy'}`;

    return `
      <tr class="client-row" data-client-id="${client.id}" style="cursor:pointer" onclick="openClientDetail(${client.id})">
        <td>
          <div class="client-name-cell">
            <div class="client-avatar" style="background:${ac.bg};color:${ac.fg}">${initials}</div>
            <div>
              <div class="client-name">${client.name}</div>
              <div class="client-email">${client.email}</div>
            </div>
          </div>
        </td>
        <td style="color:var(--slate-700)">${client.company}</td>
        <td><span class="plan-badge ${client.plan}">${client.plan}</span></td>
        <td><span class="status-badge ${client.status}">${client.status}</span></td>
        <td>
          ${hs !== null ? `
          <div class="health-bar">
            <div class="health-bar-track"><div class="health-bar-fill ${hsColor}" style="width:${hs}%"></div></div>
            <span class="health-score-text" style="color:var(--${hsColor === 'green' ? 'green-500' : hsColor === 'yellow' ? 'amber-600' : hsColor === 'red' ? 'red-500' : 'slate-500'})">${hs}</span>
            <div class="health-tooltip">${hsTooltip}</div>
          </div>` : '<span style="color:var(--slate-400)">--</span>'}
        </td>
        <td style="font-weight:600;color:var(--slate-800)">${client.projects}</td>
        <td style="color:var(--slate-600)">${formatDate(client.lastContact)}</td>
      </tr>
    `;
  }).join('');
}

function getFilteredClients() {
  let result = CLIENTS.filter(c => {
    const matchesFilter = currentFilter === 'all' || c.status === currentFilter;
    const matchesPlan = currentPlanFilter === 'all' || c.plan === currentPlanFilter;
    const matchesSearch = currentSearch === '' ||
      c.name.toLowerCase().includes(currentSearch) ||
      c.company.toLowerCase().includes(currentSearch);
    return matchesFilter && matchesPlan && matchesSearch;
  });

  if (currentSort.field) {
    result.sort((a, b) => {
      let va, vb;
      if (currentSort.field === 'name') { va = a.name; vb = b.name; }
      else if (currentSort.field === 'lastContact') { va = a.lastContact; vb = b.lastContact; }
      else if (currentSort.field === 'health') { va = a.healthScore || 0; vb = b.healthScore || 0; }
      if (va < vb) return currentSort.dir === 'asc' ? -1 : 1;
      if (va > vb) return currentSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return result;
}

function initClientSearch() {
  document.getElementById('client-search').addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    renderClientList();
  });
}

function initClientFilter() {
  document.getElementById('client-filter').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderClientList();
  });
  document.getElementById('client-plan-filter').addEventListener('change', (e) => {
    currentPlanFilter = e.target.value;
    renderClientList();
  });
  // Sort headers
  document.querySelectorAll('.client-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (currentSort.field === field) {
        currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort = { field, dir: 'asc' };
      }
      document.querySelectorAll('.sort-arrow').forEach(a => a.textContent = '');
      th.querySelector('.sort-arrow').textContent = currentSort.dir === 'asc' ? ' \u25B2' : ' \u25BC';
      renderClientList();
    });
  });
}

// =============================================
// SPRINT 2: Client Detail, Onboarding, Pipeline, Calendar, Documents
// =============================================

// ---- Client Detail ----
function openClientDetail(clientId) {
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) return;

  switchView('client-detail');
  updatePageHeader('client-detail');

  const initials = client.name.split(' ').map(n => n[0]).join('');
  const avatarColors = [
    { bg: '#e0e7ff', fg: '#4338ca' }, { bg: '#fef3c7', fg: '#d97706' },
    { bg: '#dcfce7', fg: '#16a34a' }, { bg: '#ede9fe', fg: '#7c3aed' },
    { bg: '#fee2e2', fg: '#dc2626' }
  ];
  const ac = avatarColors[client.id % avatarColors.length];

  document.getElementById('client-detail-header').innerHTML = `
    <button class="cd-back" onclick="navigateToView('clients')">
      <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span> Back to Clients
    </button>
    <div class="cd-header-top">
      <div class="cd-avatar" style="background:${ac.bg};color:${ac.fg}">${initials}</div>
      <div class="cd-info">
        <h2>${client.name}</h2>
        <div class="cd-badges">
          <span class="plan-badge ${client.plan}">${client.plan}</span>
          <span class="status-badge ${client.status}">${client.status}</span>
          ${client.healthScore !== null ? `<span style="font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;background:${client.healthScore >= 70 ? 'var(--green-100)' : client.healthScore >= 40 ? 'var(--amber-100)' : 'var(--red-100)'};color:${client.healthScore >= 70 ? 'var(--green-500)' : client.healthScore >= 40 ? 'var(--amber-600)' : 'var(--red-500)'}">Health: ${client.healthScore}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="cd-contact">
      <span><span class="material-symbols-outlined">email</span> ${client.email}</span>
      <span><span class="material-symbols-outlined">phone</span> ${client.phone}</span>
      <span><span class="material-symbols-outlined">link</span> ${client.linkedin || 'N/A'}</span>
    </div>
  `;

  renderClientDetailOverview(client);
  renderClientDetailDocuments(client);
  renderClientDetailActivity(client);
  renderClientDetailApplications(client);
}

function renderClientDetailOverview(client) {
  const healthFactors = client.healthScore !== null ? `
    <div style="margin-top:16px">
      <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Health Score Breakdown</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="padding:10px;background:var(--slate-100);border-radius:8px;font-size:13px">
          <span style="color:var(--slate-500)">Last Session</span><br>
          <strong>${Math.floor(Math.random() * 10 + 1)} days ago (+${Math.floor(client.healthScore * 0.25)})</strong>
        </div>
        <div style="padding:10px;background:var(--slate-100);border-radius:8px;font-size:13px">
          <span style="color:var(--slate-500)">Active Projects</span><br>
          <strong>${client.projects} (+${Math.floor(client.healthScore * 0.3)})</strong>
        </div>
        <div style="padding:10px;background:var(--slate-100);border-radius:8px;font-size:13px">
          <span style="color:var(--slate-500)">Response Rate</span><br>
          <strong>${Math.floor(70 + Math.random() * 25)}% (+${Math.floor(client.healthScore * 0.25)})</strong>
        </div>
        <div style="padding:10px;background:var(--slate-100);border-radius:8px;font-size:13px">
          <span style="color:var(--slate-500)">Invoice Status</span><br>
          <strong>Current (+${Math.floor(client.healthScore * 0.2)})</strong>
        </div>
      </div>
    </div>
  ` : '';

  document.getElementById('tab-overview').innerHTML = `
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px">
      <div>
        <div class="panel" style="margin-bottom:20px">
          <div class="panel-header"><h3>About</h3></div>
          <div style="padding:20px;font-size:14px;color:var(--slate-700);line-height:1.7">${client.bio || 'No bio available.'}</div>
        </div>
        <div class="panel">
          <div class="panel-header"><h3>Operator Notes</h3></div>
          <div style="padding:16px">
            <textarea id="client-notes-${client.id}" rows="5" style="width:100%;border:1px solid var(--slate-300);border-radius:10px;padding:12px;font-family:inherit;font-size:14px;resize:vertical" placeholder="Add notes about this client...">${window['clientNotes_' + client.id] || ''}</textarea>
            <button class="btn-primary" style="margin-top:8px" onclick="window['clientNotes_${client.id}']=document.getElementById('client-notes-${client.id}').value;showToast('Notes saved')">Save Notes</button>
          </div>
        </div>
      </div>
      <div>
        <div class="panel">
          <div class="panel-header"><h3>Details</h3></div>
          <div style="padding:0">
            <div class="stat-row"><div class="stat-row-label">Client Since</div><div class="stat-row-value" style="font-size:13px">${client.startDate ? formatDate(client.startDate) : 'N/A'}</div></div>
            <div class="stat-row"><div class="stat-row-label">Plan</div><div class="stat-row-value" style="font-size:13px">${client.plan}</div></div>
            <div class="stat-row"><div class="stat-row-label">Sessions</div><div class="stat-row-value" style="font-size:13px">${client.sessionsCompleted}</div></div>
            <div class="stat-row"><div class="stat-row-label">Revenue</div><div class="stat-row-value" style="font-size:13px">${formatCurrency(client.revenue)}</div></div>
            <div class="stat-row"><div class="stat-row-label">Projects</div><div class="stat-row-value" style="font-size:13px">${client.projects}</div></div>
          </div>
        </div>
        ${healthFactors}
      </div>
    </div>
  `;
}

function renderClientDetailDocuments(client) {
  const docs = DOCUMENTS.filter(d => d.clientId === client.id);
  if (docs.length === 0) {
    document.getElementById('tab-documents').innerHTML = '<div class="doc-empty-msg">No documents for this client.</div>';
    return;
  }
  document.getElementById('tab-documents').innerHTML = docs.map(d => `
    <div class="doc-row" onclick="selectDocument(${d.id})">
      <div class="doc-row-left">
        <div class="doc-type-icon" style="background:var(--indigo-100);color:var(--indigo-700)">
          <span class="material-symbols-outlined">description</span>
        </div>
        <div class="doc-row-info">
          <h4>${d.name}</h4>
          <span>${d.type} &middot; ${formatDate(d.lastModified)}</span>
        </div>
      </div>
      <span class="doc-version">v${d.version}</span>
    </div>
  `).join('');
}

function renderClientDetailActivity(client) {
  const activities = CLIENT_ACTIVITIES[client.id];
  if (!activities) {
    document.getElementById('tab-activity').innerHTML = '<div class="doc-empty-msg">No activity recorded yet.</div>';
    return;
  }
  document.getElementById('tab-activity').innerHTML = `
    <div class="timeline">
      ${activities.map(a => `
        <div class="timeline-item">
          <div class="timeline-dot ${a.type}"></div>
          <div class="timeline-title">${a.title}</div>
          <div class="timeline-detail">${a.detail}</div>
          <div class="timeline-date">${formatDate(a.date)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderClientDetailApplications(client) {
  const apps = CLIENT_APPLICATIONS[client.id];
  if (!apps) {
    document.getElementById('tab-applications').innerHTML = '<div class="doc-empty-msg">No projects tracked.</div>';
    return;
  }
  const statusColors = { 'In Progress': 'var(--indigo-600)', 'Planning': 'var(--amber-600)', 'Completed': 'var(--green-500)', 'On Hold': 'var(--slate-500)' };
  document.getElementById('tab-applications').innerHTML = `
    <div class="client-table-wrapper">
      <table class="client-table">
        <thead><tr><th>Company</th><th>Project</th><th>Date Started</th><th>Status</th></tr></thead>
        <tbody>
          ${apps.map(a => `
            <tr>
              <td>${a.company}</td>
              <td style="font-weight:600">${a.role}</td>
              <td style="color:var(--slate-600)">${formatDate(a.dateApplied)}</td>
              <td><span style="color:${statusColors[a.status] || 'var(--slate-600)'};font-weight:600;font-size:13px">${a.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function initClientDetailTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ---- Onboarding Wizard ----
let wizardStep = 1;
let wizardData = { name: '', email: '', phone: '', linkedin: '', plan: '', goals: '', experience: '' };

function initOnboardingWizard() {
  document.getElementById('add-client-btn').addEventListener('click', openOnboardingWizard);
  document.getElementById('onboarding-close').addEventListener('click', closeOnboardingWizard);
  document.getElementById('onboarding-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeOnboardingWizard();
  });
  document.getElementById('wizard-next').addEventListener('click', wizardNext);
  document.getElementById('wizard-back').addEventListener('click', wizardBack);
}

function openOnboardingWizard() {
  wizardStep = 1;
  wizardData = { name: '', email: '', phone: '', linkedin: '', plan: '', goals: '', experience: '' };
  document.getElementById('onboarding-overlay').classList.add('show');
  renderWizardStep();
}

function closeOnboardingWizard() {
  document.getElementById('onboarding-overlay').classList.remove('show');
}

function renderWizardStep() {
  const body = document.getElementById('wizard-body');
  const backBtn = document.getElementById('wizard-back');
  const nextBtn = document.getElementById('wizard-next');

  document.querySelectorAll('.wizard-step').forEach(s => {
    const step = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (step === wizardStep) s.classList.add('active');
    if (step < wizardStep) s.classList.add('done');
  });

  backBtn.style.display = wizardStep > 1 ? 'inline-flex' : 'none';
  nextBtn.textContent = wizardStep === 4 ? 'Create Client' : 'Next';

  if (wizardStep === 1) {
    body.innerHTML = `
      <div class="wizard-field" id="wf-name"><label>Full Name *</label><input type="text" id="w-name" value="${wizardData.name}" placeholder="e.g., Jordan Lee"><div class="field-error">Name is required</div></div>
      <div class="wizard-field" id="wf-email"><label>Email Address *</label><input type="email" id="w-email" value="${wizardData.email}" placeholder="e.g., jordan@company.com"><div class="field-error">Valid email is required</div></div>
      <div class="wizard-field"><label>Phone</label><input type="text" id="w-phone" value="${wizardData.phone}" placeholder="(555) 555-0100"></div>
      <div class="wizard-field"><label>LinkedIn</label><input type="text" id="w-linkedin" value="${wizardData.linkedin}" placeholder="linkedin.com/in/jordanlee"></div>
    `;
  } else if (wizardStep === 2) {
    const plans = OPERATOR_SETTINGS.plans;
    body.innerHTML = `
      <p style="margin-bottom:16px;color:var(--slate-600);font-size:14px">Select a plan for this client:</p>
      <div class="plan-cards">
        ${plans.map(p => `
          <div class="plan-card ${wizardData.plan === p.name ? 'selected' : ''}" onclick="selectWizardPlan('${p.name}')">
            <h4>${p.name}</h4>
            <div class="price">$${p.price.toLocaleString()}<span>/mo</span></div>
            <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>
    `;
  } else if (wizardStep === 3) {
    body.innerHTML = `
      <div class="wizard-field"><label>Career/Business Goals</label><textarea id="w-goals" rows="3" placeholder="What are the client's primary objectives?">${wizardData.goals}</textarea></div>
      <div class="wizard-field"><label>Experience Level</label>
        <select id="w-experience" class="filter-select" style="width:100%">
          <option value="">Select...</option>
          <option value="Early Stage" ${wizardData.experience === 'Early Stage' ? 'selected' : ''}>Early Stage Startup</option>
          <option value="Growth" ${wizardData.experience === 'Growth' ? 'selected' : ''}>Growth Stage</option>
          <option value="Enterprise" ${wizardData.experience === 'Enterprise' ? 'selected' : ''}>Enterprise / Established</option>
          <option value="Individual" ${wizardData.experience === 'Individual' ? 'selected' : ''}>Individual / Freelancer</option>
        </select>
      </div>
    `;
  } else if (wizardStep === 4) {
    body.innerHTML = `
      <h4 style="margin-bottom:16px">Review & Confirm</h4>
      <div style="background:var(--slate-100);border-radius:10px;padding:16px;font-size:14px;line-height:2">
        <strong>Name:</strong> ${wizardData.name}<br>
        <strong>Email:</strong> ${wizardData.email}<br>
        <strong>Phone:</strong> ${wizardData.phone || 'N/A'}<br>
        <strong>LinkedIn:</strong> ${wizardData.linkedin || 'N/A'}<br>
        <strong>Plan:</strong> ${wizardData.plan}<br>
        <strong>Goals:</strong> ${wizardData.goals || 'N/A'}<br>
        <strong>Experience:</strong> ${wizardData.experience || 'N/A'}
      </div>
    `;
  }
}

function selectWizardPlan(plan) {
  wizardData.plan = plan;
  renderWizardStep();
}

function wizardNext() {
  if (wizardStep === 1) {
    const name = document.getElementById('w-name').value.trim();
    const email = document.getElementById('w-email').value.trim();
    wizardData.name = name;
    wizardData.email = email;
    wizardData.phone = document.getElementById('w-phone').value.trim();
    wizardData.linkedin = document.getElementById('w-linkedin').value.trim();

    let valid = true;
    if (!name) { document.getElementById('wf-name').classList.add('error'); valid = false; } else { document.getElementById('wf-name').classList.remove('error'); }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('wf-email').classList.add('error'); valid = false; } else { document.getElementById('wf-email').classList.remove('error'); }
    if (!valid) return;
  } else if (wizardStep === 2) {
    if (!wizardData.plan) { showToast('Please select a plan'); return; }
  } else if (wizardStep === 3) {
    wizardData.goals = document.getElementById('w-goals').value.trim();
    wizardData.experience = document.getElementById('w-experience').value;
  } else if (wizardStep === 4) {
    // Create client
    const newId = Math.max(...CLIENTS.map(c => c.id)) + 1;
    CLIENTS.push({
      id: newId, name: wizardData.name, company: wizardData.experience || 'Independent',
      email: wizardData.email, phone: wizardData.phone, status: 'active', projects: 0,
      lastContact: new Date().toISOString().split('T')[0], revenue: 0, plan: wizardData.plan,
      linkedin: wizardData.linkedin, bio: wizardData.goals, startDate: new Date().toISOString().split('T')[0],
      sessionsCompleted: 0, healthScore: 75
    });
    renderClientList();
    closeOnboardingWizard();
    showToast(`${wizardData.name} added successfully!`);
    return;
  }
  wizardStep++;
  renderWizardStep();
}

function wizardBack() {
  if (wizardStep > 1) {
    if (wizardStep === 3) {
      wizardData.goals = document.getElementById('w-goals').value.trim();
      wizardData.experience = document.getElementById('w-experience').value;
    }
    wizardStep--;
    renderWizardStep();
  }
}

// ---- Pipeline / Kanban ----
const PIPELINE_STAGES = ['planning', 'in-progress', 'review', 'on-hold', 'completed'];
const STAGE_LABELS = { 'planning': 'Planning', 'in-progress': 'In Progress', 'review': 'Review', 'on-hold': 'On Hold', 'completed': 'Completed' };

function renderPipeline() {
  const board = document.getElementById('kanban-board');
  board.innerHTML = PIPELINE_STAGES.map(stage => {
    const cards = PIPELINE_CARDS.filter(c => c.stage === stage);
    const isHighlight = stage === 'review' || stage === 'completed';
    return `
      <div class="kanban-column">
        <div class="kanban-column-header">
          ${STAGE_LABELS[stage]}
          <span class="kanban-count" id="kcount-${stage}">${cards.length}</span>
        </div>
        <div class="kanban-cards" id="kcol-${stage}" ondragover="kanbanDragOver(event)" ondrop="kanbanDrop(event, '${stage}')">
          ${cards.map(c => renderKanbanCard(c, isHighlight)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderKanbanCard(card, highlight) {
  const client = CLIENTS.find(c => c.id === card.clientId);
  const initials = client ? client.name.split(' ').map(n => n[0]).join('') : '??';
  const avatarColors = [
    { bg: '#e0e7ff', fg: '#4338ca' }, { bg: '#fef3c7', fg: '#d97706' },
    { bg: '#dcfce7', fg: '#16a34a' }, { bg: '#ede9fe', fg: '#7c3aed' },
    { bg: '#fee2e2', fg: '#dc2626' }
  ];
  const ac = avatarColors[(card.clientId || 0) % avatarColors.length];

  return `
    <div class="kanban-card ${highlight ? 'highlight' : ''}" draggable="true" data-card-id="${card.id}"
         ondragstart="kanbanDragStart(event, ${card.id})" onclick="openKanbanDetail(${card.id})">
      <div class="kanban-card-title">${card.project}</div>
      <div class="kanban-card-company">${card.company}</div>
      <div class="kanban-card-footer">
        <span class="kanban-days">${card.daysInStage}d</span>
        <div class="kanban-client-avatar" style="background:${ac.bg};color:${ac.fg}">${initials}</div>
      </div>
    </div>
  `;
}

let draggedCardId = null;

function kanbanDragStart(e, cardId) {
  draggedCardId = cardId;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function kanbanDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function kanbanDrop(e, newStage) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (draggedCardId !== null) {
    const card = PIPELINE_CARDS.find(c => c.id === draggedCardId);
    if (card && card.stage !== newStage) {
      card.stage = newStage;
      card.daysInStage = 0;
      renderPipeline();
      showToast(`Moved "${card.project}" to ${STAGE_LABELS[newStage]}`);
    }
    draggedCardId = null;
  }
}

function openKanbanDetail(cardId) {
  const card = PIPELINE_CARDS.find(c => c.id === cardId);
  if (!card) return;
  const client = CLIENTS.find(c => c.id === card.clientId);

  document.getElementById('kanban-detail-title').textContent = card.project;
  document.getElementById('kanban-detail-body').innerHTML = `
    <div style="padding:20px;font-size:14px;line-height:2">
      <strong>Client:</strong> ${client ? client.name : 'Unknown'}<br>
      <strong>Company:</strong> ${card.company}<br>
      <strong>Stage:</strong> ${STAGE_LABELS[card.stage]}<br>
      <strong>Days in Stage:</strong> ${card.daysInStage}<br>
      <strong>Source:</strong> ${card.source}<br>
      <strong>Notes:</strong> ${card.notes}
      <div style="margin-top:16px">
        <a href="#" style="color:var(--indigo-600);font-weight:600" onclick="event.preventDefault();closeKanbanDetail();openClientDetail(${card.clientId})">View Client Profile &rarr;</a>
      </div>
    </div>
  `;
  document.getElementById('kanban-detail-overlay').classList.add('show');
  document.getElementById('kanban-detail-close').onclick = closeKanbanDetail;
  document.getElementById('kanban-detail-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeKanbanDetail();
  });
}

function closeKanbanDetail() {
  document.getElementById('kanban-detail-overlay').classList.remove('show');
}

// ---- Calendar ----
let calendarDate = new Date(2026, 2, 27); // Mar 27, 2026
let calendarView = 'week';

function renderCalendar() {
  updateCalendarTitle();
  renderCalendarGrid();

  document.getElementById('cal-prev').addEventListener('click', () => {
    calendarDate.setDate(calendarDate.getDate() - (calendarView === 'week' ? 7 : 1));
    updateCalendarTitle();
    renderCalendarGrid();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    calendarDate.setDate(calendarDate.getDate() + (calendarView === 'week' ? 7 : 1));
    updateCalendarTitle();
    renderCalendarGrid();
  });

  document.getElementById('cal-today').addEventListener('click', () => {
    calendarDate = new Date(2026, 2, 27);
    updateCalendarTitle();
    renderCalendarGrid();
  });

  document.querySelectorAll('.toggle-btn[data-calview]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn[data-calview]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calendarView = btn.dataset.calview;
      renderCalendarGrid();
    });
  });
}

function updateCalendarTitle() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('calendar-title').textContent = `${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
}

function renderCalendarGrid() {
  const grid = document.getElementById('calendar-grid');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = [];
  for (let h = 8; h <= 18; h++) {
    hours.push(h <= 12 ? `${h} AM` : `${h - 12} PM`);
  }
  if (hours[4] === '0 PM') hours[4] = '12 PM';

  if (calendarView === 'week') {
    const startOfWeek = new Date(calendarDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      weekDates.push(d);
    }

    const todayStr = '2026-03-27';

    let html = `<div class="cal-header-row"><div class="cal-header-cell"></div>`;
    weekDates.forEach(d => {
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      html += `<div class="cal-header-cell ${isToday ? 'today' : ''}">
        ${days[d.getDay()]}
        <span class="cal-date">${d.getDate()}</span>
      </div>`;
    });
    html += '</div>';

    html += '<div class="cal-body">';
    hours.forEach((hourLabel, hi) => {
      const hour = hi + 8;
      html += `<div class="cal-time-label">${hourLabel}</div>`;
      weekDates.forEach(d => {
        const dateStr = d.toISOString().split('T')[0];
        const cellEvents = CALENDAR_EVENTS.filter(e => {
          return e.date === dateStr && parseInt(e.startTime.split(':')[0]) === hour;
        });
        html += `<div class="cal-cell" onclick="openCalEventForm('${dateStr}', '${String(hour).padStart(2,'0')}:00')">`;
        cellEvents.forEach(ev => {
          html += `<div class="cal-event ${ev.type}" onclick="event.stopPropagation();openCalEventDetail(${ev.id})">${ev.startTime} ${ev.title}</div>`;
        });
        html += '</div>';
      });
    });
    html += '</div>';
    grid.innerHTML = html;
  } else {
    // Day view
    const dateStr = calendarDate.toISOString().split('T')[0];
    const todayStr = '2026-03-27';
    const isToday = dateStr === todayStr;

    let html = `<div class="cal-header-row day-view"><div class="cal-header-cell"></div>
      <div class="cal-header-cell ${isToday ? 'today' : ''}">
        ${days[calendarDate.getDay()]}
        <span class="cal-date">${calendarDate.getDate()}</span>
      </div></div>`;

    html += '<div class="cal-body day-view">';
    hours.forEach((hourLabel, hi) => {
      const hour = hi + 8;
      const cellEvents = CALENDAR_EVENTS.filter(e => e.date === dateStr && parseInt(e.startTime.split(':')[0]) === hour);
      html += `<div class="cal-time-label">${hourLabel}</div>`;
      html += `<div class="cal-cell" onclick="openCalEventForm('${dateStr}', '${String(hour).padStart(2,'0')}:00')">`;
      cellEvents.forEach(ev => {
        html += `<div class="cal-event ${ev.type}" onclick="event.stopPropagation();openCalEventDetail(${ev.id})">${ev.startTime} ${ev.title} - ${ev.clientName}</div>`;
      });
      html += '</div>';
    });
    html += '</div>';
    grid.innerHTML = html;
  }
}

function openCalEventForm(date, time) {
  document.getElementById('cal-event-title').textContent = 'New Event';
  const clientOptions = CLIENTS.filter(c => c.status === 'active').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('cal-event-body').innerHTML = `
    <div style="padding:20px">
      <div class="wizard-field"><label>Client</label><select id="ce-client" class="filter-select" style="width:100%"><option value="">Select...</option>${clientOptions}</select></div>
      <div class="wizard-field"><label>Title</label><input type="text" id="ce-title" class="form-input" placeholder="Session title"></div>
      <div class="wizard-field"><label>Type</label>
        <select id="ce-type" class="filter-select" style="width:100%">
          <option value="coaching">Coaching Call</option>
          <option value="review">Review</option>
          <option value="workshop">Workshop</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div class="wizard-field"><label>Date</label><input type="date" id="ce-date" class="form-input" value="${date}"></div>
        <div class="wizard-field"><label>Start Time</label><input type="time" id="ce-start" class="form-input" value="${time}"></div>
        <div class="wizard-field"><label>End Time</label><input type="time" id="ce-end" class="form-input" value="${String(parseInt(time.split(':')[0]) + 1).padStart(2,'0')}:00"></div>
      </div>
      <div class="wizard-field"><label>Notes</label><input type="text" id="ce-notes" class="form-input" placeholder="Optional notes"></div>
    </div>
  `;
  document.getElementById('cal-event-footer').innerHTML = `
    <button class="btn-secondary" onclick="closeCalEventModal()">Cancel</button>
    <button class="btn-primary" onclick="saveCalEvent()">Save Event</button>
  `;
  document.getElementById('cal-event-overlay').classList.add('show');
  document.getElementById('cal-event-close').onclick = closeCalEventModal;
}

function openCalEventDetail(eventId) {
  const ev = CALENDAR_EVENTS.find(e => e.id === eventId);
  if (!ev) return;
  document.getElementById('cal-event-title').textContent = ev.title;
  document.getElementById('cal-event-body').innerHTML = `
    <div style="padding:20px;font-size:14px;line-height:2">
      <strong>Client:</strong> ${ev.clientName}<br>
      <strong>Type:</strong> ${ev.type}<br>
      <strong>Date:</strong> ${formatDate(ev.date)}<br>
      <strong>Time:</strong> ${ev.startTime} - ${ev.endTime}<br>
      <strong>Notes:</strong> ${ev.notes}
    </div>
  `;
  document.getElementById('cal-event-footer').innerHTML = `
    <button class="btn-secondary" style="color:var(--red-500)" onclick="deleteCalEvent(${ev.id})">Delete</button>
    <button class="btn-secondary" onclick="closeCalEventModal()">Close</button>
  `;
  document.getElementById('cal-event-overlay').classList.add('show');
  document.getElementById('cal-event-close').onclick = closeCalEventModal;
}

function saveCalEvent() {
  const clientId = parseInt(document.getElementById('ce-client').value);
  const title = document.getElementById('ce-title').value.trim();
  const type = document.getElementById('ce-type').value;
  const date = document.getElementById('ce-date').value;
  const startTime = document.getElementById('ce-start').value;
  const endTime = document.getElementById('ce-end').value;
  const notes = document.getElementById('ce-notes').value.trim();

  if (!title) { showToast('Title is required'); return; }

  const client = CLIENTS.find(c => c.id === clientId);
  CALENDAR_EVENTS.push({
    id: Math.max(...CALENDAR_EVENTS.map(e => e.id)) + 1,
    clientId: clientId || 0,
    clientName: client ? client.name : 'Internal',
    title, type, date, startTime, endTime, notes
  });

  closeCalEventModal();
  renderCalendarGrid();
  showToast('Event added');
}

function deleteCalEvent(id) {
  const idx = CALENDAR_EVENTS.findIndex(e => e.id === id);
  if (idx > -1) {
    CALENDAR_EVENTS.splice(idx, 1);
    closeCalEventModal();
    renderCalendarGrid();
    showToast('Event deleted');
  }
}

function closeCalEventModal() {
  document.getElementById('cal-event-overlay').classList.remove('show');
}

// ---- Documents ----
let selectedDocClient = null;
let selectedDocId = null;

function renderDocuments() {
  const sidebar = document.getElementById('doc-sidebar');
  const clientsWithDocs = [...new Set(DOCUMENTS.map(d => d.clientId))];

  sidebar.innerHTML = clientsWithDocs.map(cid => {
    const client = CLIENTS.find(c => c.id === cid);
    if (!client) return '';
    return `<div class="doc-sidebar-item ${selectedDocClient === cid ? 'active' : ''}" onclick="selectDocClient(${cid})">
      <span class="material-symbols-outlined">folder</span>
      ${client.name}
    </div>`;
  }).join('');
}

function selectDocClient(clientId) {
  selectedDocClient = clientId;
  selectedDocId = null;
  renderDocuments();

  const docs = DOCUMENTS.filter(d => d.clientId === clientId);
  const listArea = document.getElementById('doc-list-area');

  listArea.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h4 style="font-size:15px;font-weight:700">Documents</h4>
      <button class="btn-primary" style="padding:6px 14px;font-size:13px" onclick="createNewDocument(${clientId})">
        <span class="material-symbols-outlined" style="font-size:16px">add</span> New
      </button>
    </div>
    ${docs.map(d => `
      <div class="doc-row ${selectedDocId === d.id ? 'active' : ''}" onclick="selectDocument(${d.id})">
        <div class="doc-row-left">
          <div class="doc-type-icon" style="background:var(--indigo-100);color:var(--indigo-700)">
            <span class="material-symbols-outlined">description</span>
          </div>
          <div class="doc-row-info">
            <h4>${d.name}</h4>
            <span>${d.type} &middot; ${formatDate(d.lastModified)}</span>
          </div>
        </div>
        <div class="doc-version" onclick="event.stopPropagation();toggleVersionDropdown(${d.id})">
          v${d.version}
          <div class="version-dropdown" id="vdrop-${d.id}">
            ${d.versions.map(v => `<div class="version-item">v${v.v} - ${formatDate(v.date)}</div>`).join('')}
          </div>
        </div>
      </div>
    `).join('')}
  `;

  document.getElementById('doc-preview-area').innerHTML = '<p class="doc-empty-msg">Select a document to preview.</p>';
}

function selectDocument(docId) {
  selectedDocId = docId;
  const doc = DOCUMENTS.find(d => d.id === docId);
  if (!doc) return;

  if (selectedDocClient !== doc.clientId) {
    selectedDocClient = doc.clientId;
    renderDocuments();
    selectDocClient(doc.clientId);
  }

  // Re-render list to show active state
  const listDocs = DOCUMENTS.filter(d => d.clientId === doc.clientId);
  const listArea = document.getElementById('doc-list-area');
  listArea.querySelectorAll('.doc-row').forEach(row => row.classList.remove('active'));
  // Just update preview
  document.getElementById('doc-preview-area').innerHTML = `
    <h4 style="font-size:15px;font-weight:700;margin-bottom:4px">${doc.name}</h4>
    <p style="font-size:12px;color:var(--slate-500);margin-bottom:16px">${doc.type} &middot; v${doc.version} &middot; Last modified ${formatDate(doc.lastModified)}</p>
    <div class="doc-preview-content">${doc.content}</div>
  `;
}

function toggleVersionDropdown(docId) {
  const dd = document.getElementById('vdrop-' + docId);
  if (dd) dd.classList.toggle('show');
}

function createNewDocument(clientId) {
  const name = prompt('Document name:');
  if (!name) return;
  const newDoc = {
    id: Math.max(...DOCUMENTS.map(d => d.id)) + 1,
    clientId, name, type: 'Other',
    lastModified: new Date().toISOString().split('T')[0],
    version: 1,
    versions: [{ v: 1, date: new Date().toISOString().split('T')[0] }],
    content: 'New document content...'
  };
  DOCUMENTS.push(newDoc);
  selectDocClient(clientId);
  showToast('Document created');
}

// =============================================
// SPRINT 3: AI Tools, Revenue, Messaging, Analytics, Notifications
// =============================================

// ---- AI Resume Tailor ----
function initAIResumeTailor() {
  const select = document.getElementById('ai-client-select');
  CLIENTS.filter(c => c.status === 'active').forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    const clientId = parseInt(e.target.value);
    const docs = DOCUMENTS.filter(d => d.clientId === clientId);
    const content = document.getElementById('ai-resume-content');
    if (docs.length > 0) {
      content.textContent = docs[0].content;
    } else {
      content.textContent = 'No documents found for this client.';
    }
  });

  document.getElementById('ai-tailor-btn').addEventListener('click', runAITailor);
}

function runAITailor() {
  const jd = document.getElementById('ai-jd-input').value.trim();
  const clientId = parseInt(document.getElementById('ai-client-select').value);
  if (!jd) { showToast('Please paste a job description'); return; }
  if (!clientId) { showToast('Please select a client'); return; }

  const resultsDiv = document.getElementById('ai-results');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = '<div class="spinner"></div><p style="text-align:center;color:var(--slate-500)">Analyzing match...</p>';

  setTimeout(() => {
    const score = Math.floor(68 + Math.random() * 20);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference * (1 - score / 100);

    resultsDiv.innerHTML = `
      <div style="display:grid;grid-template-columns:200px 1fr;gap:24px">
        <div style="text-align:center">
          <h4 style="margin-bottom:12px">Match Score</h4>
          <div class="ai-score-gauge">
            <svg viewBox="0 0 100 100">
              <circle class="bg" cx="50" cy="50" r="45"/>
              <circle class="fg" cx="50" cy="50" r="45" stroke="${score >= 70 ? 'var(--green-500)' : 'var(--amber-500)'}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
            </svg>
            <div class="ai-score-value">${score}%</div>
          </div>
        </div>
        <div>
          <h4 style="margin-bottom:8px">Matching Skills</h4>
          <ul class="ai-skill-list">
            <li class="ai-skill match"><span class="material-symbols-outlined">check_circle</span> Project Management</li>
            <li class="ai-skill match"><span class="material-symbols-outlined">check_circle</span> Strategic Planning</li>
            <li class="ai-skill match"><span class="material-symbols-outlined">check_circle</span> Data Analysis</li>
            <li class="ai-skill match"><span class="material-symbols-outlined">check_circle</span> Team Leadership</li>
            <li class="ai-skill match"><span class="material-symbols-outlined">check_circle</span> Cloud Architecture</li>
          </ul>
          <h4 style="margin:16px 0 8px">Missing Skills</h4>
          <ul class="ai-skill-list">
            <li class="ai-skill missing"><span class="material-symbols-outlined">cancel</span> Machine Learning</li>
            <li class="ai-skill missing"><span class="material-symbols-outlined">cancel</span> Kubernetes</li>
          </ul>
        </div>
      </div>
      <h4 style="margin:24px 0 12px">Suggested Rewrites</h4>
      <div class="ai-rewrite" id="ai-rw-1">
        <div class="ai-rewrite-label">Before</div>
        <div class="ai-rewrite-text" id="ai-rw-before-1">Managed team of engineers on various projects</div>
        <div class="ai-rewrite-label" style="margin-top:8px">After</div>
        <div class="ai-rewrite-text">Led cross-functional team of 12 engineers delivering cloud migration project, reducing infrastructure costs by 35%</div>
        <button class="btn-primary ai-rewrite-btn" onclick="applyRewrite(1)">Apply</button>
      </div>
      <div class="ai-rewrite" id="ai-rw-2">
        <div class="ai-rewrite-label">Before</div>
        <div class="ai-rewrite-text" id="ai-rw-before-2">Worked on data analysis projects</div>
        <div class="ai-rewrite-label" style="margin-top:8px">After</div>
        <div class="ai-rewrite-text">Built automated data pipeline processing 10M+ daily events, enabling real-time analytics dashboard used by 200+ stakeholders</div>
        <button class="btn-primary ai-rewrite-btn" onclick="applyRewrite(2)">Apply</button>
      </div>
      <div class="ai-rewrite" id="ai-rw-3">
        <div class="ai-rewrite-label">Before</div>
        <div class="ai-rewrite-text" id="ai-rw-before-3">Responsible for strategic planning</div>
        <div class="ai-rewrite-label" style="margin-top:8px">After</div>
        <div class="ai-rewrite-text">Developed and executed 3-year strategic roadmap resulting in 150% revenue growth and expansion into 3 new market segments</div>
        <button class="btn-primary ai-rewrite-btn" onclick="applyRewrite(3)">Apply</button>
      </div>
    `;
  }, 2000);
}

function applyRewrite(idx) {
  const el = document.getElementById('ai-rw-' + idx);
  if (el) {
    const btn = el.querySelector('button');
    btn.textContent = 'Applied';
    btn.disabled = true;
    btn.style.background = 'var(--green-500)';
    showToast('Rewrite applied');
  }
}

// ---- AI Interview Prep ----
function initAIInterviewPrep() {
  const select = document.getElementById('ai-interview-client');
  CLIENTS.filter(c => c.status === 'active').forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });

  document.getElementById('ai-interview-btn').addEventListener('click', runAIInterviewPrep);
}

function runAIInterviewPrep() {
  const clientId = parseInt(document.getElementById('ai-interview-client').value);
  const company = document.getElementById('ai-interview-company').value.trim();
  const role = document.getElementById('ai-interview-role').value.trim();
  const type = document.getElementById('ai-interview-type').value;

  if (!clientId || !company || !role) { showToast('Please fill in all fields'); return; }

  const client = CLIENTS.find(c => c.id === clientId);
  const resultsDiv = document.getElementById('ai-interview-results');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = '<div class="spinner"></div><p style="text-align:center;color:var(--slate-500)">Generating prep kit...</p>';

  const typeLabel = { phone: 'Phone Screen', technical: 'Technical', behavioral: 'Behavioral', final: 'Final Round' }[type];

  setTimeout(() => {
    resultsDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3>${typeLabel} Prep Kit: ${role} at ${company}</h3>
        <button class="btn-primary" id="send-prep-btn" onclick="sendPrepKit('${client.name}')">
          <span class="material-symbols-outlined" style="font-size:18px">send</span> Send to Client
        </button>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible(this)">
          Role-Specific Questions (5) <span class="material-symbols-outlined" style="font-size:18px">expand_more</span>
        </div>
        <div class="collapsible-body open">
          <div class="qa-pair"><div class="qa-q">1. How would you approach building a ${role.toLowerCase()} function from scratch at ${company}?</div><div class="qa-a" contenteditable="true">I would start by understanding ${company}'s current challenges and business objectives, then develop a phased roadmap. In the first 30 days, I'd focus on stakeholder interviews and gap analysis. By day 60, I'd implement quick wins while building the foundation for longer-term initiatives. By day 90, I'd present a comprehensive strategy with measurable KPIs.</div></div>
          <div class="qa-pair"><div class="qa-q">2. Describe a time you delivered results under tight constraints. How would that experience apply at ${company}?</div><div class="qa-a" contenteditable="true">In my current role, I led a team through a critical product launch with a compressed timeline. I prioritized ruthlessly, established daily standups, and delegated effectively. We shipped on time with 95% feature completeness. At ${company}, this experience would help me navigate fast-paced execution while maintaining quality.</div></div>
          <div class="qa-pair"><div class="qa-q">3. How do you measure success in a ${role.toLowerCase()} position?</div><div class="qa-a" contenteditable="true">I believe in outcome-based metrics: revenue impact, team velocity, and stakeholder satisfaction. I'd establish baseline measurements in the first month, set quarterly targets, and create dashboards for visibility. Success should be quantifiable and aligned with ${company}'s strategic goals.</div></div>
          <div class="qa-pair"><div class="qa-q">4. What strategies would you use to scale operations at ${company}?</div><div class="qa-a" contenteditable="true">I'd focus on three pillars: process automation (eliminating manual bottlenecks), talent development (upskilling existing team members), and technology leverage (implementing tools that provide 10x efficiency gains). I've successfully scaled teams from 5 to 25+ using these principles.</div></div>
          <div class="qa-pair"><div class="qa-q">5. How do you handle disagreements with senior leadership?</div><div class="qa-a" contenteditable="true">I approach disagreements as opportunities for better decisions. I prepare data-driven arguments, seek to understand the other perspective fully, and propose experiments to test hypotheses. I've found that framing disagreements as "let's find the best answer together" rather than "I'm right" leads to better outcomes and stronger relationships.</div></div>
        </div>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible(this)">
          Behavioral / STAR Questions (3) <span class="material-symbols-outlined" style="font-size:18px">expand_more</span>
        </div>
        <div class="collapsible-body open">
          <div class="qa-pair"><div class="qa-q">1. Tell me about a time you had to influence without authority.</div><div class="qa-a" contenteditable="true"><strong>Situation:</strong> Needed to get buy-in from a skeptical engineering team for a new process.<br><strong>Task:</strong> Implement a code review standard across 4 teams.<br><strong>Action:</strong> Ran a pilot with one willing team, collected metrics showing 40% fewer production bugs, then presented results to others.<br><strong>Result:</strong> All teams adopted the standard within 6 weeks, and we saw a 35% reduction in post-deployment incidents.</div></div>
          <div class="qa-pair"><div class="qa-q">2. Describe a project that failed. What did you learn?</div><div class="qa-a" contenteditable="true"><strong>Situation:</strong> Led an ambitious platform migration that missed its deadline by 3 months.<br><strong>Task:</strong> Migrate 500K users to new infrastructure.<br><strong>Action:</strong> After the delay, I conducted a thorough retrospective and identified that we underestimated data migration complexity.<br><strong>Result:</strong> I developed a migration estimation framework that we now use for all projects, and haven't missed a major deadline since.</div></div>
          <div class="qa-pair"><div class="qa-q">3. Tell me about your most significant leadership moment.</div><div class="qa-a" contenteditable="true"><strong>Situation:</strong> Team morale dropped after a key team member left during a critical project phase.<br><strong>Task:</strong> Keep the project on track while supporting the team.<br><strong>Action:</strong> I redistributed work based on individual strengths, set up weekly 1:1s, and personally took on the most challenging technical tasks.<br><strong>Result:</strong> We delivered the project on time, team satisfaction scores improved by 20 points, and two team members were promoted based on their growth during this period.</div></div>
        </div>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible(this)">
          Company Research: ${company} <span class="material-symbols-outlined" style="font-size:18px">expand_more</span>
        </div>
        <div class="collapsible-body open">
          <ul style="list-style:disc;padding-left:20px;font-size:14px;color:var(--slate-700);line-height:1.8">
            <li>${company} is a leading technology company known for innovation in its sector</li>
            <li>Recently expanded operations with a focus on AI and automation</li>
            <li>Company culture emphasizes collaboration, transparency, and continuous learning</li>
            <li>Key competitors include industry leaders, creating a fast-paced competitive environment</li>
          </ul>
        </div>
      </div>
    `;
  }, 2000);
}

function sendPrepKit(clientName) {
  const btn = document.getElementById('send-prep-btn');
  btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">check</span> Sent';
  btn.disabled = true;
  btn.style.background = 'var(--green-500)';
  showToast(`Prep kit sent to ${clientName} via email`);
}

function toggleCollapsible(header) {
  const body = header.nextElementSibling;
  body.classList.toggle('open');
  const icon = header.querySelector('.material-symbols-outlined');
  icon.textContent = body.classList.contains('open') ? 'expand_less' : 'expand_more';
}

// ---- Revenue ----
function renderRevenue() {
  // Metrics
  const totalMRR = 38700;
  const outstanding = INVOICES.filter(i => i.status === 'overdue' || i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const paidCount = INVOICES.filter(i => i.status === 'paid').length;
  const collectionRate = Math.round((paidCount / INVOICES.length) * 100);

  document.getElementById('revenue-metrics').innerHTML = `
    <div class="metric-card"><div class="metric-icon"><span class="material-symbols-outlined">trending_up</span></div><div class="metric-value">$${totalMRR.toLocaleString()}</div><div class="metric-label">Monthly Revenue</div><div class="metric-change up"><span class="material-symbols-outlined" style="font-size:14px">trending_up</span>+13.2%</div></div>
    <div class="metric-card"><div class="metric-icon"><span class="material-symbols-outlined">group</span></div><div class="metric-value">9 / 3 / 3</div><div class="metric-label">Active / Inactive / Leads</div></div>
    <div class="metric-card"><div class="metric-icon"><span class="material-symbols-outlined">account_balance</span></div><div class="metric-value">$${outstanding.toLocaleString()}</div><div class="metric-label">Outstanding Balance</div><div class="metric-change down"><span class="material-symbols-outlined" style="font-size:14px">trending_down</span>2 overdue</div></div>
    <div class="metric-card"><div class="metric-icon"><span class="material-symbols-outlined">percent</span></div><div class="metric-value">${collectionRate}%</div><div class="metric-label">Collection Rate</div></div>
  `;

  // Revenue chart
  const maxRev = Math.max(...REVENUE_HISTORY.map(r => r.revenue));
  document.getElementById('revenue-chart').innerHTML = `
    <div class="chart-bar-group">
      ${REVENUE_HISTORY.map(r => {
        const height = Math.round((r.revenue / maxRev) * 180);
        return `
          <div class="chart-bar-item">
            <div class="chart-bar" style="height:${height}px">
              <div class="chart-bar-value">$${(r.revenue / 1000).toFixed(1)}K</div>
            </div>
            <div class="chart-bar-label">${r.month.split(' ')[0]}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Invoice table
  renderInvoiceTable('all');

  // Invoice filter buttons
  document.querySelectorAll('[data-inv-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-inv-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderInvoiceTable(btn.dataset.invFilter);
    });
  });
}

function renderInvoiceTable(filter) {
  let invoices = [...INVOICES].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  if (filter !== 'all') invoices = invoices.filter(i => i.status === filter);

  document.getElementById('invoice-tbody').innerHTML = invoices.map(inv => {
    const client = CLIENTS.find(c => c.id === inv.clientId);
    return `
      <tr onclick="toggleInvoiceDetail(this, ${inv.id})">
        <td class="font-mono" style="font-size:13px">INV-2026-${String(inv.id).padStart(3, '0')}</td>
        <td style="font-weight:600">${client ? client.name : 'Unknown'}</td>
        <td style="font-weight:700">$${inv.amount.toLocaleString()}</td>
        <td style="color:var(--slate-600)">${formatDate(inv.dueDate)}</td>
        <td><span class="invoice-status ${inv.status}">${inv.status}</span></td>
        <td>${inv.status === 'overdue' ? `<button class="btn-primary" style="padding:4px 12px;font-size:12px" onclick="event.stopPropagation();sendInvoiceReminder('${client ? client.name : ''}')">Send Reminder</button>` : ''}</td>
      </tr>
      <tr class="invoice-detail-row" style="display:none" id="inv-detail-${inv.id}">
        <td colspan="6" style="background:var(--slate-100);padding:16px 20px;font-size:13px;line-height:1.8">
          <strong>Plan:</strong> ${inv.plan} &middot; <strong>Period:</strong> ${inv.period}<br>
          <strong>Payment Method:</strong> ${inv.paymentMethod}<br>
          ${inv.paidDate ? `<strong>Paid:</strong> ${formatDate(inv.paidDate)}` : '<em>Not yet paid</em>'}
        </td>
      </tr>
    `;
  }).join('');
}

function toggleInvoiceDetail(row, invId) {
  const detail = document.getElementById('inv-detail-' + invId);
  if (detail) {
    detail.style.display = detail.style.display === 'none' ? 'table-row' : 'none';
  }
}

function sendInvoiceReminder(clientName) {
  showToast(`Reminder sent to ${clientName}`);
}

// ---- Messaging ----
let activeConvoIdx = null;

function renderMessaging() {
  const list = document.getElementById('convo-list');
  list.innerHTML = CONVERSATIONS.map((convo, idx) => {
    const client = CLIENTS.find(c => c.id === convo.clientId);
    if (!client) return '';
    const initials = client.name.split(' ').map(n => n[0]).join('');
    const lastMsg = convo.messages[convo.messages.length - 1];
    const avatarColors = [
      { bg: '#e0e7ff', fg: '#4338ca' }, { bg: '#fef3c7', fg: '#d97706' },
      { bg: '#dcfce7', fg: '#16a34a' }, { bg: '#ede9fe', fg: '#7c3aed' },
      { bg: '#fee2e2', fg: '#dc2626' }
    ];
    const ac = avatarColors[client.id % avatarColors.length];

    return `
      <div class="convo-item conversation chat-item ${activeConvoIdx === idx ? 'active' : ''}" onclick="openConversation(${idx})">
        ${convo.unread ? '<div class="unread-dot"></div>' : ''}
        <div class="convo-avatar" style="background:${ac.bg};color:${ac.fg}">${initials}</div>
        <div class="convo-info">
          <div class="convo-name">${client.name}</div>
          <div class="convo-preview">${lastMsg.text.substring(0, 50)}...</div>
        </div>
        <div class="convo-time">${lastMsg.time}</div>
      </div>
    `;
  }).join('');
}

function openConversation(idx) {
  activeConvoIdx = idx;
  const convo = CONVERSATIONS[idx];
  const client = CLIENTS.find(c => c.id === convo.clientId);
  convo.unread = false;
  renderMessaging();
  updateMsgBadge();

  const thread = document.getElementById('convo-thread');
  thread.innerHTML = `
    <div class="convo-thread-header">${client.name}</div>
    <div class="convo-messages" id="convo-messages">
      ${convo.messages.map(m => `
        <div>
          <div class="msg-bubble ${m.from === 'client' ? 'from-client' : 'from-operator'}">${m.text}</div>
          <div class="msg-time ${m.from === 'operator' ? 'right' : ''}">${m.time}</div>
        </div>
      `).join('')}
    </div>
    <div class="convo-input-area">
      <input type="text" id="msg-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendMessage(${idx})">
      <div class="templates-btn">
        <button class="btn-icon" onclick="toggleTemplates()" title="Templates">
          <span class="material-symbols-outlined">article</span>
        </button>
        <div class="templates-dropdown" id="templates-dropdown">
          ${MESSAGE_TEMPLATES.map((t, ti) => `
            <div class="template-item" onclick="insertTemplate(${ti}, '${client.name}')">
              <div class="template-item-label">${t.label}</div>
              <div class="template-item-preview">${t.text.substring(0, 50)}...</div>
            </div>
          `).join('')}
        </div>
      </div>
      <button class="btn-primary" style="padding:10px 16px" onclick="sendMessage(${idx})">
        <span class="material-symbols-outlined" style="font-size:18px">send</span>
      </button>
    </div>
  `;

  // Scroll to bottom
  const msgs = document.getElementById('convo-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function sendMessage(convoIdx) {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text) return;

  CONVERSATIONS[convoIdx].messages.push({ from: 'operator', text, time: 'just now' });
  input.value = '';
  openConversation(convoIdx);

  // Re-sort conversations: move this one to top
  const convo = CONVERSATIONS.splice(convoIdx, 1)[0];
  CONVERSATIONS.unshift(convo);
  activeConvoIdx = 0;
  renderMessaging();
}

function toggleTemplates() {
  document.getElementById('templates-dropdown').classList.toggle('show');
}

function insertTemplate(templateIdx, clientName) {
  const template = MESSAGE_TEMPLATES[templateIdx];
  const text = template.text.replace('[name]', clientName);
  document.getElementById('msg-input').value = text;
  document.getElementById('templates-dropdown').classList.remove('show');
}

function updateMsgBadge() {
  const unread = CONVERSATIONS.filter(c => c.unread).length;
  const badge = document.getElementById('msg-badge');
  badge.textContent = unread;
  badge.style.display = unread > 0 ? 'inline' : 'none';
}

// ---- Analytics ----
function renderAnalytics() {
  const grid = document.getElementById('analytics-grid');

  // Sessions per week - bar chart
  const maxSessions = Math.max(...ANALYTICS_DATA.sessionsPerWeek);
  const sessionsChart = `
    <div class="simple-bar-chart">
      ${ANALYTICS_DATA.sessionsPerWeek.map((v, i) => `
        <div class="simple-bar">
          <div class="simple-bar-fill" style="height:${Math.round((v / maxSessions) * 140)}px"></div>
          <div class="simple-bar-label">${ANALYTICS_DATA.weekLabels[i]}</div>
        </div>
      `).join('')}
    </div>
  `;

  // Client Status Distribution - donut (CSS conic-gradient)
  const total = ANALYTICS_DATA.clientStatusDist.active + ANALYTICS_DATA.clientStatusDist.inactive + ANALYTICS_DATA.clientStatusDist.lead;
  const activePct = Math.round((ANALYTICS_DATA.clientStatusDist.active / total) * 100);
  const inactivePct = Math.round((ANALYTICS_DATA.clientStatusDist.inactive / total) * 100);
  const leadPct = 100 - activePct - inactivePct;

  const donutChart = `
    <div class="donut-chart" style="background:conic-gradient(var(--green-500) 0% ${activePct}%, var(--slate-400) ${activePct}% ${activePct + inactivePct}%, var(--amber-500) ${activePct + inactivePct}% 100%)">
      <div class="donut-center">${total}</div>
    </div>
    <div class="donut-legend">
      <div class="donut-legend-item"><div class="donut-legend-dot" style="background:var(--green-500)"></div> Active (${ANALYTICS_DATA.clientStatusDist.active})</div>
      <div class="donut-legend-item"><div class="donut-legend-dot" style="background:var(--slate-400)"></div> Inactive (${ANALYTICS_DATA.clientStatusDist.inactive})</div>
      <div class="donut-legend-item"><div class="donut-legend-dot" style="background:var(--amber-500)"></div> Lead (${ANALYTICS_DATA.clientStatusDist.lead})</div>
    </div>
  `;

  // Projects by stage - bar chart
  const stages = Object.entries(ANALYTICS_DATA.projectsByStage);
  const maxProj = Math.max(...stages.map(s => s[1]));
  const projChart = `
    <div class="simple-bar-chart">
      ${stages.map(([label, val]) => `
        <div class="simple-bar">
          <div class="simple-bar-fill" style="height:${Math.round((val / maxProj) * 140)}px;background:var(--amber-500)"></div>
          <div class="simple-bar-label">${label}</div>
        </div>
      `).join('')}
    </div>
  `;

  // Avg days per stage - horizontal bars
  const maxDays = Math.max(...Object.values(ANALYTICS_DATA.avgDaysPerStage));
  const daysChart = `
    <div class="h-bar-chart">
      ${Object.entries(ANALYTICS_DATA.avgDaysPerStage).map(([label, val]) => `
        <div class="h-bar-row">
          <div class="h-bar-label">${label}</div>
          <div class="h-bar-track"><div class="h-bar-fill" style="width:${Math.round((val / maxDays) * 100)}%"></div></div>
          <div class="h-bar-value">${val}d</div>
        </div>
      `).join('')}
    </div>
    <div class="success-metrics-card">
      <h4 style="font-size:14px;font-weight:700;margin-bottom:8px">Client Success Metrics</h4>
      ${Object.entries(ANALYTICS_DATA.successMetrics).map(([key, val]) => {
        const labels = { projectCompletionRate: 'Project Completion Rate', avgProjectDuration: 'Avg Project Duration', clientRetentionRate: 'Client Retention Rate', avgEngagementDuration: 'Avg Engagement Duration' };
        return `<div class="sm-row"><span class="sm-label">${labels[key]}</span><span class="sm-value">${val}</span></div>`;
      }).join('')}
    </div>
  `;

  grid.innerHTML = `
    <div class="analytics-chart"><h4>Sessions Per Week</h4>${sessionsChart}</div>
    <div class="analytics-chart"><h4>Client Status Distribution</h4>${donutChart}</div>
    <div class="analytics-chart"><h4>Projects by Stage</h4>${projChart}</div>
    <div class="analytics-chart"><h4>Avg Days Per Stage</h4>${daysChart}</div>
  `;

  // Date range toggle (visual only, shifts chart data slightly)
  document.querySelectorAll('[data-range]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-range]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Showing data for last ${btn.dataset.range} days`);
    });
  });
}

// ---- Notifications ----
function initNotifications() {
  const bell = document.getElementById('notification-bell');
  const panel = document.getElementById('notification-panel');
  const overlay = document.getElementById('notif-overlay');

  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      closeNotifications();
    } else {
      panel.classList.add('open');
      overlay.classList.add('active');
      renderNotifications();
    }
  });

  overlay.addEventListener('click', closeNotifications);

  // Close notifications when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') &&
        !panel.contains(e.target) &&
        e.target !== bell &&
        !bell.contains(e.target)) {
      closeNotifications();
    }
  });

  document.getElementById('mark-all-read').addEventListener('click', () => {
    NOTIFICATIONS.forEach(n => n.read = true);
    renderNotifications();
    updateNotifBadge();
  });

  updateNotifBadge();
}

function renderNotifications() {
  const body = document.getElementById('notif-panel-body');
  const groups = { today: [], yesterday: [], earlier: [] };
  NOTIFICATIONS.forEach(n => { if (groups[n.group]) groups[n.group].push(n); });

  const typeColors = {
    message: { bg: '#e0e7ff', fg: '#4338ca' },
    calendar: { bg: '#dcfce7', fg: '#16a34a' },
    money: { bg: '#fef3c7', fg: '#d97706' },
    milestone: { bg: '#ede9fe', fg: '#7c3aed' },
    system: { bg: '#f1f5f9', fg: '#64748b' }
  };

  let html = '';
  Object.entries(groups).forEach(([label, items]) => {
    if (items.length === 0) return;
    html += `<div class="notif-group-label">${label}</div>`;
    items.forEach(n => {
      const c = typeColors[n.type] || typeColors.system;
      html += `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead(${n.id})">
          <div class="notif-icon" style="background:${c.bg};color:${c.fg}">
            <span class="material-symbols-outlined">${n.icon}</span>
          </div>
          <div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `;
    });
  });

  body.innerHTML = html;
}

function markNotifRead(id) {
  const notif = NOTIFICATIONS.find(n => n.id === id);
  if (notif) notif.read = true;
  renderNotifications();
  updateNotifBadge();
}

function updateNotifBadge() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge');
  badge.textContent = unread;
  if (unread === 0) badge.classList.add('hidden');
  else badge.classList.remove('hidden');
}

function closeNotifications() {
  document.getElementById('notification-panel').classList.remove('open');
  document.getElementById('notif-overlay').classList.remove('active');
}

// =============================================
// SPRINT 4: Global Search, Settings, FAB, Health Scores
// =============================================

// ---- Global Search ----
function initGlobalSearch() {
  const input = document.getElementById('global-search-input');
  const results = document.getElementById('global-search-results');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.classList.remove('show'); return; }

    let html = '';

    // Search clients
    const matchClients = CLIENTS.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)).slice(0, 4);
    if (matchClients.length) {
      html += '<div class="search-result-group"><div class="search-result-group-label">Clients</div>';
      matchClients.forEach(c => {
        html += `<div class="search-result-item" onclick="closeSearch();openClientDetail(${c.id})">
          <span class="material-symbols-outlined">person</span>
          <div><div class="search-result-text">${c.name}</div><div class="search-result-ctx">${c.company} &middot; ${c.plan}</div></div>
        </div>`;
      });
      html += '</div>';
    }

    // Search documents
    const matchDocs = DOCUMENTS.filter(d => d.name.toLowerCase().includes(q)).slice(0, 4);
    if (matchDocs.length) {
      html += '<div class="search-result-group"><div class="search-result-group-label">Documents</div>';
      matchDocs.forEach(d => {
        const client = CLIENTS.find(c => c.id === d.clientId);
        html += `<div class="search-result-item" onclick="closeSearch();navigateToView('documents');selectDocClient(${d.clientId});selectDocument(${d.id})">
          <span class="material-symbols-outlined">description</span>
          <div><div class="search-result-text">${d.name}</div><div class="search-result-ctx">${client ? client.name : ''}</div></div>
        </div>`;
      });
      html += '</div>';
    }

    // Search events
    const matchEvents = CALENDAR_EVENTS.filter(e => e.title.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q)).slice(0, 4);
    if (matchEvents.length) {
      html += '<div class="search-result-group"><div class="search-result-group-label">Events</div>';
      matchEvents.forEach(e => {
        html += `<div class="search-result-item" onclick="closeSearch();navigateToView('calendar')">
          <span class="material-symbols-outlined">event</span>
          <div><div class="search-result-text">${e.title}</div><div class="search-result-ctx">${e.clientName} &middot; ${formatDate(e.date)}</div></div>
        </div>`;
      });
      html += '</div>';
    }

    // Search pipeline
    const matchPipeline = PIPELINE_CARDS.filter(p => p.project.toLowerCase().includes(q) || p.company.toLowerCase().includes(q)).slice(0, 4);
    if (matchPipeline.length) {
      html += '<div class="search-result-group"><div class="search-result-group-label">Pipeline</div>';
      matchPipeline.forEach(p => {
        html += `<div class="search-result-item" onclick="closeSearch();navigateToView('pipeline')">
          <span class="material-symbols-outlined">view_kanban</span>
          <div><div class="search-result-text">${p.project}</div><div class="search-result-ctx">${p.company} &middot; ${STAGE_LABELS[p.stage]}</div></div>
        </div>`;
      });
      html += '</div>';
    }

    if (html) {
      results.innerHTML = html;
      results.classList.add('show');
    } else {
      results.innerHTML = '<div style="padding:24px;text-align:center;color:var(--slate-500);font-size:14px">No results found</div>';
      results.classList.add('show');
    }
  });

  // Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.global-search-wrapper')) {
      closeSearch();
    }
  });
}

function closeSearch() {
  document.getElementById('global-search-results').classList.remove('show');
  document.getElementById('global-search-input').value = '';
}

// ---- Settings ----
function renderSettings() {
  const s = OPERATOR_SETTINGS;
  document.getElementById('settings-content').innerHTML = `
    <div class="settings-section">
      <h3>Profile</h3>
      <div class="settings-row">
        <div class="settings-field"><label>Name</label><input type="text" id="s-name" value="${s.name}"></div>
        <div class="settings-field"><label>Business Name</label><input type="text" id="s-biz" value="${s.businessName}"></div>
      </div>
      <div class="settings-row">
        <div class="settings-field"><label>Email</label><input type="email" id="s-email" value="${s.email}"></div>
        <div class="settings-field"><label>Phone</label><input type="text" id="s-phone" value="${s.phone}"></div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:8px">
        <div class="user-avatar" style="width:64px;height:64px;font-size:24px">AW</div>
        <button class="btn-secondary" onclick="showToast('Avatar upload simulated')">Upload Photo</button>
      </div>
    </div>

    <div class="settings-section">
      <h3>Business Settings</h3>
      <div class="settings-row">
        <div class="settings-field">
          <label>Default Session Duration</label>
          <select id="s-duration">
            <option value="30" ${s.defaultSessionDuration === 30 ? 'selected' : ''}>30 minutes</option>
            <option value="45" ${s.defaultSessionDuration === 45 ? 'selected' : ''}>45 minutes</option>
            <option value="60" ${s.defaultSessionDuration === 60 ? 'selected' : ''}>60 minutes</option>
          </select>
        </div>
        <div class="settings-field">
          <label>Timezone</label>
          <select id="s-tz">
            <option ${s.timezone === 'America/New_York' ? 'selected' : ''}>America/New_York</option>
            <option ${s.timezone === 'America/Chicago' ? 'selected' : ''}>America/Chicago</option>
            <option ${s.timezone === 'America/Denver' ? 'selected' : ''}>America/Denver</option>
            <option ${s.timezone === 'America/Los_Angeles' ? 'selected' : ''}>America/Los_Angeles</option>
          </select>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-field"><label>Working Hours Start</label><input type="time" id="s-wh-start" value="${s.workingHoursStart}"></div>
        <div class="settings-field"><label>Working Hours End</label><input type="time" id="s-wh-end" value="${s.workingHoursEnd}"></div>
      </div>
    </div>

    <div class="settings-section">
      <h3>Plans & Pricing</h3>
      <div class="plan-cards-settings">
        ${s.plans.map((p, i) => `
          <div class="plan-card-edit">
            <h4>${p.name}</h4>
            <div>$<input type="number" class="plan-price-input" id="s-plan-price-${i}" value="${p.price}"><span style="font-size:14px;color:var(--slate-500)">/mo</span></div>
            <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="settings-section">
      <h3>Notifications</h3>
      ${Object.entries(s.notifications).map(([key, val]) => {
        const labels = { email: 'Email Notifications', sessionReminders: 'Session Reminders', paymentAlerts: 'Payment Alerts', clientActivity: 'Client Activity Alerts' };
        return `
          <div class="toggle-row">
            <span class="toggle-label">${labels[key]}</span>
            <label class="toggle-switch">
              <input type="checkbox" id="s-notif-${key}" ${val ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        `;
      }).join('')}
    </div>

    <button class="btn-primary" style="margin-top:8px" onclick="saveSettings()">Save Settings</button>
  `;
}

function saveSettings() {
  OPERATOR_SETTINGS.name = document.getElementById('s-name').value;
  OPERATOR_SETTINGS.businessName = document.getElementById('s-biz').value;
  OPERATOR_SETTINGS.email = document.getElementById('s-email').value;
  OPERATOR_SETTINGS.phone = document.getElementById('s-phone').value;
  OPERATOR_SETTINGS.defaultSessionDuration = parseInt(document.getElementById('s-duration').value);
  OPERATOR_SETTINGS.timezone = document.getElementById('s-tz').value;
  OPERATOR_SETTINGS.workingHoursStart = document.getElementById('s-wh-start').value;
  OPERATOR_SETTINGS.workingHoursEnd = document.getElementById('s-wh-end').value;

  OPERATOR_SETTINGS.plans.forEach((p, i) => {
    p.price = parseInt(document.getElementById('s-plan-price-' + i).value) || p.price;
  });

  OPERATOR_SETTINGS.notifications.email = document.getElementById('s-notif-email').checked;
  OPERATOR_SETTINGS.notifications.sessionReminders = document.getElementById('s-notif-sessionReminders').checked;
  OPERATOR_SETTINGS.notifications.paymentAlerts = document.getElementById('s-notif-paymentAlerts').checked;
  OPERATOR_SETTINGS.notifications.clientActivity = document.getElementById('s-notif-clientActivity').checked;

  showToast('Settings saved successfully');
}

// ---- FAB (Quick Actions) ----
function initFAB() {
  const container = document.getElementById('fab-container');
  const mainBtn = document.getElementById('fab-main');

  mainBtn.addEventListener('click', () => {
    container.classList.toggle('open');
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.fab-container')) {
      container.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') container.classList.remove('open');
  });

  // Action handlers
  document.querySelectorAll('.fab-action').forEach(btn => {
    btn.addEventListener('click', () => {
      container.classList.remove('open');
      const action = btn.dataset.action;
      if (action === 'add-client') {
        openOnboardingWizard();
      } else if (action === 'schedule') {
        navigateToView('calendar');
        // open quick add with today's defaults
        openCalEventForm('2026-03-27', '10:00');
      } else if (action === 'new-doc') {
        navigateToView('documents');
        showToast('Select a client folder, then click New');
      } else if (action === 'send-msg') {
        navigateToView('messaging');
      }
    });
  });
}

// ---- Client Health Scores ----
function initClientHealthScores() {
  // Health scores already in client data, this function ensures dashboard reflects them
  // The renderClientList and renderDashboard already incorporate health scores
}

// =============================================
// UTILITIES
// =============================================

function formatCurrency(amount) {
  return '$' + amount.toLocaleString('en-US');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
