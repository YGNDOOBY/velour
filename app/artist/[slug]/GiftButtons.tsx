'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GiftButtons({ giftTypes, artistId }: { giftTypes: any[], artistId: string }) {
  const [fanName, setFanName] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  async function sendGift(giftTypeId: string) {
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    let displayName = fanName.trim() || 'Anonymous'
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      if (profile?.full_name) displayName = profile.full_name
    }
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giftTypeId, artistId, fanName: displayName }),
    })
    const { url, error } = await res.json()
    if (error) { alert(error); setSending(false); return }
    window.location.href = url
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Your name (optional)"
        value={fanName}
        onChange={e => setFanName(e.target.value)}
        style={{ width:'100%', background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'12px 14px', borderRadius:8, fontSize:13, fontFamily:'Syne, sans-serif', outline:'none', marginBottom:12 }}
      />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
        {giftTypes?.map(g => (
          <button key={g.id} onClick={() => sendGift(g.id)} disabled={sending}
            style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 8px', textAlign:'center', cursor:'pointer', WebkitTapHighlightColor:'transparent', opacity: sending ? 0.6 : 1 }}
            onTouchStart={e => (e.currentTarget.style.transform='scale(0.96)')}
            onTouchEnd={e => (e.currentTarget.style.transform='scale(1)')}>
            <div style={{ fontSize:28, marginBottom:6 }}>{g.emoji}</div>
            <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'#7A7A8F', marginBottom:2 }}>{g.name}</div>
            <div style={{ fontFamily:'Cormorant Garant, serif', fontSize:18, fontWeight:600, color:'#F0EEF8' }}>${g.amount_cents / 100}</div>
          </button>
        ))}
      </div>
    </div>
  )
}