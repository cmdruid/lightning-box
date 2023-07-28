import { now }         from '@/lib/utils'
import { StoreStatus } from '@/schema'

export const STORE_DEFAULTS = {
  box         : null,
  deposit     : null,
  withdraw    : null,
  deposit_id  : null,
  withdraw_id : null,
  session_id  : null,
  status      : 'init' as StoreStatus,
  timestamp   : now()
}
