import { now }         from '@/lib/utils'
import { StoreStatus } from '@/schema'

export const STORE_DEFAULTS = {
  box          : null,
  deposit      : null,
  invoice      : null,
  deposit_id   : null,
  invoice_id   : null,
  session_id   : null,
  status       : 'loading' as StoreStatus,
  timestamp    : now()
}
