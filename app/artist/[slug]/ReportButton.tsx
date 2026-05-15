'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const REASONS = [
  'Copyright infringement',
  'Stolen music / not original content',
  'Harassment or hate speech',
  'Spam or fake account',
  'Explicit content without warning',
  'Other',
]

export default function ReportButton({ profileId, songId }: { profileId: string, songId?: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function submitReport() {
    if (!reason) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('reports').insert({
      reporter_id: user?.id || null,
      reported_profile_id: profileId,
      reported_song_id: songId || null,
      reason,
      details,
      status: 'pending',
    })
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return <span style={{ fontSize:11, color:'#22C55E' }}>✓ Reported</span>
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ background:'none', border:'none', color:'#7A7A8F', fontSize:11, cursor:'pointer', padding:'4px 8px', letterSpacing:1 }}>
        ⚑ Report
      </button>

      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:28, maxWidth:440, width:'100%' }}>
            <h3 style={{ fontFamily:'Cormorant Garant, serif', fontSize:24, fontWeight:600, marginBottom:6 }}>
              Report {songId ? 'Track' : 'Profile'}
            </h3>
            <p style={{ fontSize:13, color:'#8E8AA0', marginBottom:20 }}>Help us keep Velour.fm safe. All reports are reviewed by our team.</p>

            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
              {REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  style={{ background: reason===r ? 'rgba(139,92,246,0.15)' : '#16122A', border: reason===r ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'10px 14px', textAlign:'left', color: reason===r ? '#A78BFA' : '#8E8AA0', fontSize:13, cursor:'pointer' }}>
                  {r}
                </button>
              ))}
            </div>

            <textarea placeholder="Additional details (optional)" value={details} onChange={e => setDetails(e.target.value)}
              style={{ width:'100%', background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'12px 14px', borderRadius:8, fontSize:13, fontFamily:'Syne, sans-serif', outline:'none', minHeight:80, resize:'vertical', marginBottom:16 }} />

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={submitReport} disabled={!reason || loading}
                style={{ background:'#EF4444', color:'#fff', border:'none', padding:'12px 24px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', flex:1, opacity: !reason ? 0.5 : 1 }}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button onClick={() => setOpen(false)}
                style={{ background:'#16122A', color:'#8E8AA0', border:'1px solid rgba(255,255,255,0.07)', padding:'12px 24px', borderRadius:8, fontSize:13, cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}