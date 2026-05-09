'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  async function loadSongs() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: artist } = await supabase.from('artist_profiles').select('id').eq('user_id', user.id).single()
    if (!artist) return
    const { data } = await supabase.from('songs').select('*').eq('artist_id', artist.id).order('display_order')
    setSongs(data || [])
  }

  useEffect(() => { loadSongs() }, [])

  async function handleUpload() {
    if (!file || !title) { setMsg('Add a title and select a file.'); return }
    setLoading(true)
    setMsg('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: artist } = await supabase.from('artist_profiles').select('id').eq('user_id', user.id).single()
    if (!artist) return

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('velour-audio').upload(path, file)
    if (uploadError) { setMsg(uploadError.message); setLoading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('velour-audio').getPublicUrl(path)

    const { error } = await supabase.from('songs').insert({
      artist_id: artist.id,
      title,
      audio_url: publicUrl,
      is_published: true,
      display_order: songs.length,
    })

    if (error) { setMsg(error.message); setLoading(false); return }
    setTitle('')
    setFile(null)
    setMsg('✓ Song uploaded!')
    loadSongs()
    setLoading(false)
  }

  async function deleteSong(id: string, audioUrl: string) {
    await supabase.from('songs').delete().eq('id', id)
    loadSongs()
  }

  async function togglePublish(id: string, current: boolean) {
    await supabase.from('songs').update({ is_published: !current }).eq('id', id)
    loadSongs()
  }

  const inp: React.CSSProperties = { background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'12px 16px', borderRadius:8, fontSize:14, fontFamily:'Syne, sans-serif', outline:'none', width:'100%' }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif', display:'flex' }}>
      <div style={{ width:220, background:'#0F0C1A', borderRight:'1px solid rgba(255,255,255,0.07)', position:'fixed', top:0, bottom:0, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'24px', fontFamily:'Cormorant Garant, serif', fontSize:22, fontWeight:700, letterSpacing:4, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR</div>
        <div style={{ padding:'16px 0', flex:1 }}>
          {[{label:'Overview',href:'/dashboard'},{label:'Songs',href:'/dashboard/songs'},{label:'Gifts',href:'/dashboard/gifts'},{label:'Analytics',href:'/dashboard/analytics'},{label:'Settings',href:'/dashboard/settings'}].map(l => (
            <a key={l.href} href={l.href} style={{ display:'block', padding:'11px 24px', fontSize:13, fontWeight:600, color: l.href==='/dashboard/songs' ? '#A78BFA' : '#8E8AA0', textDecoration:'none', borderLeft: l.href==='/dashboard/songs' ? '2px solid #8B5CF6' : '2px solid transparent', background: l.href==='/dashboard/songs' ? 'rgba(139,92,246,0.1)' : 'transparent' }}>{l.label}</a>
          ))}
        </div>
      </div>

      <div style={{ marginLeft:220, flex:1, padding:'40px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:36, fontWeight:300, marginBottom:32 }}>Your <em style={{color:'#A78BFA'}}>Songs</em></h1>

        {/* UPLOAD */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Upload New Song</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input type="text" placeholder="Song title" value={title} onChange={e => setTitle(e.target.value)} style={inp} />
            <input type="file" accept="audio/*" onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ ...inp, padding:'10px 16px' }} />
            {msg && <p style={{ fontSize:13, color: msg.startsWith('✓') ? '#22C55E' : '#EF4444' }}>{msg}</p>}
            <button onClick={handleUpload} disabled={loading}
              style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'14px', borderRadius:8, fontSize:12, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', alignSelf:'flex-start', minWidth:160 }}>
              {loading ? 'Uploading...' : '+ Upload Song'}
            </button>
          </div>
        </div>

        {/* SONG LIST */}
        <div style={{ background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>{songs.length} Songs</div>
          {!songs.length && <p style={{ color:'#8E8AA0', fontSize:14 }}>No songs yet.</p>}
          {songs.map(s => (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:36, height:36, background:'#16122A', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>🎵</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{s.title}</div>
                <div style={{ fontSize:11, color:'#8E8AA0' }}>{s.play_count} plays</div>
              </div>
              <audio controls src={s.audio_url} style={{ height:32 }} />
              <button onClick={() => togglePublish(s.id, s.is_published)}
                style={{ fontSize:11, padding:'4px 12px', borderRadius:20, border:'none', cursor:'pointer', background: s.is_published ? 'rgba(34,197,94,0.1)' : 'rgba(122,122,143,0.1)', color: s.is_published ? '#22C55E' : '#7A7A8F' }}>
                {s.is_published ? 'Published' : 'Draft'}
              </button>
              <button onClick={() => deleteSong(s.id, s.audio_url)}
                style={{ background:'none', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'4px 12px', borderRadius:6, fontSize:11, cursor:'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}