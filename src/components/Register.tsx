import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

export default function Register (
  { address } : { address ?: string }
) {
  const [ Toast, setToast ] = useToast()
  const [ addr, setAddr ]   = useState(address)

  async function register () {
    const res  = await fetch(`./api/deposit/register?address=${addr}`)
    if (!res.ok) {
      setToast(`${res.status}: ${res.statusText}`)
    } else {
      const json = await res.json()
      console.log('register:', json)
    }
  }

  return (
    <div className="container">
      <div className="content">
        <p>Register a lightning address to use for payment:</p>
        <Toast />
        <div className="form">
          <input
            name="address"
            value={addr}
            onChange={e => setAddr(e.target.value)}
            placeholder="your_name@lightning.address"
          ></input>
          <button onClick={register}>Register</button>
        </div>
      </div>
    </div>
  )
}
