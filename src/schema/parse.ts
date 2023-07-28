import { z } from 'zod'

const box_data = z.object({
  amount : z.number().nullable(),
  code   : z.string(),
  state  : z.enum([ 'await_addr', 'await_door', 'depositing', 'locked' ])
})

const deposit_data = z.object({
  address : z.string(),
  amount  : z.number()
})

const withdraw_data = z.object({
  charge_id  : z.string(),
  payment_id : z.string(),
})

const store_data = z.object({
  box          : box_data.nullish(),
  deposit      : deposit_data.nullish(),
  withdraw     : withdraw_data.nullish(),
  deposit_id   : z.string().nullish(),
  withdraw_id  : z.string().nullish(),
  session_id   : z.string().nullish(),
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
  deposit_data,
  withdraw_data,
  lnurl_invoice,
  lnurl_params,
  store_data
}
