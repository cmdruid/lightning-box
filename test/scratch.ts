const API_HOST = 'http://localhost:3000'

const endpoint = `${API_HOST}/api/box`

const req = {
  method  : 'POST',
  headers : {
    'content-type': 'application/json',
    'token' : 'TjY9XC9BVShZPF1SMkBPaWF3QTMsPTZ2QD5DOUxrVWc='
  },
  body : JSON.stringify({ box_state: 'init' , box_bal: 100 })
}

async function test () {
  try {

    const res = await fetch(endpoint, req)

    if (!res.ok) {
      const { status, statusText } = res
      throw `fail: ${status} ${statusText}`
    }

    const json = await res.json()
    
    console.log('ok', json)
  } catch (err) {
    console.log(err)
  }
}

test()
