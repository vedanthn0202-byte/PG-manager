import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, BedDouble, Bell,
  Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardList, CreditCard, Download, Home, LayoutDashboard,
  Menu, MoreHorizontal, Plus, Search, Settings2, SlidersHorizontal,
  Sparkles, Users, Wallet, X,
} from 'lucide-react'

type Property = { name: string; area: string; occupied: number; beds: number; revenue: number; accent: string }
type ViewName = 'Overview' | 'Properties' | 'Rooms & beds' | 'Tenants' | 'Rent & invoices' | 'Payments' | 'Expenses' | 'Reports'

const initialProperties: Property[] = [
  { name: 'Indiranagar House', area: 'Indiranagar, Bengaluru', occupied: 28, beds: 32, revenue: 182000, accent: 'sage' },
  { name: 'The Cedar Stay', area: 'Koramangala, Bengaluru', occupied: 21, beds: 24, revenue: 147000, accent: 'peach' },
  { name: 'Northside Living', area: 'HSR Layout, Bengaluru', occupied: 16, beds: 20, revenue: 104000, accent: 'lavender' },
]

const navSections = [
  { title: 'WORKSPACE', items: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Properties', icon: Building2 },
    { label: 'Rooms & beds', icon: BedDouble }, { label: 'Tenants', icon: Users },
  ] },
  { title: 'MONEY', items: [
    { label: 'Rent & invoices', icon: ClipboardList }, { label: 'Payments', icon: CreditCard },
    { label: 'Expenses', icon: Wallet }, { label: 'Reports', icon: Activity },
  ] },
]

const tenants = [
  { name: 'Ananya Sharma', initials: 'AS', room: 'Room 204 · Bed A', property: 'Indiranagar House', due: 'Today', amount: '₹8,500', status: 'Due today', color: 'rose' },
  { name: 'Rahul Nair', initials: 'RN', room: 'Room 103 · Bed B', property: 'The Cedar Stay', due: '12 Nov', amount: '₹7,000', status: 'Overdue', color: 'amber' },
  { name: 'Meera Iyer', initials: 'MI', room: 'Room 305 · Bed C', property: 'Northside Living', due: '15 Nov', amount: '₹6,500', status: 'Upcoming', color: 'blue' },
  { name: 'Arjun Reddy', initials: 'AR', room: 'Room 101 · Bed A', property: 'Indiranagar House', due: '18 Nov', amount: '₹8,500', status: 'Upcoming', color: 'green' },
]

const chartBars = [
  { month: 'Jun', income: 58, expense: 25 }, { month: 'Jul', income: 72, expense: 32 },
  { month: 'Aug', income: 64, expense: 28 }, { month: 'Sep', income: 83, expense: 37 },
  { month: 'Oct', income: 76, expense: 31 }, { month: 'Nov', income: 94, expense: 39 },
]

function money(value: number) { return `₹${new Intl.NumberFormat('en-IN').format(value)}` }

export default function App() {
  const [active, setActive] = useState<ViewName>('Overview')
  const [properties, setProperties] = useState(initialProperties)
  const [modal, setModal] = useState(false)
  const [propertyName, setPropertyName] = useState('')
  const [propertyArea, setPropertyArea] = useState('')
  const [search, setSearch] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const totalBeds = properties.reduce((sum, property) => sum + property.beds, 0)
  const occupiedBeds = properties.reduce((sum, property) => sum + property.occupied, 0)
  const filteredTenants = useMemo(() => tenants.filter((tenant) => `${tenant.name} ${tenant.property}`.toLowerCase().includes(search.toLowerCase())), [search])

  function addProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProperties([...properties, { name: propertyName, area: propertyArea, occupied: 0, beds: 0, revenue: 0, accent: 'blue' }])
    setPropertyName(''); setPropertyArea(''); setModal(false); setActive('Properties')
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Home size={17} strokeWidth={2.3} /></div><span>pg<span className="brand-light">connect</span></span></div>
      <button className="workspace-switch"><span className="workspace-avatar">S</span><span className="workspace-copy"><b>Sharma Stays</b><small>Owner workspace</small></span><ChevronDown size={15} /></button>
      {navSections.map((section) => <div className="nav-section" key={section.title}><div className="section-label">{section.title}</div>{section.items.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label as ViewName); setMobileNav(false) }} className={`nav-item ${active === label ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Payments' && <span className="nav-count">3</span>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={16} /></div><b>Getting started</b><p>Your workspace is looking good. Keep building your PG.</p><div className="progress-track"><i /></div><small>3 of 5 steps complete</small><button className="help-link">View checklist <ArrowRight size={13} /></button></div><button className="nav-item"><CircleHelp size={18} /><span>Help & support</span></button><button className="nav-item"><Settings2 size={18} /><span>Settings</span></button><div className="profile-row"><div className="profile-avatar">VS</div><div className="profile-copy"><b>Vedanth Sharma</b><small>Owner</small></div><MoreHorizontal size={19} /></div></div>
    </aside>

    {mobileNav && <button aria-label="Close navigation" className="mobile-scrim" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="crumb">Workspace <ChevronRight size={14} /> <span>{active}</span></div></div><div className="topbar-actions"><div className="date-pill"><CalendarDays size={15} /><span>November 2026</span><ChevronDown size={14} /></div><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="topbar-avatar">VS</div></div></header>
      <div className="page-content">
        {active === 'Overview' ? <>
          <section className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> MONDAY, 9 NOVEMBER 2026</div><h1>Good morning, Vedanth <span className="wave">✳</span></h1><p className="welcome-subtitle">Here’s what’s happening across your properties today.</p></div><button className="button-primary" onClick={() => setModal(true)}><Plus size={17} /> Add property</button></section>
          <section className="stat-grid">
            <StatCard title="Monthly collections" value="₹4,33,000" delta="12.8%" note="vs. last month" icon={<Wallet size={18} />} tint="mint" trend="up" />
            <StatCard title="Occupancy rate" value={`${totalBeds ? Math.round(occupiedBeds / totalBeds * 100) : 0}%`} delta="4.2%" note="vs. last month" icon={<BedDouble size={18} />} tint="blue-tint" trend="up" extra={<div className="mini-progress"><i style={{ width: `${totalBeds ? occupiedBeds / totalBeds * 100 : 0}%` }} /></div>} />
            <StatCard title="Rent to collect" value="₹62,500" delta="8 tenants" note="need your attention" icon={<ArrowDownLeft size={18} />} tint="peach-tint" trend="neutral" />
            <StatCard title="Total tenants" value={String(occupiedBeds)} delta="6 new" note="this month" icon={<Users size={18} />} tint="lilac-tint" trend="up" />
          </section>
          <section className="content-grid">
            <div className="panel chart-panel"><div className="panel-heading"><div><div className="panel-kicker">YOUR BUSINESS</div><h2>Income overview</h2></div><button className="select-button">Last 6 months <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-income" /> Income</span><span><i className="legend-expense" /> Expenses</span><strong>₹4.33L <small>collected this month</small></strong></div><div className="chart-wrap"><div className="chart-y"><span>₹5L</span><span>₹4L</span><span>₹3L</span><span>₹2L</span><span>₹1L</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><div className="bars">{chartBars.map((bar) => <div className="bar-group" key={bar.month}><div className="bar-pair"><i className="income-bar" style={{ height: `${bar.income}%` }} /><i className="expense-bar" style={{ height: `${bar.expense}%` }} /></div><small>{bar.month}</small></div>)}</div></div></div><div className="chart-footnote"><span className="chart-foot-icon"><ArrowUpRight size={14} /></span> You collected <b>12.8% more</b> than last month. Nice work!</div></div>
            <div className="panel attention-panel"><div className="panel-heading"><div><div className="panel-kicker">NEEDS ATTENTION</div><h2>Rent collection</h2></div><button className="more-button" aria-label="More options"><MoreHorizontal size={20} /></button></div><div className="collection-summary"><div className="collection-total">₹62,500 <span>pending</span></div><div className="collection-sub">Across 8 tenants this month</div><div className="collection-track"><i /></div><div className="collection-meta"><span>₹4,33,000 collected</span><b>87%</b></div></div><div className="attention-list"><div className="attention-item"><div className="attention-avatar avatar-rose">AS</div><div className="attention-person"><b>Ananya Sharma</b><small>Indiranagar House · Room 204</small></div><div className="attention-amount"><b>₹8,500</b><small className="status-due">Due today</small></div></div><div className="attention-item"><div className="attention-avatar avatar-amber">RN</div><div className="attention-person"><b>Rahul Nair</b><small>The Cedar Stay · Room 103</small></div><div className="attention-amount"><b>₹7,000</b><small className="status-late">2 days late</small></div></div></div><button className="text-action" onClick={() => setActive('Rent & invoices')}>View all 8 pending payments <ArrowRight size={14} /></button></div>
          </section>
          <section className="panel properties-panel"><div className="panel-heading"><div><div className="panel-kicker">YOUR PORTFOLIO <span className="count-chip">{properties.length}</span></div><h2>Properties</h2></div><div className="heading-actions"><button className="outline-button" onClick={() => setActive('Properties')}>View all properties <ArrowRight size={14} /></button><button className="square-button" aria-label="Add property" onClick={() => setModal(true)}><Plus size={17} /></button></div></div><div className="property-cards">{properties.slice(0, 3).map((property, index) => <PropertyCard key={`${property.name}-${index}`} property={property} />)}</div></section>
          <section className="panel tenants-panel"><div className="panel-heading"><div><div className="panel-kicker">RECENT ACTIVITY</div><h2>Rent due soon</h2></div><div className="heading-actions"><label className="search-box"><Search size={15} /><input placeholder="Search tenants" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button className="outline-button" onClick={() => setActive('Tenants')}>All tenants <ArrowRight size={14} /></button></div></div><div className="table-scroll"><table><thead><tr><th>TENANT</th><th>PROPERTY</th><th>DUE DATE</th><th>AMOUNT</th><th>STATUS</th><th /></tr></thead><tbody>{filteredTenants.map((tenant) => <tr key={tenant.name}><td><div className="tenant-name"><span className={`tenant-avatar ${tenant.color}`}>{tenant.initials}</span><span><b>{tenant.name}</b><small>{tenant.room}</small></span></div></td><td>{tenant.property}</td><td>{tenant.due}</td><td className="amount-cell">{tenant.amount}</td><td><span className={`status-pill ${tenant.status === 'Overdue' ? 'overdue' : tenant.status === 'Due today' ? 'due' : 'upcoming'}`}><i />{tenant.status}</span></td><td><button className="row-menu" aria-label={`More options for ${tenant.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{filteredTenants.length === 0 && <div className="empty-search">No tenants match “{search}”.</div>}</div><div className="table-footer"><span>Showing <b>{filteredTenants.length}</b> of <b>{tenants.length}</b> tenants</span><button className="text-action" onClick={() => setActive('Tenants')}>View all tenants <ArrowRight size={14} /></button></div></section>
          <footer className="footer"><span>© 2026 PG Connect</span><span>Made for the people who make a place feel like home <span className="footer-heart">♥</span></span><button>Privacy & terms</button></footer>
        </> : <OtherView active={active} properties={properties} onAdd={() => setModal(true)} />}
      </div>
    </main>
    {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(false) }}><form className="modal-card" onSubmit={addProperty}><div className="modal-title-row"><div className="modal-symbol"><Building2 size={19} /></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setModal(false)}><X size={18} /></button></div><h2>Add a property</h2><p>Start by adding one of your PG locations. You can set up its rooms and beds next.</p><label>Property name<input required autoFocus value={propertyName} onChange={(event) => setPropertyName(event.target.value)} placeholder="e.g. Indiranagar House" /></label><label>Area or locality<input required value={propertyArea} onChange={(event) => setPropertyArea(event.target.value)} placeholder="e.g. Indiranagar, Bengaluru" /></label><div className="modal-actions"><button className="outline-button" type="button" onClick={() => setModal(false)}>Cancel</button><button className="button-primary" type="submit"><Plus size={16} /> Add property</button></div></form></div>}
  </div>
}

function StatCard({ title, value, delta, note, icon, tint, trend, extra }: { title: string; value: string; delta: string; note: string; icon: React.ReactNode; tint: string; trend: 'up' | 'neutral'; extra?: React.ReactNode }) {
  return <div className="stat-card"><div className="stat-top"><span className={`stat-icon ${tint}`}>{icon}</span><button className="more-button" aria-label={`${title} details`}><MoreHorizontal size={18} /></button></div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-bottom"><span className={trend === 'up' ? 'trend-up' : 'trend-neutral'}>{trend === 'up' && <ArrowUpRight size={13} />}{delta}</span><span>{note}</span></div>{extra}</div>
}

function PropertyCard({ property }: { property: Property }) {
  const occupancy = property.beds ? Math.round(property.occupied / property.beds * 100) : 0
  return <div className="property-card"><div className={`property-art ${property.accent}`}><div className="art-sun" /><div className="art-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="art-ground" /></div><div className="property-card-body"><div className="property-title-row"><div><h3>{property.name}</h3><p><span className="map-pin">⌖</span>{property.area}</p></div><button className="more-button" aria-label={`More options for ${property.name}`}><MoreHorizontal size={19} /></button></div><div className="property-metrics"><div><small>OCCUPANCY</small><b>{occupancy}% <span>· {property.occupied}/{property.beds} beds</span></b><div className="property-progress"><i style={{ width: `${occupancy}%` }} /></div></div><div><small>COLLECTED THIS MONTH</small><b>{money(property.revenue)}</b></div></div></div></div>
}

function OtherView({ active, properties, onAdd }: { active: ViewName; properties: Property[]; onAdd: () => void }) {
  const copy: Record<ViewName, string> = { Overview: '', Properties: 'All your PG locations, at a glance.', 'Rooms & beds': 'Manage rooms, bed availability, and occupancy.', Tenants: 'Keep tenant profiles and stays organized.', 'Rent & invoices': 'Track what’s due and what’s been collected.', Payments: 'Review recent and pending transactions.', Expenses: 'Keep property operating costs in one place.', Reports: 'Understand your occupancy and business performance.' }
  return <><section className="welcome-row subpage-welcome"><div><div className="eyebrow"><span className="live-dot" /> OWNER WORKSPACE</div><h1>{active}</h1><p className="welcome-subtitle">{copy[active]}</p></div><button className="button-primary" onClick={active === 'Properties' ? onAdd : undefined}><Plus size={17} /> {active === 'Properties' ? 'Add property' : 'Coming soon'}</button></section><div className="panel subpage-panel"><div className="panel-heading"><div><div className="panel-kicker">{active.toUpperCase()}</div><h2>{active === 'Properties' ? `${properties.length} properties` : 'Your workspace'}</h2></div><button className="select-button"><SlidersHorizontal size={14} /> Filter</button></div>{active === 'Properties' ? <div className="property-cards">{properties.map((property, index) => <PropertyCard key={`${property.name}-${index}`} property={property} />)}<button className="add-property-tile" onClick={onAdd}><span><Plus size={20} /></span><b>Add another property</b><small>Bring your PG operations into one place</small></button></div> : <div className="coming-soon"><div className="coming-icon"><Sparkles size={21} /></div><h3>This part of your workspace is on its way</h3><p>We’re building {active.toLowerCase()} tools around how PG owners work. Your property information is ready to connect here.</p><button className="outline-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to overview <ArrowRight size={14} /></button></div>}</div><div className="footer"><span>© 2026 PG Connect</span><span>Built for better-managed stays <span className="footer-heart">♥</span></span><button>Privacy & terms</button></div></>
}
