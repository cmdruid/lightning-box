import { now }         from '@/lib/utils'
import { StoreStatus } from '@/schema'

export const STORE_DEFAULTS = {
  deposit      : null,
  invoice      : null,
  deposit_id   : null,
  invoice_id   : null,
  session_id   : null,
  session_code : null,
  status       : 'login' as StoreStatus,
  timestamp    : now()
}
