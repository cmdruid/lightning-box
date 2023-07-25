const deposit = {
  bsonType : [ 'object', 'null' ],
  required : [ 'amount', 'state' ],
  properties : {
    address : { bsonType : [ 'string', 'null' ] },
    amount  : { bsonType : [ 'number', 'null' ] },
    state   : { enum : [ 'await_addr', 'await_door', 'depositing', 'locked'] }
  }
}

const invoice = {
  bsonType : [ 'object', 'null' ],
  required : [ 'invoice_id', 'receipt_id' ],
  properties : {
    invoice_id : { bsonType : 'string' },
    receipt_id : { bsonType : 'string' }
  }
}

const schema = {

  bsonType: 'object',

  required: [
    'deposit',      'invoice',    'deposit_id', 'invoice_id',
    'session_code', 'session_id', 'status',     'timestamp'
  ],

  properties : {
    deposit,
    invoice,
    deposit_id   : { bsonType : [ 'string', 'null' ] },
    invoice_id   : { bsonType : [ 'string', 'null' ] },
    session_id   : { bsonType : [ 'string', 'null' ] },
    session_code : { bsonType : [ 'string', 'null' ] },
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
