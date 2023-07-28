import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionAuth } from '@/middleware'
import { get_charge }      from '@/lib/zbd'

const { VERCEL_URL, VERCEL_ENV } = process.env

const proto = (VERCEL_ENV === 'development') ? 'http' : 'https'

const HOSTNAME = `${proto}://${VERCEL_URL}`

export default withSessionAuth(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session, state, store } = req
  const { box, deposit, withdraw_id, withdraw, status } = state

  if (
    method !== 'GET'     ||
    status !== 'locked'  ||
    withdraw_id === null
  ) {
    return res.status(400).end()
  }

  if (withdraw_id !== session.id) {
    return res.status(401).end()
  }

  if (
    deposit  === null ||
    withdraw === null ||
    box?.state !== 'locked'
  ) {
    return res.status(403).end()
  }

  const config = {
    internalId  : withdraw_id,
    callbackUrl : `${HOSTNAME}/api/charge/callback`
  }

  const { charge_id } = withdraw

  try {
    const charge = await get_charge(charge_id)

    if (!charge.ok) {
      console.log('ZBD Fetch error:', charge.error )
      return res.status(400).json({ error : charge.error })
    }

    const { success, data, message } = charge.data

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
      state.status === 'locked'
    ) {
      await store.update({ status : 'received' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
