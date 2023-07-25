import Loading  from '@/components/Loading'
import Login    from '@/components/Login'
import Timer    from '@/components/Timer'
import Register from '@/components/Register'
import Deposit  from '@/components/Deposit'
import Invoice  from '@/components/Invoice'

import { useSession } from '@/hooks/useSession'

export default function Home () {
  const { session } = useSession()
  const { status, deposit, invoice, timestamp } = session

  return (
    <>
      <div className="title">
        <h1>Lightning Box</h1>
        <p>Peer-to-peer personal drop-box on the ligthning network.</p>
      </div>
      <div className="main">
        { status === 'loading' && <Loading />  }
        { status !== 'loading' && session.is_auth &&
          <>
            <div className="authroized">
              {
                status  === 'invoice' && 
                invoice !== undefined && 
                <Invoice invoice={invoice} /> 
              }
              {
                status  === 'deposit' && 
                deposit !== undefined && 
                <Deposit deposit={deposit} /> 
              }
              { status === 'ready' && <Register /> }
              { <Timer stamp={timestamp} /> }
            </div>
          </>
        }
        {
          status === 'login' && 
          !session.is_auth   &&
          <Login />
        }
      </div>
    </>
  )
}
