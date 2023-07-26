import { useToast }    from '@/hooks/useToast'
import { BoxData, DepositData } from '@/schema'

interface Props {
  box     ?: BoxData
  deposit ?: DepositData
}

export default function Deposit (
  { box, deposit } : Props
) {
  const [ Toast, setToast ] = useToast()

  async function confirm () {
    const req = {
      method  : 'POST',
      body    : JSON.stringify({
        address : deposit?.address,
        amount  : box?.amount, 
      })
    }
    const res = await fetch(`./api/deposit/confirm`, req)
    if (!res.ok) {
      setToast(`${res.status}: ${res.statusText}`)
    } else {
      console.log('confirmed:', await res.json())
      window.location.reload()
    }
  }

  return (
    <div className="container">
      <div className="content">
        <p>Deposit funds into the box, then click the button to confirm:</p>
        <Toast />
        <div className="form">
          <button onClick={confirm}>Confirm Amount</button>
        </div>
        <div className="status">
          { deposit !== undefined &&
            <>
              <p>Deposit Address:</p>
              <pre>{deposit.address}</pre>
            </>
          }
          { box !== undefined &&
            <>
              <p>Current Balance:</p>
              <pre>{box.amount} CUCKBUCKS</pre>
              <p>Box Status:</p>
              <pre>{JSON.stringify(box, null, 2)}</pre>
            </>
          }
        </div>
      </div>
    </div>
  )
}
