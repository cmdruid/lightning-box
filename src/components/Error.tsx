export default function Error (
  { message } : { message : string }
) {
  return (
   <div className="container">
      <div className="content">
        <p>Error</p>
        <pre>{message}</pre>
      </div>
    </div>
  )
}
