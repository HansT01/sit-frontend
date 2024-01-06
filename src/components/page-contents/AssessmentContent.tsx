import { Assessment } from '@/util/Structure'
import { useForm } from 'react-hook-form'
import { FileField, FilePreview, humanFileSize } from '../form-fields/FileField'

interface AssessmentForm {
  files: File[]
}

const AssessmentForm = () => {
  const { control, handleSubmit } = useForm<AssessmentForm>({ mode: 'onBlur', defaultValues: { files: [] } })

  const onSubmit = (data: AssessmentForm) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FileField name='files' control={control} />
      <button type='submit' className='mt-3 rounded-lg bg-gray-50 px-3 py-2 hover:bg-white'>
        Submit
      </button>
    </form>
  )
}

interface AssessmentContentProps {
  assessment: Assessment
}

export const AssessmentContent = ({ assessment }: AssessmentContentProps) => {
  const generateTextFile = () => {
    const text = 'Hello, world! This is a dummy text file.'
    return new File([text], 'dummy.txt', { type: 'text/plain' })
  }

  const file = generateTextFile()

  return (
    <div className='flex w-full flex-col gap-2'>
      {assessment.dueDate && (
        <>
          <p className='font-bold'>Due Date</p>
          <p>{assessment.dueDate.format('DD/MM/YYYY by HH:mm:ss')}</p>
        </>
      )}
      {assessment.submit && (
        <>
          <p className='font-bold'>Submission Link</p>
          <AssessmentForm />
        </>
      )}
      {assessment.previousSubmissions && (
        <>
          <p className='font-bold'>Previous Submissions</p>
          <div className='relative flex aspect-square max-w-[160px] cursor-pointer select-none flex-col items-center overflow-hidden rounded border bg-gray-100 text-center'>
            <FilePreview file={file} />
            <div className='absolute bottom-0 left-0 right-0 flex flex-col bg-white bg-opacity-50 p-2 text-xs'>
              <span className='w-full truncate font-bold text-gray-900'>{file.name}</span>
              <span className='text-xs text-gray-900'>{humanFileSize(file.size)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
