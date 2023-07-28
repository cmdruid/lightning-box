import { useEffect, useState } from 'react'

import { useToast }     from '@/hooks/useToast'
import { PaymentData }  from '@/lib/zbd'
import { BoxData }      from '@/schema'
import { WithdrawData } from '@/schema'

interface Props {
  box      ?: BoxData
  withdraw ?: WithdrawData
}

export default function Success (
  { box, withdraw } : Props
) {
  const [ payment, setPayment ] = useState<PaymentData>()

  async function get_payment () {
    const res  = await fetch('./api/pay/status')
    if (res.ok) {
      const data = await res.json()
      setPayment(data)
    }
  }

  useEffect(() => {
    if (withdraw !== undefined) {
      if (payment === undefined) get_payment()
    }
  }, [ payment, withdraw ])

  return (
   <div className="container">
      <div className="content">
          { withdraw === undefined && payment === undefined &&
            <>
              <p>Loading...</p>
            </>
          }
          { payment !== undefined &&
            <>
              <p>Success! The box should unlock at any moment.</p>
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
