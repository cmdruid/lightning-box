async function get_payreq () {
  const res1 = await fetch('http://localhost:3000/api/invoice/create')

  if (res1.ok) {
    const { minSendable } = await res1.json()
    console.log('amount:', minSendable)
    const res2 = await fetch('http://localhost:3000/api/invoice/create?amount=' + minSendable)
    if (res2.ok) {
      const data = await res2.json()
      console.log('data:', data)
    } else {
      console.log('res2 error:', res2.status, res2.statusText)
    }
  } else {
    console.log('res1 error:', res1.status, res1.statusText)
  }
}

get_payreq()
