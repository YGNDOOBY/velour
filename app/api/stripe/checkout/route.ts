import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const { giftTypeId, artistId, fanName, songId } = await request.json()
  const supabase = await createClient()

  const { data: giftType } = await supabase
    .from('gift_types')
    .select('*')
    .eq('id', giftTypeId)
    .single()

  const { data: artist } = await supabase
    .from('artist_profiles')
    .select('stripe_account_id, stripe_onboarded, display_name, slug')
    .eq('id', artistId)
    .single()

  if (!giftType || !artist) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!artist.stripe_onboarded || !artist.stripe_account_id) {
    return NextResponse.json({ error: 'Artist not connected to Stripe' }, { status: 400 })
  }

  let songTitle = ''
  if (songId) {
    const { data: song } = await supabase.from('songs').select('title').eq('id', songId).single()
    if (song) songTitle = song.title
  }

  const platformFee = Math.round(giftType.amount_cents * 0.10)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: songId
            ? `${giftType.emoji} ${giftType.name} for "${songTitle}" by ${artist.display_name}`
            : `${giftType.emoji} ${giftType.name} for ${artist.display_name}`,
          description: songId
            ? `Supporting "${songTitle}" on Velour.fm`
            : `Supporting ${artist.display_name} on Velour.fm`,
        },
        unit_amount: giftType.amount_cents,
      },
      quantity: 1,
    }],
    mode: 'payment',
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: { destination: artist.stripe_account_id },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/artist/${artist.slug}?gift=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/artist/${artist.slug}`,
    metadata: {
      gift_type_id: giftTypeId,
      artist_id: artistId,
      fan_name: fanName || 'Anonymous',
      song_id: songId || '',
      platform_fee_cents: platformFee,
      artist_payout_cents: giftType.amount_cents - platformFee,
    },
  })

  return NextResponse.json({ url: session.url })
}