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

const withdraw = {
  bsonType : [ 'object', 'null' ],
  required : [ 'charge_id' ],
  properties : {
    charge_id  : { bsonType : 'string' },
    payment_id : { bsonType : 'string' }
  }
}

const schema = {

  bsonType: 'object',

  required: [
    'box', 'deposit', 'withdraw', 'deposit_id', 'withdraw_id',
    'session_id', 'status', 'store_id', 'timestamp'
  ],

  properties : {
    box,
    deposit,
    withdraw,
    store_id    : { bsonType : 'string' },
    deposit_id  : { bsonType : [ 'string', 'null' ] },
    withdraw_id : { bsonType : [ 'string', 'null' ] },
    session_id  : { bsonType : [ 'string', 'null' ] },
    status      : { bsonType : 'string' },
    timestamp   : { bsonType : 'number' }
  }
}

export const StoreModel = {
  name: 'store',

  // indexes: [
  //   {
  //     name   : '_lookup_',
  //     key    : { store_id: 1 },
  //     unique : true
  //   }
  // ],

  options: {
    validator        : { $jsonSchema: schema },
    validationLevel  : 'strict',
    validationAction : 'error'
  }
}
