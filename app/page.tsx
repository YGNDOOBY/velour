import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: artists } = await supabase
    .from('artist_profiles')
    .select('*, songs(count)')
    .eq('is_active', true)
    .order('supporter_count', { ascending: false })
    .limit(6)

  const { data: recentGifts } = await supabase
    .from('gifts')
    .select('*, gift_types(*), artist_profiles(display_name, slug)')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', background:'rgba(5,4,10,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:26, fontWeight:700, letterSpacing:5, color:'#F0EEF8' }}>
          VEL<span style={{color:'#8B5CF6'}}>◈</span>UR
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <a href="/login" style={{ color:'#8E8AA0', textDecoration:'none', fontSize:13, fontWeight:600, padding:'9px 20px' }}>Sign In</a>
          <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'9px 20px', borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>Get Your Page</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 40px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)', backgroundSize:'60px 60px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)' } as any} />

        <p style={{ fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'#A78BFA', fontWeight:600, marginBottom:24, position:'relative' }}>The future of artist support</p>

        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(56px, 9vw, 110px)', fontWeight:300, lineHeight:0.95, color:'#F0EEF8', maxWidth:900, position:'relative', marginBottom:32 }}>
          <em style={{fontStyle:'italic', color:'#A78BFA'}}>Support</em> the artists<br />
          <span style={{ background:'linear-gradient(135deg, #C4C4D4 0%, #7A7A8F 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>who move you</span>
        </h1>

        <p style={{ fontSize:17, color:'#8E8AA0', maxWidth:480, lineHeight:1.7, position:'relative', marginBottom:48 }}>
          Independent artists. Real music. Direct support. Every gift goes straight to the artist — no label, no middleman.
        </p>

        <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', position:'relative', marginBottom:60 }}>
          <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'16px 36px', borderRadius:4, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', boxShadow:'0 0 40px rgba(139,92,246,0.35)' }}>Claim Your Page</a>
          <a href="#artists" style={{ background:'transparent', color:'#C4C4D4', textDecoration:'none', border:'1px solid rgba(196,196,212,0.2)', padding:'16px 36px', borderRadius:4, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>Discover Artists</a>
        </div>

        {/* STATS */}
        <div style={{ display:'flex', gap:48, position:'relative' }}>
          {[
            { num: artists?.length || 0, label: 'Artists' },
            { num: '$0', label: 'Sent to Artists' },
            { num: recentGifts?.length || 0, label: 'Recent Gifts' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:600, color:'#F0EEF8' }}>{s.num}</div>
              <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GIFT TYPES */}
      <div style={{ padding:'80px 40px', background:'#0F0C1A', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:16 }}>Send a gift</p>
        <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(36px, 5vw, 60px)', fontWeight:300, color:'#F0EEF8', marginBottom:48 }}>
          Six ways to <em style={{fontStyle:'italic', color:'#A78BFA'}}>show love</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:16 }}>
          {[
            { emoji:'🎵', name:'Soundwave', price:'$1' },
            { emoji:'🔥', name:'Heatwave', price:'$5' },
            { emoji:'🚀', name:'Launch', price:'$10' },
            { emoji:'👾', name:'Alien Drop', price:'$20' },
            { emoji:'💎', name:'Diamond Pulse', price:'$50' },
            { emoji:'👑', name:'Crown', price:'$100' },
          ].map(g => (
            <div key={g.name} style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'24px 16px', textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>{g.emoji}</div>
              <div style={{ fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:'#7A7A8F', marginBottom:6 }}>{g.name}</div>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:600, color:'#F0EEF8' }}>{g.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED ARTISTS */}
      <div id="artists" style={{ padding:'80px 40px' }}>
        <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:16 }}>Featured</p>
        <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(36px, 5vw, 60px)', fontWeight:300, color:'#F0EEF8', marginBottom:48 }}>
          Artists you'll <em style={{fontStyle:'italic', color:'#A78BFA'}}>love</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20 }}>
          {artists?.map(artist => (
            <a key={artist.id} href={`/artist/${artist.slug}`} style={{ textDecoration:'none', background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden', display:'block', transition:'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform='translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
              <div style={{ height:120, background:`linear-gradient(135deg, ${artist.accent_color}40 0%, rgba(5,4,10,0.9) 100%)`, position:'relative' }}>
                <span style={{ position:'absolute', bottom:8, left:12, fontSize:10, letterSpacing:2, color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>velour.fm/{artist.slug}</span>
              </div>
              <div style={{ padding:'16px 20px 20px' }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background:'#1E1935', border:'3px solid #05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant, serif', fontSize:18, color:'#C4C4D4', marginTop:-32, marginBottom:10 }}>
                  {artist.display_name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:'#F0EEF8', marginBottom:4 }}>{artist.display_name}</div>
                <div style={{ fontSize:11, letterSpacing:1, color:'#A78BFA', textTransform:'uppercase', marginBottom:12 }}>{artist.genre}</div>
                <div style={{ fontSize:12, color:'#8E8AA0' }}>{artist.supporter_count} supporters</div>
              </div>
            </a>
          ))}
          {!artists?.length && (
            <p style={{ color:'#8E8AA0', fontSize:14 }}>No artists yet — <a href="/signup" style={{ color:'#A78BFA' }}>be the first</a>.</p>
          )}
        </div>
      </div>

      {/* LIVE FEED */}
      {recentGifts && recentGifts.length > 0 && (
        <div style={{ padding:'80px 40px', background:'#0F0C1A', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:16 }}>Real-time</p>
          <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(36px, 5vw, 60px)', fontWeight:300, color:'#F0EEF8', marginBottom:48, textAlign:'center' }}>
            Happening <em style={{fontStyle:'italic', color:'#A78BFA'}}>right now</em>
          </h2>
          <div style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:10 }}>
            {recentGifts.map(g => (
              <div key={g.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
                <span style={{ fontSize:28 }}>{g.gift_types?.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, color:'#8E8AA0' }}>
                    <strong style={{ color:'#C4C4D4' }}>{g.fan_display_name}</strong> sent a {g.gift_types?.name} to{' '}
                    <a href={`/artist/${g.artist_profiles?.slug}`} style={{ color:'#A78BFA', textDecoration:'none' }}>{g.artist_profiles?.display_name}</a>
                  </p>
                </div>
                <span style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:600, color:'#F0EEF8' }}>${(g.amount_cents / 100).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      <div style={{ padding:'80px 40px' }}>
        <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:16 }}>Process</p>
        <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(36px, 5vw, 60px)', fontWeight:300, color:'#F0EEF8', marginBottom:48 }}>
          Simple by <em style={{fontStyle:'italic', color:'#A78BFA'}}>design</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden' }}>
          {[
            { num:'01', icon:'🎧', title:'Find your artist', desc:'Visit their VELOUR page. Listen to their music instantly. No app needed.' },
            { num:'02', icon:'🎁', title:'Choose a gift', desc:'Pick your support level — from a $1 Soundwave to a $100 Crown.' },
            { num:'03', icon:'⚡', title:'Direct payout', desc:'90% of every gift goes straight to the artist via Stripe. Instantly.' },
          ].map(s => (
            <div key={s.num} style={{ background:'#0F0C1A', padding:'40px 32px' }}>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:80, fontWeight:700, color:'rgba(139,92,246,0.08)', lineHeight:1, marginBottom:16 }}>{s.num}</div>
              <div style={{ fontSize:28, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, fontWeight:600, color:'#F0EEF8', marginBottom:10 }}>{s.title}</div>
              <p style={{ fontSize:14, color:'#8E8AA0', lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:'120px 40px', textAlign:'center', background:'#0F0C1A', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(40px, 6vw, 80px)', fontWeight:300, color:'#F0EEF8', maxWidth:700, margin:'0 auto 24px' }}>
          Your music.<br /><em style={{fontStyle:'italic', color:'#A78BFA'}}>Your page.</em> Your money.
        </h2>
        <p style={{ fontSize:16, color:'#8E8AA0', marginBottom:40 }}>Join independent artists already on VELOUR.</p>
        <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'18px 44px', borderRadius:4, fontSize:14, fontWeight:700, letterSpacing:2, textTransform:'uppercase', boxShadow:'0 0 40px rgba(139,92,246,0.35)', display:'inline-block' }}>
          Claim Your Page →
        </a>
      </div>

      {/* FOOTER */}
      <footer style={{ padding:'40px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:700, letterSpacing:4, color:'#8E8AA0', textTransform:'uppercase' }}>VELOUR</div>
        <div style={{ display:'flex', gap:24 }}>
          {['Artists','FAQ','Privacy','Terms'].map(l => (
            <a key={l} href="#" style={{ fontSize:12, color:'#8E8AA0', textDecoration:'none', letterSpacing:1 }}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize:11, color:'#7A7A8F' }}>© 2025 VELOUR. All rights reserved.</span>
      </footer>
    </div>
  )
}