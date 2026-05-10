'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type CreatorType = 'fan' | 'artist' | 'producer' | 'engineer' | 'songwriter' | 'dj'

const creatorTypes = [
  { id: 'artist', emoji: '🎤', label: 'Artist', desc: 'Upload songs. Build fans. Get support.' },
  { id: 'producer', emoji: '🎹', label: 'Producer / Beatmaker', desc: 'Sell beats. Get custom orders. Receive support.' },
  { id: 'engineer', emoji: '🎚', label: 'Engineer', desc: 'Sell mixing & mastering. Book clients.' },
  { id: 'songwriter', emoji: '✍️', label: 'Songwriter', desc: 'Offer writing services. Sell demos.' },
  { id: 'dj', emoji: '🎧', label: 'DJ', desc: 'Promote mixes. Build supporters.' },
]

export default function SignupPage() {
  const [step, setStep] = useState<'role' | 'details'>('role')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<CreatorType>('fan')
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
    if (role === 'fan') {
      router.push('/')
    } else {
      router.push('/onboarding')
    }
  }

  const inp: React.CSSProperties = {
    background:'#16122A', border:'1px solid rgba(255,255,255,0.07)',
    color:'#F0EEF8', padding:'14px 16px', borderRadius:8,
    fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', width:'100%'
  }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne, sans-serif', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth: step === 'role' ? 560 : 400 }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, color:'#F0EEF8', textAlign:'center', marginBottom:8 }}>
          VEL<span style={{color:'#8B5CF6'}}>◈</span>UR<span style={{color:'#8B5CF6'}}>.FM</span>
        </h1>

        {step === 'role' ? (
          <>
            <p style={{ color:'#8E8AA0', textAlign:'center', marginBottom:8, fontSize:14 }}>Create your account</p>
            <p style={{ fontFamily:'Cormorant Garant, serif', fontSize:28, fontWeight:300, color:'#F0EEF8', textAlign:'center', marginBottom:32 }}>What kind of creator are you?</p>

            {/* CREATOR CARDS */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
              {creatorTypes.map(c => (
                <button key={c.id} onClick={() => setRole(c.id as CreatorType)}
                  style={{ background: role===c.id ? 'rgba(139,92,246,0.15)' : '#0F0C1A', border: role===c.id ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:16, textAlign:'left', width:'100%' }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{c.emoji}</span>
                  <div>
                    <div style={{ color: role===c.id ? '#A78BFA' : '#F0EEF8', fontFamily:'Syne, sans-serif', fontSize:14, fontWeight:700, marginBottom:3 }}>{c.label}</div>
                    <div style={{ color:'#8E8AA0', fontSize:12 }}>{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* FAN OPTION */}
            <button onClick={() => setRole('fan')}
              style={{ background: role==='fan' ? 'rgba(139,92,246,0.15)' : '#0F0C1A', border: role==='fan' ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:16, textAlign:'left', width:'100%', marginBottom:24 }}>
              <span style={{ fontSize:28, flexShrink:0 }}>👂</span>
              <div>
                <div style={{ color: role==='fan' ? '#A78BFA' : '#F0EEF8', fontFamily:'Syne, sans-serif', fontSize:14, fontWeight:700, marginBottom:3 }}>Fan</div>
                <div style={{ color:'#8E8AA0', fontSize:12 }}>Support artists. Send gifts. Follow creators.</div>
              </div>
            </button>

            <button onClick={() => setStep('details')}
              style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'14px', borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', width:'100%' }}>
              Continue →
            </button>
          </>
        ) : (
          <>
            <p style={{ color:'#8E8AA0', textAlign:'center', marginBottom:32, fontSize:14 }}>
              Create your {role === 'fan' ? 'fan' : role} account
            </p>

            {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:16, textAlign:'center' }}>{error}</p>}

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <input type="text" placeholder={role === 'fan' ? 'Your name' : 'Your name or brand name'} value={name} onChange={e => setName(e.target.value)} style={inp} />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
              <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} style={inp} />
              <button onClick={handleSignup} disabled={loading}
                style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'14px', borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', marginTop:8 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <button onClick={() => setStep('role')}
                style={{ background:'transparent', color:'#8E8AA0', border:'none', fontSize:13, cursor:'pointer', padding:'8px' }}>
                ← Back
              </button>
            </div>
          </>
        )}

        <p style={{ color:'#8E8AA0', textAlign:'center', marginTop:24, fontSize:13 }}>
          Already have an account?{' '}
          <a href="/login" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}