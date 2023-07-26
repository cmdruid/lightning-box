import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

export default function Register () {
  const [ Toast, setToast ]     = useToast()
  const [ address, setAddress ] = useState('')

  async function register () {
    const res  = await fetch(`./api/deposit/register?address=${address}`)
    if (!res.ok) {
      setToast(`${res.status}: ${res.statusText}`)
    } else {
      console.log('register:', await res.json())
      window.location.reload()
    }
  }

  return (
    <div className="container">
      <div className="content">
        <p>Register a lightning address or LNURL to use for payment:</p>
        <Toast />
        <div className="form">
          <input
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="name@lnaddress.com | LNURL..."
          ></input>
          <button onClick={register}>Register</button>
        </div>
      </div>
    </div>
  )
}
