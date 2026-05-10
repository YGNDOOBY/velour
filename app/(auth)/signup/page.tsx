'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'artist'|'fan'>('fan')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (role === 'artist') {
      router.push('/onboarding')
    } else {
      router.push('/')
    }
  }

  const inp: React.CSSProperties = { background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'14px 16px', borderRadius:8, fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', width:'100%' }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne, sans-serif', padding:'0 20px' }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, color:'#F0EEF8', textAlign:'center', marginBottom:8 }}>
          VEL<span style={{color:'#8B5CF6'}}>◈</span>UR
        </h1>
        <p style={{ color:'#8E8AA0', textAlign:'center', marginBottom:32, fontSize:14 }}>Create your account</p>

        {/* ROLE SELECTOR */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
          {(['fan','artist'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)}
              style={{ background: role===r ? 'rgba(139,92,246,0.2)' : '#16122A', border: role===r ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)', color: role===r ? '#A78BFA' : '#8E8AA0', padding:'14px', borderRadius:8, fontFamily:'Syne, sans-serif', fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer' }}>
              {r === 'fan' ? '🎧 Fan' : '🎤 Artist'}
            </button>
          ))}
        </div>

        {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:16, textAlign:'center' }}>{error}</p>}

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input type="text" placeholder={role === 'artist' ? 'Artist name' : 'Your name'} value={name} onChange={e => setName(e.target.value)} style={inp} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
          <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} style={inp} />
          <button onClick={handleSignup} disabled={loading}
            style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'14px', borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', marginTop:8 }}>
            {loading ? 'Creating account...' : role === 'artist' ? 'Create Artist Account' : 'Create Fan Account'}
          </button>
        </div>

        <p style={{ color:'#8E8AA0', textAlign:'center', marginTop:24, fontSize:13 }}>
          Already have an account?{' '}
          <a href="/login" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}