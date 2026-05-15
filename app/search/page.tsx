'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const supabase = createClient()

  async function handleSearch() {
    if (!query.trim()) return
    setSearched(true)
    const { data } = await supabase
      .from('artist_profiles')
      .select('*')
      .ilike('display_name', `%${query}%`)
      .eq('is_active', true)
      .limit(20)
    setResults(data || [])
  }

  return (
    <div style={{ minHeight:'100vh', background:'#05040A', color:'#F0EEF8', fontFamily:'Syne, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'rgba(5,4,10,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garant, serif', fontSize:20, fontWeight:700, letterSpacing:4, color:'#F0EEF8', textDecoration:'none' }}>VEL<span style={{color:'#8B5CF6'}}>◈</span>UR<span style={{color:'#8B5CF6', fontSize:12}}>.FM</span></a>
      </nav>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'60px 20px' }}>
        <h1 style={{ fontFamily:'Cormorant Garant, serif', fontSize:48, fontWeight:300, marginBottom:8, textAlign:'center' }}>
          Find a <em style={{color:'#A78BFA', fontStyle:'italic'}}>creator</em>
        </h1>
        <p style={{ color:'#8E8AA0', textAlign:'center', marginBottom:32, fontSize:14 }}>Search for any artist, producer, engineer, or creator on Velour.fm</p>

        <div style={{ display:'flex', gap:10, marginBottom:40 }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex:1, background:'#16122A', border:'1px solid rgba(255,255,255,0.07)', color:'#F0EEF8', padding:'14px 16px', borderRadius:8, fontSize:14, fontFamily:'Syne, sans-serif', outline:'none' }}
          />
          <button onClick={handleSearch}
            style={{ background:'#8B5CF6', color:'#fff', border:'none', padding:'14px 24px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:1, textTransform:'uppercase' }}>
            Search
          </button>
        </div>

        {searched && results.length === 0 && (
          <p style={{ color:'#8E8AA0', textAlign:'center', fontSize:14 }}>No creators found for "{query}"</p>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {results.map(creator => (
            <a key={creator.id} href={`/artist/${creator.slug}`}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', background:'#0F0C1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, textDecoration:'none' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'#1E1935', border:'2px solid rgba(255,255,255,0.07)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant, serif', fontSize:18, color:'#C4C4D4', flexShrink:0 }}>
                {creator.avatar_url ? (
                  <img src={creator.avatar_url} alt={creator.display_name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  creator.display_name.slice(0,2).toUpperCase()
                )}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'#F0EEF8', marginBottom:2 }}>{creator.display_name}</div>
                <div style={{ fontSize:11, color:'#A78BFA', letterSpacing:1, textTransform:'uppercase' }}>{creator.genre}</div>
              </div>
              <div style={{ fontSize:12, color:'#8E8AA0' }}>velour.fm/{creator.slug}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}