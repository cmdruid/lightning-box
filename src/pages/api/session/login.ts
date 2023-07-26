import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

import { config } from '@/schema'

const { SESSION_TIMEOUT } = config

export default withSessionAuth(handler)

async function handler (
  req : NextApiRequest,
  res : NextApiResponse
) {
  const { method, query, state, store } = req
  const { code } = query

  console.log(state)

  console.log(method, state.box, code)

  if (
    method !== 'GET' ||
    typeof code !== 'string'
  ) {
    return res.status(400).end()
  }

  if (state.box === null) {
    return res.status(403).end()
  }

  if (code !== state.box.code) {
    return res.status(401).end()
  }

  try {
    await store.update({ session_id : req.session.id })

    req.session.connected = true
    req.session.expires_at = state.timestamp + SESSION_TIMEOUT
    req.session.save()

    return res.status(200).json(req.session)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
