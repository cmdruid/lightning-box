import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { MongoServerError } from 'mongodb'

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
    await store.update({ session_id : null })
    return res.status(200).json({ connected : false })
  } catch (err) {
    const error = err as MongoServerError
    if (error.code === 121) {
      console.log(error?.errInfo?.details)
    }
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
