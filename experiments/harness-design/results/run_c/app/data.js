// ============================================================
// DATA.JS — Mock data for Operator Dashboard
// ============================================================

const NOW = new Date();
const TODAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());

function daysAgo(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d;
}

function monthsAgo(n) {
  const d = new Date(TODAY);
  d.setMonth(d.getMonth() - n);
  return d;
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(hours, minutes) {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = String(minutes).padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

function relativeDate(d) {
  const diff = Math.floor((TODAY - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return '1 week ago';
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

function relativeTime(d) {
  const diffMs = NOW - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay} days ago`;
}

// ============================================================
// OPERATOR
// ============================================================
const OPERATOR = {
  name: 'Sarah Chen',
  businessName: 'Chen Career Strategy',
  email: 'sarah@chencareer.com',
  phone: '(415) 555-0192',
  avatar: null,
  defaultSessionDuration: 45,
  workingHoursStart: '08:00',
  workingHoursEnd: '18:00',
  timezone: 'America/Los_Angeles',
  notifications: {
    email: true,
    sessionReminders: true,
    paymentAlerts: true,
    clientActivity: true
  }
};

// ============================================================
// PLANS
// ============================================================
const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 150,
    features: ['Resume review (2x/month)', 'Job search strategy', 'Email support', 'Resource library access']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 300,
    features: ['Everything in Basic', 'Weekly coaching calls', 'LinkedIn optimization', 'Interview prep (2x/month)', 'Priority email support']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 500,
    features: ['Everything in Pro', 'Unlimited coaching calls', 'Executive resume writing', 'Salary negotiation support', 'Direct phone/text access', 'Dedicated job sourcing']
  }
];

// ============================================================
// CLIENTS
// ============================================================
let CLIENTS = [
  {
    id: 1, name: 'James Park', email: 'james.park@gmail.com', phone: '(415) 555-0101',
    linkedin: 'linkedin.com/in/jamespark', plan: 'premium', status: 'active',
    startDate: monthsAgo(4), lastActivity: daysAgo(1), nextSession: daysFromNow(1),
    healthScore: 88, bio: 'Former product manager at Meta seeking VP Product roles at growth-stage startups. 10+ years in tech.',
    notes: 'Strong storytelling skills. Needs help positioning transition from big tech to startup leadership.',
    avatar: null, sessions: 16, targetRole: 'VP of Product', targetCompany: 'Stripe'
  },
  {
    id: 2, name: 'Maria Rodriguez', email: 'maria.r@outlook.com', phone: '(212) 555-0202',
    linkedin: 'linkedin.com/in/mariarodriguez', plan: 'pro', status: 'active',
    startDate: monthsAgo(3), lastActivity: daysAgo(2), nextSession: daysFromNow(3),
    healthScore: 75, bio: 'Marketing director transitioning from CPG to tech. MBA from Wharton.',
    notes: 'Very driven. Interviewing at 3 companies simultaneously. Needs help managing multiple processes.',
    avatar: null, sessions: 11, targetRole: 'Head of Marketing', targetCompany: 'Airbnb'
  },
  {
    id: 3, name: 'David Kim', email: 'dkim.dev@gmail.com', phone: '(650) 555-0303',
    linkedin: 'linkedin.com/in/davidkim-eng', plan: 'pro', status: 'active',
    startDate: monthsAgo(2), lastActivity: daysAgo(0), nextSession: daysFromNow(0),
    healthScore: 92, bio: 'Staff software engineer at Google exploring principal engineer or engineering manager roles.',
    notes: 'Technical skills are exceptional. Coaching focus on leadership narrative and system design interviews.',
    avatar: null, sessions: 8, targetRole: 'Principal Engineer', targetCompany: 'Netflix'
  },
  {
    id: 4, name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '(408) 555-0404',
    linkedin: 'linkedin.com/in/priyapatel', plan: 'basic', status: 'active',
    startDate: monthsAgo(1), lastActivity: daysAgo(5), nextSession: daysFromNow(7),
    healthScore: 55, bio: 'Junior data analyst looking to move into a data science role. 2 years experience.',
    notes: 'Needs significant resume work. Strong Python skills but weak at telling her story.',
    avatar: null, sessions: 3, targetRole: 'Data Scientist', targetCompany: 'Spotify'
  },
  {
    id: 5, name: 'Marcus Thompson', email: 'marcus.t@proton.me', phone: '(310) 555-0505',
    linkedin: 'linkedin.com/in/marcusthompson', plan: 'premium', status: 'active',
    startDate: monthsAgo(5), lastActivity: daysAgo(3), nextSession: daysFromNow(2),
    healthScore: 71, bio: 'Chief of staff at a Series B startup, exploring COO and VP Ops roles at larger companies.',
    notes: 'Great network. Referrals are his strongest channel. Focus on exec presence and board-level communication.',
    avatar: null, sessions: 20, targetRole: 'COO', targetCompany: 'Figma'
  },
  {
    id: 6, name: 'Emily Watson', email: 'emily.watson@gmail.com', phone: '(503) 555-0606',
    linkedin: 'linkedin.com/in/emilywatson-ux', plan: 'pro', status: 'active',
    startDate: monthsAgo(3), lastActivity: daysAgo(14), nextSession: null,
    healthScore: 32, bio: 'Senior UX designer at Adobe wanting to move into UX leadership. Portfolio-heavy job search.',
    notes: 'Has gone quiet. Might be burned out from rejections. Schedule check-in ASAP.',
    avatar: null, sessions: 9, targetRole: 'Director of Design', targetCompany: 'Notion'
  },
  {
    id: 7, name: 'Alex Chen', email: 'alex.chen@icloud.com', phone: '(206) 555-0707',
    linkedin: 'linkedin.com/in/alexchen-pm', plan: 'basic', status: 'active',
    startDate: monthsAgo(2), lastActivity: daysAgo(7), nextSession: daysFromNow(4),
    healthScore: 48, bio: 'Associate PM at Microsoft looking to move to a senior PM role at a startup.',
    notes: 'Needs help with case studies and product sense interviews. Good analytical skills.',
    avatar: null, sessions: 5, targetRole: 'Senior PM', targetCompany: 'Notion'
  },
  {
    id: 8, name: 'Rachel Foster', email: 'rachel.foster@gmail.com', phone: '(512) 555-0808',
    linkedin: 'linkedin.com/in/rachelfoster', plan: 'premium', status: 'active',
    startDate: monthsAgo(6), lastActivity: daysAgo(1), nextSession: daysFromNow(1),
    healthScore: 85, bio: 'VP of Sales at a SaaS company, targeting CRO roles. $200K+ target comp.',
    notes: 'High performer. Pipeline is strong. Help with salary negotiation for the Datadog opportunity.',
    avatar: null, sessions: 24, targetRole: 'CRO', targetCompany: 'Datadog'
  },
  {
    id: 9, name: 'Kevin Nguyen', email: 'kevin.ng@gmail.com', phone: '(714) 555-0909',
    linkedin: 'linkedin.com/in/kevinnguyen-fin', plan: 'pro', status: 'paused',
    startDate: monthsAgo(4), lastActivity: daysAgo(21), nextSession: null,
    healthScore: 25, bio: 'Finance manager considering a switch to fintech product management.',
    notes: 'Paused coaching due to personal reasons. Follow up in 2 weeks. Was making good progress before.',
    avatar: null, sessions: 12, targetRole: 'Product Manager', targetCompany: 'Square'
  },
  {
    id: 10, name: 'Sophie Laurent', email: 'sophie.l@gmail.com', phone: '(617) 555-1010',
    linkedin: 'linkedin.com/in/sophielaurent', plan: 'pro', status: 'active',
    startDate: monthsAgo(2), lastActivity: daysAgo(3), nextSession: daysFromNow(5),
    healthScore: 68, bio: 'Content strategist at HubSpot exploring head of content roles. Strong writing portfolio.',
    notes: 'Interview at Shopify went well. Prep for final round. Also interested in Canva.',
    avatar: null, sessions: 7, targetRole: 'Head of Content', targetCompany: 'Shopify'
  },
  {
    id: 11, name: 'Jordan Rivera', email: 'jordan.r@outlook.com', phone: '(305) 555-1111',
    linkedin: 'linkedin.com/in/jordanrivera', plan: 'basic', status: 'active',
    startDate: monthsAgo(1), lastActivity: daysAgo(4), nextSession: daysFromNow(6),
    healthScore: 60, bio: 'Recent bootcamp grad with strong React skills. Looking for first full-time frontend role.',
    notes: 'Portfolio needs work. Help with GitHub profile and open source contributions for visibility.',
    avatar: null, sessions: 2, targetRole: 'Frontend Engineer', targetCompany: 'Vercel'
  },
  {
    id: 12, name: 'Olivia Stewart', email: 'olivia.stewart@gmail.com', phone: '(202) 555-1212',
    linkedin: 'linkedin.com/in/oliviastewart-hr', plan: 'pro', status: 'completed',
    startDate: monthsAgo(8), lastActivity: daysAgo(30), nextSession: null,
    healthScore: 95, bio: 'HR Business Partner who landed a VP People role at a Series C startup.',
    notes: 'SUCCESS STORY. Placed at Retool as VP People. Great testimonial candidate.',
    avatar: null, sessions: 28, targetRole: 'VP People', targetCompany: 'Retool'
  },
  {
    id: 13, name: 'Tyler Brooks', email: 'tyler.brooks@gmail.com', phone: '(312) 555-1313',
    linkedin: 'linkedin.com/in/tylerbrooks', plan: 'basic', status: 'active',
    startDate: monthsAgo(1), lastActivity: daysAgo(2), nextSession: daysFromNow(3),
    healthScore: 72, bio: 'Account executive at Salesforce wanting to move into customer success leadership.',
    notes: 'Good client-facing skills. Resume undersells his impact. Quantify achievements more.',
    avatar: null, sessions: 4, targetRole: 'CS Director', targetCompany: 'Twilio'
  },
  {
    id: 14, name: 'Aisha Johnson', email: 'aisha.j@proton.me', phone: '(404) 555-1414',
    linkedin: 'linkedin.com/in/aishajohnson', plan: 'premium', status: 'active',
    startDate: monthsAgo(3), lastActivity: daysAgo(0), nextSession: daysFromNow(0),
    healthScore: 90, bio: 'Engineering director at Uber, targeting VP Eng roles. Led teams of 50+.',
    notes: 'Exceptional candidate. Got offer from Coinbase. Helping with counter-offer negotiation.',
    avatar: null, sessions: 14, targetRole: 'VP Engineering', targetCompany: 'Coinbase'
  },
  {
    id: 15, name: 'Daniel Morales', email: 'dan.morales@gmail.com', phone: '(858) 555-1515',
    linkedin: 'linkedin.com/in/danielmorales', plan: 'pro', status: 'paused',
    startDate: monthsAgo(5), lastActivity: daysAgo(28), nextSession: null,
    healthScore: 18, bio: 'Operations manager at Amazon. Was exploring supply chain director roles.',
    notes: 'Went dark 4 weeks ago. Multiple attempts to reach out. May need to close engagement.',
    avatar: null, sessions: 15, targetRole: 'Director of Ops', targetCompany: 'DoorDash'
  },
  {
    id: 16, name: 'Lisa Chang', email: 'lisa.chang@gmail.com', phone: '(415) 555-1616',
    linkedin: 'linkedin.com/in/lisachang-ds', plan: 'pro', status: 'active',
    startDate: monthsAgo(2), lastActivity: daysAgo(1), nextSession: daysFromNow(2),
    healthScore: 78, bio: 'Senior data scientist at Netflix exploring ML engineering management.',
    notes: 'Strong technical background. Working on system design interview prep.',
    avatar: null, sessions: 6, targetRole: 'ML Engineering Manager', targetCompany: 'OpenAI'
  }
];

// ============================================================
// PIPELINE CARDS
// ============================================================
let PIPELINE = [
  { id: 1, clientId: 4, clientName: 'Priya Patel', company: 'Spotify', role: 'Data Scientist', stage: 'preparing', daysInStage: 5, source: 'LinkedIn', applicationDate: daysAgo(5), notes: 'Tailoring resume for this specific role. Focus on ML projects.' },
  { id: 2, clientId: 11, clientName: 'Jordan Rivera', company: 'Vercel', role: 'Frontend Engineer', stage: 'preparing', daysInStage: 3, source: 'Company Site', applicationDate: daysAgo(3), notes: 'Building portfolio project first. Needs Next.js experience.' },
  { id: 3, clientId: 7, clientName: 'Alex Chen', company: 'Notion', role: 'Senior PM', stage: 'applied', daysInStage: 8, source: 'Referral', applicationDate: daysAgo(8), notes: 'Referred by a current Notion PM. Strong referral.' },
  { id: 4, clientId: 2, clientName: 'Maria Rodriguez', company: 'Airbnb', role: 'Head of Marketing', stage: 'applied', daysInStage: 6, source: 'LinkedIn', applicationDate: daysAgo(6), notes: 'Applied through recruiter. Waiting for first call.' },
  { id: 5, clientId: 13, clientName: 'Tyler Brooks', company: 'Twilio', role: 'CS Director', stage: 'applied', daysInStage: 4, source: 'Company Site', applicationDate: daysAgo(4), notes: 'Direct application. Highlight SaaS CS metrics on resume.' },
  { id: 6, clientId: 10, clientName: 'Sophie Laurent', company: 'Shopify', role: 'Head of Content', stage: 'screening', daysInStage: 5, source: 'LinkedIn', applicationDate: daysAgo(12), notes: 'Recruiter screen scheduled for this week.' },
  { id: 7, clientId: 16, clientName: 'Lisa Chang', company: 'OpenAI', role: 'ML Eng Manager', stage: 'screening', daysInStage: 3, source: 'Referral', applicationDate: daysAgo(10), notes: 'Referred by former Netflix colleague. Strong connection.' },
  { id: 8, clientId: 3, clientName: 'David Kim', company: 'Netflix', role: 'Principal Engineer', stage: 'interviewing', daysInStage: 7, source: 'Recruiter', applicationDate: daysAgo(21), notes: 'System design round next week. Deep prep needed on distributed systems.' },
  { id: 9, clientId: 1, clientName: 'James Park', company: 'Stripe', role: 'VP of Product', stage: 'interviewing', daysInStage: 4, source: 'Referral', applicationDate: daysAgo(18), notes: 'Final round with CPO scheduled. Practice exec presentation.' },
  { id: 10, clientId: 5, clientName: 'Marcus Thompson', company: 'Figma', role: 'COO', stage: 'interviewing', daysInStage: 10, source: 'Executive Recruiter', applicationDate: daysAgo(25), notes: 'Meeting with CEO next week. Needs company strategy deep dive.' },
  { id: 11, clientId: 14, clientName: 'Aisha Johnson', company: 'Coinbase', role: 'VP Engineering', stage: 'offer', daysInStage: 2, source: 'Recruiter', applicationDate: daysAgo(30), notes: 'Offer received: $380K TC. Negotiating equity component.' },
  { id: 12, clientId: 8, clientName: 'Rachel Foster', company: 'Datadog', role: 'CRO', stage: 'offer', daysInStage: 3, source: 'Executive Recruiter', applicationDate: daysAgo(28), notes: 'Verbal offer. Waiting on written terms. $350K+ expected.' },
  { id: 13, clientId: 12, clientName: 'Olivia Stewart', company: 'Retool', role: 'VP People', stage: 'closed', daysInStage: 14, source: 'LinkedIn', applicationDate: daysAgo(60), notes: 'PLACED. Started last month. Great outcome.' },
];

// ============================================================
// CALENDAR EVENTS
// ============================================================
let CALENDAR_EVENTS = [
  { id: 1, clientId: 3, clientName: 'David Kim', type: 'coaching', title: 'Coaching Call', date: TODAY, startTime: '09:00', endTime: '09:45', notes: 'System design interview prep for Netflix' },
  { id: 2, clientId: 14, clientName: 'Aisha Johnson', type: 'coaching', title: 'Coaching Call', date: TODAY, startTime: '10:00', endTime: '10:45', notes: 'Coinbase offer negotiation strategy' },
  { id: 3, clientId: 1, clientName: 'James Park', type: 'resume', title: 'Resume Review', date: TODAY, startTime: '14:00', endTime: '14:30', notes: 'Final resume polish for Stripe VP Product' },
  { id: 4, clientId: 8, clientName: 'Rachel Foster', type: 'coaching', title: 'Coaching Call', date: daysFromNow(1), startTime: '09:00', endTime: '09:45', notes: 'Datadog CRO offer review' },
  { id: 5, clientId: 1, clientName: 'James Park', type: 'mock', title: 'Mock Interview', date: daysFromNow(1), startTime: '11:00', endTime: '12:00', notes: 'Executive presentation practice for Stripe' },
  { id: 6, clientId: 2, clientName: 'Maria Rodriguez', type: 'coaching', title: 'Coaching Call', date: daysFromNow(2), startTime: '10:00', endTime: '10:45', notes: 'Review Airbnb application status' },
  { id: 7, clientId: 5, clientName: 'Marcus Thompson', type: 'mock', title: 'Mock Interview', date: daysFromNow(2), startTime: '14:00', endTime: '15:00', notes: 'CEO meeting prep for Figma' },
  { id: 8, clientId: 16, clientName: 'Lisa Chang', type: 'resume', title: 'Resume Review', date: daysFromNow(3), startTime: '09:00', endTime: '09:30', notes: 'ML engineering manager resume update' },
  { id: 9, clientId: 10, clientName: 'Sophie Laurent', type: 'coaching', title: 'Coaching Call', date: daysFromNow(3), startTime: '11:00', endTime: '11:45', notes: 'Shopify final round prep' },
  { id: 10, clientId: 13, clientName: 'Tyler Brooks', type: 'resume', title: 'Resume Review', date: daysFromNow(4), startTime: '10:00', endTime: '10:30', notes: 'CS Director resume revisions' },
  { id: 11, clientId: 7, clientName: 'Alex Chen', type: 'coaching', title: 'Coaching Call', date: daysFromNow(4), startTime: '13:00', endTime: '13:45', notes: 'Product sense interview workshop' },
  { id: 12, clientId: 4, clientName: 'Priya Patel', type: 'mock', title: 'Mock Interview', date: daysFromNow(5), startTime: '10:00', endTime: '11:00', notes: 'Data science case study practice' },
  { id: 13, clientId: 0, clientName: '', type: 'admin', title: 'Admin Block', date: TODAY, startTime: '12:00', endTime: '13:00', notes: 'Lunch + invoicing' },
  { id: 14, clientId: 0, clientName: '', type: 'admin', title: 'Content Creation', date: daysFromNow(3), startTime: '15:00', endTime: '16:00', notes: 'LinkedIn post + newsletter draft' },
];

// ============================================================
// INVOICES
// ============================================================
const INVOICES = [
  { id: 'INV-2026-001', clientId: 1, clientName: 'James Park', amount: 500, plan: 'Premium', period: 'Mar 2026', dueDate: daysAgo(2), paidDate: daysAgo(1), status: 'paid', paymentMethod: 'Visa ending 4242' },
  { id: 'INV-2026-002', clientId: 2, clientName: 'Maria Rodriguez', amount: 300, plan: 'Pro', period: 'Mar 2026', dueDate: daysAgo(2), paidDate: daysAgo(2), status: 'paid', paymentMethod: 'Mastercard ending 8888' },
  { id: 'INV-2026-003', clientId: 3, clientName: 'David Kim', amount: 300, plan: 'Pro', period: 'Mar 2026', dueDate: daysAgo(2), paidDate: daysAgo(0), status: 'paid', paymentMethod: 'ACH Transfer' },
  { id: 'INV-2026-004', clientId: 5, clientName: 'Marcus Thompson', amount: 500, plan: 'Premium', period: 'Mar 2026', dueDate: daysAgo(2), paidDate: null, status: 'overdue', paymentMethod: 'Visa ending 1234' },
  { id: 'INV-2026-005', clientId: 6, clientName: 'Emily Watson', amount: 300, plan: 'Pro', period: 'Mar 2026', dueDate: daysAgo(2), paidDate: null, status: 'overdue', paymentMethod: 'Amex ending 5678' },
  { id: 'INV-2026-006', clientId: 8, clientName: 'Rachel Foster', amount: 500, plan: 'Premium', period: 'Mar 2026', dueDate: daysFromNow(5), paidDate: null, status: 'pending', paymentMethod: 'Visa ending 9999' },
  { id: 'INV-2026-007', clientId: 10, clientName: 'Sophie Laurent', amount: 300, plan: 'Pro', period: 'Mar 2026', dueDate: daysFromNow(5), paidDate: null, status: 'pending', paymentMethod: 'PayPal' },
  { id: 'INV-2026-008', clientId: 14, clientName: 'Aisha Johnson', amount: 500, plan: 'Premium', period: 'Mar 2026', dueDate: daysAgo(5), paidDate: daysAgo(5), status: 'paid', paymentMethod: 'Amex ending 7777' },
  { id: 'INV-2026-009', clientId: 4, clientName: 'Priya Patel', amount: 150, plan: 'Basic', period: 'Mar 2026', dueDate: daysFromNow(5), paidDate: null, status: 'pending', paymentMethod: 'Visa ending 3333' },
  { id: 'INV-2026-010', clientId: 13, clientName: 'Tyler Brooks', amount: 150, plan: 'Basic', period: 'Mar 2026', dueDate: daysFromNow(3), paidDate: null, status: 'pending', paymentMethod: 'Mastercard ending 6666' },
  { id: 'INV-2026-011', clientId: 16, clientName: 'Lisa Chang', amount: 300, plan: 'Pro', period: 'Mar 2026', dueDate: daysAgo(1), paidDate: daysAgo(0), status: 'paid', paymentMethod: 'ACH Transfer' },
  { id: 'INV-2026-012', clientId: 11, clientName: 'Jordan Rivera', amount: 150, plan: 'Basic', period: 'Mar 2026', dueDate: daysFromNow(7), paidDate: null, status: 'pending', paymentMethod: 'Visa ending 2222' },
];

// ============================================================
// REVENUE HISTORY (past 6 months)
// ============================================================
const REVENUE_HISTORY = [
  { month: 'Oct 2025', revenue: 8200 },
  { month: 'Nov 2025', revenue: 9100 },
  { month: 'Dec 2025', revenue: 9800 },
  { month: 'Jan 2026', revenue: 10500 },
  { month: 'Feb 2026', revenue: 11200 },
  { month: 'Mar 2026', revenue: 12450 },
];

// ============================================================
// MESSAGES / CONVERSATIONS
// ============================================================
let CONVERSATIONS = [
  {
    clientId: 1, clientName: 'James Park', unread: true,
    messages: [
      { from: 'client', text: 'Hi Sarah, just got the interview confirmation from Stripe for next Thursday!', time: new Date(NOW.getTime() - 2 * 3600000) },
      { from: 'operator', text: 'That\'s fantastic news, James! Let\'s do a prep session before then. Are you free Wednesday afternoon?', time: new Date(NOW.getTime() - 1.5 * 3600000) },
      { from: 'client', text: 'Wednesday at 2pm works perfectly. Should I prepare anything specific?', time: new Date(NOW.getTime() - 1 * 3600000) },
      { from: 'operator', text: 'Yes! Review the executive presentation framework we discussed. Also, research Stripe\'s recent product launches. I\'ll prepare some mock questions.', time: new Date(NOW.getTime() - 0.8 * 3600000) },
      { from: 'client', text: 'On it. Also, should I update my resume to emphasize the payments experience from Meta?', time: new Date(NOW.getTime() - 0.5 * 3600000) },
      { from: 'operator', text: 'Absolutely. Let\'s add that to our Wednesday agenda. Great instinct.', time: new Date(NOW.getTime() - 0.3 * 3600000) },
    ]
  },
  {
    clientId: 14, clientName: 'Aisha Johnson', unread: true,
    messages: [
      { from: 'client', text: 'Sarah, Coinbase just sent the written offer. TC is $380K base + equity.', time: new Date(NOW.getTime() - 4 * 3600000) },
      { from: 'operator', text: 'Congrats Aisha! That\'s a strong offer. Let me review the details. Can you forward the offer letter?', time: new Date(NOW.getTime() - 3.8 * 3600000) },
      { from: 'client', text: 'Just forwarded it. The equity vesting is 4 years with 1 year cliff. Wondering if I should negotiate.', time: new Date(NOW.getTime() - 3.5 * 3600000) },
      { from: 'operator', text: 'At VP Eng level, there\'s always room to negotiate equity. I think we can push for 15-20% more RSUs. Let\'s strategize in our session today.', time: new Date(NOW.getTime() - 3.2 * 3600000) },
      { from: 'client', text: 'Perfect. I also want to discuss the signing bonus. My current company will match if I stay.', time: new Date(NOW.getTime() - 3 * 3600000) },
      { from: 'operator', text: 'Good leverage point. We\'ll use that in our counter. See you at 10 AM.', time: new Date(NOW.getTime() - 2.8 * 3600000) },
    ]
  },
  {
    clientId: 3, clientName: 'David Kim', unread: true,
    messages: [
      { from: 'operator', text: 'David, I put together some system design resources for your Netflix interview. Sending the prep doc now.', time: new Date(NOW.getTime() - 8 * 3600000) },
      { from: 'client', text: 'Thanks Sarah! I reviewed them last night. Had a question about the distributed caching section.', time: new Date(NOW.getTime() - 6 * 3600000) },
      { from: 'operator', text: 'Happy to clarify. What specifically are you unsure about?', time: new Date(NOW.getTime() - 5.5 * 3600000) },
      { from: 'client', text: 'The trade-offs between Redis and Memcached for the video streaming use case. Which would you recommend I present?', time: new Date(NOW.getTime() - 5 * 3600000) },
      { from: 'operator', text: 'For Netflix specifically, Redis is the better choice to discuss. They use it extensively. Focus on pub/sub capabilities and data structure versatility.', time: new Date(NOW.getTime() - 4.5 * 3600000) },
      { from: 'client', text: 'Got it. I\'ll restructure my answer around Redis. See you at 9 for our session!', time: new Date(NOW.getTime() - 4 * 3600000) },
    ]
  },
  {
    clientId: 8, clientName: 'Rachel Foster', unread: false,
    messages: [
      { from: 'client', text: 'The Datadog recruiter called. They\'re putting together the written offer this week!', time: new Date(NOW.getTime() - 26 * 3600000) },
      { from: 'operator', text: 'Incredible progress, Rachel! You\'ve crushed every round. What did they hint at for comp?', time: new Date(NOW.getTime() - 25 * 3600000) },
      { from: 'client', text: 'They mentioned $350-400K range for total comp. I want to push for the higher end.', time: new Date(NOW.getTime() - 24.5 * 3600000) },
      { from: 'operator', text: 'Based on your experience and the CRO market, $400K+ is very reasonable. Let\'s prepare your negotiation strategy before the offer comes in.', time: new Date(NOW.getTime() - 24 * 3600000) },
      { from: 'client', text: 'When should we meet? I want to be ready.', time: new Date(NOW.getTime() - 23.5 * 3600000) },
      { from: 'operator', text: 'I have you down for tomorrow at 9 AM. We\'ll cover the full negotiation framework then.', time: new Date(NOW.getTime() - 23 * 3600000) },
    ]
  },
  {
    clientId: 2, clientName: 'Maria Rodriguez', unread: false,
    messages: [
      { from: 'operator', text: 'Maria, how did the Airbnb recruiter screen go?', time: new Date(NOW.getTime() - 50 * 3600000) },
      { from: 'client', text: 'It went well! They want to move me to the next round. Marketing case study presentation.', time: new Date(NOW.getTime() - 48 * 3600000) },
      { from: 'operator', text: 'Excellent! That\'s their standard process for Head of Marketing. I have a framework we can use. When is it scheduled?', time: new Date(NOW.getTime() - 47 * 3600000) },
      { from: 'client', text: 'Next Tuesday. They want a 30-minute presentation on how I\'d approach their 2026 brand strategy.', time: new Date(NOW.getTime() - 46 * 3600000) },
      { from: 'operator', text: 'Perfect timeline. Let\'s use our Wednesday session to build the presentation deck together. I\'ll send some Airbnb brand research beforehand.', time: new Date(NOW.getTime() - 45 * 3600000) },
      { from: 'client', text: 'You\'re the best. This is exactly the kind of support I needed.', time: new Date(NOW.getTime() - 44 * 3600000) },
    ]
  },
  {
    clientId: 5, clientName: 'Marcus Thompson', unread: false,
    messages: [
      { from: 'client', text: 'Sarah, the Figma CEO meeting is confirmed for next week. I\'m nervous.', time: new Date(NOW.getTime() - 72 * 3600000) },
      { from: 'operator', text: 'Totally natural to feel that way. Remember, at this level it\'s a mutual evaluation. You\'re interviewing them too.', time: new Date(NOW.getTime() - 71 * 3600000) },
      { from: 'client', text: 'Good point. What should I focus on researching?', time: new Date(NOW.getTime() - 70 * 3600000) },
      { from: 'operator', text: 'Three things: 1) Figma\'s enterprise growth strategy, 2) Recent org changes, 3) Their AI product roadmap. I\'ll compile a briefing doc.', time: new Date(NOW.getTime() - 69 * 3600000) },
      { from: 'client', text: 'That would be amazing. Should I prepare questions for the CEO?', time: new Date(NOW.getTime() - 68 * 3600000) },
      { from: 'operator', text: 'Yes, prepare 3-4 strategic questions. We\'ll refine them in our mock interview session day after tomorrow.', time: new Date(NOW.getTime() - 67 * 3600000) },
    ]
  },
  {
    clientId: 6, clientName: 'Emily Watson', unread: false,
    messages: [
      { from: 'operator', text: 'Hi Emily, just checking in. Haven\'t heard from you in a couple weeks. How are things going?', time: new Date(NOW.getTime() - 200 * 3600000) },
      { from: 'operator', text: 'No pressure at all -- just want to make sure you\'re doing okay. The Notion role is still open if you\'re interested.', time: new Date(NOW.getTime() - 150 * 3600000) },
      { from: 'client', text: 'Hey Sarah, sorry for going quiet. Got some tough rejections and needed a break. Feeling ready to get back at it.', time: new Date(NOW.getTime() - 120 * 3600000) },
      { from: 'operator', text: 'Completely understand, and glad to hear you\'re feeling better. Rejections are part of the process. Let\'s schedule a re-launch session.', time: new Date(NOW.getTime() - 118 * 3600000) },
      { from: 'client', text: 'That sounds great. Can we do early next week?', time: new Date(NOW.getTime() - 116 * 3600000) },
      { from: 'operator', text: 'Absolutely. I\'ll send a calendar invite for Monday at 10 AM. We\'ll refresh your strategy and target list.', time: new Date(NOW.getTime() - 115 * 3600000) },
    ]
  },
  {
    clientId: 10, clientName: 'Sophie Laurent', unread: false,
    messages: [
      { from: 'client', text: 'Just finished the Shopify phone screen. The recruiter seemed really positive!', time: new Date(NOW.getTime() - 80 * 3600000) },
      { from: 'operator', text: 'Love to hear it! What questions did they focus on?', time: new Date(NOW.getTime() - 78 * 3600000) },
      { from: 'client', text: 'Content strategy at scale, team management experience, and how I\'d approach their creator ecosystem.', time: new Date(NOW.getTime() - 76 * 3600000) },
      { from: 'operator', text: 'Those are great signs. The creator ecosystem question means they\'re already thinking about you for the role. Let\'s prep for the next round.', time: new Date(NOW.getTime() - 74 * 3600000) },
      { from: 'client', text: 'Yes please! They mentioned a portfolio review and stakeholder interview next.', time: new Date(NOW.getTime() - 72 * 3600000) },
      { from: 'operator', text: 'Perfect. We\'ll work on curating your best content strategy case studies. See you Thursday!', time: new Date(NOW.getTime() - 70 * 3600000) },
    ]
  },
];

// ============================================================
// DOCUMENTS
// ============================================================
let DOCUMENTS = [
  { id: 1, clientId: 1, clientName: 'James Park', name: 'Resume - VP Product', type: 'resume', lastModified: daysAgo(1), version: 4,
    versions: [{v: 1, date: daysAgo(30)}, {v: 2, date: daysAgo(15)}, {v: 3, date: daysAgo(7)}, {v: 4, date: daysAgo(1)}],
    content: `<h2>James Park</h2><p class="doc-contact">james.park@gmail.com | (415) 555-0101 | linkedin.com/in/jamespark</p><h3>Professional Summary</h3><p>Results-driven product leader with 10+ years of experience scaling consumer and enterprise products. Led cross-functional teams of 30+ at Meta, driving $200M+ in annual revenue through data-informed product strategy. Seeking VP Product role at high-growth fintech company.</p><h3>Experience</h3><h4>Director of Product, Meta (2020-2026)</h4><ul><li>Led product strategy for Meta Marketplace, growing GMV from $5B to $12B annually</li><li>Managed team of 8 PMs and 45 engineers across 3 product verticals</li><li>Launched AI-powered pricing recommendations, increasing seller conversion by 34%</li><li>Established product analytics framework adopted by 5 other product orgs</li></ul><h4>Senior Product Manager, Uber (2017-2020)</h4><ul><li>Owned rider experience for Uber Pool, improving ride matching efficiency by 28%</li><li>Launched dynamic pricing optimization that increased revenue per ride by 15%</li><li>Conducted 200+ user interviews to inform UX redesign of the booking flow</li></ul><h3>Education</h3><p>MBA, Stanford Graduate School of Business<br>BS Computer Science, UC Berkeley</p>`
  },
  { id: 2, clientId: 1, clientName: 'James Park', name: 'Cover Letter - Stripe', type: 'cover_letter', lastModified: daysAgo(3), version: 2,
    versions: [{v: 1, date: daysAgo(10)}, {v: 2, date: daysAgo(3)}],
    content: `<h2>Cover Letter</h2><p>Dear Hiring Manager,</p><p>I am writing to express my strong interest in the VP of Product position at Stripe. With over a decade of product leadership experience at Meta and Uber, I bring a unique combination of technical depth, strategic vision, and proven execution in building products that serve millions of users.</p><p>At Meta, I led the Marketplace product organization to $12B in GMV, demonstrating my ability to scale complex two-sided platforms -- directly relevant to Stripe's merchant ecosystem. My experience launching AI-powered features and building data-driven product cultures aligns perfectly with Stripe's mission to increase the GDP of the internet.</p><p>I am particularly drawn to Stripe's developer-first approach and the opportunity to shape product strategy at a company that is fundamentally transforming how businesses operate online.</p><p>I look forward to discussing how my experience can contribute to Stripe's continued growth.</p><p>Best regards,<br>James Park</p>`
  },
  { id: 3, clientId: 3, clientName: 'David Kim', name: 'Resume - Principal Engineer', type: 'resume', lastModified: daysAgo(2), version: 3,
    versions: [{v: 1, date: daysAgo(20)}, {v: 2, date: daysAgo(10)}, {v: 3, date: daysAgo(2)}],
    content: `<h2>David Kim</h2><p class="doc-contact">dkim.dev@gmail.com | (650) 555-0303 | linkedin.com/in/davidkim-eng</p><h3>Professional Summary</h3><p>Staff Software Engineer with 12+ years designing and building distributed systems at scale. Expert in microservices architecture, real-time data processing, and ML infrastructure. Seeking Principal Engineer role to drive technical strategy and mentor engineering teams.</p><h3>Experience</h3><h4>Staff Software Engineer, Google (2019-Present)</h4><ul><li>Architected real-time recommendation system serving 1B+ daily requests with p99 latency under 50ms</li><li>Led migration of monolithic service to microservices, reducing deployment time by 70%</li><li>Designed and implemented distributed caching layer reducing database load by 60%</li><li>Mentored 15 engineers across 3 teams on system design best practices</li></ul><h4>Senior Software Engineer, Amazon (2015-2019)</h4><ul><li>Built inventory management system handling 50M+ SKUs across global fulfillment network</li><li>Implemented event-driven architecture processing 10M+ events per minute</li><li>Led technical design reviews for 20+ projects, establishing architectural standards</li></ul><h3>Education</h3><p>MS Computer Science, Carnegie Mellon University<br>BS Computer Science, KAIST</p>`
  },
  { id: 4, clientId: 3, clientName: 'David Kim', name: 'Interview Prep - Netflix', type: 'prep_sheet', lastModified: daysAgo(1), version: 1,
    versions: [{v: 1, date: daysAgo(1)}],
    content: `<h2>Netflix - Principal Engineer Interview Prep</h2><h3>Key Focus Areas</h3><ul><li>System design: streaming infrastructure, content delivery, recommendation engine</li><li>Technical leadership: RFC process, mentorship, cross-team collaboration</li><li>Netflix culture: freedom & responsibility, context not control</li></ul><h3>Prepared Questions & Answers</h3><p><strong>Q: Design Netflix's video streaming architecture</strong></p><p>Focus on CDN strategy, adaptive bitrate streaming, encoding pipeline, and cache hierarchy...</p><p><strong>Q: How do you approach technical decision-making?</strong></p><p>Data-driven approach with stakeholder input. Use RFC process for major decisions. Balance innovation with pragmatism...</p>`
  },
  { id: 5, clientId: 14, clientName: 'Aisha Johnson', name: 'Resume - VP Engineering', type: 'resume', lastModified: daysAgo(5), version: 3,
    versions: [{v: 1, date: daysAgo(40)}, {v: 2, date: daysAgo(20)}, {v: 3, date: daysAgo(5)}],
    content: `<h2>Aisha Johnson</h2><p class="doc-contact">aisha.j@proton.me | (404) 555-1414 | linkedin.com/in/aishajohnson</p><h3>Professional Summary</h3><p>Engineering Director with 14 years of experience building and scaling engineering organizations. Led teams of 50+ engineers at Uber, delivering critical infrastructure and platform products. Proven track record in building diverse, high-performing teams and driving technical strategy.</p><h3>Experience</h3><h4>Director of Engineering, Uber (2020-Present)</h4><ul><li>Built and led a 55-person engineering organization across payments, identity, and platform teams</li><li>Delivered real-time fraud detection system reducing chargebacks by 45%, saving $30M annually</li><li>Reduced engineering attrition from 22% to 8% through mentorship programs and career frameworks</li><li>Established architecture review board, improving system reliability from 99.5% to 99.99%</li></ul><h4>Engineering Manager, Lyft (2016-2020)</h4><ul><li>Grew team from 5 to 25 engineers while delivering rider safety platform</li><li>Launched ML-powered ETA prediction system, improving accuracy by 40%</li></ul><h3>Education</h3><p>MS Computer Science, Georgia Tech<br>BS Electrical Engineering, Howard University</p>`
  },
  { id: 6, clientId: 14, clientName: 'Aisha Johnson', name: 'Cover Letter - Coinbase', type: 'cover_letter', lastModified: daysAgo(10), version: 2,
    versions: [{v: 1, date: daysAgo(25)}, {v: 2, date: daysAgo(10)}],
    content: `<h2>Cover Letter</h2><p>Dear Coinbase Engineering Leadership,</p><p>I am excited to apply for the VP of Engineering position at Coinbase. Leading engineering organizations through rapid growth at Uber has prepared me uniquely for the challenges and opportunities at Coinbase...</p>`
  },
  { id: 7, clientId: 2, clientName: 'Maria Rodriguez', name: 'Resume - Head of Marketing', type: 'resume', lastModified: daysAgo(4), version: 2,
    versions: [{v: 1, date: daysAgo(25)}, {v: 2, date: daysAgo(4)}],
    content: `<h2>Maria Rodriguez</h2><p class="doc-contact">maria.r@outlook.com | (212) 555-0202 | linkedin.com/in/mariarodriguez</p><h3>Professional Summary</h3><p>Marketing director with 9 years of experience driving brand strategy and growth across CPG and tech. MBA from Wharton. Proven ability to build high-performing marketing teams and launch campaigns generating $100M+ in pipeline.</p><h3>Experience</h3><h4>Director of Brand Marketing, Procter & Gamble (2019-Present)</h4><ul><li>Led brand strategy for $500M portfolio, driving 12% YoY revenue growth</li><li>Launched digital-first campaign reaching 50M consumers, earning Cannes Lions recognition</li><li>Managed $20M marketing budget with 8:1 ROAS across paid channels</li></ul><h3>Education</h3><p>MBA, The Wharton School<br>BA Marketing, NYU Stern</p>`
  },
  { id: 8, clientId: 8, clientName: 'Rachel Foster', name: 'Resume - CRO', type: 'resume', lastModified: daysAgo(6), version: 3,
    versions: [{v: 1, date: daysAgo(45)}, {v: 2, date: daysAgo(20)}, {v: 3, date: daysAgo(6)}],
    content: `<h2>Rachel Foster</h2><p class="doc-contact">rachel.foster@gmail.com | (512) 555-0808 | linkedin.com/in/rachelfoster</p><h3>Professional Summary</h3><p>VP of Sales with 11 years of experience scaling B2B SaaS revenue. Built and led sales organizations from $5M to $80M ARR. Expert in enterprise sales, PLG monetization, and building world-class revenue teams.</p><h3>Experience</h3><h4>VP of Sales, CloudScale (2021-Present)</h4><ul><li>Scaled ARR from $20M to $80M in 3 years, achieving 140% of target each year</li><li>Built sales team from 12 to 65 reps across SMB, mid-market, and enterprise segments</li><li>Implemented product-led sales motion increasing expansion revenue by 55%</li></ul><h3>Education</h3><p>BS Business Administration, University of Texas at Austin</p>`
  },
  { id: 9, clientId: 10, clientName: 'Sophie Laurent', name: 'Resume - Head of Content', type: 'resume', lastModified: daysAgo(7), version: 2,
    versions: [{v: 1, date: daysAgo(20)}, {v: 2, date: daysAgo(7)}],
    content: `<h2>Sophie Laurent</h2><p class="doc-contact">sophie.l@gmail.com | (617) 555-1010 | linkedin.com/in/sophielaurent</p><h3>Professional Summary</h3><p>Content strategist with 8 years of experience building content programs that drive organic growth and brand authority. Currently leading content strategy at HubSpot, growing organic traffic by 3x.</p><h3>Experience</h3><h4>Senior Content Strategist, HubSpot (2021-Present)</h4><ul><li>Grew organic blog traffic from 2M to 6M monthly visitors through SEO-driven content strategy</li><li>Led team of 5 content creators producing 40+ pieces per month</li><li>Launched video content program generating 500K YouTube subscribers in 18 months</li></ul><h3>Education</h3><p>BA English Literature, Boston University</p>`
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
let NOTIFICATIONS = [
  { id: 1, type: 'message', text: 'James Park sent you a message about Stripe interview', time: new Date(NOW.getTime() - 0.5 * 3600000), read: false, link: 'messaging' },
  { id: 2, type: 'calendar', text: 'Coaching call with David Kim starts in 30 minutes', time: new Date(NOW.getTime() - 0.3 * 3600000), read: false, link: 'calendar' },
  { id: 3, type: 'celebration', text: 'Aisha Johnson received an offer from Coinbase!', time: new Date(NOW.getTime() - 2 * 3600000), read: false, link: 'clients' },
  { id: 4, type: 'money', text: 'Invoice INV-2026-004 from Marcus Thompson is overdue', time: new Date(NOW.getTime() - 4 * 3600000), read: false, link: 'revenue' },
  { id: 5, type: 'message', text: 'Aisha Johnson sent details about Coinbase offer', time: new Date(NOW.getTime() - 4 * 3600000), read: false, link: 'messaging' },
  { id: 6, type: 'calendar', text: 'Resume review with James Park at 2:00 PM today', time: new Date(NOW.getTime() - 6 * 3600000), read: true, link: 'calendar' },
  { id: 7, type: 'money', text: 'David Kim paid invoice INV-2026-003 ($300)', time: new Date(NOW.getTime() - 8 * 3600000), read: true, link: 'revenue' },
  { id: 8, type: 'celebration', text: 'Rachel Foster advancing to final round at Datadog', time: new Date(NOW.getTime() - 24 * 3600000), read: true, link: 'clients' },
  { id: 9, type: 'message', text: 'Sophie Laurent shared Shopify screen feedback', time: new Date(NOW.getTime() - 26 * 3600000), read: true, link: 'messaging' },
  { id: 10, type: 'calendar', text: 'Reminder: Mock interview with Marcus Thompson tomorrow', time: new Date(NOW.getTime() - 28 * 3600000), read: true, link: 'calendar' },
  { id: 11, type: 'money', text: 'Invoice INV-2026-005 from Emily Watson is overdue', time: new Date(NOW.getTime() - 50 * 3600000), read: true, link: 'revenue' },
  { id: 12, type: 'message', text: 'Emily Watson re-engaged after 2-week pause', time: new Date(NOW.getTime() - 120 * 3600000), read: true, link: 'messaging' },
  { id: 13, type: 'celebration', text: 'Olivia Stewart started her new role at Retool!', time: new Date(NOW.getTime() - 200 * 3600000), read: true, link: 'clients' },
  { id: 14, type: 'calendar', text: 'Weekly review block completed', time: new Date(NOW.getTime() - 170 * 3600000), read: true, link: 'calendar' },
];

// ============================================================
// ANALYTICS DATA
// ============================================================
const ANALYTICS = {
  sessionsPerWeek: [12, 14, 11, 15, 13, 16, 14, 15],
  weekLabels: ['W1 Feb', 'W2 Feb', 'W3 Feb', 'W4 Feb', 'W1 Mar', 'W2 Mar', 'W3 Mar', 'W4 Mar'],
  clientStatusDist: { active: 12, paused: 2, completed: 1 },
  applicationsByStage: { preparing: 2, applied: 3, screening: 2, interviewing: 3, offer: 2, closed: 1 },
  avgDaysPerStage: { preparing: 4, applied: 7, screening: 5, interviewing: 8, offer: 3, closed: 0 },
  interviewRate: 62,
  offerRate: 28,
  avgTimeToInterview: 18,
  avgEngagementDuration: 3.8,
  analytics90: {
    sessionsPerWeek: [10, 11, 12, 14, 11, 13, 15, 13, 16, 14, 15, 14],
    weekLabels: ['W1 Jan', 'W2 Jan', 'W3 Jan', 'W4 Jan', 'W1 Feb', 'W2 Feb', 'W3 Feb', 'W4 Feb', 'W1 Mar', 'W2 Mar', 'W3 Mar', 'W4 Mar'],
    interviewRate: 58,
    offerRate: 25,
    avgTimeToInterview: 20,
    avgEngagementDuration: 3.5,
  },
  analyticsYear: {
    sessionsPerWeek: [8, 9, 8, 10, 9, 11, 10, 12, 11, 12, 14, 11, 13, 15, 13, 16, 14, 15, 14, 15],
    weekLabels: Array.from({length: 20}, (_, i) => `W${(i % 4) + 1}`),
    interviewRate: 52,
    offerRate: 22,
    avgTimeToInterview: 22,
    avgEngagementDuration: 3.2,
  }
};

// ============================================================
// MESSAGE TEMPLATES
// ============================================================
const MESSAGE_TEMPLATES = [
  { name: 'Session Reminder', text: 'Hi [name], just a reminder about our session tomorrow at [time]. Looking forward to it!' },
  { name: 'Resume Ready', text: 'Hi [name], your updated resume is ready for review. I\'ve made some key improvements to the experience section. Let me know your thoughts!' },
  { name: 'Check-in', text: 'Hi [name], just checking in to see how things are going with your job search. Any updates or questions I can help with?' },
  { name: 'Interview Prep', text: 'Hi [name], I\'ve put together an interview prep kit for your upcoming interview. Let\'s schedule a session to go through it together.' },
  { name: 'Congratulations', text: 'Hi [name], congratulations on this milestone! Your hard work is paying off. Let\'s discuss next steps in our upcoming session.' },
];

// ============================================================
// HEALTH SCORE BREAKDOWN
// ============================================================
function getHealthBreakdown(client) {
  const daysSinceActivity = Math.floor((TODAY - client.lastActivity) / (1000 * 60 * 60 * 24));
  const sessionScore = daysSinceActivity <= 3 ? 25 : daysSinceActivity <= 7 ? 18 : daysSinceActivity <= 14 ? 10 : 0;
  const resumeScore = daysSinceActivity <= 7 ? 25 : daysSinceActivity <= 14 ? 15 : 5;
  const apps = PIPELINE.filter(p => p.clientId === client.id).length;
  const appScore = Math.min(apps * 10, 30);
  const responseScore = client.healthScore > 70 ? 20 : client.healthScore > 40 ? 12 : 5;
  return {
    lastSession: { label: `Last session: ${relativeDate(client.lastActivity)}`, score: sessionScore },
    resumeFreshness: { label: `Resume updated: ${relativeDate(client.lastActivity)}`, score: resumeScore },
    applications: { label: `Active applications: ${apps}`, score: appScore },
    responseRate: { label: `Response rate: ${client.healthScore > 70 ? '90%' : client.healthScore > 40 ? '65%' : '30%'}`, score: responseScore }
  };
}

function getHealthConcern(client) {
  const daysSinceActivity = Math.floor((TODAY - client.lastActivity) / (1000 * 60 * 60 * 24));
  if (daysSinceActivity > 21) return 'No activity in ' + daysSinceActivity + ' days';
  if (daysSinceActivity > 14) return 'No session in ' + daysSinceActivity + ' days';
  if (client.healthScore < 40) return 'Low engagement';
  if (!client.nextSession) return 'No upcoming session';
  return 'On track';
}
