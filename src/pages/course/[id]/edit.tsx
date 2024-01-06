import {
  CourseLayout,
  DatePickerField,
  FileField,
  LabeledField,
  NoContentPlaceholder,
  SelectInstructor,
  TextAreaField,
  TextField,
} from '@/components'
import { useCourse } from '@/composables'
import { NotificationsContext, SessionContext } from '@/contexts'
import {
  ContentData,
  PageContentData,
  UserInfo,
  addCourseInstructor,
  getActiveCourseInstructors,
  getPageData,
  removeCourseInstructor,
  updatePageContents,
} from '@/services'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

export interface Page {
  title: string
  contents: ContentData[]
}

export interface Milestone {
  title: string
  children: Page[]
}

const defaultContent: ContentData = {
  title: '',
  body: '',
  files: [],
}

const defaultAssessmentContent: ContentData = {
  title: '',
  body: '',
  files: [],
  assessment: {
    dueDate: dayjs(),
  },
}

const Draft: NextPage = () => {
  const router = useRouter()
  const { token } = useContext(SessionContext)
  const notifications = useContext(NotificationsContext)

  const { id, index } = router.query
  const courseId = parseInt(id as string)
  const pageIndex = index === undefined ? 0 : parseInt(index as string)

  const course = useCourse(courseId, pageIndex, true)

  const [instructors, setInstructors] = useState<UserInfo[]>([])

  const { control, reset, handleSubmit } = useForm<{ contents: ContentData[] }>({
    defaultValues: { contents: [] },
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'contents',
  })

  const resetForm = useCallback(async () => {
    setInstructors([])
    reset({ contents: [] })
    if (!course.page || !token) {
      return
    }
    switch (course.page.type) {
      case 'details':
        reset({ contents: [] })
        break
      case 'instructors':
        setInstructors(await getActiveCourseInstructors(token, course.id))
        break
      case 'page':
        if (!course.page.parent) return
        reset({ contents: await getPageData(token, course.id, course.page.parent.id, course.page.id) })
        break
      default:
        reset({ contents: [] })
        break
    }
  }, [course.page, course.id, reset, token])

  useEffect(() => {
    resetForm().catch(notifications.error)
  }, [notifications.error, resetForm])

  const onSubmit = (data: { contents: ContentData[] }) => {
    if (!token || !course.page || !course.page.parent) return
    const result: PageContentData[] = []
    let position = 0
    for (let content of data.contents) {
      if (content.assessment && content.assessment.dueDate) {
        result.push({
          title: content.title ? content.title : '',
          text: content.body ? content.body : '',
          type: 'Text',
          assessment: 1,
          due_date: content.assessment.dueDate.toISOString(),
          position: ++position,
        })
      } else {
        result.push({
          title: content.title ? content.title : '',
          text: content.body ? content.body : '',
          type: 'Text',
          assessment: 0,
          due_date: null,
          position: ++position,
        })
      }
    }
    updatePageContents(token, course.id, course.page.parent.id, course.page.id, result)
      .then(() => resetForm())
      .catch(notifications.error)
  }

  const addInstructor = (instructorId: number) => {
    const callback = () => {
      if (!token) return
      addCourseInstructor(token, courseId, instructorId)
        .then(() => resetForm())
        .catch(notifications.error)
    }
    return callback
  }

  const removeInstructor = (instructorId: number) => {
    const callback = () => {
      if (!token) return
      removeCourseInstructor(token, courseId, instructorId)
        .then(() => resetForm())
        .catch(notifications.error)
    }
    return callback
  }

  return (
    <CourseLayout course={course} isDraft>
      <div className='flex flex-col gap-2'>
        {course.page?.type === 'instructors' && (
          <>
            {instructors.map((instructor, i) => {
              return (
                <div key={i}>
                  <SelectInstructor
                    instructor={instructor}
                    add={addInstructor(instructor.userId)}
                    remove={removeInstructor(instructor.userId)}
                  />
                </div>
              )
            })}
          </>
        )}
        {course.page?.type !== 'instructors' && (
          <>
            {fields.length === 0 && <NoContentPlaceholder />}
            {fields.map((field, i) => {
              return (
                <div key={field.id} className='flex flex-col gap-8 border border-gray-400 bg-gray-300 p-4'>
                  <LabeledField label={`Content Title`} notes='Title for this block'>
                    <TextField name={`contents.${i}.title`} control={control} />
                  </LabeledField>
                  <LabeledField label={`Content Body`} notes='Text body for this block'>
                    <TextAreaField name={`contents.${i}.body`} control={control} />
                  </LabeledField>
                  <LabeledField label={`Learning Material`} notes='Downloadable media files for this block'>
                    <FileField name={`contents.${i}.files`} control={control} />
                  </LabeledField>
                  {field.assessment && (
                    <div className='flex flex-col gap-8 bg-gray-200 p-4'>
                      <LabeledField label={`Assessment Due Date`} notes='Due date for this assessment module in AEST'>
                        <DatePickerField name={`contents.${i}.assessment.dueDate`} control={control} />
                      </LabeledField>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
        <div className='flex gap-2'>
          <button
            className='rounded-lg border-gray-400 bg-gray-300 px-4 py-2 text-left'
            onClick={() => append(defaultContent)}
          >
            Add Content Module
          </button>
          <button
            className='rounded-lg border-gray-400 bg-gray-300 px-4 py-2 text-left'
            onClick={() => append(defaultAssessmentContent)}
          >
            Add Assessment Module
          </button>
          <button
            className='rounded-lg border-gray-400 bg-gray-300 px-4 py-2 text-left'
            onClick={() => handleSubmit(onSubmit)()}
          >
            Save
          </button>
        </div>
      </div>
    </CourseLayout>
  )
}

export default Draft
