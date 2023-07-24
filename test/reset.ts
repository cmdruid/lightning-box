const LOCKBOX_KEY = 'TjY9XC9BVShZPF1SMkBPaWF3QTMsPTZ2QD5DOUxrVWc='
const API_HOST    = 'http://localhost:3000' // 'https://lightning-box-cmdruid.vercel.app'
const endpoint    = `${API_HOST}/api/reset`

export async function reset_store () {

  if (LOCKBOX_KEY === undefined) {
    throw new Error('Box key undefined!')
  }

  const req = {
    method  : 'GET',
    headers : { token : LOCKBOX_KEY }
  }

  const res = await fetch(endpoint, req)

  if (!res.ok) {
    const { status, statusText } = res
    throw new Error(`${status}: ${statusText}`)
  }

  return res.json()
}
