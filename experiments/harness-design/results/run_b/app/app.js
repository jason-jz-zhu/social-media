// ============================================================
// JobAgent Operator Dashboard — Application Logic
// ============================================================

(function() {
    'use strict';

    // --- State ---
    let currentPage = 'dashboard';
    let clientFilter = 'all';
    let clientSearch = '';
    let clientSort = { col: 'name', dir: 'asc' };
    let notifications = [...NOTIFICATIONS];
    let wizardStep = 0;
    let wizardData = {};

    // --- DOM Refs ---
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const sidebarClose = document.getElementById('sidebarClose');
    const content = document.getElementById('content');
    const navItems = document.querySelectorAll('.nav-item');
    const themeToggle = document.getElementById('themeToggle');
    const globalSearch = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');
    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationDropdown');
    const notifBadge = document.getElementById('notifBadge');
    const notifList = document.getElementById('notifList');
    const markAllRead = document.getElementById('markAllRead');
    const clientDetailModal = document.getElementById('clientDetailModal');
    const clientDetailBody = document.getElementById('clientDetailBody');
    const modalClose = document.getElementById('modalClose');
    const onboardingModal = document.getElementById('onboardingModal');
    const onboardingBody = document.getElementById('onboardingBody');
    const onboardingClose = document.getElementById('onboardingClose');
    const fabBtn = document.getElementById('fabBtn');
    const fabMenu = document.getElementById('fabMenu');

    // --- Navigation ---
    function navigate(page) {
        currentPage = page;
        navItems.forEach(n => n.classList.toggle('active', n.dataset.page === page));
        renderPage();
        sidebar.classList.remove('open');
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(item.dataset.page);
        });
    });

    hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
    sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

    // --- Theme ---
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
    });

    // --- Notifications ---
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('visible');
    });
    markAllRead.addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        renderNotifications();
    });
    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
            notifDropdown.classList.remove('visible');
        }
        if (!searchResults.contains(e.target) && e.target !== globalSearch) {
            searchResults.classList.remove('visible');
        }
        if (!fabMenu.contains(e.target) && !fabBtn.contains(e.target)) {
            fabMenu.classList.remove('visible');
            fabBtn.classList.remove('open');
        }
    });

    function renderNotifications() {
        const unread = notifications.filter(n => !n.read).length;
        notifBadge.textContent = unread;
        notifBadge.classList.toggle('hidden', unread === 0);
        notifList.innerHTML = notifications.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
                <div class="notif-dot ${n.type}"></div>
                <div class="notif-content">
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-message">${n.message}</div>
                    <div class="notif-time">${n.time}</div>
                </div>
            </div>
        `).join('');
        notifList.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', () => {
                const notif = notifications.find(n => n.id === parseInt(item.dataset.id));
                if (notif) notif.read = true;
                renderNotifications();
            });
        });
    }

    // --- Global Search ---
    globalSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (q.length < 2) { searchResults.classList.remove('visible'); return; }

        let results = [];
        CLIENTS.forEach(c => {
            if (c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) {
                results.push({ type: 'client', text: `${c.name} — ${c.role}`, id: c.id });
            }
        });
        PIPELINE_JOBS.forEach(j => {
            const client = CLIENTS.find(c => c.id === j.clientId);
            if (j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q)) {
                results.push({ type: 'job', text: `${j.company} — ${j.role} (${client ? client.name : ''})`, id: j.id });
            }
        });
        ACTIVITY_FEED.forEach(a => {
            if (a.message.toLowerCase().includes(q)) {
                results.push({ type: 'activity', text: a.message.substring(0, 80) + '...', id: a.id });
            }
        });

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            searchResults.innerHTML = results.slice(0, 8).map(r => `
                <div class="search-result-item" data-type="${r.type}" data-id="${r.id}">
                    <span class="search-result-type ${r.type}">${r.type}</span>
                    <span class="search-result-text">${r.text}</span>
                </div>
            `).join('');
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const type = item.dataset.type;
                    searchResults.classList.remove('visible');
                    globalSearch.value = '';
                    if (type === 'client') {
                        navigate('clients');
                        setTimeout(() => openClientDetail(parseInt(item.dataset.id)), 100);
                    } else if (type === 'job') {
                        navigate('pipeline');
                    } else {
                        navigate('activity');
                    }
                });
            });
        }
        searchResults.classList.add('visible');
    });

    // --- FAB ---
    fabBtn.addEventListener('click', () => {
        fabBtn.classList.toggle('open');
        fabMenu.classList.toggle('visible');
    });
    fabMenu.querySelectorAll('.fab-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            fabBtn.classList.remove('open');
            fabMenu.classList.remove('visible');
            if (action === 'addClient') openOnboardingWizard();
            else if (action === 'createJob') { navigate('pipeline'); }
            else if (action === 'sendReport') { alert('Report generation initiated. A summary will be emailed to all active clients.'); }
        });
    });

    // --- Page Rendering ---
    function renderPage() {
        switch (currentPage) {
            case 'dashboard': renderDashboard(); break;
            case 'clients': renderClients(); break;
            case 'pipeline': renderPipeline(); break;
            case 'activity': renderActivity(); break;
            case 'analytics': renderAnalytics(); break;
            case 'settings': renderSettings(); break;
        }
    }

    // --- Dashboard Page ---
    function renderDashboard() {
        const activeClients = CLIENTS.filter(c => c.status === 'active').length;
        const totalJobs = PIPELINE_JOBS.length;
        const placed = CLIENTS.filter(c => c.status === 'placed').length;
        const successRate = Math.round((placed / CLIENTS.length) * 100);
        const revenue = placed * 8500;

        content.innerHTML = `
            <div class="page active">
                <div class="page-header">
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-subtitle">Welcome back, Sarah. Here's your business overview.</p>
                </div>
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-icon clients">&#128101;</div>
                        <div class="kpi-label">Active Clients</div>
                        <div class="kpi-value">${activeClients}</div>
                        <div class="kpi-change up">&#9650; 2 this week</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon jobs">&#128188;</div>
                        <div class="kpi-label">Active Jobs</div>
                        <div class="kpi-value">${totalJobs}</div>
                        <div class="kpi-change up">&#9650; 5 new today</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon rate">&#127919;</div>
                        <div class="kpi-label">Success Rate</div>
                        <div class="kpi-value">${successRate}%</div>
                        <div class="kpi-change up">&#9650; 3% vs last month</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon revenue">&#128176;</div>
                        <div class="kpi-label">Revenue (MTD)</div>
                        <div class="kpi-value">$${revenue.toLocaleString()}</div>
                        <div class="kpi-change up">&#9650; $2,500 vs target</div>
                    </div>
                </div>
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Activity</h3>
                        </div>
                        <div class="activity-list" id="dashboardActivity"></div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Pipeline Snapshot</h3>
                        </div>
                        <div id="dashboardPipeline"></div>
                    </div>
                </div>
            </div>
        `;
        // Recent activity (last 5)
        const actEl = document.getElementById('dashboardActivity');
        actEl.innerHTML = ACTIVITY_FEED.slice(0, 5).map(a => renderActivityItem(a)).join('');
        // Pipeline snapshot
        const stages = ['applied', 'screening', 'interview', 'offer', 'placed'];
        const pipEl = document.getElementById('dashboardPipeline');
        pipEl.innerHTML = '<div class="chart-bar-group">' + stages.map(s => {
            const count = PIPELINE_JOBS.filter(j => j.stage === s).length;
            const pct = Math.round((count / PIPELINE_JOBS.length) * 100);
            const colors = { applied: '#94a3b8', screening: '#60a5fa', interview: '#a78bfa', offer: '#34d399', placed: '#6366f1' };
            return `<div class="chart-bar-item">
                <span class="chart-bar-label">${s.charAt(0).toUpperCase() + s.slice(1)}</span>
                <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:${colors[s]}">${count}</div></div>
            </div>`;
        }).join('') + '</div>';
    }

    // --- Clients Page ---
    function renderClients() {
        content.innerHTML = `
            <div class="page active">
                <div class="page-header">
                    <h1 class="page-title">Clients</h1>
                    <p class="page-subtitle">Manage your ${CLIENTS.length} career coaching clients</p>
                </div>
                <div class="card">
                    <div class="table-controls">
                        <input type="text" class="table-search" id="clientTableSearch" placeholder="Search clients..." value="${clientSearch}">
                        <div style="display:flex; gap:8px; align-items:center;">
                            <div class="table-filters" id="clientFilters">
                                <button class="filter-btn ${clientFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                                <button class="filter-btn ${clientFilter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
                                <button class="filter-btn ${clientFilter === 'paused' ? 'active' : ''}" data-filter="paused">Paused</button>
                                <button class="filter-btn ${clientFilter === 'placed' ? 'active' : ''}" data-filter="placed">Placed</button>
                                <button class="filter-btn ${clientFilter === 'inactive' ? 'active' : ''}" data-filter="inactive">Inactive</button>
                            </div>
                            <button class="btn-export" id="exportBtn">&#128229; Export CSV</button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th data-col="name">Name <span class="sort-arrow">${sortArrow('name')}</span></th>
                                    <th data-col="role">Current Role <span class="sort-arrow">${sortArrow('role')}</span></th>
                                    <th data-col="targetRole">Target Role</th>
                                    <th data-col="status">Status <span class="sort-arrow">${sortArrow('status')}</span></th>
                                    <th data-col="resumeScore">Resume <span class="sort-arrow">${sortArrow('resumeScore')}</span></th>
                                    <th data-col="applications">Apps <span class="sort-arrow">${sortArrow('applications')}</span></th>
                                    <th data-col="interviews">Interviews</th>
                                    <th data-col="agent">Agent</th>
                                    <th data-col="lastActivity">Last Active <span class="sort-arrow">${sortArrow('lastActivity')}</span></th>
                                </tr>
                            </thead>
                            <tbody id="clientTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        renderClientRows();

        // Event: search
        document.getElementById('clientTableSearch').addEventListener('input', (e) => {
            clientSearch = e.target.value;
            renderClientRows();
        });
        // Event: filters
        document.getElementById('clientFilters').querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                clientFilter = btn.dataset.filter;
                document.querySelectorAll('#clientFilters .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderClientRows();
            });
        });
        // Event: sort
        document.querySelectorAll('thead th[data-col]').forEach(th => {
            th.addEventListener('click', () => {
                const col = th.dataset.col;
                if (clientSort.col === col) {
                    clientSort.dir = clientSort.dir === 'asc' ? 'desc' : 'asc';
                } else {
                    clientSort = { col, dir: 'asc' };
                }
                renderClients();
            });
        });
        // Event: export
        document.getElementById('exportBtn').addEventListener('click', exportCSV);
    }

    function sortArrow(col) {
        if (clientSort.col !== col) return '';
        return clientSort.dir === 'asc' ? '&#9650;' : '&#9660;';
    }

    function renderClientRows() {
        let filtered = [...CLIENTS];
        if (clientFilter !== 'all') filtered = filtered.filter(c => c.status === clientFilter);
        if (clientSearch) {
            const q = clientSearch.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
        }
        filtered.sort((a, b) => {
            let va = a[clientSort.col], vb = b[clientSort.col];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return clientSort.dir === 'asc' ? -1 : 1;
            if (va > vb) return clientSort.dir === 'asc' ? 1 : -1;
            return 0;
        });

        const tbody = document.getElementById('clientTableBody');
        tbody.innerHTML = filtered.map((c, i) => `
            <tr data-id="${c.id}">
                <td>
                    <div class="client-cell">
                        <div class="client-avatar avatar-${(i % 6) + 1}">${c.avatar}</div>
                        <span class="client-name-col">${c.name}</span>
                    </div>
                </td>
                <td>${c.role}</td>
                <td>${c.targetRole}</td>
                <td><span class="status-badge ${c.status}"><span class="status-dot"></span>${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
                <td>${c.resumeScore}/100</td>
                <td>${c.applications}</td>
                <td>${c.interviews}</td>
                <td>${c.agent}</td>
                <td>${timeAgo(c.lastActivity)}</td>
            </tr>
        `).join('');

        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', () => openClientDetail(parseInt(row.dataset.id)));
        });
    }

    // --- Client Detail ---
    function openClientDetail(clientId) {
        const c = CLIENTS.find(cl => cl.id === clientId);
        if (!c) return;
        const jobs = PIPELINE_JOBS.filter(j => j.clientId === clientId);
        const activities = ACTIVITY_FEED.filter(a => a.clientId === clientId);

        clientDetailBody.innerHTML = `
            <div class="client-detail-header">
                <div class="client-detail-avatar">${c.avatar}</div>
                <div>
                    <div class="client-detail-name">${c.name}</div>
                    <div class="client-detail-role">${c.role} &rarr; ${c.targetRole}</div>
                </div>
                <span class="status-badge ${c.status}" style="margin-left:auto"><span class="status-dot"></span>${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
            </div>
            <div class="detail-stat-grid mb-2">
                <div class="detail-stat"><div class="detail-stat-value">${c.resumeScore}</div><div class="detail-stat-label">Resume Score</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${c.applications}</div><div class="detail-stat-label">Applications</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${c.interviews}</div><div class="detail-stat-label">Interviews</div></div>
                <div class="detail-stat"><div class="detail-stat-value">${c.offers}</div><div class="detail-stat-label">Offers</div></div>
            </div>
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Email</div><div class="detail-value">${c.email}</div></div>
                <div class="detail-item"><div class="detail-label">Phone</div><div class="detail-value">${c.phone}</div></div>
                <div class="detail-item"><div class="detail-label">Location</div><div class="detail-value">${c.location}</div></div>
                <div class="detail-item"><div class="detail-label">Experience</div><div class="detail-value">${c.experience}</div></div>
                <div class="detail-item"><div class="detail-label">AI Agent</div><div class="detail-value">${c.agent}</div></div>
                <div class="detail-item"><div class="detail-label">Joined</div><div class="detail-value">${formatDate(c.joinDate)}</div></div>
            </div>
            <div class="detail-section">
                <div class="detail-section-title">Notes</div>
                <p style="font-size:0.88rem;color:var(--text-secondary)">${c.notes}</p>
            </div>
            ${jobs.length > 0 ? `
            <div class="detail-section">
                <div class="detail-section-title">Active Jobs (${jobs.length})</div>
                <div class="detail-timeline">
                    ${jobs.map(j => `
                        <div class="detail-timeline-item">
                            <div class="detail-timeline-dot"></div>
                            <div><strong>${j.company}</strong> — ${j.role} (${j.salary})<br><small style="color:var(--text-tertiary)">Stage: ${j.stage} | Applied: ${formatDate(j.appliedDate)}</small></div>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
            ${activities.length > 0 ? `
            <div class="detail-section">
                <div class="detail-section-title">Recent Activity</div>
                <div class="detail-timeline">
                    ${activities.slice(0, 5).map(a => `
                        <div class="detail-timeline-item">
                            <div class="detail-timeline-dot"></div>
                            <div>${a.message}<br><small style="color:var(--text-tertiary)">${formatDateTime(a.time)}</small></div>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        `;
        clientDetailModal.classList.add('visible');
    }

    modalClose.addEventListener('click', () => clientDetailModal.classList.remove('visible'));
    clientDetailModal.addEventListener('click', (e) => {
        if (e.target === clientDetailModal) clientDetailModal.classList.remove('visible');
    });

    // --- Pipeline Page ---
    function renderPipeline() {
        const stages = [
            { key: 'applied', label: 'Applied' },
            { key: 'screening', label: 'Screening' },
            { key: 'interview', label: 'Interview' },
            { key: 'offer', label: 'Offer' },
            { key: 'placed', label: 'Placed' }
        ];

        content.innerHTML = `
            <div class="page active">
                <div class="page-header">
                    <h1 class="page-title">Job Pipeline</h1>
                    <p class="page-subtitle">Track all client applications across stages</p>
                </div>
                <div class="pipeline-board" id="pipelineBoard">
                    ${stages.map(s => {
                        const jobs = PIPELINE_JOBS.filter(j => j.stage === s.key);
                        return `
                        <div class="pipeline-column">
                            <div class="pipeline-col-header ${s.key}">
                                <span class="pipeline-col-title">${s.label}</span>
                                <span class="pipeline-col-count">${jobs.length}</span>
                            </div>
                            <div class="pipeline-cards">
                                ${jobs.map(j => {
                                    const client = CLIENTS.find(c => c.id === j.clientId);
                                    return `
                                    <div class="pipeline-card" draggable="true" data-job-id="${j.id}">
                                        <div class="pipeline-card-company">${j.company}</div>
                                        <div class="pipeline-card-role">${j.role}</div>
                                        <div class="pipeline-card-footer">
                                            <span class="pipeline-card-client">${client ? client.name : 'Unknown'}</span>
                                            <span class="pipeline-card-salary">${j.salary}</span>
                                        </div>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Activity Page ---
    function renderActivity() {
        content.innerHTML = `
            <div class="page active">
                <div class="page-header">
                    <h1 class="page-title">AI Agent Activity</h1>
                    <p class="page-subtitle">Real-time feed of all AI agent actions</p>
                </div>
                <div class="card">
                    <div class="activity-list">
                        ${ACTIVITY_FEED.map(a => renderActivityItem(a)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderActivityItem(a) {
        const iconMap = {
            match: '&#128279;', email: '&#9993;', interview: '&#128197;',
            offer: '&#11088;', resume: '&#128196;', application: '&#128228;'
        };
        return `
            <div class="activity-item">
                <div class="activity-icon-wrap ${a.type}">
                    <span class="activity-icons">${iconMap[a.type] || '&#128204;'}</span>
                </div>
                <div>
                    <div class="activity-text">${a.message}</div>
                    <div class="activity-time">${formatDateTime(a.time)}</div>
                </div>
            </div>
        `;
    }

    // --- Analytics Page ---
    function renderAnalytics() {
        content.innerHTML = `
            <div class="page active">
                <div class="page-header">
                    <h1 class="page-title">Analytics</h1>
                    <p class="page-subtitle">Performance metrics and trends</p>
                </div>
                <div class="charts-grid">
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Placements Over Time</h3></div>
                        <div class="chart-line-container" id="lineChart"></div>
                    </div>
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Applications by Source</h3></div>
                        <div id="barChart"></div>
                    </div>
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Pipeline Distribution</h3></div>
                        <div class="donut-container" id="donutChart"></div>
                    </div>
                </div>
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Top Performers</h3></div>
                        <div id="topPerformers"></div>
                    </div>
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Agent Effectiveness</h3></div>
                        <div id="agentStats"></div>
                    </div>
                </div>
            </div>
        `;
        renderLineChart();
        renderBarChart();
        renderDonutChart();
        renderTopPerformers();
        renderAgentStats();
    }

    function renderLineChart() {
        const { labels, data } = ANALYTICS_DATA.placementsOverTime;
        const max = Math.max(...data);
        const w = 100, h = 200, padX = 10, padY = 20;
        const stepX = (w - padX * 2) / (labels.length - 1);
        const points = data.map((d, i) => ({
            x: padX + i * stepX,
            y: h - padY - ((d / (max + 1)) * (h - padY * 2))
        }));
        const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const area = line + ` L ${points[points.length-1].x} ${h - padY} L ${points[0].x} ${h - padY} Z`;

        document.getElementById('lineChart').innerHTML = `
            <svg viewBox="0 0 ${w} ${h + 20}" class="chart-line-svg">
                <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#6366f1" stop-opacity="0.02"/>
                </linearGradient></defs>
                <path d="${area}" fill="url(#areaGrad)"/>
                <path d="${line}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
                ${points.map((p, i) => `
                    <circle cx="${p.x}" cy="${p.y}" r="3" fill="#6366f1"/>
                    <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="7" fill="var(--text-secondary)">${data[i]}</text>
                    <text x="${p.x}" y="${h - 4}" text-anchor="middle" font-size="6" fill="var(--text-tertiary)">${labels[i]}</text>
                `).join('')}
            </svg>
        `;
    }

    function renderBarChart() {
        const { labels, data } = ANALYTICS_DATA.applicationsBySource;
        const max = Math.max(...data);
        document.getElementById('barChart').innerHTML = '<div class="chart-bar-group">' +
            labels.map((l, i) => `
                <div class="chart-bar-item">
                    <span class="chart-bar-label">${l}</span>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill source-${i}" style="width:${(data[i] / max) * 100}%">${data[i]}</div>
                    </div>
                </div>
            `).join('') + '</div>';
    }

    function renderDonutChart() {
        const { labels, data, colors } = ANALYTICS_DATA.pipelineDistribution;
        const total = data.reduce((s, d) => s + d, 0);
        let cumulative = 0;
        const size = 160, cx = 80, cy = 80, r = 60, r2 = 40;

        const segments = data.map((d, i) => {
            const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
            cumulative += d;
            const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
            const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
            const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
            const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
            const x3 = cx + r2 * Math.cos(endAngle), y3 = cy + r2 * Math.sin(endAngle);
            const x4 = cx + r2 * Math.cos(startAngle), y4 = cy + r2 * Math.sin(startAngle);
            return `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${r2} ${r2} 0 ${largeArc} 0 ${x4} ${y4} Z" fill="${colors[i]}"/>`;
        });

        const legend = labels.map((l, i) => `
            <div class="donut-legend-item">
                <span class="donut-legend-dot" style="background:${colors[i]}"></span>
                <span>${l}: ${data[i]} (${Math.round(data[i]/total*100)}%)</span>
            </div>
        `).join('');

        document.getElementById('donutChart').innerHTML = `
            <svg viewBox="0 0 ${size} ${size}" class="donut-svg">${segments.join('')}
                <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="18" font-weight="700" fill="var(--text-primary)">${total}</text>
                <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="7" fill="var(--text-tertiary)">Total Jobs</text>
            </svg>
            <div class="donut-legend">${legend}</div>
        `;
    }

    function renderTopPerformers() {
        const sorted = [...CLIENTS].sort((a, b) => b.resumeScore - a.resumeScore).slice(0, 5);
        document.getElementById('topPerformers').innerHTML = '<div class="chart-bar-group">' +
            sorted.map((c, i) => `
                <div class="chart-bar-item">
                    <span class="chart-bar-label">${c.name.split(' ')[0]}</span>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill source-${i % 5}" style="width:${c.resumeScore}%">${c.resumeScore}</div>
                    </div>
                </div>
            `).join('') + '</div>';
    }

    function renderAgentStats() {
        const agents = ['ResumeBot', 'MatchBot', 'OutreachBot'];
        document.getElementById('agentStats').innerHTML = '<div class="chart-bar-group">' +
            agents.map((agent, i) => {
                const count = CLIENTS.filter(c => c.agent === agent).length;
                return `
                <div class="chart-bar-item">
                    <span class="chart-bar-label">${agent}</span>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill source-${i}" style="width:${(count / CLIENTS.length) * 100}%">${count} clients</div>
                    </div>
                </div>`;
            }).join('') + '</div>';
    }

    // --- Settings Page ---
    function renderSettings() {
        content.innerHTML = `
            <div class="page active">
                <div class="page-header">
                    <h1 class="page-title">Settings</h1>
                    <p class="page-subtitle">Manage your profile and preferences</p>
                </div>
                <div class="settings-grid">
                    <div class="card">
                        <div class="settings-section">
                            <div class="settings-section-title">Profile</div>
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-input" value="Sarah Chen">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" value="sarah@careerstrategist.com">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Business Name</label>
                                <input type="text" class="form-input" value="Chen Career Strategy">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Specialization</label>
                                <input type="text" class="form-input" value="Tech & Engineering Careers">
                            </div>
                            <div class="btn-group">
                                <button class="btn-primary" onclick="alert('Profile saved!')">Save Changes</button>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="settings-section">
                            <div class="settings-section-title">Notifications</div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Email Notifications</span><span class="toggle-desc">Get email for new offers and placements</span></div>
                                <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
                            </div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Daily Digest</span><span class="toggle-desc">Summary of all AI agent activity</span></div>
                                <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
                            </div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Client Alerts</span><span class="toggle-desc">Notify when clients go inactive</span></div>
                                <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
                            </div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Interview Reminders</span><span class="toggle-desc">24-hour advance interview reminders</span></div>
                                <label class="toggle-switch"><input type="checkbox"><span class="toggle-slider"></span></label>
                            </div>
                        </div>
                        <div class="settings-section">
                            <div class="settings-section-title">AI Agent Configuration</div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Auto-Apply</span><span class="toggle-desc">Let AI automatically submit applications</span></div>
                                <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
                            </div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Smart Matching</span><span class="toggle-desc">AI proactively finds and suggests jobs</span></div>
                                <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
                            </div>
                            <div class="toggle-row">
                                <div class="toggle-label-group"><span class="toggle-label">Auto Follow-up</span><span class="toggle-desc">Send automated follow-up emails</span></div>
                                <label class="toggle-switch"><input type="checkbox"><span class="toggle-slider"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Onboarding Wizard ---
    function openOnboardingWizard() {
        wizardStep = 0;
        wizardData = { name: '', email: '', phone: '', role: '', targetRole: '', location: '', experience: '', notes: '' };
        renderWizard();
        onboardingModal.classList.add('visible');
    }

    onboardingClose.addEventListener('click', () => onboardingModal.classList.remove('visible'));
    onboardingModal.addEventListener('click', (e) => {
        if (e.target === onboardingModal) onboardingModal.classList.remove('visible');
    });

    function renderWizard() {
        const steps = ['Basic Info', 'Career Details', 'Review'];
        onboardingBody.innerHTML = `
            <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:16px;">Add New Client</h2>
            <div class="wizard-steps">
                ${steps.map((s, i) => `
                    <div class="wizard-step ${i === wizardStep ? 'active' : ''} ${i < wizardStep ? 'completed' : ''}">
                        <span class="wizard-step-number">${i < wizardStep ? '&#10003;' : i + 1}</span>${s}
                    </div>
                `).join('')}
            </div>
            <div class="wizard-body" id="wizardBody"></div>
            <div class="wizard-footer">
                <button class="btn-secondary" id="wizardPrev" ${wizardStep === 0 ? 'disabled style="opacity:0.5"' : ''}>Back</button>
                <button class="btn-primary" id="wizardNext">${wizardStep === steps.length - 1 ? 'Add Client' : 'Continue'}</button>
            </div>
        `;
        renderWizardStep();

        document.getElementById('wizardPrev').addEventListener('click', () => {
            if (wizardStep > 0) { saveWizardFields(); wizardStep--; renderWizard(); }
        });
        document.getElementById('wizardNext').addEventListener('click', () => {
            saveWizardFields();
            if (wizardStep === 0 && !validateWizardStep0()) return;
            if (wizardStep === 1 && !validateWizardStep1()) return;
            if (wizardStep < 2) { wizardStep++; renderWizard(); }
            else {
                // Submit
                onboardingModal.classList.remove('visible');
                alert(`Client "${wizardData.name}" has been added successfully!`);
            }
        });
    }

    function renderWizardStep() {
        const body = document.getElementById('wizardBody');
        if (wizardStep === 0) {
            body.innerHTML = `
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-input" id="wiz_name" value="${wizardData.name}" placeholder="e.g. John Smith">
                    <div class="form-error" id="err_name">Name is required</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-input" id="wiz_email" value="${wizardData.email}" placeholder="e.g. john@email.com">
                    <div class="form-error" id="err_email">Valid email is required</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-input" id="wiz_phone" value="${wizardData.phone}" placeholder="(555) 555-0000">
                </div>
            `;
        } else if (wizardStep === 1) {
            body.innerHTML = `
                <div class="form-group">
                    <label class="form-label">Current Role *</label>
                    <input type="text" class="form-input" id="wiz_role" value="${wizardData.role}" placeholder="e.g. Software Engineer">
                    <div class="form-error" id="err_role">Current role is required</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Target Role *</label>
                    <input type="text" class="form-input" id="wiz_targetRole" value="${wizardData.targetRole}" placeholder="e.g. Senior Software Engineer">
                    <div class="form-error" id="err_targetRole">Target role is required</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-input" id="wiz_location" value="${wizardData.location}" placeholder="e.g. San Francisco, CA">
                </div>
                <div class="form-group">
                    <label class="form-label">Experience</label>
                    <input type="text" class="form-input" id="wiz_experience" value="${wizardData.experience}" placeholder="e.g. 5 years">
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-input" id="wiz_notes" rows="3" placeholder="Any additional context...">${wizardData.notes}</textarea>
                </div>
            `;
        } else {
            body.innerHTML = `
                <div class="wizard-summary">
                    <p style="margin-bottom:12px;color:var(--text-secondary)">Review the information below before adding this client:</p>
                    <dl>
                        <dt>Name</dt><dd>${wizardData.name}</dd>
                        <dt>Email</dt><dd>${wizardData.email}</dd>
                        <dt>Phone</dt><dd>${wizardData.phone || 'Not provided'}</dd>
                        <dt>Current Role</dt><dd>${wizardData.role}</dd>
                        <dt>Target Role</dt><dd>${wizardData.targetRole}</dd>
                        <dt>Location</dt><dd>${wizardData.location || 'Not provided'}</dd>
                        <dt>Experience</dt><dd>${wizardData.experience || 'Not provided'}</dd>
                        <dt>Notes</dt><dd>${wizardData.notes || 'None'}</dd>
                    </dl>
                </div>
            `;
        }
    }

    function saveWizardFields() {
        const fields = ['name', 'email', 'phone', 'role', 'targetRole', 'location', 'experience', 'notes'];
        fields.forEach(f => {
            const el = document.getElementById('wiz_' + f);
            if (el) wizardData[f] = el.value.trim();
        });
    }

    function validateWizardStep0() {
        let valid = true;
        if (!wizardData.name) { showFieldError('name'); valid = false; }
        if (!wizardData.email || !wizardData.email.includes('@')) { showFieldError('email'); valid = false; }
        return valid;
    }

    function validateWizardStep1() {
        let valid = true;
        if (!wizardData.role) { showFieldError('role'); valid = false; }
        if (!wizardData.targetRole) { showFieldError('targetRole'); valid = false; }
        return valid;
    }

    function showFieldError(field) {
        const input = document.getElementById('wiz_' + field);
        const err = document.getElementById('err_' + field);
        if (input) input.classList.add('error');
        if (err) err.style.display = 'block';
    }

    // --- Export CSV ---
    function exportCSV() {
        let filtered = [...CLIENTS];
        if (clientFilter !== 'all') filtered = filtered.filter(c => c.status === clientFilter);
        if (clientSearch) {
            const q = clientSearch.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
        }

        const headers = ['Name', 'Email', 'Phone', 'Current Role', 'Target Role', 'Status', 'Location', 'Experience', 'Resume Score', 'Applications', 'Interviews', 'Offers', 'Agent'];
        const rows = filtered.map(c => [c.name, c.email, c.phone, c.role, c.targetRole, c.status, c.location, c.experience, c.resumeScore, c.applications, c.interviews, c.offers, c.agent]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clients_export.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- Helpers ---
    function timeAgo(dateStr) {
        const now = new Date('2026-03-27T12:00:00');
        const d = new Date(dateStr);
        const diff = Math.floor((now - d) / 60000);
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function formatDateTime(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' +
               d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    // --- Init ---
    renderNotifications();
    renderPage();

})();
