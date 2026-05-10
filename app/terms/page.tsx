export default function TermsPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</a>
      </nav>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'60px 24px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, marginBottom:8 }}>Terms of <em style={{color:'#A78BFA'}}>Service</em></h1>
        <p style={{ color:'#8E8AA0', marginBottom:48, fontSize:14 }}>Last updated: May 2025</p>
        {[
          { title:'Acceptance of Terms', body:'By using Velour.fm you agree to these terms. If you do not agree, please do not use the platform.' },
          { title:'Platform Description', body:'Velour.fm is a digital platform that enables fans to send monetary gifts directly to independent artists. We facilitate payments but are not responsible for the content artists upload or the relationship between artists and fans.' },
          { title:'Artist Accounts', body:'Artists are responsible for the content they upload including music, images, and biographical information. Content must not infringe on third-party intellectual property rights. Artists must connect a valid Stripe account to receive payouts.' },
          { title:'Payments and Fees', body:'All gifts are final and non-refundable unless required by law. Velour.fm retains 10% of each transaction as a platform fee. Artists receive 90% minus any applicable Stripe processing fees. Stripe\'s standard processing fee is approximately 2.9% + $0.30 per transaction.' },
          { title:'Prohibited Conduct', body:'Users may not use Velour.fm for fraudulent transactions, money laundering, or any illegal activity. Artists may not upload content that violates copyright law or contains harmful material.' },
          { title:'Intellectual Property', body:'Artists retain full ownership of their music and content uploaded to Velour.fm. By uploading, artists grant Velour.fm a limited license to display and stream their content on the platform.' },
          { title:'Termination', body:'We reserve the right to suspend or terminate accounts that violate these terms. Artists will receive any outstanding balance owed prior to termination.' },
          { title:'Limitation of Liability', body:'Velour.fm is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.' },
          { title:'Contact', body:'For questions about these terms, contact us at legal@velour.fm.' },
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