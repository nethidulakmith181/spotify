import React, { useEffect, useRef } from 'react';
import { X, Mic2 } from 'lucide-react';
import { Track } from '../../types/spotify';

interface LyricsSheetProps {
  isOpen: boolean;
  track: Track | null;
  currentTime: number;
  onClose: () => void;
  onSeek: (seconds: number) => void;
}

export const LyricsSheet: React.FC<LyricsSheetProps> = ({
  isOpen,
  track,
  currentTime,
  onClose,
  onSeek,
}) => {
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lyrics = track?.lyrics || [];

  // Find active line index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smooth auto-scroll
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-3xl bg-black/75 flex flex-col justify-between select-none animate-fadeIn">
      {/* Top Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 liquid-glass-surface">
        <div className="flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-[#1ed760]" />
          <div>
            <h3 className="text-sm font-bold text-white">Lyrics</h3>
            <p className="text-xs text-neutral-300">
              Tap any line to rewind/jump instantly
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full liquid-glass-button text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth text-center"
      >
        {lyrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3">
            <Mic2 className="w-12 h-12 stroke-1" />
            <p className="text-base font-semibold">
              Lyrics are not available for this track
            </p>
            <p className="text-xs text-neutral-500">
              Enjoy the pure musical journey!
            </p>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek(line.time)}
                className={`py-2 px-4 rounded-2xl transition-all duration-300 cursor-pointer group flex items-center justify-center gap-2 ${
                  isActive
                    ? 'text-white text-xl sm:text-2xl font-black scale-105 liquid-glass-surface shadow-[0_0_20px_rgba(30,215,96,0.2)]'
                    : isPassed
                    ? 'text-neutral-500 text-lg font-medium hover:text-neutral-300'
                    : 'text-neutral-300 text-lg font-medium hover:text-white'
                }`}
              >
                <span>{line.text}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#1ed760] shadow-[0_0_8px_#1ed760] animate-ping" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom info banner */}
      <div className="px-6 py-3.5 liquid-glass-dock border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
        <span className="truncate mr-2">{track.title} • {track.artist}</span>
        <span className="text-[#1ed760] font-bold whitespace-nowrap">Synced in Real-Time</span>
      </div>
    </div>
  );
};
