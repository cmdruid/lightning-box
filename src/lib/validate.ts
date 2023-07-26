import { Buff } from '@cmdcode/buff-utils'
import { now }  from './utils'

import { StoreData, StoreStatus, config } from '@/schema'

const { MAX_AMOUNT, SESSION_TIMEOUT } = config

export function amount_ok (
  num ?: number | null
) : num is number {
  if (
    typeof num === 'number' &&
    num > 0                 &&
    num < MAX_AMOUNT
  ) {
    return true
  }
  return false
}

export function address_ok (
  addr ?: string
) : addr is string {
  if (typeof addr !== 'string') {
    return false
  }
  try {
    const url = Buff.bech32(addr).str
    return url.includes('https://')
  } catch {
    return false
  }
}
