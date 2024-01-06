export const RenderDownloadLink = (url: string) => {
  return (
    <p className='w-fit font-semibold italic text-blue-700'>
      <a href={url} download className='w-fit'>
        {url.split('/').pop()}
      </a>
    </p>
  )
}
