import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/lib/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, session, state, store } = req
  const { deposit_id, deposit, status } = state

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

  try {
    const ret = await store._reset()
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
