// ============================================================
// Mock Data for JobAgent Operator Dashboard
// ============================================================

const CLIENTS = [
    { id: 1, name: "Alex Rivera", email: "alex.r@email.com", phone: "(415) 555-0101", status: "active", avatar: "AR", role: "Software Engineer", targetRole: "Senior Software Engineer", location: "San Francisco, CA", experience: "5 years", lastActivity: "2026-03-27T10:30:00", agent: "ResumeBot", resumeScore: 82, applications: 14, interviews: 3, offers: 1, joinDate: "2026-02-15", notes: "Strong React/Node background. Targeting FAANG companies." },
    { id: 2, name: "Maya Patel", email: "maya.p@email.com", phone: "(212) 555-0202", status: "active", avatar: "MP", role: "Product Manager", targetRole: "Senior PM", location: "New York, NY", experience: "7 years", lastActivity: "2026-03-27T09:15:00", agent: "MatchBot", resumeScore: 91, applications: 8, interviews: 5, offers: 2, joinDate: "2026-01-20", notes: "MBA from Wharton. Interested in fintech and healthtech." },
    { id: 3, name: "James Okonkwo", email: "james.o@email.com", phone: "(312) 555-0303", status: "active", avatar: "JO", role: "Data Scientist", targetRole: "ML Engineer", location: "Chicago, IL", experience: "4 years", lastActivity: "2026-03-26T16:45:00", agent: "OutreachBot", resumeScore: 78, applications: 22, interviews: 2, offers: 0, joinDate: "2026-03-01", notes: "PhD in Statistics. Wants to transition into ML engineering." },
    { id: 4, name: "Emily Zhang", email: "emily.z@email.com", phone: "(206) 555-0404", status: "active", avatar: "EZ", role: "UX Designer", targetRole: "Design Lead", location: "Seattle, WA", experience: "6 years", lastActivity: "2026-03-27T08:00:00", agent: "ResumeBot", resumeScore: 88, applications: 10, interviews: 4, offers: 1, joinDate: "2026-02-01", notes: "Portfolio includes Apple, Google projects. Looking for leadership." },
    { id: 5, name: "Carlos Mendez", email: "carlos.m@email.com", phone: "(305) 555-0505", status: "paused", avatar: "CM", role: "DevOps Engineer", targetRole: "Platform Engineer", location: "Miami, FL", experience: "8 years", lastActivity: "2026-03-20T11:30:00", agent: "MatchBot", resumeScore: 75, applications: 5, interviews: 1, offers: 0, joinDate: "2026-01-10", notes: "AWS certified. Paused search for personal reasons." },
    { id: 6, name: "Priya Sharma", email: "priya.s@email.com", phone: "(408) 555-0606", status: "active", avatar: "PS", role: "Frontend Developer", targetRole: "Full Stack Engineer", location: "San Jose, CA", experience: "3 years", lastActivity: "2026-03-27T11:00:00", agent: "OutreachBot", resumeScore: 70, applications: 18, interviews: 1, offers: 0, joinDate: "2026-03-10", notes: "Bootcamp grad with strong portfolio. Needs interview prep." },
    { id: 7, name: "David Kim", email: "david.k@email.com", phone: "(213) 555-0707", status: "placed", avatar: "DK", role: "Engineering Manager", targetRole: "VP Engineering", location: "Los Angeles, CA", experience: "12 years", lastActivity: "2026-03-15T14:00:00", agent: "MatchBot", resumeScore: 95, applications: 6, interviews: 4, offers: 3, joinDate: "2025-12-01", notes: "Placed at Series B startup. Great success story." },
    { id: 8, name: "Samantha Brooks", email: "sam.b@email.com", phone: "(617) 555-0808", status: "active", avatar: "SB", role: "Marketing Analyst", targetRole: "Growth Lead", location: "Boston, MA", experience: "4 years", lastActivity: "2026-03-26T13:20:00", agent: "ResumeBot", resumeScore: 73, applications: 12, interviews: 2, offers: 0, joinDate: "2026-02-20", notes: "SQL and Python proficient. Targeting tech growth roles." },
    { id: 9, name: "Tomás Garcia", email: "tomas.g@email.com", phone: "(512) 555-0909", status: "active", avatar: "TG", role: "Backend Engineer", targetRole: "Staff Engineer", location: "Austin, TX", experience: "9 years", lastActivity: "2026-03-27T07:45:00", agent: "OutreachBot", resumeScore: 86, applications: 9, interviews: 3, offers: 1, joinDate: "2026-02-10", notes: "Golang/Rust expert. Multiple offers expected this week." },
    { id: 10, name: "Rachel Nguyen", email: "rachel.n@email.com", phone: "(503) 555-1010", status: "inactive", avatar: "RN", role: "QA Engineer", targetRole: "SDET", location: "Portland, OR", experience: "5 years", lastActivity: "2026-03-10T09:00:00", agent: "MatchBot", resumeScore: 68, applications: 3, interviews: 0, offers: 0, joinDate: "2026-03-05", notes: "Just started. Needs resume overhaul." },
    { id: 11, name: "Marcus Johnson", email: "marcus.j@email.com", phone: "(404) 555-1111", status: "active", avatar: "MJ", role: "Solutions Architect", targetRole: "Principal Architect", location: "Atlanta, GA", experience: "10 years", lastActivity: "2026-03-26T15:30:00", agent: "ResumeBot", resumeScore: 90, applications: 7, interviews: 3, offers: 1, joinDate: "2026-01-15", notes: "Cloud architecture expert. Interviewing at major cloud providers." },
    { id: 12, name: "Aisha Williams", email: "aisha.w@email.com", phone: "(202) 555-1212", status: "active", avatar: "AW", role: "Technical Writer", targetRole: "Content Strategist", location: "Washington, DC", experience: "6 years", lastActivity: "2026-03-27T10:00:00", agent: "MatchBot", resumeScore: 79, applications: 11, interviews: 2, offers: 0, joinDate: "2026-02-25", notes: "Published author. Interested in developer relations roles." }
];

const PIPELINE_JOBS = [
    { id: 1, clientId: 1, company: "Stripe", role: "Senior SWE", stage: "interview", salary: "$220K", appliedDate: "2026-03-15", lastUpdate: "2026-03-26" },
    { id: 2, clientId: 1, company: "Airbnb", role: "Staff Engineer", stage: "screening", salary: "$250K", appliedDate: "2026-03-20", lastUpdate: "2026-03-25" },
    { id: 3, clientId: 2, company: "Robinhood", role: "Senior PM", stage: "offer", salary: "$195K", appliedDate: "2026-02-28", lastUpdate: "2026-03-27" },
    { id: 4, clientId: 2, company: "Plaid", role: "Group PM", stage: "interview", salary: "$210K", appliedDate: "2026-03-10", lastUpdate: "2026-03-24" },
    { id: 5, clientId: 3, company: "OpenAI", role: "ML Engineer", stage: "applied", salary: "$280K", appliedDate: "2026-03-25", lastUpdate: "2026-03-25" },
    { id: 6, clientId: 3, company: "Anthropic", role: "Research Engineer", stage: "applied", salary: "$270K", appliedDate: "2026-03-26", lastUpdate: "2026-03-26" },
    { id: 7, clientId: 4, company: "Figma", role: "Design Lead", stage: "interview", salary: "$200K", appliedDate: "2026-03-05", lastUpdate: "2026-03-26" },
    { id: 8, clientId: 4, company: "Notion", role: "Senior Designer", stage: "offer", salary: "$185K", appliedDate: "2026-02-20", lastUpdate: "2026-03-27" },
    { id: 9, clientId: 5, company: "Datadog", role: "Platform Engineer", stage: "screening", salary: "$200K", appliedDate: "2026-03-18", lastUpdate: "2026-03-22" },
    { id: 10, clientId: 6, company: "Vercel", role: "Full Stack Eng", stage: "applied", salary: "$160K", appliedDate: "2026-03-24", lastUpdate: "2026-03-24" },
    { id: 11, clientId: 6, company: "Supabase", role: "Frontend Eng", stage: "applied", salary: "$150K", appliedDate: "2026-03-26", lastUpdate: "2026-03-26" },
    { id: 12, clientId: 7, company: "ScaleAI", role: "VP Engineering", stage: "placed", salary: "$350K", appliedDate: "2026-01-15", lastUpdate: "2026-03-15" },
    { id: 13, clientId: 8, company: "HubSpot", role: "Growth Lead", stage: "screening", salary: "$145K", appliedDate: "2026-03-22", lastUpdate: "2026-03-25" },
    { id: 14, clientId: 9, company: "Cloudflare", role: "Staff Engineer", stage: "interview", salary: "$240K", appliedDate: "2026-03-08", lastUpdate: "2026-03-26" },
    { id: 15, clientId: 9, company: "Fly.io", role: "Senior Engineer", stage: "offer", salary: "$210K", appliedDate: "2026-02-25", lastUpdate: "2026-03-27" },
    { id: 16, clientId: 11, company: "AWS", role: "Principal Architect", stage: "interview", salary: "$300K", appliedDate: "2026-03-01", lastUpdate: "2026-03-25" },
    { id: 17, clientId: 11, company: "Google Cloud", role: "Staff Architect", stage: "screening", salary: "$290K", appliedDate: "2026-03-15", lastUpdate: "2026-03-24" },
    { id: 18, clientId: 12, company: "GitLab", role: "Content Strategist", stage: "applied", salary: "$130K", appliedDate: "2026-03-25", lastUpdate: "2026-03-25" },
    { id: 19, clientId: 1, company: "Meta", role: "Senior SWE", stage: "applied", salary: "$235K", appliedDate: "2026-03-27", lastUpdate: "2026-03-27" },
    { id: 20, clientId: 2, company: "Square", role: "PM Lead", stage: "screening", salary: "$205K", appliedDate: "2026-03-20", lastUpdate: "2026-03-26" }
];

const ACTIVITY_FEED = [
    { id: 1, type: "match", icon: "link", message: "AI matched Alex Rivera with Senior SWE role at Meta", time: "2026-03-27T11:30:00", clientId: 1 },
    { id: 2, type: "email", icon: "mail", message: "OutreachBot sent introduction email to Anthropic recruiter for James Okonkwo", time: "2026-03-27T11:15:00", clientId: 3 },
    { id: 3, type: "interview", icon: "calendar", message: "Interview scheduled: Maya Patel at Plaid (Round 2) - March 28", time: "2026-03-27T10:45:00", clientId: 2 },
    { id: 4, type: "offer", icon: "star", message: "Offer received! Maya Patel - Senior PM at Robinhood ($195K)", time: "2026-03-27T10:30:00", clientId: 2 },
    { id: 5, type: "resume", icon: "file", message: "ResumeBot optimized resume for Aisha Williams (score: 68 -> 79)", time: "2026-03-27T10:00:00", clientId: 12 },
    { id: 6, type: "match", icon: "link", message: "AI matched Priya Sharma with Frontend Eng role at Supabase", time: "2026-03-27T09:30:00", clientId: 6 },
    { id: 7, type: "application", icon: "send", message: "Application submitted: Alex Rivera -> Stripe (Senior SWE)", time: "2026-03-27T09:00:00", clientId: 1 },
    { id: 8, type: "email", icon: "mail", message: "Follow-up email sent to Cloudflare for Tomas Garcia interview feedback", time: "2026-03-27T08:30:00", clientId: 9 },
    { id: 9, type: "interview", icon: "calendar", message: "Interview completed: Emily Zhang at Figma (Final Round)", time: "2026-03-26T17:00:00", clientId: 4 },
    { id: 10, type: "resume", icon: "file", message: "ResumeBot updated keywords for Marcus Johnson (cloud architecture focus)", time: "2026-03-26T16:00:00", clientId: 11 },
    { id: 11, type: "match", icon: "link", message: "AI matched Samantha Brooks with Growth Lead role at HubSpot", time: "2026-03-26T15:00:00", clientId: 8 },
    { id: 12, type: "offer", icon: "star", message: "Offer received! Tomas Garcia - Senior Engineer at Fly.io ($210K)", time: "2026-03-26T14:00:00", clientId: 9 },
    { id: 13, type: "application", icon: "send", message: "Application submitted: James Okonkwo -> OpenAI (ML Engineer)", time: "2026-03-26T13:00:00", clientId: 3 },
    { id: 14, type: "email", icon: "mail", message: "Networking introduction sent for Emily Zhang to Notion design team", time: "2026-03-26T12:00:00", clientId: 4 },
    { id: 15, type: "interview", icon: "calendar", message: "Mock interview session completed for Priya Sharma", time: "2026-03-26T11:00:00", clientId: 6 }
];

const NOTIFICATIONS = [
    { id: 1, title: "New Offer", message: "Maya Patel received offer from Robinhood", time: "10 min ago", read: false, type: "success" },
    { id: 2, title: "Interview Tomorrow", message: "Maya Patel has Plaid Round 2 at 2:00 PM", time: "25 min ago", read: false, type: "warning" },
    { id: 3, title: "New Match", message: "3 new job matches found for Alex Rivera", time: "1 hr ago", read: false, type: "info" },
    { id: 4, title: "Resume Updated", message: "Aisha Williams' resume score improved to 79", time: "2 hrs ago", read: false, type: "info" },
    { id: 5, title: "Client Inactive", message: "Rachel Nguyen hasn't logged in for 17 days", time: "3 hrs ago", read: false, type: "warning" },
    { id: 6, title: "Placement!", message: "David Kim accepted VP Engineering at ScaleAI", time: "1 day ago", read: true, type: "success" },
    { id: 7, title: "Application Sent", message: "Auto-applied James Okonkwo to Anthropic", time: "1 day ago", read: true, type: "info" }
];

const ANALYTICS_DATA = {
    placementsOverTime: {
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        data: [1, 2, 1, 3, 2, 4]
    },
    applicationsBySource: {
        labels: ["AI Match", "Manual", "Referral", "Job Board", "Direct"],
        data: [45, 20, 15, 12, 8]
    },
    pipelineDistribution: {
        labels: ["Applied", "Screening", "Interview", "Offer", "Placed"],
        data: [6, 4, 5, 3, 1],
        colors: ["#94a3b8", "#60a5fa", "#a78bfa", "#34d399", "#6366f1"]
    }
};
