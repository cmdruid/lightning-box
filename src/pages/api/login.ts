import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/lib/middleware'

export default withSessionAuth(handler)

async function handler (
  req : NextApiRequest,
  res : NextApiResponse
) {
  const { method, query, session, state, store } = req
  const { session_code } = state
  const { code } = query

  if (
    method !== 'GET' ||
    typeof code !== 'string'
  ) {
    return res.status(400).end()
  }

  if (code !== String(session_code)) {
    return res.status(401).end()
  }

  try {
    const new_state = { 
      session_id : session.id,
      timestamp  : session.timestamp
    }
    await store.update(new_state)
    return res.status(200).json(new_state)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
