import { useEffect, useState } from 'react'

export default function Register () {
  const [ code, setCode ]   = useState('')
  const [ toast, setToast ] = useState<string>()

  async function register () {
    const res  = await fetch(`./api/reserve/register?code=${code}`)
    if (!res.ok) {
      const { status, statusText } = res
      setToast(`${status}: ${statusText}`)
    } else {
      const json = await res.json()
      console.log('registration:', json)
      window.location.reload()
    }
  }

  useEffect(() => {
    if (typeof toast === 'string') {
      setTimeout(() => setToast(undefined), 5000)
    }
  })

  return (
    <div className="container">
      <div className="content">
        <p>Enter the 6 digit code on the box to start:</p>
        <div className="form">
          { typeof toast === 'string' && <div className="toast">{toast}</div> }
          <input
            name="code"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="123456 ..."
          ></input>
          <button onClick={register}>Login</button>
        </div>
      </div>
    </div>
  )
}
