import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { create_charge }   from '@/lib/zbd'

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

  const { amount } = deposit

  try {
    const config = {
      internalId  : session.id,
      callbackUrl : `${HOSTNAME}/api/charge/callback`
    }
    const charge = await create_charge(amount, 'lockbox', config)

    if (!charge.ok) {
      const err = { error : charge.err }
      console.log(err)
      return res.status(400).json(err)
    }

    if (!charge.data.success) {
      const err = { error : charge.data.message }
      console.log(err)
      return res.status(400).json(err)
    }

    const { data } = charge.data

    const ret = await store.update({
      invoice_id : session.id,
      invoice    : { charge_id : data.id }
    })

    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
