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
  const { box, invoice_id, invoice, status } = state

  if (
    method !== 'GET'    ||
    status !== 'locked' ||
    invoice === null
  ) {
    return res.status(400).end()
  }

  if (box?.state !== 'locked') {
    return res.status(403).end()
  }

  if (invoice_id !== session.id) {
    return res.status(401).end()
  }

  const { charge_id } = invoice

  try {
    const charge = await get_charge(charge_id)

    if (!charge.ok) {
      return res.status(400).json({ error : charge.err })
    }

    if (!charge.data.success) {
      return res.status(400).json({ error : charge.data.message })
    }

    const { data } = charge.data

    // This would be a good place to check for payment
    // const ret = await store.update({
    //   invoice_id : session.id,
    //   invoice    : { charge_id : data.id }
    // })

    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ err: message })
  }
}
