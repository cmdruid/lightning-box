import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { method } = req

  if ( method !== 'GET') {
    return res.status(400).end()
  }

  console.log('GET session:', req.session)

  try {
    return res.status(200).json(req.session)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
