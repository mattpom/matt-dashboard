'use client'
import { useState, useEffect } from 'react'

const TABS = ['📊 Revenue & Traffic', '🛒 Products & Listings', '🔧 Software Stack']

// ── TYPES ──────────────────────────────────────────────────────
type TrafficRow = {
  week: string; site: string; visitors: string; sessions: string;
  topPage: string; source: string; amazonClicks: string; amazonRev: string;
  etsyVisits: string; etsyOrders: string; etsyRev: string;
  pinterestClicks: string; igClicks: string; xClicks: string; notes: string;
}
type ProductRow = {
  name: string; store: string; type: string; price: string; views: string;
  visits: string; favs: string; orders: string; revenue: string;
  keyword: string; titleQ: string; mockupQ: string; tagsQ: string;
  updated: string; action: string;
}
type StackRow = {
  tool: string; category: string; purpose: string; accounts: string;
  moCost: string; loginEmail: string; renewal: string;
  status: string; value: string; problems: string; replacement: string; decision: string; notes: string;
}

const SITES = ['BrokeModeLife.com','StopLookAround.com','FineLivingGuide.com',"Don't Be Hangry",'BrokeHouseCo (Etsy)','Amazon Associates','Pinterest','Instagram','X / Twitter']
const QUALITY = ['','Poor','Fair','Good','Great']
const STATUSES = ['Active','Paused','Testing','REVIEW','CANCEL']
const DECISIONS = ['KEEP','REVIEW','CANCEL']

const defaultTraffic = (): TrafficRow[] => SITES.map(s => ({
  week:'', site:s, visitors:'', sessions:'', topPage:'', source:'',
  amazonClicks:'', amazonRev:'', etsyVisits:'', etsyOrders:'', etsyRev:'',
  pinterestClicks:'', igClicks:'', xClicks:'', notes:''
}))

const defaultProducts = (): ProductRow[] => [
  {name:'Rental Property Tracker',store:'BrokeHouseCo',type:'PDF/Etsy',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'rental property tracker printable',titleQ:'Good',mockupQ:'Good',tagsQ:'Good',updated:'',action:''},
  {name:'Budget Planner Printable',store:'BrokeHouseCo',type:'PDF/Etsy',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'budget planner printable',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'Home Maintenance Checklist',store:'BrokeHouseCo',type:'PDF/Etsy',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'home maintenance checklist pdf',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'BrokeBites (PWA)',store:'BrokeBites',type:'App',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'ai meal planner free',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:'In Build'},
  {name:'ListingIQ (SEO Tool)',store:'ListingIQ',type:'SaaS',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'etsy seo tool',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:'In Build'},
  ...Array(15).fill(null).map(() => ({name:'',store:'',type:'',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''}))
]

const defaultStack = (): StackRow[] => [
  {tool:'Google Analytics 4',category:'Analytics',purpose:'Traffic tracking for all sites',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Amazon Associates',category:'Affiliate',purpose:'Affiliate link tracking & commissions',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Etsy',category:'Marketplace',purpose:'PDF store — BrokeHouseCo',accounts:'BrokeHouseCo',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Listing fees',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:'$0.20/listing + 6.5% tx'},
  {tool:'Pinterest',category:'Social/Traffic',purpose:'Visual traffic driver',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Instagram',category:'Social/Traffic',purpose:'Brand awareness + bio link traffic',accounts:'BrokeModeLife, DBH',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'3',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'X / Twitter',category:'Social/Traffic',purpose:'Link sharing + audience',accounts:'BrokeModeLife',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'3',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Buffer',category:'Scheduling',purpose:'Social post scheduling',accounts:'Pinterest, IG, X',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'',replacement:'Later, Metricool',decision:'REVIEW',notes:'Evaluate cost vs use'},
  {tool:'Make.com',category:'Automation',purpose:'Workflow automation',accounts:'Brevo, Sheets, Etsy',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Claude / Cowork',category:'AI',purpose:'Primary build partner',accounts:'All projects',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:'Core tool'},
  {tool:'ChatGPT',category:'AI',purpose:'Supplemental AI',accounts:'All projects',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'Overlaps Claude',replacement:'Use Claude only',decision:'REVIEW',notes:'May be redundant'},
  {tool:'Replit',category:'Dev/Hosting',purpose:'Prototyping',accounts:'BrokeBites, ListingIQ',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'',replacement:'Vercel + local',decision:'REVIEW',notes:''},
  {tool:'Vercel',category:'Hosting',purpose:'Production hosting',accounts:'BrokeModeLife, BrokeBites, ListingIQ',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Google Sheets',category:'Data/Tracking',purpose:'Tracking, dashboards, models',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Google Drive',category:'Storage',purpose:'File storage',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'ElevenLabs',category:'AI/Audio',purpose:'AI voiceover',accounts:'Content',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'',replacement:'',decision:'REVIEW',notes:'Evaluate usage'},
  {tool:'NotebookLM',category:'AI/Research',purpose:'Research synthesis',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Brevo',category:'Email',purpose:'Email list & automations',accounts:'BrokeModeLife',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Cloudflare',category:'DNS/Security',purpose:'Domain DNS, CDN, security',accounts:'All domains',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'GitHub',category:'Dev',purpose:'Code version control',accounts:'BrokeBites, ListingIQ',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Python / ReportLab',category:'Dev',purpose:'PDF generation for Etsy',accounts:'BrokeHouseCo',moCost:'0',loginEmail:'local',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Search Console',category:'Analytics',purpose:'SEO performance',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
]

// ── STYLES ─────────────────────────────────────────────────────
const s = {
  wrap: { maxWidth: 1400, margin: '0 auto', padding: '24px 16px' },
  header: { marginBottom: 24 },
  h1: { fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' },
  sub: { fontSize: 13, color: '#666', marginTop: 4 },
  tabs: { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #222' },
  tab: (active: boolean): React.CSSProperties => ({
    padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    borderRadius: '6px 6px 0 0', border: 'none', outline: 'none',
    background: active ? '#1a1a2e' : 'transparent',
    color: active ? '#e94560' : '#666',
    borderBottom: active ? '2px solid #e94560' : '2px solid transparent',
    transition: 'all 0.15s',
  }),
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 },
  th: { background: '#1a1a2e', color: '#e94560', padding: '8px 10px', textAlign: 'left' as const, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' as const, borderBottom: '1px solid #333' },
  td: (alt: boolean): React.CSSProperties => ({ padding: '4px 6px', borderBottom: '1px solid #1a1a1a', background: alt ? '#111' : '#0d0d0d', verticalAlign: 'middle' }),
  input: { background: 'transparent', border: 'none', color: '#e0e0e0', fontSize: 12, width: '100%', outline: 'none', padding: '2px 4px' },
  select: { background: '#1a1a2e', border: '1px solid #333', color: '#e0e0e0', fontSize: 11, borderRadius: 3, padding: '2px 4px', width: '100%' },
  badge: (v: string): React.CSSProperties => {
    const map: Record<string,string> = { Active:'#1a3a2a', KEEP:'#1a3a2a', CANCEL:'#3a1a1a', REVIEW:'#3a2a00', Paused:'#2a2a00', Testing:'#1a1a3a', Poor:'#3a1a1a', Fair:'#3a2a00', Good:'#1a2a3a', Great:'#1a3a2a' }
    const tc: Record<string,string> = { Active:'#4caf50', KEEP:'#4caf50', CANCEL:'#e94560', REVIEW:'#ff9800', Paused:'#ffeb3b', Testing:'#64b5f6', Poor:'#e94560', Fair:'#ff9800', Good:'#64b5f6', Great:'#4caf50' }
    return { background: map[v]||'#1a1a1a', color: tc[v]||'#999', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap' }
  },
  saveBtn: { background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' as const, display: 'block' },
  saved: { fontSize: 12, color: '#4caf50', textAlign: 'right' as const, marginTop: 6, height: 16 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#e94560', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: 1 },
  scrollWrap: { overflowX: 'auto' as const },
  totalsRow: { background: '#1a1a2e', fontWeight: 700, color: '#fff' },
  totals: { padding: '6px 10px', color: '#e94560', fontWeight: 700, fontSize: 12 },
}

function inp(val: string, onChange: (v: string) => void, placeholder = '') {
  return <input style={s.input} value={val} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
}

function sel(val: string, opts: string[], onChange: (v: string) => void) {
  return (
    <select style={s.select} value={val} onChange={e => onChange(e.target.value)}>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ── TAB 1 ──────────────────────────────────────────────────────
function TrafficTab({ rows, setRows }: { rows: TrafficRow[], setRows: (r: TrafficRow[]) => void }) {
  const update = (i: number, k: keyof TrafficRow, v: string) => {
    const next = [...rows]; next[i] = { ...next[i], [k]: v }; setRows(next)
  }
  const totalVisitors = rows.reduce((a, r) => a + (parseInt(r.visitors) || 0), 0)
  const totalEtsyRev = rows.reduce((a, r) => a + (parseFloat(r.etsyRev) || 0), 0)
  const totalAmazonRev = rows.reduce((a, r) => a + (parseFloat(r.amazonRev) || 0), 0)

  const cols = ['Week Of','Site / Platform','Visitors','Sessions','Top Page','Source','Amz Clicks','Amz Rev $','Etsy Visits','Etsy Orders','Etsy Rev $','Pinterest Clicks','IG Clicks','X Clicks','Notes']
  return (
    <div>
      <div style={{ display:'flex', gap:24, marginBottom:20 }}>
        {[['Total Visitors', totalVisitors.toLocaleString()],['Etsy Revenue', '$'+totalEtsyRev.toFixed(2)],['Amazon Revenue','$'+totalAmazonRev.toFixed(2)]].map(([l,v]) => (
          <div key={l} style={{ background:'#1a1a2e', borderRadius:8, padding:'12px 20px', minWidth:140 }}>
            <div style={{ fontSize:11, color:'#666', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#e94560' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={s.scrollWrap}>
        <table style={s.table}>
          <thead><tr>{cols.map(c => <th key={c} style={s.th}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={s.td(i%2===1)}>{inp(r.week, v => update(i,'week',v), 'MM/DD')}</td>
                <td style={{...s.td(i%2===1), color:'#aaa', fontWeight:500, whiteSpace:'nowrap'}}>{r.site}</td>
                <td style={s.td(i%2===1)}>{inp(r.visitors, v => update(i,'visitors',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.sessions, v => update(i,'sessions',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.topPage, v => update(i,'topPage',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.source, v => update(i,'source',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.amazonClicks, v => update(i,'amazonClicks',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.amazonRev, v => update(i,'amazonRev',v), '0.00')}</td>
                <td style={s.td(i%2===1)}>{inp(r.etsyVisits, v => update(i,'etsyVisits',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.etsyOrders, v => update(i,'etsyOrders',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.etsyRev, v => update(i,'etsyRev',v), '0.00')}</td>
                <td style={s.td(i%2===1)}>{inp(r.pinterestClicks, v => update(i,'pinterestClicks',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.igClicks, v => update(i,'igClicks',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.xClicks, v => update(i,'xClicks',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.notes, v => update(i,'notes',v))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:24, background:'#111', borderRadius:8, padding:16 }}>
        <div style={s.sectionTitle}>Weekly Checklist</div>
        {['Pull GA4 → visitors, sessions, top page per site','Check Amazon Associates → clicks + commissions','Pull Etsy Stats → visits, orders, revenue','Check Pinterest → outbound link clicks','Check Instagram → profile visits / link clicks','Check X → link clicks on pinned post or bio'].map(t => (
          <div key={t} style={{ fontSize:12, color:'#888', padding:'4px 0' }}>☐ {t}</div>
        ))}
      </div>
    </div>
  )
}

// ── TAB 2 ──────────────────────────────────────────────────────
function ProductsTab({ rows, setRows }: { rows: ProductRow[], setRows: (r: ProductRow[]) => void }) {
  const update = (i: number, k: keyof ProductRow, v: string) => {
    const next = [...rows]; next[i] = { ...next[i], [k]: v }; setRows(next)
  }
  const totalRev = rows.reduce((a,r) => a + (parseFloat(r.revenue)||0), 0)
  const totalOrders = rows.reduce((a,r) => a + (parseInt(r.orders)||0), 0)

  return (
    <div>
      <div style={{ display:'flex', gap:24, marginBottom:20 }}>
        {[['Total Revenue','$'+totalRev.toFixed(2)],['Total Orders', totalOrders],['Active Listings', rows.filter(r=>r.name&&r.action!=='In Build').length]].map(([l,v]) => (
          <div key={l} style={{ background:'#1a1a2e', borderRadius:8, padding:'12px 20px', minWidth:140 }}>
            <div style={{ fontSize:11, color:'#666', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#e94560' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={s.scrollWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['Product Name','Store','Type','Price','Views','Visits','Favs','Orders','Revenue','Conv%','Keyword','Title','Mockup','Tags','Updated','Action'].map(c => <th key={c} style={s.th}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const conv = r.visits && r.orders ? ((parseInt(r.orders)/parseInt(r.visits))*100).toFixed(1)+'%' : ''
              return (
                <tr key={i}>
                  <td style={{...s.td(i%2===1), minWidth:180}}>{inp(r.name, v => update(i,'name',v), 'Product name')}</td>
                  <td style={s.td(i%2===1)}>{inp(r.store, v => update(i,'store',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.type, v => update(i,'type',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.price, v => update(i,'price',v), '0.00')}</td>
                  <td style={s.td(i%2===1)}>{inp(r.views, v => update(i,'views',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.visits, v => update(i,'visits',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.favs, v => update(i,'favs',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.orders, v => update(i,'orders',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.revenue, v => update(i,'revenue',v), '0.00')}</td>
                  <td style={s.td(i%2===1)}><span style={{ color: conv && parseFloat(conv) < 1 ? '#e94560' : '#4caf50', fontSize:12 }}>{conv}</span></td>
                  <td style={{...s.td(i%2===1), minWidth:160}}>{inp(r.keyword, v => update(i,'keyword',v))}</td>
                  <td style={s.td(i%2===1)}>{r.titleQ ? <span style={s.badge(r.titleQ)}>{r.titleQ}</span> : sel(r.titleQ, QUALITY, v => update(i,'titleQ',v))}</td>
                  <td style={s.td(i%2===1)}>{r.mockupQ ? <span style={s.badge(r.mockupQ)} onClick={() => update(i,'mockupQ','')}>{r.mockupQ}</span> : sel(r.mockupQ, QUALITY, v => update(i,'mockupQ',v))}</td>
                  <td style={s.td(i%2===1)}>{r.tagsQ ? <span style={s.badge(r.tagsQ)} onClick={() => update(i,'tagsQ','')}>{r.tagsQ}</span> : sel(r.tagsQ, QUALITY, v => update(i,'tagsQ',v))}</td>
                  <td style={s.td(i%2===1)}>{inp(r.updated, v => update(i,'updated',v), 'MM/DD')}</td>
                  <td style={s.td(i%2===1)}>{inp(r.action, v => update(i,'action',v))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:24, background:'#111', borderRadius:8, padding:16 }}>
        <div style={s.sectionTitle}>Weekly Checklist</div>
        {['Update Views, Visits, Favs, Orders for each active listing','Flag any listing: Views > 50 but Orders = 0 → fix mockup or title','Conv rate < 1% → action needed','Update "Updated" date for any listing you touched'].map(t => (
          <div key={t} style={{ fontSize:12, color:'#888', padding:'4px 0' }}>☐ {t}</div>
        ))}
      </div>
    </div>
  )
}

// ── TAB 3 ──────────────────────────────────────────────────────
function StackTab({ rows, setRows }: { rows: StackRow[], setRows: (r: StackRow[]) => void }) {
  const update = (i: number, k: keyof StackRow, v: string) => {
    const next = [...rows]; next[i] = { ...next[i], [k]: v }; setRows(next)
  }
  const totalMo = rows.reduce((a,r) => a + (parseFloat(r.moCost)||0), 0)
  const cancelCandidates = rows.filter(r => r.decision === 'CANCEL' || r.decision === 'REVIEW').length

  return (
    <div>
      <div style={{ display:'flex', gap:24, marginBottom:20 }}>
        {[['Monthly Tool Cost','$'+totalMo.toFixed(2)],['Need Decision', cancelCandidates+' tools'],['Active Tools', rows.filter(r=>r.status==='Active').length]].map(([l,v]) => (
          <div key={l} style={{ background:'#1a1a2e', borderRadius:8, padding:'12px 20px', minWidth:140 }}>
            <div style={{ fontSize:11, color:'#666', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:700, color: l==='Monthly Tool Cost'?'#e94560':l==='Need Decision'&&cancelCandidates>0?'#ff9800':'#e94560' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={s.scrollWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['Tool','Category','Purpose','Accounts','Mo Cost','Login','Renewal','Status','Value','Problems','Replacement','Decision','Notes'].map(c => <th key={c} style={s.th}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{...s.td(i%2===1), fontWeight:600, whiteSpace:'nowrap' as const, color:'#ddd'}}>{r.tool || inp(r.tool, v => update(i,'tool',v), 'Tool name')}</td>
                <td style={s.td(i%2===1)}>{inp(r.category, v => update(i,'category',v))}</td>
                <td style={{...s.td(i%2===1), minWidth:200}}>{inp(r.purpose, v => update(i,'purpose',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.accounts, v => update(i,'accounts',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.moCost, v => update(i,'moCost',v), '0')}</td>
                <td style={s.td(i%2===1)}>{inp(r.loginEmail, v => update(i,'loginEmail',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.renewal, v => update(i,'renewal',v))}</td>
                <td style={s.td(i%2===1)}>{sel(r.status, STATUSES, v => update(i,'status',v))}</td>
                <td style={s.td(i%2===1)}>{sel(r.value, ['','1','2','3','4','5'], v => update(i,'value',v))}</td>
                <td style={{...s.td(i%2===1), minWidth:160}}>{inp(r.problems, v => update(i,'problems',v))}</td>
                <td style={s.td(i%2===1)}>{inp(r.replacement, v => update(i,'replacement',v))}</td>
                <td style={s.td(i%2===1)}>{<span style={s.badge(r.decision)}><select style={{...s.select, background:'transparent', border:'none', color:'inherit', fontWeight:600}} value={r.decision} onChange={e=>update(i,'decision',e.target.value)}>{DECISIONS.map(d=><option key={d}>{d}</option>)}</select></span>}</td>
                <td style={{...s.td(i%2===1), minWidth:160}}>{inp(r.notes, v => update(i,'notes',v))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:16, padding:'10px 16px', background:'#1a0a0a', borderRadius:6, border:'1px solid #3a1a1a' }}>
        <span style={{ color:'#e94560', fontSize:12, fontWeight:600 }}>🚨 Rule: </span>
        <span style={{ color:'#888', fontSize:12 }}>Any tool with Monthly Cost &gt; $0 and Value ≤ 2 → CANCEL immediately.</span>
      </div>
      <div style={{ marginTop:16, background:'#111', borderRadius:8, padding:16 }}>
        <div style={s.sectionTitle}>Monthly Cancel/Keep Review</div>
        {['Total monthly cost — going up or down?','Any tool: Value ≤ 2 AND cost > $0 → CANCEL','Any REVIEW sitting for 2+ months → force a decision','Check overlap: ChatGPT vs Claude, Replit vs Vercel','Check renewal dates — anything billing in 30 days?'].map(t => (
          <div key={t} style={{ fontSize:12, color:'#888', padding:'4px 0' }}>☐ {t}</div>
        ))}
      </div>
    </div>
  )
}

// ── ROOT ───────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const [traffic, setTraffic] = useState<TrafficRow[]>(defaultTraffic)
  const [products, setProducts] = useState<ProductRow[]>(defaultProducts)
  const [stack, setStack] = useState<StackRow[]>(defaultStack)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    try {
      const t = localStorage.getItem('dash_traffic'); if (t) setTraffic(JSON.parse(t))
      const p = localStorage.getItem('dash_products'); if (p) setProducts(JSON.parse(p))
      const s = localStorage.getItem('dash_stack'); if (s) setStack(JSON.parse(s))
    } catch {}
  }, [])

  const save = () => {
    localStorage.setItem('dash_traffic', JSON.stringify(traffic))
    localStorage.setItem('dash_products', JSON.stringify(products))
    localStorage.setItem('dash_stack', JSON.stringify(stack))
    setSavedMsg('Saved ✓'); setTimeout(() => setSavedMsg(''), 2500)
  }

  return (
    <div style={s.wrap}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={s.h1}>Mattpom Digital Ventures</div>
          <div style={s.sub}>Business Dashboard · {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <button style={s.saveBtn} onClick={save}>Save</button>
          <div style={s.saved}>{savedMsg}</div>
        </div>
      </div>
      <div style={s.tabs}>
        {TABS.map((t,i) => <button key={t} style={s.tab(tab===i)} onClick={() => setTab(i)}>{t}</button>)}
      </div>
      {tab === 0 && <TrafficTab rows={traffic} setRows={setTraffic} />}
      {tab === 1 && <ProductsTab rows={products} setRows={setProducts} />}
      {tab === 2 && <StackTab rows={stack} setRows={setStack} />}
    </div>
  )
}
