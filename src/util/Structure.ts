import { MilestoneData } from '@/services'
import { Dayjs } from 'dayjs'

type Url = string

export interface Assessment {
  previousSubmissions?: string[]
  dueDate?: Dayjs
  submit?: string
}

export interface Content {
  title?: string
  body?: string
  author?: string
  date?: string
  video?: string
  files?: string[]
  assessment?: Assessment
}

export interface AssessmentResult {
  title: string
  dueDate: string
  status: string
  submission: string
  feedback: string
}

export interface Result {
  title: string
  assessments: AssessmentResult[]
}

type nodeType =
  | 'announcements'
  | 'overview'
  | 'contacts'
  | 'incourseMilestone'
  | 'page'
  | 'results'
  | 'instructors'
  | 'details'
  | 'precourseMilestone'

export class Node {
  parent: Node | null
  title: string
  type: nodeType
  id: number
  children: Node[]
  key: number

  constructor(parent: Node | null, id: number, title: string, type: nodeType) {
    this.parent = parent
    this.id = id
    this.title = title
    this.type = type
    this.children = []
    this.key = this.cyrb53((parent ? `${parent.id}:` : ``) + `${id}:${type}`)
  }

  addChildNode(node: Node) {
    this.children.push(node)
  }

  private cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i)
      h1 = Math.imul(h1 ^ ch, 2654435761)
      h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
  }
}

export class Structure {
  title: string
  sections: Node[][]
  flattened: Node[]

  constructor(title: string, milestones: MilestoneData[], isDraft: boolean) {
    this.title = title
    this.sections = []

    const appendMilestonesSection = () => {
      const precourseSection = []
      const incourseSection = []
      for (const milestone of milestones) {
        const milestoneNode = new Node(
          null,
          milestone.id,
          milestone.title,
          milestone.type === 'Precourse' ? 'precourseMilestone' : 'incourseMilestone'
        )
        for (const pageData of milestone.pages) {
          const pageNode = new Node(milestoneNode, pageData.id, pageData.title, 'page')
          milestoneNode.addChildNode(pageNode)
        }
        if (milestone.type === 'Precourse') {
          precourseSection.push(milestoneNode)
        } else {
          incourseSection.push(milestoneNode)
        }
      }
      if (precourseSection.length > 0) this.sections.push(precourseSection)
      if (incourseSection.length > 0) this.sections.push(incourseSection)
    }

    if (!isDraft) {
      const announcementsPage = new Node(null, 0, 'Announcements', 'announcements')
      const courseOverviewAndDatesPage = new Node(null, 0, 'Course Overview and Dates', 'overview')
      const instructorContactsPage = new Node(null, 0, 'Instructor Contacts', 'contacts')
      const resultsPage = new Node(null, 0, 'Results', 'results')
      this.sections.push([announcementsPage, courseOverviewAndDatesPage, instructorContactsPage])
      appendMilestonesSection()
      this.sections.push([resultsPage])
    } else {
      const courseDetailsPage = new Node(null, 0, 'Course Details', 'details')
      const instructorsPage = new Node(null, 0, 'Instructors', 'instructors')
      this.sections.push([courseDetailsPage, instructorsPage])
      appendMilestonesSection()
    }

    this.flattened = this.flatten()
  }

  flatten = () => {
    const nodes: Node[] = []
    const helper = (helperPage: Node) => {
      if (helperPage.children.length === 0) {
        nodes.push(helperPage)
        return
      }
      for (let childPage of helperPage.children) {
        helper(childPage)
      }
    }
    for (let page of this.sections.flat()) {
      helper(page)
    }
    return nodes
  }

  get first() {
    if (!this.sections[0] || !this.sections[0][0]) {
      return null
    }
    let currentPage = this.sections[0][0]
    while (currentPage.children && currentPage.children[0]) {
      currentPage = currentPage.children[0]
    }
    return currentPage
  }
}
