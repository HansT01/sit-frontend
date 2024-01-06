interface BubbleLinkProps {
  label: string
}

export const SquareBubbleLink = ({ label }: BubbleLinkProps) => {
  return (
    <div className='flex aspect-square h-full w-full items-center justify-center rounded-xl bg-gray-300'>
      <p className='text-center'>{label}</p>
    </div>
  )
}
