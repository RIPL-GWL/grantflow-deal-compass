export type Mentor = {
  slug: string; name: string; title: string; focus: string[]; regions: string[]; portrait: number;
  bio: string; years: string; guided: string; investments: string; countries: string; quote: string;
  expertise: { title: string; text: string }[];
  journey: { year: string; text: string }[];
};

const defaultJourney = (role: string) => [
  { year: "2009", text: "Began career in business strategy and consulting." },
  { year: "2013", text: `Worked with startups and SMEs on ${role.toLowerCase()}.` },
  { year: "2017", text: "Led advisory programmes and global partnerships." },
  { year: "2021", text: "Advised multiple startups on scaling and market expansion." },
  { year: "2026", text: "Joined the Rishishwar Industry Mentor Network to support founders." },
];

const m = (slug: string, name: string, title: string, focus: string[], regions: string[], portrait: number, expertise: Mentor["expertise"], quote: string): Mentor => ({
  slug, name, title, focus, regions, portrait, expertise, quote,
  bio: `${name} brings 15+ years of experience helping founders and businesses with ${focus.slice(0, 3).join(", ").toLowerCase()}. Working with early-stage startups and established companies across industries, ${name.split(" ")[0]} helps them scale, prepare for funding and enter new markets.`,
  years: "15+", guided: "120+", investments: "35+", countries: "8",
  journey: defaultJourney(focus[0] ?? "business growth"),
});

export const mentors: Mentor[] = [
  m("neha-kapoor", "Neha Kapoor", "Venture & Growth Mentor", ["Startup Strategy", "Product & Technology", "Go-to-Market"], ["India", "Singapore"], 1,
    [{ title: "Startup Strategy", text: "Shape a clear vision and a roadmap investors trust." }, { title: "Product & Technology", text: "Build products customers actually adopt." }, { title: "Go-to-Market", text: "Launch with the right channels and pricing." }, { title: "Founder Advisory", text: "One-on-one guidance at every stage." }],
    "Great startups are built by founders who listen to the market early."),
  m("rohan-mehta", "Rohan Mehta", "Manufacturing & Operations Mentor", ["Operations Excellence", "Process Improvement", "Supply Chain"], ["India", "UAE"], 2,
    [{ title: "Operations Excellence", text: "Run leaner, faster and more reliable operations." }, { title: "Process Improvement", text: "Remove waste and improve quality." }, { title: "Supply Chain", text: "Build resilient sourcing and logistics." }, { title: "Founder Advisory", text: "Practical help for growing factories." }],
    "Operations is where strategy becomes reality."),
  m("priya-singh", "Priya Singh", "Branding & Marketing Mentor", ["Brand Strategy", "Digital Marketing", "Market Positioning"], ["India", "Global"], 3,
    [{ title: "Brand Strategy", text: "Create a brand people remember and trust." }, { title: "Digital Marketing", text: "Grow reach with measurable campaigns." }, { title: "Market Positioning", text: "Stand apart in a crowded market." }, { title: "Founder Advisory", text: "Guidance on telling your story." }],
    "A strong brand is a promise kept, every single day."),
  m("vikram-rao", "Vikram Rao", "Global Expansion Mentor", ["International Markets", "Business Development", "Cross-border Partnerships"], ["Singapore", "Europe"], 5,
    [{ title: "International Markets", text: "Choose and enter the right countries." }, { title: "Business Development", text: "Open doors to new customers." }, { title: "Cross-border Partnerships", text: "Find distributors and partners abroad." }, { title: "Founder Advisory", text: "Support for first-time exporters." }],
    "Global growth starts with one well-chosen market."),
  m("amit-verma", "Amit Verma", "Strategy & Investment Mentor", ["Business Strategy", "Investment Readiness", "M&A and Partnerships"], ["India", "USA"], 0,
    [{ title: "Business Strategy", text: "Define vision, identify opportunities and build scalable strategy." }, { title: "Investment Readiness", text: "Prepare for investors with strong financials and positioning." }, { title: "Market Expansion", text: "Enter new markets with the right strategy and partnerships." }, { title: "Founder Advisory", text: "Personalised guidance for founders at every stage." }],
    "Clarity in strategy is often the difference between a good idea and a scalable business."),
  m("karan-malhotra", "Karan Malhotra", "Technology & Business Transformation Mentor", ["Digital Transformation", "AI & Automation", "Scalable Systems"], ["India", "Global"], 4,
    [{ title: "Digital Transformation", text: "Modernise how your business works." }, { title: "AI & Automation", text: "Use AI to save time and cost." }, { title: "Scalable Systems", text: "Technology that grows with you." }, { title: "Founder Advisory", text: "Clear tech decisions for non-tech founders." }],
    "Technology should simplify the business, not complicate it."),
];

export type TeamMember = {
  slug: string; employeeId: string; name: string; designation: string; department: string; team: string;
  location: string; portrait: number; reportingTo: string;
  responsibilities: string[]; skills: string[]; education: { degree: string; school: string }; languages: string[];
};

export const DEPARTMENTS = ["Management", "Sales & Marketing", "Operations", "Finance", "Technology", "Human Resources", "Business Support"];

const t = (slug: string, employeeId: string, name: string, designation: string, department: string, team: string, portrait: number, skills: string[], responsibilities: string[]): TeamMember => ({
  slug, employeeId, name, designation, department, team, portrait, skills, responsibilities,
  location: "Gwalior, Madhya Pradesh", reportingTo: `Head - ${department}`,
  education: { degree: "MBA", school: "University, India" }, languages: ["Hindi", "English"],
});

export const team: TeamMember[] = [
  t("rohit-sharma", "RI-EMP-1024", "Rohit Sharma", "Business Development Manager", "Sales & Marketing", "Business Development", 0,
    ["Business Development", "Client Management", "Strategic Planning", "Market Research", "Negotiation", "Relationship Building"],
    ["Identify and onboard new clients and partners", "Build and maintain strong client relationships", "Drive business growth and achieve sales targets", "Coordinate with internal teams for smooth execution"]),
  t("neha-gupta", "RI-EMP-1025", "Neha Gupta", "Marketing Executive", "Sales & Marketing", "Brand & Marketing", 1,
    ["Digital Marketing", "Content Planning", "Social Media", "Campaign Analysis"],
    ["Plan and run marketing campaigns", "Manage social media and brand content", "Track campaign performance and report results"]),
  t("amit-singh", "RI-EMP-1026", "Amit Singh", "Operations Executive", "Operations", "Operations", 2,
    ["Process Coordination", "Vendor Management", "Logistics", "Reporting"],
    ["Coordinate daily operations with partners", "Manage vendor and logistics schedules", "Maintain operations records and reports"]),
  t("priya-mehta", "RI-EMP-1027", "Priya Mehta", "HR Executive", "Human Resources", "People & Culture", 3,
    ["Recruitment", "Onboarding", "Employee Relations", "HR Policies"],
    ["Manage hiring and onboarding", "Support employee engagement", "Maintain HR policies and records"]),
  t("karan-verma", "RI-EMP-1028", "Karan Verma", "Software Developer", "Technology", "Technology", 4,
    ["Web Development", "Databases", "Automation", "Problem Solving"],
    ["Build and maintain company websites and tools", "Automate internal processes", "Support teams with technology"]),
  t("sneha-jain", "RI-EMP-1029", "Sneha Jain", "Finance Executive", "Finance", "Accounts & Finance", 5,
    ["Accounting", "Budgeting", "GST & Compliance", "Financial Reporting"],
    ["Manage accounts and payments", "Prepare financial reports", "Ensure tax and compliance filings"]),
];

export function filterTeam(query: string, department: string, list: TeamMember[] = team) {
  const q = query.trim().toLowerCase();
  return list.filter((p) => (!department || p.department === department) && (!q || [p.name, p.designation, p.department].join(" ").toLowerCase().includes(q)));
}
