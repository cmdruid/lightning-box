import { useToast }    from '@/hooks/useToast'
import { DepositData } from '@/schema'

export default function Register (
  { deposit } : { deposit : DepositData }
) {
  const [ Toast, setToast ] = useToast()
  const { amount } = deposit

  async function confirm () {
    const res = await fetch(`./api/deposit/confirm`)
    if (!res.ok) {
      setToast(`${res.status}: ${res.statusText}`)
    } else {
      const json = await res.json()
      console.log('confirm:', json)
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
          <p>Current Balance:</p>
          <pre>{amount} CUCKBUCKS</pre>
          <p>Deposit Status:</p>
          <pre>{JSON.stringify(deposit, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
