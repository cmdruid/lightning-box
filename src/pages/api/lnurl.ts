import type { NextApiRequest, NextApiResponse } from 'next'

import { Buff }           from '@cmdcode/buff-utils'
import { create_invoice } from '@/lib/lnd'

const { SRV_HOSTNAME } = process.env

if (SRV_HOSTNAME === undefined) {
  throw new Error('SRV_HOSTNAME is undefined!')
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req
  const { amount } = query
  

  if (method !== 'GET') {
    return res.status(400).json({ error : 'Invalid request!' })
  }

  const meta = Buff.json([['text/plain', 'testing']])

  if (typeof amount !== 'string') {
    return res.status(200).json({
      callback    : SRV_HOSTNAME + '/api/lnurl',
      maxSendable : 100_000_000_000,
      minSendable : 1000,
      metadata    : meta.str,
      tag         : 'payRequest'
    })
  }

  const hash    = meta.digest.hex
  const invoice = await create_invoice({ amount: Number(amount), hash })

  if (!invoice.ok) {
    console.log('[LND] Create invoice failed:', invoice.error)
    return res.status(500).json({
      status : 'ERROR',
      reason : 'Failed to create invoice. Please try again.'
    })
  }
  
  const { payment_request } = invoice.data

  return res.status(200).json({
    pr     : payment_request,
    routes : []
  })
}
