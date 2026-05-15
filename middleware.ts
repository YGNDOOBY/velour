// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_suspended')
      .eq('id', session.user.id)
      .single()

    // Redirect suspended users to a suspended notice page
    if (profile?.is_suspended && !req.nextUrl.pathname.startsWith('/suspended')) {
      return NextResponse.redirect(new URL('/suspended', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*', '/settings/:path*']
}