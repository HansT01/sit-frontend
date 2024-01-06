interface NoContentPlaceholder {}

export const NoContentPlaceholder = ({}: NoContentPlaceholder) => {
  return <div className='h-full w-full border-2 border-dashed border-black p-8'>This page has no content.</div>
}
