'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState('')
  const [slug, setSlug] = useState('')
  const [bio, setBio] = useState('')
  const [genre, setGenre] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function handleNameChange(val: string) {
    setDisplayName(val)
    setSlug(val.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('artist_profiles').insert({
      user_id: user.id,
      slug,
      display_name: displayName,
      bio,
      genre,
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const inp: React.CSSProperties = {
    background: '#16122A',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#F0EEF8',
    padding: '14px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'Syne, sans-serif',
    outline: 'none',
    width: '100%',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05040A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480, padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garant, serif', fontSize: 40, fontWeight: 300, color: '#F0EEF8', marginBottom: 8 }}>
          Set up your <em style={{ color: '#A78BFA' }}>page</em>
        </h1>
        <p style={{ color: '#8E8AA0', marginBottom: 32, fontSize: 14 }}>This is what fans will see at velour.fm/yourname</p>
        {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 16 }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="text" placeholder="Artist name" value={displayName} onChange={e => handleNameChange(e.target.value)} style={inp} />
          <div style={{ background: '#16122A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, display: 'flex', overflow: 'hidden' }}>
            <span style={{ padding: '14px 16px', color: '#8E8AA0', fontSize: 14, borderRight: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>velour.fm/</span>
            <input type="text" placeholder="yourname" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} style={{ ...inp, border: 'none', borderRadius: 0 }} />
          </div>
          <input type="text" placeholder="Genre (e.g. Hip-Hop, R&B)" value={genre} onChange={e => setGenre(e.target.value)} style={inp} />
          <textarea placeholder="Bio — tell fans who you are" value={bio} onChange={e => setBio(e.target.value)} style={{ ...inp, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }} />
          <button onClick={handleSubmit} disabled={loading} style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '16px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
            {loading ? 'Creating your page...' : 'Launch My Page →'}
          </button>
        </div>
      </div>
    </div>
  )
}