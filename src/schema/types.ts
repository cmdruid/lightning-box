import { ClientSession } from '@/hooks/useSession'

export type BoxState  = 'await_addr' | 'await_door' | 'depositing' | 'locked'
export type StoreEnum = 'init' | 'ready' | 'reserved' | 'locked' | 'received' | 'paid'

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

export interface SessionData {
  status     ?: string
  expires_at ?: number
  updated_at  : number
  box         : BoxData | null
}

export interface StoreData {
  box          : BoxData | null
  deposit_addr : string  | null
  deposit_amt  : number  | null
  invoice_id   : string  | null
  payment_id   : string  | null
  session_id   : string  | null
  status       : StoreEnum
  timestamp    : number
}
