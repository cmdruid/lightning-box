import { now }         from '@/lib/utils'
import { StoreStatus } from '@/schema'

const { STORE_ID } = process.env

if (typeof STORE_ID !== 'string') {
  throw new Error('STORE_ID is undefined!')
}

export const STORE_DEFAULTS = {
  store_id    : STORE_ID,
  box         : null,
  deposit     : null,
  withdraw    : null,
  deposit_id  : null,
  withdraw_id : null,
  session_id  : null,
  status      : 'init' as StoreStatus,
  timestamp   : now()
}
