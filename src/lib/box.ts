import { now }        from '@/lib/utils'
import { Store }      from '@/model/store'
import { BoxSession } from '@/types'

const { LOCKBOX_KEY } = process.env

if (typeof LOCKBOX_KEY  !== 'string') {
  throw new Error('LOCKBOX_KEY not defined!')
}

const DEFAULT_STATE : BoxSession = {
  addr_set  : false,
  bal_ok    : false,
  inv_paid  : false,
  box_bal   : null,
  box_state : null
}

export async function get_session (
  body : Partial<BoxSession> = {}
) : Promise<BoxSession> {
  let store = await Store.get({ timestamp: { $lte: now() } })

  if (store === null) {
    store = await Store.create({ timestamp: now() })
  }

  const state = { ...DEFAULT_STATE, ...body }

  state.addr_set = store.address !== null
  state.bal_ok   = check_balance(state.box_bal)
  state.inv_paid = store.is_paid

  return state
}

export function verify_token (token ?: string | string[]) : boolean {
  if (
    typeof token === 'string' &&
    token === LOCKBOX_KEY
  ) {
    return true
  }
  return false
}

function check_balance (balance : number | null) : boolean {
  return balance !== null && balance > 0 && balance <= 100
}
