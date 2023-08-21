import { useSession }  from '@/hooks/useSession'
import { SessionData } from '@/schema'
import { useRouter }   from 'next/router'
import Login           from '@/components/Login'
import { useFetcher } from '@/hooks/useFetcher'

export default function Pay () {
  const router = useRouter()
  const { invoice_id } = router.query

  const { data, error, loading } = useFetcher(`/api/invoice/status?id=${invoice_id}`)

  const { session } = useSession<SessionData>()

  return (
   <div className="container">
      <div className="content">
        { !session.connected && <Login /> }
        { session.connected &&
          <>
            { loading && <p>Loading ...</p> }
            { error && <pre>Error: {error}</pre> }
            { !loading &&
              <div className="status">
                <p>Invoice Details:</p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            }
          </>
        }
      </div>
    </div>
  )
}
