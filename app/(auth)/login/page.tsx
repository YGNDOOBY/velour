'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne, sans-serif' }}>
      <div style={{ width:'100%', maxWidth:400, padding:'0 24px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, color:'#F0EEF8', textAlign:'center', marginBottom:8 }}>
          VEL<span style={{color:'#8B5CF6'}}>◈</span>UR
        </h1>
        <p style={{ color:'#8E8AA0', textAlign:'center', marginBottom:40, fontSize:14 }}>Sign in to your artist account</p>
        {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:16, textAlign:'center' }}>{error}</p>}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'14px 16px', borderRadius:8, fontSize:14, fontFamily:'Syne, sans-serif', outline:'none' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'14px 16px', borderRadius:8, fontSize:14, fontFamily:'Syne, sans-serif', outline:'none' }} />
          <button onClick={handleLogin} disabled={loading}
            style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'14px', borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', marginTop:8 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        <p style={{ color:'#8E8AA0', textAlign:'center', marginTop:24, fontSize:13 }}>
          No account?{' '}<a href="/signup" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Create one</a>
        </p>
      </div>
    </div>
  )
}