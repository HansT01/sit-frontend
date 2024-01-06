import { NotificationsContext, SessionContext } from '@/contexts'
import { getCourseInfo, getStructureData } from '@/services'
import { Node, Structure } from '@/util/Structure'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

export const useCourse = (id: number, initialPageIndex: number, isEditing: boolean) => {
  const { token, userId } = useContext(SessionContext)
  const notifications = useContext(NotificationsContext)
  const [structure, setStructure] = useState<Structure | null>(null)
  const [pageIndex, setPageIndex] = useState(initialPageIndex)
  const [page, setPage] = useState<Node | null>(null)
  const router = useRouter()

  const refreshStructure = useCallback(async () => {
    if (!token || !userId) return
    const [courseInfo, structureData] = await Promise.all([
      getCourseInfo(token, id, userId),
      getStructureData(token, id),
    ])
    setStructure(new Structure(courseInfo.name, structureData, isEditing))
  }, [id, isEditing, token, userId])

  useEffect(() => {
    refreshStructure().catch(notifications.error)
  }, [notifications.error, refreshStructure])

  const setPageByIndex = useCallback(
    (index: number) => {
      if (structure && index < structure.flattened.length) {
        const newPage = structure.flattened[index]
        if (newPage) {
          setPage(newPage)
        }
      } else {
        setPage(null)
      }
    },
    [structure]
  )

  useEffect(() => {
    setPageByIndex(pageIndex)
  }, [pageIndex, setPageByIndex])

  useEffect(() => {
    if (page && structure) {
      const pageIndex = structure.flattened.findIndex((item) => item === page)
      setPageIndex(pageIndex)
    }
  }, [page, structure])

  // Updates the URL with the current pageIndex whenever the page changes.
  const prevIndex = useRef(initialPageIndex)
  useEffect(() => {
    if (!structure || !page) return
    const currIndex = structure.flattened.findIndex((item) => item === page)
    if (currIndex !== prevIndex.current) {
      prevIndex.current = currIndex
      const query = { index: currIndex.toString() }
      if (isEditing) {
        router.replace({ pathname: `/course/${id}/edit`, query })
      } else {
        router.replace({ pathname: `/course/${id}`, query })
      }
    }
  }, [page, structure, id, router, isEditing])

  const next = () => {
    if (structure && pageIndex < structure.flattened.length - 1) {
      setPageIndex(pageIndex + 1)
    }
  }

  const previous = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1)
    }
  }

  return { structure, page, setPage, next, previous, id, refreshStructure }
}
