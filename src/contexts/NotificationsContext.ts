import { useNotifications } from '@/composables'
import { createContext } from 'react'

export const NotificationsContext = createContext<ReturnType<typeof useNotifications>>(
  {} as ReturnType<typeof useNotifications>
)
