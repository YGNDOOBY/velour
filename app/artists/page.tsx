import { createClient } from '@/lib/supabase/server'

export default async function ArtistsPage() {
  const supabase = await createClient()
  const { data: artists } = await supabase
    .from('artist_profiles')
    .select('*')
    .eq('is_active', true)
    .order('supporter_count', { ascending: false })

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
        <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'8px 16px', borderRadius:4, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>Get Your Page</a>
      </nav>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'60px 24px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, marginBottom:8 }}>All <em style={{color:'#A78BFA'}}>Artists</em></h1>
        <p style={{ color:'#8E8AA0', marginBottom:48, fontSize:15 }}>Discover and support independent artists on Velour.fm</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:16 }}>
          {artists?.map(artist => (
            <a key={artist.id} href={`/artist/${artist.slug}`} style={{ textDecoration:'none', background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden', display:'block' }}>
              <div style={{ height:100, background:`linear-gradient(135deg, ${artist.accent_color}40 0%, rgba(5,4,10,0.9) 100%)`, position:'relative' }}>
                <span style={{ position:'absolute', bottom:8, left:12, fontSize:9, letterSpacing:2, color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>velour.fm/{artist.slug}</span>
              </div>
              <div style={{ padding:'14px 16px 18px' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'#1E1935', border:'3px solid #05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant, serif', fontSize:16, color:'#C4C4D4', marginTop:-28, marginBottom:8 }}>
                  {artist.display_name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:'#F0EEF8', marginBottom:3 }}>{artist.display_name}</div>
                <div style={{ fontSize:10, letterSpacing:1, color:'#A78BFA', textTransform:'uppercase', marginBottom:8 }}>{artist.genre}</div>
                <div style={{ fontSize:12, color:'#8E8AA0' }}>{artist.supporter_count} supporters</div>
              </div>
            </a>
          ))}
          {!artists?.length && <p style={{ color:'#8E8AA0' }}>No artists yet.</p>}
        </div>
      </div>
    </div>
  )
}