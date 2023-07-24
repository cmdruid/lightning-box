import { box_post }    from './box.js'
import { reset_store } from './reset.js'

box_post({
  amount : 5,
  code   : 12345,
  locked : false,
  status : 'ready'
})

// reset_store()