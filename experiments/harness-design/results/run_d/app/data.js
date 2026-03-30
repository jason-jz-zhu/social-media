// Mock Data for Client Management Dashboard
// Sprints 1-4

const CLIENTS = [
  { id: 1, name: "Sarah Chen", company: "TechVista Solutions", email: "sarah@techvista.com", phone: "(415) 555-0142", status: "active", projects: 3, lastContact: "2026-03-25", revenue: 42500, plan: "Premium", linkedin: "linkedin.com/in/sarahchen", bio: "VP of Engineering at TechVista. Needs consulting on cloud migration and team scaling.", startDate: "2025-09-15", sessionsCompleted: 18, healthScore: 92 },
  { id: 2, name: "Marcus Johnson", company: "Apex Digital", email: "marcus@apexdigital.io", phone: "(212) 555-0198", status: "active", projects: 2, lastContact: "2026-03-24", revenue: 28000, plan: "Pro", linkedin: "linkedin.com/in/marcusjohnson", bio: "Co-founder at Apex Digital. Focused on product-market fit and go-to-market strategy.", startDate: "2025-11-01", sessionsCompleted: 12, healthScore: 78 },
  { id: 3, name: "Elena Rodriguez", company: "GreenLeaf Corp", email: "elena@greenleaf.co", phone: "(305) 555-0167", status: "active", projects: 1, lastContact: "2026-03-22", revenue: 15750, plan: "Basic", linkedin: "linkedin.com/in/elenarodriguez", bio: "Head of Operations looking to streamline workflows and reduce overhead costs.", startDate: "2026-01-10", sessionsCompleted: 6, healthScore: 45 },
  { id: 4, name: "David Park", company: "Nimbus Analytics", email: "dpark@nimbusanalytics.com", phone: "(650) 555-0134", status: "active", projects: 2, lastContact: "2026-03-20", revenue: 36200, plan: "Pro", linkedin: "linkedin.com/in/davidpark", bio: "CTO at Nimbus. Consulting on data infrastructure and analytics platform architecture.", startDate: "2025-10-20", sessionsCompleted: 14, healthScore: 65 },
  { id: 5, name: "Priya Sharma", company: "BrightPath Education", email: "priya@brightpath.edu", phone: "(617) 555-0189", status: "lead", projects: 0, lastContact: "2026-03-26", revenue: 0, plan: "None", linkedin: "linkedin.com/in/priyasharma", bio: "Founder of BrightPath. Interested in EdTech strategy and scaling coaching.", startDate: null, sessionsCompleted: 0, healthScore: null },
  { id: 6, name: "Tom Mitchell", company: "Redwood Ventures", email: "tom@redwoodvc.com", phone: "(408) 555-0156", status: "inactive", projects: 1, lastContact: "2026-02-14", revenue: 8500, plan: "Basic", linkedin: "linkedin.com/in/tommitchell", bio: "Partner at Redwood Ventures. Previously consulted on portfolio company operations.", startDate: "2025-06-01", sessionsCompleted: 8, healthScore: 22 },
  { id: 7, name: "Aisha Patel", company: "CloudNine SaaS", email: "aisha@cloudnine.io", phone: "(512) 555-0173", status: "active", projects: 4, lastContact: "2026-03-27", revenue: 67800, plan: "Premium", linkedin: "linkedin.com/in/aishapatel", bio: "CEO of CloudNine SaaS. Engaged in full-spectrum growth consulting including engineering, product, and go-to-market.", startDate: "2025-05-15", sessionsCompleted: 28, healthScore: 95 },
  { id: 8, name: "James O'Brien", company: "Harbor Logistics", email: "jobrien@harborlog.com", phone: "(206) 555-0121", status: "lead", projects: 0, lastContact: "2026-03-23", revenue: 0, plan: "None", linkedin: "linkedin.com/in/jamesobrien", bio: "Director of Operations at Harbor Logistics. Exploring digital transformation consulting.", startDate: null, sessionsCompleted: 0, healthScore: null },
  { id: 9, name: "Linda Nakamura", company: "Pixel Perfect Studios", email: "linda@pixelperfect.design", phone: "(323) 555-0145", status: "active", projects: 2, lastContact: "2026-03-19", revenue: 22300, plan: "Pro", linkedin: "linkedin.com/in/lindanakamura", bio: "Creative Director at Pixel Perfect. Consulting on design system creation and team structure.", startDate: "2025-12-05", sessionsCompleted: 9, healthScore: 55 },
  { id: 10, name: "Robert Fisk", company: "Ironclad Security", email: "rfisk@ironcladsec.com", phone: "(703) 555-0188", status: "inactive", projects: 0, lastContact: "2026-01-30", revenue: 12000, plan: "Basic", linkedin: "linkedin.com/in/robertfisk", bio: "CISO at Ironclad Security. Previously consulted on security audit framework.", startDate: "2025-07-20", sessionsCompleted: 10, healthScore: 18 },
  { id: 11, name: "Megan Torres", company: "Velocity Fitness", email: "megan@velocityfit.com", phone: "(720) 555-0134", status: "active", projects: 1, lastContact: "2026-03-26", revenue: 9800, plan: "Basic", linkedin: "linkedin.com/in/megantorres", bio: "Founder of Velocity Fitness. Consulting on franchise model and unit economics.", startDate: "2026-02-01", sessionsCompleted: 4, healthScore: 82 },
  { id: 12, name: "Wei Zhang", company: "Quantum Devices", email: "wzhang@quantumdevices.io", phone: "(858) 555-0167", status: "active", projects: 2, lastContact: "2026-03-21", revenue: 31400, plan: "Pro", linkedin: "linkedin.com/in/weizhang", bio: "VP Product at Quantum Devices. Hardware-software integration consulting.", startDate: "2025-08-10", sessionsCompleted: 16, healthScore: 71 },
  { id: 13, name: "Fatima Al-Hassan", company: "Oasis Retail", email: "fatima@oasisretail.com", phone: "(469) 555-0192", status: "lead", projects: 0, lastContact: "2026-03-25", revenue: 0, plan: "None", linkedin: "linkedin.com/in/fatimaalhassan", bio: "CEO of Oasis Retail chain. Exploring e-commerce strategy consulting.", startDate: null, sessionsCompleted: 0, healthScore: null },
  { id: 14, name: "Ryan Cooper", company: "Forge Manufacturing", email: "rcooper@forgemfg.com", phone: "(313) 555-0178", status: "inactive", projects: 1, lastContact: "2026-02-28", revenue: 14200, plan: "Pro", linkedin: "linkedin.com/in/ryancooper", bio: "COO at Forge Manufacturing. Consulted on lean operations and supply chain.", startDate: "2025-09-01", sessionsCompleted: 11, healthScore: 32 },
  { id: 15, name: "Sophie Laurent", company: "Lumiere Design", email: "sophie@lumieredesign.fr", phone: "(646) 555-0115", status: "active", projects: 1, lastContact: "2026-03-24", revenue: 18600, plan: "Pro", linkedin: "linkedin.com/in/sophielaurent", bio: "Art Director at Lumiere Design. Consulting on brand strategy and creative operations.", startDate: "2025-11-20", sessionsCompleted: 10, healthScore: 88 }
];

const DASHBOARD_METRICS = {
  totalRevenue: 306050,
  activeClients: 9,
  pendingInvoices: 4,
  hoursThisWeek: 34.5
};

const RECENT_ACTIVITY = [
  { id: 1, type: "invoice", icon: "receipt", message: "Invoice #1047 sent to Aisha Patel", detail: "$4,200.00", time: "2 hours ago", color: "#f59e0b" },
  { id: 2, type: "client", icon: "person_add", message: "New lead added: James O'Brien", detail: "Harbor Logistics", time: "5 hours ago", color: "#4338ca" },
  { id: 3, type: "payment", icon: "payments", message: "Payment received from David Park", detail: "$8,750.00", time: "1 day ago", color: "#16a34a" },
  { id: 4, type: "project", icon: "folder_open", message: "Project milestone completed: TechVista Redesign", detail: "Phase 2 of 3", time: "1 day ago", color: "#4338ca" },
  { id: 5, type: "time", icon: "schedule", message: "Time logged: CloudNine SaaS API integration", detail: "6.5 hours", time: "2 days ago", color: "#7c3aed" },
  { id: 6, type: "invoice", icon: "warning", message: "Invoice #1039 overdue: Elena Rodriguez", detail: "$3,150.00 - 7 days late", time: "2 days ago", color: "#dc2626" },
  { id: 7, type: "client", icon: "handshake", message: "Contract signed with Priya Sharma", detail: "BrightPath Education", time: "3 days ago", color: "#16a34a" }
];

const PROJECTS = [
  { id: 1, name: "Website Redesign", clientId: 1, status: "in-progress", deadline: "2026-04-15" },
  { id: 2, name: "Brand Identity", clientId: 1, status: "in-progress", deadline: "2026-05-01" },
  { id: 3, name: "SEO Audit", clientId: 1, status: "completed", deadline: "2026-03-10" },
  { id: 4, name: "App Development", clientId: 2, status: "in-progress", deadline: "2026-06-01" },
  { id: 5, name: "Marketing Strategy", clientId: 2, status: "planning", deadline: "2026-04-20" },
  { id: 6, name: "Content Strategy", clientId: 3, status: "in-progress", deadline: "2026-04-30" },
  { id: 7, name: "Data Pipeline", clientId: 4, status: "in-progress", deadline: "2026-05-15" },
  { id: 8, name: "Dashboard MVP", clientId: 4, status: "planning", deadline: "2026-06-15" },
  { id: 9, name: "API Integration", clientId: 7, status: "in-progress", deadline: "2026-04-10" },
  { id: 10, name: "Mobile App v2", clientId: 7, status: "planning", deadline: "2026-05-20" },
  { id: 11, name: "Security Audit", clientId: 7, status: "completed", deadline: "2026-03-01" },
  { id: 12, name: "UX Research", clientId: 7, status: "in-progress", deadline: "2026-04-25" },
  { id: 13, name: "E-commerce Setup", clientId: 6, status: "completed", deadline: "2026-01-15" },
  { id: 14, name: "Portfolio Site", clientId: 9, status: "in-progress", deadline: "2026-04-05" },
  { id: 15, name: "Blog Platform", clientId: 9, status: "planning", deadline: "2026-05-10" }
];

const INVOICES = [
  { id: 1039, clientId: 3, amount: 3150, status: "overdue", dueDate: "2026-03-20", issuedDate: "2026-03-06", plan: "Basic", period: "Mar 2026", paymentMethod: "Visa ending 4242" },
  { id: 1040, clientId: 6, amount: 2800, status: "paid", dueDate: "2026-02-15", issuedDate: "2026-02-01", plan: "Basic", period: "Feb 2026", paymentMethod: "ACH Transfer", paidDate: "2026-02-14" },
  { id: 1041, clientId: 12, amount: 5400, status: "paid", dueDate: "2026-03-01", issuedDate: "2026-02-15", plan: "Pro", period: "Mar 2026", paymentMethod: "Visa ending 8891", paidDate: "2026-02-28" },
  { id: 1042, clientId: 1, amount: 8500, status: "paid", dueDate: "2026-03-15", issuedDate: "2026-03-01", plan: "Premium", period: "Mar 2026", paymentMethod: "Amex ending 3456", paidDate: "2026-03-14" },
  { id: 1043, clientId: 7, amount: 9200, status: "paid", dueDate: "2026-03-10", issuedDate: "2026-02-25", plan: "Premium", period: "Mar 2026", paymentMethod: "Wire Transfer", paidDate: "2026-03-09" },
  { id: 1044, clientId: 4, amount: 6200, status: "pending", dueDate: "2026-04-01", issuedDate: "2026-03-18", plan: "Pro", period: "Apr 2026", paymentMethod: "Visa ending 7734" },
  { id: 1045, clientId: 2, amount: 4800, status: "pending", dueDate: "2026-04-05", issuedDate: "2026-03-22", plan: "Pro", period: "Apr 2026", paymentMethod: "ACH Transfer" },
  { id: 1046, clientId: 9, amount: 3600, status: "pending", dueDate: "2026-04-10", issuedDate: "2026-03-25", plan: "Pro", period: "Apr 2026", paymentMethod: "Visa ending 5519" },
  { id: 1047, clientId: 7, amount: 4200, status: "sent", dueDate: "2026-04-12", issuedDate: "2026-03-27", plan: "Premium", period: "Apr 2026", paymentMethod: "Wire Transfer" },
  { id: 1048, clientId: 15, amount: 5100, status: "pending", dueDate: "2026-04-15", issuedDate: "2026-03-27", plan: "Pro", period: "Apr 2026", paymentMethod: "Visa ending 6623" },
  { id: 1049, clientId: 11, amount: 2500, status: "paid", dueDate: "2026-03-20", issuedDate: "2026-03-05", plan: "Basic", period: "Mar 2026", paymentMethod: "ACH Transfer", paidDate: "2026-03-19" },
  { id: 1050, clientId: 14, amount: 4800, status: "overdue", dueDate: "2026-03-22", issuedDate: "2026-03-08", plan: "Pro", period: "Mar 2026", paymentMethod: "Visa ending 2217" }
];

// Sprint 2: Pipeline / Kanban Data
const PIPELINE_CARDS = [
  { id: 1, clientId: 1, company: "TechVista Solutions", project: "Website Redesign", stage: "in-progress", daysInStage: 5, source: "Direct", notes: "Phase 2 underway, design review scheduled" },
  { id: 2, clientId: 2, company: "Apex Digital", project: "App Development", stage: "in-progress", daysInStage: 12, source: "Referral", notes: "Backend architecture finalized" },
  { id: 3, clientId: 4, company: "Nimbus Analytics", project: "Data Pipeline", stage: "review", daysInStage: 3, source: "LinkedIn", notes: "Awaiting client sign-off on data models" },
  { id: 4, clientId: 7, company: "CloudNine SaaS", project: "API Integration", stage: "in-progress", daysInStage: 8, source: "Direct", notes: "OAuth flow complete, testing endpoints" },
  { id: 5, clientId: 9, company: "Pixel Perfect Studios", project: "Portfolio Site", stage: "review", daysInStage: 2, source: "Referral", notes: "Final design review with creative team" },
  { id: 6, clientId: 1, company: "TechVista Solutions", project: "Brand Identity", stage: "planning", daysInStage: 14, source: "Direct", notes: "Brand workshop scheduled for next week" },
  { id: 7, clientId: 7, company: "CloudNine SaaS", project: "Mobile App v2", stage: "planning", daysInStage: 7, source: "Direct", notes: "Requirements gathering phase" },
  { id: 8, clientId: 2, company: "Apex Digital", project: "Marketing Strategy", stage: "planning", daysInStage: 10, source: "Referral", notes: "Competitive analysis in progress" },
  { id: 9, clientId: 7, company: "CloudNine SaaS", project: "UX Research", stage: "in-progress", daysInStage: 6, source: "Direct", notes: "User interviews scheduled" },
  { id: 10, clientId: 4, company: "Nimbus Analytics", project: "Dashboard MVP", stage: "planning", daysInStage: 3, source: "LinkedIn", notes: "Wireframes being created" },
  { id: 11, clientId: 12, company: "Quantum Devices", project: "Hardware Integration", stage: "completed", daysInStage: 1, source: "Conference", notes: "Delivered and invoiced" },
  { id: 12, clientId: 15, company: "Lumiere Design", project: "Brand Strategy", stage: "in-progress", daysInStage: 4, source: "Referral", notes: "Mood boards approved, moving to execution" },
  { id: 13, clientId: 11, company: "Velocity Fitness", project: "Franchise Model", stage: "review", daysInStage: 6, source: "LinkedIn", notes: "Financial models under review" },
  { id: 14, clientId: 3, company: "GreenLeaf Corp", project: "Content Strategy", stage: "on-hold", daysInStage: 18, source: "Direct", notes: "Paused pending invoice resolution" }
];

// Sprint 2: Calendar Events
const CALENDAR_EVENTS = [
  { id: 1, clientId: 1, clientName: "Sarah Chen", title: "Strategy Review", type: "coaching", date: "2026-03-27", startTime: "09:00", endTime: "10:00", notes: "Q2 planning and roadmap review" },
  { id: 2, clientId: 7, clientName: "Aisha Patel", title: "Architecture Review", type: "coaching", date: "2026-03-27", startTime: "10:30", endTime: "11:30", notes: "API gateway design decisions" },
  { id: 3, clientId: 2, clientName: "Marcus Johnson", title: "Product Review", type: "review", date: "2026-03-27", startTime: "14:00", endTime: "15:00", notes: "MVP demo and feedback session" },
  { id: 4, clientId: 4, clientName: "David Park", title: "Data Model Review", type: "review", date: "2026-03-28", startTime: "09:30", endTime: "10:30", notes: "Review ETL pipeline design" },
  { id: 5, clientId: 9, clientName: "Linda Nakamura", title: "Design System Workshop", type: "workshop", date: "2026-03-28", startTime: "13:00", endTime: "14:30", notes: "Component library architecture" },
  { id: 6, clientId: 12, clientName: "Wei Zhang", title: "Integration Planning", type: "coaching", date: "2026-03-29", startTime: "11:00", endTime: "12:00", notes: "Hardware-software interface spec" },
  { id: 7, clientId: 15, clientName: "Sophie Laurent", title: "Brand Workshop", type: "workshop", date: "2026-03-29", startTime: "15:00", endTime: "16:30", notes: "Visual identity exploration" },
  { id: 8, clientId: 11, clientName: "Megan Torres", title: "Unit Economics Review", type: "review", date: "2026-03-30", startTime: "10:00", endTime: "11:00", notes: "Franchise cost model analysis" },
  { id: 9, clientId: 1, clientName: "Sarah Chen", title: "Team Scaling Call", type: "coaching", date: "2026-03-30", startTime: "14:00", endTime: "15:00", notes: "Engineering hiring plan" },
  { id: 10, clientId: 7, clientName: "Aisha Patel", title: "Sprint Planning", type: "coaching", date: "2026-03-31", startTime: "09:00", endTime: "10:00", notes: "Backlog prioritization" },
  { id: 11, clientId: 0, clientName: "Internal", title: "Admin Block", type: "admin", date: "2026-03-31", startTime: "12:00", endTime: "13:00", notes: "Invoice preparation and follow-ups" },
  { id: 12, clientId: 2, clientName: "Marcus Johnson", title: "GTM Strategy", type: "coaching", date: "2026-04-01", startTime: "10:00", endTime: "11:00", notes: "Go-to-market channel analysis" }
];

// Sprint 2: Documents
const DOCUMENTS = [
  { id: 1, clientId: 1, name: "TechVista Cloud Migration Plan", type: "Strategy", lastModified: "2026-03-25", version: 3, versions: [{v: 1, date: "2026-02-15"}, {v: 2, date: "2026-03-10"}, {v: 3, date: "2026-03-25"}], content: "Executive Summary\n\nTechVista Solutions requires a comprehensive cloud migration strategy to move from on-premises infrastructure to AWS. This plan outlines a phased approach over 6 months.\n\nPhase 1: Assessment & Planning (Weeks 1-4)\n- Inventory all existing services and dependencies\n- Identify migration candidates and prioritization matrix\n- Establish cloud governance framework\n\nPhase 2: Foundation (Weeks 5-8)\n- Set up AWS organization and account structure\n- Implement networking (VPC, subnets, security groups)\n- Deploy CI/CD pipeline for infrastructure as code\n\nPhase 3: Migration (Weeks 9-20)\n- Migrate databases using AWS DMS\n- Containerize applications with ECS/Fargate\n- Implement monitoring and alerting with CloudWatch\n\nPhase 4: Optimization (Weeks 21-24)\n- Cost optimization review\n- Performance tuning\n- Security audit and compliance verification" },
  { id: 2, clientId: 1, name: "Team Scaling Roadmap", type: "Roadmap", lastModified: "2026-03-20", version: 2, versions: [{v: 1, date: "2026-03-05"}, {v: 2, date: "2026-03-20"}], content: "Engineering Team Scaling Plan\n\nCurrent State: 12 engineers\nTarget State: 25 engineers by Q4 2026\n\nHiring Plan:\n- 4 Senior Backend Engineers (Q2)\n- 3 Frontend Engineers (Q2-Q3)\n- 2 DevOps Engineers (Q3)\n- 2 QA Engineers (Q3)\n- 1 Engineering Manager (Q2)\n- 1 Tech Lead (Q3)\n\nOnboarding Framework:\n- Week 1: Environment setup and culture immersion\n- Week 2-3: Paired programming with senior team member\n- Week 4: First independent task assignment\n\nBudget Impact: ~$180K/month additional payroll at full capacity" },
  { id: 3, clientId: 2, name: "Apex Product-Market Fit Analysis", type: "Analysis", lastModified: "2026-03-22", version: 1, versions: [{v: 1, date: "2026-03-22"}], content: "Product-Market Fit Assessment\n\nCompany: Apex Digital\nProduct: Real-time analytics dashboard for e-commerce\n\nSurvey Results (n=47 users):\n- 38% would be 'very disappointed' without the product (target: 40%)\n- NPS: 32 (acceptable but room for improvement)\n- Primary use case: Revenue attribution across channels\n\nKey Findings:\n1. Strong product-channel fit with Shopify ecosystem\n2. Weak retention after Day 30 - need better onboarding\n3. Power users request: custom dashboard builder\n4. Pricing perceived as fair at $49/mo tier\n\nRecommendations:\n- Invest in onboarding flow (estimated 15% retention lift)\n- Build Shopify app marketplace listing\n- Add dashboard customization in next sprint" },
  { id: 4, clientId: 4, name: "Data Architecture Proposal", type: "Proposal", lastModified: "2026-03-18", version: 2, versions: [{v: 1, date: "2026-03-01"}, {v: 2, date: "2026-03-18"}], content: "Data Infrastructure Proposal for Nimbus Analytics\n\nObjective: Design a scalable data platform handling 10M+ events/day\n\nProposed Architecture:\n\nIngestion Layer:\n- Apache Kafka for real-time event streaming\n- AWS Kinesis as fallback/burst handler\n- Schema registry for data contract enforcement\n\nProcessing Layer:\n- Apache Spark for batch processing\n- Flink for real-time stream processing\n- dbt for transformation layer\n\nStorage Layer:\n- Snowflake as primary data warehouse\n- S3 for data lake (raw/staged)\n- Redis for caching layer\n\nServing Layer:\n- REST APIs via FastAPI\n- GraphQL for flexible querying\n- Materialized views for dashboard queries\n\nEstimated Monthly Cost: $12,000-$18,000 at scale" },
  { id: 5, clientId: 7, name: "CloudNine API Design Document", type: "Technical", lastModified: "2026-03-27", version: 4, versions: [{v: 1, date: "2026-02-01"}, {v: 2, date: "2026-02-20"}, {v: 3, date: "2026-03-15"}, {v: 4, date: "2026-03-27"}], content: "API Design Specification v4\n\nBase URL: api.cloudnine.io/v2\nAuthentication: OAuth 2.0 + API Key\n\nEndpoints:\n\nPOST /auth/token - Generate access token\nGET /users - List all users (paginated)\nGET /users/:id - Get user details\nPUT /users/:id - Update user\n\nGET /subscriptions - List subscriptions\nPOST /subscriptions - Create subscription\nPATCH /subscriptions/:id - Modify subscription\nDELETE /subscriptions/:id - Cancel subscription\n\nGET /analytics/mrr - Monthly recurring revenue\nGET /analytics/churn - Churn rate metrics\nGET /analytics/cohort - Cohort analysis\n\nRate Limits:\n- Free tier: 100 req/min\n- Pro tier: 1000 req/min\n- Enterprise: 10000 req/min\n\nWebhook Events:\nsubscription.created, subscription.updated, subscription.cancelled, payment.succeeded, payment.failed" },
  { id: 6, clientId: 7, name: "CloudNine Growth Strategy", type: "Strategy", lastModified: "2026-03-15", version: 2, versions: [{v: 1, date: "2026-02-10"}, {v: 2, date: "2026-03-15"}], content: "Growth Strategy 2026\n\nCurrent ARR: $2.4M\nTarget ARR: $5M by Dec 2026\n\nGrowth Levers:\n1. Product-Led Growth (PLG)\n   - Free tier launch (target: 5000 signups/month)\n   - In-app upgrade prompts at usage limits\n   - Self-serve onboarding flow\n\n2. Enterprise Sales\n   - Hire 2 AEs focused on $50K+ deals\n   - Build SOC 2 compliance story\n   - Launch dedicated enterprise tier\n\n3. Partnerships\n   - Salesforce integration (in progress)\n   - HubSpot marketplace listing\n   - Stripe partner program\n\n4. Content & Community\n   - Weekly engineering blog\n   - Monthly webinar series\n   - Developer community Discord" },
  { id: 7, clientId: 9, name: "Design System Architecture", type: "Technical", lastModified: "2026-03-19", version: 1, versions: [{v: 1, date: "2026-03-19"}], content: "Design System for Pixel Perfect Studios\n\nFoundation:\n- Design tokens (colors, spacing, typography)\n- Figma component library\n- Storybook documentation\n\nComponent Hierarchy:\n1. Atoms: Button, Input, Badge, Avatar, Icon\n2. Molecules: Card, Form Field, Navigation Item, Toast\n3. Organisms: Header, Sidebar, Data Table, Modal\n4. Templates: Dashboard Layout, Detail Page, List Page\n\nTechnology Stack:\n- React + TypeScript\n- Tailwind CSS for utility classes\n- Radix UI for accessible primitives\n- Storybook for documentation and testing\n\nDistribution:\n- npm private package\n- Chromatic for visual regression testing\n- Automated changelog generation" },
  { id: 8, clientId: 11, name: "Franchise Unit Economics Model", type: "Analysis", lastModified: "2026-03-26", version: 2, versions: [{v: 1, date: "2026-03-10"}, {v: 2, date: "2026-03-26"}], content: "Velocity Fitness - Franchise Unit Economics\n\nPer-Unit Financials:\n\nRevenue (Monthly):\n- Memberships: $45,000\n- Personal Training: $12,000\n- Retail/Supplements: $3,500\n- Total Revenue: $60,500\n\nFixed Costs (Monthly):\n- Rent: $12,000\n- Staff (6 FTE): $18,000\n- Equipment Lease: $3,500\n- Insurance: $1,200\n- Software/Tech: $800\n- Total Fixed: $35,500\n\nVariable Costs (Monthly):\n- Utilities: $2,800\n- Marketing: $3,000\n- Supplies: $1,500\n- Total Variable: $7,300\n\nUnit Contribution: $17,700/month\nBreakeven: Month 14\nFranchise Fee: $45,000\nROI: 28 months" }
];

// Sprint 2: Client Activity Timelines
const CLIENT_ACTIVITIES = {
  1: [
    { type: "session", title: "Strategy Review Session", date: "2026-03-25", detail: "Discussed Q2 priorities and cloud migration timeline" },
    { type: "document", title: "Cloud Migration Plan updated to v3", date: "2026-03-25", detail: "Added Phase 4 optimization details" },
    { type: "invoice", title: "Invoice #1042 paid", date: "2026-03-14", detail: "$8,500.00 - Premium plan, Mar 2026" },
    { type: "session", title: "Team Scaling Workshop", date: "2026-03-10", detail: "Defined hiring plan and budget" },
    { type: "milestone", title: "SEO Audit project completed", date: "2026-03-10", detail: "All deliverables approved" },
    { type: "document", title: "Team Scaling Roadmap created", date: "2026-03-05", detail: "Initial version with hiring timeline" },
    { type: "session", title: "Architecture Deep Dive", date: "2026-02-28", detail: "Reviewed microservices migration approach" },
    { type: "message", title: "Follow-up email sent", date: "2026-02-25", detail: "Summary of architecture decisions" }
  ],
  7: [
    { type: "session", title: "API Architecture Review", date: "2026-03-27", detail: "Finalized v2 API design spec" },
    { type: "document", title: "API Design Document updated to v4", date: "2026-03-27", detail: "Added webhook events specification" },
    { type: "invoice", title: "Invoice #1047 sent", date: "2026-03-27", detail: "$4,200.00 - Premium plan, Apr 2026" },
    { type: "session", title: "Growth Strategy Review", date: "2026-03-20", detail: "Reviewed PLG funnel metrics" },
    { type: "milestone", title: "Security Audit completed", date: "2026-03-01", detail: "Passed all compliance checks" },
    { type: "document", title: "Growth Strategy updated to v2", date: "2026-03-15", detail: "Added enterprise sales playbook" },
    { type: "session", title: "Product Roadmap Planning", date: "2026-03-05", detail: "Prioritized Q2 feature backlog" },
    { type: "message", title: "Weekly check-in", date: "2026-02-28", detail: "Sprint progress and blockers review" },
    { type: "session", title: "Onboarding Kick-off", date: "2026-02-20", detail: "Initial consultation and goal setting" },
    { type: "invoice", title: "Invoice #1043 paid", date: "2026-03-09", detail: "$9,200.00 - Premium plan, Mar 2026" }
  ]
};

// Sprint 2: Client Applications/Projects detail
const CLIENT_APPLICATIONS = {
  1: [
    { company: "TechVista Solutions", role: "Website Redesign", dateApplied: "2026-01-15", status: "In Progress" },
    { company: "TechVista Solutions", role: "Brand Identity", dateApplied: "2026-02-01", status: "Planning" },
    { company: "TechVista Solutions", role: "SEO Audit", dateApplied: "2025-12-01", status: "Completed" }
  ],
  7: [
    { company: "CloudNine SaaS", role: "API Integration", dateApplied: "2026-01-10", status: "In Progress" },
    { company: "CloudNine SaaS", role: "Mobile App v2", dateApplied: "2026-02-15", status: "Planning" },
    { company: "CloudNine SaaS", role: "Security Audit", dateApplied: "2025-11-01", status: "Completed" },
    { company: "CloudNine SaaS", role: "UX Research", dateApplied: "2026-02-01", status: "In Progress" }
  ]
};

// Sprint 3: Messaging data
const CONVERSATIONS = [
  {
    clientId: 1, unread: true,
    messages: [
      { from: "client", text: "Hi Alex, just wanted to check on the cloud migration timeline. Are we still on track for the Phase 2 deadline?", time: "10:32 AM" },
      { from: "operator", text: "Hey Sarah! Yes, we're on track. The VPC setup is done and we're moving into the CI/CD pipeline configuration this week.", time: "10:45 AM" },
      { from: "client", text: "Great to hear. Can we schedule a quick review for Thursday?", time: "10:48 AM" },
      { from: "operator", text: "Absolutely. I'll send a calendar invite for Thursday at 2 PM. We can walk through the infrastructure as code templates together.", time: "11:02 AM" },
      { from: "client", text: "Perfect. Also, the team has some questions about the container strategy. Can we cover that too?", time: "11:15 AM" },
      { from: "operator", text: "Of course! I'll prepare a comparison of ECS vs EKS options with pros/cons for your use case. See you Thursday!", time: "11:20 AM" }
    ]
  },
  {
    clientId: 7, unread: true,
    messages: [
      { from: "operator", text: "Hi Aisha, the v4 API spec is ready for your review. I've added the webhook events we discussed.", time: "9:15 AM" },
      { from: "client", text: "Thanks Alex! I'll review it this afternoon. Quick question - did we settle on rate limiting per API key or per account?", time: "9:30 AM" },
      { from: "operator", text: "Per API key with account-level aggregate limits. Free tier gets 100 req/min per key, Pro gets 1000. I can adjust if needed.", time: "9:35 AM" },
      { from: "client", text: "That works well. Our enterprise customers will appreciate the flexibility. Let's discuss the pricing tiers in our next session.", time: "9:42 AM" },
      { from: "operator", text: "Sounds good. I've also drafted the Stripe integration flow for subscription management. Want me to add that to Thursday's agenda?", time: "9:50 AM" },
      { from: "client", text: "Yes please! That's a priority for us this quarter.", time: "9:55 AM" }
    ]
  },
  {
    clientId: 2, unread: false,
    messages: [
      { from: "operator", text: "Marcus, I've completed the competitive analysis for your GTM strategy. Three key takeaways to discuss.", time: "Yesterday 3:15 PM" },
      { from: "client", text: "Looking forward to it! Can you share the deck beforehand?", time: "Yesterday 3:30 PM" },
      { from: "operator", text: "Absolutely. I'll have it in your inbox by EOD. The Shopify ecosystem opportunity is really interesting.", time: "Yesterday 3:45 PM" },
      { from: "client", text: "Agreed. Our onboarding numbers are still below target though. Any recommendations?", time: "Yesterday 4:00 PM" },
      { from: "operator", text: "Yes, I have a 3-part plan: interactive product tour, personalized setup wizard, and a 'quick wins' email sequence. We'll walk through it.", time: "Yesterday 4:10 PM" },
      { from: "client", text: "Sounds perfect. See you tomorrow!", time: "Yesterday 4:15 PM" }
    ]
  },
  {
    clientId: 4, unread: false,
    messages: [
      { from: "client", text: "Alex, the data pipeline prototype is showing 15ms p99 latency. Is that acceptable for our use case?", time: "Mar 25, 2:10 PM" },
      { from: "operator", text: "For your volume (10M events/day), 15ms p99 is excellent. Most competitors see 50-100ms. Let's document this as a benchmark.", time: "Mar 25, 2:25 PM" },
      { from: "client", text: "Good to know. The team is excited about the Flink integration. When can we start the POC?", time: "Mar 25, 2:30 PM" },
      { from: "operator", text: "I'll have the POC environment ready by next Monday. We'll start with the real-time anomaly detection use case.", time: "Mar 25, 2:45 PM" }
    ]
  },
  {
    clientId: 9, unread: true,
    messages: [
      { from: "client", text: "The design system Storybook is looking amazing! The team loves the component library.", time: "Mar 26, 11:00 AM" },
      { from: "operator", text: "Glad to hear it, Linda! We should discuss the Figma-to-code workflow next. I have some automation ideas.", time: "Mar 26, 11:15 AM" },
      { from: "client", text: "That would be huge for our productivity. Can we fit it into next week's session?", time: "Mar 26, 11:20 AM" }
    ]
  },
  {
    clientId: 12, unread: false,
    messages: [
      { from: "operator", text: "Wei, the hardware integration specs are finalized. Ready for your review.", time: "Mar 24, 4:00 PM" },
      { from: "client", text: "Excellent. I'll loop in our firmware team for feedback. Thanks for the thorough documentation.", time: "Mar 24, 4:30 PM" }
    ]
  },
  {
    clientId: 15, unread: false,
    messages: [
      { from: "operator", text: "Sophie, I've prepared three brand direction concepts for our workshop. Each has a distinct visual identity approach.", time: "Mar 23, 10:00 AM" },
      { from: "client", text: "Exciting! Can you share previews so I can gather initial thoughts from the team?", time: "Mar 23, 10:30 AM" },
      { from: "operator", text: "Of course. Sending mood boards now. Direction A is minimalist, B is editorial, C is bold/geometric.", time: "Mar 23, 10:45 AM" },
      { from: "client", text: "The team is leaning toward Direction B. Can we explore that further?", time: "Mar 23, 2:00 PM" },
      { from: "operator", text: "Great choice! I'll expand Direction B with typography pairings and color palette options for Friday's workshop.", time: "Mar 23, 2:15 PM" }
    ]
  },
  {
    clientId: 11, unread: false,
    messages: [
      { from: "client", text: "Alex, the franchise economics model looks solid. Two questions about the breakeven timeline.", time: "Mar 25, 9:00 AM" },
      { from: "operator", text: "Fire away! I built in conservative assumptions so the actual timeline might be better.", time: "Mar 25, 9:15 AM" },
      { from: "client", text: "Does the model account for seasonal membership fluctuations? We see 30% more signups in January.", time: "Mar 25, 9:20 AM" },
      { from: "operator", text: "Good catch. I modeled flat monthly revenue. Let me update with seasonal curves - that should actually improve the breakeven by 1-2 months.", time: "Mar 25, 9:30 AM" }
    ]
  }
];

// Sprint 3: Revenue history for charts
const REVENUE_HISTORY = [
  { month: "Oct 2025", revenue: 22400 },
  { month: "Nov 2025", revenue: 26800 },
  { month: "Dec 2025", revenue: 29100 },
  { month: "Jan 2026", revenue: 31500 },
  { month: "Feb 2026", revenue: 34200 },
  { month: "Mar 2026", revenue: 38700 }
];

// Sprint 3: Analytics data
const ANALYTICS_DATA = {
  sessionsPerWeek: [12, 15, 11, 18, 14, 16, 13, 17],
  weekLabels: ["W1 Feb", "W2 Feb", "W3 Feb", "W4 Feb", "W1 Mar", "W2 Mar", "W3 Mar", "W4 Mar"],
  clientStatusDist: { active: 9, inactive: 3, lead: 3 },
  projectsByStage: { planning: 4, "in-progress": 7, review: 3, completed: 3, "on-hold": 1 },
  avgDaysPerStage: { planning: 8.5, "in-progress": 7.2, review: 3.7, completed: 1.0, "on-hold": 18.0 },
  successMetrics: {
    projectCompletionRate: "82%",
    avgProjectDuration: "6.2 weeks",
    clientRetentionRate: "91%",
    avgEngagementDuration: "7.4 months"
  }
};

// Sprint 3: Notifications
const NOTIFICATIONS = [
  { id: 1, type: "message", icon: "chat", text: "Sarah Chen sent you a message about cloud migration", time: "25 min ago", read: false, group: "today" },
  { id: 2, type: "calendar", icon: "event", text: "Strategy Review with Sarah Chen in 1 hour", time: "35 min ago", read: false, group: "today" },
  { id: 3, type: "money", icon: "payments", text: "Payment of $8,750 received from David Park", time: "2 hours ago", read: false, group: "today" },
  { id: 4, type: "milestone", icon: "celebration", text: "Aisha Patel's API Integration is 90% complete", time: "3 hours ago", read: true, group: "today" },
  { id: 5, type: "message", icon: "chat", text: "Linda Nakamura replied to your design system update", time: "5 hours ago", read: true, group: "today" },
  { id: 6, type: "money", icon: "warning", text: "Invoice #1039 for Elena Rodriguez is 7 days overdue", time: "Yesterday 9:00 AM", read: false, group: "yesterday" },
  { id: 7, type: "calendar", icon: "event", text: "Product Review with Marcus Johnson completed", time: "Yesterday 3:00 PM", read: true, group: "yesterday" },
  { id: 8, type: "milestone", icon: "celebration", text: "Wei Zhang's Hardware Integration project delivered", time: "Yesterday 11:00 AM", read: true, group: "yesterday" },
  { id: 9, type: "message", icon: "chat", text: "Sophie Laurent shared brand direction feedback", time: "Yesterday 2:15 PM", read: true, group: "yesterday" },
  { id: 10, type: "system", icon: "info", text: "Monthly analytics report is ready to view", time: "2 days ago", read: true, group: "earlier" },
  { id: 11, type: "money", icon: "payments", text: "Invoice #1049 paid by Megan Torres", time: "3 days ago", read: true, group: "earlier" },
  { id: 12, type: "calendar", icon: "event_busy", text: "Ryan Cooper cancelled upcoming session", time: "4 days ago", read: true, group: "earlier" },
  { id: 13, type: "system", icon: "update", text: "Dashboard updated with new analytics features", time: "5 days ago", read: true, group: "earlier" }
];

// Sprint 3: Message templates
const MESSAGE_TEMPLATES = [
  { label: "Session Reminder", text: "Hi [name], just a reminder about our session tomorrow. Looking forward to our discussion!" },
  { label: "Document Ready", text: "Hi [name], the document you requested is ready for review. Please take a look and let me know your feedback." },
  { label: "Invoice Follow-up", text: "Hi [name], I wanted to follow up on the outstanding invoice. Please let me know if you have any questions about the charges." },
  { label: "Check-in", text: "Hi [name], hope you're doing well! Just checking in on progress since our last session. Any blockers I can help with?" }
];

// Sprint 4: Settings defaults
const OPERATOR_SETTINGS = {
  name: "Alex Wang",
  businessName: "AW Consulting",
  email: "alex@awconsulting.com",
  phone: "(415) 555-0100",
  defaultSessionDuration: 60,
  workingHoursStart: "08:00",
  workingHoursEnd: "18:00",
  timezone: "America/Los_Angeles",
  plans: [
    { name: "Basic", price: 2500, features: ["Monthly strategy session", "Email support", "Document reviews"] },
    { name: "Pro", price: 5000, features: ["Bi-weekly sessions", "Priority email support", "Document reviews", "Project management"] },
    { name: "Premium", price: 8500, features: ["Weekly sessions", "24/7 support", "All document services", "Full project management", "Team workshops"] }
  ],
  notifications: {
    email: true,
    sessionReminders: true,
    paymentAlerts: true,
    clientActivity: false
  }
};
