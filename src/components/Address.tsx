import { useState } from 'react'

export default function Form () {
  const [ address, setAddress ] = useState('')

  async function reserve () {
    const res  = await fetch(`./api/reserve/update?address=${address}`)
    const json = await res.json()
    console.log('reserve res:', json)
  }

  return (
    <div className="container">
      <div className="content">
        <p>Enter your lightning address to start:</p>
        <div className="form">
          <input
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="yourname@lightning.address"
          ></input>
          <button onClick={reserve}>Reserve Box</button>
        </div>
      </div>
    </div>
  )
}
