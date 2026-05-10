'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [artist, setArtist] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [bio, setBio] = useState('')
  const [genre, setGenre] = useState('')
  const [location, setLocation] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('artist_profiles').select('*').eq('user_id', user.id).single()
      if (data) {
        setArtist(data)
        setBio(data.bio || '')
        setGenre(data.genre || '')
        setLocation(data.location || '')
        setAvatarUrl(data.avatar_url || '')
        setBannerUrl(data.banner_url || '')
      }
    }
    load()
  }, [])

  async function uploadImage(file: File, type: 'avatar' | 'banner') {
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${type}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('velour-images')
      .upload(path, file, { upsert: true })

    if (uploadError) { setMsg(uploadError.message); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('velour-images').getPublicUrl(path)

    const field = type === 'avatar' ? 'avatar_url' : 'banner_url'
    const { error: updateError } = await supabase.from('artist_profiles').update({ [field]: publicUrl }).eq('id', artist.id)

    if (updateError) { setMsg(updateError.message); setUploading(false); return }

    if (type === 'avatar') setAvatarUrl(publicUrl)
    else setBannerUrl(publicUrl)

    setMsg(`✓ ${type === 'avatar' ? 'Profile photo' : 'Banner'} updated!`)
    setUploading(false)
  }

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

  const inp: React.CSSProperties = {
    background:'#16122A', border:'1px solid rgba(255,255,255,0.07)',
    color:'#F0EEF8', padding:'12px 16px', borderRadius:8,
    fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', width:'100%'
  }

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

        {/* PROFILE PHOTO */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Profile Photo</div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#16122A', border:'2px solid rgba(255,255,255,0.07)', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              ) : (
                <span style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, color:'#C4C4D4' }}>
                  {artist?.display_name?.slice(0,2).toUpperCase() || 'YG'}
                </span>
              )}
            </div>
            <div>
              <p style={{ fontSize:12, color:'#8E8AA0', marginBottom:10 }}>JPG or PNG. Recommended 400x400px.</p>
              <label style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.15)', color:'#F0EEF8', padding:'10px 18px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', letterSpacing:1 }}>
                {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" style={{ display:'none' }}
                  onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'avatar')} />
              </label>
            </div>
          </div>
        </div>

        {/* BANNER */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Banner Image</div>
          <div style={{ width:'100%', height:120, borderRadius:8, background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {bannerUrl ? (
              <img src={bannerUrl} alt="Banner" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <span style={{ fontSize:12, color:'#7A7A8F' }}>No banner uploaded</span>
            )}
          </div>
          <p style={{ fontSize:12, color:'#8E8AA0', marginBottom:10 }}>JPG or PNG. Recommended 1500x400px.</p>
          <label style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.15)', color:'#F0EEF8', padding:'10px 18px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', letterSpacing:1 }}>
            {uploading ? 'Uploading...' : 'Upload Banner'}
            <input type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'banner')} />
          </label>
        </div>

        {/* PROFILE INFO */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Profile Info</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input type="text" placeholder="Genre / Creator Type" value={genre} onChange={e => setGenre(e.target.value)} style={inp} />
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