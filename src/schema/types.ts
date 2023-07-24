export type BoxState    = 'await_addr' | 'await_door' | 'depositing' | 'locked'
export type StoreStatus = 'ready' | 'reserved' | 'invoice' | 'paid'

declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
}

export interface BoxData {
  amount : number | null
  code   : string | null
  state  : BoxState
}

export interface SessionData {
  id       : string
  state   ?: StoreData
  invoice ?: string
  receipt ?: string
}

export interface StoreData {
  box_data   : BoxData | null
  invoice    : string  | null
  receipt    : string  | null
  recipient  : string  | null
  receipt_id : string  | null
  reserve_id : string  | null
  status     : StoreStatus
  timeout    : number  | null
  timestamp  : number
}
