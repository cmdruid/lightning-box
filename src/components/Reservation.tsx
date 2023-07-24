import { StoreData } from '@/schema'

import Address from '@/components/Address'
import Status  from '@/components/Status'
import Timer   from '@/components/Timer'

export default function Reservation (
  { data } : { data ?: StoreData }) {
  const { box_data, recipient, timeout } = data ?? {}

  return (
    <div className="container">
      { typeof recipient !== 'string' && <Address /> }
      { box_data !== null && box_data !== undefined && <Status data={box_data}  /> }
      { typeof timeout === 'number'   && <Timer timeout={timeout} /> }
    </div>
  )
}
