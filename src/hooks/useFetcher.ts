import useSWR from 'swr'

export interface FetcherAPI<T> {
  data    : T
  error   : string
  loading : boolean
}

const INIT_DATA = {}

async function fetcher <T>(
  input : RequestInfo | URL,
  init ?: RequestInit | undefined
) : Promise<T> {
  const res  = await fetch(input, init)
  const data = await res.json()
  return data as T
}

export function useFetcher <T> (
  endpoint : string,
  host     : string = '.'
) : FetcherAPI<T> {
  const { data, error, isLoading } = useSWR<T>(
    `${host}${endpoint}`,
    fetcher,
    { refreshInterval: 1000 * 5 }
  )

  return {
    error   : error?.message,
    loading : isLoading,
    data    : { ...INIT_DATA, ...data } as T
  }
}
