import { useCourse } from '@/composables/useCourse'
import { NotificationsContext, SessionContext } from '@/contexts'
import {
  createMilestone,
  createPage,
  deleteMilestone,
  deletePage,
  updateMilestoneTitle,
  updatePageTitle,
} from '@/services'
import { Node } from '@/util/Structure'
import { ChangeEvent, MouseEvent, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { CreateIcon } from './icons/CreateIcon'
import { DeleteIcon } from './icons/DeleteIcon'
import { UpdateIcon } from './icons/UpdateIcon'

interface CourseLayoutProps {
  children?: ReactNode
  course: ReturnType<typeof useCourse>
  isDraft?: boolean
}

export const CourseLayout = ({ children, course, isDraft }: CourseLayoutProps) => {
  const session = useContext(SessionContext)
  const notifications = useContext(NotificationsContext)
  const { next, previous, structure, page, setPage, refreshStructure } = course
  const [menuOpen, setMenuOpen] = useState<{ [key: number]: boolean }>({})
  const [renaming, setRenaming] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState<string | null>(null)

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const setMenuOpenAndCascade = useCallback((node: Node) => {
    const state: { [key: string]: boolean } = {}
    state[node.key] = true
    let parent = node.parent
    while (parent) {
      state[parent.key] = true
      parent = parent.parent
    }
    setMenuOpen((prev) => ({ ...prev, ...state }))
  }, [])

  const getColours = (currentNode: Node | null) => {
    const baseColours = isDraft ? 'bg-ins-secondary text-white' : 'bg-stu-secondary text-white'
    const hoverColours = isDraft ? 'hover:bg-ins-secondary hover:text-white' : 'hover:bg-stu-secondary hover:text-white'
    if (currentNode) {
      return `${hoverColours} ${page === currentNode ? baseColours : ''}`
    }
    return `${hoverColours}`
  }

  const RenderNode = (node: Node, depth: number) => {
    const handleAddPage = () => {
      if (!session.token) return
      createPage(session.token, course.id, node.id)
        .then(() => refreshStructure())
        .catch(notifications.error)
    }

    const handleSelect = () => {
      if (node.type === 'incourseMilestone' || node.type === 'precourseMilestone') {
        if (menuOpen[node.key]) {
          setMenuOpen((prev) => ({ ...prev, [node.key]: false }))
        } else {
          setMenuOpenAndCascade(node)
        }
      } else {
        setPage(node)
      }
    }

    const handleBlur = () => {
      if (inputValue !== null && session.token) {
        switch (node.type) {
          case 'precourseMilestone':
          case 'incourseMilestone':
            updateMilestoneTitle(session.token, course.id, node.id, inputValue)
              .then(() => refreshStructure())
              .catch(notifications.error)
            break
          case 'page':
            if (!node.parent) break
            updatePageTitle(session.token, course.id, node.parent.id, node.id, inputValue)
              .then(() => refreshStructure())
              .catch(notifications.error)
            break
        }
      }
      setRenaming(null)
      setInputValue(null)
    }

    const handleRename = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setRenaming(node.key)
      setInputValue(node.title)
    }

    const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (!session.token) return
      switch (node.type) {
        case 'precourseMilestone':
        case 'incourseMilestone':
          deleteMilestone(session.token, course.id, node.id)
            .then(() => refreshStructure())
            .catch(notifications.error)
          break
        case 'page':
          if (!node.parent) return
          deletePage(session.token, course.id, node.parent.id, node.id)
            .then(() => refreshStructure())
            .catch(notifications.error)
          break
      }
    }

    return (
      <div>
        <div
          className={`flex w-full cursor-pointer items-center gap-1 px-2 py-1 text-left ${getColours(node)}`}
          style={{
            paddingLeft: `${depth + 0.5}rem`,
          }}
          onClick={handleSelect}
        >
          {renaming === node.key ? (
            <textarea
              autoFocus
              value={inputValue!}
              onClick={(e) => e.stopPropagation()}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              onFocus={(e) => e.target.select()}
              className='grow cursor-text overflow-y-hidden border-none bg-transparent px-0 py-0 outline-none'
            />
          ) : (
            <div onClick={handleSelect} className='grow cursor-pointer'>
              {node.title}
            </div>
          )}
          {isDraft &&
            (node.type === 'precourseMilestone' || node.type === 'incourseMilestone' || node.type === 'page') && (
              <>
                <div className={`h-[1em] w-[1em] shrink-0 cursor-pointer`} onClick={handleRename}>
                  <UpdateIcon />
                </div>
                <div className={`h-[1em] w-[1em] shrink-0 cursor-pointer`} onClick={handleDelete}>
                  <DeleteIcon />
                </div>
              </>
            )}
        </div>
        {menuOpen[node.key] && (
          <div>
            {node.children?.map((child, i) => {
              return <div key={i}>{RenderNode(child, depth + 1)}</div>
            })}
            {isDraft && (node.type === 'incourseMilestone' || node.type === 'precourseMilestone') && (
              <button
                className={`flex w-full items-center gap-2 px-2 py-1 text-left ${getColours(null)}`}
                style={{
                  paddingLeft: `${depth + 1 + 0.5}rem`,
                }}
                onClick={handleAddPage}
              >
                <div className={`h-[0.75em] w-[0.75em] cursor-pointer`}>
                  <CreateIcon />
                </div>
                Add New Page
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  const RenderSections = (sections: Node[][]) => {
    const handleAddMilestone = (milestoneType: 'Precourse' | 'Incourse') => {
      if (!session.token) return
      createMilestone(session.token, course.id, milestoneType)
        .then(() => refreshStructure())
        .catch(notifications.error)
    }

    return (
      <div className='divide-y'>
        {sections.map((section, i) => {
          return (
            <div key={i} className='py-2'>
              {section.map((node, i) => (
                <div key={i}>{RenderNode(node, 0)}</div>
              ))}
            </div>
          )
        })}
        {isDraft && (
          <div className='py-2'>
            <button
              className={`flex w-full items-center gap-2 px-2 py-1 text-left ${getColours(null)}`}
              style={{
                paddingLeft: `${0 + 0.5}rem`,
              }}
              onClick={() => handleAddMilestone('Precourse')}
            >
              <div className={`h-[0.75em] w-[0.75em] cursor-pointer`}>
                <CreateIcon />
              </div>
              Add Pre-Course Milestone
            </button>
            <button
              className={`flex w-full items-center gap-2 px-2 py-1 text-left ${getColours(null)}`}
              style={{
                paddingLeft: `${0 + 0.5}rem`,
              }}
              onClick={() => handleAddMilestone('Incourse')}
            >
              <div className={`h-[0.75em] w-[0.75em] cursor-pointer`}>
                <CreateIcon />
              </div>
              Add In-Course Milestone
            </button>
          </div>
        )}
      </div>
    )
  }

  const handleNext = () => {
    next()
  }

  const handlePrevious = () => {
    previous()
  }

  useEffect(() => {
    if (page) {
      setMenuOpenAndCascade(page)
    }
  }, [page, setMenuOpenAndCascade])

  const RenderNextAndPrevious = () => {
    return (
      <div className='flex gap-4'>
        <button onClick={handlePrevious} className='w-[90px] rounded-lg border border-gray-400 bg-gray-300 p-2'>
          Previous
        </button>
        <button onClick={handleNext} className='w-[90px] rounded-lg border border-gray-400 bg-gray-300 p-2'>
          Next
        </button>
      </div>
    )
  }

  return (
    <div className='flex h-full'>
      <div
        className={`fixed flex h-[calc(100%-56px)] w-80 shrink-0 flex-col overflow-y-auto p-4 text-white ${
          isDraft ? 'bg-ins-primary' : 'bg-stu-primary'
        }`}
      >
        {structure && (
          <>
            <h1 className='pl-1 font-bold'>{structure.title}</h1>
            {RenderSections(structure.sections)}
          </>
        )}
      </div>
      <div className='ml-80 flex h-full w-full flex-col gap-4 p-4'>
        <h1 className='mx-4 text-2xl font-bold'>{page?.title}</h1>
        {!isDraft && RenderNextAndPrevious()}
        <div>{children}</div>
        {!isDraft && RenderNextAndPrevious()}
      </div>
    </div>
  )
}
