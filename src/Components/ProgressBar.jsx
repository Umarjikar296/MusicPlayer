import React, { useRef, useState } from 'react'

const ProgressBar = ({ currentTime, duration, onSeek }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [hoverTime, setHoverTime] = useState(null)


    const progressRef = useRef(null);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleSeek(e)
    }

    const handleMouseMove = (e) => {
        if (!progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
        const time = (percentage / 100) * duration;
        setHoverTime(time);

        if (isDragging) {
            handleSeek(e);
        }
    }

    const handleMouseLeave = () => {
        setHoverTime(null);
        setIsDragging(false);
    }
    const handleMouseUp = () => {
        setIsDragging(false);
    }

    const handleSeek = (e) => {
        if (!progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
        const newTime = (percentage / 100) * duration;
        onSeek(newTime);
    }
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}: ${seconds.toString().padStart(2, "0")}`;
    }

    return (
        <div className='relative bg-gray-300 rounded-full'>
            <div ref={progressRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave} className="relative h-3 bg-white/10 rounded-full cursor-pointer group overflow-hidden">
                {/* Background glow effect */}
                <div className='absolute inset-0 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                {/* Progress Fill */}
                <div className='absolute left-0 top-0 h-full bg-gray-600 rounded-full transition-all duration-150 shadow-lg shadow-pink-500/50' style={{ width: `${progress}%` }} />

                {/* Hover Preview */}
                {
                    hoverTime !== null && (
                        <div className='absolute top-0 w-0.5 h-full bg-white/60 transition-all duration-150' style={{ left: `${(hoverTime / duration) * 100}%` }} />
                    )
                }

                {/* Progress Thumb */}
                <div className='absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-150 border-2 border-pink-500' style={{ left: `calc(${progress}% - 1px)` }} />

            </div>
            {/* Hover Tooltip */}
            {hoverTime !== null && (
                <div className='absolute -top-10 transform -translate-x-1/2 bg-black/80 text-white text-xsl px-2 py-1 rounded-lg backdrop-blur-sm ' style={{ left: `${(hoverTime / duration) * 100}%` }}>
                    {formatTime(hoverTime)}
                </div>
            )}
        </div>
    )
}

export default ProgressBar
