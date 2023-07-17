import { Controller } from "@/lib/controller"

export interface Store {
  address   : string | null
  balance   : number | null
  invoice   : string | null
  is_paid   : boolean
  timestamp : number | null
}

export const STORE_DEFAULTS = {
  address   : null,
  balance   : null,
  invoice   : null,
  is_paid   : false,
  timestamp : null
}

const schema = {

  bsonType: 'object',

  required: [ 'address', 'balance', 'invoice', 'is_paid', 'timestamp' ],

  properties : {
    address  : {
      bsonType : [ 'string', 'null' ]
    },
    balance : {
      bsonType : [ 'number', 'null' ]
    },
    invoice  : {
      bsonType : [ 'string', 'null' ]
    },
    is_paid  : {
      bsonType : 'bool'
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

export const Store = new Controller<Store>(StoreModel, STORE_DEFAULTS)