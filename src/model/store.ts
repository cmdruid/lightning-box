import { Controller } from '@/lib/controller'
import { now }        from '@/lib/utils'

import { 
  StoreData,
  StoreStatus
} from '@/schema'

export const STORE_DEFAULTS = {
  box_data   : null,
  invoice    : null,
  receipt    : null,
  recipient  : null,
  receipt_id : null,
  reserve_id : null,
  status     : 'ready' as StoreStatus,
  timeout    : null,
  timestamp  : now()
}

export const RESERVE_DURATION = 30

const box_schema = {
  bsonType : [ 'object', 'null' ],
  required : [ 'amount', 'code', 'state' ],
  properties : {
    amount : { bsonType : [ 'number', 'null' ] },
    code   : { bsonType : [ 'string', 'null' ] },
    state  : { enum : [ 'await_addr', 'await_door', 'depositing', 'locked'] }
  }
}

const schema = {

  bsonType: 'object',

  required: [ 
    'box_data',   'invoice',    'recipient', 
    'receipt_id', 'reserve_id', 'status', 
    'timeout',    'timestamp' 
  ],

  properties : {
    box_data   : box_schema,
    invoice    : { bsonType : [ 'string', 'null' ] },
    recipient  : { bsonType : [ 'string', 'null' ] },
    receipt_id : { bsonType : [ 'string', 'null' ] },
    reserve_id : { bsonType : [ 'string', 'null' ] },
    status     : { bsonType : 'string' },
    timeout    : { bsonType : [ 'number', 'null' ] },
    timestamp  : { bsonType : 'number' }
  }
}

const StoreModel = {
  name: 'store',

  indexes: [
    {
      name   : '_lookup_',
      key    : { timestamp: -1 },
      unique : true
    }
  ],

  options: {
    validator        : { $jsonSchema: schema },
    validationLevel  : 'strict',
    validationAction : 'error'
  }
}

export class StoreController extends Controller<StoreData> {

  constructor () {
    super(StoreModel, STORE_DEFAULTS)
  }

  async _hook (store : StoreData) : Promise<StoreData> {
    const { status, timeout } = store

    if (
      status === 'reserved' &&
      timeout !== null      &&
      now() > timeout
    ) {
      return this.reset()
    }

    return store
  }

  async get () : Promise<StoreData> {
    let store = await this._get({ timestamp: { $lte: now() } })

    store = (store === null)
      ? await this._create()
      : await this._hook(store)

    console.log('store:', store)

    return store
  }

  async reset () : Promise<StoreData> {
    return this._update(
        STORE_DEFAULTS,
        {},
        { sort: { timestamp: -1 } }
      )
  }

  async update (template : Partial<StoreData>) : Promise<StoreData> {
    return this._update(template, {}, { sort: { timestamp: -1 } })
  }
}

export const Store = new Controller<StoreData>(StoreModel, STORE_DEFAULTS)