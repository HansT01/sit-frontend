import { MouseEvent, useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  className?: string
}

const PlayIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} height='100%' version='1.1' viewBox='0 0 36 36' width='100%'>
      <path fill='white' d='M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z' id='ytp-id-1462'></path>
    </svg>
  )
}

const PauseIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} height='100%' version='1.1' viewBox='0 0 36 36' width='100%'>
      <path fill='white' d='M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z' id='ytp-id-83'></path>
    </svg>
  )
}

// This component is currently unused, but can be used to replace the default browser video view
export const VideoPlayer = ({ src, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const playVideo = async () => {
    await videoRef.current?.play()
    setPlaying(true)
  }

  const pauseVideo = async () => {
    videoRef.current?.pause()
    setPlaying(false)
  }

  const handleTogglePlay = async (e: MouseEvent<HTMLElement>) => {
    playing ? await pauseVideo() : await playVideo()
  }

  const updateProgress = () => {
    if (!progressBarRef.current || !videoRef.current) return
    let percentage = 0
    if (videoRef.current.currentTime <= videoRef.current.duration) {
      percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100
    }
    progressBarRef.current.style.transform = `translateX(${percentage}%)`
    requestAnimationFrame(updateProgress)
  }

  const handleProgressBarClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const element = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - element.left) / (element.right - element.left)
    videoRef.current.currentTime = ratio * videoRef.current.duration
  }

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return '00:00'
    const padString = (str: string, pad: string, length: number) => {
      return (new Array(length + 1).join(pad) + str).slice(-length)
    }
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return padString(min.toString(), '0', 2) + ':' + padString(sec.toString(), '0', 2)
  }

  return (
    <div className='relative my-2'>
      <video
        className='mx-auto aspect-video w-full max-w-full'
        onProgress={() => updateProgress()}
        onTimeUpdate={() => (videoRef.current ? setCurrentTime(videoRef.current.currentTime) : null)}
        onEnded={() => setPlaying(false)}
        ref={videoRef}
      >
        <source src={src} type='video/mp4' />
      </video>
      <div
        className='absolute left-0 right-0 top-0 flex h-full w-full flex-col justify-end bg-gradient-to-t from-[hsl(0,0%,0%,20%)] px-4 opacity-0 transition-opacity hover:opacity-100'
        onClick={handleTogglePlay}
      >
        <div
          className='relative bottom-0 h-1 w-full cursor-pointer overflow-hidden transition-all hover:h-2'
          onClick={handleProgressBarClick}
        >
          <div className='pointer-events-none absolute h-full w-full bg-white opacity-50' />
          <div
            className='pointer-events-none absolute -left-full h-full w-full bg-red-700 ease-in-out'
            ref={progressBarRef}
          />
        </div>
        <div className='flex h-12 items-center text-white' onClick={(e) => e.stopPropagation()}>
          <button onClick={handleTogglePlay} className='h-full p-0.5'>
            {playing ? <PauseIcon className='opacity-80' /> : <PlayIcon className='opacity-80' />}
          </button>
          <p className='px-2'>
            {formatTime(currentTime)} / {formatTime(videoRef.current?.duration)}
          </p>
        </div>
      </div>
    </div>
  )
}
