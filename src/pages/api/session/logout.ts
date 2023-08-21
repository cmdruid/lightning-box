import type { NextApiRequest, NextApiResponse } from 'next'

import { MongoServerError } from 'mongodb'
import { withSessionAuth }  from '@/middleware'

export default withSessionAuth(handler)

async function handler (
  req : NextApiRequest,
  res : NextApiResponse
) {
  const { method, store } = req

  if (method !== 'GET') {
    return res.status(400).end()
  }

  try {
    req.session.destroy()
    await store.update({ session_id : undefined })
    return res.status(200).json({ connected : false })
  } catch (err) {
    console.log('api/session/logout:', err)
    const { message } = err as Error
    return res.status(500).json({ error: message })
  }
}
