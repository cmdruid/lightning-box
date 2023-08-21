import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

import * as validate from '@/lib/validate'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { deposit_addr } = state

  if (method !== 'GET') {
    return res.status(400).json({ error : 'Invalid request!' })
  }

  if (state.status !== 'reserved') {
    return res.status(401).json({ error: 'There is no deposit to check!' })
  }

  if (
    state.box?.state === 'locked'     &&
    state.status     === 'reserved'   &&
    validate.address_ok(deposit_addr) &&
    validate.amount_ok(state.box.amount)
  ) {
    await store.update({
      deposit_amt : state.box.amount,
      status      : 'locked'
    })
  }

  console.log('session:', session)
  console.log('store:', state)

  return res.status(200).json({
    address   : state.deposit_addr,
    box_amt   : state.box?.amount,
    box_state : state.box?.state
  })
}
