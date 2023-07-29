export async function get_rate(amount : number) {
  const res = await fetch('https://cex.io/api/last_price/BTC/USD')
  if (!res.ok) {
    const { status, statusText } = res
    throw new Error(`${status}${statusText}`)
  }
  // Unpack the latest price from the payload
  let { lprice } = await res.json()
  // Convert the price into a number.
  const price = Number(lprice)
  // Get the ratio of Bitcoin relative to the price (of 1 BTC).
  const ratio = amount / price
  // Return the ratio converted into satoshis.
  return Math.ceil(ratio * 100_000_000)
}

get_rate(1).then(e => console.log(e))
