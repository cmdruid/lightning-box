// import type { NextApiRequest, NextApiResponse } from 'next'

// import { withSessionRoute } from '@/lib/sessions'

// const MIN_AMT    = 1000
// const MAX_AMT    = 1000
// const MOCK_LNURL = ''
// const ROUTE_KEY  = ''
// const ROUTE_URL  = ''

// export default withSessionRoute(handler)

// async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { method, query, url } = req

//   if (method !== 'GET') {
//     return res.status(400).end()
//   }
  
//   console.log('url:', url)

//   if (typeof query.amount !== 'string') {
//     const int_res = await fetch(MOCK_LNURL)
//     if (!int_res.ok) {
//       const err = `${int_res.status, int_res.statusText}`
//       console.log('err:', err)
//       return res.status(200).json({
//         status: 'ERROR',
//         reason: err
//       })
//     }
//     const json = await int_res.json()
//     req.session.payreq = json
//     await req.session.save()
//     json.callback = `${ROUTE_URL}/api/lnurl/payRequest` 
//     console.log('sending payreq:', json)
//     return res.status(200).json(await int_res.json())
//   }

//   try {
//     const { payreq } = req.session

//     if (payreq === undefined) {
//       console.log('payreq not defined!')
//       return res.status(200).json({
//         status: 'ERROR',
//         reason: 'payreq not set!'
//       })
//     }

//     const { callback } = payreq

//     const int_url = `${callback}?amount=${query.amount}`
//     const int_res = await fetch(int_url)

//     if (!int_res.ok) {
//       const err = `${int_res.status, int_res.statusText}`
//       console.log('err:', err)
//       return res.status(200).json({
//         status: 'ERROR',
//         reason: err
//       })
//     }

//     const json = await int_res.json()
//     req.session.payinv = json
//     await req.session.save()
//     json.routes = [ ROUTE_KEY ]
//     console.log('sending payinv:', json)
//     return res.status(200).json(json)
//   } catch (err) {
//     const { message } = err as Error
//     return res.status(200).json({
//       status : 'ERROR',
//       reason : message
//     })
//   }
// }
