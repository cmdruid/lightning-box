import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { NextApiHandler } from 'next'

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
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler : any) {
  return withIronSessionSsr(handler, sessionOptions);
}
