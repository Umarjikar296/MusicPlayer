import React, { useRef, useState, useEffect } from 'react'
import { FaPlay, FaPause, FaBackward, FaForward, FaHeart } from "react-icons/fa";
import { FaShuffle, FaRepeat, FaVolumeXmark } from "react-icons/fa6";
import { FiVolume2 } from "react-icons/fi";
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl'
import PlayList from './PlayList';
import { tracks } from '../Tracks'

const MusicPlayer = () => {

    const audioRef = useRef(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [repeatedMode, setRepeatedMode] = useState('none');
    const [isShuffled, setIsShuffled] = useState(false);
    const [isLiked, setIsLiked] = useState(false);


    const [Volume, setVolume] = useState(0.8)
    const [isMuted, setIsMuted] = useState(false)

    const currentTrack = tracks[currentTrackIndex];
    // console.log(currentTrack);


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadmetadata", updateDuration)
        audio.addEventListener("ended", handleTrackEnd)

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleTrackEnd);
        }

    }, [currentTrackIndex])


    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handlePrev = () => {
        const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
        setCurrentTrackIndex(newIndex);
        setIsPlaying(false);
    }

    const handleNext = () => {
        const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
        setCurrentTrackIndex(newIndex);
        setIsPlaying(false);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}: ${seconds.toString().padStart(2, "0")}`;
    }

    const toggleRepeat = () => {
        const modes = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(repeatedMode);
        const nextIndex = (currentIndex + 1) & modes.length;
        setRepeatedMode(modes[nextIndex]);
    }

    const handleSeek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }


    const handleTrackEnd = () => {
        if (repeatedMode == "one") {
            audioRef.current?.play();
            return
        }
        if (repeatedMode === "all" || currentTrackIndex < tracks.length - 1) {
            handleNext();
            return;
        } else {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.Volume = isMuted ? 0 : Volume;
        }

    }, [Volume, isMuted])

    const handleTrackIndex = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(false);
    }



    return (
        <div className='min-h-screen flex justify-center items-center'>
            <audio ref={audioRef} src={currentTrack.audioUrl} preload='metadata' />
            <div className='w-[1280px] p-6'>
                {/* Musci Card here */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 '>
                    <div className='lg:col-span-2 bg-white backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
                        {/* Album here */}
                        <div className='flex flex-col md:flex-row gap-8'>
                            <div className='flex-shrink-0'>
                                <div className="w-64 h-64 mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover: scale-110">
                                    {/* Image here */}
                                    <img src={currentTrack.coverUrl} className='w-full h-full object-cover' alt={currentTrack.album} />
                                </div>
                            </div>

                            {/* Track Info and control */}
                            <div className='flex-1 flex flex-col justify-between'>
                                <div className=' text-center md:text-left'>
                                    <h2 className='text-3xl font-bold text-violet-500 mb-2'>{currentTrack.title}</h2>
                                    <p className='text-gray-400'>{currentTrack.artist}</p>

                                    {/* Action Button */}
                                    <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                                        <button className={`cursor-pointer p-3  rounded-full transition-all duration-300 bg-gray-300 border ${isLiked ? "bg-pink-600 shadow-lg text-white" : "bg-white/10 text-gray-500 hover:bg-pink-200"}`} onClick={() => setIsLiked(!isLiked)}>
                                            <FaHeart fill={isLiked ? "currentcolor" : ""} size={20} />
                                        </button>
                                        <button className={`px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600  text-white rounded-full font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 cursor-pointer`} >Add to Playlist</button>
                                    </div>
                                </div>



                                {/* Progress Section */}
                                <div className='mt-8'>
                                    <ProgressBar currentTime={currentTime} duration={duration || currentTime.duration} onSeek={handleSeek} />
                                    <div className='flex justify-between text-sm text-gray-400 mt-2'>
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(currentTrack.duration)}</span>
                                    </div>
                                    {/* Control  Buttons*/}
                                    <div className='flex items-center justify-center gap-4 mt-6'>
                                        <button className={` p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-100 hover:scale-110 cursor-pointer ${isShuffled ? "bg-gray-300 hover:bg-gray-300" : ""}`} onClick={() => setIsShuffled(!isShuffled)}><FaShuffle size={18} /></button>
                                        <button className='p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer' onClick={handlePrev}><FaBackward size={20} /></button>
                                        <button className='p-3 rounded-full transition-all duration-300 text-white hover:bg-purple-600 bg-purple-500 hover:scale-110 cursor-pointer' onClick={handlePlayPause}> {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}</button>
                                        <button className='p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer' onClick={handleNext}><FaForward size={20} /></button>
                                        <button className='relative p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer' onClick={toggleRepeat} ><FaRepeat size={20} />
                                            {repeatedMode === 'one' && (<span className='absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xs text-white'>1
                                            </span>)}


                                        </button>


                                        {/* Volume Control */}
                                        <div className='flex items-center justify-center gap-2'>
                                            <button className='text-dark hover:scale-110 transition-all duration-300 cursor-pointer' onClick={() => setIsMuted(!isMuted)}>{isMuted ? <FaVolumeXmark size={20} /> : <FiVolume2 size={20} />}</button>
                                            <VolumeControl />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* PlaylistSideBar */}
                    <div className='backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl bg-white'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-bold text-gray-800'>Up Next</h3>
                            <p className='w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-gray-100 text-sm font-bold'>{tracks.length}</p>
                        </div>
                        <div className='space-y-3 h-96 overflow-y-auto overflow-x-hidden'>
                            {tracks.map((track, index) => {
                                return (
                                    <PlayList
                                        key={index} track={track} isActive={currentTrackIndex === index} isPlaying={isPlaying && index === currentTrackIndex} onClick={() => handleTrackIndex()} />

                                )
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MusicPlayer
