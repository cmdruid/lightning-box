export type BoxState    = 'await_addr' | 'await_door' | 'depositing' | 'locked'
export type StoreStatus = 'loading' | 'login' | 'ready' | 'reserved' | 'deposit' | 'invoice'

declare module 'iron-session' {
  interface IronSessionData extends ClientSession {}
}

export interface BoxSession extends BoxData {
  code : string
}

export interface BoxData {
  amount : number | null
  state  : BoxState
}

export interface DepositData extends Partial<BoxData> {
  address ?: string
}

export interface InvoiceData {
  invoice_id : string
  receipt_id : string
}

export interface ClientSession extends SessionData {
  id        ?: string
  is_auth    : boolean
  status     : string
  timestamp  : number
}

export interface SessionData {
  deposit ?: DepositData
  invoice ?: InvoiceData
}

export interface StoreData extends StoreSchema {
  status : StoreStatus
}

export interface StoreSchema {
  deposit      ?: DepositData
  invoice      ?: InvoiceData
  deposit_id   ?: string
  invoice_id   ?: string
  session_id   ?: string | null
  session_code ?: string
  timestamp     : number
}
