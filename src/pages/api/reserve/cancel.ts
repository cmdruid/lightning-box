import type { NextApiRequest, NextApiResponse } from 'next'

import { StoreController } from '@/model/store'
import { withSessionAuth } from '@/lib/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { reserve_id, status } = state

  if (
    method !== 'GET'      ||
    status !== 'reserved' ||
    reserve_id === null   ||
    session.id !== reserve_id
  ) {
    return res.status(400).end()
  }

  try {
    const ret = await store.reset()
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
