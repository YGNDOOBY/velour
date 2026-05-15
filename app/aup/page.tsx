export default function AUPPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR<span style={{color:'#8B5CF6'}}>.FM</span></a>
      </nav>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'60px 24px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, marginBottom:8 }}>Acceptable <em style={{color:'#A78BFA'}}>Use Policy</em></h1>
        <p style={{ color:'#8E8AA0', marginBottom:48, fontSize:14 }}>Last updated: May 2026</p>

        {[
          {
            title: 'Overview',
            body: 'This Acceptable Use Policy ("AUP") governs all content uploaded to and activity conducted on Velour.fm. By creating an account or using our platform, you agree to comply with this policy. Violations may result in content removal, demonetization, or account suspension.'
          },
          {
            title: 'Prohibited Content',
            body: 'The following content is strictly prohibited on Velour.fm: (1) Content that infringes on any third-party intellectual property rights, including copyrighted music, beats, or recordings you do not own or have explicit license to distribute. (2) Content that promotes hatred, violence, or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or national origin. (3) Sexually explicit or pornographic content. (4) Content that harasses, threatens, or intimidates any individual. (5) Spam, misleading content, or impersonation of other artists or public figures. (6) Content that facilitates or promotes illegal activity. (7) Malware, phishing attempts, or any malicious code.'
          },
          {
            title: 'Copyright and Intellectual Property',
            body: 'All music uploaded to Velour.fm must be original content that you own or have explicit rights to distribute. You may not upload tracks that sample, interpolate, or reproduce copyrighted material without proper licensing. Velour.fm complies with the Digital Millennium Copyright Act (DMCA). Rights holders may submit takedown requests to legal@velour.fm. We will process all valid DMCA takedown notices within 48 hours.'
          },
          {
            title: 'DMCA Takedown Process',
            body: 'To submit a DMCA takedown notice, email legal@velour.fm with: (1) Your name and contact information. (2) Identification of the copyrighted work claimed to be infringed. (3) The URL of the infringing content on Velour.fm. (4) A statement that you have a good faith belief that the use is not authorized. (5) A statement that the information is accurate, under penalty of perjury. We will respond within 48 hours and remove infringing content promptly upon receiving a valid notice.'
          },
          {
            title: 'Monetization Eligibility',
            body: 'To receive payments through Velour.fm, creators must comply with all aspects of this AUP. Accounts found in violation of this policy will be demonetized immediately. Creators may appeal demonetization decisions by contacting support@velour.fm within 30 days.'
          },
          {
            title: 'Strike System and Enforcement',
            body: 'Velour.fm operates a three-strike enforcement system. Strike 1: A formal warning is issued and the violating content is removed. Strike 2: The account is demonetized and removed from discovery. Strike 3: The account is permanently suspended and all pending payouts are held pending review. Serious violations including child exploitation, threats of violence, or fraud may result in immediate permanent suspension without prior warning and referral to law enforcement.'
          },
          {
            title: 'Reporting Violations',
            body: 'Every creator profile and track on Velour.fm includes a Report button. Users may report content for copyright infringement, stolen music, harassment, hate speech, explicit content, or spam. All reports are reviewed by our Trust & Safety team within 72 hours. Reporters will receive a notification when their report has been reviewed.'
          },
          {
            title: 'Platform Monitoring',
            body: 'Velour.fm actively monitors the platform for policy violations. We use automated detection systems to flag potentially violating content at the time of upload. Our Trust & Safety team reviews flagged content and takes appropriate action. We maintain a complete audit log of all enforcement actions for compliance purposes.'
          },
          {
            title: 'Appeals',
            body: 'Creators who believe their content was removed or their account was actioned in error may appeal by emailing appeals@velour.fm within 30 days of the action. Include your account information and a detailed explanation of why you believe the action was taken in error. We will review all appeals within 5 business days.'
          },
          {
            title: 'Contact',
            body: 'For AUP-related questions: legal@velour.fm. For DMCA takedowns: legal@velour.fm. For appeals: appeals@velour.fm. For general support: support@velour.fm.'
          },
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