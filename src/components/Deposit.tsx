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
    const res = await fetch(`./api/deposit/confirm`)
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
        <p>Deposit funds using the bill counter, then long-press the green button on the box to confirm:</p>
        <Toast />
        <div className="status">
          { box !== undefined &&
            <>
              <p>Current Balance:</p>
              <pre>{box.amount} CUCKBUCKS</pre>
              <p>Box Status:</p>
              <pre>{JSON.stringify(box, null, 2)}</pre>
            </>
          }
          { deposit !== undefined &&
            <>
              <p>Deposit Address:</p>
              <pre>{deposit.address}</pre>
            </>
          }
        </div>
      </div>
    </div>
  )
}
