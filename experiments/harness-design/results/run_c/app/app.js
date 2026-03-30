// ============================================================
// APP.JS — Operator Dashboard - All application logic
// ============================================================

// ============================================================
// STATE
// ============================================================
let currentPage = 'dashboard';
let selectedClients = new Set();
let clientSort = { col: 'name', dir: 'asc' };
let clientFilters = { status: '', plan: '', search: '' };
let calendarView = 'week';
let calendarDate = new Date(TODAY);
let selectedDocClient = null;
let selectedDoc = null;
let onboardingStep = 1;
let onboardingData = {};
let activeConversation = null;
let analyticsRange = '30';
let chartInstances = {};

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page, opts) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard: 'Dashboard', clients: 'Clients', 'client-detail': 'Client Detail',
    pipeline: 'Pipeline', calendar: 'Calendar', documents: 'Documents',
    'ai-tools': 'AI Tools', revenue: 'Revenue', messaging: 'Messaging',
    analytics: 'Analytics', settings: 'Settings'
  };
  document.getElementById('header-title').textContent = titles[page] || page;

  // Render page
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'clients': renderClients(); break;
    case 'client-detail': renderClientDetail(opts); break;
    case 'pipeline': renderPipeline(); break;
    case 'calendar': renderCalendar(); break;
    case 'documents': renderDocuments(); break;
    case 'ai-tools': renderAITools(); break;
    case 'revenue': renderRevenue(); break;
    case 'messaging': renderMessaging(opts); break;
    case 'analytics': renderAnalytics(); break;
    case 'settings': renderSettings(); break;
  }

  closeMobileSidebar();
  closeSearch();
  closeNotifications();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  const icon = document.getElementById('sidebar-toggle-icon');
  icon.innerHTML = sidebar.classList.contains('collapsed') ? '&#9654;' : '&#9664;';
}

function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const activeClients = CLIENTS.filter(c => c.status === 'active').length;
  const interviewsThisMonth = PIPELINE.filter(p => p.stage === 'interviewing' || p.stage === 'offer').length;
  const monthlyRevenue = CLIENTS.filter(c => c.status === 'active').reduce((sum, c) => {
    const plan = PLANS.find(p => p.id === c.plan);
    return sum + (plan ? plan.price : 0);
  }, 0);
  const pendingTasks = 8;

  const needsAttention = CLIENTS
    .filter(c => c.status === 'active')
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 6)
    .map(c => {
      let reason = '';
      const daysSince = Math.floor((TODAY - c.lastActivity) / 86400000);
      if (daysSince > 14) reason = `Resume not updated in ${daysSince} days`;
      else if (!c.nextSession) reason = 'No upcoming session scheduled';
      else if (INVOICES.find(i => i.clientId === c.id && i.status === 'overdue')) reason = 'Invoice overdue';
      else if (PIPELINE.find(p => p.clientId === c.id && p.stage === 'applied')) reason = 'New application submitted - review needed';
      else if (daysSince > 7) reason = `No activity in ${daysSince} days`;
      else reason = 'Application follow-up needed';
      return { ...c, reason };
    });

  const todayEvents = CALENDAR_EVENTS
    .filter(e => e.date.toDateString() === TODAY.toDateString())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const page = document.getElementById('page-dashboard');
  page.innerHTML = `
    <div class="metric-cards">
      <div class="metric-card">
        <div class="metric-label">Active Clients</div>
        <div class="metric-value">${activeClients}</div>
        <div class="metric-trend up">&#9650; 12% vs last month</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Interviews This Month</div>
        <div class="metric-value">${interviewsThisMonth}</div>
        <div class="metric-trend up">&#9650; 25% vs last month</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Monthly Revenue</div>
        <div class="metric-value">$${monthlyRevenue.toLocaleString()}</div>
        <div class="metric-trend up">&#9650; 8% vs last month</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Pending Tasks</div>
        <div class="metric-value">${pendingTasks}</div>
        <div class="metric-trend down">&#9660; 3 from yesterday</div>
      </div>
    </div>
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <h3>Needs Attention</h3>
          <span style="font-size:0.8rem;color:var(--slate-500)">${needsAttention.length} clients</span>
        </div>
        <div class="card-body">
          ${needsAttention.map(c => {
            const scoreColor = c.healthScore >= 70 ? 'green' : c.healthScore >= 40 ? 'yellow' : 'red';
            const scoreBg = c.healthScore >= 70 ? 'var(--success-light)' : c.healthScore >= 40 ? 'var(--warning-light)' : 'var(--danger-light)';
            const scoreFg = c.healthScore >= 70 ? '#065F46' : c.healthScore >= 40 ? '#92400E' : '#991B1B';
            return `
              <div class="needs-attention-item" onclick="navigateTo('client-detail', {clientId: ${c.id}})">
                <div class="avatar sm">${c.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="attention-reason">
                  <div class="attention-client">${c.name}</div>
                  <div>${c.reason}</div>
                </div>
                <span class="attention-score" style="background:${scoreBg};color:${scoreFg}">${c.healthScore}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3>Today's Schedule</h3>
          <span style="font-size:0.8rem;color:var(--slate-500)">${todayEvents.length} events</span>
        </div>
        <div class="card-body">
          ${todayEvents.length === 0 ? '<p style="color:var(--slate-500);text-align:center;padding:20px">No events today</p>' : ''}
          ${todayEvents.map(e => `
            <div class="schedule-item">
              <div class="schedule-type-dot ${e.type}"></div>
              <div class="schedule-time">${e.startTime}</div>
              <div class="schedule-info">
                <div class="schedule-title">${e.title}</div>
                <div class="schedule-client">${e.clientName || 'Internal'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// CLIENTS LIST
// ============================================================
function renderClients() {
  let filtered = [...CLIENTS];

  if (clientFilters.search) {
    const s = clientFilters.search.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(s));
  }
  if (clientFilters.status) {
    filtered = filtered.filter(c => c.status === clientFilters.status);
  }
  if (clientFilters.plan) {
    filtered = filtered.filter(c => c.plan === clientFilters.plan);
  }

  // Sort
  filtered.sort((a, b) => {
    let va, vb;
    switch (clientSort.col) {
      case 'name': va = a.name; vb = b.name; break;
      case 'lastActivity': va = a.lastActivity; vb = b.lastActivity; break;
      case 'health': va = a.healthScore; vb = b.healthScore; break;
      default: va = a.name; vb = b.name;
    }
    if (va < vb) return clientSort.dir === 'asc' ? -1 : 1;
    if (va > vb) return clientSort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  const selectedCount = selectedClients.size;

  const page = document.getElementById('page-clients');
  page.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2>Clients</h2>
      <button class="btn btn-primary" onclick="openOnboarding()">+ Add Client</button>
    </div>
    <div class="table-controls">
      <input type="text" class="search-input" placeholder="Search clients..." value="${clientFilters.search}" oninput="clientFilters.search=this.value;renderClients()">
      <select onchange="clientFilters.status=this.value;renderClients()">
        <option value="">All Status</option>
        <option value="active" ${clientFilters.status==='active'?'selected':''}>Active</option>
        <option value="paused" ${clientFilters.status==='paused'?'selected':''}>Paused</option>
        <option value="completed" ${clientFilters.status==='completed'?'selected':''}>Completed</option>
      </select>
      <select onchange="clientFilters.plan=this.value;renderClients()">
        <option value="">All Plans</option>
        <option value="basic" ${clientFilters.plan==='basic'?'selected':''}>Basic</option>
        <option value="pro" ${clientFilters.plan==='pro'?'selected':''}>Pro</option>
        <option value="premium" ${clientFilters.plan==='premium'?'selected':''}>Premium</option>
      </select>
    </div>
    <div class="bulk-bar ${selectedCount > 0 ? 'visible' : ''}" id="bulk-bar">
      <span class="bulk-count">${selectedCount}</span> client${selectedCount !== 1 ? 's' : ''} selected
      <button class="btn btn-sm btn-primary" onclick="showToast('Message sent to '+selectedClients.size+' clients')">Send Message</button>
      <button class="btn btn-sm btn-secondary" onclick="showToast('Exported '+selectedClients.size+' clients')">Export</button>
      <button class="btn btn-sm btn-secondary" onclick="selectedClients.clear();renderClients()">Clear</button>
    </div>
    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width:40px"><div class="checkbox ${selectedClients.size === filtered.length && filtered.length > 0 ? 'checked' : ''}" onclick="toggleAllClients(${JSON.stringify(filtered.map(c=>c.id)).replace(/"/g, '&quot;')})">
                ${selectedClients.size === filtered.length && filtered.length > 0 ? '&#10003;' : ''}
              </div></th>
              <th class="${clientSort.col==='name'?'sorted':''}" onclick="sortClients('name')">Name <span class="sort-arrow">${clientSort.col==='name' ? (clientSort.dir==='asc'?'&#9650;':'&#9660;') : '&#9650;'}</span></th>
              <th>Plan</th>
              <th>Status</th>
              <th>Health</th>
              <th class="${clientSort.col==='lastActivity'?'sorted':''}" onclick="sortClients('lastActivity')">Last Activity <span class="sort-arrow">${clientSort.col==='lastActivity' ? (clientSort.dir==='asc'?'&#9650;':'&#9660;') : '&#9650;'}</span></th>
              <th>Next Session</th>
              <th style="width:50px">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(c => {
              const initials = c.name.split(' ').map(n => n[0]).join('');
              const isSelected = selectedClients.has(c.id);
              const healthColor = c.healthScore >= 70 ? 'green' : c.healthScore >= 40 ? 'yellow' : 'red';
              const concern = getHealthConcern(c);
              return `
                <tr onclick="navigateTo('client-detail', {clientId: ${c.id}})">
                  <td onclick="event.stopPropagation()"><div class="checkbox ${isSelected?'checked':''}" onclick="toggleClient(${c.id})">${isSelected?'&#10003;':''}</div></td>
                  <td>
                    <div class="client-name-cell">
                      <div class="avatar sm">${initials}</div>
                      <div>
                        <div class="name">${c.name}</div>
                        <div class="email">${c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge ${c.plan}">${c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}</span></td>
                  <td><span class="badge ${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
                  <td>
                    <div class="health-bar">
                      <div class="health-bar-track"><div class="health-bar-fill ${healthColor}" style="width:${c.healthScore}%"></div></div>
                      <span class="health-score-num ${healthColor}">${c.healthScore}</span>
                      <div class="tooltip">Score: ${c.healthScore} - ${concern}</div>
                    </div>
                  </td>
                  <td style="color:var(--slate-500)">${relativeDate(c.lastActivity)}</td>
                  <td style="color:var(--slate-500)">${c.nextSession ? formatDate(c.nextSession) : '<span style="color:var(--danger)">Not scheduled</span>'}</td>
                  <td onclick="event.stopPropagation()">
                    <div class="dots-menu">
                      <button class="dots-btn" onclick="toggleDotsMenu(this)">&#8943;</button>
                      <div class="dots-dropdown">
                        <button class="dots-dropdown-item" onclick="navigateTo('client-detail',{clientId:${c.id}})">View Profile</button>
                        <button class="dots-dropdown-item" onclick="navigateTo('messaging',{clientId:${c.id}})">Send Message</button>
                        <button class="dots-dropdown-item" onclick="showToast('Session scheduled with ${c.name}')">Schedule Session</button>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function sortClients(col) {
  if (clientSort.col === col) {
    clientSort.dir = clientSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    clientSort.col = col;
    clientSort.dir = 'asc';
  }
  renderClients();
}

function toggleClient(id) {
  if (selectedClients.has(id)) selectedClients.delete(id);
  else selectedClients.add(id);
  renderClients();
}

function toggleAllClients(ids) {
  const allIds = JSON.parse(ids.replace(/&quot;/g, '"'));
  if (selectedClients.size === allIds.length) {
    selectedClients.clear();
  } else {
    allIds.forEach(id => selectedClients.add(id));
  }
  renderClients();
}

function toggleDotsMenu(btn) {
  const dropdown = btn.nextElementSibling;
  document.querySelectorAll('.dots-dropdown.open').forEach(d => {
    if (d !== dropdown) d.classList.remove('open');
  });
  dropdown.classList.toggle('open');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dots-menu')) {
    document.querySelectorAll('.dots-dropdown.open').forEach(d => d.classList.remove('open'));
  }
  if (!e.target.closest('.version-dropdown') && !e.target.closest('.doc-version')) {
    document.querySelectorAll('.version-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

// ============================================================
// CLIENT DETAIL
// ============================================================
let clientDetailTab = 'overview';

function renderClientDetail(opts) {
  const clientId = opts?.clientId;
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) { navigateTo('clients'); return; }

  const initials = client.name.split(' ').map(n => n[0]).join('');
  const healthColor = client.healthScore >= 70 ? 'green' : client.healthScore >= 40 ? 'yellow' : 'red';
  const breakdown = getHealthBreakdown(client);
  const clientDocs = DOCUMENTS.filter(d => d.clientId === client.id);
  const clientPipeline = PIPELINE.filter(p => p.clientId === client.id);

  // Activity timeline
  const activities = [
    { type: 'session', text: 'Coaching call completed', time: daysAgo(1) },
    { type: 'resume', text: 'Resume updated to v' + (clientDocs.find(d => d.type === 'resume')?.version || 1), time: daysAgo(2) },
    { type: 'application', text: `Applied to ${client.targetRole} at ${client.targetCompany}`, time: daysAgo(5) },
    { type: 'interview', text: 'Phone screen scheduled', time: daysAgo(7) },
    { type: 'message', text: 'Follow-up message sent', time: daysAgo(8) },
    { type: 'session', text: 'Resume review session', time: daysAgo(10) },
    { type: 'application', text: 'Application materials prepared', time: daysAgo(12) },
    { type: 'session', text: 'Initial strategy session', time: daysAgo(14) },
    { type: 'message', text: 'Onboarding welcome message sent', time: client.startDate },
  ];

  const page = document.getElementById('page-client-detail');
  page.innerHTML = `
    <div class="breadcrumb">
      <a href="#" onclick="navigateTo('clients');return false">Clients</a> / ${client.name}
    </div>
    <div class="client-detail-header">
      <div class="avatar xl">${initials}</div>
      <div class="client-detail-info">
        <h2>${client.name} <span class="badge ${client.plan}" style="margin-left:8px">${client.plan.charAt(0).toUpperCase() + client.plan.slice(1)}</span> <span class="badge ${client.status}">${client.status.charAt(0).toUpperCase() + client.status.slice(1)}</span></h2>
        <div class="client-detail-meta">
          <span>${client.email}</span>
          <span>${client.phone}</span>
          <a href="#">${client.linkedin}</a>
        </div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div class="health-bar" style="justify-content:flex-end">
          <div class="health-bar-track" style="width:80px"><div class="health-bar-fill ${healthColor}" style="width:${client.healthScore}%"></div></div>
          <span class="health-score-num ${healthColor}" style="font-size:1.2rem">${client.healthScore}</span>
        </div>
        <div style="font-size:0.75rem;color:var(--slate-500);margin-top:4px">Health Score</div>
      </div>
    </div>

    <div class="tabs">
      <div class="tab ${clientDetailTab==='overview'?'active':''}" onclick="clientDetailTab='overview';renderClientDetail({clientId:${client.id}})">Overview</div>
      <div class="tab ${clientDetailTab==='documents'?'active':''}" onclick="clientDetailTab='documents';renderClientDetail({clientId:${client.id}})">Documents</div>
      <div class="tab ${clientDetailTab==='activity'?'active':''}" onclick="clientDetailTab='activity';renderClientDetail({clientId:${client.id}})">Activity</div>
      <div class="tab ${clientDetailTab==='applications'?'active':''}" onclick="clientDetailTab='applications';renderClientDetail({clientId:${client.id}})">Applications</div>
    </div>

    <div class="tab-content ${clientDetailTab==='overview'?'active':''}" id="tab-overview">
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px">
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><h3>About</h3></div>
            <div class="card-body">
              <p style="margin-bottom:12px">${client.bio}</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.85rem">
                <div><strong>Start Date:</strong> ${formatDate(client.startDate)}</div>
                <div><strong>Sessions:</strong> ${client.sessions} completed</div>
                <div><strong>Target Role:</strong> ${client.targetRole}</div>
                <div><strong>Target Company:</strong> ${client.targetCompany}</div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h3>Operator Notes</h3></div>
            <div class="card-body">
              <textarea style="width:100%;min-height:100px;border:1px solid var(--slate-200);border-radius:var(--radius-sm);padding:12px" id="client-notes-${client.id}" oninput="updateClientNotes(${client.id}, this.value)">${client.notes}</textarea>
            </div>
          </div>
        </div>
        <div>
          <div class="card">
            <div class="card-header"><h3>Health Breakdown</h3></div>
            <div class="card-body">
              ${Object.values(breakdown).map(f => `
                <div class="health-factor" style="margin-bottom:8px">
                  <span style="flex:1">${f.label}</span>
                  <span class="health-factor-score">+${f.score}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-content ${clientDetailTab==='documents'?'active':''}">
      ${clientDocs.length === 0 ? '<div style="text-align:center;padding:40px;color:var(--slate-500)"><p>No documents yet</p><button class="btn btn-primary" onclick="openNewDocModal()">Create Document</button></div>' : ''}
      ${clientDocs.map(d => `
        <div class="doc-row" style="border:1px solid var(--slate-200);border-radius:var(--radius-sm);margin-bottom:8px" onclick="selectedDocClient=${client.id};selectedDoc=${d.id};navigateTo('documents')">
          <span class="doc-icon">${d.type === 'resume' ? '&#128196;' : d.type === 'cover_letter' ? '&#9993;' : '&#128203;'}</span>
          <div class="doc-info">
            <div class="doc-name">${d.name}</div>
            <div class="doc-meta">Modified ${relativeDate(d.lastModified)}</div>
          </div>
          <span class="doc-version">v${d.version}</span>
        </div>
      `).join('')}
    </div>

    <div class="tab-content ${clientDetailTab==='activity'?'active':''}">
      <div class="timeline">
        ${activities.map(a => `
          <div class="timeline-item">
            <div class="timeline-dot ${a.type}">
              ${a.type === 'session' ? '&#9830;' : a.type === 'resume' ? '&#9997;' : a.type === 'application' ? '&#9733;' : a.type === 'interview' ? '&#9716;' : '&#9993;'}
            </div>
            <div class="timeline-content">${a.text}</div>
            <div class="timeline-time">${relativeDate(a.time)} - ${formatDate(a.time)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="tab-content ${clientDetailTab==='applications'?'active':''}">
      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr><th>Company</th><th>Role</th><th>Date Applied</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${clientPipeline.map(p => `
                <tr>
                  <td style="font-weight:600">${p.company}</td>
                  <td>${p.role}</td>
                  <td style="color:var(--slate-500)">${formatDate(p.applicationDate)}</td>
                  <td><span class="badge ${p.stage === 'offer' ? 'offer' : p.stage === 'interviewing' ? 'interviewing' : p.stage === 'closed' ? 'completed' : 'applied'}">${p.stage.charAt(0).toUpperCase() + p.stage.slice(1)}</span></td>
                </tr>
              `).join('')}
              ${clientPipeline.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:var(--slate-500);padding:20px">No applications yet</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function updateClientNotes(clientId, value) {
  const client = CLIENTS.find(c => c.id === clientId);
  if (client) client.notes = value;
}

// ============================================================
// ONBOARDING WIZARD
// ============================================================
function openOnboarding() {
  onboardingStep = 1;
  onboardingData = { name: '', email: '', phone: '', linkedin: '', plan: '', goals: '', targetRoles: '', experience: '' };
  document.getElementById('onboarding-modal').classList.add('open');
  renderOnboardingStep();
}

function closeOnboarding() {
  document.getElementById('onboarding-modal').classList.remove('open');
}

function renderOnboardingStep() {
  const body = document.getElementById('onboarding-body');
  const steps = ['Basic Info', 'Select Plan', 'Intake', 'Review'];

  let stepHtml = `<div class="step-indicator">`;
  steps.forEach((s, i) => {
    const num = i + 1;
    const state = num < onboardingStep ? 'done' : num === onboardingStep ? 'active' : '';
    stepHtml += `<div class="step ${state}"><div class="step-num">${num < onboardingStep ? '&#10003;' : num}</div><span class="step-label">${s}</span></div>`;
    if (i < steps.length - 1) stepHtml += `<div class="step-line"></div>`;
  });
  stepHtml += `</div>`;

  let formHtml = '';
  if (onboardingStep === 1) {
    formHtml = `
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="ob-name" value="${onboardingData.name}" placeholder="e.g. Jane Smith">
        <div class="form-error" id="ob-name-error">Name is required</div>
      </div>
      <div class="form-group">
        <label>Email *</label>
        <input type="email" id="ob-email" value="${onboardingData.email}" placeholder="e.g. jane@example.com">
        <div class="form-error" id="ob-email-error">Please enter a valid email</div>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="text" id="ob-phone" value="${onboardingData.phone}" placeholder="(555) 123-4567">
      </div>
      <div class="form-group">
        <label>LinkedIn URL</label>
        <input type="text" id="ob-linkedin" value="${onboardingData.linkedin}" placeholder="linkedin.com/in/janesmith">
      </div>
    `;
  } else if (onboardingStep === 2) {
    formHtml = `
      <div class="plan-cards">
        ${PLANS.map(p => `
          <div class="plan-card ${onboardingData.plan === p.id ? 'selected' : ''}" onclick="onboardingData.plan='${p.id}';renderOnboardingStep()">
            <div class="plan-name">${p.name}</div>
            <div class="plan-price">$${p.price}/mo</div>
            <ul class="plan-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>
      <div class="form-error" id="ob-plan-error" style="text-align:center;margin-top:8px">Please select a plan</div>
    `;
  } else if (onboardingStep === 3) {
    formHtml = `
      <div class="form-group">
        <label>Career Goals</label>
        <textarea id="ob-goals" rows="3" placeholder="What are the client's career objectives?">${onboardingData.goals}</textarea>
      </div>
      <div class="form-group">
        <label>Target Roles</label>
        <input type="text" id="ob-roles" value="${onboardingData.targetRoles}" placeholder="e.g. Senior Product Manager, VP Product">
      </div>
      <div class="form-group">
        <label>Experience Level</label>
        <select id="ob-experience">
          <option value="">Select...</option>
          <option value="entry" ${onboardingData.experience==='entry'?'selected':''}>Entry Level (0-2 years)</option>
          <option value="mid" ${onboardingData.experience==='mid'?'selected':''}>Mid Level (3-7 years)</option>
          <option value="senior" ${onboardingData.experience==='senior'?'selected':''}>Senior (8-15 years)</option>
          <option value="exec" ${onboardingData.experience==='exec'?'selected':''}>Executive (15+ years)</option>
        </select>
      </div>
    `;
  } else if (onboardingStep === 4) {
    const plan = PLANS.find(p => p.id === onboardingData.plan);
    formHtml = `
      <div style="background:var(--slate-100);border-radius:var(--radius);padding:16px;margin-bottom:16px">
        <h4 style="margin-bottom:12px">Review Client Information</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.9rem">
          <div><strong>Name:</strong> ${onboardingData.name}</div>
          <div><strong>Email:</strong> ${onboardingData.email}</div>
          <div><strong>Phone:</strong> ${onboardingData.phone || 'N/A'}</div>
          <div><strong>LinkedIn:</strong> ${onboardingData.linkedin || 'N/A'}</div>
          <div><strong>Plan:</strong> ${plan ? plan.name + ' ($' + plan.price + '/mo)' : 'N/A'}</div>
          <div><strong>Experience:</strong> ${onboardingData.experience || 'N/A'}</div>
        </div>
        ${onboardingData.goals ? `<div style="margin-top:8px"><strong>Goals:</strong> ${onboardingData.goals}</div>` : ''}
        ${onboardingData.targetRoles ? `<div style="margin-top:4px"><strong>Target Roles:</strong> ${onboardingData.targetRoles}</div>` : ''}
      </div>
    `;
  }

  let footerHtml = `<div class="modal-footer" style="border-top:1px solid var(--slate-200);margin:0 -24px -24px;padding:16px 24px">`;
  if (onboardingStep > 1) footerHtml += `<button class="btn btn-secondary" onclick="onboardingStep--;renderOnboardingStep()">Back</button>`;
  footerHtml += `<div style="flex:1"></div>`;
  if (onboardingStep < 4) footerHtml += `<button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>`;
  else footerHtml += `<button class="btn btn-success" onclick="completeOnboarding()">Confirm & Add Client</button>`;
  footerHtml += `</div>`;

  body.innerHTML = stepHtml + formHtml + footerHtml;
}

function nextOnboardingStep() {
  if (onboardingStep === 1) {
    const name = document.getElementById('ob-name').value.trim();
    const email = document.getElementById('ob-email').value.trim();
    let valid = true;
    if (!name) { document.getElementById('ob-name-error').classList.add('visible'); document.getElementById('ob-name').classList.add('error'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('ob-email-error').classList.add('visible'); document.getElementById('ob-email').classList.add('error'); valid = false; }
    if (!valid) return;
    onboardingData.name = name;
    onboardingData.email = email;
    onboardingData.phone = document.getElementById('ob-phone').value.trim();
    onboardingData.linkedin = document.getElementById('ob-linkedin').value.trim();
  } else if (onboardingStep === 2) {
    if (!onboardingData.plan) { document.getElementById('ob-plan-error').classList.add('visible'); return; }
  } else if (onboardingStep === 3) {
    onboardingData.goals = document.getElementById('ob-goals').value.trim();
    onboardingData.targetRoles = document.getElementById('ob-roles').value.trim();
    onboardingData.experience = document.getElementById('ob-experience').value;
  }
  onboardingStep++;
  renderOnboardingStep();
}

function completeOnboarding() {
  const newId = Math.max(...CLIENTS.map(c => c.id)) + 1;
  const newClient = {
    id: newId,
    name: onboardingData.name,
    email: onboardingData.email,
    phone: onboardingData.phone,
    linkedin: onboardingData.linkedin,
    plan: onboardingData.plan,
    status: 'active',
    startDate: TODAY,
    lastActivity: TODAY,
    nextSession: daysFromNow(3),
    healthScore: 65,
    bio: onboardingData.goals || 'New client',
    notes: '',
    avatar: null,
    sessions: 0,
    targetRole: onboardingData.targetRoles || '',
    targetCompany: ''
  };
  CLIENTS.push(newClient);
  closeOnboarding();
  showToast(`${onboardingData.name} has been added as a new client!`, 'success');
  navigateTo('clients');
}

// ============================================================
// PIPELINE / KANBAN
// ============================================================
const STAGES = ['preparing', 'applied', 'screening', 'interviewing', 'offer', 'closed'];
const STAGE_LABELS = { preparing: 'Preparing', applied: 'Applied', screening: 'Screening', interviewing: 'Interviewing', offer: 'Offer', closed: 'Closed' };

function renderPipeline() {
  const page = document.getElementById('page-pipeline');
  page.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2>Pipeline</h2>
    </div>
    <div class="kanban-board">
      ${STAGES.map(stage => {
        const cards = PIPELINE.filter(p => p.stage === stage);
        return `
          <div class="kanban-column" data-stage="${stage}"
               ondragover="event.preventDefault();this.classList.add('drag-over')"
               ondragleave="this.classList.remove('drag-over')"
               ondrop="dropCard(event, '${stage}');this.classList.remove('drag-over')">
            <div class="kanban-column-header">
              <span class="kanban-column-title">${STAGE_LABELS[stage]}</span>
              <span class="kanban-column-count">${cards.length}</span>
            </div>
            <div class="kanban-cards">
              ${cards.map(c => `
                <div class="kanban-card ${c.stage === 'interviewing' || c.stage === 'offer' ? 'highlight' : ''}"
                     draggable="true"
                     ondragstart="dragCard(event, ${c.id})"
                     ondragend="this.classList.remove('dragging')"
                     onclick="showCardPopover(event, ${c.id})">
                  <div class="card-client">${c.clientName}</div>
                  <div class="card-company">${c.company}</div>
                  <div class="card-role">${c.role}</div>
                  <div class="card-days">${c.daysInStage} days</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function dragCard(event, cardId) {
  event.dataTransfer.setData('text/plain', cardId);
  event.target.classList.add('dragging');
}

function dropCard(event, newStage) {
  event.preventDefault();
  const cardId = parseInt(event.dataTransfer.getData('text/plain'));
  const card = PIPELINE.find(p => p.id === cardId);
  if (card && card.stage !== newStage) {
    card.stage = newStage;
    card.daysInStage = 0;
    renderPipeline();
    showToast(`${card.clientName} moved to ${STAGE_LABELS[newStage]}`);
  }
}

function showCardPopover(event, cardId) {
  event.stopPropagation();
  const card = PIPELINE.find(p => p.id === cardId);
  if (!card) return;

  const popover = document.getElementById('kanban-popover');
  document.getElementById('popover-title').textContent = `${card.clientName} - ${card.company}`;
  document.getElementById('popover-body').innerHTML = `
    <div style="font-size:0.85rem">
      <p><strong>Role:</strong> ${card.role}</p>
      <p style="margin-top:6px"><strong>Applied:</strong> ${formatDate(card.applicationDate)}</p>
      <p style="margin-top:6px"><strong>Source:</strong> ${card.source}</p>
      <p style="margin-top:6px"><strong>Days in Stage:</strong> ${card.daysInStage}</p>
      <p style="margin-top:6px"><strong>Notes:</strong> ${card.notes}</p>
      <div style="margin-top:12px">
        <a href="#" onclick="navigateTo('client-detail',{clientId:${card.clientId}});closePopover();return false" style="font-size:0.85rem">View Client Profile &#8594;</a>
      </div>
    </div>
  `;
  popover.style.top = Math.min(event.clientY, window.innerHeight - 300) + 'px';
  popover.style.left = Math.min(event.clientX, window.innerWidth - 340) + 'px';
  popover.classList.add('open');
}

function closePopover() {
  document.getElementById('kanban-popover').classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.popover') && !e.target.closest('.kanban-card')) closePopover();
});

// ============================================================
// CALENDAR
// ============================================================
function renderCalendar() {
  const page = document.getElementById('page-calendar');

  const weekStart = new Date(calendarDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const monthStart = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);

  let dateTitle = '';
  if (calendarView === 'week') {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    dateTitle = `${weekStart.toLocaleDateString('en-US', {month:'short',day:'numeric'})} - ${weekEnd.toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}`;
  } else if (calendarView === 'day') {
    dateTitle = calendarDate.toLocaleDateString('en-US', {weekday:'long',month:'long',day:'numeric',year:'numeric'});
  } else {
    dateTitle = calendarDate.toLocaleDateString('en-US', {month:'long',year:'numeric'});
  }

  let calendarContent = '';
  if (calendarView === 'week') {
    calendarContent = renderWeekView(weekStart);
  } else if (calendarView === 'day') {
    calendarContent = renderDayView(calendarDate);
  } else {
    calendarContent = renderMonthView(monthStart);
  }

  page.innerHTML = `
    <div class="calendar-controls">
      <div class="calendar-nav">
        <button class="btn btn-secondary btn-sm" onclick="calNavPrev()">&#9664;</button>
        <span class="cal-title">${dateTitle}</span>
        <button class="btn btn-secondary btn-sm" onclick="calNavNext()">&#9654;</button>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-sm btn-outline" onclick="calendarDate=new Date(TODAY);renderCalendar()">Today</button>
        <div class="view-toggle">
          <button class="${calendarView==='day'?'active':''}" onclick="calendarView='day';renderCalendar()">Day</button>
          <button class="${calendarView==='week'?'active':''}" onclick="calendarView='week';renderCalendar()">Week</button>
          <button class="${calendarView==='month'?'active':''}" onclick="calendarView='month';renderCalendar()">Month</button>
        </div>
      </div>
    </div>
    ${calendarContent}
  `;
}

function renderWeekView(weekStart) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  const hours = [];
  for (let h = 8; h <= 19; h++) hours.push(h);

  let headerHtml = `<div class="cal-header-cell"></div>`;
  days.forEach(d => {
    const isToday = d.toDateString() === TODAY.toDateString();
    headerHtml += `<div class="cal-header-cell ${isToday?'today':''}">${d.toLocaleDateString('en-US',{weekday:'short'})} ${d.getDate()}</div>`;
  });

  let bodyHtml = '';
  hours.forEach(h => {
    bodyHtml += `<div class="cal-time-label">${formatTime(h, 0)}</div>`;
    days.forEach(d => {
      const isToday = d.toDateString() === TODAY.toDateString();
      const dateStr = d.toDateString();
      const events = CALENDAR_EVENTS.filter(e => e.date.toDateString() === dateStr);
      let eventsHtml = '';
      events.forEach(e => {
        const [eh, em] = e.startTime.split(':').map(Number);
        const [eeh, eem] = e.endTime.split(':').map(Number);
        if (eh === h) {
          const topOffset = (em / 60) * 60;
          const duration = ((eeh * 60 + eem) - (eh * 60 + em));
          const height = (duration / 60) * 60 - 2;
          eventsHtml += `<div class="cal-event ${e.type}" style="top:${topOffset}px;height:${height}px" onclick="openEventDetail(${e.id})">${e.startTime} ${e.title}</div>`;
        }
      });
      bodyHtml += `<div class="cal-cell ${isToday?'today-col':''}" onclick="openNewEvent('${d.toISOString()}', ${h})">${eventsHtml}</div>`;
    });
  });

  return `
    <div class="calendar-grid">
      <div class="cal-header" style="display:grid;grid-template-columns:70px repeat(7,1fr)">${headerHtml}</div>
      <div class="cal-body" style="display:grid;grid-template-columns:70px repeat(7,1fr)">${bodyHtml}</div>
    </div>
  `;
}

function renderDayView(date) {
  const hours = [];
  for (let h = 8; h <= 19; h++) hours.push(h);
  const dateStr = date.toDateString();

  let bodyHtml = '';
  hours.forEach(h => {
    const events = CALENDAR_EVENTS.filter(e => e.date.toDateString() === dateStr);
    let eventsHtml = '';
    events.forEach(e => {
      const [eh] = e.startTime.split(':').map(Number);
      if (eh === h) {
        eventsHtml += `<div class="cal-event ${e.type}" style="position:relative;margin-bottom:4px" onclick="openEventDetail(${e.id})">${e.startTime} - ${e.endTime} | ${e.title} ${e.clientName ? '(' + e.clientName + ')' : ''}</div>`;
      }
    });
    bodyHtml += `
      <div class="day-row">
        <div class="day-time-label">${formatTime(h, 0)}</div>
        <div class="day-cell" onclick="openNewEvent('${date.toISOString()}', ${h})">${eventsHtml}</div>
      </div>
    `;
  });

  return `
    <div class="calendar-day-grid">
      <div class="day-header">${date.toLocaleDateString('en-US', {weekday:'long',month:'long',day:'numeric'})}</div>
      ${bodyHtml}
    </div>
  `;
}

function renderMonthView(monthStart) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let html = `<div class="calendar-month-grid">`;
  dayNames.forEach(d => { html += `<div class="month-header-cell">${d}</div>`; });

  // Fill previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="month-day-cell other-month"><div class="month-day-num">${prevMonthDays - i}</div></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isToday = date.toDateString() === TODAY.toDateString();
    const dayEvents = CALENDAR_EVENTS.filter(e => e.date.toDateString() === date.toDateString());
    let eventDots = dayEvents.slice(0, 3).map(e => `<span class="month-event-label cal-event ${e.type}" style="position:relative" onclick="openEventDetail(${e.id})">${e.title}</span>`).join('');
    html += `<div class="month-day-cell ${isToday?'today':''}" onclick="calendarDate=new Date(${year},${month},${d});calendarView='day';renderCalendar()"><div class="month-day-num">${d}</div>${eventDots}</div>`;
  }

  // Fill next month
  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="month-day-cell other-month"><div class="month-day-num">${i}</div></div>`;
  }

  html += `</div>`;
  return html;
}

function calNavPrev() {
  if (calendarView === 'week') calendarDate.setDate(calendarDate.getDate() - 7);
  else if (calendarView === 'day') calendarDate.setDate(calendarDate.getDate() - 1);
  else calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
}

function calNavNext() {
  if (calendarView === 'week') calendarDate.setDate(calendarDate.getDate() + 7);
  else if (calendarView === 'day') calendarDate.setDate(calendarDate.getDate() + 1);
  else calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
}

function openNewEvent(dateStr, hour) {
  const date = new Date(dateStr);
  const modal = document.getElementById('event-modal');
  document.getElementById('event-modal-title').textContent = 'New Event';

  const clientOptions = CLIENTS.filter(c => c.status === 'active').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const dateVal = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

  document.getElementById('event-modal-body').innerHTML = `
    <div class="form-group">
      <label>Client</label>
      <select id="evt-client"><option value="0">Internal / No Client</option>${clientOptions}</select>
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="evt-type">
        <option value="coaching">Coaching Call</option>
        <option value="resume">Resume Review</option>
        <option value="mock">Mock Interview</option>
        <option value="admin">Admin Block</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Date</label><input type="date" id="evt-date" value="${dateVal}"></div>
      <div class="form-group"><label>Start Time</label><input type="time" id="evt-start" value="${String(hour).padStart(2,'0')}:00"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>End Time</label><input type="time" id="evt-end" value="${String(hour+1).padStart(2,'0')}:00"></div>
      <div class="form-group"></div>
    </div>
    <div class="form-group"><label>Notes</label><textarea id="evt-notes" rows="2"></textarea></div>
  `;
  document.getElementById('event-modal-footer').innerHTML = `
    <button class="btn btn-secondary" onclick="closeEventModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveNewEvent()">Create Event</button>
  `;
  modal.classList.add('open');
}

function saveNewEvent() {
  const clientId = parseInt(document.getElementById('evt-client').value);
  const client = CLIENTS.find(c => c.id === clientId);
  const type = document.getElementById('evt-type').value;
  const dateVal = document.getElementById('evt-date').value;
  const startTime = document.getElementById('evt-start').value;
  const endTime = document.getElementById('evt-end').value;
  const notes = document.getElementById('evt-notes').value;

  const typeLabels = { coaching: 'Coaching Call', resume: 'Resume Review', mock: 'Mock Interview', admin: 'Admin Block' };

  const newEvent = {
    id: Math.max(...CALENDAR_EVENTS.map(e => e.id)) + 1,
    clientId: clientId,
    clientName: client ? client.name : '',
    type: type,
    title: typeLabels[type],
    date: new Date(dateVal + 'T00:00:00'),
    startTime: startTime,
    endTime: endTime,
    notes: notes
  };
  CALENDAR_EVENTS.push(newEvent);
  closeEventModal();
  renderCalendar();
  showToast('Event created successfully');
}

function openEventDetail(eventId) {
  event.stopPropagation();
  const evt = CALENDAR_EVENTS.find(e => e.id === eventId);
  if (!evt) return;

  const modal = document.getElementById('event-modal');
  document.getElementById('event-modal-title').textContent = evt.title;
  document.getElementById('event-modal-body').innerHTML = `
    <div style="font-size:0.9rem" id="event-detail-content">
      <p><strong>Client:</strong> ${evt.clientName || 'Internal'}</p>
      <p style="margin-top:8px"><strong>Date:</strong> ${formatDate(evt.date)}</p>
      <p style="margin-top:8px"><strong>Time:</strong> ${evt.startTime} - ${evt.endTime}</p>
      <p style="margin-top:8px"><strong>Type:</strong> ${evt.type.charAt(0).toUpperCase() + evt.type.slice(1)}</p>
      <p style="margin-top:8px"><strong>Notes:</strong> ${evt.notes || 'None'}</p>
    </div>
  `;
  document.getElementById('event-modal-footer').innerHTML = `
    <button class="btn btn-danger btn-sm" onclick="deleteEvent(${evt.id})">Delete</button>
    <button class="btn btn-secondary" onclick="closeEventModal()">Close</button>
  `;
  modal.classList.add('open');
}

function deleteEvent(eventId) {
  const idx = CALENDAR_EVENTS.findIndex(e => e.id === eventId);
  if (idx > -1) CALENDAR_EVENTS.splice(idx, 1);
  closeEventModal();
  renderCalendar();
  showToast('Event deleted');
}

function closeEventModal() {
  document.getElementById('event-modal').classList.remove('open');
}

// ============================================================
// DOCUMENTS
// ============================================================
function renderDocuments() {
  const clientsWithDocs = [...new Set(DOCUMENTS.map(d => d.clientId))];
  if (!selectedDocClient && clientsWithDocs.length > 0) selectedDocClient = clientsWithDocs[0];

  const clientDocs = DOCUMENTS.filter(d => d.clientId === selectedDocClient);
  const activeDoc = selectedDoc ? DOCUMENTS.find(d => d.id === selectedDoc) : (clientDocs[0] || null);
  if (activeDoc) selectedDoc = activeDoc.id;

  const page = document.getElementById('page-documents');
  page.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2>Documents</h2>
      <button class="btn btn-primary" onclick="openNewDocModal()">+ New Document</button>
    </div>
    <div class="doc-layout ${activeDoc ? '' : 'no-preview'}">
      <div class="doc-sidebar">
        ${clientsWithDocs.map(cid => {
          const client = CLIENTS.find(c => c.id === cid);
          return `<div class="doc-folder ${cid === selectedDocClient ? 'active' : ''}" onclick="selectedDocClient=${cid};selectedDoc=null;renderDocuments()">
            <span class="folder-icon">&#128193;</span>${client ? client.name : 'Unknown'}
          </div>`;
        }).join('')}
      </div>
      <div class="doc-list">
        <div class="doc-list-header">
          <span style="font-weight:600;font-size:0.9rem">${CLIENTS.find(c=>c.id===selectedDocClient)?.name || ''}</span>
          <span style="font-size:0.8rem;color:var(--slate-500)">${clientDocs.length} documents</span>
        </div>
        ${clientDocs.map(d => `
          <div class="doc-row ${d.id === selectedDoc ? 'active' : ''}" onclick="selectedDoc=${d.id};renderDocuments()">
            <span class="doc-icon">${d.type === 'resume' ? '&#128196;' : d.type === 'cover_letter' ? '&#9993;' : '&#128203;'}</span>
            <div class="doc-info">
              <div class="doc-name">${d.name}</div>
              <div class="doc-meta">${d.type.replace('_', ' ')} | Modified ${relativeDate(d.lastModified)}</div>
            </div>
            <div style="position:relative" onclick="event.stopPropagation()">
              <span class="doc-version" onclick="this.nextElementSibling.classList.toggle('open')">v${d.version}</span>
              <div class="version-dropdown">
                ${d.versions.map(v => `<button class="version-item">v${v.v} - ${formatDate(v.date)}</button>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ${activeDoc ? `
        <div class="doc-preview">
          <div class="doc-preview-inner">${activeDoc.content}</div>
        </div>
      ` : ''}
    </div>
  `;
}

function openNewDocModal() {
  const modal = document.getElementById('new-doc-modal');
  const clientOptions = CLIENTS.filter(c => c.status === 'active').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('new-doc-body').innerHTML = `
    <div class="form-group">
      <label>Client</label>
      <select id="new-doc-client">${clientOptions}</select>
    </div>
    <div class="form-group">
      <label>Document Type</label>
      <select id="new-doc-type">
        <option value="resume">Resume</option>
        <option value="cover_letter">Cover Letter</option>
        <option value="prep_sheet">Prep Sheet</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="form-group">
      <label>Document Name</label>
      <input type="text" id="new-doc-name" placeholder="e.g. Resume - Senior PM">
    </div>
  `;
  modal.classList.add('open');
}

function closeNewDocModal() {
  document.getElementById('new-doc-modal').classList.remove('open');
}

function createNewDocument() {
  const clientId = parseInt(document.getElementById('new-doc-client').value);
  const type = document.getElementById('new-doc-type').value;
  const name = document.getElementById('new-doc-name').value.trim();
  if (!name) { showToast('Please enter a document name', 'error'); return; }

  const client = CLIENTS.find(c => c.id === clientId);
  const newDoc = {
    id: Math.max(...DOCUMENTS.map(d => d.id)) + 1,
    clientId: clientId,
    clientName: client ? client.name : '',
    name: name,
    type: type,
    lastModified: TODAY,
    version: 1,
    versions: [{v: 1, date: TODAY}],
    content: `<h2>${name}</h2><p>Document content will go here...</p>`
  };
  DOCUMENTS.push(newDoc);
  closeNewDocModal();
  selectedDocClient = clientId;
  selectedDoc = newDoc.id;
  renderDocuments();
  showToast('Document created successfully');
}

// ============================================================
// AI TOOLS
// ============================================================
let aiToolTab = 'resume';

function renderAITools() {
  const page = document.getElementById('page-ai-tools');
  page.innerHTML = `
    <div class="ai-tool-tabs">
      <div class="ai-tool-tab ${aiToolTab==='resume'?'active':''}" onclick="aiToolTab='resume';renderAITools()">Resume Tailor</div>
      <div class="ai-tool-tab ${aiToolTab==='interview'?'active':''}" onclick="aiToolTab='interview';renderAITools()">Interview Prep</div>
    </div>
    <div id="ai-tool-content"></div>
  `;

  if (aiToolTab === 'resume') renderResumeTailor();
  else renderInterviewPrep();
}

function renderResumeTailor() {
  const clientsWithResumes = DOCUMENTS.filter(d => d.type === 'resume');
  const clientOptions = clientsWithResumes.map(d => `<option value="${d.id}">${d.clientName} - ${d.name}</option>`).join('');

  document.getElementById('ai-tool-content').innerHTML = `
    <div class="split-panel">
      <div class="panel">
        <div class="panel-header">Job Description</div>
        <div class="panel-body">
          <textarea id="jd-input" placeholder="Paste the job description here...">We are looking for a VP of Product to lead our product organization at Stripe. You will drive product strategy for our payments platform, manage a team of 20+ PMs, and work directly with the CEO on company-wide initiatives.

Requirements:
- 10+ years product management experience
- Experience with payments or fintech
- Led teams of 15+ PMs
- Strong data-driven decision making
- MBA preferred
- Experience with enterprise and developer products
- Track record of launching products generating $100M+ in revenue</textarea>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">Client Resume</div>
        <div class="panel-body">
          <select id="resume-select" style="margin-bottom:12px;width:100%" onchange="loadResumePreview(this.value)">
            ${clientOptions}
          </select>
          <div id="resume-preview" style="font-size:0.85rem;line-height:1.6;max-height:300px;overflow-y:auto">
            ${clientsWithResumes.length > 0 ? clientsWithResumes[0].content : '<p>No resumes available</p>'}
          </div>
        </div>
      </div>
    </div>
    <div class="ai-action-bar">
      <button class="btn btn-primary btn-lg" onclick="tailorResume()">&#9733; Tailor Resume</button>
    </div>
    <div id="tailor-results"></div>
  `;
}

function loadResumePreview(docId) {
  const doc = DOCUMENTS.find(d => d.id === parseInt(docId));
  if (doc) document.getElementById('resume-preview').innerHTML = doc.content;
}

function tailorResume() {
  const results = document.getElementById('tailor-results');
  results.innerHTML = `<div style="text-align:center;padding:30px"><div class="spinner"></div><p style="margin-top:12px;color:var(--slate-500)">AI is analyzing the job description and resume...</p></div>`;

  setTimeout(() => {
    const score = 82;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    results.innerHTML = `
      <div class="card" style="margin-top:16px">
        <div class="card-header"><h3>Tailoring Results</h3></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
            <div style="text-align:center">
              <div class="match-gauge">
                <svg viewBox="0 0 100 100">
                  <circle class="gauge-bg" cx="50" cy="50" r="45"/>
                  <circle class="gauge-fill" cx="50" cy="50" r="45" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                </svg>
                <div class="gauge-text">${score}%</div>
              </div>
              <div style="font-size:0.85rem;font-weight:600;color:var(--slate-700)">Match Score</div>
            </div>
            <div>
              <h4 style="color:var(--success);margin-bottom:8px">Matching Skills</h4>
              <div class="skill-item skill-match">&#10003; Product Management (10+ years)</div>
              <div class="skill-item skill-match">&#10003; Team Leadership (30+ managed)</div>
              <div class="skill-item skill-match">&#10003; Data-Driven Strategy</div>
              <div class="skill-item skill-match">&#10003; MBA (Stanford)</div>
              <div class="skill-item skill-match">&#10003; Revenue Growth ($200M+)</div>
              <div class="skill-item skill-match">&#10003; Platform Products</div>
            </div>
            <div>
              <h4 style="color:var(--danger);margin-bottom:8px">Missing Skills</h4>
              <div class="skill-item skill-missing">&#10007; Payments / Fintech experience</div>
              <div class="skill-item skill-missing">&#10007; Developer products</div>
              <div class="skill-item skill-missing">&#10007; Enterprise sales alignment</div>
            </div>
          </div>

          <h4 style="margin-top:24px;margin-bottom:12px">Suggested Rewrites</h4>
          <div class="rewrite-item">
            <div class="rewrite-label">Before</div>
            <div class="rewrite-before" id="rw-before-1">Led product strategy for Meta Marketplace, growing GMV from $5B to $12B annually</div>
            <div class="rewrite-label" style="margin-top:8px">After</div>
            <div class="rewrite-after" id="rw-after-1">Led product strategy for Meta Marketplace payments platform, growing GMV from $5B to $12B and processing 500M+ transactions annually across global payment rails</div>
            <button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="applyRewrite(1)">Apply</button>
          </div>
          <div class="rewrite-item">
            <div class="rewrite-label">Before</div>
            <div class="rewrite-before" id="rw-before-2">Managed team of 8 PMs and 45 engineers across 3 product verticals</div>
            <div class="rewrite-label" style="margin-top:8px">After</div>
            <div class="rewrite-after" id="rw-after-2">Managed team of 20+ PMs and 45 engineers across payments, developer tools, and enterprise product verticals, driving $200M+ in annual revenue</div>
            <button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="applyRewrite(2)">Apply</button>
          </div>
          <div class="rewrite-item">
            <div class="rewrite-label">Before</div>
            <div class="rewrite-before" id="rw-before-3">Launched AI-powered pricing recommendations, increasing seller conversion by 34%</div>
            <div class="rewrite-label" style="margin-top:8px">After</div>
            <div class="rewrite-after" id="rw-after-3">Launched AI-powered pricing and fintech integration tools for developers, increasing seller conversion by 34% and enabling $3B+ in merchant payment processing</div>
            <button class="btn btn-sm btn-outline" style="margin-top:8px" onclick="applyRewrite(3)">Apply</button>
          </div>
        </div>
      </div>
    `;
  }, 2000);
}

function applyRewrite(num) {
  const afterEl = document.getElementById(`rw-after-${num}`);
  const beforeEl = document.getElementById(`rw-before-${num}`);
  if (afterEl) {
    afterEl.classList.add('applied');
    const btn = afterEl.nextElementSibling;
    if (btn) { btn.textContent = 'Applied'; btn.disabled = true; btn.className = 'btn btn-sm btn-success'; }
  }
  showToast('Rewrite applied to resume');
}

function renderInterviewPrep() {
  const clientOptions = CLIENTS.filter(c => c.status === 'active').map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  document.getElementById('ai-tool-content').innerHTML = `
    <div class="card">
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group">
            <label>Client</label>
            <select id="prep-client">${clientOptions}</select>
          </div>
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" id="prep-company" value="Stripe" placeholder="e.g. Stripe">
          </div>
          <div class="form-group">
            <label>Role Title</label>
            <input type="text" id="prep-role" value="VP of Product" placeholder="e.g. VP of Product">
          </div>
          <div class="form-group">
            <label>Interview Type</label>
            <select id="prep-type">
              <option value="phone">Phone Screen</option>
              <option value="technical">Technical</option>
              <option value="behavioral" selected>Behavioral</option>
              <option value="final">Final Round</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-top:16px">
          <button class="btn btn-primary btn-lg" onclick="generatePrepKit()">&#9733; Generate Prep Kit</button>
        </div>
      </div>
    </div>
    <div id="prep-results"></div>
  `;
}

function generatePrepKit() {
  const company = document.getElementById('prep-company').value || 'Company';
  const role = document.getElementById('prep-role').value || 'Role';
  const clientId = parseInt(document.getElementById('prep-client').value);
  const client = CLIENTS.find(c => c.id === clientId);
  const clientName = client ? client.name : 'Client';

  const results = document.getElementById('prep-results');
  results.innerHTML = `<div style="text-align:center;padding:30px"><div class="spinner"></div><p style="margin-top:12px;color:var(--slate-500)">Generating personalized prep kit...</p></div>`;

  setTimeout(() => {
    results.innerHTML = `
      <div style="margin-top:24px">
        <div class="prep-section">
          <div class="prep-section-header" onclick="togglePrepSection(this)">
            Role-Specific Questions (5) <span>&#9660;</span>
          </div>
          <div class="prep-section-body open">
            <div class="prep-qa">
              <div class="prep-question">1. How would you define and prioritize the product roadmap for ${company}'s payment platform?</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-1">I would start by deeply understanding ${company}'s strategic priorities and customer pain points. Using a framework combining user impact, revenue potential, and technical feasibility, I'd create a quarterly roadmap with clear OKRs. At Meta, I used this approach to prioritize across our Marketplace platform, resulting in 140% revenue growth.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-1')">Edit</button>
            </div>
            <div class="prep-qa">
              <div class="prep-question">2. Describe your experience managing a large PM organization. How do you ensure alignment?</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-2">At Meta, I managed 8 PMs across 3 verticals. I implemented weekly product reviews, quarterly OKR setting, and a shared product principles document. I'd scale this approach at ${company} by establishing clear decision frameworks and empowering PMs with context rather than directives.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-2')">Edit</button>
            </div>
            <div class="prep-qa">
              <div class="prep-question">3. How would you approach entering a new market vertical for ${company}?</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-3">I'd follow a structured approach: market sizing, competitive analysis, customer discovery, and building an MVP with clear success metrics. At Uber, I used this framework to launch Pool in new markets, achieving 28% efficiency improvements.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-3')">Edit</button>
            </div>
            <div class="prep-qa">
              <div class="prep-question">4. What metrics would you use to measure the success of ${company}'s developer tools?</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-4">Key metrics: API integration time (time-to-first-transaction), developer NPS, documentation engagement, support ticket volume, and expansion revenue from API usage growth. I'd establish a developer experience scorecard reviewed monthly.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-4')">Edit</button>
            </div>
            <div class="prep-qa">
              <div class="prep-question">5. How do you handle disagreements with engineering leadership on product direction?</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-5">I believe in data-driven decision making and mutual respect. I'd present the user research and business case clearly, listen to technical constraints, and find creative solutions. At Meta, I resolved a major platform vs. feature debate by proposing a phased approach that satisfied both perspectives.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-5')">Edit</button>
            </div>
          </div>
        </div>

        <div class="prep-section">
          <div class="prep-section-header" onclick="togglePrepSection(this)">
            Behavioral / STAR Questions (3) <span>&#9654;</span>
          </div>
          <div class="prep-section-body">
            <div class="prep-qa">
              <div class="prep-question">1. Tell me about a time you had to make a difficult product decision with incomplete data.</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-b1"><strong>Situation:</strong> At Meta, we had conflicting user data about Marketplace search redesign. <strong>Task:</strong> Decide between two approaches with 48-hour deadline. <strong>Action:</strong> Ran rapid A/B test with 5% traffic, combined with qualitative interviews. <strong>Result:</strong> Chose approach B, which led to 23% improvement in search conversion.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-b1')">Edit</button>
            </div>
            <div class="prep-qa">
              <div class="prep-question">2. Describe a situation where you had to influence without authority.</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-b2"><strong>Situation:</strong> Needed buy-in from 3 VP stakeholders for analytics platform investment. <strong>Task:</strong> Convince them without direct authority. <strong>Action:</strong> Built a compelling business case with projected ROI, secured a pilot from one VP, then used results to win others. <strong>Result:</strong> Full investment approved, adopted by 5 product orgs.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-b2')">Edit</button>
            </div>
            <div class="prep-qa">
              <div class="prep-question">3. Tell me about a product launch that didn't go as planned.</div>
              <div class="prep-answer" contenteditable="false" id="prep-a-b3"><strong>Situation:</strong> Launched pricing feature that caused 15% drop in seller listings. <strong>Task:</strong> Diagnose and fix quickly. <strong>Action:</strong> Implemented rollback, conducted root cause analysis, redesigned with seller feedback. <strong>Result:</strong> Relaunched with 90% fewer complaints and 20% higher seller satisfaction.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top:6px" onclick="toggleEdit(this, 'prep-a-b3')">Edit</button>
            </div>
          </div>
        </div>

        <div class="prep-section">
          <div class="prep-section-header" onclick="togglePrepSection(this)">
            Company Research - ${company} <span>&#9654;</span>
          </div>
          <div class="prep-section-body">
            <ul style="font-size:0.9rem;line-height:1.8">
              <li><strong>Mission:</strong> Increase the GDP of the internet by building economic infrastructure for online businesses</li>
              <li><strong>Recent Launch:</strong> Stripe Financial Connections - direct bank account access for platforms</li>
              <li><strong>Revenue:</strong> Processing over $1 trillion in payments annually, with strong growth in enterprise segment</li>
              <li><strong>Culture:</strong> Engineering-driven, highly analytical, emphasis on developer experience and API design</li>
              <li><strong>Key Challenge:</strong> Expanding from payments into comprehensive financial services (lending, treasury, issuing)</li>
            </ul>
          </div>
        </div>

        <div style="text-align:center;margin-top:24px">
          <button class="btn btn-primary" id="send-prep-btn" onclick="sendPrepKit('${clientName}')">Send to ${clientName}</button>
        </div>
      </div>
    `;
  }, 2000);
}

function togglePrepSection(header) {
  const body = header.nextElementSibling;
  body.classList.toggle('open');
  const arrow = header.querySelector('span');
  arrow.innerHTML = body.classList.contains('open') ? '&#9660;' : '&#9654;';
}

function toggleEdit(btn, id) {
  const el = document.getElementById(id);
  const editable = el.contentEditable === 'true';
  el.contentEditable = !editable;
  btn.textContent = editable ? 'Edit' : 'Save';
  if (!editable) el.focus();
}

function sendPrepKit(clientName) {
  const btn = document.getElementById('send-prep-btn');
  btn.innerHTML = '&#10003; Sent';
  btn.className = 'btn btn-success';
  btn.disabled = true;
  showToast(`Prep kit sent to ${clientName} via email`);
}

// ============================================================
// REVENUE
// ============================================================
function renderRevenue() {
  const mrr = CLIENTS.filter(c => c.status === 'active').reduce((s, c) => {
    const plan = PLANS.find(p => p.id === c.plan);
    return s + (plan ? plan.price : 0);
  }, 0);

  const outstanding = INVOICES.filter(i => i.status === 'overdue' || i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const paid = INVOICES.filter(i => i.status === 'paid').length;
  const total = INVOICES.length;
  const collectionRate = Math.round((paid / total) * 100);

  const basicCount = CLIENTS.filter(c => c.status === 'active' && c.plan === 'basic').length;
  const proCount = CLIENTS.filter(c => c.status === 'active' && c.plan === 'pro').length;
  const premiumCount = CLIENTS.filter(c => c.status === 'active' && c.plan === 'premium').length;

  const page = document.getElementById('page-revenue');
  page.innerHTML = `
    <h2 style="margin-bottom:16px">Revenue & Billing</h2>
    <div class="metric-cards">
      <div class="metric-card">
        <div class="metric-label">Monthly Recurring Revenue</div>
        <div class="metric-value">$${mrr.toLocaleString()}</div>
        <div class="metric-trend up">&#9650; 11% vs last month</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Clients by Plan</div>
        <div class="metric-value" style="font-size:1rem">${basicCount} Basic / ${proCount} Pro / ${premiumCount} Premium</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Outstanding Balance</div>
        <div class="metric-value">$${outstanding.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Collection Rate</div>
        <div class="metric-value">${collectionRate}%</div>
      </div>
    </div>

    <div class="revenue-chart">
      <h3 style="margin-bottom:12px">Revenue Trend (6 Months)</h3>
      <div class="chart-container">
        <canvas id="revenue-chart-canvas"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Invoices</h3>
        <button class="btn btn-sm btn-secondary" onclick="filterOverdueInvoices()">Show Overdue</button>
      </div>
      <div class="table-wrapper">
        <table id="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Amount</th>
              <th onclick="sortInvoices('dueDate')" style="cursor:pointer">Due Date &#9650;</th>
              <th onclick="sortInvoices('status')" style="cursor:pointer">Status &#9650;</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${INVOICES.map(inv => `
              <tr onclick="toggleInvoiceDetail('inv-detail-${inv.id}')">
                <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem">${inv.id}</td>
                <td style="font-weight:500">${inv.clientName}</td>
                <td style="font-weight:600">$${inv.amount}</td>
                <td style="color:var(--slate-500)">${formatDate(inv.dueDate)}</td>
                <td><span class="badge ${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
                <td onclick="event.stopPropagation()">
                  ${inv.status === 'overdue' ? `<button class="btn btn-sm btn-danger" onclick="sendReminder('${inv.clientName}')">Send Reminder</button>` : ''}
                </td>
              </tr>
              <tr>
                <td colspan="6" style="padding:0">
                  <div class="invoice-detail" id="inv-detail-${inv.id}">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                      <div><strong>Plan:</strong> ${inv.plan} - ${inv.period}</div>
                      <div><strong>Payment Method:</strong> ${inv.paymentMethod}</div>
                      <div><strong>Amount:</strong> $${inv.amount}</div>
                      <div><strong>Payment Date:</strong> ${inv.paidDate ? formatDate(inv.paidDate) : 'Unpaid'}</div>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Draw chart
  setTimeout(() => {
    const ctx = document.getElementById('revenue-chart-canvas');
    if (ctx && typeof Chart !== 'undefined') {
      if (chartInstances.revenue) chartInstances.revenue.destroy();
      chartInstances.revenue = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: REVENUE_HISTORY.map(r => r.month),
          datasets: [{
            label: 'Revenue ($)',
            data: REVENUE_HISTORY.map(r => r.revenue),
            backgroundColor: 'rgba(79, 70, 229, 0.8)',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString() } }
          }
        }
      });
    }
  }, 100);
}

function toggleInvoiceDetail(id) {
  document.getElementById(id).classList.toggle('open');
}

function sendReminder(clientName) {
  showToast(`Reminder sent to ${clientName}`);
}

function filterOverdueInvoices() {
  const rows = document.querySelectorAll('#invoice-table tbody tr');
  let showing = false;
  rows.forEach(row => {
    const badge = row.querySelector('.badge.overdue');
    const detail = row.querySelector('.invoice-detail');
    if (detail) return; // skip detail rows
    if (badge || row.previousElementSibling?.querySelector('.badge.overdue')) {
      row.style.display = '';
    } else {
      if (row.style.display === 'none') {
        row.style.display = '';
        showing = true;
      } else {
        row.style.display = 'none';
      }
    }
  });
}

let invoiceSortCol = '';
let invoiceSortDir = 'asc';

function sortInvoices(col) {
  if (invoiceSortCol === col) invoiceSortDir = invoiceSortDir === 'asc' ? 'desc' : 'asc';
  else { invoiceSortCol = col; invoiceSortDir = 'asc'; }

  INVOICES.sort((a, b) => {
    let va, vb;
    if (col === 'dueDate') { va = a.dueDate; vb = b.dueDate; }
    else if (col === 'status') { va = a.status; vb = b.status; }
    else { va = a.id; vb = b.id; }
    if (va < vb) return invoiceSortDir === 'asc' ? -1 : 1;
    if (va > vb) return invoiceSortDir === 'asc' ? 1 : -1;
    return 0;
  });
  renderRevenue();
}

// ============================================================
// MESSAGING
// ============================================================
function renderMessaging(opts) {
  if (opts?.clientId) {
    const conv = CONVERSATIONS.find(c => c.clientId === opts.clientId);
    if (conv) activeConversation = conv.clientId;
  }
  if (!activeConversation && CONVERSATIONS.length > 0) activeConversation = CONVERSATIONS[0].clientId;

  const sortedConvs = [...CONVERSATIONS].sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.time || 0;
    const bLast = b.messages[b.messages.length - 1]?.time || 0;
    return bLast - aLast;
  });

  const activeConv = CONVERSATIONS.find(c => c.clientId === activeConversation);

  const page = document.getElementById('page-messaging');
  page.innerHTML = `
    <h2 style="margin-bottom:16px">Messages</h2>
    <div class="messaging-layout">
      <div class="conversation-list">
        ${sortedConvs.map(c => {
          const lastMsg = c.messages[c.messages.length - 1];
          const initials = c.clientName.split(' ').map(n => n[0]).join('');
          return `
            <div class="conversation-item ${c.clientId === activeConversation ? 'active' : ''}" onclick="activeConversation=${c.clientId};renderMessaging()">
              <div class="avatar sm">${initials}</div>
              <div class="conv-info">
                <div class="conv-name">${c.clientName}</div>
                <div class="conv-preview">${lastMsg ? lastMsg.text.substring(0, 45) + '...' : ''}</div>
              </div>
              <div style="text-align:right">
                <div class="conv-time">${lastMsg ? relativeTime(lastMsg.time) : ''}</div>
                ${c.unread ? '<div class="conv-unread" style="margin-left:auto;margin-top:4px"></div>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="chat-area">
        ${activeConv ? `
          <div class="chat-header">
            <div class="avatar sm">${activeConv.clientName.split(' ').map(n => n[0]).join('')}</div>
            <span>${activeConv.clientName}</span>
          </div>
          <div class="chat-messages" id="chat-messages">
            ${activeConv.messages.map(m => `
              <div>
                <div class="message-bubble ${m.from === 'operator' ? 'operator' : 'client'}">${m.text}</div>
                <div class="message-time ${m.from === 'operator' ? 'operator-time' : ''}">${relativeTime(m.time)}</div>
              </div>
            `).join('')}
          </div>
          <div class="chat-input-area">
            <div class="template-btn">
              <button class="btn btn-secondary btn-sm" onclick="toggleTemplates()" style="white-space:nowrap">Templates</button>
              <div class="template-dropdown" id="template-dropdown">
                ${MESSAGE_TEMPLATES.map((t, i) => `
                  <button class="template-item" onclick="insertTemplate(${i})">
                    <div class="template-name">${t.name}</div>
                    <div class="template-text">${t.text.substring(0, 50)}...</div>
                  </button>
                `).join('')}
              </div>
            </div>
            <textarea id="msg-input" placeholder="Type a message..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}"></textarea>
            <button class="btn btn-primary btn-sm" onclick="sendMessage()">Send</button>
          </div>
        ` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--slate-500)">Select a conversation</div>'}
      </div>
    </div>
  `;

  // Scroll to bottom
  setTimeout(() => {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 50);
}

function sendMessage() {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text) return;

  const conv = CONVERSATIONS.find(c => c.clientId === activeConversation);
  if (conv) {
    conv.messages.push({ from: 'operator', text: text, time: new Date() });
    conv.unread = false;
    renderMessaging();
  }
}

function toggleTemplates() {
  document.getElementById('template-dropdown').classList.toggle('open');
}

function insertTemplate(idx) {
  const conv = CONVERSATIONS.find(c => c.clientId === activeConversation);
  const template = MESSAGE_TEMPLATES[idx];
  let text = template.text;
  if (conv) text = text.replace(/\[name\]/g, conv.clientName.split(' ')[0]);
  text = text.replace(/\[time\]/g, '10:00 AM');
  document.getElementById('msg-input').value = text;
  document.getElementById('template-dropdown').classList.remove('open');
}

// ============================================================
// ANALYTICS
// ============================================================
function renderAnalytics() {
  const data = analyticsRange === '90' ? ANALYTICS.analytics90 : analyticsRange === '365' ? ANALYTICS.analyticsYear : ANALYTICS;
  const interviewRate = data.interviewRate || ANALYTICS.interviewRate;
  const offerRate = data.offerRate || ANALYTICS.offerRate;
  const avgTime = data.avgTimeToInterview || ANALYTICS.avgTimeToInterview;
  const avgEngagement = data.avgEngagementDuration || ANALYTICS.avgEngagementDuration;

  const page = document.getElementById('page-analytics');
  page.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2>Analytics & Reports</h2>
      <select onchange="analyticsRange=this.value;renderAnalytics()">
        <option value="30" ${analyticsRange==='30'?'selected':''}>Last 30 Days</option>
        <option value="90" ${analyticsRange==='90'?'selected':''}>Last 90 Days</option>
        <option value="365" ${analyticsRange==='365'?'selected':''}>This Year</option>
      </select>
    </div>

    <div class="success-metrics">
      <div class="success-metric-card">
        <div class="metric-value">${interviewRate}%</div>
        <div class="metric-label">Interview Rate</div>
      </div>
      <div class="success-metric-card">
        <div class="metric-value">${offerRate}%</div>
        <div class="metric-label">Offer Rate</div>
      </div>
      <div class="success-metric-card">
        <div class="metric-value">${avgTime}d</div>
        <div class="metric-label">Avg. Time to Interview</div>
      </div>
      <div class="success-metric-card">
        <div class="metric-value">${avgEngagement}mo</div>
        <div class="metric-label">Avg. Engagement</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>Sessions Per Week</h3>
        <div class="chart-canvas-wrapper"><canvas id="chart-sessions"></canvas></div>
      </div>
      <div class="chart-card">
        <h3>Client Status Distribution</h3>
        <div class="chart-canvas-wrapper"><canvas id="chart-status"></canvas></div>
      </div>
      <div class="chart-card">
        <h3>Applications by Stage</h3>
        <div class="chart-canvas-wrapper"><canvas id="chart-pipeline"></canvas></div>
      </div>
      <div class="chart-card">
        <h3>Avg. Days Per Pipeline Stage</h3>
        <div class="chart-canvas-wrapper"><canvas id="chart-days-stage"></canvas></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    if (typeof Chart === 'undefined') return;
    const sessionsData = data.sessionsPerWeek || ANALYTICS.sessionsPerWeek;
    const sessionsLabels = data.weekLabels || ANALYTICS.weekLabels;

    // Sessions line chart
    if (chartInstances.sessions) chartInstances.sessions.destroy();
    chartInstances.sessions = new Chart(document.getElementById('chart-sessions'), {
      type: 'line',
      data: {
        labels: sessionsLabels,
        datasets: [{
          label: 'Sessions',
          data: sessionsData,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79,70,229,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Status donut
    if (chartInstances.status) chartInstances.status.destroy();
    chartInstances.status = new Chart(document.getElementById('chart-status'), {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Paused', 'Completed'],
        datasets: [{
          data: [ANALYTICS.clientStatusDist.active, ANALYTICS.clientStatusDist.paused, ANALYTICS.clientStatusDist.completed],
          backgroundColor: ['#10B981', '#F59E0B', '#94A3B8'],
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Pipeline bar chart
    if (chartInstances.pipeline) chartInstances.pipeline.destroy();
    chartInstances.pipeline = new Chart(document.getElementById('chart-pipeline'), {
      type: 'bar',
      data: {
        labels: Object.keys(ANALYTICS.applicationsByStage).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
          label: 'Applications',
          data: Object.values(ANALYTICS.applicationsByStage),
          backgroundColor: ['#94A3B8', '#4F46E5', '#3B82F6', '#F59E0B', '#10B981', '#64748B'],
          borderRadius: 6,
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Days per stage horizontal bar
    if (chartInstances.daysStage) chartInstances.daysStage.destroy();
    chartInstances.daysStage = new Chart(document.getElementById('chart-days-stage'), {
      type: 'bar',
      data: {
        labels: Object.keys(ANALYTICS.avgDaysPerStage).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
          label: 'Avg. Days',
          data: Object.values(ANALYTICS.avgDaysPerStage),
          backgroundColor: 'rgba(79,70,229,0.7)',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } }
      }
    });
  }, 100);
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function toggleNotifications() {
  document.getElementById('notification-panel').classList.toggle('open');
  renderNotifications();
}

function closeNotifications() {
  document.getElementById('notification-panel').classList.remove('open');
}

function renderNotifications() {
  const now = new Date();
  const todayStr = TODAY.toDateString();
  const yesterday = new Date(TODAY);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups = { today: [], yesterday: [], earlier: [] };
  NOTIFICATIONS.forEach(n => {
    const nDate = n.time.toDateString();
    if (nDate === todayStr) groups.today.push(n);
    else if (nDate === yesterdayStr) groups.yesterday.push(n);
    else groups.earlier.push(n);
  });

  const iconMap = { message: '&#9993;', calendar: '&#9716;', money: '&#9830;', celebration: '&#127881;' };

  let html = '';
  if (groups.today.length) {
    html += `<div class="notif-group-label">Today</div>`;
    groups.today.forEach(n => { html += notifItemHtml(n, iconMap); });
  }
  if (groups.yesterday.length) {
    html += `<div class="notif-group-label">Yesterday</div>`;
    groups.yesterday.forEach(n => { html += notifItemHtml(n, iconMap); });
  }
  if (groups.earlier.length) {
    html += `<div class="notif-group-label">Earlier</div>`;
    groups.earlier.forEach(n => { html += notifItemHtml(n, iconMap); });
  }

  document.getElementById('notif-body').innerHTML = html;
  updateNotifBadge();
}

function notifItemHtml(n, iconMap) {
  return `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead(${n.id});navigateTo('${n.link}')">
      <div class="notif-icon ${n.type}">${iconMap[n.type] || ''}</div>
      <div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${relativeTime(n.time)}</div>
      </div>
      ${n.read ? '' : '<div class="notif-dot"></div>'}
    </div>
  `;
}

function markNotifRead(id) {
  const n = NOTIFICATIONS.find(n => n.id === id);
  if (n) n.read = true;
  updateNotifBadge();
}

function markAllRead() {
  NOTIFICATIONS.forEach(n => n.read = true);
  renderNotifications();
}

function updateNotifBadge() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge');
  badge.textContent = unread;
  badge.style.display = unread > 0 ? 'flex' : 'none';
}

// ============================================================
// GLOBAL SEARCH
// ============================================================
function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  setTimeout(() => {
    const input = document.getElementById('search-modal-input');
    input.focus();
    input.value = '';
  }, 50);
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  document.getElementById('search-results').innerHTML = '';
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') {
    closeSearch();
    closeNotifications();
    closePopover();
    closeFab();
  }
});

document.getElementById('search-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('search-overlay')) closeSearch();
});

function handleSearch(query) {
  const q = query.toLowerCase().trim();
  if (q.length < 2) { document.getElementById('search-results').innerHTML = ''; return; }

  const results = [];

  // Clients
  CLIENTS.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .forEach(c => results.push({ category: 'Clients', icon: 'client-icon', title: c.name, meta: `${c.plan.charAt(0).toUpperCase() + c.plan.slice(1)} Plan - ${c.status}`, action: () => navigateTo('client-detail', {clientId: c.id}) }));

  // Documents
  DOCUMENTS.filter(d => d.name.toLowerCase().includes(q) || d.clientName.toLowerCase().includes(q))
    .forEach(d => results.push({ category: 'Documents', icon: 'doc-icon', title: d.name, meta: d.clientName, action: () => { selectedDocClient = d.clientId; selectedDoc = d.id; navigateTo('documents'); } }));

  // Events
  CALENDAR_EVENTS.filter(e => e.title.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q))
    .forEach(e => results.push({ category: 'Events', icon: 'event-icon', title: `${e.title} - ${e.clientName || 'Internal'}`, meta: `${formatDate(e.date)} ${e.startTime}`, action: () => { calendarDate = new Date(e.date); navigateTo('calendar'); } }));

  // Pipeline
  PIPELINE.filter(p => p.clientName.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
    .forEach(p => results.push({ category: 'Applications', icon: 'app-icon', title: `${p.clientName} - ${p.company}`, meta: `${p.role} (${p.stage})`, action: () => navigateTo('pipeline') }));

  // Render
  let html = '';
  const categories = [...new Set(results.map(r => r.category))];
  categories.forEach(cat => {
    html += `<div class="search-category">${cat}</div>`;
    results.filter(r => r.category === cat).slice(0, 5).forEach((r, i) => {
      html += `<div class="search-result-item" onclick="searchResults[${results.indexOf(r)}].action();closeSearch()">
        <div class="search-result-icon ${r.icon}">${cat === 'Clients' ? '&#9775;' : cat === 'Documents' ? '&#128196;' : cat === 'Events' ? '&#9716;' : '&#9733;'}</div>
        <div class="search-result-info">
          <div class="search-result-title">${r.title}</div>
          <div class="search-result-meta">${r.meta}</div>
        </div>
      </div>`;
    });
  });

  if (results.length === 0) {
    html = '<div style="padding:20px;text-align:center;color:var(--slate-500)">No results found</div>';
  }

  window.searchResults = results;
  document.getElementById('search-results').innerHTML = html;
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
  const page = document.getElementById('page-settings');
  page.innerHTML = `
    <h2 style="margin-bottom:16px">Settings</h2>

    <div class="settings-section">
      <h3>Profile</h3>
      <div class="settings-row">
        <span class="settings-label">Operator Name</span>
        <input type="text" class="settings-input" id="set-name" value="${OPERATOR.name}">
      </div>
      <div class="settings-row">
        <span class="settings-label">Business Name</span>
        <input type="text" class="settings-input" id="set-biz" value="${OPERATOR.businessName}">
      </div>
      <div class="settings-row">
        <span class="settings-label">Email</span>
        <input type="email" class="settings-input" id="set-email" value="${OPERATOR.email}">
      </div>
      <div class="settings-row">
        <span class="settings-label">Phone</span>
        <input type="text" class="settings-input" id="set-phone" value="${OPERATOR.phone}">
      </div>
      <div class="settings-row">
        <span class="settings-label">Avatar</span>
        <button class="btn btn-secondary" onclick="showToast('Profile photo selected','info')">Upload Photo</button>
      </div>
    </div>

    <div class="settings-section">
      <h3>Business Settings</h3>
      <div class="settings-row">
        <span class="settings-label">Default Session Duration</span>
        <select class="settings-input" id="set-duration">
          <option value="30" ${OPERATOR.defaultSessionDuration===30?'selected':''}>30 minutes</option>
          <option value="45" ${OPERATOR.defaultSessionDuration===45?'selected':''}>45 minutes</option>
          <option value="60" ${OPERATOR.defaultSessionDuration===60?'selected':''}>60 minutes</option>
        </select>
      </div>
      <div class="settings-row">
        <span class="settings-label">Working Hours Start</span>
        <input type="time" class="settings-input" id="set-start" value="${OPERATOR.workingHoursStart}">
      </div>
      <div class="settings-row">
        <span class="settings-label">Working Hours End</span>
        <input type="time" class="settings-input" id="set-end" value="${OPERATOR.workingHoursEnd}">
      </div>
      <div class="settings-row">
        <span class="settings-label">Time Zone</span>
        <select class="settings-input" id="set-tz">
          <option value="America/Los_Angeles" ${OPERATOR.timezone==='America/Los_Angeles'?'selected':''}>Pacific Time</option>
          <option value="America/Denver" ${OPERATOR.timezone==='America/Denver'?'selected':''}>Mountain Time</option>
          <option value="America/Chicago" ${OPERATOR.timezone==='America/Chicago'?'selected':''}>Central Time</option>
          <option value="America/New_York" ${OPERATOR.timezone==='America/New_York'?'selected':''}>Eastern Time</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <h3>Plans & Pricing</h3>
      <div class="plan-cards-edit">
        ${PLANS.map(p => `
          <div class="plan-card-edit">
            <h4>${p.name}</h4>
            <ul style="font-size:0.8rem;color:var(--slate-500);margin:8px 0;list-style:none">
              ${p.features.map(f => `<li style="margin-bottom:2px">&#10003; ${f}</li>`).join('')}
            </ul>
            <div class="plan-price-input">
              <span>$</span>
              <input type="number" id="plan-price-${p.id}" value="${p.price}">
              <span>/mo</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="settings-section">
      <h3>Notifications</h3>
      <div class="settings-row">
        <span class="settings-label">Email Notifications</span>
        <div class="toggle-switch ${OPERATOR.notifications.email?'on':''}" onclick="toggleSetting(this, 'email')"></div>
      </div>
      <div class="settings-row">
        <span class="settings-label">Session Reminders</span>
        <div class="toggle-switch ${OPERATOR.notifications.sessionReminders?'on':''}" onclick="toggleSetting(this, 'sessionReminders')"></div>
      </div>
      <div class="settings-row">
        <span class="settings-label">Payment Alerts</span>
        <div class="toggle-switch ${OPERATOR.notifications.paymentAlerts?'on':''}" onclick="toggleSetting(this, 'paymentAlerts')"></div>
      </div>
      <div class="settings-row">
        <span class="settings-label">Client Activity Alerts</span>
        <div class="toggle-switch ${OPERATOR.notifications.clientActivity?'on':''}" onclick="toggleSetting(this, 'clientActivity')"></div>
      </div>
    </div>

    <div style="text-align:right">
      <button class="btn btn-primary btn-lg" onclick="saveSettings()">Save Settings</button>
    </div>
  `;
}

function toggleSetting(el, key) {
  el.classList.toggle('on');
  OPERATOR.notifications[key] = el.classList.contains('on');
}

function saveSettings() {
  OPERATOR.name = document.getElementById('set-name').value;
  OPERATOR.businessName = document.getElementById('set-biz').value;
  OPERATOR.email = document.getElementById('set-email').value;
  OPERATOR.phone = document.getElementById('set-phone').value;
  OPERATOR.defaultSessionDuration = parseInt(document.getElementById('set-duration').value);
  OPERATOR.workingHoursStart = document.getElementById('set-start').value;
  OPERATOR.workingHoursEnd = document.getElementById('set-end').value;
  OPERATOR.timezone = document.getElementById('set-tz').value;

  PLANS.forEach(p => {
    const input = document.getElementById(`plan-price-${p.id}`);
    if (input) p.price = parseInt(input.value);
  });

  showToast('Settings saved successfully');
}

// ============================================================
// FAB (Quick Actions)
// ============================================================
function toggleFab() {
  const fab = document.getElementById('fab-main');
  const actions = document.getElementById('fab-actions');
  fab.classList.toggle('open');
  actions.classList.toggle('open');
}

function closeFab() {
  document.getElementById('fab-main').classList.remove('open');
  document.getElementById('fab-actions').classList.remove('open');
}

function fabAction(action) {
  closeFab();
  switch (action) {
    case 'addClient': openOnboarding(); break;
    case 'schedule': navigateTo('calendar'); setTimeout(() => openNewEvent(new Date().toISOString(), new Date().getHours()), 200); break;
    case 'newDoc': openNewDocModal(); break;
    case 'sendMsg': navigateTo('messaging'); break;
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.fab-container')) closeFab();
});

// ============================================================
// INIT
// ============================================================
updateNotifBadge();
renderDashboard();
