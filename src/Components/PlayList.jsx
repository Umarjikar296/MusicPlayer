import React from 'react'
import { FaPlay } from "react-icons/fa";
import { FaPause } from 'react-icons/fa6';

const PlayList = (track, isActive, isPlaying, onClick) => {

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}: ${seconds.toString().padStart(2, "0")}`;
  }



  return (
    <div className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isActive ? "bg-gray-700 text-white" : "bg-gray-800 hover:bg-gray-700"}`} onClick={onClick}>

      <div className='relative flex-shrink-0'>
        <div className='w-12 h-12 rounded-full overflow-hidden'>
          <img className='w-full h-full object-cover' src={track.coverUrl} alt="" />
        </div>


        {/* Play Pause Overlay */}
        <div className={` flex absolute inset-0 rounded-xl items-center justify-center transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
          {isActive && isPlaying ? (<FaPause size={16} className='text-white' />) : <FaPlay className='text-white ml-0.5' size={16} />}
        </div>
      </div>
      <div className="flex-1 min-2-0 text-white">
        <h4>{track.title}</h4>
        <p>{track.artist}</p>

      </div>
      {/* Track Duration */}
      <div className=' flex- items-center gap-3 text-white'>
        <div>
          {formatTime(track.duration)}
        </div>

      </div>
    </div>
  )
}

export default PlayList
