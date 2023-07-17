import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { method, body } = req

  if (
    method !== 'POST' || 
    typeof body !== 'object'
  ) {
    return res.status(400).end()
  }

  req.session = { ...req.session, ...body }
  await req.session.save()
  console.log('POST session:', req.session)

  try {
    return res.status(200).json(req.session)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
