import { ClientSession } from '@/hooks/useSession'

export type BoxState    = 'await_addr' | 'await_door' | 'depositing' | 'locked'
export type StoreStatus = 'init' | 'ready' | 'reserved' | 'locked' | 'received' | 'paid'

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

export interface WithdrawData {
  charge_id   : string
  payment_id ?: string
}

export interface SessionData {
  box        ?: BoxData
  deposit    ?: DepositData
  withdraw   ?: WithdrawData
  status     ?: string
  expires_at ?: number
  updated_at  : number
}

export interface StoreData extends StoreSchema {
  status : StoreStatus
}

export interface StoreSchema {
  box         : BoxData      | null
  deposit     : DepositData  | null
  withdraw    : WithdrawData | null
  deposit_id  : string       | null
  withdraw_id : string       | null
  session_id  : string       | null
  timestamp   : number
}
