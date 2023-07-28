import Loading  from '@/components/Loading'
import Error    from '@/components/Error'
import Activate from '@/components/Activate'
import Login    from '@/components/Login'
import Logout   from '@/components/Logout'
import Register from '@/components/Register'
import Deposit  from '@/components/Deposit'
import Withdraw from '@/components/Withdraw'
import Payment  from '@/components/Payment'
import Success  from '@/components/Success'

import {
  ClientSession,
  useSession
} from '@/hooks/useSession'

import { SessionData } from '@/schema'

export default function Home () {
  const { session, error, loading } = useSession<SessionData>()
  const { box, connected, deposit, expires_at, withdraw } = session

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
        { route === 'loading'  && <Loading />  }
        { route === 'error'    && <Error message={error} /> }
        { route === 'activate' && <Activate /> }
        { route === 'login'    && <Login />    }
        { route === 'register' && <Register /> }
        { route === 'deposit'  && <Deposit  box={box} deposit={deposit}   /> }
        { route === 'withdraw' && <Withdraw box={box} withdraw={withdraw} /> }
        { route === 'payment'  && <Payment  box={box} withdraw={withdraw} /> }
        { route === 'success'  && <Success  box={box} withdraw={withdraw} /> }
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
  const { connected, deposit, status } = session
  if (loading)               return 'loading'
  if (error !== undefined)   return 'error'
  if (status === 'init')     return 'activate'
  if (!connected)            return 'login'
  if (status === 'paid')     return 'payment'
  if (status === 'received') return 'payment'
  if (status === 'locked')   return 'withdraw'
  if (deposit !== undefined) return 'deposit'
  if (status  === 'ready')   return 'register'
  return 'error'
}
