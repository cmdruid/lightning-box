const ec = new TextEncoder()
const dc = new TextDecoder()

const crypto = globalThis.crypto

export const now = () => Math.floor(Date.now() / 1000)

export function sleep(ms : number = 500) {
  return new Promise(res => setTimeout(res, ms))
}

export function normalizeParams (
  params : Record<string, string | string[] | undefined>
) : Record<string, string | undefined> {
  const p : Record<string, string | undefined> = {}
  for (let [ k, v ] of Object.entries(params)) {
    if (Array.isArray(v)) v = v.pop()
    p[k] = v
  }
  return p 
}
