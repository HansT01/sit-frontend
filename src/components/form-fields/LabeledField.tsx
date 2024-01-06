import { ReactNode } from 'react'

export interface LabeledFieldProps {
  label: string
  notes: string
  children: ReactNode
}

export const LabeledField = ({ label, children, notes }: LabeledFieldProps) => {
  return (
    <div className='lg:flex'>
      <div className='lg:w-1/3'>
        <label className='mb-3 block break-words pr-4 font-bold lg:mb-0'>{label}</label>
      </div>
      <div className='lg:w-2/3'>
        {children}
        <p className='py-2 text-sm'>{notes}</p>
      </div>
    </div>
  )
}
