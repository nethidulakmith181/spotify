import React, { useState } from 'react';
import { X, Download, Smartphone, CheckCircle, ShieldCheck, QrCode, Sparkles, ExternalLink, ArrowRight, Share2, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [showQR, setShowQR] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}&color=1DB954&bgcolor=121212`;

  const handleDownloadApkFile = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/download/spotify-liquid-player.apk';
    link.setAttribute('download', 'Spotify-Liquid-Player.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      // If prompt not yet available, scroll to manual guide
      const el = document.getElementById('manual-install-guide');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-3xl flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-sm liquid-glass-surface rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full liquid-glass-primary flex items-center justify-center text-black font-black">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Install Full App on Phone
              </h3>
              <p className="text-[11px] text-neutral-300">
                Home screen icon • Rewind & No ads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Main Direct 1-Tap Install Hero */}
          <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#1ed760] text-black">
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span className="text-xs font-bold text-white">
                  Official Android & iPhone App
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1ed760] text-black font-black">
                FULL APP
              </span>
            </div>

            <p className="text-xs text-neutral-200 leading-relaxed">
              Installs directly onto your phone screen with the Spotify icon, background lock screen controls, and instant music rewind.
            </p>

            {/* Direct Native Install Button */}
            <button
              onClick={handleDirectInstall}
              className="w-full py-3 rounded-2xl liquid-glass-primary text-black font-black text-xs uppercase tracking-wider transition shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>{isInstalled ? 'App Already Installed!' : 'Install Full App Now'}</span>
            </button>

            {isInstalled && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
                <CheckCircle className="w-4 h-4" />
                <span>Installed on your phone home screen!</span>
              </div>
            )}
          </div>

          {/* Android Chrome 2-Click Method (Guaranteed 100% Working) */}
          <div id="manual-install-guide" className="p-4 rounded-2xl liquid-glass-surface space-y-3 border border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
                <span>How to Install on Android in 5 Seconds:</span>
              </h4>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.04]">
                <span className="w-5 h-5 rounded-full liquid-glass-button text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="leading-tight">
                  <p className="font-semibold text-white">Tap the 3 dots menu (⋮)</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">In Chrome or your phone's browser at the top right</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.04]">
                <span className="w-5 h-5 rounded-full liquid-glass-button text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="leading-tight">
                  <p className="font-semibold text-white">Tap "Install app" or "Add to Home screen"</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Android compiles and installs the app natively</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.04]">
                <span className="w-5 h-5 rounded-full liquid-glass-button text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="leading-tight">
                  <p className="font-semibold text-white">Tap "Install"</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">The full Spotify app icon appears on your home screen!</p>
                </div>
              </div>
            </div>
          </div>

          {/* iPhone / Safari Instructions if on iOS */}
          {isIOS && (
            <div className="p-3.5 rounded-2xl liquid-glass-surface space-y-2 text-xs text-neutral-300 border border-white/10">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>On iPhone / iPad (Safari):</span>
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-300">
                <li>Tap the <strong>Share</strong> button at bottom of Safari.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong>.</li>
              </ol>
            </div>
          )}

          {/* QR Code for Phone Access */}
          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#1ed760]" />
                <span>Open on Phone via QR</span>
              </span>
              <button
                onClick={() => setShowQR(!showQR)}
                className="text-[11px] text-emerald-300 font-semibold hover:underline cursor-pointer"
              >
                {showQR ? 'Hide' : 'Show QR Code'}
              </button>
            </div>

            {showQR && (
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/60 border border-white/10 animate-fadeIn">
                <img
                  src={qrCodeUrl}
                  alt="App URL QR Code"
                  className="w-36 h-36 rounded-lg shadow-md"
                />
                <p className="text-[10px] text-neutral-400 text-center">
                  Scan with your phone's camera to open and install the full app directly on your phone!
                </p>
              </div>
            )}
          </div>

          {/* Fallback APK File Download Link */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-neutral-300">Download raw .apk file</p>
              <p className="text-[10px] text-neutral-400">Spotify-Liquid-Player.apk</p>
            </div>
            <button
              onClick={handleDownloadApkFile}
              className="px-3 py-1.5 rounded-xl liquid-glass-button text-xs text-white font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3 text-[#1ed760]" />
              <span>{downloadStarted ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
