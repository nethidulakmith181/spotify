import { Track, RepeatMode, EqualizerPreset, AudioSettings } from '../types/spotify';

type AudioEventListener = () => void;

class AudioEngine {
  private audio: HTMLAudioElement;
  private currentTrack: Track | null = null;
  private queue: Track[] = [];
  private history: Track[] = [];
  private repeatMode: RepeatMode = 'all';
  private isShuffled: boolean = false;
  private originalQueue: Track[] = [];
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private playbackSpeed: number = 1.0;
  private listeners: Set<AudioEventListener> = new Set();
  
  // Web Audio Equalizer nodes
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private bassNode: BiquadFilterNode | null = null;
  private midNode: BiquadFilterNode | null = null;
  private trebleNode: BiquadFilterNode | null = null;
  private wakeLock: any = null;
  private wakeLockEnabled: boolean = true;
  private activePreset: EqualizerPreset = 'bass-boost';

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.volume = this.volume;

    this.setupAudioListeners();
    this.setupMediaSession();
  }

  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.updateMediaSessionPosition();
      this.notifyListeners();
    });

    this.audio.addEventListener('play', () => {
      this.updateMediaSessionPlaybackState('playing');
      this.requestWakeLock();
      this.notifyListeners();
    });

    this.audio.addEventListener('pause', () => {
      this.updateMediaSessionPlaybackState('paused');
      this.notifyListeners();
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateMediaSessionPosition();
      this.notifyListeners();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error, attempting fallback or next track:', e);
      this.notifyListeners();
    });
  }

  private initWebAudio() {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      // 3-Band Equalizer
      this.bassNode = this.audioCtx.createBiquadFilter();
      this.bassNode.type = 'lowshelf';
      this.bassNode.frequency.value = 250; // Hz

      this.midNode = this.audioCtx.createBiquadFilter();
      this.midNode.type = 'peaking';
      this.midNode.frequency.value = 1500; // Hz
      this.midNode.Q.value = 1.0;

      this.trebleNode = this.audioCtx.createBiquadFilter();
      this.trebleNode.type = 'highshelf';
      this.trebleNode.frequency.value = 4000; // Hz

      // Connect: Source -> Bass -> Mid -> Treble -> Destination
      this.sourceNode.connect(this.bassNode);
      this.bassNode.connect(this.midNode);
      this.midNode.connect(this.trebleNode);
      this.trebleNode.connect(this.audioCtx.destination);

      this.applyEqualizerPreset(this.activePreset);
    } catch (err) {
      console.warn('Web Audio initialization bypassed:', err);
    }
  }

  public applyEqualizerPreset(preset: EqualizerPreset) {
    this.activePreset = preset;
    if (!this.bassNode || !this.midNode || !this.trebleNode) return;

    switch (preset) {
      case 'bass-boost':
        this.bassNode.gain.value = 6;
        this.midNode.gain.value = 1;
        this.trebleNode.gain.value = 2;
        break;
      case 'vocal-booster':
        this.bassNode.gain.value = -2;
        this.midNode.gain.value = 5;
        this.trebleNode.gain.value = 3;
        break;
      case 'treble-boost':
        this.bassNode.gain.value = 0;
        this.midNode.gain.value = 2;
        this.trebleNode.gain.value = 6;
        break;
      case 'acoustic':
        this.bassNode.gain.value = 3;
        this.midNode.gain.value = 3;
        this.trebleNode.gain.value = 4;
        break;
      case 'electronic':
        this.bassNode.gain.value = 5;
        this.midNode.gain.value = 0;
        this.trebleNode.gain.value = 5;
        break;
      case 'rock':
        this.bassNode.gain.value = 4;
        this.midNode.gain.value = -1;
        this.trebleNode.gain.value = 4;
        break;
      case 'flat':
      default:
        this.bassNode.gain.value = 0;
        this.midNode.gain.value = 0;
        this.trebleNode.gain.value = 0;
        break;
    }
    this.notifyListeners();
  }

  private setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => {
      this.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      this.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.previous();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.next();
    });

    // Instant 15s Rewind handler for lockscreen & Bluetooth controls!
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 15;
      this.rewind(skipTime);
    });

    // Instant 15s Forward handler for lockscreen
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 15;
      this.forward(skipTime);
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined && details.seekTime !== null) {
        this.seek(details.seekTime);
      }
    });
  }

  private updateMediaSessionMetadata(track: Track) {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: track.coverUrl, sizes: '96x96', type: 'image/jpeg' },
        { src: track.coverUrl, sizes: '128x128', type: 'image/jpeg' },
        { src: track.coverUrl, sizes: '192x192', type: 'image/jpeg' },
        { src: track.coverUrl, sizes: '256x256', type: 'image/jpeg' },
        { src: track.coverUrl, sizes: '384x384', type: 'image/jpeg' },
        { src: track.coverUrl, sizes: '512x512', type: 'image/jpeg' },
      ]
    });
  }

  private updateMediaSessionPosition() {
    if (!('mediaSession' in navigator) || !this.audio.duration || isNaN(this.audio.duration)) return;
    try {
      navigator.mediaSession.setPositionState({
        duration: this.audio.duration,
        playbackRate: this.audio.playbackRate,
        position: Math.min(this.audio.currentTime, this.audio.duration)
      });
    } catch {
      // Ignore transient position state sync errors
    }
  }

  private updateMediaSessionPlaybackState(state: 'playing' | 'paused' | 'none') {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = state;
  }

  public async requestWakeLock() {
    if (!this.wakeLockEnabled || !('wakeLock' in navigator)) return;
    try {
      if (!this.wakeLock) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      }
    } catch (err) {
      // WakeLock may be rejected in background iframe, ignore safely
    }
  }

  public releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
  }

  public setWakeLockEnabled(enabled: boolean) {
    this.wakeLockEnabled = enabled;
    if (enabled && this.isPlaying()) {
      this.requestWakeLock();
    } else {
      this.releaseWakeLock();
    }
  }

  // Core Playback API
  public async playTrack(track: Track, newQueue?: Track[]) {
    this.initWebAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    if (newQueue) {
      this.originalQueue = [...newQueue];
      this.queue = this.isShuffled ? this.shuffleArray([...newQueue]) : [...newQueue];
    }

    if (this.currentTrack) {
      this.history.push(this.currentTrack);
    }

    this.currentTrack = track;
    this.audio.src = track.audioUrl;
    this.audio.playbackRate = this.playbackSpeed;
    this.updateMediaSessionMetadata(track);

    try {
      await this.audio.play();
    } catch (err) {
      console.warn('Autoplay may have been blocked or file loading:', err);
    }
    this.notifyListeners();
  }

  public async play() {
    this.initWebAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    if (!this.audio.src && this.currentTrack) {
      this.audio.src = this.currentTrack.audioUrl;
    }
    try {
      await this.audio.play();
    } catch (err) {
      console.warn('Play interrupted:', err);
    }
    this.notifyListeners();
  }

  public pause() {
    this.audio.pause();
    this.notifyListeners();
  }

  public togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  // REWIND FUNCTIONALITY: Rewind by N seconds (Default 15s)
  public rewind(seconds: number = 15) {
    const newTime = Math.max(0, this.audio.currentTime - seconds);
    this.audio.currentTime = newTime;
    this.updateMediaSessionPosition();
    this.notifyListeners();
  }

  // FAST-FORWARD FUNCTIONALITY: Skip forward by N seconds (Default 15s)
  public forward(seconds: number = 15) {
    const maxDuration = this.getDuration();
    const newTime = Math.min(maxDuration, this.audio.currentTime + seconds);
    this.audio.currentTime = newTime;
    this.updateMediaSessionPosition();
    this.notifyListeners();
  }

  // Smooth Scrubber Seeking
  public seek(seconds: number) {
    const maxDuration = this.getDuration();
    const boundedTime = Math.max(0, Math.min(maxDuration, seconds));
    this.audio.currentTime = boundedTime;
    this.updateMediaSessionPosition();
    this.notifyListeners();
  }

  public next() {
    if (this.repeatMode === 'one' && this.currentTrack) {
      this.audio.currentTime = 0;
      this.play();
      return;
    }

    if (this.queue.length > 0) {
      const currentIndex = this.queue.findIndex(t => t.id === this.currentTrack?.id);
      if (currentIndex !== -1 && currentIndex < this.queue.length - 1) {
        this.playTrack(this.queue[currentIndex + 1]);
        return;
      } else if (this.repeatMode === 'all' && this.queue.length > 0) {
        this.playTrack(this.queue[0]);
        return;
      }
    }

    // Default: restart current song
    this.audio.currentTime = 0;
    this.play();
  }

  public previous() {
    // If we are more than 3 seconds in, previous rewinds to start of current song!
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      this.notifyListeners();
      return;
    }

    if (this.history.length > 0) {
      const prev = this.history.pop()!;
      this.playTrack(prev);
      return;
    }

    if (this.queue.length > 0) {
      const currentIndex = this.queue.findIndex(t => t.id === this.currentTrack?.id);
      if (currentIndex > 0) {
        this.playTrack(this.queue[currentIndex - 1]);
        return;
      }
    }

    this.audio.currentTime = 0;
    this.notifyListeners();
  }

  private handleTrackEnded() {
    if (this.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.next();
    }
  }

  public toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    if (this.isShuffled) {
      this.queue = this.shuffleArray([...this.originalQueue]);
    } else {
      this.queue = [...this.originalQueue];
    }
    this.notifyListeners();
  }

  public cycleRepeatMode() {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all';
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else {
      this.repeatMode = 'off';
    }
    this.notifyListeners();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.volume;
    this.notifyListeners();
  }

  public setPlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
    this.audio.playbackRate = speed;
    this.notifyListeners();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Getters
  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  public isPlaying(): boolean {
    return !this.audio.paused;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  public getDuration(): number {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      return this.audio.duration;
    }
    return this.currentTrack?.duration || 180;
  }

  public getQueue(): Track[] {
    return this.queue;
  }

  public getRepeatMode(): RepeatMode {
    return this.repeatMode;
  }

  public getIsShuffled(): boolean {
    return this.isShuffled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  public getEqualizerPreset(): EqualizerPreset {
    return this.activePreset;
  }

  // Subscriptions
  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('AudioEngine listener error:', err);
      }
    });
  }
}

export const audioEngine = new AudioEngine();
