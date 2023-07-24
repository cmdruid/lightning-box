import type { NextApiRequest, NextApiResponse } from 'next'

import { withTokenAuth } from '@/lib/middleware'
import { schema }  from '@/schema'
import { is_diff } from '@/lib/utils'

export default withTokenAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, state, store } = req

  if (method !== 'POST' || typeof body !== 'object') {
    return res.status(400).end()
  }

  try {
    const parsed = await schema.box_data.spa(body)

    if (!parsed.success) {
      return res.status(422).end()
    }

    const { amount } = parsed.data
  
    const amount_ok = (
      amount !== null &&
      amount > 0      &&
      amount <= 100
    )

    const ret = { state, amount_ok }

    if (is_diff(parsed.data, state.box_data)) {
      ret.state = await store.update({ box_data: parsed.data })
    }

    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
