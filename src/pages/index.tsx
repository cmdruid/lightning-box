import Loading  from '@/components/Loading'
import Error    from '@/components/Error'
import Activate from '@/components/Activate'
import Login    from '@/components/Login'
import Logout   from '@/components/Logout'
import Register from '@/components/Register'
import Deposit  from '@/components/Deposit'

import {
  ClientSession,
  useSession
} from '@/hooks/useSession'

import { SessionData } from '@/schema'
import Withdraw from '@/components/Withdraw'
import Success from '@/components/Success'

export default function Home () {
  const { session, error, loading }    = useSession<SessionData>()
  const { box, connected, expires_at } = session

  const route = get_route(session, loading, error)

  console.log('route:', route)

  if (error !== undefined) {
    console.error(error)
  }

  return (
    <>
      <div className="title">
        <h1>Lightning Box</h1>
        <p>Peer-to-peer drop box on the ligthning network.</p>
      </div>
      <div className="main">
        { route === 'success'  && <Success />  }
        { route === 'withdraw' && <Withdraw box={box}/> }
        { route === 'deposit'  && <Deposit  /> }
        { route === 'register' && <Register /> }
        { route === 'login'    && <Login    /> }
        { route === 'activate' && <Activate /> }
        { route === 'error'    && <Error message={error} /> }
        { route === 'loading'  && <Loading />  }
        { 
          connected &&
          expires_at !== undefined &&
          <Logout expires={expires_at}/>
        }
      </div>
    </>
  )
}

function get_route (
  session : ClientSession<SessionData>,
  loading : boolean,
  error  ?: string
) : string {
  const { connected, status } = session
  if (loading)               return 'loading'
  if (error !== undefined)   return 'error'
  if (status === 'init')     return 'activate'
  if (status === 'paid')     return 'success'
  if (status === 'received') return 'success'
  if (status === 'locked')   return 'withdraw'
  if (!connected)            return 'login'
  if (status === 'reserved') return 'deposit'
  if (status === 'deposit')  return 'deposit'
  if (status === 'ready')    return 'register'
  return 'error'
}
