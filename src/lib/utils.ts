import { ZodSchema } from 'zod'

export const now = () => Math.floor(Date.now() / 1000)

export function sleep (ms : number = 500) {
  return new Promise(res => setTimeout(res, ms))
}

export function is_diff <A, B> (a : A, b : B) : boolean {
  return JSON.stringify(a) !== JSON.stringify(b)
}

export function validate_schema <T> (
  input  : T, 
  schema : ZodSchema,
  throws : boolean = false
) : boolean {
  if (throws) {
    schema.parse(input)
    return true
  }
  return schema.safeParse(input).success
}

export function parse_schema <T> (
  input  : T, 
  schema : ZodSchema,
) : T {
  try {
    return schema.parse(input)
  } catch (err) {
    console.log('schema err:', err)
    const err_data = JSON.stringify(input, null, 2)
    throw new Error(`Schema parsing failed for: \n${err_data}`)
  }
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
