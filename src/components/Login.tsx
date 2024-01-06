import { NotificationsContext } from '@/contexts'
import QPSlogo from '@/public/QPS_logo.png'
import Image from 'next/image'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { LoginField } from './form-fields/LoginField'

interface LoginFormData {
  username: string
  password: string
}

interface LoginProps {
  handleLogin: (username: string, password: string) => Promise<void>
}

export const Login = ({ handleLogin }: LoginProps) => {
  const notifications = useContext(NotificationsContext)
  const { control, handleSubmit, clearErrors } = useForm<LoginFormData>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data.username, data.password).catch(notifications.error)
  }

  const LoginForm = () => {
    return (
      <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
        <LoginField name='username' placeholder='Username' control={control} />
        <LoginField name='password' placeholder='Password' isPassword control={control} />
        <button type='submit' className='mt-3 rounded-lg bg-gray-50 px-3 py-2 hover:bg-gray-300'>
          Login
        </button>
      </form>
    )
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-4 bg-login p-2'>
      <div className='w-[300px] max-w-full'>
        <Image src={QPSlogo} alt='QPS logo' />
      </div>
      <h1 className='text-center text-4xl font-bold text-white'>Specialist Investigator Training Portal</h1>
      <div className='w-[300px]'>
        <LoginForm />
      </div>
      <div className='flex flex-row gap-10'>
        <a className='cursor-pointer text-center text-base text-white underline'>Reset Password</a>
        <a className='cursor-pointer text-center text-base text-white underline'>View Courses</a>
      </div>
    </div>
  )
}
