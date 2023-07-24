import { z } from 'zod'

const box_data = z.object({
  amount : z.number().nullable(),
  code   : z.string().nullable(),
  state  : z.enum([ 'await_addr', 'await_door', 'depositing', 'locked' ])
})

const store_data = z.object({
  box_data   : box_data.nullable(),
  invoice    : z.string().nullable(),
  receipt    : z.string().nullable(),
  recipient  : z.string().nullable(),
  receipt_id : z.string().nullable(),
  reserve_id : z.string().nullable(),
  session_id : z.string().nullable(),
  status     : z.string(),
  timeout    : z.number().nullable(),
  timestamp  : z.number()
})

export const schema = { box_data, store_data }