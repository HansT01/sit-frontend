import { useSession } from '@/composables'
import { createContext } from 'react'

export const SessionContext = createContext<ReturnType<typeof useSession>>({} as ReturnType<typeof useSession>)
