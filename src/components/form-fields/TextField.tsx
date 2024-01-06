import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
}

export const TextField = <T extends FieldValues>({ name, control }: FormFieldProps<T>) => {
  const { field, fieldState } = useController<T>({ name, control })
  return <input className='block w-full text-ellipsis rounded p-3 focus:bg-white' type='text' {...field} />
}

export const TextAreaField = <T extends FieldValues>({ name, control }: FormFieldProps<T>) => {
  const { field, fieldState } = useController<T>({ name, control })
  return <textarea className='block w-full rounded p-3 focus:bg-white' {...field} rows={8} />
}
