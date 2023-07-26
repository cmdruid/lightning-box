import { InvoiceData } from '@/schema'

export default function Invoice (
  { invoice } : { invoice ?: InvoiceData }
) {
  async function get_invoice () {
    const res  = await fetch('./api/charge/create')
    const json = await res.json()
    console.log('confirm res:', json)
  }

  async function get_status () {
    
  }

  return (
   <div className="container">
      <div className="content">
        <p>Invoice:</p>

        <p>Status:</p>
      </div>
    </div>
  )
}
