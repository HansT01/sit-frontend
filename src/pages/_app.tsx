import { Login, Navigation, NotificationsWrapper } from '@/components'
import { useNotifications } from '@/composables'
import { useSession } from '@/composables/useSession'
import { NotificationsContext, SessionContext } from '@/contexts'
import '@/styles/globals.css'
import '@fontsource/lato'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  const session = useSession()
  const notifications = useNotifications()

  if (!session.token) {
    return (
      <NotificationsContext.Provider value={notifications}>
        <NotificationsWrapper>
          <Login handleLogin={session.login} />
        </NotificationsWrapper>
      </NotificationsContext.Provider>
    )
  }

  return (
    <SessionContext.Provider value={session}>
      <NotificationsContext.Provider value={notifications}>
        <div className='flex grow flex-col'>
          <Navigation handleLogout={session.logout} />
          <div className='grow'>
            <NotificationsWrapper>
              <Component {...pageProps} />
            </NotificationsWrapper>
          </div>
        </div>
      </NotificationsContext.Provider>
    </SessionContext.Provider>
  )
}

export default App
