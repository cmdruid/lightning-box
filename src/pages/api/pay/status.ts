import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { get_payment }     from '@/lib/zbd'

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { box, deposit, withdraw_id, withdraw, status } = state

  if (
    method !== 'GET'        ||
    box?.state !== 'locked' ||
    withdraw_id === null
  ) {
    return res.status(400).end()
  }

  if (withdraw_id !== session.id) {
    return res.status(401).end()
  }

  if (
    deposit    === null ||
    withdraw   === null ||
    box?.state !== 'locked'
  ) {
    return res.status(403).end()
  }

  const { charge_id, payment_id } = withdraw

  if (payment_id === undefined) {
    return res.status(403).end()
  }

  try {
    const payment = await get_payment(payment_id)

    if (!payment.ok) {
      console.log('ZBD Fetch error:', payment.error )
      return res.status(400).json({ error : payment.error })
    }

    const { success, data, message } = payment.data

    if (!success) {
      console.log('ZBD Response error:', message)
      return res.status(400).json({ error : message })
    }

    if (data.internalId !== withdraw_id) {
      return res.status(403).json({
        message : 'Charge internal ID does not match withdraw ID!'
      })
    }

    if (
      data.status  === 'completed' &&
      state.status === 'received'
    ) {
      await store.update({
        status   : 'paid',
        deposit  : null,
        withdraw : { charge_id, payment_id : data.id }
      })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
