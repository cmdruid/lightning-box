import {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'

const { LOCKBOX_KEY } = process.env

if (typeof LOCKBOX_KEY !== 'string') {
  throw new Error('Environment variable for LOCKBOX_KEY not defined!')
}

export function token_auth (
  handler : NextApiHandler
) {
  return async (
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
}
