import { useEffect, useState } from 'react'

import { useToast }     from '@/hooks/useToast'
import { PaymentData }  from '@/lib/zbd'
import { BoxData }      from '@/schema'
import { WithdrawData } from '@/schema'

interface Props {
  box      ?: BoxData
  withdraw ?: WithdrawData
}

export default function Payment (
  { box, withdraw } : Props
) {
  const [ payment, setPayment ] = useState<PaymentData>()

  async function create_payment () {
    const res  = await fetch('./api/pay/create')
    if (res.ok) {
      const data = await res.json()
      setPayment(data)
    }
  }

  async function get_payment () {
    const res  = await fetch('./api/pay/status')
    if (res.ok) {
      const data = await res.json()
      setPayment(data)
    }
  }

  // useEffect(() => {
  //   let interval : NodeJS.Timer
  //   if (withdraw !== undefined) {
  //     const { payment_id } = withdraw
  //     if (payment_id === undefined) {
  //       create_payment()
  //     } else if (payment === undefined) {
  //       get_payment()
  //     } else {
  //       interval = setInterval(() => get_payment(), 2000)
  //     }
  //   }
  //   return () => clearInterval(interval)
  // }, [ payment, withdraw ])

  useEffect(() => {
    let interval : NodeJS.Timer
    if (withdraw !== undefined) {
      const { payment_id } = withdraw
      if (payment_id === undefined) {
        create_payment()
      } else if (payment === undefined) {
        get_payment()
      } else {
        interval = setInterval(() => get_payment(), 2000)
      }
    }
    return () => clearInterval(interval)
  }, [ payment, withdraw ])

  return (
   <div className="container">
      <div className="content">
          { withdraw === undefined && payment === undefined &&
            <>
              <p>Please wait while we complete your payment.</p>
            </>
          }
          { payment !== undefined &&
            <>
              <p>Payment received! Please wait for the box to unlock.</p>
            </>
          }
          <div className="status">
          { payment !== undefined &&
            <div className="status">
              <p>Payment Details:</p>
              <pre>{JSON.stringify(payment, null, 2)}</pre>
            </div>
          }
          { box !== undefined &&
            <>
              <p>Box Status:</p>
              <pre>{JSON.stringify(box, null, 2)}</pre>
            </>
          }
        </div>
      </div>
    </div>
  )
}
