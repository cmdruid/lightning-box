const { LOCKBOX_KEY } = process.env

const API_HOST = 'https://lightning-box-cmdruid.vercel.app'
const endpoint = `${API_HOST}/api/reset`

export async function box_post (data : any) {

  if (LOCKBOX_KEY === undefined) {
    throw new Error('Box key undefined!')
  }

  const req = {
    method  : 'POST',
    headers : { token : LOCKBOX_KEY },
    body    : JSON.stringify(data)
  }

  const res = await fetch('./api/reset', req)

  if (!res.ok) {
    const { status, statusText } = res
    throw new Error(`${status}: ${statusText}`)
  }

  return res.json()
}
