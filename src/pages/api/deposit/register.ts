import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/lib/middleware'

import { now } from '@/lib/utils'
import { schema } from '@/schema'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, session, state, store } = req
  const { deposit, status } = state
  const { address } = query

  if (
    method !== 'GET'   ||
    status !== 'ready' ||
    typeof address !== 'string'
  ) {
    return res.status(400).end()
  }

  if (!await validate_address(address)) {
    return res.status(422).end()
  }

  try {
    const ret = await store.update({ 
      status     : 'reserved',
      deposit_id : session.id,
      deposit    : { ...deposit, address },
      timestamp  : now()
    })
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}

async function validate_address (
  address : string
) : Promise<boolean> {
  const res = await schema.address.spa(address)
  return res.success
}
