export default function FAQPage() {
  const faqs = [
    { q: 'What is Velour.fm?', a: 'Velour.fm is a direct support platform for independent artists. Fans visit an artist\'s page, listen to their music, and send gifts that go straight to the artist — no label, no middleman.' },
    { q: 'How much of my gift goes to the artist?', a: '90% of every gift goes directly to the artist via Stripe. Velour.fm retains 10% to cover platform costs and payment processing.' },
    { q: 'How do I support an artist?', a: 'Visit any artist\'s page at velour.fm/artistname, choose a gift from $1 to $100, enter your name, and complete the secure Stripe checkout. No account needed.' },
    { q: 'How do artists receive their money?', a: 'Artists connect their Stripe account through our onboarding process. Payments are transferred directly to their connected bank account.' },
    { q: 'How do I create an artist page?', a: 'Click "Get Your Page" on the homepage, sign up as an artist, complete your onboarding, and your page is live at velour.fm/yourname.' },
    { q: 'Can I upload unlimited songs?', a: 'Yes. Artists can upload as many songs as they want. There are no limits on catalog size.' },
    { q: 'Is my payment information secure?', a: 'All payments are processed by Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide. Velour.fm never stores your card information.' },
    { q: 'Can fans create accounts?', a: 'Yes. Fans can create free accounts so their name appears on gifts and they can track their support history.' },
    { q: 'What file formats are supported for music?', a: 'We support MP3, WAV, and FLAC files up to 50MB per track.' },
    { q: 'How do I contact support?', a: 'Email us at support@velour.fm for any questions or issues.' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
      </nav>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'60px 24px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, marginBottom:8 }}>Frequently Asked <em style={{color:'#A78BFA'}}>Questions</em></h1>
        <p style={{ color:'#8E8AA0', marginBottom:48, fontSize:15 }}>Everything you need to know about Velour.fm</p>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ padding:'24px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#F0EEF8', marginBottom:8 }}>{f.q}</div>
              <p style={{ fontSize:14, color:'#8E8AA0', lineHeight:1.8 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}