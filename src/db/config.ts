import { now }       from '@/lib/utils'
import { StoreEnum } from '@/schema'

const { STORE_ID } = process.env

if (typeof STORE_ID !== 'string') {
  throw new Error('STORE_ID is undefined!')
}

export const STORE_DEFAULTS = {
  store_id     : STORE_ID,
  box          : null,
  deposit_addr : null,
  deposit_amt  : null,
  session_id   : null,
  invoice_id   : null,
  payment_id   : null,
  status       : 'init' as StoreEnum,
  timestamp    : now()
}
