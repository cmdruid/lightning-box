import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/sessions'

import {
  get_session,
  verify_token
} from '@/lib/box'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, headers, method } = req

  if (
    method !== 'POST' || 
    typeof body !== 'object'
  ) {
    return res.status(400).end()
  }

  const { token } = headers

  if (!verify_token(token)) {
    res.status(403).end(); return
  }

  console.log('body:', body)

  try {
    const state = await get_session(body)
    console.log('state:', state)
    return res.status(200).json(state)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
