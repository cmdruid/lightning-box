export default function Confirm (
  { amount } : { amount : number }
) {
  async function confirm () {
    const res  = await fetch('./api/charge/create')
    const json = await res.json()
    console.log('confirm res:', json)
  }

  return (
   <div className="container">
      <div className="content">
        <p>Current balance: {amount}</p>
        <button 
          onClick={() => confirm()}
        >
          Create Invoice
        </button>
      </div>
    </div>
  )
}
