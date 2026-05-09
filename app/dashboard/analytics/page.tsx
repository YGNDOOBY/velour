export default function AnalyticsPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif', display:'flex' }}>
      <div style={{ width:220, background:'#0F0C1A', borderRight:'1px solid rgba(255,255,255,0.07)', position:'fixed', top:0, bottom:0 }}>
        <div style={{ padding:'24px', fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:4, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</div>
        {[{label:'Overview',href:'/dashboard'},{label:'Songs',href:'/dashboard/songs'},{label:'Gifts',href:'/dashboard/gifts'},{label:'Analytics',href:'/dashboard/analytics'},{label:'Settings',href:'/dashboard/settings'}].map(l => (
          <a key={l.href} href={l.href} style={{ display:'block', padding:'11px 24px', fontSize:13, fontWeight:600, color: l.href==='/dashboard/analytics' ? '#A78BFA' : '#8E8AA0', textDecoration:'none', borderLeft: l.href==='/dashboard/analytics' ? '2px solid #8B5CF6' : '2px solid transparent', background: l.href==='/dashboard/analytics' ? 'rgba(139,92,246,0.1)' : 'transparent' }}>{l.label}</a>
        ))}
      </div>
      <div style={{ marginLeft:220, flex:1, padding:'40px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:300, marginBottom:32 }}>Analytics — <em style={{color:'#A78BFA'}}>coming soon</em></h1>
      </div>
    </div>
  )
}