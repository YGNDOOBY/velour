'use client'

export default function GiftButtons({ giftTypes, artistId }: { giftTypes: any[], artistId: string }) {
  async function sendGift(giftTypeId: string) {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giftTypeId, artistId, fanName: 'Anonymous' }),
    })
    const { url, error } = await res.json()
    if (error) { alert(error); return }
    window.location.href = url
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
      {giftTypes?.map(g => (
        <button key={g.id} onClick={() => sendGift(g.id)}
          style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 8px', textAlign:'center', cursor:'pointer', WebkitTapHighlightColor:'transparent', transition:'transform 0.1s' }}
          onTouchStart={e => (e.currentTarget.style.transform='scale(0.96)')}
          onTouchEnd={e => (e.currentTarget.style.transform='scale(1)')}>
          <div style={{ fontSize:28, marginBottom:6 }}>{g.emoji}</div>
          <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'#7A7A8F', marginBottom:2 }}>{g.name}</div>
          <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600, color:'#F0EEF8' }}>${g.amount_cents / 100}</div>
        </button>
      ))}
    </div>
  )
}