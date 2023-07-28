import { useEffect, useState } from 'react'

import { useToast }     from '@/hooks/useToast'
import { ChargeData }   from '@/lib/zbd'
import { BoxData }      from '@/schema'
import { WithdrawData } from '@/schema'

import QRCode from '@/components/QRCode'

interface Props {
  box      ?: BoxData
  withdraw ?: WithdrawData
}

export default function Withdraw (
  { box, withdraw } : Props
) {
  const [ charge, setCharge ] = useState<ChargeData>()

  async function create_charge () {
    const res  = await fetch('./api/charge/create')
    if (res.ok) {
      const data = await res.json()
      setCharge(data)
    }
  }

  async function get_charge () {
    const res  = await fetch('./api/charge/status')
    if (res.ok) {
      const data = await res.json()
      setCharge(data)
    }
  }

  useEffect(() => {
    let interval : NodeJS.Timer
    if (withdraw !== undefined) {
      if (charge === undefined) get_charge()
      interval = setInterval(() => get_charge(), 2000)
    }
    return () => clearInterval(interval)
  }, [ charge, withdraw ])

  return (
   <div className="container">
      <div className="content">
          { withdraw === undefined && charge === undefined &&
            <>
              <p>Click the button below to create a lightning invoice.</p>
              <div className="form">
                <button onClick={create_charge}>Create Invoice</button>
              </div>
            </>
          }
          { charge !== undefined &&
            <>
              <p>Pay the lightning invoice below in order to unlock the box.</p>
              <QRCode data={charge.invoice.uri} />
            </>  
          }
          <div className="status">
          { charge !== undefined &&
            <div className="status">
              <p>Charge Details:</p>
              <pre>{JSON.stringify(charge, null, 2)}</pre>
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
