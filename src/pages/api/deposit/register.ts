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
  const { deposit, status } = state
  const { address } = query

  if (
    method !== 'GET'   ||
    status !== 'ready' ||
    typeof address !== 'string'
  ) {
    console.log('addr:', address)
    return res.status(400).end()
  }

  let lnurl : string = address

  // try {
  //   lnurl = await parse_address(address)
  // } catch (err) {
  //   const { message } = err as Error
  //   return res.status(400).send(message)
  // }

  try {
    const ret = await store.update({ 
      deposit_id : session.id,
      deposit    : { address: lnurl, amount : 0 },
      status     : 'reserved'
    })
    req.session.status = 'reserved'
    await req.session.save()
    return res.status(200).json(ret)
  } catch (err) {
    console.error(err)
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
  console.log('lnurl:', address)
  await get_invoice(address, 100)
  return address
}
