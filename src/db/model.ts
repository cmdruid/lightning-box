const box = {
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

  required: [ 'box', 'status', 'store_id', 'timestamp' ],

  properties : {
    box,
    deposit_addr : { bsonType : [ 'string', 'null' ] },
    deposit_amt  : { bsonType : [ 'number', 'null' ] },
    invoice_id   : { bsonType : [ 'string', 'null' ] },
    payment_id   : { bsonType : [ 'string', 'null' ] },
    session_id   : { bsonType : [ 'string', 'null' ] },
    store_id     : { bsonType : 'string' },
    status       : { bsonType : 'string' },
    timestamp    : { bsonType : 'number' }
  }
}

export const StoreModel = {
  name: 'store',

  options: {
    validator        : { $jsonSchema: schema },
    validationLevel  : 'strict',
    validationAction : 'error'
  }
}
