'use client'

export default function GiftButtons({ giftTypes, artistId }: { giftTypes: any[], artistId: string }) {
  async function sendGift(giftTypeId: string) {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        giftTypeId,
        artistId,
        fanName: 'Anonymous',
      }),
    })
    const { url, error } = await res.json()
    if (error) { alert(error); return }
    window.location.href = url
  }

  return (
    <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20, marginBottom:20 }}>
      <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:600, marginBottom:4, color:'#F0EEF8' }}>Send a Gift</div>
      <p style={{ fontSize:12, color:'#8E8AA0', marginBottom:16 }}>90% goes directly to the artist.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {giftTypes?.map(g => (
          <button key={g.id} onClick={() => sendGift(g.id)}
            style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 10px', textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget.style.transform='translateY(-3px)'); (e.currentTarget.style.borderColor='rgba(139,92,246,0.4)') }}
            onMouseLeave={e => { (e.currentTarget.style.transform='translateY(0)'); (e.currentTarget.style.borderColor='rgba(255,255,255,0.07)') }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{g.emoji}</div>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#7A7A8F', marginBottom:2 }}>{g.name}</div>
            <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600, color:'#F0EEF8' }}>${g.amount_cents / 100}</div>
          </button>
        ))}
      </div>
    </div>
  )
}