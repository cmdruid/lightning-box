import useSWR from 'swr'
import { z }  from 'zod'

export type ClientSession<T> = Session & Partial<T>

interface Session {
  connected   : boolean
  id         ?: string
  updated_at ?: number
}

export interface SessionAPI <T> {
  session : ClientSession<T>
  error   : string
  loading : boolean
}

const INIT_SESSION = { connected : false }

async function fetcher <T> (
  input : RequestInfo | URL, 
  init ?: RequestInit | undefined
) : Promise<ClientSession<T>> {
  const res = await fetch(input, init)
  if (!res.ok) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }
  const json = await res.json()
  return schema.passthrough().parse(json) as ClientSession<T>
}

const schema = z.object({
  connected  : z.boolean(),
  id         : z.string().optional(),
  updated_at : z.number().optional()
})

export function useSession <T> (host : string = '.') : SessionAPI<T> {
  const { data, error, isLoading } = useSWR<ClientSession<T>>(
    `${host}/api/session/status`,
    fetcher,
    { refreshInterval: 1000 * 5 }
  )

  return {
    error   : error?.message,
    loading : isLoading,
    session : { ...INIT_SESSION, ...data } as ClientSession<T>
  }
}
