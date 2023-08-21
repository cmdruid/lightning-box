import { Buff }   from '@cmdcode/buff-utils'
import { config } from '@/schema'

const { MAX_AMOUNT } = config

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
  addr ?: string | null
) : addr is string {
  if (typeof addr !== 'string') {
    return false
  }
  try {
    const url = Buff.bech32(addr).str
    return url.includes('http://') || url.includes('https://')
  } catch {
    return false
  }
}
