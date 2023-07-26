const box = {
  bsonType : [ 'object', 'null' ],
  required : [ 'amount', 'code', 'state' ],
  properties : {
    amount : { bsonType : [ 'number', 'null' ] },
    code   : { bsonType : [ 'string', 'null' ] },
    state  : { enum : [ 'await_addr', 'await_door', 'depositing', 'locked'] }
  }
}

const deposit = {
  bsonType : [ 'object', 'null' ],
  required : [ 'address', 'amount' ],
  properties : {
    address : { bsonType : 'string', },
    amount  : { bsonType : 'number', },
  }
}

const invoice = {
  bsonType : [ 'object', 'null' ],
  required : [ 'charge_id', 'payment_id' ],
  properties : {
    charge_id  : { bsonType : [ 'string', 'null' ] },
    payment_id : { bsonType : [ 'string', 'null' ] }
  }
}

const schema = {

  bsonType: 'object',

  required: [
    'box', 'deposit', 'invoice', 'deposit_id', 'invoice_id',
    'session_id', 'status', 'timestamp'
  ],

  properties : {
    box,
    deposit,
    invoice,
    deposit_id   : { bsonType : [ 'string', 'null' ] },
    invoice_id   : { bsonType : [ 'string', 'null' ] },
    session_id   : { bsonType : [ 'string', 'null' ] },
    status       : { bsonType : 'string' },
    timestamp    : { bsonType : 'number' }
  }
}

export const StoreModel = {
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
