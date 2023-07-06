import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, session } = req

  if (method !== 'POST' || body === undefined) {
    return res.status(400).end()
  }

  req.session = { ...session, ...body }

  req.session.save()

  return res.status(200).json(req.session)
}
