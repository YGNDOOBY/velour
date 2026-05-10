export default function PrivacyPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
      </nav>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'60px 24px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, marginBottom:8 }}>Privacy <em style={{color:'#A78BFA'}}>Policy</em></h1>
        <p style={{ color:'#8E8AA0', marginBottom:48, fontSize:14 }}>Last updated: May 2025</p>
        {[
          { title:'Information We Collect', body:'We collect information you provide when creating an account (name, email), uploading music, or making a payment. Payment information is processed directly by Stripe and is never stored on our servers.' },
          { title:'How We Use Your Information', body:'We use your information to operate the platform, process payments, display your name on gifts you send, and communicate with you about your account.' },
          { title:'Information Sharing', body:'We do not sell your personal information. We share data only with Stripe for payment processing and Supabase for secure data storage. Both are industry-leading providers with strict security practices.' },
          { title:'Artist Payouts', body:'When you connect a Stripe account as an artist, your payout information is handled entirely by Stripe. Velour.fm does not store your banking details.' },
          { title:'Fan Data', body:'Fan names entered during gift checkout are displayed publicly on artist pages as part of the supporter experience. Anonymous gifts are recorded without any personally identifying information.' },
          { title:'Data Security', body:'We use industry-standard encryption and security practices. Our database is hosted on Supabase with row-level security policies that ensure users can only access their own data.' },
          { title:'Your Rights', body:'You may request deletion of your account and associated data at any time by emailing support@velour.fm. We will process all deletion requests within 30 days.' },
          { title:'Contact', body:'For privacy-related questions, contact us at privacy@velour.fm.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom:36 }}>
            <h2 style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, fontWeight:600, color:'#F0EEF8', marginBottom:10 }}>{s.title}</h2>
            <p style={{ fontSize:14, color:'#8E8AA0', lineHeight:1.9 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}