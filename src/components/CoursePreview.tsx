import { CourseInfo } from '@/services'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { MouseEvent } from 'react'

interface ViewSectionProps {
  label: string
  value: string
  className?: string
}

const ViewSection = ({ label, value, className }: ViewSectionProps) => {
  return (
    <div className={className}>
      <h3 className='font-bold'>{label}:</h3>
      <p className='line-clamp-2'>{value}</p>
    </div>
  )
}

interface CoursePreviewProps {
  data: CourseInfo
  canEdit: boolean
}

export const CoursePreview = ({ data, canEdit }: CoursePreviewProps) => {
  const router = useRouter()

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    router.push(`/course/${data.course_id}`)
  }
  const handleClickEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    router.push(`/course/${data.course_id}/edit`)
  }

  return (
    <div
      className='flex h-full w-full cursor-pointer flex-col gap-2 rounded-xl bg-gray-300 p-4 text-left hover:bg-gray-400'
      onClick={handleClick}
    >
      <h2 className='text-center text-lg font-bold'>{data.name}</h2>
      <ViewSection label='Overview' value={data.overview} />
      <ViewSection label='Course Outcomes' value={data.course_outcomes} />
      <ViewSection label='Instructors' value={data.instructor_name} />
      <ViewSection label='Email Addresses' value={data.email} />
      <div className='flex flex-row'>
        <ViewSection label='Start Date' value={dayjs(data.commencement_date).format('DD/MM/YYYY')} />
        <div className='grow' />
        <ViewSection label='Finish Date' value={dayjs(data.finish_date).format('DD/MM/YYYY')} />
      </div>
      <ViewSection label='Location' value={data.location} />
      <div className='grow' />
      <ViewSection label='Course Progress' value={data.course_progress} className='flex flex-col items-center' />
      <ViewSection label='Milestones Completed' value={`${data.milestones_completed}/${data.milestones_count}`} />
      {canEdit && (
        <button className='w-full rounded bg-white p-2 hover:bg-gray-200' onClick={handleClickEdit}>
          Edit
        </button>
      )}
    </div>
  )
}
