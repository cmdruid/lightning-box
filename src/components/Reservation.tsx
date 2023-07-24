import { BoxData, StoreData } from '@/schema'

import Address from '@/components/Address'
import Confirm from '@/components/Confirm'
import Status  from '@/components/Status'
import Timer   from '@/components/Timer'

export default function Reservation (
  { data } : { data : StoreData }) {
  const { box_data, recipient, timeout } = data ?? {}
  const { amount } = box_data ?? {}

  const has_data = box_data !== null && box_data !== undefined
  const has_time = timeout  !== null && timeout  !== undefined
  const has_amt  = has_data && amount !== null && amount !== undefined

  return (
    <div className="container">
      <Address addr={recipient ?? undefined} />
      { has_amt && <Confirm amount={amount as number  } /> }
      { has_time && <Timer timeout={timeout as number } /> }
      { has_data && <Status data={box_data as BoxData } /> }
    </div>
  )
}
