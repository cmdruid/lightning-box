type BoxState = 'init' | 'door' | 'deposit' | 'locked'

export interface BoxSession {
  addr_set  : boolean
  bal_ok    : boolean
  inv_paid  : boolean
  box_bal   : number   | null
  box_state : BoxState | null
}

declare module 'iron-session' {
  interface IronSessionData extends BoxSession {}
}
