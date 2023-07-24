export type BoxStatus   = 'ready' | 'reserved' | 'deposit' | 'locked'
export type StoreStatus = 'ready' | 'reserved' | 'invoice' | 'paid'

declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
}

export interface BoxData {
  amount : number | null
  code   : number | null
  locked : boolean
  status : BoxStatus
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
