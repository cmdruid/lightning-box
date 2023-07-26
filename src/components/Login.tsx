import { useToast } from '@/hooks/useToast'
import { useState } from 'react'

export default function Login () {
  const [ code, setCode   ] = useState('')
  const [ Toast, setToast ] = useToast()

  async function login () {
    const res = await fetch(`./api/session/login?code=${code}`)
    if (!res.ok) {
      setCode('')
      setToast(`${res.status}: ${res.statusText}`)
    } else {
      const json = await res.json()
      console.log('session:', json)
      window.location.reload()
    }
  }

  return (
    <div className="container">
      <div className="content">
        <p>Enter the 6 digit code on the box in order to start:</p>
        <Toast />
        <div className="form">
          <input
            name="code"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="123456 ..."
          ></input>
          <button onClick={login}>Login</button>
        </div>
      </div>
    </div>
  )
}
