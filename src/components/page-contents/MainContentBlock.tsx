import { ContentData } from '@/services'
import { AssessmentContent } from './AssessmentContent'

export const MainContentBlock = (content: ContentData) => {
  return (
    <>
      <div className='flex flex-col gap-4 border border-gray-400 bg-gray-300 p-4'>
        <div className='flex flex-col gap-2'>
          {content.title && <p className='font-bold'>{content.title}</p>}
          {content.body && (
            <p className='' dangerouslySetInnerHTML={{ __html: content.body.replace(/\n/g, '<br />') }}></p>
          )}
          {/* {content.video && (
            <video className='mx-auto my-2 aspect-video max-h-[720px] w-full' controls={true}>
              <source src={content.video} type='video/mp4' />
            </video>
          )} */}
          {/* {content.files && content.files.length > 0 && (
            <div className='flex flex-col gap-2'>
              <p className='font-bold'>Download File</p>
              {content.files.map((url, i) => {
                return (
                  <div key={i} className='text-sm'>
                    {RenderDownloadLink(url)}
                  </div>
                )
              })}
            </div>
          )} */}
          {content.assessment && <AssessmentContent assessment={content.assessment} />}
        </div>
        <div className='flex flex-col text-gray-500'>
          {content.author && <p>{content.author}</p>}
          {content.date && <p>{content.date.format('DD/MM/YYYY HH:mm:ss')}</p>}
          {content.date_edit && <p className='text-xs'>Edited: {content.date_edit.format('DD/MM/YYYY HH:mm:ss')}</p>}
        </div>
      </div>
    </>
  )
}
