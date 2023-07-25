import { Buff }   from '@cmdcode/buff-utils'
import { config } from '@/schema'
import { now } from './utils'

const { MAX_AMOUNT, SESSION_TIMEOUT } = config

export function amount_ok (num ?: number | null) {
  if (
    typeof num === 'number' &&
    num > 0                 &&
    num < MAX_AMOUNT
  ) {
    return true
  }
  return false
}

export function address_ok (addr ?: string) {
  if (typeof addr !== 'string') {
    return false
  }
  try {
    Buff.bech32(addr)
    return true
  } catch {
    return false
  }
}

export function session_expired (stamp : number) {
  return stamp + SESSION_TIMEOUT < now()
}