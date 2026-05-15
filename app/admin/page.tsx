import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'dexterbolt777@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const { data: reports } = await supabase
    .from('reports')
    .select('*, artist_profiles(display_name, slug)')
    .order('created_at', { ascending: false })

  const { data: violations } = await supabase
    .from('violations')
    .select('*, artist_profiles(display_name, slug)')
    .order('created_at', { ascending: false })

  const { data: artists } = await supabase
    .from('artist_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const pendingReports = reports?.filter(r => r.status === 'pending') || []
  const resolvedReports = reports?.filter(r => r.status !== 'pending') || []

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif', padding:'40px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <div>
            <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:40, fontWeight:300, marginBottom:4 }}>
              Admin <em style={{color:'#A78BFA'}}>Dashboard</em>
            </h1>
            <p style={{ color:'#8E8AA0', fontSize:13 }}>Velour.fm Trust & Safety</p>
          </div>
          <a href="/" style={{ color:'#8E8AA0', textDecoration:'none', fontSize:13 }}>← Back to site</a>
        </div>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:40 }}>
          {[
            { label:'Total Creators', value: artists?.length || 0, color:'#8B5CF6' },
            { label:'Pending Reports', value: pendingReports.length, color:'#EF4444' },
            { label:'Resolved Reports', value: resolvedReports.length, color:'#22C55E' },
            { label:'Total Violations', value: violations?.length || 0, color:'#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:600, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* PENDING REPORTS */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, marginBottom:24 }}>
          <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, fontWeight:600, marginBottom:20, color:'#EF4444' }}>
            ⚠ Pending Reports ({pendingReports.length})
          </h2>
          {pendingReports.length === 0 && <p style={{ color:'#8E8AA0', fontSize:14 }}>No pending reports.</p>}
          {pendingReports.map(r => (
            <div key={r.id} style={{ padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#F0EEF8', marginBottom:4 }}>
                    {r.reason}
                  </div>
                  <div style={{ fontSize:12, color:'#8E8AA0', marginBottom:4 }}>
                    Profile: <a href={`/artist/${r.artist_profiles?.slug}`} style={{ color:'#A78BFA', textDecoration:'none' }}>{r.artist_profiles?.display_name}</a>
                    {r.reported_song_id && <span style={{ marginLeft:8, color:'#7A7A8F' }}>• Track reported</span>}
                  </div>
                  {r.details && <div style={{ fontSize:12, color:'#7A7A8F', fontStyle:'italic' }}>"{r.details}"</div>}
                  <div style={{ fontSize:11, color:'#7A7A8F', marginTop:4 }}>{new Date(r.created_at).toLocaleString()}</div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <a href={`/admin/resolve?id=${r.id}&action=dismiss`}
                    style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.1)', color:'#8E8AA0', padding:'8px 14px', borderRadius:6, fontSize:11, textDecoration:'none', fontWeight:600 }}>
                    Dismiss
                  </a>
                  <a href={`/admin/resolve?id=${r.id}&action=warn`}
                    style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', color:'#F59E0B', padding:'8px 14px', borderRadius:6, fontSize:11, textDecoration:'none', fontWeight:600 }}>
                    Warn
                  </a>
                  <a href={`/admin/resolve?id=${r.id}&action=suspend`}
                    style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'8px 14px', borderRadius:6, fontSize:11, textDecoration:'none', fontWeight:600 }}>
                    Suspend
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ALL CREATORS */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, marginBottom:24 }}>
          <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, fontWeight:600, marginBottom:20 }}>
            All Creators ({artists?.length || 0})
          </h2>
          {artists?.map(a => (
            <div key={a.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'#16122A', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#C4C4D4', flexShrink:0 }}>
                {a.avatar_url ? <img src={a.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : a.display_name.slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{a.display_name}</div>
                <div style={{ fontSize:11, color:'#8E8AA0' }}>velour.fm/{a.slug} · {a.genre}</div>
              </div>
              <div style={{ fontSize:12, color:'#8E8AA0' }}>{new Date(a.created_at).toLocaleDateString()}</div>
              <a href={`/artist/${a.slug}`} style={{ color:'#A78BFA', textDecoration:'none', fontSize:12 }}>View →</a>
            </div>
          ))}
        </div>

        {/* VIOLATIONS LOG */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, fontWeight:600, marginBottom:20 }}>
            Violations Log ({violations?.length || 0})
          </h2>
          {violations?.length === 0 && <p style={{ color:'#8E8AA0', fontSize:14 }}>No violations recorded.</p>}
          {violations?.map(v => (
            <div key={v.id} style={{ display:'flex', gap:16, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#EF4444', flexShrink:0 }}>
                {v.strike_number}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{v.artist_profiles?.display_name}</div>
                <div style={{ fontSize:12, color:'#8E8AA0' }}>{v.reason}</div>
                <div style={{ fontSize:11, color:'#7A7A8F' }}>{v.action_taken} · {new Date(v.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}