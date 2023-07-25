import type { NextApiRequest, NextApiResponse } from 'next'

import { withTokenAuth } from '@/lib/middleware'

export default withTokenAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, store } = req

  if (method !== 'GET') {
    return res.status(400).end()
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
