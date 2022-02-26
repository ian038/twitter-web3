import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../utils/hexStyles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
