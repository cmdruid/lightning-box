import { now }         from '@/lib/utils'
import { StoreStatus } from '@/schema'

export const STORE_DEFAULTS = {
  status    : 'login' as StoreStatus,
  timestamp : now()
}
