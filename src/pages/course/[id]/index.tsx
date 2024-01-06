import { CourseLayout, MainContentBlock, NoContentPlaceholder, ResultContentBlock } from '@/components'
import { useCourse } from '@/composables'
import { NotificationsContext, SessionContext } from '@/contexts'
import { ContentData, getAnnouncementData, getInstructorsData, getPageData } from '@/services'
import { Result } from '@/util/Structure'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

const RenderContents = (contents: ContentData[]) => {
  return contents.map((content, i) => <div key={i}>{MainContentBlock(content)}</div>)
}

const RenderResults = (results: Result[]) => {
  return results.map((result, i) => <div key={i}>{ResultContentBlock(result)}</div>)
}

const Course: NextPage = () => {
  const router = useRouter()
  const { token } = useContext(SessionContext)
  const notifications = useContext(NotificationsContext)

  const { id, index } = router.query
  const courseId = parseInt(id as string)
  const pageIndex = index === undefined ? 0 : parseInt(index as string)

  const course = useCourse(courseId, pageIndex, false)

  const [contents, setContents] = useState<ContentData[]>([])
  const [results, setResults] = useState<Result[]>([])

  const clear = () => {
    setContents([])
    setResults([])
  }

  useEffect(() => {
    const resetData = async () => {
      if (!course.page || !token) {
        clear()
        return
      }
      switch (course.page.type) {
        case 'announcements':
          setContents(await getAnnouncementData(token, courseId))
          break
        case 'overview':
          clear()
          break
        case 'contacts':
          setContents(await getInstructorsData(token, courseId))
          break
        case 'incourseMilestone':
          clear()
          break
        case 'page':
          if (!course.page.parent) return
          setContents(await getPageData(token, courseId, course.page.parent.id, course.page.id))
          break
        case 'results':
          clear()
          break
        default:
          clear()
          break
      }
    }
    resetData().catch(notifications.error)
  }, [course.page, courseId, notifications.error, token])

  return (
    <CourseLayout course={course}>
      <div className='flex flex-col gap-2'>
        {contents.length === 0 && results.length === 0 && <NoContentPlaceholder />}
        {RenderContents(contents)}
        {RenderResults(results)}
      </div>
    </CourseLayout>
  )
}

export default Course
