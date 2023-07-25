import { useCallback, useEffect, useState } from 'react'

import { ClientSession } from '@/schema'

import { now } from '@/lib/utils'

const INIT_SESSION  = {
  is_auth   : false,
  status    : 'init',
  timestamp : now()
}

const REFRESH_TIMER = 1000 * 10

export function useSession (host : string = '.') {
  const [ session, setSession ] = useState<ClientSession>(INIT_SESSION)

  const get_session = useCallback(async () => {
    console.log('fetching session...')
    const res  = await fetch(`${host}/api/session`)
    const data = await res.json()
    console.log('current session:', data)
    setSession(data)
  }, [ host ])

  useEffect(() => {
    if (session.status === 'init') get_session()
    const interval = setInterval(() => get_session(), REFRESH_TIMER)
    return () => clearInterval(interval)
  }, [ get_session, session ])

  return { session, setSession }
}

// function get_session_status (session : ClientSession) : string {
//   const { deposit, invoice, is_auth, status } = session

//   if ()
//   if (!is_auth) return 'login'
//   if (invoice !== undefined) return 'invoice'
//   if (deposit !== undefined) return 'deposit'

//   return 'ready'
// }
