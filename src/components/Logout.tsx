import { useEffect, useState } from 'react'

import { now }    from '@/lib/utils'
import { config } from '@/schema'

const { SESSION_TIMEOUT } = config

export default function Timer (
  { stamp } : { stamp : number }
) {
  const expires = stamp + SESSION_TIMEOUT

  const [ timer, setTimer ] = useState(expires - now())

  async function logout () {
    await fetch(`./api/session/logout`)
    window.location.reload()
  }

  useEffect(() => {
    // if (timer <= 0) logout()
    const interval = setInterval(() => {
      return setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [ timer ])

  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60

  return (
   <div className="container">
      { stamp && (
        <div className="timer">
          <p>Your login session expires in {minutes} minutes and {seconds} seconds.</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  )
}
