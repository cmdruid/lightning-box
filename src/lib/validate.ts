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

export function store_status (
  data   : StoreData, 
  status : StoreStatus
) {
  const { status : current_status } = data
  return current_status === status
}

export function reserve_expired (data : StoreData) {
  const { box, status, timestamp } = data
  return (
    status === 'reserved'   &&
    box?.state !== 'locked' &&
    timestamp + SESSION_TIMEOUT < now()
  )
}

export function session_expired (data : StoreData) {
  const { session_id, timestamp } = data
  return (
    session_id !== null &&
    timestamp + SESSION_TIMEOUT < now()
  )
}
