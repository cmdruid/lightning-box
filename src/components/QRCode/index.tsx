import { ReactElement, useEffect, useState } from 'react'

import qrcode       from 'qrcode'
import Image        from 'next/image'
import useClipboard from '@/hooks/useClipboard'

import styles from './styles.module.css'

interface Props {
  data     : string,
  loading ?: boolean,
}

export default function QRCode({ data, loading } : Props) : ReactElement {
  const [ qrData, setQrData ]   = useState<string>()
  const [ isCopied, setCopied ] = useClipboard(data)

  useEffect(() => {
    if (data) {
      (async function() { 
        const qrdata = await qrcode.toDataURL(data)
        setQrData(qrdata)
        console.log('qrcode:', data)
      })()
    }
  }, [ data ])

  const cls = [ styles.qrcode ]

  if (loading) cls.push(styles.loading)

  return (
    <>
      { qrData !== undefined && 
        <div className = { cls.join(' ') }>
          { loading && <div className={ styles.spinner }></div> }
          <Image
            className = { styles.image }
            style     = {{ borderRadius: '10px 10px 0 0' }}
            src       = { qrData }
            alt       = "QRCode"
            width     = { 300 }
            height    = { 300 }
          />
          <div className = { styles.controls }>
            <div
              className = { styles.button }
              onClick   = { () => setCopied() }
            >
              { isCopied ? "Copied to clipboard!" : "Copy LNURL to Clipboard" }
            </div>
          </div>
        </div>
      }
    </>
  )
}
