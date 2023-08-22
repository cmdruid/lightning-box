import type { NextApiRequest, NextApiResponse } from 'next'

import { Buff }            from '@cmdcode/buff-utils'
import { withSessionAuth } from '@/middleware'
import { get_invoice }     from '@/lib/lnurl'
import { get_rate }        from '@/lib/oracle'

import {
  Invoice,
  fetch_invoice,
  pay_invoice
} from '@/lib/lnd'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store }   = req
  const { box, deposit_addr, deposit_amt, invoice_id, payment_id } = state

  const query_id = req.query.id

  let inv_id : string

  if (method !== 'GET' || typeof query_id !== 'string') {
    return res.status(400).json({ error : 'Invalid request!' })
  }

  if (box?.state !== 'locked') {
    return res.status(400).json({ error : 'The box is not locked!' })
  }

  if (deposit_addr === null || deposit_amt  === null) {
    return res.status(400).json({ error : 'The box is not ready for withdraw!' })
  }

  if (invoice_id !== null) {
    if (query_id !== invoice_id) {
      return res.status(403).json({ error : 'There is another invoice being processed!' })
    }
    inv_id = invoice_id
  } else {
    inv_id = query_id
  }

  try {
    let pay_id   : string  | null = payment_id,
        pay_hash : string  | undefined,
        payment  : Invoice | undefined
    
    const r_hash  = Buff.hex(inv_id).base64
    console.log('invoice hash:', r_hash)
    const invoice = await fetch_invoice(r_hash)

    if (!invoice.ok) {
      return res.status(400).json({ error : invoice.error })
    }

    if (
      invoice_id === null &&
      invoice.data !== null
    ) {
      await store.update({
        invoice_id : inv_id
      })
    }

    const { state : inv_state } = invoice.data

    if (inv_state === 'SETTLED') {
      if (state.status === 'locked') {
        await store.update({
          status : 'received'
        })
      }

      if (pay_id === null) {
        const sats  = await get_rate(deposit_amt)
        const total = sats * 1000
        const payment_inv = await get_invoice(deposit_addr, total)
        const payment_res = await pay_invoice(payment_inv)

        if (!payment_res.ok) {
          return res.status(400).json({ error: payment_res.error })
        }

        console.log('paydata:', payment_res)

        pay_hash = payment_res.data.payment_hash
        pay_id   = Buff.base64(pay_hash).hex

        await store.update({
          status       : 'paid',
          deposit_addr : null,
          deposit_amt  : null,
          invoice_id   : null,
        })
      }
    }
    
    console.log('session:', session)
    console.log('store:', state)
    console.log('payment:', payment)

    return res.status(200).json({
      invoice_id    : inv_id,
      invoice_value : invoice.data.value,
      invoice_state : invoice.data.state,
      payment_id    : pay_id,
      site_status   : state.status,
      box_state     : box.state
    })
  } catch (err) {
    console.error('api/invoice/status:', err)
    return res.status(500).json({ status: 'ERROR', error: 'Internal server error.' })
  }
}
