import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: artist } = await supabase
    .from('artist_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!artist) redirect('/onboarding')

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*, gift_types(*)')
    .eq('artist_id', artist.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .eq('artist_id', artist.id)
    .order('display_order')

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif', display:'flex' }}>
      
      {/* SIDEBAR */}
      <div style={{ width:220, background:'#0F0C1A', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0 }}>
        <div style={{ padding:'24px', fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:4, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          VEL<span style={{color:'#8B5CF6'}}>◈</span>UR
        </div>
        <div style={{ padding:'16px 0', flex:1 }}>
          {[
            { label:'Overview', href:'/dashboard', icon:'◈' },
            { label:'Songs', href:'/dashboard/songs', icon:'♪' },
            { label:'Gifts', href:'/dashboard/gifts', icon:'🎁' },
            { label:'Analytics', href:'/dashboard/analytics', icon:'📊' },
            { label:'Settings', href:'/dashboard/settings', icon:'⚙' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 24px', fontSize:13, fontWeight:600, color:'#8E8AA0', textDecoration:'none', borderLeft:'2px solid transparent' }}>
              <span>{link.icon}</span>{link.label}
            </a>
          ))}
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <a href={`/artist/${artist.slug}`} style={{ display:'block', textAlign:'center', border:'1px solid rgba(255,255,255,0.07)', color:'#8E8AA0', padding:'10px', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', textDecoration:'none' }}>
            ↗ View My Page
          </a>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft:220, flex:1, padding:'40px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:300, marginBottom:32 }}>
          Welcome back, <em style={{color:'#A78BFA'}}>{artist.display_name}</em>
        </h1>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:36 }}>
          {[
            { label:'Total Earned', value:`$${artist.total_received}` },
            { label:'Supporters', value:artist.supporter_count },
            { label:'Songs', value:songs?.length || 0 },
            { label:'Your URL', value:`velour.fm/${artist.slug}` },
          ].map(s => (
            <div key={s.label} style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'20px 24px' }}>
              <div style={{ fontSize:10, letterSpacing:2.5, textTransform:'uppercase', color:'#8E8AA0', marginBottom:10 }}>{s.label}</div>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:600 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* RECENT GIFTS */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Recent Gifts</div>
          {!gifts?.length && <p style={{ color:'#8E8AA0', fontSize:14 }}>No gifts yet — share your page to get started.</p>}
          {gifts?.map(g => (
            <div key={g.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize:22 }}>{g.gift_types?.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{g.fan_display_name}</div>
                <div style={{ fontSize:12, color:'#8E8AA0' }}>{g.gift_types?.name}</div>
              </div>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600, color:'#22C55E' }}>
                +${(g.artist_payout_cents / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* SONGS */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700 }}>Your Songs</div>
            <a href="/dashboard/songs" style={{ fontSize:12, color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Manage →</a>
          </div>
          {!songs?.length && <p style={{ color:'#8E8AA0', fontSize:14 }}>No songs yet — <a href="/dashboard/songs" style={{ color:'#A78BFA' }}>upload your first track</a>.</p>}
          {songs?.map(s => (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:36, height:36, background:'#16122A', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎵</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{s.title}</div>
                <div style={{ fontSize:12, color:'#8E8AA0' }}>{s.play_count} plays</div>
              </div>
              <div style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background: s.is_published ? 'rgba(34,197,94,0.1)' : 'rgba(122,122,143,0.1)', color: s.is_published ? '#22C55E' : '#7A7A8F' }}>
                {s.is_published ? 'Published' : 'Draft'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}