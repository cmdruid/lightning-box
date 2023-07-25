import { z } from 'zod'

const address  = z.string().email()

const box_data = z.object({
  amount : z.number().nullable(),
  code   : z.string().nullable(),
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

export const schema = { address, box_data, store_data }
