import { useState } from 'react'

export default function Form (
  { addr } : { addr ?: string }
) {
  const [ address, setAddress ] = useState(addr)

  async function reserve () {
    const res  = await fetch(`./api/reserve/update?address=${address}`)
    const json = await res.json()
    console.log('reserve res:', json)
  }

  return (
    <div className="container">
      <div className="content">
        <p>Enter the lightning address to use for payment:</p>
        <div className="form">
          <input
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="yourname@lightning.address"
          ></input>
          <button onClick={reserve}>Update Address</button>
        </div>
      </div>
    </div>
  )
}
