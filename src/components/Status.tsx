import { BoxData } from '@/schema'

export default function Status (
  { data } : { data : BoxData }
) {
  return (
   <div className="container">
      <div className="status">
        <p>Box Status:</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}
