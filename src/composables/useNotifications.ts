import { useCallback, useState } from 'react'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface Notification {
  message: string
  type: NotificationType
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const add = useCallback((message: string, type: NotificationType) => {
    setNotifications((notifications) => [...notifications, { message: message, type: type }])
  }, [])

  const error = useCallback((error: Error) => {
    setNotifications((notifications) => [...notifications, { message: error.message, type: 'error' }])
  }, [])

  const remove = useCallback((notification: Notification) => {
    setNotifications((notifications) => notifications.filter((n) => n !== notification))
  }, [])

  return { notifications, add, error, remove }
}
