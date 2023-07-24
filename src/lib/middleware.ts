import { Buff }            from '@cmdcode/buff-utils'
import { withSession }     from '@/lib/session'
import { StoreController } from '@/model/store'
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
  throw new Error('Environment variable for BOX_TOKEN not defined!')
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

    const store = new StoreController()
    const state = await store.get()

    req.store = store
    req.state = state

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

    const { invoice, receipt_id, reserve_id, status } = state

    if (session.id === undefined) {
      req.session.id = Buff.random(32).hex
    }

    if (
      status !== 'ready'  &&
      reserve_id !== null && 
      session.id === reserve_id
    ) {
      req.session.state = state
    } else {
      req.session.state = undefined
    }

    if (
      status === 'invoice' &&
      invoice !== null
    ) {
      req.session.invoice = invoice
    }

    if (
      status === 'paid'   &&
      receipt_id !== null &&
      session.id === receipt_id
    ) {
      req.session.receipt = receipt_id
    }

    await req.session.save()

    return handler(req, res)
  }

  return withMiddleware(session_auth)
}
