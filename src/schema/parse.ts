import { z } from 'zod'

const box_data = z.object({
  amount : z.number().nullable(),
  code   : z.number().nullable(),
  locked : z.boolean(),
  status : z.enum([ 'ready', 'reserved', 'deposit', 'locked' ])
})

const store_data = z.object({
  box_amount : z.number().nullable(),
  box_code   : z.number().nullable(),
  invoice    : z.string().nullable(),
  receipt    : z.string().nullable(),
  recipient  : z.string().nullable(),
  receipt_id : z.string().nullable(),
  reserve_id : z.string().nullable(),
  status     : z.string(),
  timeout    : z.number().nullable(),
  timestamp  : z.number()
})

export const schema = { box_data, store_data }