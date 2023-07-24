import type { NextApiRequest, NextApiResponse } from 'next'

import { withTokenAuth } from '@/lib/middleware'
import { schema }        from '@/schema'

export default withTokenAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, store } = req

  if (
    method !== 'POST' || 
    typeof body !== 'object'
  ) {
    return res.status(400).end()
  }

  try {
    const parsed = await schema.box_data.spa(body)

    if (!parsed.success) {
      return res.status(422).end()
    }

    const ret = await store.update({ ...body })

    return res.status(200).json(ret)

    // return res.status(400).json({ message : 'The box is currently reserved!'})
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
