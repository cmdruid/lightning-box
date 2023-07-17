import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  req.session.destroy()
  console.log('clear:', req.session)
  return res.status(200).json(req.session)
}
