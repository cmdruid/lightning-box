import { Buff } from '@cmdcode/buff-utils'

const url = 'http://localhost:3000/api/lnurl'

console.log(Buff.str(url).toBech32('lnurl'))
