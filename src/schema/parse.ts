import { z } from 'zod'

const box_data = z.object({
  amount : z.number().nullable(),
  code   : z.string(),
  state  : z.enum([ 'await_addr', 'await_door', 'depositing', 'locked' ])
})

const store_data = z.object({
  deposit_id   : z.string().nullish(),
  deposit      : z.string().nullish(),
  invoice_id   : z.string().nullish(),
  invoice      : z.string().nullish(),
  session_id   : z.string().nullish(),
  session_code : z.string().nullish(),
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
