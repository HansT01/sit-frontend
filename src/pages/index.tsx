import { CoursePreview } from '@/components'
import { NotificationsContext, SessionContext } from '@/contexts'
import { CourseInfo, getDashboard, getStudentDashboard } from '@/services'
import type { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'

const sampleCourseInfo = {
  name: 'Interviewing Children',
  instructorname: 'Mr Guy Instructo',
  email: 'g.instructo@qps.com',
  course_id: 0,
  overview: 'Trimmed overview for readabilityTrimmed overview for readabilityTrimmed overview for readability',
  course_outcomes: 'Trimmed outcomes for readability',
  commencement_date: '2023-12-06T00:00:00Z',
  location: 'Brisbane CBD',
  finish_date: '2024-01-05T00:00:00Z',
  course_progress: '0',
  milestones_count: '2',
  milestones_completed: '0',
}

const Dashboard: NextPage = () => {
  const [coursePreviews, setCoursePreviews] = useState<CourseInfo[]>([])
  const { token, userId, isInstructor } = useContext(SessionContext)
  const notifications = useContext(NotificationsContext)

  useEffect(() => {
    if (token && userId) {
      if (isInstructor) {
        getDashboard(token)
          .then((data) => {
            setCoursePreviews(data)
          })
          .catch(notifications.error)
      } else {
        getStudentDashboard(token, userId)
          .then((data) => {
            setCoursePreviews(data)
          })
          .catch(notifications.error)
      }
    }
  }, [isInstructor, notifications.error, token, userId])

  return (
    <div className='flex h-[calc(100vh-3.5rem)] flex-col gap-4 p-8'>
      <h1 className='mx-auto text-4xl font-bold'>Enrolled Courses</h1>
      <div className={'w-fit px-4 py-2 text-lg' + (isInstructor ? ' bg-orange-300' : ' bg-teal-300')}>
        {isInstructor ? 'Instructor' : 'Student'}
      </div>
      <div className='flex flex-row gap-6'>
        <p className='font-bold'>Sort: Start Date</p>
        <p className='font-bold'>Filter: All</p>
      </div>
      <div className='flex h-full max-h-full grow flex-col gap-4 overflow-y-hidden md:flex-row'>
        <div className='scrollbar h-full grow overflow-y-scroll'>
          <div className='grid h-full max-h-full gap-4 pr-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
            {coursePreviews.map((courseInfo, i) => {
              return (
                <div key={i} className='h-full w-full'>
                  <CoursePreview data={courseInfo} canEdit={true} />
                </div>
              )
            })}
          </div>
        </div>
        <div className='flex h-full shrink-0 flex-col gap-4 md:w-[400px]'>
          <div className='grid h-fit w-full grid-cols-3 gap-4 overflow-hidden'>
            <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-300 p-2 hover:bg-gray-400'>
              <div className='flex h-full items-center justify-center'>
                <p className='break-words text-center'>Library</p>
              </div>
            </div>
            <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-300 p-2 hover:bg-gray-400'>
              <div className='flex h-full items-center justify-center'>
                <p className='break-words text-center'>All Courses</p>
              </div>
            </div>
            <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-300 p-2 hover:bg-gray-400'>
              <div className='flex h-full items-center justify-center'>
                <p className='break-words text-center'>QPS Email</p>
              </div>
            </div>
            <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-300 p-2 hover:bg-gray-400'>
              <div className='flex h-full items-center justify-center'>
                <p className='break-words text-center'>My Grades</p>
              </div>
            </div>
            <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-300 p-2 hover:bg-gray-400'>
              <div className='flex h-full items-center justify-center'>
                <p className='break-words text-center'>Calendar</p>
              </div>
            </div>
            <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-300 p-2 hover:bg-gray-400'>
              <div className='flex h-full items-center justify-center'>
                <p className='break-words text-center'>Instructor Chat</p>
              </div>
            </div>
          </div>
          <div className='flex grow items-center justify-center rounded-lg bg-gray-300'>Notifications</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
