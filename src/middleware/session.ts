import {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'

import { config } from '@/schema'
import { withSession } from '@/lib/session'
import { now } from '@/lib/utils'

const { SESSION_TIMEOUT } = config

export function session_auth (
  handler : NextApiHandler
) {
  const middleware = async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { session, state, store } = req

    const {
      box, deposit, deposit_id, 
      invoice, invoice_id, session_id, 
      timestamp
    } = state

    const expires_at = timestamp + SESSION_TIMEOUT

    if (expires_at < now()) {
      store.update({ session_id : null })
    }

    if (
      session_id !== null &&
      expires_at > now()  &&
      session.id === session_id
    ) {
      req.session.connected  = true
      req.session.status     = state.status
      req.session.expires_at = expires_at
      req.session.box        = box ?? undefined
    } else {
      req.session.connected  = false
      req.session.status     = 'disconnected'
      req.session.expires_at = undefined
      req.session.box        = undefined
    }

    if (
      deposit_id !== null &&
      session.id === deposit_id
    ) {
      req.session.deposit = deposit ?? undefined
    } else {
      req.session.deposit = undefined
    }

    if (
      invoice_id !== null &&
      session.id === invoice_id
    ) {
      req.session.invoice = invoice ?? undefined
    } else {
      req.session.invoice = undefined
    }

    if (state.status === 'init') {
      req.session.status = 'init'
    }

    await req.session.save()

    console.log('session:', req.session)

    return handler(req, res)
  }
  return withSession(middleware)
}
