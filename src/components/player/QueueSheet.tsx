import React from 'react';
import { X, ListMusic, Play, Disc } from 'lucide-react';
import { Track } from '../../types/spotify';

interface QueueSheetProps {
  isOpen: boolean;
  currentTrack: Track | null;
  queue: Track[];
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
}

export const QueueSheet: React.FC<QueueSheetProps> = ({
  isOpen,
  currentTrack,
  queue,
  onClose,
  onPlayTrack,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-xl flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-[#1DB954]" />
          <div>
            <h3 className="text-sm font-bold text-white">Play Queue</h3>
            <p className="text-xs text-neutral-400">
              {queue.length} track{queue.length === 1 ? '' : 's'} queued
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Queue Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Now Playing */}
        {currentTrack && (
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Now Playing
            </h4>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/5">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-bold text-[#1DB954] truncate">
                  {currentTrack.title}
                </h5>
                <p className="text-xs text-neutral-300 truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <Disc className="w-5 h-5 text-[#1DB954] animate-spin" />
            </div>
          </div>
        )}

        {/* Up Next */}
        <div>
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Next Up
          </h4>
          {queue.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">
              No more tracks in queue
            </p>
          ) : (
            <div className="space-y-1">
              {queue.map((track, i) => {
                const isCurrent = track.id === currentTrack?.id;
                return (
                  <div
                    key={`${track.id}-${i}`}
                    onClick={() => onPlayTrack(track)}
                    className={`flex items-center gap-3 p-2 rounded-xl transition cursor-pointer hover:bg-white/10 ${
                      isCurrent ? 'bg-white/5' : ''
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-500 w-4 text-center">
                      {i + 1}
                    </span>
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurrent ? 'text-[#1DB954]' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                    <Play className="w-4 h-4 text-neutral-400 hover:text-white" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
