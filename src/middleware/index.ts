import { StoreController } from '@/db/store'
import { StoreData }       from '@/schema'
import { session_auth }    from '@/middleware/session'
import { token_auth }      from '@/middleware/token'

import {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'
import { MongoServerError } from 'mongodb'

declare module 'next' {
  interface NextApiRequest { 
    state : StoreData
    store : StoreController
  }
}

export function middleware  (
  handler : NextApiHandler
) : NextApiHandler {
  return async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { body, method } = req

    if (method === 'POST' && typeof body === 'string') {
      try {
        req.body = JSON.parse(body)
      } catch {
        return res.status(400).json({
          err : 'Request body is not JSON!'
        })
      }
    }

    try {
      req.store = new StoreController()
      req.state = await req.store.get()
    } catch (err) {
      console.error('api/middleware:', err)
      if (err instanceof MongoServerError) {
         if (err.code === 121) {
          console.log('Mongo schema validation failed:')
          console.log(JSON.stringify(err?.errInfo?.details, null, 2))
        }
      }
    }

    return handler(req, res)
  }
}

export function withSessionAuth (
  handler : NextApiHandler
) : NextApiHandler {
  return middleware(session_auth(handler))
}

export function withTokenAuth (
  handler : NextApiHandler
) : NextApiHandler {
  return middleware(token_auth(handler))
}

export function applyMiddleware (
  handler : NextApiHandler,
  ...middlewares : ((handler: NextApiHandler) => NextApiHandler)[]
): NextApiHandler {
  return middlewares
    .reverse()
    .reduce((prevHandler, middleware) => {
      return middleware(prevHandler)
    }, handler)
}
