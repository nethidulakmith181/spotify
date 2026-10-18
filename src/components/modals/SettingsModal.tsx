import React, { useState } from 'react';
import { X, Sliders, ShieldCheck, Moon, Download, Radio, Check } from 'lucide-react';
import { EqualizerPreset } from '../../types/spotify';
import { audioEngine } from '../../services/audioEngine';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLockscreenSimulator: () => void;
  onOpenApkModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenLockscreenSimulator,
  onOpenApkModal,
}) => {
  const [eqPreset, setEqPreset] = useState<EqualizerPreset>(audioEngine.getEqualizerPreset());
  const [quality, setQuality] = useState<'normal' | 'high' | 'ultra'>('ultra');
  const [wakeLock, setWakeLock] = useState<boolean>(true);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (!isOpen) return null;

  const handleEqChange = (preset: EqualizerPreset) => {
    setEqPreset(preset);
    audioEngine.applyEqualizerPreset(preset);
  };

  const handleWakeLockToggle = (enabled: boolean) => {
    setWakeLock(enabled);
    audioEngine.setWakeLockEnabled(enabled);
  };

  const handleSleepTimer = (minutes: number | null) => {
    setSleepTimer(minutes);
    if (minutes) {
      setTimeout(() => {
        audioEngine.pause();
        setSleepTimer(null);
      }, minutes * 60 * 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-sm liquid-glass-surface rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#1ed760]" />
            <h3 className="text-base font-bold text-white">Playback Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Background Playback & Lockscreen */}
          <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Background Audio
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full liquid-glass-surface text-[#1ed760] font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              Music continues playing in background when screen turns off. Lock screen controls are active.
            </p>

            <button
              onClick={() => {
                onClose();
                onOpenLockscreenSimulator();
              }}
              className="w-full py-2.5 rounded-xl liquid-glass-button text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 text-[#1ed760]" />
              <span>Test Phone Lock Screen</span>
            </button>
          </div>

          {/* Equalizer Presets */}
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Sound Equalizer Presets
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'bass-boost', label: 'Bass Boost (+6dB)' },
                  { id: 'vocal-booster', label: 'Vocal Clarity' },
                  { id: 'electronic', label: 'Electronic / EDM' },
                  { id: 'acoustic', label: 'Acoustic / Warm' },
                  { id: 'rock', label: 'Rock & Driving' },
                  { id: 'flat', label: 'Flat (Studio Neutral)' },
                ] as const
              ).map((preset) => {
                const isActive = eqPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleEqChange(preset.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'liquid-glass-primary text-black font-extrabold shadow-sm'
                        : 'liquid-glass-button text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isActive && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Quality */}
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Streaming Audio Quality
            </h4>
            <div className="flex gap-2">
              {(
                [
                  { id: 'normal', label: 'Normal' },
                  { id: 'high', label: 'High' },
                  { id: 'ultra', label: 'Very High (320k)' },
                ] as const
              ).map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id)}
                  className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    quality === q.id
                      ? 'liquid-glass-primary text-black font-extrabold'
                      : 'liquid-glass-button text-neutral-300 hover:text-white'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wake Lock */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl liquid-glass-surface">
            <div>
              <h5 className="text-xs font-bold text-white">Keep Screen Awake</h5>
              <p className="text-[11px] text-neutral-300">
                Prevents phone display from sleeping while listening
              </p>
            </div>
            <input
              type="checkbox"
              checked={wakeLock}
              onChange={(e) => handleWakeLockToggle(e.target.checked)}
              className="w-5 h-5 accent-[#1ed760] cursor-pointer"
            />
          </div>

          {/* Sleep Timer */}
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              <span>Sleep Timer</span>
            </h4>
            <div className="flex gap-1.5">
              {[null, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins === null ? 'off' : mins}
                  onClick={() => handleSleepTimer(mins)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    sleepTimer === mins
                      ? 'bg-purple-600 text-white font-bold'
                      : 'liquid-glass-button text-neutral-300 hover:text-white'
                  }`}
                >
                  {mins === null ? 'Off' : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Android APK Download Option */}
          <button
            onClick={() => {
              onClose();
              onOpenApkModal();
            }}
            className="w-full py-2.5 rounded-2xl liquid-glass-primary text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Android APK (.apk)</span>
          </button>

          {/* PWA In-App Install */}
          {isInstallable && (
            <button
              onClick={install}
              className="w-full py-2.5 rounded-2xl liquid-glass-button text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5] text-emerald-400" />
              <span>1-Tap Install to Home Screen</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="w-full py-2.5 rounded-2xl liquid-glass-button text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>How to Install on iPhone / iPad</span>
            </button>
          )}

          {showIOSGuide && (
            <div className="p-3.5 rounded-2xl liquid-glass-surface space-y-2 text-xs text-neutral-300">
              <h5 className="font-bold text-white">Add to Home Screen on Safari:</h5>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-300">
                <li>Tap the <strong>Share</strong> button at bottom of Safari.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong>.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
