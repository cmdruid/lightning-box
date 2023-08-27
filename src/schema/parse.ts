import { z } from 'zod'

const box_data = z.object({
  amount : z.number().nullable(),
  code   : z.string(),
  state  : z.enum([ 'await_addr', 'await_door', 'reserved', 'locked', 'unknown' ])
})

const store_data = z.object({
  box          : box_data.nullish(),
  deposit_addr : z.string().optional(),
  deposit_amt  : z.number().optional(),
  invoice_id   : z.string().optional(),
  payment_id   : z.string().optional(),
  session_id   : z.string().optional(),
  status       : z.string(),
  timestamp    : z.number()
})

const lnurl_params = z.object({
  callback    : z.string().url(),
  minSendable : z.number(),
  maxSendable : z.number(),
  metadata    : z.string(),
  tag         : z.literal('payRequest')
})

const lnurl_invoice = z.object({
  pr     : z.string(),
  routes : z.string().array(),
})

export const schema = {
  box_data,
  lnurl_invoice,
  lnurl_params,
  store_data
}
