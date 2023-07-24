import { useEffect, useState } from 'react'

import { now } from '@/lib/utils'

export default function Timer (
  { timeout } : { timeout : number }
) {
  const [ timer, setTimer ] = useState(2 + (timeout) - now())

  useEffect(() => {
    if (timer <= 0) {
      window.location.reload()
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [ timer ])

  return (
   <div className="container">
      <div className="content">
        { timeout  && <p>Reservation expires in {timer} seconds. </p> }
      </div>
    </div>
  )
}
