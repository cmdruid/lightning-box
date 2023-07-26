import { useToast } from '@/hooks/useToast'
import { ChargeData } from '@/lib/zbd'
import { BoxData }  from '@/schema'

import { InvoiceData } from '@/schema'
import { useEffect, useState }    from 'react'

interface Props {
  box     ?: BoxData
  invoice ?: InvoiceData
}

export default function Invoice (
  { box, invoice } : Props
) {
  const [ charge, setCharge ] = useState<ChargeData>()

  async function create_invoice () {
    const res  = await fetch('./api/charge/create')
    const json = await res.json()
    console.log('confirm res:', json)
  }

  async function get_invoice () {
    const res  = await fetch('./api/charge/status')
    const json = await res.json()
    console.log('confirm res:', json)
    setCharge(json)
  }

  // useEffect(() => {
  //   if (
  //     invoice !== undefined &&
  //     charge  === undefined
  //   ) {
  //     get_invoice()
  //   }
  // }, [ charge, invoice ])

  return (
   <div className="container">
      <div className="content">
          { invoice === undefined &&
            <>
              <p>Click the button below to create a lightning invoice.</p>
              <div className="form">
                <button onClick={create_invoice}>Create Invoice</button>
              </div>
            </>
          }
          { charge !== undefined &&
            <div className="form">
              <p>{charge.invoice.request}</p>
            </div>
          }
          <div className="status">
            { box !== undefined &&
              <>
                <p>Box Status:</p>
                <pre>{JSON.stringify(box, null, 2)}</pre>
              </>
            }
            { charge !== undefined &&
            <>
              <p>Invoice Status:</p>
              <pre>{JSON.stringify(charge, null, 2)}</pre>
            </>
          }
        </div>
      </div>
    </div>
  )
}
