import { useState } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface UsernameFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  placeholder?: string
  isPassword?: boolean
}

export const LoginField = <T extends FieldValues>({
  name,
  control,
  placeholder,
  isPassword,
}: UsernameFieldProps<T>) => {
  const [showInput, setShowInput] = useState(!isPassword)
  const { field, fieldState } = useController<T>({ name, control })
  return (
    <div className='relative w-full'>
      {isPassword && (
        <div className='absolute inset-y-0 right-0 flex items-center px-2'>
          <button
            type='button'
            tabIndex={-1}
            className='w-14 cursor-pointer select-none rounded bg-gray-300 px-2 py-1 text-center text-sm text-gray-600 hover:bg-gray-400'
            id='toggle'
            onClick={() => setShowInput(!showInput)}
          >
            {showInput ? 'hide' : 'show'}
          </button>
        </div>
      )}
      <input
        type={showInput ? 'text' : 'password'}
        className={`w-full rounded-lg border bg-gray-50 px-3 py-2 outline-none ${
          fieldState.error ? 'border-red-600' : ''
        }`}
        placeholder={placeholder}
        spellCheck='false'
        {...field}
      />
    </div>
  )
}
