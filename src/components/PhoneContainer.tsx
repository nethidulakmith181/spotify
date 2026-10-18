import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Sparkles } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children, accentColor = '#1DB954' }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (!isMobileDevice && window.innerWidth > 640) {
      setIsPhoneFrame(true);
    }

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#060709] relative overflow-hidden flex flex-col items-center justify-center p-0 sm:p-4 text-white font-sans antialiased selection:bg-[#1DB954] selection:text-black">
      {/* Liquid Organic Floating Ambient Light Pools */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full filter blur-[120px] opacity-40 pointer-events-none animate-liquid-orb-1 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(16,185,129,0.3) 50%, transparent 70%)`,
        }}
      />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full filter blur-[140px] opacity-35 pointer-events-none animate-liquid-orb-2 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-transparent" />
      <div className="absolute top-[35%] right-[5%] w-[400px] h-[400px] rounded-full filter blur-[130px] opacity-25 pointer-events-none animate-liquid-orb-1 bg-gradient-to-br from-fuchsia-600 via-purple-700 to-transparent" />

      {/* Desktop view switcher bar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-2.5 px-4 py-2 rounded-full liquid-glass-surface text-xs text-neutral-300 z-20">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-[#1ed760]" />
          Liquid Glass • Spotify Web
        </span>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-button text-white font-medium transition cursor-pointer"
          title="Toggle phone frame simulator"
        >
          {isPhoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone View</span>
            </>
          )}
        </button>
      </div>

      {/* Liquid Glass Phone Chassis */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 relative flex flex-col z-10 ${
          isPhoneFrame
            ? 'max-w-[412px] h-[870px] max-h-[92vh] rounded-[50px] border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] backdrop-blur-3xl bg-[#0c0d12]/75'
            : 'max-w-md sm:max-w-lg md:max-w-xl h-screen sm:h-[92vh] sm:rounded-3xl sm:border sm:border-white/15 backdrop-blur-3xl bg-[#0c0d12]/80 shadow-[0_20px_70px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Dynamic Island / Liquid Glass Status Bar */}
        <div className="sticky top-0 z-40 px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-neutral-300 select-none border-b border-white/10 backdrop-blur-xl bg-white/[0.03]">
          <span className="tracking-tight">{currentTime}</span>

          {/* Liquid Glass Dynamic Capsule */}
          <div className="w-26 h-4.5 rounded-full liquid-glass-surface flex items-center justify-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-[9px] font-black tracking-widest text-white/90">SPOTIFY</span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-300">
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">100%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* Inner App Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
