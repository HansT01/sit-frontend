import Image from 'next/image'
import { useState } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface PreviewUrlProps {
  previewUrl: string
}

const AudioPreview = () => {
  return (
    <svg
      className='absolute top-1/2 h-12 w-12 -translate-y-2/3 transform text-gray-400'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
      />
    </svg>
  )
}

const ApplicationPreview = () => {
  return (
    <svg
      className='absolute top-1/2 h-12 w-12 -translate-y-2/3 transform text-gray-400'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
      />
    </svg>
  )
}

const ImagePreview = ({ previewUrl }: PreviewUrlProps) => {
  return (
    <Image
      className='preview absolute inset-0 z-0 h-full w-full border-4 border-white object-cover'
      src={previewUrl}
      alt='Preview'
      layout='fill'
    />
  )
}

const VideoPreview = ({ previewUrl }: PreviewUrlProps) => {
  return (
    <video className='preview pointer-events-none absolute inset-0 h-full w-full border-4 border-white object-cover'>
      <source src={previewUrl} type='video/mp4' />
    </video>
  )
}

interface FilePreviewProps {
  file: File
}

export const FilePreview = ({ file }: FilePreviewProps) => {
  const loadPreviewUrl = (file: File): string => {
    const blobUrl = URL.createObjectURL(new Blob([file], { type: file.type }))

    const previewElements = document.querySelectorAll<HTMLImageElement>('.preview')
    previewElements.forEach((elem) => {
      elem.onload = () => {
        URL.revokeObjectURL(elem.src)
      }
    })

    return blobUrl
  }

  switch (true) {
    case file.type.includes('audio/'):
      return <AudioPreview />
    case file.type.includes('image/'):
      return <ImagePreview previewUrl={loadPreviewUrl(file)} />
    case file.type.includes('video/'):
      return <VideoPreview previewUrl={loadPreviewUrl(file)} />
    default:
      return <ApplicationPreview />
  }
}

export const humanFileSize = (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return parseFloat((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

interface DragAndDropFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
}

const DragAndDropField = <T extends FieldValues>({ name, control }: DragAndDropFieldProps<T>) => {
  const {
    field: { value, onChange },
  } = useController<T>({
    name,
    control,
  })

  const [DNDClassList, setDNDClassList] = useState<string[]>([])
  const [fileDragging, setFileDragging] = useState<number | null>(null)
  const [fileDropping, setFileDropping] = useState<number | null>(null)

  const removeFile = (index: number) => {
    onChange((prevState: File[]) => {
      const newFiles = [...prevState]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const reorderFiles = (): void => {
    if (fileDragging === null || fileDropping === null) {
      return
    }

    onChange((prevState: File[]) => {
      const newFiles = [...prevState]
      const removed = newFiles.splice(fileDragging, 1)
      newFiles.splice(fileDropping, 0, ...removed)
      return newFiles
    })

    setFileDropping(null)
    setFileDragging(null)
  }

  const handleDragEnter = (index: number) => {
    setFileDropping(index)
  }

  const handleDragStart = (index: number) => {
    setFileDragging(index)
  }

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newFiles = [...value, ...Array.from(e.target.files as FileList)]
    onChange(newFiles)
  }

  return (
    <div className='flex items-center justify-center overflow-hidden @container'>
      <div className='relative flex w-full flex-col rounded bg-white p-4 text-gray-400'>
        <div
          className={
            'relative flex cursor-pointer flex-col rounded border border-dashed border-gray-200 text-gray-400' +
            DNDClassList.join(' ')
          }
        >
          <input
            accept='*'
            type='file'
            multiple
            className='absolute inset-0 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none'
            onChange={handleAddFiles}
            onDragOver={() => {
              setDNDClassList((list) => {
                return [...list, 'border-blue-400', 'ring-4', 'ring-inset']
              })
            }}
            onDragLeave={() => {
              setDNDClassList((list) => {
                const remove = ['border-blue-400', 'ring-4', 'ring-inset']
                return list.filter((value) => !remove.includes(value))
              })
            }}
            onDrop={() => {
              setDNDClassList((list) => {
                const remove = ['border-blue-400', 'ring-4', 'ring-inset']
                return list.filter((value) => !remove.includes(value))
              })
              reorderFiles()
            }}
            title=''
          />

          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <svg
              className='text-current-50 mr-1 h-6 w-6'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p className='m-0'>Drag your files here or click in this area.</p>
          </div>
        </div>

        {value.length > 0 && (
          <div
            className='mt-4 grid grid-cols-2 gap-4 @sm:grid-cols-3 @xl:grid-cols-4 @2xl:grid-cols-6'
            onDrop={() => reorderFiles()}
            onDragOver={(e) => e.preventDefault()}
          >
            {(value as File[]).map((file, index) => (
              <div
                key={index}
                className={`relative flex cursor-move select-none flex-col items-center overflow-hidden rounded border bg-gray-100 text-center ${
                  fileDragging === index && 'border-blue-600'
                }`}
                style={{ paddingTop: '100%' }}
                onDragStart={() => handleDragStart(index)}
                onDragEnd={() => setFileDragging(null)}
                draggable={true}
                data-index={index}
              >
                <FilePreview file={file} />

                <div className='absolute bottom-0 left-0 right-0 flex flex-col bg-white bg-opacity-50 p-2 text-xs'>
                  <span className='w-full truncate font-bold text-gray-900'>{file.name}</span>
                  <span className='text-xs text-gray-900'>{humanFileSize(file.size)}</span>
                </div>

                <div
                  className='absolute inset-0 transition-colors duration-300'
                  onDragEnter={() => handleDragEnter(index)}
                  onDragLeave={() => setFileDropping(null)}
                ></div>

                <button
                  className='absolute right-0 top-0 rounded-bl bg-white p-1 focus:outline-none'
                  type='button'
                  onClick={() => removeFile(index)}
                >
                  <div className='h-4 w-4 text-gray-700'>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface FileFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
}

export const FileField = <T extends FieldValues>({ name, control }: FileFieldProps<T>) => {
  return <DragAndDropField name={name} control={control} />
}
