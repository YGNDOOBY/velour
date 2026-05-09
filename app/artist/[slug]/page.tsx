import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GiftButtons from './GiftButtons'

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: artist } = await supabase
    .from('artist_profiles')
    .select('*, social_links(*)')
    .eq('slug', slug)
    .single()

  if (!artist) notFound()

  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .eq('artist_id', artist.id)
    .eq('is_published', true)
    .order('display_order')

  const { data: giftTypes } = await supabase
    .from('gift_types')
    .select('*')
    .order('sort_order')

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 32px', background:'rgba(5,4,10,0.85)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
        <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', padding:'9px 20px', borderRadius:4, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', textDecoration:'none' }}>Get Your Page</a>
      </nav>

      <div style={{ height:340, marginTop:57, position:'relative', background:'#0F0C1A', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${artist.accent_color}40 0%, rgba(5,4,10,0.95) 100%)` }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 40px 32px', display:'flex', alignItems:'flex-end', gap:24 }}>
          <div style={{ width:100, height:100, borderRadius:'50%', background:'#1E1935', border:'4px solid #05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:700, color:'#C4C4D4', position:'relative', bottom:-16 }}>
            {artist.display_name.slice(0,2).toUpperCase()}
          </div>
          <div style={{ paddingBottom:4 }}>
            <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#A78BFA', marginBottom:6 }}>✦ Independent Artist</div>
            <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:700, lineHeight:1, marginBottom:6 }}>{artist.display_name}</h1>
            <p style={{ fontSize:12, letterSpacing:1.5, color:'#7A7A8F', textTransform:'uppercase' }}>{artist.genre}{artist.location ? ` · ${artist.location}` : ''}</p>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', maxWidth:1100, margin:'0 auto', padding:'32px 40px 60px', gap:32 }}>
        <div>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:16 }}>Music</div>
            {!songs?.length && <p style={{ color:'#8E8AA0' }}>No songs yet.</p>}
            {songs?.map((s, i) => (
              <div key={s.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderRadius:10, marginBottom:6, border:'1px solid rgba(255,255,255,0.07)', background:'#0F0C1A' }}>
                <span style={{ fontSize:12, color:'#7A7A8F', width:20, textAlign:'center' }}>{i + 1}</span>
                <div style={{ width:44, height:44, background:'#16122A', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🎵</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:'#8E8AA0' }}>{s.play_count} plays</div>
                </div>
                <audio controls src={s.audio_url} style={{ height:32 }} />
              </div>
            ))}
          </div>
          {artist.bio && (
            <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
              <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:12 }}>About</div>
              <p style={{ fontSize:14, color:'#8E8AA0', lineHeight:1.8 }}>{artist.bio}</p>
            </div>
          )}
        </div>

        <div style={{ paddingTop:8 }}>
          <GiftButtons giftTypes={giftTypes || []} artistId={artist.id} />
        </div>
      </div>
    </div>
  )
}