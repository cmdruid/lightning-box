import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

import * as validate from '@/lib/validate'

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
    box     === null       ||
    deposit === null
  ) {
    return res.status(400).end()
  }

  if (deposit_id !== session.id) {
    return res.status(401).end()
  }

  const { amount } = box

  if (
    box?.state !== 'locked' ||
    !validate.amount_ok(amount)
  ) {
    return res.status(403).end()
  }

  try {
    const ret = await store.update({
      status     : 'locked',
      deposit_id : session.id,
      deposit    : { ...deposit, amount },
    })
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
