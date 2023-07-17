import { fetcher, Res } from './fetch.js'

export interface ChargeResponse {
  success: true,
  data: {
    lnaddress : string,
    amount    : string,
    invoice   : {
      uri     : string
      request : string
    }
  }
}

export interface PaymentResponse {
  success : boolean,
  data    : {
    id            : string
    fee           : string,
    unit          : string,
    amount        : string,
    invoice       : string
    preimage      : null,
    walletId      : string
    transactionId : string
    callbackUrl   : string
    internalId    : string
    comment       : string
    processedAt   : string
    createdAt     : string
    status        : string
  },
  message  : string
}

const { API_HOST, API_KEY } = process.env

if (typeof API_HOST !== 'string') {
  throw new Error('API_HOST is undefined!')
}

if (typeof API_KEY !== 'string') {
  throw new Error('API_KEY is undefined!')
}

const headers  = new Headers({ apikey : API_KEY })
const callback = ''

export function create_charge (
  lnaddress   : string, 
  amount      : number, 
  description : string
) : Promise<Res<ChargeResponse>> {
  const url = `${API_HOST}/v0/ln-address/fetch-charge`
  const opt = {
    headers,
    method : 'POST',
    body   : JSON.stringify({ lnaddress, amount, description })
  }
  return fetcher(url, opt)
}

export function send_payment (
  lnaddress   : string,
  amount      : number,
  description : string
) : Promise<Response> {
  const url = `${API_HOST}/v0/ln-address/fetch-charge`
  const opt = {
    headers,
    method : 'POST',
    body   : JSON.stringify({ lnaddress, amount, description, callback })
  }
  return fetch(url, opt)
}
