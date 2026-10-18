import { useState, useEffect } from 'react';
import { audioEngine } from '../services/audioEngine';
import { Track, RepeatMode, EqualizerPreset } from '../types/spotify';

export function useAudioPlayer() {
  const [track, setTrack] = useState<Track | null>(audioEngine.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(audioEngine.isPlaying());
  const [currentTime, setCurrentTime] = useState<number>(audioEngine.getCurrentTime());
  const [duration, setDuration] = useState<number>(audioEngine.getDuration());
  const [queue, setQueue] = useState<Track[]>(audioEngine.getQueue());
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(audioEngine.getRepeatMode());
  const [isShuffled, setIsShuffled] = useState<boolean>(audioEngine.getIsShuffled());
  const [volume, setVolumeState] = useState<number>(audioEngine.getVolume());
  const [playbackSpeed, setSpeedState] = useState<number>(audioEngine.getPlaybackSpeed());
  const [equalizerPreset, setEqState] = useState<EqualizerPreset>(audioEngine.getEqualizerPreset());

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(() => {
      setTrack(audioEngine.getCurrentTrack());
      setIsPlaying(audioEngine.isPlaying());
      setCurrentTime(audioEngine.getCurrentTime());
      setDuration(audioEngine.getDuration());
      setQueue(audioEngine.getQueue());
      setRepeatMode(audioEngine.getRepeatMode());
      setIsShuffled(audioEngine.getIsShuffled());
      setVolumeState(audioEngine.getVolume());
      setSpeedState(audioEngine.getPlaybackSpeed());
      setEqState(audioEngine.getEqualizerPreset());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    track,
    isPlaying,
    currentTime,
    duration,
    queue,
    repeatMode,
    isShuffled,
    volume,
    playbackSpeed,
    equalizerPreset,
    playTrack: (t: Track, q?: Track[]) => audioEngine.playTrack(t, q),
    play: () => audioEngine.play(),
    pause: () => audioEngine.pause(),
    togglePlay: () => audioEngine.togglePlay(),
    rewind: (seconds: number = 15) => audioEngine.rewind(seconds),
    forward: (seconds: number = 15) => audioEngine.forward(seconds),
    seek: (seconds: number) => audioEngine.seek(seconds),
    next: () => audioEngine.next(),
    previous: () => audioEngine.previous(),
    toggleShuffle: () => audioEngine.toggleShuffle(),
    cycleRepeatMode: () => audioEngine.cycleRepeatMode(),
    setVolume: (v: number) => audioEngine.setVolume(v),
    setPlaybackSpeed: (s: number) => audioEngine.setPlaybackSpeed(s),
    applyEqualizerPreset: (p: EqualizerPreset) => audioEngine.applyEqualizerPreset(p),
  };
}
