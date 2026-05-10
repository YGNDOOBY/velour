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

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'rgba(5,4,10,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:700, letterSpacing:4, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
        <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', padding:'8px 16px', borderRadius:4, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', textDecoration:'none' }}>Get Your Page</a>
      </nav>

      {/* BANNER */}
      <div style={{ height:260, marginTop:49, position:'relative', background:'#0F0C1A', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${artist.accent_color}40 0%, rgba(5,4,10,0.95) 100%)` }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 20px 24px', display:'flex', alignItems:'flex-end', gap:16 }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'#1E1935', border:'3px solid #05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:700, color:'#C4C4D4', position:'relative', bottom:-12, flexShrink:0 }}>
            {artist.display_name.slice(0,2).toUpperCase()}
          </div>
          <div style={{ paddingBottom:4 }}>
            <div style={{ fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'#A78BFA', marginBottom:4 }}>✦ Independent Artist</div>
            <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(28px, 7vw, 48px)', fontWeight:700, lineHeight:1, marginBottom:4 }}>{artist.display_name}</h1>
            <p style={{ fontSize:11, letterSpacing:1, color:'#7A7A8F', textTransform:'uppercase' }}>{artist.genre}{artist.location ? ` · ${artist.location}` : ''}</p>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#0F0C1A' }}>
        <div style={{ flex:1, padding:'14px 0', textAlign:'center', borderRight:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:600 }}>{artist.supporter_count}</div>
          <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', marginTop:2 }}>Supporters</div>
        </div>
        <div style={{ flex:1, padding:'14px 0', textAlign:'center', borderRight:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:600 }}>{songs?.length || 0}</div>
          <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', marginTop:2 }}>Songs</div>
        </div>
        <div style={{ flex:1, padding:'14px 0', textAlign:'center' }}>
          <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:600 }}>${artist.total_received}</div>
          <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', marginTop:2 }}>Received</div>
        </div>
      </div>

      {/* GIFT BUTTONS - MOBILE FIRST */}
      <div style={{ padding:'20px 16px', background:'#05040A', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600, marginBottom:4, color:'#F0EEF8' }}>Support {artist.display_name}</div>
        <p style={{ fontSize:12, color:'#8E8AA0', marginBottom:14 }}>90% goes directly to the artist.</p>
        <GiftButtons giftTypes={giftTypes || []} artistId={artist.id} />
      </div>

      {/* SONGS */}
      <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:14 }}>Music</div>
        {!songs?.length && <p style={{ color:'#8E8AA0', fontSize:14 }}>No songs yet.</p>}
        {songs?.map((s, i) => (
          <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize:11, color:'#7A7A8F', width:18, textAlign:'center', flexShrink:0 }}>{i + 1}</span>
            <div style={{ width:40, height:40, background:'#16122A', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🎵</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</div>
              <div style={{ fontSize:11, color:'#8E8AA0' }}>{s.play_count} plays</div>
            </div>
            <audio controls src={s.audio_url} style={{ height:28, maxWidth:140 }} />
          </div>
        ))}
      </div>

      {/* BIO */}
      {artist.bio && (
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:12 }}>About</div>
          <p style={{ fontSize:14, color:'#8E8AA0', lineHeight:1.8 }}>{artist.bio}</p>
        </div>
      )}

      {/* SOCIAL */}
      {artist.social_links?.length > 0 && (
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:12 }}>Links</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {artist.social_links.map((l: any) => (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#8E8AA0', padding:'8px 14px', borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:1, textTransform:'uppercase', textDecoration:'none' }}>
                {l.platform}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ padding:'24px 16px', textAlign:'center' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:14, color:'#8E8AA0', textDecoration:'none', letterSpacing:3 }}>Powered by VEL◈UR</a>
      </div>

    </div>
  )
}