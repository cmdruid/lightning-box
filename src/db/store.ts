import { Controller }     from '@/lib/controller'
import { now }            from '@/lib/utils'
import { STORE_DEFAULTS } from '@/db/config'
import { StoreModel }     from '@/db/model'

import {
  config,
  StoreData
} from '@/schema'

import * as validate from '@/lib/validate'

const { SESSION_TIMEOUT } = config

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

    if (box_locked(data)) {
      const { session_id } = data
      const { ok, address, amount } = parse_deposit(data)
      if (ok) {
        update.deposit_id = session_id
        update.deposit    = { address, amount }
        update.status     = 'locked'
      }
    }

    if (withdraw_expired(data)) {
      update.withdraw_id = null
      update.withdraw    = null
    }

    if (reserve_expired(data)) {
      update.deposit_id = null
      update.deposit    = null
      update.box        = null
    }

    if (session_expired(data)) {
      update.session_id = null
    }

    if (Object.entries(update).length > 0) {
      data = await this.update(update)
    }

    return data
  }

  async get () : Promise<StoreData> {
    let data = await this._get({ timestamp: { $lte: now() } })

    if (data === null) {
      throw new Error('Controller returned null value!')
    }
    
    await this._hook(data)

    console.log('db state:', data)

    return data
  }

  async reset (template : Partial<StoreData>) : Promise<StoreData> {
    template = { ...STORE_DEFAULTS, ...template, timestamp: now() }
    return this._update(template, {}, { sort: { timestamp: -1 } })
  }

  async update (template : Partial<StoreData>) : Promise<StoreData> {
    template = { ...template, timestamp: now() }
    return this._update(template, {}, { sort: { timestamp: -1 } })
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

export function withdraw_expired (data : StoreData) {
  const { withdraw_id, status, timestamp } = data
  return (
    status      === 'locked' &&
    withdraw_id !== null     &&
    timestamp + SESSION_TIMEOUT < now()
  )
}

export function reserve_expired (data : StoreData) {
  const { box, deposit_id, status, timestamp } = data
  return (
    status     === 'reserved' &&
    deposit_id !== null       &&
    box?.state !== 'locked'   &&
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

function parse_deposit (
  data : StoreData
) : { 
  ok       : true
  address  : string
  amount   : number
} | {
  ok       : false
  address ?: string
  amount  ?: number | null
} {
  const { box, deposit } = data
  const { address } = deposit ?? {}
  const { amount }  = box     ?? {}

  if (
    validate.address_ok(address) &&
    validate.amount_ok(amount)
  ) {
    return { ok : true, address, amount }
  }
  return { ok : false, address, amount }
}