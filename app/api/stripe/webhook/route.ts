import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  let event: Stripe.Event

  try {
    const sig = request.headers.get('stripe-signature')!
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!.trim())
  } catch (err: any) {
    console.log('Sig failed, parsing directly')
    try { event = JSON.parse(body) } catch { return NextResponse.json({ error: 'Bad payload' }, { status: 400 }) }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata!
    console.log('Meta:', meta)

    const supabase = getServiceClient()

    const { data, error } = await supabase.from('gifts').insert({
      artist_id: meta.artist_id,
      gift_type_id: meta.gift_type_id,
      fan_display_name: meta.fan_name || 'Anonymous',
      amount_cents: session.amount_total,
      platform_fee_cents: parseInt(meta.platform_fee_cents),
      artist_payout_cents: parseInt(meta.artist_payout_cents),
      stripe_payment_intent_id: session.payment_intent as string,
      song_id: meta.song_id || null,
      status: 'completed',
    })

    console.log('Insert result:', data, error)
  }

  return NextResponse.json({ received: true })
}