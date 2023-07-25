import { Buff } from "@cmdcode/buff-utils"

import { fetcher, Res } from '@/lib/fetch'
import { parse_schema } from '@/lib/utils'
import { schema }       from '@/schema'

import * as validate    from '@/lib/validate'

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
  return Buff
    .str(`https://${domain}/.well-known/lnurlp/${user}`)
    .toBase64()
}

export async function get_invoice (
  lnurl  : string,
  amount : number
) {
  const amt = amount * 1000
  const url = Buff.bech32(lnurl).str
  console.log('decoded:', url)
  const params_res = await fetcher<LNURLParamRes>(url)
  if (!params_res.ok) {
    throw new Error(`LNURL params request failed: ${params_res.err}`)
  }
  if (params_res.data.status === 'ERROR') {
    throw new Error(`LNURL params request failed: ${params_res.data.reason}`)
  }
  const params = parse_schema (params_res.data, schema.lnurl_params)
  const { minSendable, maxSendable, callback } = params
  if (amt < minSendable || amt > maxSendable) {
    throw new Error(`LNURL params does not permit amount: ${amount}`)
  }
  const inv_res = await fetcher<LNURLInvRes>(`${callback}?amount=${amt}`)
  if (!inv_res.ok) {
    throw new Error(`LNURL params request failed: ${inv_res.err}`)
  }
  if (inv_res.data.status === 'ERROR') {
    throw new Error(`LNURL params request failed: ${inv_res.data.reason}`)
  }
  const { pr } = parse_schema (inv_res.data, schema.lnurl_invoice)
  return pr
}
