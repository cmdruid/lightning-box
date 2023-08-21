import { Buff } from '@cmdcode/buff-utils'
import QRCode   from '@/components/QRCode'

export default function Withdraw () {
  const endpoint = window.location.origin + '/api/invoice/create'
  const lnurl    = Buff.str(endpoint).toBech32('lnurl').toUpperCase()

  return (
   <div className="container">
      <div className="content">
        <p>Pay the lightning invoice below in order to unlock the box.</p>
        <QRCode data={lnurl} />
        <br />
        <i>Invoice includes 2000 sat + 2% escrow fee.</i>
      </div>
    </div>
  )
}
