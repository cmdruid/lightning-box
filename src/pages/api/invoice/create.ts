import type { NextApiRequest, NextApiResponse } from 'next'

import { Buff }            from '@cmdcode/buff-utils'
import { withSessionAuth } from '@/middleware'
import { config }          from '@/schema'
import { get_rate }        from '@/lib/oracle'
import { create_invoice }  from '@/lib/lnd'

const { SRV_HOSTNAME } = process.env

if (SRV_HOSTNAME === undefined) {
  throw new Error('SRV_HOSTNAME is undefined!')
}

const { ESCROW_FEE, ESCROW_RATE } = config

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, state } = req
  const { box, deposit_addr, deposit_amt, status } = state

  if (method !== 'GET') {
    return res.status(400).json({ error : 'Invalid request!' })
  }

  if (box?.state !== 'locked') {
    return res.status(400).json({ error : 'The box is not locked!' })
  }

  if (
    deposit_addr === null || 
    deposit_amt  === null ||
    status !== 'locked'
  ) {
    return res.status(400).json({ error : 'The box is not ready for deposits!' })
  }

  try {

    const amount = req.query.amount
        , amt    = await get_rate(deposit_amt)
        , rate   = Math.ceil(amt * ESCROW_RATE)
        , total  = (amt + rate + ESCROW_FEE) * 1000
        , meta   = Buff.json([['text/plain', 'lightning box']])

    console.log('quote:', deposit_amt, amt)

    if (typeof amount !== 'string') {
      return res.status(200).json({
        callback    : SRV_HOSTNAME + '/api/invoice/create',
        maxSendable : total,
        minSendable : total,
        metadata    : meta.str,
        tag         : 'payRequest'
      })
    }

    if (Number(amount) !== total) {
      return res.status(403).json({
        status : 'ERROR',
        reason : 'Invalid amount specified: ' + amount
      })
    }

    const hash    = meta.digest.hex
    const invoice = await create_invoice({ amount: total, hash })

    if (!invoice.ok) {
      console.log('[LND] Create invoice failed:', invoice.error)
      return res.status(500).json({
        status : 'ERROR',
        reason : 'Failed to create invoice. Please try again.'
      })
    }

    const { payment_request, r_hash } = invoice.data
    const invoice_id = Buff.base64(r_hash).hex

    return res.status(200).json({
      pr     : payment_request,
      routes : [],
      successAction: {
        tag         : 'url',
        description : 'Click the link to unlock the box:',
        url         : SRV_HOSTNAME + `/pay?invoice_id=${invoice_id}`
      }
    })
  } catch (err) {
    console.error('api/invoice/create:', err)
    return res.status(500).json({ status: 'ERROR', error: 'Internal server error.' })
  }
}
