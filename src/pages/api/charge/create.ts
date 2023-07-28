import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { create_charge }   from '@/lib/zbd'
import { config }          from '@/schema'

const { ESCROW_FEE, ESCROW_RATE } = config

const { VERCEL_URL, VERCEL_ENV } = process.env

const proto = (VERCEL_ENV === 'development') ? 'http' : 'https'

const HOSTNAME = `${proto}://${VERCEL_URL}`

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { box, deposit, status } = state

  if (
    method !== 'GET'    ||
    status !== 'locked' ||
    deposit === null
  ) {
    return res.status(400).end()
  }

  if (box?.state !== 'locked') {
    return res.status(403).end()
  }

  const amount = deposit.amount,
        rate   = Math.ceil(amount * ESCROW_RATE),
        total  = (amount + rate + ESCROW_FEE) * 1000

  try {
    const config = {
      internalId  : session.id,
      callbackUrl : `${HOSTNAME}/api/charge/callback`
    }

    const charge = await create_charge(total, 'lockbox', config)

    console.log('charge res:', JSON.stringify(charge, null, 2))

    if (!charge.ok) {
      console.log('Fetch Response error:', charge.error)
      return res.status(400).json({ error : charge.error })
    }

    const { success, data, message } = charge.data

    if (!success) {
      console.log('ZBD Response error:', message)
      return res.status(400).json({ error : message })
    }

    await store.update({
      withdraw_id : session.id,
      withdraw    : { charge_id : data.id }
    })

    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
