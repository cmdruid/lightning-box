import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/lib/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, session, state, store } = req
  const { reserve_id, status } = state
  const { address } = query

  if (
    method !== 'GET'          ||
    status !== 'reserved'     ||
    reserve_id === null       ||
    session.id !== reserve_id ||
    typeof address !== 'string'
  ) {
    return res.status(400).end()
  }

  if (!validate_address(address)) {
    return res.status(422).end()
  }

  try {
    const ret = await store.update({ recipient : address })
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}

function validate_address(address : string) : boolean {
  return true
}
