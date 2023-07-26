import Loading  from '@/components/Loading'
import Error    from '@/components/Error'
import Activate from '@/components/Activate'
import Login    from '@/components/Login'
import Logout   from '@/components/Logout'
import Register from '@/components/Register'
import Deposit  from '@/components/Deposit'
import Invoice  from '@/components/Invoice'

import {
  ClientSession,
  useSession
} from '@/hooks/useSession'

import { SessionData } from '@/schema'

export default function Home () {
  const { session, error, loading } = useSession<SessionData>()
  const { box, connected, deposit, expires_at, invoice } = session

  const route = get_route(session, loading, error)

  console.log('route:', route)

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
        { route === 'deposit'  && <Deposit box={box} deposit={deposit} /> }
        { route === 'invoice'  && <Invoice box={box} invoice={invoice} /> }
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
  const { connected, deposit, invoice, status } = session
  if (loading)               return 'loading'
  if (error !== undefined)   return 'error'
  if (status === 'init')     return 'activate'
  if (!connected)            return 'login'
  if (status === 'locked')   return 'invoice'
  if (deposit !== undefined) return 'deposit'
  if (status  === 'ready')   return 'register'
  return 'error'
}
