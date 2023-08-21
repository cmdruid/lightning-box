import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

import * as validate from '@/lib/validate'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, state, store } = req
  const { box, deposit_addr, deposit_amt } = state

  if (method !== 'GET') {
    return res.status(400).json({ error : 'Invalid request!' })
  }

  if (!validate.amount_ok(box?.amount)) {
    return res.status(403).json({ error : 'The current deposit amount is invalid!' })
  }

  try {
    const ret = await store.update({
      deposit_addr,
      deposit_amt,
      status : 'locked',
    })
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    console.error('api/deposit/confirm:', err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
