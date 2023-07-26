async function box_post (data : any) {
  const LOCKBOX_KEY = 'TjY9XC9BVShZPF1SMkBPaWF3QTMsPTZ2QD5DOUxrVWc='
  const API_HOST    = 'http://localhost:3000' // 'https://lightning-box-cmdruid.vercel.app'
  const endpoint    = `${API_HOST}/api/box`

  if (LOCKBOX_KEY === undefined) {
    throw new Error('Box key undefined!')
  }

  const req = {
    method  : 'POST',
    headers : { token : LOCKBOX_KEY },
    body    : JSON.stringify(data)
  }

  const res = await fetch(endpoint, req)

  if (!res.ok) {
    const { status, statusText } = res
    throw new Error(`${status}: ${statusText}`)
  }

  return res.json()
}

box_post({
  amount : 5,
  code   : '12345',
  state  : 'locked'
})
