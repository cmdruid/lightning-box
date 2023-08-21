import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { deposit_addr, status } = state

  if (method  !== 'GET') {
    return res.status(400).json({ error : 'Invalid request!' })
  }

  if (
    status !== 'reserved' ||
    deposit_addr === undefined
  ) {
    return res.status(401).json({ error: 'There is nothing to cancel!' })
  }

  try {
    const ret = await store.reset()
    return res.status(200).json(ret)
  } catch (err) {
    console.error('api/deposit/cancel:', err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
