import { ClientSession } from '@/hooks/useSession'

export type BoxState    = 'await_addr' | 'await_door' | 'depositing' | 'locked'
export type StoreStatus = 'init' | 'login' | 'ready' | 'reserved' | 'locked' | 'paid'

declare module 'iron-session' {
  interface IronSessionData extends ClientSession<SessionData> {}
}

export interface BoxSession extends BoxData {
  code : string
}

export interface BoxData {
  amount : number | null
  code   : string
  state  : BoxState
}

export interface DepositData {
  address : string
  amount  : number
}

export interface InvoiceData {
  charge_id   : string
  payment_id ?: string
}

export interface SessionData {
  box        ?: BoxData
  deposit    ?: DepositData
  invoice    ?: InvoiceData
  status     ?: string
  expires_at ?: number
  updated_at  : number
}

export interface StoreData extends StoreSchema {
  status : StoreStatus
}

export interface StoreSchema {
  box          : BoxData     | null
  deposit      : DepositData | null
  invoice      : InvoiceData | null
  deposit_id   : string      | null
  invoice_id   : string      | null
  session_id   : string      | null
  timestamp    : number
}
