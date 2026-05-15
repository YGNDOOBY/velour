// app/api/admin/strike/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { user_id, reason, track_id } = await request.json()

  // Verify caller is admin
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: admin } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!admin?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Insert violation — trigger handles the rest
  const { error } = await supabase
    .from('violations')
    .insert({
      user_id,
      reason,
      track_id: track_id || null,
      issued_by: session.user.id,
      created_at: new Date().toISOString()
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return updated profile so admin UI can reflect suspension
  const { data: profile } = await supabase
    .from('profiles')
    .select('strike_count, is_suspended')
    .eq('id', user_id)
    .single()

  return NextResponse.json({
    success: true,
    strike_count: profile?.strike_count,
    is_suspended: profile?.is_suspended
  })
}