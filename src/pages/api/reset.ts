import type { NextApiRequest, NextApiResponse } from 'next'

import { StoreController }  from '@/db/store'
import { token_auth }       from '@/middleware/token'
import { MongoServerError } from 'mongodb'

export default token_auth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method !== 'GET') {
    return res.status(400).end()
  }

  try {
    const store = new StoreController()
    const ret   = await store.reset()
    return res.status(200).json(ret)
  } catch (err) {
    console.error('api/reset:', err)
    if (err instanceof MongoServerError) {
      if (err.code === 121) {
        console.log('Mongo schema validation failed:')
        console.log(JSON.stringify(err?.errInfo?.details, null, 2))
      }
    }
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
