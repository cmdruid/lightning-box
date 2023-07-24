import { useEffect, useState } from 'react'

import { SessionData, StoreData } from '@/schema'

import Loading     from '@/components/Loading'
import Invoice     from '@/components/Invoice'
import Receipt     from '@/components/Receipt'
import Register    from '@/components/Register'
import Reservation from '@/components/Reservation'

const REFRESH_TIMER = 1000 * 10

export default function Home () {
  const [ session, setSession ] = useState<SessionData>()

  const status = get_status(session)

  const { state, invoice, receipt } = session ?? {}


  async function get_session() {
    const res  = await fetch('./api/session')
    const json = await res.json()
    console.log('session:', json)
    setSession(json)
  }

  useEffect(() => {
    if (session === undefined) get_session()
    const interval = setInterval(() => get_session(), REFRESH_TIMER)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="title">
        <h1>Lightning Box</h1>
        <p>Peer-to-peer personal drop-box on the ligthning network.</p>
      </div>
      <div className="main">
        { status === 'loading'  && <Loading />  }
        { status === 'ready'    && <Register /> }
        { status === 'reserved' && <Reservation data={state as StoreData} /> }
        { status === 'invoice'  && <Invoice data={invoice}   /> }
        { status === 'receipt'  && <Receipt data={receipt}   /> }
      </div>
    </>
  )
}

function get_status (session ?: SessionData) : string {
  if (session === undefined) {
    return 'loading'
  }

  const { state, invoice, receipt } = session

  if (state === undefined) {
    return 'ready'
  } else {

    if (
      invoice !== undefined &&
      receipt === undefined
    ) {
      return 'invoice'
    }

    if (receipt !== undefined) {
      return 'receipt'
    }

    return 'reserved'
  }
}
