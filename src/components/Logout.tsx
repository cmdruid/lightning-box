import { useEffect, useState } from 'react'

import { now }         from '@/lib/utils'
import { SessionData } from '@/schema'

export default function Logout (
  { expires } : { expires : number }
) {
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
      <div className="timer">
        <p>Your login session will expire in {minutes} minutes and {seconds} seconds.</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
