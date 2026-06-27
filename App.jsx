import { useState, useEffect, useContext, createContext, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// ─── THEME & CONSTANTS ───────────────────────────────────────────────────────
const COLORS = {
  primary: "#1E3A5F",
  accent: "#2DD4BF",
  accentDark: "#0D9488",
  bg: "#F0F4F8",
  card: "#FFFFFF",
  sidebar: "#1E3A5F",
  sidebarHover: "#2A4F7C",
  text: "#1A202C",
  muted: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
};

const STAGES = ["Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost"];
const INVOICE_STATUSES = ["Unpaid", "Partial", "Paid", "Overdue"];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  user: { name: "Kavi Raj", role: "Admin", company: "DemoTech Pvt Ltd", email: "kavi@demotech.in" },
  leads: [
    { id: 1, title: "ERP Integration", customer: "Infosys Ltd", contact: "Ravi Kumar", source: "Referral", status: "New", assignedTo: "Kavi Raj", created: "2026-06-01" },
    { id: 2, title: "Cloud Migration", customer: "TCS", contact: "Priya S", source: "Website", status: "Contacted", assignedTo: "Meena R", created: "2026-06-05" },
    { id: 3, title: "BI Dashboard", customer: "Wipro", contact: "Arun M", source: "Cold Call", status: "Qualified", assignedTo: "Kavi Raj", created: "2026-06-10" },
    { id: 4, title: "Data Warehouse Setup", customer: "HCL", contact: "Sunita P", source: "Email", status: "Lost", assignedTo: "Raj K", created: "2026-06-12" },
  ],
  deals: [
    { id: 1, title: "ERP Integration", customer: "Infosys Ltd", stage: "Qualified", value: 250000, closeDate: "2026-07-30", assignedTo: "Kavi Raj" },
    { id: 2, title: "Cloud Migration", customer: "TCS", stage: "Proposal", value: 480000, closeDate: "2026-08-15", assignedTo: "Meena R" },
    { id: 3, title: "BI Dashboard", customer: "Wipro", stage: "Negotiation", value: 175000, closeDate: "2026-07-20", assignedTo: "Kavi Raj" },
    { id: 4, title: "CRM Setup", customer: "Tech Mahindra", stage: "Closed Won", value: 320000, closeDate: "2026-06-15", assignedTo: "Raj K" },
    { id: 5, title: "Legacy System", customer: "Cognizant", stage: "Closed Lost", value: 90000, closeDate: "2026-06-10", assignedTo: "Meena R" },
    { id: 6, title: "Mobile App Dev", customer: "Mindtree", stage: "Proposal", value: 210000, closeDate: "2026-08-01", assignedTo: "Kavi Raj" },
  ],
  customers: [
    { id: 1, name: "Infosys Ltd", industry: "IT Services", website: "infosys.com", contacts: 3 },
    { id: 2, name: "TCS", industry: "IT Services", website: "tcs.com", contacts: 5 },
    { id: 3, name: "Wipro", industry: "IT Services", website: "wipro.com", contacts: 2 },
    { id: 4, name: "HCL Technologies", industry: "IT Services", website: "hcltech.com", contacts: 4 },
    { id: 5, name: "Tech Mahindra", industry: "Telecom", website: "techmahindra.com", contacts: 1 },
  ],
  products: [
    { id: 1, name: "ERP License", price: 50000, unit: "license", tax: 18, active: true },
    { id: 2, name: "Cloud Setup", price: 80000, unit: "project", tax: 18, active: true },
    { id: 3, name: "BI Dashboard", price: 35000, unit: "module", tax: 18, active: true },
    { id: 4, name: "Support (Annual)", price: 25000, unit: "year", tax: 18, active: true },
  ],
  quotations: [
    { id: 1, number: "QT-2026-001", customer: "Infosys Ltd", deal: "ERP Integration", status: "Sent", total: 295000, date: "2026-06-15", validUntil: "2026-07-15" },
    { id: 2, number: "QT-2026-002", customer: "TCS", deal: "Cloud Migration", status: "Draft", total: 560000, date: "2026-06-18", validUntil: "2026-07-18" },
    { id: 3, number: "QT-2026-003", customer: "Wipro", deal: "BI Dashboard", status: "Approved", total: 206500, date: "2026-06-20", validUntil: "2026-07-20" },
  ],
  invoices: [
    { id: 1, number: "INV-2026-001", customer: "Tech Mahindra", quote: "QT-2026-004", status: "Paid", total: 377600, paid: 377600, due: "2026-06-30" },
    { id: 2, number: "INV-2026-002", customer: "Infosys Ltd", quote: "QT-2026-001", status: "Unpaid", total: 295000, paid: 0, due: "2026-07-15" },
    { id: 3, number: "INV-2026-003", customer: "Wipro", quote: "QT-2026-003", status: "Partial", total: 206500, paid: 100000, due: "2026-07-25" },
  ],
  revenue: [
    { month: "Jan", revenue: 120000 }, { month: "Feb", revenue: 185000 },
    { month: "Mar", revenue: 230000 }, { month: "Apr", revenue: 190000 },
    { month: "May", revenue: 310000 }, { month: "Jun", revenue: 377600 },
  ],
  pipeline: [
    { stage: "Qualified", value: 250000, count: 1 },
    { stage: "Proposal", value: 690000, count: 2 },
    { stage: "Negotiation", value: 175000, count: 1 },
    { stage: "Closed Won", value: 320000, count: 1 },
  ],
};

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const badge = (status) => {
  const map = {
    New: "#3B82F6", Contacted: "#8B5CF6", Qualified: "#10B981", Lost: "#EF4444",
    Unpaid: "#EF4444", Partial: "#F59E0B", Paid: "#10B981", Overdue: "#DC2626",
    Draft: "#94A3B8", Sent: "#3B82F6", Approved: "#10B981", Rejected: "#EF4444",
    "Closed Won": "#10B981", "Closed Lost": "#EF4444", Proposal: "#8B5CF6",
    Negotiation: "#F59E0B",
  };
  return map[status] || "#64748B";
};

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Badge = ({ label }) => (
  <span style={{
    background: badge(label) + "20", color: badge(label),
    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    border: `1px solid ${badge(label)}40`
  }}>{label}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: COLORS.card, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", ...style }}>
    {children}
  </div>
);

const KPICard = ({ label, value, sub, color = COLORS.accent, icon }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{value}</div>
      <div style={{ fontSize: 13, color: COLORS.muted }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 2 }}>{sub}</div>}
    </div>
  </Card>
);

const Btn = ({ onClick, children, variant = "primary", style = {} }) => {
  const styles = {
    primary: { background: COLORS.accent, color: "#fff" },
    outline: { background: "transparent", color: COLORS.primary, border: `1.5px solid ${COLORS.primary}` },
    danger: { background: COLORS.danger, color: "#fff" },
    ghost: { background: "transparent", color: COLORS.muted },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant], padding: "8px 18px", borderRadius: 8, fontWeight: 600,
      fontSize: 13, cursor: "pointer", border: "none", transition: "opacity .15s", ...style
    }}
      onMouseEnter={e => e.target.style.opacity = "0.85"}
      onMouseLeave={e => e.target.style.opacity = "1"}
    >{children}</button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 5 }}>{label}</div>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "9px 13px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 5 }}>{label}</div>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", padding: "9px 13px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, background: "#fff" }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 480, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.text }}>{title}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.muted }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
          {headers.map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: COLORS.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, transition: "background .1s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {row.map((cell, j) => <td key={j} style={{ padding: "11px 14px", color: COLORS.text }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    {rows.length === 0 && <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No records found.</div>}
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("kavi@demotech.in");
  const [pass, setPass] = useState("password123");
  const [err, setErr] = useState("");

  const handle = () => {
    if (email === "kavi@demotech.in" && pass === "password123") onLogin();
    else setErr("Invalid credentials. Use kavi@demotech.in / password123");
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.primary} 0%, #2A4F7C 60%, ${COLORS.accentDark} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "44px 40px", width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.primary, letterSpacing: -1 }}>SalesFlow</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>B2B Sales Management Platform</div>
        </div>
        {err && <div style={{ background: "#FEE2E2", color: COLORS.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{err}</div>}
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Password" value={pass} onChange={setPass} type="password" />
        <Btn onClick={handle} style={{ width: "100%", padding: "11px", marginTop: 8, fontSize: 15 }}>Sign In</Btn>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: COLORS.muted }}>
          Demo: kavi@demotech.in / password123
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "leads", label: "Leads", icon: "🎯" },
  { id: "pipeline", label: "Pipeline", icon: "🔄" },
  { id: "customers", label: "Customers", icon: "🏢" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "quotations", label: "Quotations", icon: "📋" },
  { id: "invoices", label: "Invoices", icon: "🧾" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const Sidebar = ({ active, setActive, onLogout, open, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 99, display: "block"
        }} />
      )}
      <div style={{
        width: 220, minHeight: "100vh", background: COLORS.sidebar,
        display: "flex", flexDirection: "column",
        position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
      }}>
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>SalesFlow</div>
            <div style={{ fontSize: 11, color: COLORS.accent, marginTop: 2 }}>B2B Platform</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV.map(n => (
            <div key={n.id} onClick={() => { setActive(n.id); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "10px 12px",
                borderRadius: 9, marginBottom: 3, cursor: "pointer",
                background: active === n.id ? COLORS.accent : "transparent",
                color: active === n.id ? "#fff" : "rgba(255,255,255,0.7)",
                fontWeight: active === n.id ? 600 : 400, fontSize: 14, transition: "all .15s"
              }}
              onMouseEnter={e => { if (active !== n.id) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { if (active !== n.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{MOCK.user.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>{MOCK.user.role}</div>
          <Btn onClick={onLogout} variant="outline" style={{ width: "100%", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.25)", fontSize: 12, padding: "6px" }}>
            Sign Out
          </Btn>
        </div>
      </div>
    </>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const pipelineValue = MOCK.deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const invoicesDue = MOCK.invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + (i.total - i.paid), 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>Good morning, {MOCK.user.name.split(" ")[0]} 👋</div>
        <div style={{ fontSize: 14, color: COLORS.muted }}>{MOCK.user.company} · {new Date().toDateString()}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <KPICard label="Total Leads" value={MOCK.leads.length} sub="↑ 2 this week" icon="🎯" color={COLORS.info} />
        <KPICard label="Pipeline Value" value={fmt(pipelineValue)} sub="4 active deals" icon="🔄" color={COLORS.accent} />
        <KPICard label="Revenue (Jun)" value={fmt(377600)} sub="↑ 21% vs May" icon="💰" color={COLORS.success} />
        <KPICard label="Invoices Due" value={fmt(invoicesDue)} sub="2 pending" icon="🧾" color={COLORS.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: COLORS.text }}>Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => "₹" + (v / 1000) + "k"} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => fmt(v)} />
              <Line type="monotone" dataKey="revenue" stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: COLORS.text }}>Pipeline by Stage</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK.pipeline}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => "₹" + (v / 1000) + "k"} tick={{ fontSize: 10 }} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: COLORS.text }}>Recent Leads</div>
          {MOCK.leads.slice(0, 3).map(l => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{l.title}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{l.customer}</div>
              </div>
              <Badge label={l.status} />
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: COLORS.text }}>Invoice Status</div>
          {MOCK.invoices.map(inv => (
            <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.number}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{inv.customer}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{fmt(inv.total)}</div>
                <Badge label={inv.status} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── LEADS ────────────────────────────────────────────────────────────────────
const Leads = () => {
  const [leads, setLeads] = useState(MOCK.leads);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", customer: "", contact: "", source: "Website", status: "New", assignedTo: "" });

  const filtered = leads.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.customer.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    setLeads([...leads, { ...form, id: Date.now(), created: new Date().toISOString().split("T")[0] }]);
    setModal(false);
    setForm({ title: "", customer: "", contact: "", source: "Website", status: "New", assignedTo: "" });
  };

  const del = (id) => setLeads(leads.filter(l => l.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Leads</div>
        <Btn onClick={() => setModal(true)}>+ Add Lead</Btn>
      </div>
      <Card>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
          style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, width: 260, marginBottom: 16, outline: "none" }} />
        <Table
          headers={["Title", "Customer", "Contact", "Source", "Status", "Assigned To", "Date", "Action"]}
          rows={filtered.map(l => [
            <span style={{ fontWeight: 600 }}>{l.title}</span>,
            l.customer, l.contact, l.source,
            <Badge label={l.status} />,
            l.assignedTo, l.created,
            <Btn onClick={() => del(l.id)} variant="danger" style={{ padding: "4px 10px", fontSize: 12 }}>Delete</Btn>
          ])}
        />
      </Card>
      {modal && (
        <Modal title="Add New Lead" onClose={() => setModal(false)}>
          <Input label="Lead Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <Input label="Customer" value={form.customer} onChange={v => setForm({ ...form, customer: v })} />
          <Input label="Contact Person" value={form.contact} onChange={v => setForm({ ...form, contact: v })} />
          <Select label="Source" value={form.source} onChange={v => setForm({ ...form, source: v })} options={["Website", "Referral", "Cold Call", "Email", "Social", "Other"]} />
          <Select label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={LEAD_STATUSES} />
          <Input label="Assigned To" value={form.assignedTo} onChange={v => setForm({ ...form, assignedTo: v })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Lead</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PIPELINE (KANBAN) ────────────────────────────────────────────────────────
const Pipeline = () => {
  const [deals, setDeals] = useState(MOCK.deals);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", customer: "", stage: "Qualified", value: "", closeDate: "", assignedTo: "" });
  const [drag, setDrag] = useState(null);

  const save = () => {
    setDeals([...deals, { ...form, id: Date.now(), value: Number(form.value) }]);
    setModal(false);
    setForm({ title: "", customer: "", stage: "Qualified", value: "", closeDate: "", assignedTo: "" });
  };

  const onDrop = (stage) => {
    if (drag !== null) {
      setDeals(deals.map(d => d.id === drag ? { ...d, stage } : d));
      setDrag(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Sales Pipeline</div>
        <Btn onClick={() => setModal(true)}>+ Add Deal</Btn>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={stage}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(stage)}
              style={{ minWidth: 210, background: COLORS.bg, borderRadius: 12, padding: 14, border: `2px dashed ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{stage}</div>
                <Badge label={String(stageDeals.length)} />
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>{fmt(stageValue)}</div>
              {stageDeals.map(d => (
                <div key={d.id} draggable onDragStart={() => setDrag(d.id)}
                  style={{ background: "#fff", borderRadius: 9, padding: 12, marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", cursor: "grab", borderLeft: `3px solid ${badge(d.stage)}` }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{d.customer}</div>
                  <div style={{ fontWeight: 700, color: COLORS.primary, marginTop: 6, fontSize: 13 }}>{fmt(d.value)}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Close: {d.closeDate}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {modal && (
        <Modal title="Add New Deal" onClose={() => setModal(false)}>
          <Input label="Deal Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <Input label="Customer" value={form.customer} onChange={v => setForm({ ...form, customer: v })} />
          <Select label="Stage" value={form.stage} onChange={v => setForm({ ...form, stage: v })} options={STAGES} />
          <Input label="Deal Value (₹)" value={form.value} onChange={v => setForm({ ...form, value: v })} type="number" />
          <Input label="Expected Close Date" value={form.closeDate} onChange={v => setForm({ ...form, closeDate: v })} type="date" />
          <Input label="Assigned To" value={form.assignedTo} onChange={v => setForm({ ...form, assignedTo: v })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Deal</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
const Customers = () => {
  const [customers, setCustomers] = useState(MOCK.customers);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", website: "" });
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    setCustomers([...customers, { ...form, id: Date.now(), contacts: 0 }]);
    setModal(false);
    setForm({ name: "", industry: "", website: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Customers</div>
        <Btn onClick={() => setModal(true)}>+ Add Customer</Btn>
      </div>
      <Card>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, width: 260, marginBottom: 16, outline: "none" }} />
        <Table
          headers={["Company", "Industry", "Website", "Contacts"]}
          rows={filtered.map(c => [
            <span style={{ fontWeight: 600 }}>{c.name}</span>,
            c.industry,
            <a href={`https://${c.website}`} target="_blank" rel="noreferrer" style={{ color: COLORS.accent }}>{c.website}</a>,
            <span style={{ fontWeight: 600 }}>{c.contacts}</span>
          ])}
        />
      </Card>
      {modal && (
        <Modal title="Add Customer" onClose={() => setModal(false)}>
          <Input label="Company Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Industry" value={form.industry} onChange={v => setForm({ ...form, industry: v })} />
          <Input label="Website" value={form.website} onChange={v => setForm({ ...form, website: v })} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts] = useState(MOCK.products);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", unit: "unit", tax: 18, active: true });

  const save = () => {
    setProducts([...products, { ...form, id: Date.now(), price: Number(form.price), tax: Number(form.tax) }]);
    setModal(false);
    setForm({ name: "", price: "", unit: "unit", tax: 18, active: true });
  };

  const toggle = (id) => setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Products & Services</div>
        <Btn onClick={() => setModal(true)}>+ Add Product</Btn>
      </div>
      <Card>
        <Table
          headers={["Name", "Unit Price", "Unit", "Tax %", "Status", "Action"]}
          rows={products.map(p => [
            <span style={{ fontWeight: 600 }}>{p.name}</span>,
            fmt(p.price), p.unit, `${p.tax}%`,
            <Badge label={p.active ? "Active" : "Inactive"} />,
            <Btn onClick={() => toggle(p.id)} variant="ghost" style={{ fontSize: 12, padding: "4px 10px" }}>
              {p.active ? "Deactivate" : "Activate"}
            </Btn>
          ])}
        />
      </Card>
      {modal && (
        <Modal title="Add Product" onClose={() => setModal(false)}>
          <Input label="Product Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Unit Price (₹)" value={form.price} onChange={v => setForm({ ...form, price: v })} type="number" />
          <Input label="Unit" value={form.unit} onChange={v => setForm({ ...form, unit: v })} />
          <Input label="Tax Rate (%)" value={form.tax} onChange={v => setForm({ ...form, tax: v })} type="number" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Product</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── QUOTATIONS ───────────────────────────────────────────────────────────────
const Quotations = () => {
  const [quotes, setQuotes] = useState(MOCK.quotations);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customer: "", deal: "", validUntil: "", status: "Draft" });
  const [items, setItems] = useState([{ desc: "", qty: 1, price: 0, tax: 18 }]);

  const addItem = () => setItems([...items, { desc: "", qty: 1, price: 0, tax: 18 }]);
  const updateItem = (i, k, v) => setItems(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const subtotal = items.reduce((s, i) => s + (i.qty * i.price), 0);
  const taxAmt = items.reduce((s, i) => s + (i.qty * i.price * i.tax / 100), 0);
  const total = subtotal + taxAmt;

  const save = () => {
    setQuotes([...quotes, { ...form, id: Date.now(), number: `QT-2026-00${quotes.length + 1}`, total, date: new Date().toISOString().split("T")[0] }]);
    setModal(false);
    setItems([{ desc: "", qty: 1, price: 0, tax: 18 }]);
    setForm({ customer: "", deal: "", validUntil: "", status: "Draft" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Quotations</div>
        <Btn onClick={() => setModal(true)}>+ New Quote</Btn>
      </div>
      <Card>
        <Table
          headers={["Quote No.", "Customer", "Deal", "Status", "Total", "Date", "Valid Until"]}
          rows={quotes.map(q => [
            <span style={{ fontWeight: 600, color: COLORS.primary }}>{q.number}</span>,
            q.customer, q.deal,
            <Badge label={q.status} />,
            <span style={{ fontWeight: 700 }}>{fmt(q.total)}</span>,
            q.date, q.validUntil
          ])}
        />
      </Card>
      {modal && (
        <Modal title="New Quotation" onClose={() => setModal(false)}>
          <Input label="Customer" value={form.customer} onChange={v => setForm({ ...form, customer: v })} />
          <Input label="Deal Reference" value={form.deal} onChange={v => setForm({ ...form, deal: v })} />
          <Input label="Valid Until" value={form.validUntil} onChange={v => setForm({ ...form, validUntil: v })} type="date" />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Line Items</div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)}
                style={{ padding: "7px 10px", borderRadius: 7, border: `1.5px solid ${COLORS.border}`, fontSize: 13 }} />
              <input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))}
                style={{ padding: "7px 10px", borderRadius: 7, border: `1.5px solid ${COLORS.border}`, fontSize: 13 }} />
              <input type="number" placeholder="Price" value={item.price} onChange={e => updateItem(i, "price", Number(e.target.value))}
                style={{ padding: "7px 10px", borderRadius: 7, border: `1.5px solid ${COLORS.border}`, fontSize: 13 }} />
              <input type="number" placeholder="Tax%" value={item.tax} onChange={e => updateItem(i, "tax", Number(e.target.value))}
                style={{ padding: "7px 10px", borderRadius: 7, border: `1.5px solid ${COLORS.border}`, fontSize: 13 }} />
            </div>
          ))}
          <Btn variant="outline" onClick={addItem} style={{ fontSize: 12, marginBottom: 14 }}>+ Add Item</Btn>
          <div style={{ background: COLORS.bg, borderRadius: 9, padding: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
              <span>Tax</span><span>{fmt(taxAmt)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, marginTop: 8, borderTop: `1px solid ${COLORS.border}`, paddingTop: 8 }}>
              <span>Total</span><span>{fmt(total)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Quote</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── INVOICES ─────────────────────────────────────────────────────────────────
const Invoices = () => {
  const [invoices, setInvoices] = useState(MOCK.invoices);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customer: "", quote: "", total: "", due: "", status: "Unpaid" });

  const save = () => {
    const total = Number(form.total);
    setInvoices([...invoices, { ...form, id: Date.now(), number: `INV-2026-00${invoices.length + 1}`, total, paid: 0 }]);
    setModal(false);
    setForm({ customer: "", quote: "", total: "", due: "", status: "Unpaid" });
  };

  const markPaid = (id) => setInvoices(invoices.map(i => i.id === id ? { ...i, status: "Paid", paid: i.total } : i));

  const totalDue = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + (i.total - i.paid), 0);
  const totalCollected = invoices.reduce((s, i) => s + i.paid, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Invoices</div>
        <Btn onClick={() => setModal(true)}>+ New Invoice</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        <KPICard label="Total Collected" value={fmt(totalCollected)} icon="✅" color={COLORS.success} />
        <KPICard label="Amount Due" value={fmt(totalDue)} icon="⏳" color={COLORS.warning} />
        <KPICard label="Total Invoices" value={invoices.length} icon="🧾" color={COLORS.info} />
      </div>

      <Card>
        <Table
          headers={["Invoice No.", "Customer", "Quote Ref", "Status", "Total", "Paid", "Balance", "Due Date", "Action"]}
          rows={invoices.map(inv => [
            <span style={{ fontWeight: 600, color: COLORS.primary }}>{inv.number}</span>,
            inv.customer, inv.quote,
            <Badge label={inv.status} />,
            fmt(inv.total), fmt(inv.paid),
            <span style={{ color: inv.total - inv.paid > 0 ? COLORS.danger : COLORS.success, fontWeight: 700 }}>
              {fmt(inv.total - inv.paid)}
            </span>,
            inv.due,
            inv.status !== "Paid"
              ? <Btn onClick={() => markPaid(inv.id)} style={{ padding: "4px 10px", fontSize: 12 }}>Mark Paid</Btn>
              : <span style={{ color: COLORS.success, fontSize: 12 }}>✓ Paid</span>
          ])}
        />
      </Card>

      {modal && (
        <Modal title="New Invoice" onClose={() => setModal(false)}>
          <Input label="Customer" value={form.customer} onChange={v => setForm({ ...form, customer: v })} />
          <Input label="Quote Reference" value={form.quote} onChange={v => setForm({ ...form, quote: v })} />
          <Input label="Total Amount (₹)" value={form.total} onChange={v => setForm({ ...form, total: v })} type="number" />
          <Input label="Due Date" value={form.due} onChange={v => setForm({ ...form, due: v })} type="date" />
          <Select label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={INVOICE_STATUSES} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Create Invoice</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
const Settings = () => {
  const [company, setCompany] = useState({ name: MOCK.user.company, email: "contact@demotech.in", phone: "+91 98765 43210", address: "Coimbatore, Tamil Nadu" });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Settings</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Company Profile</div>
          <Input label="Company Name" value={company.name} onChange={v => setCompany({ ...company, name: v })} />
          <Input label="Email" value={company.email} onChange={v => setCompany({ ...company, email: v })} />
          <Input label="Phone" value={company.phone} onChange={v => setCompany({ ...company, phone: v })} />
          <Input label="Address" value={company.address} onChange={v => setCompany({ ...company, address: v })} />
          <Btn onClick={save}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </Btn>
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Current Plan</div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentDark})`, borderRadius: 10, padding: 20, color: "#fff", marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Current Plan</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Free</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Up to 5 users · 100 leads · Basic features</div>
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>Upgrade to Pro for unlimited records, PDF export, and priority support.</div>
          <Btn style={{ width: "100%" }}>Upgrade to Pro →</Btn>
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Team Members</div>
          {[
            { name: "Kavi Raj", role: "Admin", email: "kavi@demotech.in" },
            { name: "Meena R", role: "Sales Manager", email: "meena@demotech.in" },
            { name: "Raj K", role: "Sales Rep", email: "raj@demotech.in" },
          ].map((u, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{u.email}</div>
              </div>
              <Badge label={u.role} />
            </div>
          ))}
          <Btn variant="outline" style={{ marginTop: 12, width: "100%" }}>+ Invite Member</Btn>
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>My Profile</div>
          <Input label="Full Name" value={MOCK.user.name} onChange={() => {}} />
          <Input label="Email" value={MOCK.user.email} onChange={() => {}} />
          <Input label="New Password" value="" onChange={() => {}} type="password" placeholder="Leave blank to keep current" />
          <Btn>Update Profile</Btn>
        </Card>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const pages = { dashboard: Dashboard, leads: Leads, pipeline: Pipeline, customers: Customers, products: Products, quotations: Quotations, invoices: Invoices, settings: Settings };
  const PageComponent = pages[page] || Dashboard;
  const currentNav = NAV.find(n => n.id === page);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar
        active={page}
        setActive={setPage}
        onLogout={() => setLoggedIn(false)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#fff", borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", gap: 14,
        padding: "0 20px", height: 56,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <button onClick={() => setSidebarOpen(true)} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 22, color: COLORS.primary, lineHeight: 1, padding: 4
        }}>☰</button>
        <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>
          {currentNav?.icon} {currentNav?.label}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 13, color: COLORS.muted }}>{MOCK.user.company}</div>
      </div>
      <main style={{ padding: 20 }}>
        <PageComponent />
      </main>
    </div>
  );
}
