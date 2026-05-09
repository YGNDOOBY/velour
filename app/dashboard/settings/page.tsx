'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [artist, setArtist] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [bio, setBio] = useState('')
  const [genre, setGenre] = useState('')
  const [location, setLocation] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('artist_profiles').select('*').eq('user_id', user.id).single()
      if (data) { setArtist(data); setBio(data.bio || ''); setGenre(data.genre || ''); setLocation(data.location || '') }
    }
    load()
  }, [])

  async function saveProfile() {
    setLoading(true)
    const { error } = await supabase.from('artist_profiles').update({ bio, genre, location }).eq('id', artist.id)
    setMsg(error ? error.message : '✓ Saved!')
    setLoading(false)
  }

  async function connectStripe() {
    setLoading(true)
    const res = await fetch('/api/stripe/connect', { method: 'POST' })
    const { url, error } = await res.json()
    if (error) { setMsg(error); setLoading(false); return }
    window.location.href = url
  }

  const inp: React.CSSProperties = { background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'12px 16px', borderRadius:8, fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', width:'100%' }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif', display:'flex' }}>
      <div style={{ width:220, background:'#0F0C1A', borderRight:'1px solid rgba(255,255,255,0.07)', position:'fixed', top:0, bottom:0 }}>
        <div style={{ padding:'24px', fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:4, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</div>
        {[{label:'Overview',href:'/dashboard'},{label:'Songs',href:'/dashboard/songs'},{label:'Gifts',href:'/dashboard/gifts'},{label:'Analytics',href:'/dashboard/analytics'},{label:'Settings',href:'/dashboard/settings'}].map(l => (
          <a key={l.href} href={l.href} style={{ display:'block', padding:'11px 24px', fontSize:13, fontWeight:600, color: l.href==='/dashboard/settings' ? '#A78BFA' : '#8E8AA0', textDecoration:'none', borderLeft: l.href==='/dashboard/settings' ? '2px solid #8B5CF6' : '2px solid transparent', background: l.href==='/dashboard/settings' ? 'rgba(139,92,246,0.1)' : 'transparent' }}>{l.label}</a>
        ))}
      </div>

      <div style={{ marginLeft:220, flex:1, padding:'40px', maxWidth:700 }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:300, marginBottom:32 }}>Page <em style={{color:'#A78BFA'}}>Settings</em></h1>

        {/* STRIPE */}
        <div style={{ background: artist?.stripe_onboarded ? 'rgba(34,197,94,0.05)' : 'rgba(139,92,246,0.08)', border:`1px solid ${artist?.stripe_onboarded ? 'rgba(34,197,94,0.25)' : 'rgba(139,92,246,0.3)'}`, borderRadius:12, padding:24, marginBottom:24 }}>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>
            {artist?.stripe_onboarded ? '✓ Stripe Connected' : 'Connect Stripe to Receive Payments'}
          </div>
          <p style={{ fontSize:13, color:'#8E8AA0', marginBottom:16 }}>
            {artist?.stripe_onboarded ? 'Your Stripe account is active. Gifts go directly to you.' : 'Connect your Stripe account so fans can send you real money.'}
          </p>
          {!artist?.stripe_onboarded && (
            <button onClick={connectStripe} disabled={loading}
              style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'12px 24px', borderRadius:8, fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer' }}>
              {loading ? 'Connecting...' : 'Connect Stripe →'}
            </button>
          )}
        </div>

        {/* PROFILE */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Profile</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} style={inp} />
            <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} style={inp} />
            <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} style={{ ...inp, minHeight:100, resize:'vertical', lineHeight:1.6 }} />
            {msg && <p style={{ fontSize:13, color: msg.startsWith('✓') ? '#22C55E' : '#EF4444' }}>{msg}</p>}
            <button onClick={saveProfile} disabled={loading}
              style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'12px 24px', borderRadius:8, fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', alignSelf:'flex-start' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}