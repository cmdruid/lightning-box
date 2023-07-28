import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { send_payment }    from '@/lib/zbd'
import { get_invoice }     from '@/lib/lnurl'

const { VERCEL_URL, VERCEL_ENV } = process.env

const proto = (VERCEL_ENV === 'development') ? 'http' : 'https'

const HOSTNAME = `${proto}://${VERCEL_URL}`

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { box, deposit, withdraw_id, withdraw } = state

  if (method !== 'GET') {
    return res.status(400).end()
  }

  if (withdraw_id !== session.id) {
    return res.status(401).end()
  }

  if (
    deposit  === null       ||
    withdraw === null       ||
    box?.state !== 'locked' ||
    state.status !== 'received'
  ) {
    return res.status(403).end()
  }

  const config = {
    internalId  : withdraw_id,
    callbackUrl : `${HOSTNAME}/api/charge/callback`
  }
  
  const { charge_id, payment_id } = withdraw

  if (charge_id === null) {
    return res.status(403).end()
  }

  if (payment_id !== undefined) {
    return res.status(403).end()
  }

  const { address } = deposit

  const amount = deposit.amount * 1000

  try {
    const invoice = await get_invoice(address, amount)
    const payment = await send_payment(invoice, config)

    if (!payment.ok) {
      console.log('ZBD Fetch error:', payment.error )
      return res.status(400).json({ error : payment.error })
    }

    const { success, data, message } = payment.data

    if (!success) {
      console.log('ZBD Response error:', message)
      return res.status(400).json({ error : message })
    }

    await store.update({
      status : 'paid',
      withdraw : { charge_id, payment_id : data.id }
    })

    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
