import { Controller }     from '@/lib/controller'
import { now }            from '@/lib/utils'
import { STORE_DEFAULTS } from '@/db/config'
import { StoreModel }     from '@/db/model'

import {
  config,
  StoreData
} from '@/schema'

import * as validate from '@/lib/validate'

const { DEBUG } = process.env

const { SESSION_TIMEOUT } = config
const { store_id } = STORE_DEFAULTS

export class StoreController extends Controller<StoreData> {

  constructor () {
    super(StoreModel, STORE_DEFAULTS)
  }

  async _hook (data : StoreData) : Promise<StoreData> {
    let update : Partial<StoreData> = {}

    const parsed_status = parse_status(data)

    if (data.status !== parsed_status) {
      update.status = parsed_status
    }

    if (box_unlocked(data)) {
      data = await this.reset({ box : data.box })
    }

    // if (box_locked(data)) {
    //   console.log('box is locked!')
    //   const { ok, deposit_addr, deposit_amt } = parse_deposit(data)
    //   if (ok) {
    //     update.deposit_addr = deposit_addr
    //     update.deposit_amt  = deposit_amt
    //     update.status       = 'locked'
    //   }
    // }

    if (withdraw_expired(data)) {
      update.invoice_id = undefined
    }

    if (reserve_expired(data)) {
      update.deposit_addr = undefined
      update.deposit_amt  = undefined
      update.box          = null
    }

    if (session_expired(data)) {
      update.session_id = undefined
    }

    if (Object.entries(update).length > 0) {
      data = await this.update(update)
    }

    return data
  }

  async get () : Promise<StoreData> {
    let data = await this._get({ store_id })

    if (data === null) {
      return STORE_DEFAULTS
    }
    
    await this._hook(data)

    if (DEBUG) console.log('db state:', data)

    return data
  }

  async reset (template ?: Partial<StoreData>) : Promise<StoreData> {
    template = { ...STORE_DEFAULTS, ...template, timestamp: now() }
    return this._update({ store_id }, template, {}, { upsert : true })
  }

  async update (template : Partial<StoreData>) : Promise<StoreData> {
    template = { ...template, timestamp: now() }
    console.log('template:', template)
    return this._update({ store_id }, template)
  }
}

export const Store = new Controller<StoreData>(StoreModel, STORE_DEFAULTS)

export function box_unlocked (data : StoreData) {
  const { box, status } = data
  return (
    status     === 'paid' &&
    box?.state === 'await_addr'
  )
}

export function box_locked (data : StoreData) {
  const { box, status } = data
  return (
    status     === 'reserved' &&
    box?.state === 'locked'
  )
}

export function inv_received (data : StoreData) {
  const { invoice_id, payment_id, status } = data
  return (
    status     === 'received' &&
    invoice_id !== undefined  &&
    payment_id === undefined
  )
}

export function withdraw_expired (data : StoreData) {
  const { status, timestamp } = data
  return (
    status      === 'locked' &&
    timestamp + SESSION_TIMEOUT < now()
  )
}

export function reserve_expired (data : StoreData) {
  const { box, deposit_addr, status, timestamp } = data
  return (
    status       === 'reserved' &&
    deposit_addr !== undefined  &&
    box?.state   !== 'locked'   &&
    timestamp + SESSION_TIMEOUT < now()
  )
}

export function session_expired (data : StoreData) {
  const { session_id, timestamp } = data
  return (
    session_id !== undefined &&
    timestamp + SESSION_TIMEOUT < now()
  )
}

function parse_status (data : StoreData) {
  const { box, status } = data

  if (box === null) return 'init'

  if (
    status    === 'paid' && 
    box.state === 'await_addr'
  ) {
    return 'ready'
  }

  return status
}

// function parse_deposit (
//   data : StoreData
// ) {
//   const { deposit_addr, deposit_amt } = data

//   if (
//     validate.address_ok(deposit_addr) &&
//     validate.amount_ok(deposit_amt)
//   ) {
//     return { ok : true, deposit_addr, deposit_amt }
//   }
//   return { ok : false }
// }
