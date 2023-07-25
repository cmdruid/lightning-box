import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/lib/middleware'

export default withSessionAuth(handler)

async function handler (
  req : NextApiRequest,
  res : NextApiResponse
) {
  const { method, query, store } = req

  if (method !== 'GET') {
    return res.status(400).end()
  }

  try {
    req.session.is_auth = false
    await req.session.save()
    const ret = await store.update({ session_id : null })
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
