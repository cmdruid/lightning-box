import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { create_charge }   from '@/lib/zbd'
import { env }          from '@/schema'

import * as validate from '@/lib/validate'

const { VERCEL_URL, VERCEL_ENV } = process.env

const proto = (VERCEL_ENV === 'development') ? 'http' : 'https'

const HOSTNAME = `${proto}://${VERCEL_URL}`

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { box, deposit_id, deposit, status } = state

  if (
    method  !== 'GET'      ||
    status  !== 'reserved' ||
    deposit === undefined  ||
    deposit === null
  ) {
    return res.status(400).end()
  }

  if (deposit_id !== session.id) {
    return res.status(401).end()
  }

  if (box?.state !== 'locked') {
    return res.status(403).end()
  }

  const { address, amount } = deposit

  if (!(
    validate.address_ok(address) &&
    validate.amount_ok(amount)
  )) {
   return res.status(422).end()
  }

  try {
    // Get charge from zbd.
    const config = {
      internalId  : deposit_id,
      callbackUrl : `${HOSTNAME}/api/charge/callback`
    }
    const charge = await create_charge(amount, 'lockbox', config)
    // store invoice in store.
    const ret = await store.update({})
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
