import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: recentGifts } = await supabase
    .from('gifts')
    .select('*, gift_types(*), artist_profiles(display_name, slug)')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(5)

  const Logo = () => (
    <span style={{ fontFamily:'Cormorant Garant, serif', fontWeight:700, letterSpacing:5 }}>
      VEL<span style={{color:'#8B5CF6'}}>◈</span>UR<span style={{color:'#8B5CF6'}}>.FM</span>
    </span>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <style>{`
        @media (max-width: 600px) {
          .hero-title { font-size: 48px !important; }
          .gift-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .nav-pad { padding: 14px 20px !important; }
          .section-pad { padding: 60px 20px !important; }
          .hero-pad { padding: 100px 20px 60px !important; }
          .footer-inner { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 20px !important; }
        }
      `}</style>

      <nav className="nav-pad" style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', background:'rgba(5,4,10,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize:22 }}><Logo /></div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <a href="/search" style={{ color:'#8E8AA0', textDecoration:'none', fontSize:12, fontWeight:600, padding:'8px 16px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, letterSpacing:1, background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)' }}>🔍 Search Creators</a>
          <a href="/login" style={{ color:'#8E8AA0', textDecoration:'none', fontSize:13, fontWeight:600, padding:'8px 14px' }}>Sign In</a>
          <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'8px 16px', borderRadius:4, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>Get Your Page</a>
        </div>
      </nav>

      <div className="hero-pad" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 40px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
        <img src="https://bsmixodvlozzitmdwkdr.supabase.co/storage/v1/object/public/velour-images/ChatGPT%20Image%20May%2010,%202026,%2008_19_28%20PM.png" alt="Velour.FM" style={{ width:160, height:160, objectFit:'contain', marginBottom:12, position:'relative' }} />
        <p style={{ fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'#A78BFA', fontWeight:600, marginBottom:20, position:'relative' }}>THE FUTURE OF DIRECT FAN SUPPORT</p>
        <h1 className="hero-title" style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(48px, 9vw, 110px)', fontWeight:300, lineHeight:1.1, color:'#F0EEF8', maxWidth:900, position:'relative', marginBottom:28 }}>
          <em style={{fontStyle:'italic', color:'#A78BFA'}}>Your sound.</em><br />
          Your fans.<br />
          <span style={{ background:'linear-gradient(135deg, #C4C4D4 0%, #7A7A8F 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Your money.</span>
        </h1>
        <p style={{ fontSize:16, color:'#8E8AA0', maxWidth:440, lineHeight:1.7, position:'relative', marginBottom:40 }}>
          Built for independent music creators.
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', position:'relative', marginBottom:56 }}>
          <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'16px 32px', borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:2, textTransform:'uppercase', boxShadow:'0 0 40px rgba(139,92,246,0.35)' }}>Create Your Page</a>
          <a href="/artists" style={{ background:'transparent', color:'#C4C4D4', textDecoration:'none', border:'1px solid rgba(196,196,212,0.2)', padding:'16px 32px', borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>DISCOVER CREATORS</a>
        </div>
        <div style={{ position:'relative', textAlign:'center' }}>
          <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:300, color:'#F0EEF8' }}>Creators keep <em style={{color:'#A78BFA', fontStyle:'italic'}}>90%</em></div>
          <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase', color:'#8E8AA0', marginTop:2 }}>of every gift · Powered by Stripe</div>
        </div>
      </div>

      <div className="section-pad" style={{ padding:'80px 40px', background:'#0F0C1A', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:14 }}>Send a gift</p>
        <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(32px, 5vw, 56px)', fontWeight:300, color:'#F0EEF8', marginBottom:40 }}>Six ways to <em style={{color:'#A78BFA'}}>show love</em></h2>
        <div className="gift-grid" style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12 }}>
          {[
            {emoji:'🎵',name:'Soundwave',price:'$1'},
            {emoji:'🔥',name:'Heatwave',price:'$5'},
            {emoji:'🚀',name:'Launch',price:'$10'},
            {emoji:'👾',name:'Alien Drop',price:'$20'},
            {emoji:'💎',name:'Diamond Pulse',price:'$50'},
            {emoji:'👑',name:'Crown',price:'$100'},
          ].map(g => (
            <div key={g.name} style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'20px 10px', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{g.emoji}</div>
              <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#7A7A8F', marginBottom:4 }}>{g.name}</div>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:600 }}>{g.price}</div>
            </div>
          ))}
        </div>
      </div>

      {false && (recentGifts ?? []).length > 0 && (
        <div className="section-pad" style={{ padding:'80px 40px', background:'#0F0C1A', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:14 }}>Real-time</p>
          <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(32px, 5vw, 56px)', fontWeight:300, color:'#F0EEF8', marginBottom:40, textAlign:'center' }}>Happening <em style={{color:'#A78BFA'}}>right now</em></h2>
          <div style={{ maxWidth:560, margin:'0 auto', display:'flex', flexDirection:'column', gap:8 }}>
            {(recentGifts ?? []).map(g => (
              <div key={g.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{g.gift_types?.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, color:'#8E8AA0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    <strong style={{color:'#C4C4D4'}}>{g.fan_display_name}</strong> → <a href={`/artist/${g.artist_profiles?.slug}`} style={{color:'#A78BFA', textDecoration:'none'}}>{g.artist_profiles?.display_name}</a>
                  </p>
                </div>
                <span style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600, flexShrink:0 }}>${(g.amount_cents/100).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-pad" style={{ padding:'80px 40px' }}>
        <p style={{ fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#8B5CF6', fontWeight:600, marginBottom:14 }}>Process</p>
        <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(32px, 5vw, 56px)', fontWeight:300, color:'#F0EEF8', marginBottom:40 }}>Simple by <em style={{color:'#A78BFA'}}>design</em></h2>
        <div className="how-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
          {[
            {num:'01', icon:'🎧', title:'Find your creator', desc:'Visit their Velour.fm page. Listen instantly. No app needed.'},
            {num:'02', icon:'🎁', title:'Choose a gift', desc:'From a $1 Soundwave to a $100 Crown. Every amount matters.'},
            {num:'03', icon:'⚡', title:'Direct payout', desc:'90% goes straight to the creator via Stripe. Instantly.'},
          ].map(s => (
            <div key={s.num} style={{ background:'#0F0C1A', padding:'32px 24px' }}>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:60, fontWeight:700, color:'rgba(139,92,246,0.08)', lineHeight:1, marginBottom:12 }}>{s.num}</div>
              <div style={{ fontSize:24, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:600, color:'#F0EEF8', marginBottom:8 }}>{s.title}</div>
              <p style={{ fontSize:13, color:'#8E8AA0', lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:'120px 40px', textAlign:'center', background:'#0F0C1A', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:'clamp(36px, 6vw, 72px)', fontWeight:300, color:'#F0EEF8', marginBottom:20 }}>
            <em style={{fontStyle:'italic', color:'#A78BFA'}}>Your sound.</em><br />
            Your fans.<br />
            <span style={{ background:'linear-gradient(135deg, #C4C4D4 0%, #7A7A8F 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Your money.</span>
          </h2>
          <p style={{ fontSize:15, color:'#8E8AA0', marginBottom:24 }}>Join independent music creators already on Velour.fm.</p>
          <a href="/signup" style={{ background:'#8B5CF6', color:'#fff', textDecoration:'none', padding:'16px 40px', borderRadius:4, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', boxShadow:'0 0 40px rgba(139,92,246,0.35)', display:'inline-block' }}>
            Create Your Page →
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding:'48px 32px' }}>
        <div className="footer-inner" style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
          <div style={{ fontSize:18 }}><Logo /></div>
          <div style={{ display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center' }}>
            {[
              {label:'AUP', href:'/aup'},
            {label:'FAQ', href:'/faq'},
              {label:'Privacy', href:'/privacy'},
              {label:'Terms', href:'/terms'},
            ].map(l => (
              <a key={l.label} href={l.href} style={{ fontSize:12, color:'#8E8AA0', textDecoration:'none', letterSpacing:1 }}>{l.label}</a>
            ))}
          </div>
          <span style={{ fontSize:11, color:'#7A7A8F' }}>© 2026 Velour.fm</span>
        </div>
      </footer>

    </div>
  )
}