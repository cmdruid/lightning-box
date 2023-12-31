import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'

import {
  encode_address,
  get_invoice
}  from '@/lib/lnurl'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, session, state, store } = req
  const { status }  = state
  const { address } = query

  if (
    method !== 'GET'   ||
    status !== 'ready' ||
    typeof address !== 'string'
  ) {
    return res.status(400).end()
  }

  let lnurl : string = address

  try {
    lnurl = await parse_address(address)
  } catch (err) {
    console.log('[LNURL]: Fetch address failed:', err)
    return res.status(422).json({ error: 'Failed to validate LNURL. Please check it and try again.' })
  }

  try {
    const ret = await store.update({ 
      deposit_addr : lnurl, 
      deposit_amt  : 0,
      status       : 'reserved'
    })
    req.session.status = 'reserved'
    await req.session.save()
    return res.status(200).json(ret)
  } catch (err) {
    console.error('api/deposit/register:', err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}

async function parse_address (
  address : string
) : Promise<string> {
  if (address.includes('@')) {
    address = encode_address(address)
  }
  const res = await get_invoice(address, 1000)
  console.log('res:', res)
  return address
}
