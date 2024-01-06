import { getToken, getUserInfo } from '@/services/api'
import { useEffect, useState } from 'react'

export const useSession = () => {
  const [firstName, setFirstName] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [isInstructor, setIsInstructor] = useState<boolean>(false)

  const login = async (username: string, password: string) => {
    const token = await getToken(username, password)
    const { firstName, lastName, userId, isInstructor } = await getUserInfo(token)
    setFirstName(firstName)
    setLastName(lastName)
    setToken(token)
    setUserId(userId)
    setIsInstructor(isInstructor)
  }

  const logout = () => {
    setFirstName(null)
    setLastName(null)
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  useEffect(() => {
    const storedToken =
      localStorage.getItem('token') || document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    if (storedToken) {
      getUserInfo(storedToken)
        .then(({ userId, firstName, lastName, isInstructor }) => {
          setFirstName(firstName)
          setLastName(lastName)
          setToken(storedToken)
          setUserId(userId)
          setIsInstructor(isInstructor)
        })
        .catch(console.error)
    }
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      document.cookie = `token=${token}`
    }
  }, [token])

  return { firstName, lastName, token, userId, isInstructor, login, logout }
}
