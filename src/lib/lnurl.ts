import { Buff }   from '@cmdcode/buff-utils'
import { schema } from '@/schema'

export type LNURLResponse<T> = T & { status : undefined } | LNURLError

export type LNURLParamRes = LNURLResponse<LNURLParams>
export type LNURLInvRes   = LNURLResponse<LNURLInvoice>

export interface LNURLParams {
  callback    : string
  maxSendable : number
  minSendable : number
  metadata    : string
  tag         : string
}

export interface LNURLInvoice {
  pr     : string
  routes : string[]
}

export interface LNURLError {
  status : 'ERROR'
  reason : string
}

export function encode_address (
  address : string
) : string {
  if (!address.includes('@')) {
    throw new Error('Address invalid!')
  }
  const [ user, domain ] = address.split('@')
  const url = `https://${domain}/.well-known/lnurlp/${user}`
  return Buff.str(url).toBech32('lnurl')
}

export async function get_invoice (
  lnurl  : string,
  amount : number
) {
  const url = Buff.bech32(lnurl).str
  const params_res = await fetch(url)

  if (!params_res.ok) {
    const { status, statusText } = params_res
    throw new Error(`LNURL params request failed: ${status} ${statusText}`)
  }
  
  const params_data = await params_res.json()

  if (
    params_data.status !== undefined &&
    params_data.status === 'ERROR'
  ) {
    throw new Error(`LNURL params request failed: ${params_data?.reason}`)
  }

  const params = schema.lnurl_params.passthrough().parse(params_data)
  const { minSendable, maxSendable, callback } = params

  if (amount < minSendable || amount > maxSendable) {
    throw new Error(`LNURL params does not permit amount: ${amount}`)
  }

  const inv_res = await fetch(`${callback}?amount=${amount}`)

  if (!inv_res.ok) {
    const { status, statusText } = params_res
    throw new Error(`LNURL invoice request failed: ${status} ${statusText}`)
  }
  
  const inv_data = await inv_res.json()

  if (
    inv_data.status !== undefined &&
    inv_data.status === 'ERROR'
  ) {
    throw new Error(`LNURL invoice request error: ${inv_data?.reason}`)
  }

  const { pr } = schema.lnurl_invoice.parse(inv_data)

  return pr
}
