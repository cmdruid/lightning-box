import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method !== 'GET') {
    return res.status(400).end()
  }

  try {
    return res.status(200).json(req.session)
  } catch (err) {
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
