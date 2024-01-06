import dayjs from 'dayjs'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
}

export const DatePickerField = <T extends FieldValues>({ name, control }: FormFieldProps<T>) => {
  const { field, fieldState } = useController({ name, control })
  return (
    <input
      className='block w-full text-ellipsis rounded p-3 focus:bg-white'
      type='datetime-local'
      value={field.value.format('YYYY-MM-DDTHH:mm')}
      onChange={(e) => {
        field.onChange(dayjs(e.target.value))
      }}
      ref={field.ref}
      name={field.name}
      onBlur={field.onBlur}
    />
  )
}
