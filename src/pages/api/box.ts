import type { NextApiRequest, NextApiResponse } from 'next'

import { withTokenAuth } from '@/middleware'

import { StoreData, schema }  from '@/schema'
import { is_diff } from '@/lib/utils'

export default withTokenAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, state, store } = req

  if (
    method !== 'POST' ||
    typeof body !== 'object'
  ) {
    return res.status(400).end()
  }

  const { box, deposit, withdraw, status } = state

  try {
    const box_state = await schema.box_data.spa(body)

    if (!box_state.success) {
      return res.status(422).end()
    }

    const { amount } = box_state.data
  
    const amount_ok = (
      amount !== null &&
      amount > 0      &&
      amount <= 100
    )

    const addr_ok = typeof deposit?.address     === 'string'
    const is_paid = typeof withdraw?.payment_id === 'string'

    const ret = {
      state,
      amount_ok,
      addr_ok,
      is_paid,
    }

    let update : Partial<StoreData> = {}

    if (status === 'init') {
      update.status = 'ready'
    }

    if (is_diff(box, box_state.data)) {
      update.box = box_state.data
    }

    if (Object.entries(update).length > 0) {
      store.update(update)
    }

    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
