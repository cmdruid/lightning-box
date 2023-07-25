import { Controller }     from '@/lib/controller'
import { now }            from '@/lib/utils'
import { STORE_DEFAULTS } from '@/db/config'
import { StoreModel }     from '@/db/model'

import * as validate from '@/lib/validate'

import {
  StoreData,
  StoreStatus
} from '@/schema'

export class StoreController extends Controller<StoreData> {

  constructor () {
    super(StoreModel, STORE_DEFAULTS)
  }

  async _hook (data : StoreData) : Promise<StoreData> {
    const { status, timestamp } = data
    const parsed_status = get_status(data)
    if (validate.session_expired(timestamp)) {
      data = await this.update({ session_id : null })
    }
    if (status !== parsed_status) {
      data = await this.update({ status : parsed_status })
    }
    return data
  }

  async get () : Promise<StoreData> {
    let data = await this._get({ timestamp: { $lte: now() } })

    data = (data === null)
      ? await this._create()
      : await this._hook(data)

    console.log('store:', data)

    return data
  }

  async _reset () : Promise<StoreData> {
    return this._update(
        STORE_DEFAULTS,
        {},
        { sort: { timestamp: -1 } }
      )
  }

  async update (template : Partial<StoreData>) : Promise<StoreData> {
    template = { ...template, timestamp: now() }
    console.log('template:', template)
    return this._update(template, {}, { sort: { timestamp: -1 } })
  }
}

export const Store = new Controller<StoreData>(StoreModel, STORE_DEFAULTS)

function get_status (data : StoreData) {
  const { deposit_id, invoice_id, session_id, session_code } = data

  let status : StoreStatus = 'loading'

  if (typeof invoice_id === 'string') {
    status = 'invoice'
  } else if (typeof deposit_id === 'string') {
    status = 'deposit'
  } else if (typeof session_id === 'string') {
    status = 'ready'
  } else if (typeof session_code !== 'string') {
    status = 'loading'
  } else {
    status = 'login'
  }
  return status
}
