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

const schema = {

  bsonType: 'object',

  required: [ 'address', 'amount', 'invoice', 'is_paid', 'session_id', 'timestamp' ],

  properties : {
    address  : {
      bsonType : [ 'string', 'null' ]
    },
    amount : {
      bsonType : [ 'number', 'null' ]
    },
    invoice  : {
      bsonType : [ 'string', 'null' ]
    },
    is_paid  : {
      bsonType : 'bool'
    },
    session_id : {
      bsonType : 'string'
    },
    timestamp : {
      bsonType : 'number'
    }
  }
}

const StoreModel = {
  name: 'store',

  indexes: [
    {
      name   : '_lookup_',
      key    : { address: 1, invoice: 1, timestamp: -1 },
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

    return store
  }

  async reset () : Promise<StoreData> {
    return this._update(
        STORE_DEFAULTS,
        { sort: { timestamp: -1 } }
      )
  }

  async update (template : Partial<StoreData>) : Promise<StoreData> {
    return this._update(template, { sort: { timestamp: -1 } })
  }
}

export const Store = new Controller<StoreData>(StoreModel, STORE_DEFAULTS)