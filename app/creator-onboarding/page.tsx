'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreatorOnboardingPage() {
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [slug, setSlug] = useState('')
  const [slugError, setSlugError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit() {
    if (!displayName || !slug) return
    setLoading(true)
    setSlugError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: existing } = await supabase
      .from('artist_profiles')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      setSlugError('That URL is already taken. Try another.')
      setLoading(false)
      return
    }

    const role = user.user_metadata?.role || 'artist'

    const { error } = await supabase.from('artist_profiles').insert({
      user_id: user.id,
      display_name: displayName,
      slug,
      bio,
      location,
      genre: role,
      accent_color: '#8B5CF6',
      is_active: true,
      supporter_count: 0,
      total_received: 0,
    })

    if (error) {
      setSlugError(error.message)
      setLoading(false)
      return
    }

    router.push(`/artist/${slug}`)
  }

  const inp: React.CSSProperties = {
    background:'#16122A', border:'1px solid rgba(255,255,255,0.07)',
    color:'#F0EEF8', padding:'14px 16px', borderRadius:8,
    fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', width:'100%'
  }

  const roleLabels: Record<string, string> = {
    producer: 'Producer / Beatmaker',
    engineer: 'Engineer',
    songwriter: 'Songwriter',
    dj: 'DJ',
  }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne, sans-serif', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:700, letterSpacing:5, color:'#F0EEF8', textDecoration:'none', display:'block', textAlign:'center', marginBottom:8 }}>
          VEL<span style={{color:'#8B5CF6'}}>◈</span>UR<span style={{color:'#8B5CF6'}}>.FM</span>
        </a>
        <p style={{ color:'#8E8AA0', textAlign:'center', marginBottom:8, fontSize:13, letterSpacing:2, textTransform:'uppercase' }}>Set up your creator profile</p>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:300, color:'#F0EEF8', textAlign:'center', marginBottom:40 }}>
          Let's build your <em style={{color:'#A78BFA', fontStyle:'italic'}}>page</em>
        </h1>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', display:'block', marginBottom:8 }}>Your Name / Brand Name</label>
            <input type="text" placeholder="e.g. Metro Boomin, Mix God, DJ Khaled" value={displayName}
              onChange={e => {
                setDisplayName(e.target.value)
                setSlug(generateSlug(e.target.value))
              }} style={inp} />
          </div>

          <div>
            <label style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', display:'block', marginBottom:8 }}>Your Velour.fm URL</label>
            <div style={{ display:'flex', alignItems:'center', background:'#16122A', border:`1px solid ${slugError ? '#EF4444' : 'rgba(255,255,255,0.07)'}`, borderRadius:8, overflow:'hidden' }}>
              <span style={{ padding:'14px 12px', color:'#7A7A8F', fontSize:13, borderRight:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>velour.fm/</span>
              <input type="text" value={slug} onChange={e => setSlug(generateSlug(e.target.value))}
                style={{ ...inp, border:'none', borderRadius:0 }} />
            </div>
            {slugError && <p style={{ color:'#EF4444', fontSize:12, marginTop:6 }}>{slugError}</p>}
          </div>

          <div>
            <label style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', display:'block', marginBottom:8 }}>Bio</label>
            <textarea placeholder="Tell people what you do..." value={bio} onChange={e => setBio(e.target.value)}
              style={{ ...inp, minHeight:100, resize:'vertical' }} />
          </div>

          <div>
            <label style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#8E8AA0', display:'block', marginBottom:8 }}>Location (optional)</label>
            <input type="text" placeholder="e.g. Atlanta, GA" value={location} onChange={e => setLocation(e.target.value)} style={inp} />
          </div>

          <button onClick={handleSubmit} disabled={loading || !displayName || !slug}
            style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'16px', borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', marginTop:8, opacity: (!displayName || !slug) ? 0.5 : 1 }}>
            {loading ? 'Creating your page...' : 'Launch My Page →'}
          </button>
        </div>

        <p style={{ color:'#8E8AA0', textAlign:'center', marginTop:24, fontSize:12 }}>
          You can update all of this later in your dashboard.
        </p>
      </div>
    </div>
  )
}