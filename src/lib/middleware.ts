import { Buff }            from '@cmdcode/buff-utils'
import { withSession }     from '@/lib/session'
import { StoreController } from '@/db/store'
import { StoreData }       from '@/schema'

import {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'

declare module 'next' {
  interface NextApiRequest { 
    state : StoreData
    store : StoreController
  }
}

const { LOCKBOX_KEY } = process.env

if (typeof LOCKBOX_KEY !== 'string') {
  throw new Error('Environment variable for LOCKBOX_KEY not defined!')
}

export function withMiddleware  (
  handler : NextApiHandler
) {
  const middleware = async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { body, method } = req

    console.log('body:', body)

    if (method === 'POST' && typeof body === 'string') {
      try {
        req.body = JSON.parse(body)
      } catch {
        console.log('[middleware]: Request body is not JSON!')
        res.status(400).end(); return
      }
    }

    req.store = new StoreController()
    req.state = await req.store.get()

    return handler(req, res)
  }
  return withSession(middleware)
}

export function withTokenAuth (
  handler : NextApiHandler
) {
  const token_auth = async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { headers: { token } } = req

    if (
      typeof token !== 'string' ||
      token !== LOCKBOX_KEY
    ) {
      return res.status(401).end()
    }

    return handler(req, res)
  }

  return withMiddleware(token_auth)
}

export function withSessionAuth (
  handler : NextApiHandler
) {
  const session_auth = async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { session, state } = req

    const {
      box, deposit, deposit_id, invoice, 
      invoice_id, session_id, status, timestamp
    } = state

    if (typeof session.id !== 'string') {
      req.session.id = Buff.random(32).hex
    }

    if (
      session_id !== null &&
      session.id === session_id
    ) {
      req.session.is_auth   = true
      req.session.status    = status
    } else {
      req.session.is_auth   = false
      req.session.status    = 'login'
    }

    if (box === null) {
      req.session.status = 'loading'
    }

    if (
      deposit_id !== null &&
      deposit    !== null &&
      session.id === deposit_id
    ) {
      req.session.deposit = deposit
    }

    if (
      invoice_id !== null && 
      invoice    !== null &&
      session.id === invoice_id
    ) {
      req.session.invoice = invoice
    }

    req.session.timestamp = timestamp

    await req.session.save()

    return handler(req, res)
  }

  return withMiddleware(session_auth)
}
