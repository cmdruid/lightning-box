import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state } = req

  if (method !== 'GET') {
    return res.status(400).end()
  }

  console.log('session:', session)
  console.log('store:', state)

  try {
    return res.status(200).json(req.session)
  } catch (err) {
    console.log('api/session/status:', err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
