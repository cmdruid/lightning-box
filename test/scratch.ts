import { box_post }    from './box.js'
import { reset_store } from './reset.js'

box_post({
  amount : 5,
  code   : '12345',
  state  : 'await_addr'
})

// reset_store()