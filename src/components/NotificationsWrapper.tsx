import { NotificationType } from '@/composables'
import { NotificationsContext } from '@/contexts'
import { ReactNode, useContext } from 'react'

interface NotificationColors {
  borderColor: string
  backgroundColor: string
  textColor: string
  iconColor: string
  hoverColor: string
}

const colorsMap: Map<NotificationType, NotificationColors> = new Map()

colorsMap.set('error', {
  borderColor: 'border-red-500',
  backgroundColor: 'bg-white',
  textColor: 'text-red-800',
  iconColor: 'text-red-500',
  hoverColor: 'hover:bg-red-200',
})

interface NotificationsWrapperProps {
  children: ReactNode
}

export const NotificationsWrapper = ({ children }: NotificationsWrapperProps) => {
  const { notifications, remove } = useContext(NotificationsContext)

  return (
    <div className='h-full w-full'>
      <div className='fixed right-0 z-40 flex w-[500px] max-w-full flex-col gap-3 px-3 py-3'>
        {notifications.map((notification, i) => {
          const colors = colorsMap.get(notification.type)!
          return (
            <div
              key={i}
              className={`${colors.borderColor} ${colors.backgroundColor} ${colors.textColor} flex gap-3 rounded-lg border p-4 text-sm transition-all`}
              role='alert'
            >
              <svg
                aria-hidden='true'
                className='inline h-5 w-5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>Info</span>
              <div>{notification.message}</div>
              <button
                type='button'
                className={`-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 ${colors.iconColor} ${colors.hoverColor} focus:ring-2`}
                data-dismiss-target='#alert-1'
                aria-label='Close'
                onClick={() => remove(notification)}
              >
                <span className='sr-only'>Close</span>
                <svg
                  aria-hidden='true'
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
          )
        })}
      </div>
      {children}
    </div>
  )
}
