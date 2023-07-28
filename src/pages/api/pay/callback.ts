import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

const { VERCEL_URL, VERCEL_ENV, ZBD_HOST } = process.env

if (typeof ZBD_HOST !== 'string') {
  throw new Error('ZBD_HOST is undefined!')
}

const proto = (VERCEL_ENV === 'development') ? 'http' : 'https'

const HOSTNAME = `${proto}://${VERCEL_URL}`

const ALLOWED_HOSTS = [ HOSTNAME, ZBD_HOST ]

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, headers, method, state, store } = req
  const { origin } = headers
  const { box, status } = state

  console.log('Callback from headers:', headers)

  if (
    method !== 'POST'  ||
    typeof body !== 'object'
  ) {
    console.log('Invalid callback from:', origin)
    return res.status(400).end()
  }

  if (
    origin === undefined ||
    !ALLOWED_HOSTS.includes(origin)
  ) {
    console.log('Unauthorized callback from:', origin)
    return res.status(401).end()
  }

  if (
    status     !== 'locked' ||
    box?.state !== 'locked'
  ) {
    console.log('Forbidden callback from:', origin)
    return res.status(403).end()
  }

  console.log('POST from origin:', origin)
  console.log(body)

  try {
    return res.status(200).end()
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
