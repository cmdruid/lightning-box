/** 
 * Request a charge that:
 *  - includes the session id of the user.
 *  - pays to a certain lignting address. 
 *  - calls back to the callback endpoint.
 * 
 *  Get the invoice ID for the charge, then
 *  save it in the store. We need this ID for 
 *  the client to fetch a status from zbd when 
 *  looking at the home page.
 * 
 * */

import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionRoute } from '@/lib/sessions'
import { StoreController }  from '@/model/store'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session } = req

  if (method !== 'GET') {
    return res.status(400).end()
  }

  try {
    const store = new StoreController()
    const state = await store.get_store()
    return res.status(200).json(state)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
