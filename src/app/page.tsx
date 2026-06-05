'use client'
import { useState, useEffect } from 'react'

const TABS = [
  { id: 0, label: 'Revenue & Traffic', icon: '↗' },
  { id: 1, label: 'Products & Listings', icon: '◈' },
  { id: 2, label: 'Software Stack', icon: '⬡' },
]

type TrafficRow = { week:string; site:string; visitors:string; sessions:string; topPage:string; source:string; amazonClicks:string; amazonRev:string; etsyVisits:string; etsyOrders:string; etsyRev:string; pinterestClicks:string; igClicks:string; xClicks:string; notes:string }
type ProductRow = { name:string; store:string; type:string; price:string; views:string; visits:string; favs:string; orders:string; revenue:string; keyword:string; titleQ:string; mockupQ:string; tagsQ:string; updated:string; action:string }
type StackRow = { tool:string; category:string; purpose:string; accounts:string; moCost:string; loginEmail:string; renewal:string; status:string; value:string; problems:string; replacement:string; decision:string; notes:string }

const SITES = ['BrokeModeLife.com','StopLookAround.com','FineLivingGuide.com',"Don't Be Hangry",'BrokeHouseCo (Etsy)','Amazon Associates','Pinterest','Instagram','X / Twitter']
const QUALITY = ['—','Poor','Fair','Good','Great']
const STATUSES = ['Active','Paused','Testing','REVIEW','CANCEL']
const DECISIONS = ['KEEP','REVIEW','CANCEL']

const defaultTraffic = (): TrafficRow[] => SITES.map(s => ({ week:'',site:s,visitors:'',sessions:'',topPage:'',source:'',amazonClicks:'',amazonRev:'',etsyVisits:'',etsyOrders:'',etsyRev:'',pinterestClicks:'',igClicks:'',xClicks:'',notes:'' }))

const defaultProducts = (): ProductRow[] => [
  {name:'Stoicism Planner PDF | Control Your Mind Workbook',store:'BrokeHouseCo',type:'PDF',price:'24.95',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'stoicism planner pdf marcus aurelius',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'Beginner Meditation Guide PDF',store:'BrokeHouseCo',type:'PDF',price:'9.99',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'beginner meditation guide pdf',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'Personal Finance Planner Printable / Budget Tracker PDF',store:'BrokeHouseCo',type:'PDF',price:'19.95',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'personal finance planner printable',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'30-Day Money Reset Workbook Printable PDF',store:'BrokeHouseCo',type:'PDF',price:'14.95',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'30 day money reset workbook printable',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'30-Day Productivity Planner / Accountability Guide',store:'BrokeHouseCo',type:'PDF',price:'19.95',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'30 day productivity planner printable',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'Vision Board Planner Interactive PDF',store:'BrokeHouseCo',type:'PDF',price:'14.95',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'vision board planner printable pdf',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'Benjamin Franklin 13 Virtues Workbook',store:'BrokeHouseCo',type:'PDF',price:'19.95',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'benjamin franklin 13 virtues workbook',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''},
  {name:'Record Collecting App',store:'BrokeHouseCo',type:'App',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'record collecting app',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:'In Build'},
  {name:'BrokeBites PWA',store:'BrokeBites',type:'App',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'ai meal planner free',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:'In Build'},
  {name:'ListingIQ SEO Tool',store:'ListingIQ',type:'SaaS',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'etsy seo tool',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:'In Build'},
  ...Array(10).fill(null).map(()=>({name:'',store:'',type:'',price:'',views:'',visits:'',favs:'',orders:'',revenue:'',keyword:'',titleQ:'',mockupQ:'',tagsQ:'',updated:'',action:''}))
]

const defaultStack = (): StackRow[] => [
  {tool:'Google Analytics 4',category:'Analytics',purpose:'Traffic tracking for all sites',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Amazon Associates',category:'Affiliate',purpose:'Affiliate link tracking & commissions',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Etsy',category:'Marketplace',purpose:'PDF store — BrokeHouseCo',accounts:'BrokeHouseCo',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Listing fees',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:'$0.20/listing + 6.5% tx'},
  {tool:'Pinterest',category:'Social',purpose:'Visual traffic driver',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Instagram',category:'Social',purpose:'Brand awareness + bio link',accounts:'BrokeModeLife, DBH',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'3',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'X / Twitter',category:'Social',purpose:'Link sharing + audience',accounts:'BrokeModeLife',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'3',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Buffer',category:'Scheduling',purpose:'Social post scheduling',accounts:'Pinterest, IG, X',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'',replacement:'Later, Metricool',decision:'REVIEW',notes:'Evaluate cost vs use'},
  {tool:'Make.com',category:'Automation',purpose:'Workflow automation',accounts:'Brevo, Sheets, Etsy',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Claude / Cowork',category:'AI',purpose:'Primary build partner',accounts:'All projects',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:'Core tool'},
  {tool:'ChatGPT',category:'AI',purpose:'Supplemental AI',accounts:'All projects',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'Overlaps Claude',replacement:'Use Claude only',decision:'REVIEW',notes:'May be redundant'},
  {tool:'Replit',category:'Dev',purpose:'Prototyping',accounts:'BrokeBites, ListingIQ',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'',replacement:'Vercel + local',decision:'REVIEW',notes:''},
  {tool:'Vercel',category:'Hosting',purpose:'Production hosting',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Google Sheets',category:'Data',purpose:'Tracking, dashboards',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Google Drive',category:'Storage',purpose:'File storage',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'ElevenLabs',category:'AI/Audio',purpose:'AI voiceover',accounts:'Content',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'REVIEW',value:'3',problems:'',replacement:'',decision:'REVIEW',notes:'Evaluate usage'},
  {tool:'NotebookLM',category:'AI',purpose:'Research synthesis',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Brevo',category:'Email',purpose:'Email list & automations',accounts:'BrokeModeLife',moCost:'',loginEmail:'mattpom01@gmail.com',renewal:'',status:'Active',value:'4',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Cloudflare',category:'DNS',purpose:'Domain DNS, CDN, security',accounts:'All domains',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'GitHub',category:'Dev',purpose:'Code version control',accounts:'All projects',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Python / ReportLab',category:'Dev',purpose:'PDF generation for Etsy',accounts:'BrokeHouseCo',moCost:'0',loginEmail:'local',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
  {tool:'Search Console',category:'Analytics',purpose:'SEO performance tracking',accounts:'All sites',moCost:'0',loginEmail:'mattpom01@gmail.com',renewal:'Free',status:'Active',value:'5',problems:'',replacement:'',decision:'KEEP',notes:''},
]

const BADGE: Record<string,[string,string]> = {
  Active:   ['#3FB950','#0A1F0E'], KEEP:    ['#3FB950','#0A1F0E'],
  CANCEL:   ['#E94560','#1C0B0F'], Poor:    ['#E94560','#1C0B0F'],
  REVIEW:   ['#D29922','#1C1600'], Fair:    ['#D29922','#1C1600'],
  Paused:   ['#D29922','#1C1600'], Testing: ['#58A6FF','#0A1628'],
  Good:     ['#58A6FF','#0A1628'], Great:   ['#3FB950','#0A1F0E'],
}

function Badge({ v, children }: { v: string; children?: React.ReactNode }) {
  const [color, bg] = BADGE[v] || ['#8B949E','#161B22']
  return (
    <span style={{ color, background: bg, padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600, fontFamily:'DM Mono, monospace', whiteSpace:'nowrap' as const }}>
      {children || v}
    </span>
  )
}

function Cell({ children, w, center }: { children: React.ReactNode; w?: number; center?: boolean }) {
  return (
    <td style={{ padding:'10px 12px', borderBottom:'1px solid var(--border)', verticalAlign:'middle', whiteSpace:'nowrap' as const, minWidth: w, textAlign: center ? 'center' : 'left' as const }}>
      {children}
    </td>
  )
}

function Inp({ value, onChange, placeholder='', mono=false }: { value:string; onChange:(v:string)=>void; placeholder?:string; mono?:boolean }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:13, width:'100%', fontFamily: mono ? 'DM Mono, monospace' : 'inherit', padding:0 }}
    />
  )
}

function Sel({ value, opts, onChange }: { value:string; opts:string[]; onChange:(v:string)=>void }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--text)', fontSize:12, borderRadius:4, padding:'3px 6px', width:'100%', fontFamily:'DM Mono, monospace' }}>
      {opts.map(o=><option key={o}>{o}</option>)}
    </select>
  )
}

function StatCard({ label, value, accent=false }: { label:string; value:string|number; accent?:boolean }) {
  return (
    <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 20px', minWidth:140, flex:1 }}>
      <div style={{ fontSize:11, color:'var(--text2)', textTransform:'uppercase' as const, letterSpacing:'0.08em', fontFamily:'DM Mono, monospace', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:600, color: accent ? 'var(--red)' : 'var(--text)', letterSpacing:'-0.02em' }}>{value}</div>
    </div>
  )
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' as const, letterSpacing:'0.1em', fontFamily:'DM Mono, monospace', padding:'20px 0 10px' }}>
      {children}
    </div>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 20px', marginTop:24 }}>
      {items.map((t,i) => (
        <div key={i} style={{ display:'flex', gap:10, padding:'5px 0', fontSize:13, color:'var(--text2)', borderBottom: i < items.length-1 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ color:'var(--text3)', fontFamily:'DM Mono, monospace', fontSize:11, paddingTop:1 }}>□</span>
          <span>{t}</span>
        </div>
      ))}
    </div>
  )
}

function TH({ children, w }: { children: React.ReactNode; w?: number }) {
  return (
    <th style={{ padding:'10px 12px', textAlign:'left' as const, fontSize:11, fontWeight:500, color:'var(--text2)', fontFamily:'DM Mono, monospace', textTransform:'uppercase' as const, letterSpacing:'0.06em', borderBottom:'1px solid var(--border2)', background:'var(--bg2)', whiteSpace:'nowrap' as const, minWidth:w }}>
      {children}
    </th>
  )
}

function TR({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <tr style={{ background: i%2===0 ? 'var(--bg)' : 'var(--bg2)', transition:'background 0.1s' }}>
      {children}
    </tr>
  )
}

// ── TAB 1 ─────────────────────────────────────────────────────
function TrafficTab({ rows, setRows }: { rows: TrafficRow[]; setRows: (r:TrafficRow[])=>void }) {
  const upd = (i:number, k:keyof TrafficRow, v:string) => { const n=[...rows]; n[i]={...n[i],[k]:v}; setRows(n) }
  const totalVisitors = rows.reduce((a,r)=>a+(parseInt(r.visitors)||0),0)
  const totalEtsyRev  = rows.reduce((a,r)=>a+(parseFloat(r.etsyRev)||0),0)
  const totalAmazonRev= rows.reduce((a,r)=>a+(parseFloat(r.amazonRev)||0),0)

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' as const }}>
        <StatCard label="Total Visitors" value={totalVisitors.toLocaleString()} accent />
        <StatCard label="Etsy Revenue" value={'$'+totalEtsyRev.toFixed(2)} accent />
        <StatCard label="Amazon Revenue" value={'$'+totalAmazonRev.toFixed(2)} accent />
      </div>
      <div style={{ overflowX:'auto' as const, borderRadius:8, border:'1px solid var(--border)' }}>
        <table>
          <thead>
            <tr>
              {['Week','Site / Platform','Visitors','Sessions','Top Page','Source','Amz Clicks','Amz Rev','Etsy Visits','Etsy Orders','Etsy Rev','Pinterest','Instagram','X','Notes'].map(h=><TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <TR key={i} i={i}>
                <Cell w={70}><Inp value={r.week} onChange={v=>upd(i,'week',v)} placeholder="MM/DD" mono /></Cell>
                <Cell w={160}><span style={{ color:'var(--text)', fontWeight:500 }}>{r.site}</span></Cell>
                <Cell w={80}><Inp value={r.visitors} onChange={v=>upd(i,'visitors',v)} mono /></Cell>
                <Cell w={80}><Inp value={r.sessions} onChange={v=>upd(i,'sessions',v)} mono /></Cell>
                <Cell w={180}><Inp value={r.topPage} onChange={v=>upd(i,'topPage',v)} /></Cell>
                <Cell w={100}><Inp value={r.source} onChange={v=>upd(i,'source',v)} /></Cell>
                <Cell w={90}><Inp value={r.amazonClicks} onChange={v=>upd(i,'amazonClicks',v)} mono /></Cell>
                <Cell w={90}><Inp value={r.amazonRev} onChange={v=>upd(i,'amazonRev',v)} placeholder="0.00" mono /></Cell>
                <Cell w={90}><Inp value={r.etsyVisits} onChange={v=>upd(i,'etsyVisits',v)} mono /></Cell>
                <Cell w={90}><Inp value={r.etsyOrders} onChange={v=>upd(i,'etsyOrders',v)} mono /></Cell>
                <Cell w={90}><Inp value={r.etsyRev} onChange={v=>upd(i,'etsyRev',v)} placeholder="0.00" mono /></Cell>
                <Cell w={90}><Inp value={r.pinterestClicks} onChange={v=>upd(i,'pinterestClicks',v)} mono /></Cell>
                <Cell w={90}><Inp value={r.igClicks} onChange={v=>upd(i,'igClicks',v)} mono /></Cell>
                <Cell w={80}><Inp value={r.xClicks} onChange={v=>upd(i,'xClicks',v)} mono /></Cell>
                <Cell w={200}><Inp value={r.notes} onChange={v=>upd(i,'notes',v)} /></Cell>
              </TR>
            ))}
          </tbody>
        </table>
      </div>
      <SectionHead>Weekly Checklist</SectionHead>
      <CheckList items={['Pull GA4 → visitors, sessions, top page per site','Check Amazon Associates → clicks + commissions','Pull Etsy Stats → visits, orders, revenue','Check Pinterest → outbound link clicks','Check Instagram → profile visits / link clicks','Check X → link clicks on pinned post or bio']} />
    </div>
  )
}

// ── TAB 2 ─────────────────────────────────────────────────────
function ProductsTab({ rows, setRows }: { rows: ProductRow[]; setRows: (r:ProductRow[])=>void }) {
  const upd = (i:number, k:keyof ProductRow, v:string) => { const n=[...rows]; n[i]={...n[i],[k]:v}; setRows(n) }
  const totalRev    = rows.reduce((a,r)=>a+(parseFloat(r.revenue)||0),0)
  const totalOrders = rows.reduce((a,r)=>a+(parseInt(r.orders)||0),0)
  const active      = rows.filter(r=>r.name&&r.action!=='In Build').length

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' as const }}>
        <StatCard label="Total Revenue" value={'$'+totalRev.toFixed(2)} accent />
        <StatCard label="Total Orders" value={totalOrders} accent />
        <StatCard label="Active Listings" value={active} />
      </div>
      <div style={{ overflowX:'auto' as const, borderRadius:8, border:'1px solid var(--border)' }}>
        <table>
          <thead>
            <tr>
              {['Product','Store','Type','Price','Views','Visits','Favs','Orders','Revenue','Conv %','Keyword','Title','Mockup','Tags','Updated','Action'].map(h=><TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>{
              const conv = r.visits&&r.orders ? ((parseInt(r.orders)/parseInt(r.visits))*100).toFixed(1)+'%' : ''
              const convNum = parseFloat(conv)
              return (
                <TR key={i} i={i}>
                  <Cell w={200}><Inp value={r.name} onChange={v=>upd(i,'name',v)} placeholder="Product name" /></Cell>
                  <Cell w={120}><Inp value={r.store} onChange={v=>upd(i,'store',v)} /></Cell>
                  <Cell w={80}><Inp value={r.type} onChange={v=>upd(i,'type',v)} /></Cell>
                  <Cell w={70}><Inp value={r.price} onChange={v=>upd(i,'price',v)} placeholder="0.00" mono /></Cell>
                  <Cell w={70}><Inp value={r.views} onChange={v=>upd(i,'views',v)} mono /></Cell>
                  <Cell w={70}><Inp value={r.visits} onChange={v=>upd(i,'visits',v)} mono /></Cell>
                  <Cell w={60}><Inp value={r.favs} onChange={v=>upd(i,'favs',v)} mono /></Cell>
                  <Cell w={70}><Inp value={r.orders} onChange={v=>upd(i,'orders',v)} mono /></Cell>
                  <Cell w={90}><Inp value={r.revenue} onChange={v=>upd(i,'revenue',v)} placeholder="0.00" mono /></Cell>
                  <Cell w={70} center>
                    {conv && <span style={{ fontFamily:'DM Mono, monospace', fontSize:12, color: convNum < 1 ? 'var(--red)' : 'var(--green)', fontWeight:500 }}>{conv}</span>}
                  </Cell>
                  <Cell w={200}><Inp value={r.keyword} onChange={v=>upd(i,'keyword',v)} /></Cell>
                  <Cell w={90}>{r.titleQ&&r.titleQ!=='—' ? <Badge v={r.titleQ} /> : <Sel value={r.titleQ||'—'} opts={QUALITY} onChange={v=>upd(i,'titleQ',v)} />}</Cell>
                  <Cell w={90}>{r.mockupQ&&r.mockupQ!=='—' ? <Badge v={r.mockupQ} /> : <Sel value={r.mockupQ||'—'} opts={QUALITY} onChange={v=>upd(i,'mockupQ',v)} />}</Cell>
                  <Cell w={90}>{r.tagsQ&&r.tagsQ!=='—' ? <Badge v={r.tagsQ} /> : <Sel value={r.tagsQ||'—'} opts={QUALITY} onChange={v=>upd(i,'tagsQ',v)} />}</Cell>
                  <Cell w={90}><Inp value={r.updated} onChange={v=>upd(i,'updated',v)} placeholder="MM/DD" mono /></Cell>
                  <Cell w={120}><Inp value={r.action} onChange={v=>upd(i,'action',v)} /></Cell>
                </TR>
              )
            })}
          </tbody>
        </table>
      </div>
      <SectionHead>Weekly Checklist</SectionHead>
      <CheckList items={['Update Views, Visits, Favs, Orders for each active listing','Views > 50 but Orders = 0 → fix mockup or title','Conv rate < 1% → action needed','Update "Updated" date for any listing you touched']} />
    </div>
  )
}

// ── TAB 3 ─────────────────────────────────────────────────────
function StackTab({ rows, setRows }: { rows: StackRow[]; setRows: (r:StackRow[])=>void }) {
  const upd = (i:number, k:keyof StackRow, v:string) => { const n=[...rows]; n[i]={...n[i],[k]:v}; setRows(n) }
  const totalMo      = rows.reduce((a,r)=>a+(parseFloat(r.moCost)||0),0)
  const needDecision = rows.filter(r=>r.decision==='CANCEL'||r.decision==='REVIEW').length
  const activeCount  = rows.filter(r=>r.status==='Active').length

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' as const }}>
        <StatCard label="Monthly Tool Cost" value={'$'+totalMo.toFixed(2)} accent />
        <StatCard label="Need Decision" value={needDecision+' tools'} accent={needDecision>0} />
        <StatCard label="Active Tools" value={activeCount} />
      </div>
      <div style={{ background:'#1C0B0F', border:'1px solid #3a1a1a', borderRadius:6, padding:'10px 16px', marginBottom:16, fontSize:12, color:'var(--red)', display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ fontFamily:'DM Mono, monospace', fontWeight:600 }}>RULE</span>
        <span style={{ color:'var(--text2)' }}>Any tool with Monthly Cost &gt; $0 and Value ≤ 2 → CANCEL immediately.</span>
      </div>
      <div style={{ overflowX:'auto' as const, borderRadius:8, border:'1px solid var(--border)' }}>
        <table>
          <thead>
            <tr>
              {['Tool','Category','Purpose','Accounts','Mo $','Login','Renewal','Status','Value','Problems','Replacement','Decision','Notes'].map(h=><TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <TR key={i} i={i}>
                <Cell w={160}><span style={{ fontWeight:500, color:'var(--text)' }}>{r.tool}</span></Cell>
                <Cell w={100}><span style={{ fontFamily:'DM Mono, monospace', fontSize:11, color:'var(--text2)' }}>{r.category}</span></Cell>
                <Cell w={220}><Inp value={r.purpose} onChange={v=>upd(i,'purpose',v)} /></Cell>
                <Cell w={180}><Inp value={r.accounts} onChange={v=>upd(i,'accounts',v)} /></Cell>
                <Cell w={70}><Inp value={r.moCost} onChange={v=>upd(i,'moCost',v)} placeholder="0" mono /></Cell>
                <Cell w={180}><Inp value={r.loginEmail} onChange={v=>upd(i,'loginEmail',v)} /></Cell>
                <Cell w={100}><Inp value={r.renewal} onChange={v=>upd(i,'renewal',v)} /></Cell>
                <Cell w={90}><Sel value={r.status} opts={STATUSES} onChange={v=>upd(i,'status',v)} /></Cell>
                <Cell w={70}><Sel value={r.value} opts={['','1','2','3','4','5']} onChange={v=>upd(i,'value',v)} /></Cell>
                <Cell w={180}><Inp value={r.problems} onChange={v=>upd(i,'problems',v)} /></Cell>
                <Cell w={160}><Inp value={r.replacement} onChange={v=>upd(i,'replacement',v)} /></Cell>
                <Cell w={90}>
                  <select value={r.decision} onChange={e=>upd(i,'decision',e.target.value)}
                    style={{ background: r.decision==='KEEP'?'#0A1F0E':r.decision==='CANCEL'?'#1C0B0F':'#1C1600', border:`1px solid ${r.decision==='KEEP'?'#3FB950':r.decision==='CANCEL'?'#E94560':'#D29922'}`, color: r.decision==='KEEP'?'#3FB950':r.decision==='CANCEL'?'#E94560':'#D29922', fontSize:11, fontWeight:600, borderRadius:4, padding:'3px 6px', width:'100%', fontFamily:'DM Mono, monospace' }}>
                    {DECISIONS.map(d=><option key={d} style={{ background:'var(--bg3)', color:'var(--text)' }}>{d}</option>)}
                  </select>
                </Cell>
                <Cell w={200}><Inp value={r.notes} onChange={v=>upd(i,'notes',v)} /></Cell>
              </TR>
            ))}
          </tbody>
        </table>
      </div>
      <SectionHead>Monthly Cancel/Keep Review</SectionHead>
      <CheckList items={['Total monthly cost — going up or down?','Any tool: Value ≤ 2 AND cost > $0 → CANCEL','Any REVIEW sitting for 2+ months → force a decision','Check overlap: ChatGPT vs Claude, Replit vs Vercel','Check renewal dates — anything billing in 30 days?']} />
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const [traffic, setTraffic] = useState<TrafficRow[]>(defaultTraffic)
  const [products, setProducts] = useState<ProductRow[]>(defaultProducts)
  const [stack, setStack] = useState<StackRow[]>(defaultStack)
  const [saved, setSaved] = useState('')

  useEffect(()=>{
    try {
      const t=localStorage.getItem('d_traffic'); if(t) setTraffic(JSON.parse(t))
      const p=localStorage.getItem('d_products'); if(p) setProducts(JSON.parse(p))
      const s=localStorage.getItem('d_stack'); if(s) setStack(JSON.parse(s))
    } catch {}
  },[])

  const save = () => {
    localStorage.setItem('d_traffic',JSON.stringify(traffic))
    localStorage.setItem('d_products',JSON.stringify(products))
    localStorage.setItem('d_stack',JSON.stringify(stack))
    setSaved('Saved'); setTimeout(()=>setSaved(''),2000)
  }

  const date = new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'})

  return (
    <div style={{ maxWidth:1600, margin:'0 auto', padding:'0 24px 48px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 0 20px', borderBottom:'1px solid var(--border)', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:600, color:'var(--text)', letterSpacing:'-0.02em' }}>Mattpom Digital Ventures</div>
          <div style={{ fontSize:12, color:'var(--text3)', fontFamily:'DM Mono, monospace', marginTop:2 }}>Business Dashboard · {date}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {saved && <span style={{ fontSize:12, color:'var(--green)', fontFamily:'DM Mono, monospace' }}>{saved} ✓</span>}
          <button onClick={save} style={{ background:'var(--red)', color:'#fff', border:'none', borderRadius:6, padding:'8px 20px', fontSize:13, fontWeight:600, letterSpacing:'0.01em' }}>
            Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:28 }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:'8px 18px', border:'none', borderRadius:6, fontSize:13, fontWeight: tab===t.id ? 600 : 400,
            background: tab===t.id ? 'var(--bg3)' : 'transparent',
            color: tab===t.id ? 'var(--text)' : 'var(--text2)',
            borderBottom: tab===t.id ? '2px solid var(--red)' : '2px solid transparent',
            transition:'all 0.15s', display:'flex', gap:8, alignItems:'center'
          }}>
            <span style={{ fontFamily:'DM Mono, monospace', fontSize:11, opacity:0.7 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab===0 && <TrafficTab rows={traffic} setRows={setTraffic} />}
      {tab===1 && <ProductsTab rows={products} setRows={setProducts} />}
      {tab===2 && <StackTab rows={stack} setRows={setStack} />}
    </div>
  )
}
