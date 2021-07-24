import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from '../context/index'
import Navbar from '../component/Navbar/Navbar'
import { AnimateSharedLayout } from 'framer-motion'

function MyApp({ Component, pageProps }) {
  return (
    <AnimateSharedLayout>
      <Provider>
        <Navbar />
        <ToastContainer position='top-center' />
        <Component {...pageProps} />
      </Provider>
    </AnimateSharedLayout>
  )
}

export default MyApp
