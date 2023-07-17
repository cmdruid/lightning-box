export type Res<T = any> = PassResponse<T> | FailResponse

interface PassResponse<T> {
  ok   : true
  data : T
}

interface FailResponse {
  ok    : false
  data ?: any
  err   : string
}

export async function fetcher<T> (
  input : RequestInfo | URL,
  init ?: RequestInit
) : Promise<Res<T>> {
  try {
    // Unpack response object.
    const res = await fetch(input, init)
    const { ok, status, statusText } = res
    // If initial response fails:
    if (!ok) {
      // Return the response status as error.
      const err = `[${status}]: ${statusText}`
      // Try to return a json payload.
      try {
        const data = await res.json()
        return { ok, data, err }
      } catch {
        return { ok, err }
      }
    }
    // Unpack the json response.
    const { data, err } = await res.json()
    // If an err object is present:
    if (err !== undefined) {
      // Return the err as response.
      return { ok: false, data, err }
    }
    // Return the data as generic type.
    return { ok, data: data as T }
  } catch (err) {
    // Capture the exception message.
    const { message } = err as Error
    // Log the full error to console.
    console.log(err)
    // Return the error message as response.
    return { ok: false, err: `[000]: ${message}` }
  }
}
