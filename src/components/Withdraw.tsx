import { Buff } from '@cmdcode/buff-utils'
import QRCode   from '@/components/QRCode'
import { BoxData } from '@/schema'
import { get_rate } from '@/lib/oracle'
import { useEffect, useState } from 'react'

export default function Withdraw ({ box } : { box ?: BoxData | null }) {
  const [ sats, set_sats ] = useState<number>()
  const endpoint = window.location.origin + '/api/invoice/create'
  const lnurl    = Buff.str(endpoint).toBech32('lnurl').toUpperCase()
  
  useEffect(() => {
    if (box !== null && box !== undefined) {
      void (async () => {
        if (box.amount !== null) {
          const res = await get_rate(box.amount)
          if (typeof res === 'number') {
            set_sats(res)
          }
        }
      })()
    }
  }, [ box ])

  return (
   <div className="container">
      { box !== null && box !== undefined &&
        <div className="status" style={{ textAlign : 'center' }}>
          <p>Current Box Amount:</p>
          <pre>{sats} sats // {box.amount} USD</pre>
        </div>
      }
      <div className="content">
        <p>Pay the lightning invoice below in order to unlock the box.</p>
        <QRCode data={lnurl} />
        <br />
        <i>Invoice will include a 100 sat + 2% escrow fee.</i>
      </div>
    </div>
  )
}
