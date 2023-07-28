const { VERCEL_URL, VERCEL_ENV } = process.env

const proto = (VERCEL_ENV === 'development') ? 'http' : 'https'

export const env = {
  HOSTNAME : `${proto}://${VERCEL_URL}`,
}
