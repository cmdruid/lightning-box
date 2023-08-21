import {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'

import { config }      from '@/schema'
import { withSession } from '@/lib/session'
import { now }         from '@/lib/utils'
import assert from 'assert'

const { DEBUG } = process.env

const { SESSION_TIMEOUT } = config

export function session_auth (
  handler : NextApiHandler
) {
  const middleware = async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { session, state, store } = req

    assert.ok(state !== undefined)
    
    const { session_id, timestamp } = state

    const expires_at = timestamp + SESSION_TIMEOUT

    if (expires_at < now()) {
      store.update({ session_id : undefined })
    }

    if (
      session_id !== undefined &&
      expires_at > now()       &&
      session.id === session_id
    ) {
      req.session.connected  = true
      req.session.status     = state.status
      req.session.expires_at = expires_at
    } else {
      req.session.connected  = false
      req.session.status     = 'disconnected'
      req.session.expires_at = undefined
    }

    if (state.status === 'init') {
      req.session.status = 'init'
    }

    await req.session.save()

    if (DEBUG) console.log('session:', req.session)

    return handler(req, res)
  }
  return withSession(middleware)
}
