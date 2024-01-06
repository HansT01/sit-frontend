import { UserInfo } from '@/services'

interface SelectInstructorProps {
  instructor: UserInfo
  add: () => void
  remove: () => void
}

export const SelectInstructor = ({ instructor, add, remove }: SelectInstructorProps) => {
  return (
    <div className='flex items-center gap-4 border border-gray-400 bg-gray-300 p-4'>
      <p>
        {instructor.firstName} {instructor.lastName} - {instructor.userId}
      </p>
      <div className='grow'></div>
      {instructor.isTeaching ? (
        <button className='rounded-lg bg-red-500 px-4 py-2 hover:bg-red-600' onClick={remove}>
          Remove
        </button>
      ) : (
        <button className='rounded-lg bg-green-500 px-4 py-2 hover:bg-green-600' onClick={add}>
          Add
        </button>
      )}
    </div>
  )
}
