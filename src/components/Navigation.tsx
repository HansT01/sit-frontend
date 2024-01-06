import { SessionContext } from '@/contexts'
import QPSlogo from '@/public/QPS_logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useState } from 'react'

interface NavigationProps {
  handleLogout: () => void
}

export const Navigation = ({ handleLogout }: NavigationProps) => {
  const { firstName, lastName } = useContext(SessionContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <div className='sticky top-0 z-50 flex h-14 w-full flex-row bg-nav px-6 align-middle text-white'>
      <div className='flex items-center gap-2'>
        <Image src={QPSlogo} alt='QPS logo' width='50px' height='50px' className='h-4 w-4 object-contain' />
        <button className='font-bold text-white'>Specialist Investigator Training Portal</button>
      </div>
      <div className='flex-grow' />
      <div className='flex items-center px-4 hover:bg-gray-300 hover:text-black'>
        <Link href='/'>
          <button className='font-bold'>Dashboard</button>
        </Link>
      </div>
      <div className='flex items-center px-4 hover:bg-gray-300 hover:text-black'>
        <button className='font-bold'>Notifications</button>
      </div>
      <div
        className='relative flex items-center px-4 hover:bg-gray-300 hover:text-black'
        onMouseEnter={() => setShowProfileMenu(true)}
        onMouseLeave={() => setShowProfileMenu(false)}
      >
        <button className='top-1/2 font-bold'>My Profile</button>
        {showProfileMenu && (
          <ul className='absolute right-0 top-12 z-50 mt-2 w-48 select-none divide-y bg-gray-300 font-bold text-black focus:outline-none'>
            <li className='px-4 py-2 text-sm hover:bg-gray-400'>
              {firstName} {lastName}
            </li>
            <li className='cursor-pointer px-4 py-2 text-sm hover:bg-gray-400' onClick={handleLogout}>
              Logout
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}
