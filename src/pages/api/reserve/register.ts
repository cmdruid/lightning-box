import type { NextApiRequest, NextApiResponse } from 'next'

import { StoreController } from '@/model/store'
import { withSessionAuth } from '@/lib/middleware'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, session, state, store } = req
  const { box_data, status } = state
  const { code } = query

  if (
    method !== 'GET'         ||
    status !== 'ready'       ||
    typeof code !== 'string' ||
    box_data === null        ||
    code !== String(box_data.code)
  ) {
    return res.status(400).end()
  }

  try {
    const ret = await store.update({ reserve_id : session.id })
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
