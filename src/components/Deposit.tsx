import { useFetcher } from '@/hooks/useFetcher'
import { useToast }   from '@/hooks/useToast'

interface DepositData {
  address   : string
  box_state : string
  box_amt   : number
}

export default function Deposit () {
  const { data, error, loading } = useFetcher<DepositData>('/api/deposit/status')
  const [ Toast, set_toast ] = useToast()

  async function confirm () {
    const res  = await fetch(`./api/deposit/confirm`)
    const data = await res.json()
    if (!res.ok) {
      set_toast(`${data.error}`)
    } else {
      console.log('data:', data)
      window.location.reload()
    }
  }

  async function cancel () {
    const res  = await fetch(`./api/deposit/cancel`)
    const data = await res.json()
    if (!res.ok) {
      set_toast(`${data.error}`)
    } else {
      console.log('data:', data)
      window.location.reload()
    }
  }

  return (
    <div className="container">
      <div className="content">
        { loading && <p>Loading...</p> }
        { error && <pre>Error: {error}</pre>}
        { !loading && !error && 
          <>
            <p>Deposit funds using the bill counter, then long-press the green button on the box to confirm:</p>
            <button onClick={confirm}>Confirm</button>
            <button onClick={cancel}>Cancel</button>
            <div className="status">
              <p>Current Amount:</p>
              <pre>{data.box_amt} CUCKBUCKS</pre>
              <p>Deposit Details:</p>
              <pre>{JSON.stringify({
                address   : data.address,
                box_state : data.box_state
              }, null, 2)}</pre>
            </div>
          </>
        }
      </div>
    </div>
  )
}
