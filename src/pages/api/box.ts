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

  if (
    method !== 'POST' ||
    typeof body !== 'object'
  ) {
    return res.status(400).end()
  }

  const { deposit, invoice, session_code } = state
  const { address, ...rest } = deposit ?? {}
  const { receipt_id }       = invoice ?? {}

  try {
    const old_state = { ...rest, code: session_code }
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

    const addr_ok = address    !== undefined
    const is_paid = receipt_id !== undefined

    const ret = {
      state,
      amount_ok,
      addr_ok,
      is_paid,
    }

    if (is_diff(old_state, box_state.data)) {
      const { code, amount, state } = box_state.data
      ret.state = await store.update({
        session_code : code ?? undefined,
        deposit      : { ...deposit, state, amount }
      })
    }

    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
