import { useEffect, useState } from 'react'
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, BedDouble, Bell,
  Building2, CalendarDays, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, CreditCard, Home, LayoutDashboard,
  Menu, MoreHorizontal, Plus, Settings2, SlidersHorizontal,
  Sparkles, Users, Wallet, X,
} from 'lucide-react'

type Property = { id: number; name: string; area: string; occupied: number; beds: number; revenue: number; accent: string }
type Owner = { id: number; full_name: string; email: string }
type Room = { id: number; room_number: string; floor_number: number; room_type: string; capacity: number; beds: { id: number; label: string; monthly_rent: number | null; available: boolean }[] }
type Tenant = { id: number; full_name: string; phone: string; email: string | null; emergency_contact: string | null; current_stay: { id: number; property_name: string; room_number: string; bed_label: string; check_in: string; agreed_monthly_rent: number } | null }
type Summary = { property_count: number; room_count: number; bed_count: number; occupied_beds: number; tenant_count: number }
type ViewName = 'Overview' | 'Properties' | 'Rooms & beds' | 'Tenants' | 'Rent & invoices' | 'Payments' | 'Expenses' | 'Reports'
const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

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

const chartBars = [
  { month: 'Jun', income: 0, expense: 0 }, { month: 'Jul', income: 0, expense: 0 },
  { month: 'Aug', income: 0, expense: 0 }, { month: 'Sep', income: 0, expense: 0 },
  { month: 'Oct', income: 0, expense: 0 }, { month: 'Nov', income: 0, expense: 0 },
]

function money(value: number) { return `₹${new Intl.NumberFormat('en-IN').format(value)}` }
function localToday() { const date = new Date(); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 10) }

export default function App() {
  const [active, setActive] = useState<ViewName>('Overview')
  const [properties, setProperties] = useState<Property[]>([])
  const [owner, setOwner] = useState<Owner | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [rooms, setRooms] = useState<Room[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)
  const [resourceBusy, setResourceBusy] = useState(false)
  const [roomNumber, setRoomNumber] = useState('')
  const [floorNumber, setFloorNumber] = useState('0')
  const [bedLabels, setBedLabels] = useState('A, B')
  const [tenantName, setTenantName] = useState('')
  const [tenantPhone, setTenantPhone] = useState('')
  const [tenantEmail, setTenantEmail] = useState('')
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null)
  const [selectedBedId, setSelectedBedId] = useState<number | null>(null)
  const [agreedRent, setAgreedRent] = useState('')
  const [checkInDate, setCheckInDate] = useState(localToday())
  const [summary, setSummary] = useState<Summary>({ property_count: 0, room_count: 0, bed_count: 0, occupied_beds: 0, tenant_count: 0 })
  const [modal, setModal] = useState(false)
  const [propertyName, setPropertyName] = useState('')
  const [propertyArea, setPropertyArea] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const totalBeds = summary.bed_count
  const occupiedBeds = summary.occupied_beds

  useEffect(() => {
    fetch(`${apiBase}/api/auth/me`, { credentials: 'include' })
      .then(async (response) => response.ok ? response.json() as Promise<Owner> : null)
      .then(async (currentOwner) => {
        if (!currentOwner) return
        setOwner(currentOwner)
        const response = await fetch(`${apiBase}/api/properties`, { credentials: 'include' })
        if (response.ok) {
          const records = await response.json() as { id: number; name: string; locality: string; city: string; bed_count: number; occupied_beds: number }[]
          setProperties(records.map((record, index) => ({ id: record.id, name: record.name, area: `${record.locality}, ${record.city}`, occupied: record.occupied_beds, beds: record.bed_count, revenue: 0, accent: ['sage', 'peach', 'lavender'][index % 3] })))
        }
      })
      .catch(() => setAuthError('Could not reach PG Connect. Make sure the API is running and try again.'))
      .finally(() => setLoading(false))
  }, [])

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAuthBusy(true); setAuthError('')
    try {
      const response = await fetch(`${apiBase}/api/auth/${authMode}`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authMode === 'register' ? { full_name: fullName, email, password } : { email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail ?? 'Could not sign you in.')
      setOwner(data as Owner)
      const propertyResponse = await fetch(`${apiBase}/api/properties`, { credentials: 'include' })
      if (propertyResponse.ok) {
        const records = await propertyResponse.json() as { id: number; name: string; locality: string; city: string; bed_count: number; occupied_beds: number }[]
        setProperties(records.map((record, index) => ({ id: record.id, name: record.name, area: `${record.locality}, ${record.city}`, occupied: record.occupied_beds, beds: record.bed_count, revenue: 0, accent: ['sage', 'peach', 'lavender'][index % 3] })))
      }
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Could not sign you in.') }
    finally { setAuthBusy(false); setLoading(false) }
  }

  async function signOut() {
    await fetch(`${apiBase}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    setOwner(null); setProperties([]); setAuthMode('login'); setPassword('')
  }

  const activePropertyId = selectedPropertyId ?? properties[0]?.id ?? null
  useEffect(() => {
    if (!owner) return
    if (active === 'Overview') {
      fetch(`${apiBase}/api/dashboard`, { credentials: 'include' })
        .then(async (response) => { if (!response.ok) throw new Error('Could not load the dashboard.'); setSummary(await response.json() as Summary) })
        .catch((error) => setAuthError(error instanceof Error ? error.message : 'Could not load the dashboard.'))
      fetch(`${apiBase}/api/properties`, { credentials: 'include' })
        .then(async (response) => { if (!response.ok) throw new Error('Could not load properties.'); const records = await response.json() as { id: number; name: string; locality: string; city: string; bed_count: number; occupied_beds: number }[]; setProperties(records.map((record, index) => ({ id: record.id, name: record.name, area: `${record.locality}, ${record.city}`, occupied: record.occupied_beds, beds: record.bed_count, revenue: 0, accent: ['sage', 'peach', 'lavender'][index % 3] }))) })
        .catch((error) => setAuthError(error instanceof Error ? error.message : 'Could not load properties.'))
      fetch(`${apiBase}/api/tenants`, { credentials: 'include' })
        .then(async (response) => { if (!response.ok) throw new Error('Could not load tenants.'); setTenants(await response.json() as Tenant[]) })
        .catch((error) => setAuthError(error instanceof Error ? error.message : 'Could not load tenants.'))
    }
    if (active === 'Tenants') {
      fetch(`${apiBase}/api/tenants`, { credentials: 'include' })
        .then(async (response) => { if (!response.ok) throw new Error('Could not load tenants.'); setTenants(await response.json() as Tenant[]) })
        .catch((error) => setAuthError(error instanceof Error ? error.message : 'Could not load tenants.'))
    }
    if ((active === 'Rooms & beds' || active === 'Tenants') && activePropertyId !== null) {
      fetch(`${apiBase}/api/properties/${activePropertyId}/rooms`, { credentials: 'include' })
        .then(async (response) => { if (!response.ok) throw new Error('Could not load rooms.'); setRooms(await response.json() as Room[]) })
        .catch((error) => setAuthError(error instanceof Error ? error.message : 'Could not load rooms.'))
    }
  }, [active, activePropertyId, owner])

  async function addProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const response = await fetch(`${apiBase}/api/properties`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: propertyName, locality: propertyArea }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail ?? 'Could not add property.')
      setProperties([...properties, { id: data.id, name: data.name, area: `${data.locality}, ${data.city}`, occupied: 0, beds: 0, revenue: 0, accent: 'blue' }])
      setPropertyName(''); setPropertyArea(''); setModal(false); setActive('Properties'); setNotice('Property added successfully.'); window.setTimeout(() => setNotice(''), 3500)
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Could not add property.') }
  }

  async function addRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResourceBusy(true); setAuthError('')
    try {
      if (activePropertyId === null) throw new Error('Add a property before creating rooms.')
      const response = await fetch(`${apiBase}/api/properties/${activePropertyId}/rooms`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room_number: roomNumber, floor_number: Number(floorNumber), bed_labels: bedLabels.split(',').map((label) => label.trim()).filter(Boolean) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail ?? 'Could not add room.')
      setRooms([...rooms, data as Room]); setProperties(properties.map((property) => property.id === activePropertyId ? { ...property, beds: property.beds + data.beds.length } : property)); setRoomNumber(''); setModal(false); setNotice('Room and beds added successfully.'); window.setTimeout(() => setNotice(''), 3500)
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Could not add room.') }
    finally { setResourceBusy(false) }
  }

  async function addTenant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResourceBusy(true); setAuthError('')
    try {
      const response = await fetch(`${apiBase}/api/tenants`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: tenantName, phone: tenantPhone, email: tenantEmail || null }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail ?? 'Could not add tenant.')
      setTenants([...tenants, data as Tenant]); setSummary({ ...summary, tenant_count: summary.tenant_count + 1 }); setTenantName(''); setTenantPhone(''); setTenantEmail(''); setModal(false); setNotice('Tenant added successfully.'); window.setTimeout(() => setNotice(''), 3500)
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Could not add tenant.') }
    finally { setResourceBusy(false) }
  }

  async function checkInTenant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResourceBusy(true); setAuthError('')
    try {
      if (selectedTenantId === null || selectedBedId === null) throw new Error('Choose an available bed.')
      const response = await fetch(`${apiBase}/api/stays`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: selectedTenantId, bed_id: selectedBedId, check_in: checkInDate, agreed_monthly_rent: Number(agreedRent) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail ?? 'Could not check in tenant.')
      const tenantResponse = await fetch(`${apiBase}/api/tenants`, { credentials: 'include' })
      if (tenantResponse.ok) setTenants(await tenantResponse.json() as Tenant[])
      setSelectedTenantId(null); setSelectedBedId(null); setAgreedRent(''); setModal(false); setNotice('Tenant checked in successfully.'); window.setTimeout(() => setNotice(''), 3500)
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Could not check in tenant.') }
    finally { setResourceBusy(false) }
  }

  async function checkOutTenant(stayId: number) {
    setAuthError('')
    try {
      const response = await fetch(`${apiBase}/api/stays/${stayId}/checkout`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ check_out: localToday() }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail ?? 'Could not check out tenant.')
      const tenantResponse = await fetch(`${apiBase}/api/tenants`, { credentials: 'include' })
      if (tenantResponse.ok) setTenants(await tenantResponse.json() as Tenant[])
      setNotice('Tenant checked out successfully.'); window.setTimeout(() => setNotice(''), 3500)
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Could not check out tenant.') }
  }

  if (loading) return <div className="auth-screen"><div className="auth-card auth-loading"><div className="brand-mark"><Home size={17} /></div><span>Opening your workspace…</span></div></div>
  if (!owner) return <AuthScreen mode={authMode} setMode={setAuthMode} fullName={fullName} setFullName={setFullName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={authError} busy={authBusy} onSubmit={submitAuth} />

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Home size={17} strokeWidth={2.3} /></div><span>pg<span className="brand-light">connect</span></span></div>
      <button className="workspace-switch"><span className="workspace-avatar">{owner.full_name.slice(0, 1).toUpperCase()}</span><span className="workspace-copy"><b>{owner.full_name}’s PGs</b><small>Owner workspace</small></span><ChevronDown size={15} /></button>
      {navSections.map((section) => <div className="nav-section" key={section.title}><div className="section-label">{section.title}</div>{section.items.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label as ViewName); setMobileNav(false) }} className={`nav-item ${active === label ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Payments' && <span className="nav-count">3</span>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={16} /></div><b>Getting started</b><p>Add your property details to get your PG workspace started.</p><div className="progress-track"><i style={{ width: properties.length ? '35%' : '15%' }} /></div><small>{properties.length ? '2 of 5 steps complete' : '1 of 5 steps complete'}</small><button className="help-link" onClick={() => setActive('Properties')}>View checklist <ArrowRight size={13} /></button></div><button className="nav-item"><CircleHelp size={18} /><span>Help & support</span></button><button className="nav-item"><Settings2 size={18} /><span>Settings</span></button><button className="profile-row profile-button" onClick={signOut}><div className="profile-avatar">{owner.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="profile-copy"><b>{owner.full_name}</b><small>Sign out</small></div><MoreHorizontal size={19} /></button></div>
    </aside>

    {mobileNav && <button aria-label="Close navigation" className="mobile-scrim" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="crumb">Workspace <ChevronRight size={14} /> <span>{active}</span></div></div><div className="topbar-actions"><div className="date-pill"><CalendarDays size={15} /><span>{new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date())}</span><ChevronDown size={14} /></div><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /></button><div className="topbar-avatar">{owner.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div></div></header>
      <div className="page-content">
        {active === 'Overview' ? <>
          <section className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> {new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase()}</div><h1>Good morning, {owner.full_name.split(' ')[0]} <span className="wave">✳</span></h1><p className="welcome-subtitle">Here’s what’s happening across your properties today.</p></div><button className="button-primary" onClick={() => setModal(true)}><Plus size={17} /> Add property</button></section>
          <section className="stat-grid">
            <StatCard title="Monthly collections" value="₹0" delta="No invoices" note="billing is not set up yet" icon={<Wallet size={18} />} tint="mint" trend="neutral" />
            <StatCard title="Occupancy rate" value={`${totalBeds ? Math.round(occupiedBeds / totalBeds * 100) : 0}%`} delta={`${totalBeds} beds`} note="add rooms to track capacity" icon={<BedDouble size={18} />} tint="blue-tint" trend="neutral" extra={<div className="mini-progress"><i style={{ width: `${totalBeds ? occupiedBeds / totalBeds * 100 : 0}%` }} /></div>} />
            <StatCard title="Rent to collect" value="₹0" delta="No invoices" note="billing is not set up yet" icon={<ArrowDownLeft size={18} />} tint="peach-tint" trend="neutral" />
            <StatCard title="Total tenants" value={String(summary.tenant_count)} delta="Registered" note="tenant profiles" icon={<Users size={18} />} tint="lilac-tint" trend="neutral" />
          </section>
          <section className="content-grid">
            <div className="panel chart-panel"><div className="panel-heading"><div><div className="panel-kicker">YOUR BUSINESS</div><h2>Income overview</h2></div><button className="select-button">Last 6 months <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-income" /> Income</span><span><i className="legend-expense" /> Expenses</span><strong>₹0 <small>no collections recorded yet</small></strong></div><div className="chart-wrap"><div className="chart-y"><span>₹5L</span><span>₹4L</span><span>₹3L</span><span>₹2L</span><span>₹1L</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><div className="bars">{chartBars.map((bar) => <div className="bar-group" key={bar.month}><div className="bar-pair"><i className="income-bar" style={{ height: `${bar.income}%` }} /><i className="expense-bar" style={{ height: `${bar.expense}%` }} /></div><small>{bar.month}</small></div>)}</div></div></div><div className="chart-footnote"><span className="chart-foot-icon"><ArrowUpRight size={14} /></span> Collection totals will appear here once payments are recorded.</div></div>
            <div className="panel attention-panel"><div className="panel-heading"><div><div className="panel-kicker">NEEDS ATTENTION</div><h2>Rent collection</h2></div><button className="more-button" aria-label="More options"><MoreHorizontal size={20} /></button></div><div className="collection-summary"><div className="collection-total">₹0 <span>pending</span></div><div className="collection-sub">No invoices have been created yet</div><div className="collection-track"><i style={{ width: 0 }} /></div><div className="collection-meta"><span>₹0 collected</span><b>0%</b></div></div><div className="attention-list collection-empty">Create invoices to see which rents need attention.</div><button className="text-action" onClick={() => setActive('Rent & invoices')}>View invoices <ArrowRight size={14} /></button></div>
          </section>
          <section className="panel properties-panel"><div className="panel-heading"><div><div className="panel-kicker">YOUR PORTFOLIO <span className="count-chip">{properties.length}</span></div><h2>Properties</h2></div><div className="heading-actions"><button className="outline-button" onClick={() => setActive('Properties')}>View all properties <ArrowRight size={14} /></button><button className="square-button" aria-label="Add property" onClick={() => setModal(true)}><Plus size={17} /></button></div></div><div className="property-cards">{properties.slice(0, 3).map((property, index) => <PropertyCard key={`${property.name}-${index}`} property={property} />)}</div></section>
          <TenantsPreview tenants={tenants} onView={() => setActive('Tenants')} />
          <footer className="footer"><span>© 2026 PG Connect</span><span>Made for the people who make a place feel like home <span className="footer-heart">♥</span></span><button>Privacy & terms</button></footer>
        </> : active === 'Rooms & beds' ? <RoomsView properties={properties} rooms={rooms} selectedPropertyId={activePropertyId} onSelectProperty={setSelectedPropertyId} onAdd={() => setModal(true)} /> : active === 'Tenants' ? <TenantsView tenants={tenants} onAdd={() => { setSelectedTenantId(null); setModal(true) }} onCheckin={(tenant) => { setSelectedTenantId(tenant.id); setSelectedBedId(null); setModal(true) }} onCheckout={checkOutTenant} /> : <OtherView active={active} properties={properties} onAdd={() => setModal(true)} />}
      </div>
      {(notice || authError) && <div className={`toast ${authError ? 'toast-error' : ''}`} role="status">{authError || notice}<button aria-label="Dismiss message" onClick={() => { setNotice(''); setAuthError('') }}><X size={14} /></button></div>}
    </main>
    {modal && selectedTenantId !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setModal(false); setSelectedTenantId(null) } }}><form className="modal-card" onSubmit={checkInTenant}><div className="modal-title-row"><div className="modal-symbol"><BedDouble size={19} /></div><button type="button" className="icon-button" aria-label="Close" onClick={() => { setModal(false); setSelectedTenantId(null) }}><X size={18} /></button></div><h2>Check in tenant</h2><p>Choose an available bed and record the agreed rent for this stay.</p><label>Property<select required value={activePropertyId ?? ''} onChange={(event) => setSelectedPropertyId(Number(event.target.value) || null)}>{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></label><label>Available bed<select required value={selectedBedId ?? ''} onChange={(event) => setSelectedBedId(Number(event.target.value) || null)}><option value="">Select a bed</option>{rooms.flatMap((room) => room.beds.filter((bed) => bed.available).map((bed) => <option key={bed.id} value={bed.id}>Room {room.room_number} · Bed {bed.label}</option>))}</select></label><label>Check-in date<input required type="date" value={checkInDate} onChange={(event) => setCheckInDate(event.target.value)} /></label><label>Agreed monthly rent<input required type="number" min="0" step="0.01" value={agreedRent} onChange={(event) => setAgreedRent(event.target.value)} placeholder="₹ amount" /></label><div className="modal-actions"><button className="outline-button" type="button" onClick={() => { setModal(false); setSelectedTenantId(null) }}>Cancel</button><button className="button-primary" type="submit" disabled={resourceBusy}><Plus size={16} /> {resourceBusy ? 'Saving…' : 'Check in'}</button></div></form></div>}
    {modal && selectedTenantId === null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(false) }}><form className="modal-card" onSubmit={active === 'Rooms & beds' ? addRoom : active === 'Tenants' ? addTenant : addProperty}><div className="modal-title-row"><div className="modal-symbol">{active === 'Rooms & beds' ? <BedDouble size={19} /> : active === 'Tenants' ? <Users size={19} /> : <Building2 size={19} />}</div><button type="button" className="icon-button" aria-label="Close" onClick={() => setModal(false)}><X size={18} /></button></div><h2>{active === 'Rooms & beds' ? 'Add a room' : active === 'Tenants' ? 'Add a tenant' : 'Add a property'}</h2><p>{active === 'Rooms & beds' ? 'Set up a room and the individual beds available in it.' : active === 'Tenants' ? 'Add a tenant profile to your owner workspace.' : 'Start by adding one of your PG locations.'}</p>{active === 'Rooms & beds' ? <><label>Room number<input required autoFocus value={roomNumber} onChange={(event) => setRoomNumber(event.target.value)} placeholder="e.g. 204" /></label><label>Floor number<input required type="number" min="0" value={floorNumber} onChange={(event) => setFloorNumber(event.target.value)} /></label><label>Bed labels<input required value={bedLabels} onChange={(event) => setBedLabels(event.target.value)} placeholder="A, B, C" /><small className="field-help">Separate bed labels with commas.</small></label></> : active === 'Tenants' ? <><label>Full name<input required minLength={2} autoFocus value={tenantName} onChange={(event) => setTenantName(event.target.value)} placeholder="Tenant’s full name" /></label><label>Phone number<input required type="tel" value={tenantPhone} onChange={(event) => setTenantPhone(event.target.value)} placeholder="+91" /></label><label>Email address <span className="optional-label">Optional</span><input type="email" value={tenantEmail} onChange={(event) => setTenantEmail(event.target.value)} placeholder="tenant@example.com" /></label></> : <><label>Property name<input required autoFocus value={propertyName} onChange={(event) => setPropertyName(event.target.value)} placeholder="e.g. Indiranagar House" /></label><label>Area or locality<input required value={propertyArea} onChange={(event) => setPropertyArea(event.target.value)} placeholder="e.g. Indiranagar, Bengaluru" /></label></>}<div className="modal-actions"><button className="outline-button" type="button" onClick={() => setModal(false)}>Cancel</button><button className="button-primary" type="submit" disabled={resourceBusy}><Plus size={16} /> {resourceBusy ? 'Saving…' : active === 'Rooms & beds' ? 'Add room' : active === 'Tenants' ? 'Add tenant' : 'Add property'}</button></div></form></div>}
  </div>
}

function StatCard({ title, value, delta, note, icon, tint, trend, extra }: { title: string; value: string; delta: string; note: string; icon: React.ReactNode; tint: string; trend: 'up' | 'neutral'; extra?: React.ReactNode }) {
  return <div className="stat-card"><div className="stat-top"><span className={`stat-icon ${tint}`}>{icon}</span><button className="more-button" aria-label={`${title} details`}><MoreHorizontal size={18} /></button></div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-bottom"><span className={trend === 'up' ? 'trend-up' : 'trend-neutral'}>{trend === 'up' && <ArrowUpRight size={13} />}{delta}</span><span>{note}</span></div>{extra}</div>
}

function AuthScreen({ mode, setMode, fullName, setFullName, email, setEmail, password, setPassword, error, busy, onSubmit }: { mode: 'login' | 'register'; setMode: (mode: 'login' | 'register') => void; fullName: string; setFullName: (value: string) => void; email: string; setEmail: (value: string) => void; password: string; setPassword: (value: string) => void; error: string; busy: boolean; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <main className="auth-screen"><div className="auth-side"><div className="brand"><div className="brand-mark"><Home size={17} /></div><span>pg<span className="brand-light">connect</span></span></div><div className="auth-side-content"><div className="auth-side-art"><div className="auth-art-sun" /><div className="auth-art-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="auth-art-plant">✳</div></div><div className="auth-quote-mark">“</div><h2>Good stays start with a little less chaos.</h2><p>Keep your properties, people, and everyday details together in one calm workspace.</p><div className="auth-dots"><i /><i /><i /></div></div><small className="auth-side-footer">Made for PG owners in Bengaluru <span>♥</span></small></div><div className="auth-main"><form className="auth-card" onSubmit={onSubmit}><div className="eyebrow"><span className="live-dot" /> YOUR OWNER WORKSPACE</div><h1>{mode === 'register' ? 'Create your workspace' : 'Welcome back'}</h1><p className="auth-intro">{mode === 'register' ? 'A simpler way to keep your PG business in order.' : 'Sign in to pick up where you left off.'}</p>{error && <div className="auth-error" role="alert">{error}</div>}{mode === 'register' && <label>Your name<input required minLength={2} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Vedanth Sharma" /></label>}<label>Email address<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input required minLength={mode === 'register' ? 10 : 1} type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'register' ? 'At least 10 characters' : 'Your password'} /></label><button className="button-primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={15} /></button><div className="auth-switch">{mode === 'register' ? 'Already have an account?' : 'New to PG Connect?'} <button type="button" onClick={() => { setMode(mode === 'register' ? 'login' : 'register') }}> {mode === 'register' ? 'Sign in' : 'Create an account'}</button></div><div className="auth-privacy"><span><Sparkles size={13} /> Your PG information stays private to your account.</span></div></form><footer className="auth-footer">© {new Date().getFullYear()} PG Connect <span>Privacy & terms</span></footer></div></main>
}

function PropertyCard({ property }: { property: Property }) {
  const occupancy = property.beds ? Math.round(property.occupied / property.beds * 100) : 0
  return <div className="property-card"><div className={`property-art ${property.accent}`}><div className="art-sun" /><div className="art-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="art-ground" /></div><div className="property-card-body"><div className="property-title-row"><div><h3>{property.name}</h3><p><span className="map-pin">⌖</span>{property.area}</p></div><button className="more-button" aria-label={`More options for ${property.name}`}><MoreHorizontal size={19} /></button></div><div className="property-metrics"><div><small>OCCUPANCY</small><b>{occupancy}% <span>· {property.occupied}/{property.beds} beds</span></b><div className="property-progress"><i style={{ width: `${occupancy}%` }} /></div></div><div><small>COLLECTED THIS MONTH</small><b>{money(property.revenue)}</b></div></div></div></div>
}

function RoomsView({ properties, rooms, selectedPropertyId, onSelectProperty, onAdd }: { properties: Property[]; rooms: Room[]; selectedPropertyId: number | null; onSelectProperty: (value: number | null) => void; onAdd: () => void }) {
  const bedCount = rooms.reduce((sum, room) => sum + room.beds.length, 0)
  const freeCount = rooms.reduce((sum, room) => sum + room.beds.filter((bed) => bed.available).length, 0)
  return <><section className="welcome-row subpage-welcome"><div><div className="eyebrow"><span className="live-dot" /> OWNER WORKSPACE</div><h1>Rooms & beds</h1><p className="welcome-subtitle">Keep room inventory and individual bed availability organized.</p></div><button className="button-primary" onClick={onAdd} disabled={!properties.length}><Plus size={17} /> Add room</button></section><div className="panel operational-panel"><div className="panel-heading"><div><div className="panel-kicker">ROOM INVENTORY</div><h2>{rooms.length} rooms <span className="muted-heading">· {bedCount} beds</span></h2></div><select className="select-button native-select" value={selectedPropertyId ?? ''} onChange={(event) => onSelectProperty(Number(event.target.value) || null)} aria-label="Choose property">{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></div>{!properties.length ? <div className="operational-empty"><div className="coming-icon"><Building2 size={20} /></div><h3>Add a property first</h3><p>Room and bed inventory belongs to a PG property. Add one to get started.</p></div> : !rooms.length ? <div className="operational-empty"><div className="coming-icon"><BedDouble size={20} /></div><h3>No rooms at this property yet</h3><p>Create your first room and add its bed labels. Availability is tracked one bed at a time.</p><button className="button-primary" onClick={onAdd}><Plus size={16} /> Add a room</button></div> : <div className="room-list">{rooms.map((room) => <article className="room-row" key={room.id}><div className="room-icon"><BedDouble size={17} /></div><div className="room-details"><div className="room-title"><b>Room {room.room_number}</b><span className="room-type-pill">{room.room_type}</span><small>Floor {room.floor_number}</small></div><div className="bed-chips">{room.beds.map((bed) => <span className={`bed-chip ${bed.available ? 'bed-free' : 'bed-taken'}`} key={bed.id}><i />Bed {bed.label}<small>{bed.available ? 'Available' : 'Occupied'}</small></span>)}</div></div><div className="room-count"><b>{room.beds.length}/{room.capacity}</b><small>beds</small></div></article>)}</div>}<div className="inventory-footer"><span><i className="inventory-dot available-dot" /> {freeCount} available</span><span><i className="inventory-dot occupied-dot" /> {bedCount - freeCount} occupied</span></div></div><WorkspaceFooter /></>
}

function TenantsPreview({ tenants, onView }: { tenants: Tenant[]; onView: () => void }) {
  return <section className="panel tenants-panel"><div className="panel-heading"><div><div className="panel-kicker">PEOPLE</div><h2>Recent tenants</h2></div><button className="outline-button" onClick={onView}>All tenants <ArrowRight size={14} /></button></div>{tenants.length === 0 ? <div className="preview-empty">Tenant profiles will appear here after you add them.</div> : <div className="preview-tenant-list">{tenants.slice(0, 4).map((tenant) => <div className="preview-tenant" key={tenant.id}><span className="directory-avatar">{tenant.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><span className="preview-tenant-name"><b>{tenant.full_name}</b><small>{tenant.current_stay ? `${tenant.current_stay.property_name} · Room ${tenant.current_stay.room_number}, bed ${tenant.current_stay.bed_label}` : 'Not checked in'}</small></span><span className="directory-phone">{tenant.phone}</span></div>)}</div>}<div className="table-footer"><span>Showing <b>{Math.min(tenants.length, 4)}</b> of <b>{tenants.length}</b> tenants</span><button className="text-action" onClick={onView}>View all tenants <ArrowRight size={14} /></button></div></section>
}

function TenantsView({ tenants, onAdd, onCheckin, onCheckout }: { tenants: Tenant[]; onAdd: () => void; onCheckin: (tenant: Tenant) => void; onCheckout: (stayId: number) => void }) {
  return <><section className="welcome-row subpage-welcome"><div><div className="eyebrow"><span className="live-dot" /> OWNER WORKSPACE</div><h1>Tenants</h1><p className="welcome-subtitle">Keep tenant contact details and current stays together.</p></div><button className="button-primary" onClick={onAdd}><Plus size={17} /> Add tenant</button></section><div className="panel operational-panel"><div className="panel-heading"><div><div className="panel-kicker">TENANT DIRECTORY</div><h2>{tenants.length} {tenants.length === 1 ? 'tenant' : 'tenants'}</h2></div></div>{tenants.length === 0 ? <div className="operational-empty"><div className="coming-icon"><Users size={20} /></div><h3>No tenants yet</h3><p>Create a tenant profile to begin keeping occupancy records.</p><button className="button-primary" onClick={onAdd}><Plus size={16} /> Add a tenant</button></div> : <div className="tenant-directory">{tenants.map((tenant) => <article className="directory-row" key={tenant.id}><div className="directory-avatar">{tenant.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="directory-name"><b>{tenant.full_name}</b><small>{tenant.email || 'No email added'}</small></div><div className="directory-phone">{tenant.phone}</div>{tenant.current_stay ? <><div className="directory-stay"><b>{tenant.current_stay.property_name} · Room {tenant.current_stay.room_number}, bed {tenant.current_stay.bed_label}</b><small>Since {tenant.current_stay.check_in} · {money(tenant.current_stay.agreed_monthly_rent)}/month</small></div><button className="outline-button checkout-button" onClick={() => onCheckout(tenant.current_stay!.id)}>Check out</button></> : <button className="outline-button checkout-button" onClick={() => onCheckin(tenant)}>Check in</button>}</article>)}</div>}</div><WorkspaceFooter /></>
}

function WorkspaceFooter() { return <div className="footer"><span>© {new Date().getFullYear()} PG Connect</span><span>Built for better-managed stays <span className="footer-heart">♥</span></span><button>Privacy & terms</button></div> }

function OtherView({ active, properties, onAdd }: { active: ViewName; properties: Property[]; onAdd: () => void }) {
  const copy: Record<ViewName, string> = { Overview: '', Properties: 'All your PG locations, at a glance.', 'Rooms & beds': 'Manage rooms, bed availability, and occupancy.', Tenants: 'Keep tenant profiles and stays organized.', 'Rent & invoices': 'Track what’s due and what’s been collected.', Payments: 'Review recent and pending transactions.', Expenses: 'Keep property operating costs in one place.', Reports: 'Understand your occupancy and business performance.' }
  return <><section className="welcome-row subpage-welcome"><div><div className="eyebrow"><span className="live-dot" /> OWNER WORKSPACE</div><h1>{active}</h1><p className="welcome-subtitle">{copy[active]}</p></div><button className="button-primary" onClick={active === 'Properties' ? onAdd : undefined}><Plus size={17} /> {active === 'Properties' ? 'Add property' : 'Coming soon'}</button></section><div className="panel subpage-panel"><div className="panel-heading"><div><div className="panel-kicker">{active.toUpperCase()}</div><h2>{active === 'Properties' ? `${properties.length} properties` : 'Your workspace'}</h2></div><button className="select-button"><SlidersHorizontal size={14} /> Filter</button></div>{active === 'Properties' ? <div className="property-cards">{properties.map((property, index) => <PropertyCard key={`${property.name}-${index}`} property={property} />)}<button className="add-property-tile" onClick={onAdd}><span><Plus size={20} /></span><b>Add another property</b><small>Bring your PG operations into one place</small></button></div> : <div className="coming-soon"><div className="coming-icon"><Sparkles size={21} /></div><h3>This part of your workspace is on its way</h3><p>We’re building {active.toLowerCase()} tools around how PG owners work. Your property information is ready to connect here.</p><button className="outline-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to overview <ArrowRight size={14} /></button></div>}</div><div className="footer"><span>© 2026 PG Connect</span><span>Built for better-managed stays <span className="footer-heart">♥</span></span><button>Privacy & terms</button></div></>
}
