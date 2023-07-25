import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/lib/middleware'

import * as validate from '@/lib/validate'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { deposit_id, deposit, status }   = state

  if (
    method  !== 'GET'      ||
    status  !== 'reserved' ||
    deposit === undefined
  ) {
    return res.status(400).end()
  }

  if (deposit_id !== session.id) {
    return res.status(401).end()
  }

  if (deposit.state !== 'locked') {
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
    // store invoice in store.
    const ret = await store.update({})
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
