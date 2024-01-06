import { Result } from '@/util/Structure'
import { RenderDownloadLink } from '../DownloadLink'

export const ResultContentBlock = (result: Result) => {
  return (
    <div className='flex flex-col gap-4 border border-gray-400 bg-gray-300 p-4'>
      <p className='font-bold'>{result.title}</p>
      {result.assessments.map((assessment, i) => {
        return (
          <div key={i} className='flex flex-col border border-gray-400 p-2'>
            <h3 className='font-semibold'>{assessment.title}</h3>
            <div className='flex gap-1'>Due: {assessment.dueDate}</div>
            <div className='flex gap-1'>
              Status:<div className='text-green-500'>{assessment.status}</div>
            </div>
            <div className='flex gap-1'>Submission: {RenderDownloadLink(assessment.submission)}</div>
            <div className='flex gap-1'>Feedback: {RenderDownloadLink(assessment.feedback)}</div>
          </div>
        )
      })}
    </div>
  )
}
