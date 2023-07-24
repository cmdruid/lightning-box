import { useEffect, useState } from 'react'

import { now } from '@/lib/utils'

export default function Timer (
  { timeout } : { timeout : number }
) {
  const [ timer, setTimer ] = useState(timeout - now())

  useEffect(() => {
    const interval = setInterval(() => { setTimer(timer - 1)}, 1000)
    return clearInterval(interval)
  }, [])

  return (
   <div className="container">
      <div className="content">
        <p>Reservation expires in: {timer - now() }</p>
      </div>
    </div>
  )
}
