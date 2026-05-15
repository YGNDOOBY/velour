import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = 'dexterbolt777@gmail.com'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')

  if (!id || !action) return NextResponse.redirect(new URL('/admin', request.url))

  const { data: report } = await supabase.from('reports').select('*').eq('id', id).single()
  if (!report) return NextResponse.redirect(new URL('/admin', request.url))

  await supabase.from('reports').update({ status: action }).eq('id', id)

  if (action === 'warn' || action === 'suspend') {
    const { data: existing } = await supabase
      .from('violations')
      .select('strike_number')
      .eq('artist_profile_id', report.reported_profile_id)
      .order('strike_number', { ascending: false })
      .limit(1)

    const strikeNumber = existing?.[0] ? existing[0].strike_number + 1 : 1

    await supabase.from('violations').insert({
      artist_profile_id: report.reported_profile_id,
      reason: report.reason,
      strike_number: strikeNumber,
      action_taken: action === 'warn' ? 'Warning issued' : 'Account suspended',
    })

    if (action === 'suspend') {
      await supabase.from('artist_profiles').update({ is_active: false }).eq('id', report.reported_profile_id)
    }
  }

  return NextResponse.redirect(new URL('/admin', request.url))
}