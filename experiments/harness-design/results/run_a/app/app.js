// ============================================================
// JobAgent AI - Operator Dashboard
// ============================================================

(function () {
  'use strict';

  // === Mock Data ===

  const COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
    '#10b981', '#3b82f6', '#06b6d4', '#14b8a6', '#f97316'
  ];

  function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
  function initials(name) { return name.split(' ').map(w => w[0]).join(''); }

  const clients = [
    { id: 1, name: 'Alex Chen', title: 'Senior Software Engineer', status: 'active', plan: 'professional', color: '#6366f1', apps: 12, interviews: 8, offers: 2, joined: '2026-02-10' },
    { id: 2, name: 'Maria Garcia', title: 'Product Manager', status: 'interviewing', plan: 'executive', color: '#ec4899', apps: 8, interviews: 5, offers: 1, joined: '2026-01-15' },
    { id: 3, name: 'James Wilson', title: 'Data Scientist', status: 'active', plan: 'professional', color: '#10b981', apps: 15, interviews: 6, offers: 0, joined: '2026-02-22' },
    { id: 4, name: 'Emma Thompson', title: 'UX Designer', status: 'onboarding', plan: 'starter', color: '#f59e0b', apps: 0, interviews: 0, offers: 0, joined: '2026-03-20' },
    { id: 5, name: 'David Kim', title: 'Engineering Manager', status: 'offer', plan: 'executive', color: '#8b5cf6', apps: 6, interviews: 4, offers: 2, joined: '2025-12-05' },
    { id: 6, name: 'Sarah Johnson', title: 'Marketing Director', status: 'active', plan: 'professional', color: '#3b82f6', apps: 10, interviews: 3, offers: 0, joined: '2026-03-01' },
    { id: 7, name: 'Ryan Patel', title: 'Full Stack Developer', status: 'active', plan: 'starter', color: '#06b6d4', apps: 7, interviews: 4, offers: 1, joined: '2026-02-18' },
    { id: 8, name: 'Lisa Wang', title: 'VP of Engineering', status: 'interviewing', plan: 'executive', color: '#ef4444', apps: 4, interviews: 3, offers: 0, joined: '2026-01-25' },
    { id: 9, name: 'Michael Brown', title: 'DevOps Engineer', status: 'active', plan: 'professional', color: '#14b8a6', apps: 9, interviews: 5, offers: 1, joined: '2026-02-14' },
    { id: 10, name: 'Jennifer Lee', title: 'Chief of Staff', status: 'offer', plan: 'executive', color: '#f97316', apps: 5, interviews: 4, offers: 2, joined: '2025-11-20' },
    { id: 11, name: 'Chris Martinez', title: 'Backend Engineer', status: 'onboarding', plan: 'starter', color: '#6366f1', apps: 0, interviews: 0, offers: 0, joined: '2026-03-22' },
    { id: 12, name: 'Amanda Foster', title: 'Product Designer', status: 'active', plan: 'professional', color: '#ec4899', apps: 11, interviews: 7, offers: 1, joined: '2026-01-30' },
    { id: 13, name: 'Kevin Zhang', title: 'ML Engineer', status: 'active', plan: 'professional', color: '#10b981', apps: 13, interviews: 4, offers: 0, joined: '2026-02-08' },
    { id: 14, name: 'Rachel Adams', title: 'Technical Writer', status: 'active', plan: 'starter', color: '#f59e0b', apps: 6, interviews: 2, offers: 0, joined: '2026-03-05' },
    { id: 15, name: 'Tom Sullivan', title: 'Solutions Architect', status: 'interviewing', plan: 'executive', color: '#8b5cf6', apps: 7, interviews: 5, offers: 1, joined: '2026-01-12' },
    { id: 16, name: 'Nina Kowalski', title: 'Frontend Developer', status: 'active', plan: 'professional', color: '#3b82f6', apps: 8, interviews: 3, offers: 0, joined: '2026-02-28' },
    { id: 17, name: 'Daniel Rivera', title: 'QA Lead', status: 'onboarding', plan: 'starter', color: '#06b6d4', apps: 0, interviews: 0, offers: 0, joined: '2026-03-24' },
    { id: 18, name: 'Olivia Park', title: 'Scrum Master', status: 'active', plan: 'professional', color: '#ef4444', apps: 5, interviews: 2, offers: 0, joined: '2026-03-10' },
    { id: 19, name: 'Brian Hughes', title: 'Security Engineer', status: 'interviewing', plan: 'professional', color: '#14b8a6', apps: 9, interviews: 6, offers: 1, joined: '2026-02-01' },
    { id: 20, name: 'Stephanie Clark', title: 'Data Analyst', status: 'active', plan: 'starter', color: '#f97316', apps: 4, interviews: 1, offers: 0, joined: '2026-03-15' },
    { id: 21, name: 'Marcus Green', title: 'Platform Engineer', status: 'active', plan: 'professional', color: '#6366f1', apps: 10, interviews: 5, offers: 1, joined: '2026-02-12' },
    { id: 22, name: 'Emily Rhodes', title: 'Business Analyst', status: 'interviewing', plan: 'professional', color: '#ec4899', apps: 7, interviews: 4, offers: 0, joined: '2026-01-20' },
    { id: 23, name: 'Jason Taylor', title: 'CTO', status: 'interviewing', plan: 'executive', color: '#10b981', apps: 3, interviews: 3, offers: 1, joined: '2025-12-15' },
    { id: 24, name: 'Laura Mitchell', title: 'iOS Developer', status: 'onboarding', plan: 'starter', color: '#f59e0b', apps: 0, interviews: 0, offers: 0, joined: '2026-03-25' },
  ];

  const jobs = [
    { id: 1, title: 'Senior Frontend Engineer', company: 'Stripe', clientId: 1, stage: 'applied', match: 95, salary: '$180-220k' },
    { id: 2, title: 'Staff Engineer', company: 'Airbnb', clientId: 1, stage: 'screening', match: 88, salary: '$200-260k' },
    { id: 3, title: 'Product Manager, Growth', company: 'Meta', clientId: 2, stage: 'interview', match: 92, salary: '$190-240k' },
    { id: 4, title: 'Senior PM', company: 'Notion', clientId: 2, stage: 'interview', match: 85, salary: '$175-210k' },
    { id: 5, title: 'ML Engineer', company: 'OpenAI', clientId: 3, stage: 'applied', match: 91, salary: '$250-350k' },
    { id: 6, title: 'Data Scientist', company: 'Netflix', clientId: 3, stage: 'applied', match: 87, salary: '$200-280k' },
    { id: 7, title: 'Senior Data Scientist', company: 'Spotify', clientId: 3, stage: 'screening', match: 83, salary: '$180-240k' },
    { id: 8, title: 'Engineering Manager', company: 'Google', clientId: 5, stage: 'offer', match: 96, salary: '$280-350k' },
    { id: 9, title: 'Director of Engineering', company: 'Figma', clientId: 5, stage: 'offer', match: 90, salary: '$300-380k' },
    { id: 10, title: 'Head of Marketing', company: 'Canva', clientId: 6, stage: 'applied', match: 78, salary: '$170-220k' },
    { id: 11, title: 'Senior Marketing Manager', company: 'HubSpot', clientId: 6, stage: 'screening', match: 84, salary: '$140-180k' },
    { id: 12, title: 'Full Stack Engineer', company: 'Vercel', clientId: 7, stage: 'interview', match: 89, salary: '$160-200k' },
    { id: 13, title: 'VP Engineering', company: 'Databricks', clientId: 8, stage: 'interview', match: 93, salary: '$350-450k' },
    { id: 14, title: 'VP Engineering', company: 'Scale AI', clientId: 8, stage: 'screening', match: 88, salary: '$320-400k' },
    { id: 15, title: 'Senior DevOps', company: 'Datadog', clientId: 9, stage: 'applied', match: 86, salary: '$170-210k' },
    { id: 16, title: 'Chief of Staff', company: 'Anthropic', clientId: 10, stage: 'offer', match: 97, salary: '$200-250k' },
    { id: 17, title: 'Product Designer', company: 'Linear', clientId: 12, stage: 'screening', match: 91, salary: '$150-190k' },
    { id: 18, title: 'Senior ML Engineer', company: 'Anyscale', clientId: 13, stage: 'applied', match: 85, salary: '$200-260k' },
    { id: 19, title: 'Solutions Architect', company: 'AWS', clientId: 15, stage: 'interview', match: 82, salary: '$180-230k' },
    { id: 20, title: 'Platform Engineer', company: 'Cloudflare', clientId: 21, stage: 'screening', match: 88, salary: '$175-215k' },
    { id: 21, title: 'Frontend Developer', company: 'Shopify', clientId: 16, stage: 'applied', match: 80, salary: '$140-180k' },
    { id: 22, title: 'Security Engineer', company: 'CrowdStrike', clientId: 19, stage: 'interview', match: 90, salary: '$180-230k' },
    { id: 23, title: 'CTO', company: 'Series B Startup', clientId: 23, stage: 'interview', match: 85, salary: '$250-320k + equity' },
    { id: 24, title: 'Backend Engineer', company: 'Supabase', clientId: 7, stage: 'applied', match: 82, salary: '$150-185k' },
  ];

  const activities = [
    { type: 'resume', text: '<strong>Resume optimized</strong> for Alex Chen targeting Stripe - Senior Frontend Engineer', time: '5 min ago' },
    { type: 'application', text: '<strong>Application submitted</strong> for James Wilson at Netflix - Data Scientist', time: '18 min ago' },
    { type: 'interview', text: '<strong>Interview scheduled</strong> for Maria Garcia at Meta - PM Growth, March 29 at 2:00 PM', time: '42 min ago' },
    { type: 'resume', text: '<strong>Cover letter generated</strong> for Kevin Zhang targeting Anyscale - Senior ML Engineer', time: '1 hr ago' },
    { type: 'offer', text: '<strong>Offer received!</strong> David Kim from Google - Engineering Manager, $320k TC', time: '2 hrs ago' },
    { type: 'application', text: '<strong>3 applications submitted</strong> for Sarah Johnson across marketing roles', time: '3 hrs ago' },
    { type: 'interview', text: '<strong>Mock interview completed</strong> for Brian Hughes - Security Engineer prep, scored 87/100', time: '4 hrs ago' },
    { type: 'resume', text: '<strong>LinkedIn profile optimized</strong> for Ryan Patel - projected 3.2x visibility increase', time: '5 hrs ago' },
    { type: 'application', text: '<strong>Job match alert:</strong> 5 new positions matching Amanda Foster\'s profile', time: '6 hrs ago' },
    { type: 'interview', text: '<strong>Interview feedback</strong> received for Tom Sullivan at AWS - positive, moving to final round', time: '8 hrs ago' },
    { type: 'offer', text: '<strong>Salary negotiation</strong> support provided for Jennifer Lee - Anthropic offer, +$25k increase', time: '1 day ago' },
    { type: 'resume', text: '<strong>Resume optimizer</strong> batch processed 4 resumes for new onboarding clients', time: '1 day ago' },
  ];

  const tasks = [
    { id: 1, title: 'Review Alex Chen\'s resume revisions', meta: 'Due today', priority: 'high', completed: false },
    { id: 2, title: 'Schedule mock interview for Maria Garcia', meta: 'Due today', priority: 'high', completed: false },
    { id: 3, title: 'Send onboarding package to Emma Thompson', meta: 'Due tomorrow', priority: 'medium', completed: false },
    { id: 4, title: 'Prepare salary negotiation brief for David Kim', meta: 'Due today', priority: 'high', completed: false },
    { id: 5, title: 'Follow up on Lisa Wang\'s Databricks interview', meta: 'Due Mar 28', priority: 'medium', completed: false },
    { id: 6, title: 'Update LinkedIn strategy for Nina Kowalski', meta: 'Due Mar 29', priority: 'low', completed: false },
    { id: 7, title: 'Review job matches for Marcus Green', meta: 'Due Mar 28', priority: 'medium', completed: false },
    { id: 8, title: 'Onboarding call with Daniel Rivera', meta: 'Due Mar 29', priority: 'medium', completed: false },
  ];

  const notifications = [
    { text: 'David Kim received an offer from Google - $320k TC', time: '2 hours ago', unread: true },
    { text: 'Maria Garcia\'s Meta interview is confirmed for March 29', time: '3 hours ago', unread: true },
    { text: 'New client signup: Laura Mitchell (iOS Developer)', time: '5 hours ago', unread: true },
    { text: 'AI Resume Optimizer completed batch processing', time: '6 hours ago', unread: false },
    { text: 'Payment received from Tom Sullivan - $1,200', time: '1 day ago', unread: false },
    { text: 'Brian Hughes scored 87/100 on mock interview', time: '1 day ago', unread: false },
    { text: 'Jennifer Lee accepted Anthropic offer!', time: '2 days ago', unread: false },
    { text: 'Weekly digest ready - 12 applications, 8 interviews', time: '3 days ago', unread: false },
  ];

  const transactions = [
    { client: 'David Kim', plan: 'Executive', amount: '$1,500', date: 'Mar 25, 2026', status: 'paid' },
    { client: 'Maria Garcia', plan: 'Executive', amount: '$1,500', date: 'Mar 24, 2026', status: 'paid' },
    { client: 'Alex Chen', plan: 'Professional', amount: '$800', date: 'Mar 23, 2026', status: 'paid' },
    { client: 'Tom Sullivan', plan: 'Executive', amount: '$1,500', date: 'Mar 22, 2026', status: 'paid' },
    { client: 'Amanda Foster', plan: 'Professional', amount: '$800', date: 'Mar 21, 2026', status: 'paid' },
    { client: 'Laura Mitchell', plan: 'Starter', amount: '$300', date: 'Mar 25, 2026', status: 'pending' },
    { client: 'James Wilson', plan: 'Professional', amount: '$800', date: 'Mar 20, 2026', status: 'paid' },
    { client: 'Ryan Patel', plan: 'Starter', amount: '$300', date: 'Mar 19, 2026', status: 'paid' },
    { client: 'Lisa Wang', plan: 'Executive', amount: '$1,500', date: 'Mar 18, 2026', status: 'paid' },
    { client: 'Sarah Johnson', plan: 'Professional', amount: '$800', date: 'Mar 17, 2026', status: 'paid' },
    { client: 'Chris Martinez', plan: 'Starter', amount: '$300', date: 'Mar 25, 2026', status: 'pending' },
    { client: 'Emily Rhodes', plan: 'Professional', amount: '$800', date: 'Mar 16, 2026', status: 'paid' },
  ];

  // === DOM Elements ===
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // === Navigation ===
  function initNav() {
    $$('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        navigateTo(page);
      });
    });
  }

  function navigateTo(page) {
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    $(`.nav-item[data-page="${page}"]`).classList.add('active');
    $$('.page').forEach(p => p.classList.remove('active'));
    $(`#page-${page}`).classList.add('active');
    $('#pageTitle').textContent = pageTitles[page] || page;
    // Close sidebar on mobile
    $('#sidebar').classList.remove('open');
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    clients: 'Clients',
    jobs: 'Job Pipeline',
    'ai-tools': 'AI Tools',
    billing: 'Billing & Revenue',
    reports: 'Reports & Analytics',
    settings: 'Settings',
  };

  // === Activity Feed ===
  function renderActivities(filter = 'all') {
    const list = $('#activityList');
    const iconMap = {
      resume: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      application: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      interview: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      offer: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>',
    };

    const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);
    list.innerHTML = filtered.map(a => `
      <div class="activity-item">
        <div class="activity-icon ${a.type}">${iconMap[a.type]}</div>
        <div class="activity-content">
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>
    `).join('');
  }

  // === Pipeline ===
  function renderPipeline() {
    const stages = { onboarding: [], active: [], interviewing: [], offer: [] };
    clients.forEach(c => {
      if (stages[c.status]) stages[c.status].push(c);
    });

    Object.entries(stages).forEach(([stage, cls]) => {
      const container = $(`#stage-${stage}`);
      if (!container) return;
      container.innerHTML = cls.map(c => `
        <div class="stage-client-chip" data-client-id="${c.id}">
          <div class="chip-avatar" style="background:${c.color}">${initials(c.name)}</div>
          <span>${c.name.split(' ')[0]}</span>
        </div>
      `).join('');
    });

    // Click handlers on chips
    $$('.stage-client-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const client = clients.find(c => c.id === parseInt(chip.dataset.clientId));
        if (client) showClientModal(client);
      });
    });
  }

  // === Tasks ===
  function renderTasks() {
    const list = $('#taskList');
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const all = [...pending, ...completed];

    list.innerHTML = all.map(t => `
      <div class="task-item ${t.completed ? 'completed' : ''}" data-task-id="${t.id}">
        <div class="task-checkbox ${t.completed ? 'checked' : ''}"></div>
        <div class="task-info">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">${t.meta}</div>
        </div>
        <span class="task-priority ${t.priority}">${t.priority}</span>
      </div>
    `).join('');

    $('#taskCountBadge').textContent = `${pending.length} pending`;

    $$('.task-checkbox').forEach(cb => {
      cb.addEventListener('click', () => {
        const item = cb.closest('.task-item');
        const task = tasks.find(t => t.id === parseInt(item.dataset.taskId));
        if (task) {
          task.completed = !task.completed;
          renderTasks();
          showToast(task.completed ? 'Task completed' : 'Task reopened', 'success');
        }
      });
    });
  }

  // === Chart (Canvas) ===
  function drawChart(canvas, data, colors) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const w = canvas.width - padding.left - padding.right;
    const h = canvas.height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxVal = Math.max(...data.flatMap(d => d.values));
    const labels = data[0].labels;
    const barGroupWidth = w / labels.length;

    // Grid lines
    ctx.strokeStyle = '#f0f1f3';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(canvas.width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
    }

    // Bars
    const barCount = data.length;
    const barWidth = Math.min(16, (barGroupWidth - 12) / barCount);

    data.forEach((series, si) => {
      series.values.forEach((val, vi) => {
        const barH = (val / maxVal) * h;
        const x = padding.left + vi * barGroupWidth + (barGroupWidth - barCount * barWidth - (barCount - 1) * 3) / 2 + si * (barWidth + 3);
        const y = padding.top + h - barH;

        ctx.fillStyle = colors[si];
        ctx.beginPath();
        const r = 3;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, y + barH);
        ctx.lineTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();
      });
    });

    // Labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      const x = padding.left + i * barGroupWidth + barGroupWidth / 2;
      ctx.fillText(label, x, canvas.height - 8);
    });
  }

  const chartDataSets = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        { values: [5, 8, 6, 9, 12, 3, 2] },
        { values: [2, 4, 3, 5, 6, 1, 1] },
        { values: [0, 1, 0, 1, 2, 0, 0] },
      ]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      series: [
        { values: [22, 28, 35, 31] },
        { values: [10, 14, 18, 15] },
        { values: [2, 4, 5, 3] },
      ]
    },
    quarter: {
      labels: ['Jan', 'Feb', 'Mar'],
      series: [
        { values: [85, 102, 116] },
        { values: [38, 49, 57] },
        { values: [8, 12, 14] },
      ]
    }
  };

  function renderMetricsChart(range = 'week') {
    const canvas = $('#metricsChart');
    if (!canvas) return;
    const ds = chartDataSets[range];
    const series = ds.series.map(s => ({ ...s, labels: ds.labels }));
    drawChart(canvas, series, ['#3b82f6', '#10b981', '#8b5cf6']);
  }

  function renderRevenueChart() {
    const canvas = $('#revenueChart');
    if (!canvas) return;
    const data = [
      { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], values: [12400, 13800, 14200, 15600, 17000, 18400] }
    ];
    drawChart(canvas, data, ['#6366f1']);
  }

  // === Client Grid ===
  function renderClientGrid(statusFilter = 'all', planFilter = 'all', searchTerm = '') {
    const grid = $('#clientGrid');
    let filtered = clients;

    if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
    if (planFilter !== 'all') filtered = filtered.filter(c => c.plan === planFilter);
    if (searchTerm) filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusLabels = { onboarding: 'Onboarding', active: 'Active Search', interviewing: 'Interviewing', offer: 'Offer Stage', placed: 'Placed' };

    grid.innerHTML = filtered.map(c => `
      <div class="client-card" data-client-id="${c.id}">
        <div class="client-card-header">
          <div class="client-avatar" style="background:${c.color}">${initials(c.name)}</div>
          <div>
            <div class="client-name">${c.name}</div>
            <div class="client-title">${c.title}</div>
            <div class="client-plan">${c.plan.charAt(0).toUpperCase() + c.plan.slice(1)} Plan</div>
          </div>
          <span class="client-status status-${c.status}">${statusLabels[c.status]}</span>
        </div>
        <div class="client-stats">
          <div class="client-stat">
            <span class="client-stat-value">${c.apps}</span>
            <span class="client-stat-label">Applications</span>
          </div>
          <div class="client-stat">
            <span class="client-stat-value">${c.interviews}</span>
            <span class="client-stat-label">Interviews</span>
          </div>
          <div class="client-stat">
            <span class="client-stat-value">${c.offers}</span>
            <span class="client-stat-label">Offers</span>
          </div>
        </div>
      </div>
    `).join('');

    $$('.client-card').forEach(card => {
      card.addEventListener('click', () => {
        const client = clients.find(c => c.id === parseInt(card.dataset.clientId));
        if (client) showClientModal(client);
      });
    });
  }

  // === Kanban Board ===
  function renderKanban() {
    const stages = {
      applied: { label: 'Applied', color: '#3b82f6' },
      screening: { label: 'Screening', color: '#f59e0b' },
      interview: { label: 'Interview', color: '#8b5cf6' },
      offer: { label: 'Offer', color: '#10b981' },
      rejected: { label: 'Rejected', color: '#ef4444' },
    };

    const board = $('#kanbanBoard');
    board.innerHTML = Object.entries(stages).map(([key, stage]) => {
      const stageJobs = jobs.filter(j => j.stage === key);
      return `
        <div class="kanban-column">
          <div class="kanban-column-header">
            <span class="kanban-column-title">${stage.label}</span>
            <span class="kanban-column-count">${stageJobs.length}</span>
          </div>
          ${stageJobs.map(j => {
            const client = clients.find(c => c.id === j.clientId);
            const matchClass = j.match >= 90 ? 'high' : j.match >= 80 ? 'medium' : 'low';
            return `
              <div class="kanban-card" data-job-id="${j.id}">
                <div class="kanban-card-title">${j.title}</div>
                <div class="kanban-card-company">${j.company} &middot; ${j.salary}</div>
                <div class="kanban-card-footer">
                  <div class="kanban-card-client">
                    <span class="mini-avatar" style="background:${client ? client.color : '#999'}">${client ? initials(client.name) : '?'}</span>
                    ${client ? client.name.split(' ')[0] : 'Unknown'}
                  </div>
                  <span class="kanban-card-match match-${matchClass}">${j.match}% match</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }).join('');

    $$('.kanban-card').forEach(card => {
      card.addEventListener('click', () => {
        const job = jobs.find(j => j.id === parseInt(card.dataset.jobId));
        if (job) showJobModal(job);
      });
    });
  }

  function renderJobList() {
    const listView = $('#jobListView');
    listView.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Company</th>
            <th>Client</th>
            <th>Match</th>
            <th>Salary</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          ${jobs.map(j => {
            const client = clients.find(c => c.id === j.clientId);
            const stageLabels = { applied: 'Applied', screening: 'Screening', interview: 'Interview', offer: 'Offer' };
            const stageColors = { applied: 'status-active', screening: 'status-onboarding', interview: 'status-interviewing', offer: 'status-offer' };
            return `
              <tr class="job-row" data-job-id="${j.id}">
                <td><strong>${j.title}</strong></td>
                <td>${j.company}</td>
                <td>${client ? client.name : 'Unknown'}</td>
                <td><span class="kanban-card-match match-${j.match >= 90 ? 'high' : j.match >= 80 ? 'medium' : 'low'}">${j.match}%</span></td>
                <td>${j.salary}</td>
                <td><span class="client-status ${stageColors[j.stage]}">${stageLabels[j.stage]}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    $$('.job-row').forEach(row => {
      row.addEventListener('click', () => {
        const job = jobs.find(j => j.id === parseInt(row.dataset.jobId));
        if (job) showJobModal(job);
      });
    });
  }

  // === Billing Table ===
  function renderBillingTable(filter = 'all') {
    const tbody = $('#billingTableBody');
    let filtered = transactions;
    if (filter === 'payments') filtered = filtered.filter(t => t.status === 'paid');
    if (filter === 'pending') filtered = filtered.filter(t => t.status === 'pending');
    if (filter === 'refunds') filtered = filtered.filter(t => t.status === 'failed');

    tbody.innerHTML = filtered.map(t => `
      <tr>
        <td>${t.client}</td>
        <td>${t.plan}</td>
        <td><strong>${t.amount}</strong></td>
        <td>${t.date}</td>
        <td><span class="table-status ${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
        <td><button class="btn btn-sm btn-ghost">View</button></td>
      </tr>
    `).join('');
  }

  // === Notifications ===
  function renderNotifications() {
    const list = $('#notifList');
    list.innerHTML = notifications.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-dot"></div>
        <div class="notif-content">
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  }

  // === Modals ===
  function openModal(title, bodyHTML) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = bodyHTML;
    $('#modalOverlay').classList.add('active');
  }

  function closeModal() {
    $('#modalOverlay').classList.remove('active');
  }

  function showClientModal(client) {
    const clientJobs = jobs.filter(j => j.clientId === client.id);
    const statusLabels = { onboarding: 'Onboarding', active: 'Active Search', interviewing: 'Interviewing', offer: 'Offer Stage' };
    openModal(client.name, `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
        <div class="client-avatar" style="background:${client.color};width:52px;height:52px;font-size:1.1rem">${initials(client.name)}</div>
        <div>
          <div style="font-weight:600;font-size:1.05rem">${client.name}</div>
          <div style="color:var(--text-secondary);font-size:0.85rem">${client.title}</div>
          <div style="margin-top:4px"><span class="client-status status-${client.status}">${statusLabels[client.status]}</span></div>
        </div>
      </div>
      <div class="client-stats" style="margin:0 0 20px;padding-top:0;border-top:none;border-bottom:1px solid var(--border-light);padding-bottom:16px">
        <div class="client-stat"><span class="client-stat-value">${client.apps}</span><span class="client-stat-label">Applications</span></div>
        <div class="client-stat"><span class="client-stat-value">${client.interviews}</span><span class="client-stat-label">Interviews</span></div>
        <div class="client-stat"><span class="client-stat-value">${client.offers}</span><span class="client-stat-label">Offers</span></div>
      </div>
      <h4 style="font-size:0.9rem;margin-bottom:10px">Active Job Applications (${clientJobs.length})</h4>
      ${clientJobs.length ? clientJobs.map(j => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-light)">
          <div>
            <div style="font-weight:600;font-size:0.85rem">${j.title}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${j.company} &middot; ${j.salary}</div>
          </div>
          <span class="kanban-card-match match-${j.match >= 90 ? 'high' : j.match >= 80 ? 'medium' : 'low'}">${j.match}%</span>
        </div>
      `).join('') : '<p style="color:var(--text-muted);font-size:0.85rem">No active applications yet.</p>'}
      <div style="display:flex;gap:8px;margin-top:20px">
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('modalOverlay').classList.remove('active')">Close</button>
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('modalOverlay').classList.remove('active')">Edit Client</button>
      </div>
    `);
  }

  function showJobModal(job) {
    const client = clients.find(c => c.id === job.clientId);
    const stageLabels = { applied: 'Applied', screening: 'Screening', interview: 'Interview', offer: 'Offer' };
    openModal(job.title, `
      <div style="margin-bottom:16px">
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px">${job.company}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <span class="client-status status-${job.stage === 'applied' ? 'active' : job.stage === 'screening' ? 'onboarding' : job.stage === 'interview' ? 'interviewing' : 'offer'}">${stageLabels[job.stage]}</span>
          <span class="kanban-card-match match-${job.match >= 90 ? 'high' : job.match >= 80 ? 'medium' : 'low'}" style="font-size:0.82rem">${job.match}% match</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
        <div style="padding:12px;background:var(--bg);border-radius:var(--radius)">
          <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:2px">Salary Range</div>
          <div style="font-weight:600;font-size:0.9rem">${job.salary}</div>
        </div>
        <div style="padding:12px;background:var(--bg);border-radius:var(--radius)">
          <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:2px">Client</div>
          <div style="font-weight:600;font-size:0.9rem">${client ? client.name : 'Unknown'}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('modalOverlay').classList.remove('active')">Close</button>
      </div>
    `);
  }

  function showAddClientModal() {
    openModal('Add New Client', `
      <form id="addClientForm">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" class="form-input" placeholder="Enter client name" required id="newClientName">
        </div>
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" class="form-input" placeholder="e.g., Senior Engineer" required id="newClientTitle">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-input" placeholder="client@email.com" required id="newClientEmail">
        </div>
        <div class="form-group">
          <label>Plan</label>
          <select class="form-input" id="newClientPlan">
            <option value="starter">Starter ($300/mo)</option>
            <option value="professional" selected>Professional ($800/mo)</option>
            <option value="executive">Executive ($1,500/mo)</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px">Add Client</button>
      </form>
    `);

    setTimeout(() => {
      const form = $('#addClientForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = $('#newClientName').value;
          const title = $('#newClientTitle').value;
          const plan = $('#newClientPlan').value;
          clients.push({
            id: clients.length + 1,
            name,
            title,
            status: 'onboarding',
            plan,
            color: randomColor(),
            apps: 0,
            interviews: 0,
            offers: 0,
            joined: '2026-03-27',
          });
          closeModal();
          renderPipeline();
          renderClientGrid();
          showToast(`${name} added as a new client`, 'success');
        });
      }
    }, 50);
  }

  // === Toast ===
  function showToast(message, type = 'info') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // === Search ===
  function initSearch() {
    const globalSearch = $('#globalSearch');
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const term = globalSearch.value.trim();
        if (!term) return;
        // Search in clients
        const matchedClient = clients.find(c =>
          c.name.toLowerCase().includes(term.toLowerCase())
        );
        if (matchedClient) {
          navigateTo('clients');
          renderClientGrid('all', 'all', term);
          showToast(`Found client: ${matchedClient.name}`, 'info');
        } else {
          // Search in jobs
          const matchedJob = jobs.find(j =>
            j.title.toLowerCase().includes(term.toLowerCase()) ||
            j.company.toLowerCase().includes(term.toLowerCase())
          );
          if (matchedJob) {
            navigateTo('jobs');
            showJobModal(matchedJob);
          } else {
            showToast('No results found', 'error');
          }
        }
      }
    });
  }

  // === Event Listeners ===
  function initEventListeners() {
    // Menu toggle (mobile)
    $('#menuToggle').addEventListener('click', () => {
      $('#sidebar').classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      const sidebar = $('#sidebar');
      const toggle = $('#menuToggle');
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    // Activity filter
    $('#activityFilter').addEventListener('change', (e) => {
      renderActivities(e.target.value);
    });

    // Chart tabs
    $$('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const parent = tab.closest('.chart-tabs') || tab.parentElement;
        parent.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.range) {
          renderMetricsChart(tab.dataset.range);
        }
      });
    });

    // Add client buttons
    $('#addClientBtn').addEventListener('click', showAddClientModal);
    $('#addClientBtnMain').addEventListener('click', showAddClientModal);

    // Client page filters
    $('#clientStatusFilter').addEventListener('change', () => {
      renderClientGrid($('#clientStatusFilter').value, $('#clientPlanFilter').value, $('#clientSearch').value);
    });
    $('#clientPlanFilter').addEventListener('change', () => {
      renderClientGrid($('#clientStatusFilter').value, $('#clientPlanFilter').value, $('#clientSearch').value);
    });
    $('#clientSearch').addEventListener('input', () => {
      renderClientGrid($('#clientStatusFilter').value, $('#clientPlanFilter').value, $('#clientSearch').value);
    });

    // Job view toggle
    $('#boardViewBtn').addEventListener('click', () => {
      $('#boardViewBtn').classList.add('active');
      $('#listViewBtn').classList.remove('active');
      $('#kanbanBoard').classList.remove('hidden');
      $('#jobListView').classList.add('hidden');
    });
    $('#listViewBtn').addEventListener('click', () => {
      $('#listViewBtn').classList.add('active');
      $('#boardViewBtn').classList.remove('active');
      $('#jobListView').classList.remove('hidden');
      $('#kanbanBoard').classList.add('hidden');
    });

    // Job search
    $('#jobSearch').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      $$('.kanban-card').forEach(card => {
        const title = card.querySelector('.kanban-card-title').textContent.toLowerCase();
        const company = card.querySelector('.kanban-card-company').textContent.toLowerCase();
        card.style.display = (title.includes(term) || company.includes(term)) ? '' : 'none';
      });
    });

    // Billing filter
    $('#billingFilter').addEventListener('change', (e) => {
      renderBillingTable(e.target.value);
    });

    // Modal close
    $('#modalClose').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', (e) => {
      if (e.target === $('#modalOverlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        $('#notificationPanel').classList.remove('active');
      }
    });

    // Notification panel
    $('#notifBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      $('#notificationPanel').classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      const panel = $('#notificationPanel');
      if (panel.classList.contains('active') && !panel.contains(e.target) && e.target !== $('#notifBtn')) {
        panel.classList.remove('active');
      }
    });

    $('#markAllRead').addEventListener('click', () => {
      notifications.forEach(n => n.unread = false);
      renderNotifications();
      $('.notification-dot').style.display = 'none';
      showToast('All notifications marked as read', 'success');
    });

    // Settings tabs
    $$('.settings-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        $$('.settings-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $$('.settings-panel').forEach(p => p.classList.remove('active'));
        $(`#settings-${tab.dataset.settings}`).classList.add('active');
      });
    });

    // Save profile
    $('#saveProfileBtn').addEventListener('click', () => {
      showToast('Profile settings saved', 'success');
    });

    // Quick action button
    $('#quickActionBtn').addEventListener('click', showAddClientModal);

    // AI Tool launch buttons
    $$('.tool-card .btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const toolName = btn.closest('.tool-card').querySelector('h3').textContent;
        showToast(`Launching ${toolName}...`, 'info');
      });
    });

    // Window resize - redraw charts
    window.addEventListener('resize', () => {
      renderMetricsChart($('.chart-tab.active')?.dataset?.range || 'week');
      renderRevenueChart();
    });
  }

  // === Initialize ===
  function init() {
    initNav();
    renderActivities();
    renderPipeline();
    renderTasks();
    renderMetricsChart('week');
    renderClientGrid();
    renderKanban();
    renderJobList();
    renderBillingTable();
    renderNotifications();
    renderRevenueChart();
    initEventListeners();
    initSearch();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
