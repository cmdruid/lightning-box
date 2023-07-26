import { Buff } from '@cmdcode/buff-utils'

import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'

import {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'

import { now } from './utils'

if (process.env.SESSION_KEY === undefined) {
  throw new Error('Session key is undefined!')
}

const sessionOptions = {
  password      : process.env.SESSION_KEY,
  cookieName    : process.env.SESSION_NAME || 'iron-session',
  cookieOptions : {
    secure: process.env.NODE_ENV === 'production',
  },
}

export function withSession(handler : NextApiHandler) {
  const middleware = async (
    req : NextApiRequest,
    res : NextApiResponse
  ) => {
    const { session } = req

    if (typeof session.id !== 'string') {
      req.session.id = Buff.random(32).hex
    }

    if (typeof session.updated_at !== 'number') {
      req.session.updated_at = now()
    }

    return handler(req, res)
  }

  return withIronSessionApiRoute(middleware, sessionOptions);
}

export function withSessionSsr(handler : any) {
  return withIronSessionSsr(handler, sessionOptions);
}
