import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function FanPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('full_name', username)
    .single()

  if (!profile) notFound()

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*, gift_types(*), artist_profiles(display_name, slug, accent_color)')
    .eq('fan_display_name', username)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  const totalSent = gifts?.reduce((sum, g) => sum + g.amount_cents, 0) || 0
  const artistsSupported = [...new Set(gifts?.map(g => g.artist_profiles?.slug))].length

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'rgba(5,4,10,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:700, letterSpacing:4, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
      </nav>

      <div style={{ paddingTop:49 }}>
        {/* PROFILE HEADER */}
        <div style={{ background:'#0F0C1A', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'40px 20px 32px' }}>
          <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(139,92,246,0.2)', border:'2px solid rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant, serif', fontSize:32, color:'#A78BFA', margin:'0 auto 16px' }}>
              {username.slice(0,2).toUpperCase()}
            </div>
            <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:300, marginBottom:4 }}>{username}</h1>
            <p style={{ fontSize:11, letterSpacing:2, color:'#8E8AA0', textTransform:'uppercase', marginBottom:24 }}>VELOUR Supporter</p>
            <div style={{ display:'flex', justifyContent:'center', gap:32 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:600 }}>${(totalSent/100).toFixed(0)}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:'#8E8AA0', textTransform:'uppercase', marginTop:2 }}>Total Gifted</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:600 }}>{gifts?.length || 0}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:'#8E8AA0', textTransform:'uppercase', marginTop:2 }}>Gifts Sent</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:600 }}>{artistsSupported}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:'#8E8AA0', textTransform:'uppercase', marginTop:2 }}>Artists</div>
              </div>
            </div>
          </div>
        </div>

        {/* GIFT HISTORY */}
        <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 20px' }}>
          <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:16 }}>Gift History</div>
          {!gifts?.length && <p style={{ color:'#8E8AA0', fontSize:14 }}>No gifts yet.</p>}
          {gifts?.map(g => (
            <div key={g.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:24, flexShrink:0 }}>{g.gift_types?.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, color:'#F0EEF8', fontWeight:600 }}>{g.gift_types?.name}</p>
                <p style={{ fontSize:12, color:'#8E8AA0' }}>
                  to <a href={`/artist/${g.artist_profiles?.slug}`} style={{ color:'#A78BFA', textDecoration:'none' }}>{g.artist_profiles?.display_name}</a>
                </p>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600 }}>${(g.amount_cents/100).toFixed(0)}</div>
                <div style={{ fontSize:11, color:'#8E8AA0' }}>{new Date(g.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}