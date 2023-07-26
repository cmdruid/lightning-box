import { Controller }     from '@/lib/controller'
import { now }            from '@/lib/utils'
import { STORE_DEFAULTS } from '@/db/config'
import { StoreModel }     from '@/db/model'

import {
  config,
  StoreData
} from '@/schema'

const { SESSION_TIMEOUT } = config

export class StoreController extends Controller<StoreData> {

  constructor () {
    super(StoreModel, STORE_DEFAULTS)
  }

  async _hook (data : StoreData) : Promise<StoreData> {
    let update : Partial<StoreData> = {}

    if (invoice_expired(data)) {
      update.invoice_id = null
      update.invoice    = null
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

    data = (data === null)
      ? await this._create()
      : await this._hook(data)

    console.log('db state:', data)

    return data
  }

  async reset () : Promise<StoreData> {
    const template = { ...STORE_DEFAULTS, timestamp: now() }
    console.log('new template:', template)
    return this._update(template, {}, { sort: { timestamp: -1 } })
  }

  async update (template : Partial<StoreData>) : Promise<StoreData> {
    template = { ...template, timestamp: now() }
    return this._update(template, {}, { sort: { timestamp: -1 } })
  }
}

export const Store = new Controller<StoreData>(StoreModel, STORE_DEFAULTS)

export function invoice_expired (data : StoreData) {
  const { invoice, status, timestamp } = data
  return (
    status  === 'locked' &&
    invoice !== null     &&
    timestamp + SESSION_TIMEOUT < now()
  )
}

export function reserve_expired (data : StoreData) {
  const { box, deposit, status, timestamp } = data
  return (
    status     !== 'locked' &&
    box?.state !== 'locked' &&
    deposit    !== null     &&
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
