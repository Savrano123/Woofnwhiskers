import '../styles/globals.css'
import { SettingsProvider } from '../context/SettingsContext'

function MyApp({ Component, pageProps }) {
  // Extract settings from pageProps if available
  const { settings, ...restPageProps } = pageProps;

  return (
    <SettingsProvider initialSettings={settings}>
      <Component {...restPageProps} />
    </SettingsProvider>
  )
}

export default MyApp
