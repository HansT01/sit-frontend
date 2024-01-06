import { Assessment } from '@/util/Structure'
import dayjs, { Dayjs } from 'dayjs'

export interface APIRequest {
  token?: string
  request: string
  args: { [key: string]: any }
}

export interface APIResponse<T> {
  status: number
  message: string
  payload: T
}

export const fetchAPI = async <T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', req: APIRequest) => {
  console.log(req)
  const res = await fetch('https://qps-sit.test:8080/post', {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    let message = `Failed to fetch. Server responded with a status of ${res.status}.`
    try {
      const data: APIResponse<T> = await res.json()
      if (data && data.message) {
        message = data.message
      }
    } catch {}
    const err: Error & { status?: number } = Error(message)
    err.status = res.status
    throw err
  }
  const data: APIResponse<T> = await res.json()
  console.log(data)
  return data
}

export interface CourseInfo {
  name: string
  instructor_name: string
  email: string
  course_id: number
  overview: string
  course_outcomes: string
  commencement_date: string
  location: string
  finish_date: string
  course_progress: string
  milestones_count: string
  milestones_completed: string
}

export const getStudentDashboard = async (token: string, userId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'studentDashboard',
      user_id: userId,
    },
  }
  const res = await fetchAPI<CourseInfo[]>('POST', req)
  return res.payload
}

export const getDashboard = async (token: string) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'getDashboard',
    },
  }
  const res = await fetchAPI<CourseInfo[]>('POST', req)
  return res.payload
}

export const getCourseInfo = async (token: string, courseId: number, userId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'courseInfo',
      course_id: courseId,
      user_id: userId,
    },
  }
  const res = await fetchAPI<CourseInfo>('POST', req)
  return res.payload
}

export interface SidebarData {
  milestone_id: number
  milestone_title: string
  type: 'Precourse' | 'Incourse'
  page_id: number
  page_title: string
}

export interface MilestoneData {
  id: number
  title: string
  type: 'Precourse' | 'Incourse'
  pages: {
    id: number
    title: string
  }[]
}

export const getStructureData = async (token: string, courseId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'sidebar',
      course_id: courseId,
    },
  }
  const res = await fetchAPI<SidebarData[]>('POST', req)
  const map = new Map<number, MilestoneData>()
  for (let data of res.payload) {
    if (!map.has(data.milestone_id)) {
      const milestone: MilestoneData = {
        id: data.milestone_id,
        title: data.milestone_title,
        type: data.type,
        pages: [],
      }
      map.set(data.milestone_id, milestone)
    }
    if (data.page_title !== null) {
      const page = {
        id: data.page_id,
        title: data.page_title,
      }
      map.get(data.milestone_id)?.pages.push(page)
    }
  }
  const result: MilestoneData[] = []
  map.forEach((value) => {
    result.push(value)
  })
  return result
}

export interface ContentData {
  id?: number
  title?: string
  body?: string
  date?: Dayjs
  date_edit?: Dayjs
  author?: string
  files?: any
  assessment?: Assessment
}

export interface PageData {
  content_id: number
  title?: string
  type?: string
  date?: string
  text?: string
  assessment?: number
  due_date?: string
}

export const getPageData = async (token: string, courseId: number, milestoneId: number, pageId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'getPage',
      course_id: courseId,
      milestone_id: milestoneId,
      page_id: pageId,
    },
  }
  const res = await fetchAPI<PageData[]>('POST', req)
  const parsed: ContentData[] = res.payload.map((data) => {
    const assessment: Assessment | undefined =
      data.assessment === 1
        ? {
            submit: 'https://www.example-api.com/submit',
            dueDate: dayjs(data.due_date),
            previousSubmissions: [],
          }
        : undefined
    return {
      id: data.content_id,
      title: data.title,
      body: data.text,
      type: data.type,
      date: dayjs(data.date),
      files: [],
      assessment: assessment,
    }
  })
  return parsed
}

export interface AnnouncementData {
  edit: string
  announce_time: string
  announcement: string
  author: string
}

export const getAnnouncementData = async (token: string, courseId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'courseAnnouncements',
      course_id: courseId,
    },
  }
  const res = await fetchAPI<AnnouncementData[]>('POST', req)
  const parsed: ContentData[] = res.payload.map((data) => {
    return {
      body: data.announcement,
      date: dayjs(data.announce_time),
      date_edit: dayjs(data.edit),
      author: data.author,
      files: [],
    }
  })
  return parsed
}

interface InstructorData {
  user_id: string
  title: string
  first_name: string
  last_name: string
  email: string
  active: string
  created: string
}

export const getInstructorsData = async (token: string, courseId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'getCourseInstructors',
      course_id: courseId,
    },
  }
  const res = await fetchAPI<InstructorData[]>('POST', req)
  const parsed: ContentData[] = res.payload.map((data) => {
    return {
      title: `${data.title} ${data.first_name} ${data.last_name}`,
      body: `Email: ${data.email}\nActive: ${data.active}`,
      files: [],
    }
  })
  return parsed
}

export const createMilestone = async (token: string, courseId: number, milestoneType: 'Precourse' | 'Incourse') => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'createMilestone',
      course_id: courseId,
      milestone_type: milestoneType,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const createPage = async (token: string, courseId: number, milestoneId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'createPage',
      course_id: courseId,
      milestone_id: milestoneId,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const deleteMilestone = async (token: string, courseId: number, milestoneId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'deleteMilestone',
      course_id: courseId,
      milestone_id: milestoneId,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const deletePage = async (token: string, courseId: number, milestoneId: number, pageId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'deletePage',
      course_id: courseId,
      milestone_id: milestoneId,
      page_id: pageId,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const updateMilestoneTitle = async (token: string, courseId: number, milestoneId: number, newTitle: string) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'renameMilestone',
      course_id: courseId,
      milestone_id: milestoneId,
      title: newTitle,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const updatePageTitle = async (
  token: string,
  courseId: number,
  milestoneId: number,
  pageId: number,
  newTitle: string
) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'renamePage',
      course_id: courseId,
      milestone_id: milestoneId,
      page_id: pageId,
      title: newTitle,
    },
  }
  await fetchAPI<void>('POST', req)
}

export interface PageContentData {
  title: string
  text: string
  type: 'Text'
  assessment: number
  due_date: string | null
  position: number
}

export const updatePageContents = async (
  token: string,
  courseId: number,
  milestoneId: number,
  pageId: number,
  newContents: PageContentData[]
) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'updatePage',
      course_id: courseId,
      milestone_id: milestoneId,
      page_id: pageId,
      course_content: newContents,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const getToken = async (userId: string, password: string) => {
  const req: APIRequest = {
    request: 'login',
    args: {
      user_id: userId,
      password: password,
    },
  }
  const res = await fetchAPI<{ token: string }>('POST', req)
  return res.payload.token
}

export interface UserInfo {
  userId: number
  firstName: string
  lastName: string
  isInstructor: boolean
  isTeaching?: boolean
}

interface UserInfoData {
  user_id: number
  first_name: string
  last_name: string
  is_instructor: 1 | 0
}

export const getUserInfo = async (token: string) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'getSessionUID',
    },
  }
  const res = await fetchAPI<UserInfoData>('POST', req)
  if (!res.payload) {
    throw new Error(`Expected payload with length of at least 1, but got ${res.payload}`)
  }
  return {
    userId: res.payload.user_id,
    firstName: res.payload.first_name,
    lastName: res.payload.last_name,
    isInstructor: res.payload.is_instructor === 1,
  } as UserInfo
}

interface InstructorInfoData {
  user_id: number
  first_name: string
  last_name: string
  // is_instructor: 1 | 0
  is_teaching: 1 | 0
}

export const getCourseInstructors = async (token: string, courseId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'getCourseInstructors',
      course_id: courseId,
    },
  }
  const res = await fetchAPI<InstructorInfoData[]>('POST', req)
  return res.payload.map((data) => {
    return {
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      isInstructor: true,
      isTeaching: data.is_teaching === 1,
    } as UserInfo
  })
}

export const getActiveCourseInstructors = async (token: string, courseId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'query',
    args: {
      query: 'getActiveCourseInstructors',
      course_id: courseId,
    },
  }
  const res = await fetchAPI<InstructorInfoData[]>('POST', req)
  return res.payload.map((data) => {
    return {
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      isInstructor: true,
      isTeaching: data.is_teaching === 1,
    } as UserInfo
  })
}

export const addCourseInstructor = async (token: string, courseId: number, instructorId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'addInstructor',
      course_id: courseId,
      user_id: instructorId,
    },
  }
  await fetchAPI<void>('POST', req)
}

export const removeCourseInstructor = async (token: string, courseId: number, instructorId: number) => {
  const req: APIRequest = {
    token: token,
    request: 'update',
    args: {
      query: 'removeInstructor',
      course_id: courseId,
      user_id: instructorId,
    },
  }
  await fetchAPI<void>('POST', req)
}
