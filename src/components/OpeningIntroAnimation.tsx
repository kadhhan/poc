import React, { useState, useEffect } from 'react';
import { FastForward, Compass, Zap } from 'lucide-react';

interface OpeningIntroAnimationProps {
  onComplete: () => void;
}

export const OpeningIntroAnimation: React.FC<OpeningIntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'entering' | 'revealing' | 'exiting'>('entering');

  useEffect(() => {
    // Phase 1: Vehicles moving, map routes lighting up (0s - 2.0s)
    const revealTimer = setTimeout(() => {
      setPhase('revealing');
    }, 1800);

    // Phase 2: Start exiting at 5.2s
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 5200);

    // Phase 3: Fully complete at 5.9s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5900);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase('exiting');
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#030712] select-none transition-all duration-700 ease-out ${
        phase === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Opening Animation - HMD Global Shipments"
    >
      {/* Skip Button - Cyber Neon Glass */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={handleSkip}
          className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-semibold tracking-wider backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-400" />
          <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef] animate-ping inline-block"></span>
        </button>
      </div>

      {/* --- BACKGROUND: Cyber Neon Dark Matrix & Starfield --- */}
      <div className="absolute inset-0 bg-radial from-[#0d122b] via-[#050819] to-[#02040a]">
        {/* Neon Light Flares in Background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-fuchsia-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        {/* Neon Star Points (Cyan, Pink, Emerald) */}
        <div className="absolute inset-0 opacity-70">
          {[...Array(50)].map((_, i) => {
            const neonColors = ['#00f5ff', '#ff007f', '#00ff88', '#a855f7', '#38bdf8'];
            const color = neonColors[i % neonColors.length];
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: `${(i * 17) % 94}%`,
                  left: `${(i * 29) % 98}%`,
                  width: `${(i % 3) + 1.5}px`,
                  height: `${(i % 3) + 1.5}px`,
                  backgroundColor: color,
                  boxShadow: `0 0 ${(i % 3) * 4 + 4}px ${color}`,
                  animation: `pulse ${(i % 3) + 2}s infinite ease-in-out ${(i % 4) * 0.4}s`,
                }}
              />
            );
          })}
        </div>

        {/* Perspective Cyber Grid (Lower Ground Floor) */}
        <div
          className="absolute inset-x-0 bottom-0 h-64 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 245, 255, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 0, 127, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* --- GLOBAL VECTOR MAP WITH NEON TRADE ROUTES --- */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none">
        <svg
          viewBox="0 0 1000 500"
          className="w-[125vw] max-w-none h-auto md:w-full md:max-w-6xl"
          fill="none"
        >
          <defs>
            {/* Neon Glow Filters */}
            <filter id="neonGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="neonGlowMagenta" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Neon Linear Gradients */}
            <linearGradient id="neonArc1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="50%" stopColor="#ff007f" />
              <stop offset="100%" stopColor="#00ff88" />
            </linearGradient>

            <linearGradient id="neonArc2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff007f" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#00f5ff" />
            </linearGradient>

            <linearGradient id="neonArc3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#ffe600" />
            </linearGradient>
          </defs>

          {/* Latitude/Longitude Matrix */}
          <line x1="50" y1="250" x2="950" y2="250" stroke="rgba(0, 245, 255, 0.2)" strokeDasharray="3 6" />
          <line x1="50" y1="150" x2="950" y2="150" stroke="rgba(255, 0, 127, 0.15)" strokeDasharray="3 6" />
          <line x1="50" y1="350" x2="950" y2="350" stroke="rgba(0, 255, 136, 0.15)" strokeDasharray="3 6" />

          {/* Continents Outline Path (Stylized Neon Map) */}
          {/* Americas */}
          <path
            d="M 180 120 Q 210 130 220 180 Q 240 240 270 260 Q 250 280 240 330 Q 250 420 280 430 Q 300 410 300 350 Q 290 280 260 250 Q 250 210 280 160 Q 270 110 210 90 Z"
            fill="rgba(0, 245, 255, 0.04)"
            stroke="#00f5ff"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            filter="url(#neonGlowCyan)"
          />
          {/* Europe & Africa */}
          <path
            d="M 460 110 Q 520 100 540 140 Q 560 190 510 200 Q 530 260 550 330 Q 540 400 480 390 Q 450 310 440 240 Q 420 180 460 110 Z"
            fill="rgba(255, 0, 127, 0.04)"
            stroke="#ff007f"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            filter="url(#neonGlowMagenta)"
          />
          {/* Asia & Australia */}
          <path
            d="M 580 90 Q 730 80 820 130 Q 860 200 790 240 Q 750 280 730 230 Q 670 230 630 180 Q 580 160 580 90 Z"
            fill="rgba(0, 255, 136, 0.04)"
            stroke="#00ff88"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          <path
            d="M 750 320 Q 820 310 840 360 Q 820 410 760 390 Q 730 350 750 320 Z"
            fill="rgba(0, 245, 255, 0.04)"
            stroke="#00f5ff"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />

          {/* Glowing Animated Neon Shipping Arcs */}
          {/* Transpacific Neon Arc */}
          <path
            d="M 230 170 Q 500 40 780 170"
            stroke="url(#neonArc1)"
            strokeWidth="2.8"
            strokeDasharray="600"
            strokeDashoffset="600"
            className="animate-[dash_3.2s_ease-out_forwards]"
            filter="url(#neonGlowCyan)"
          />
          {/* Transatlantic Neon Arc */}
          <path
            d="M 260 170 Q 370 110 480 140"
            stroke="url(#neonArc2)"
            strokeWidth="2.8"
            strokeDasharray="400"
            strokeDashoffset="400"
            className="animate-[dash_2.8s_ease-out_forwards_0.4s]"
            filter="url(#neonGlowMagenta)"
          />
          {/* Europe to Middle East to Asia */}
          <path
            d="M 480 140 Q 560 190 650 220 Q 740 240 780 180"
            stroke="url(#neonArc1)"
            strokeWidth="3"
            strokeDasharray="500"
            strokeDashoffset="500"
            className="animate-[dash_3.5s_ease-out_forwards_0.7s]"
            filter="url(#neonGlowCyan)"
          />
          {/* South America to Africa to Asia Route */}
          <path
            d="M 280 340 Q 420 310 540 330 Q 660 320 780 360"
            stroke="url(#neonArc3)"
            strokeWidth="2.5"
            strokeDasharray="550"
            strokeDashoffset="550"
            className="animate-[dash_3.2s_ease-out_forwards_1s]"
          />

          {/* Pulsing Neon Hub Nodes (New York, London, Dubai, Jeddah, Mumbai, Singapore, Shanghai, Tokyo, Sydney) */}
          {[
            { cx: 230, cy: 170, color: '#00f5ff' },
            { cx: 280, cy: 340, color: '#ff007f' },
            { cx: 480, cy: 140, color: '#00f5ff' },
            { cx: 560, cy: 200, color: '#ffe600' },
            { cx: 640, cy: 220, color: '#00ff88' },
            { cx: 720, cy: 260, color: '#ff007f' },
            { cx: 780, cy: 170, color: '#00f5ff' },
            { cx: 810, cy: 160, color: '#a855f7' },
            { cx: 780, cy: 360, color: '#00ff88' },
          ].map((hub, idx) => (
            <g key={idx}>
              <circle
                cx={hub.cx}
                cy={hub.cy}
                r="6"
                fill={hub.color}
                opacity="0.5"
                className="animate-ping"
              />
              <circle
                cx={hub.cx}
                cy={hub.cy}
                r="3.5"
                fill="#FFFFFF"
                stroke={hub.color}
                strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 6px ${hub.color})` }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* --- CARGO AIRPLANE: Neon Cyber Jet with Intense Glowing Dual Trails --- */}
      <div
        className="absolute top-[18%] left-0 w-full pointer-events-none"
        style={{
          animation: 'planeFlight 5.5s cubic-bezier(0.2, 0.7, 0.4, 1) forwards',
        }}
      >
        <div className="relative inline-block">
          {/* Intense Neon Dual-Stream Contrails */}
          {/* Cyan Primary Trail */}
          <div
            className="absolute top-[20px] right-[45px] w-80 h-[3px] bg-gradient-to-l from-cyan-300 via-cyan-500 to-transparent blur-[1px] transform -rotate-1 origin-right"
            style={{
              boxShadow: '0 0 16px #00f5ff, 0 0 30px #00f5ff',
            }}
          />
          {/* Magenta Secondary Afterburner Trail */}
          <div
            className="absolute top-[26px] right-[40px] w-64 h-[2px] bg-gradient-to-l from-fuchsia-400 via-pink-500 to-transparent blur-[1px] transform rotate-1 origin-right"
            style={{
              boxShadow: '0 0 12px #ff007f, 0 0 24px #ff007f',
            }}
          />

          {/* Neon Cargo Aircraft Vector */}
          <svg
            viewBox="0 0 140 60"
            className="w-24 sm:w-36 h-auto drop-shadow-[0_0_20px_#00f5ff]"
            fill="none"
          >
            {/* Aerodynamic Fuselage with Neon Edge */}
            <path
              d="M 125 28 C 115 22, 90 22, 60 23 C 30 24, 15 25, 5 28 C 15 31, 30 32, 60 33 C 90 34, 115 34, 125 28 Z"
              fill="#0F172A"
              stroke="#00f5ff"
              strokeWidth="1.5"
            />
            {/* Glowing Cockpit Visor */}
            <path d="M 116 25 Q 124 28 116 30 Z" fill="#00f5ff" />
            {/* Neon Cyber Wings */}
            <polygon
              points="75,26 40,5 50,5 85,26"
              fill="#1E293B"
              stroke="#ff007f"
              strokeWidth="1.2"
            />
            <polygon
              points="70,30 35,52 45,52 80,30"
              fill="#1E293B"
              stroke="#00ff88"
              strokeWidth="1.2"
            />
            {/* Tail Fin */}
            <polygon points="12,26 0,6 10,6 24,26" fill="#0F172A" stroke="#00f5ff" strokeWidth="1.2" />
            {/* Jet Engines with Neon Thrusters */}
            <rect x="62" y="14" width="16" height="6" rx="2" fill="#0284C7" stroke="#00f5ff" />
            <rect x="58" y="38" width="16" height="6" rx="2" fill="#0284C7" stroke="#00f5ff" />
            <circle cx="62" cy="17" r="2" fill="#ff007f" />
            <circle cx="58" cy="41" r="2" fill="#ff007f" />

            {/* Neon Wingtip Strobes */}
            <circle cx="42" cy="5" r="2.5" fill="#ff0055" className="animate-ping" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />
            <circle cx="37" cy="52" r="2.5" fill="#00ff88" className="animate-ping" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
          </svg>
        </div>
      </div>

      {/* --- OCEAN & CONTAINER SHIP: Glowing Neon Ocean Horizon --- */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none overflow-hidden">
        {/* Neon Horizon Laser Line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] shadow-[0_0_15px_#00f5ff]" />

        {/* Neon Container Vessel */}
        <div
          className="absolute bottom-9 left-0 z-10"
          style={{
            animation: 'shipSailing 6.2s cubic-bezier(0.2, 0.6, 0.4, 1) forwards',
          }}
        >
          <div className="relative">
            {/* Glowing Neon Bow Wave Splash */}
            <div className="absolute -right-4 bottom-2 w-10 h-4 bg-cyan-400/60 blur-xs rounded-full animate-pulse shadow-[0_0_12px_#00f5ff]" />

            {/* Vessel Vector with Vibrant Neon Containers */}
            <svg
              viewBox="0 0 240 80"
              className="w-52 sm:w-72 h-auto drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]"
              fill="none"
            >
              {/* Ship Hull (Obsidian Cyber Hull with Neon Cyan Outline) */}
              <path
                d="M 10 50 L 25 66 L 205 66 L 230 50 Z"
                fill="#0A0F1D"
                stroke="#00f5ff"
                strokeWidth="1.8"
              />
              {/* Neon Waterline (Hot Magenta) */}
              <path d="M 25 63 L 30 67 L 200 67 L 210 63 Z" fill="#ff007f" />

              {/* Stacked Shipping Containers with Vivid Neon Color Blocks & Glowing Outlines */}
              {/* Tier 1 (Base Containers) */}
              <rect x="40" y="38" width="22" height="11" rx="1" fill="#0369A1" stroke="#00f5ff" strokeWidth="1.2" />
              <rect x="64" y="38" width="22" height="11" rx="1" fill="#047857" stroke="#00ff88" strokeWidth="1.2" />
              <rect x="88" y="38" width="22" height="11" rx="1" fill="#BE123C" stroke="#ff007f" strokeWidth="1.2" />
              <rect x="112" y="38" width="22" height="11" rx="1" fill="#B45309" stroke="#ffe600" strokeWidth="1.2" />
              <rect x="136" y="38" width="22" height="11" rx="1" fill="#6D28D9" stroke="#c084fc" strokeWidth="1.2" />
              <rect x="160" y="38" width="22" height="11" rx="1" fill="#0369A1" stroke="#00f5ff" strokeWidth="1.2" />

              {/* Tier 2 (Middle Tier) */}
              <rect x="42" y="27" width="22" height="11" rx="1" fill="#BE123C" stroke="#ff007f" strokeWidth="1.2" />
              <rect x="66" y="27" width="22" height="11" rx="1" fill="#0369A1" stroke="#00f5ff" strokeWidth="1.2" />
              <rect x="90" y="27" width="22" height="11" rx="1" fill="#047857" stroke="#00ff88" strokeWidth="1.2" />
              <rect x="114" y="27" width="22" height="11" rx="1" fill="#6D28D9" stroke="#c084fc" strokeWidth="1.2" />
              <rect x="138" y="27" width="22" height="11" rx="1" fill="#B45309" stroke="#ffe600" strokeWidth="1.2" />

              {/* Tier 3 (Top Tier) */}
              <rect x="68" y="16" width="22" height="11" rx="1" fill="#B45309" stroke="#ffe600" strokeWidth="1.2" />
              <rect x="92" y="16" width="22" height="11" rx="1" fill="#0369A1" stroke="#00f5ff" strokeWidth="1.2" />
              <rect x="116" y="16" width="22" height="11" rx="1" fill="#047857" stroke="#00ff88" strokeWidth="1.2" />

              {/* Superstructure Bridge with Neon Lights */}
              <rect x="180" y="20" width="24" height="30" rx="1" fill="#0F172A" stroke="#00f5ff" strokeWidth="1.5" />
              <rect x="183" y="24" width="18" height="4" fill="#00f5ff" style={{ filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
              {/* Radar Mast & Pulsing Neon Scanner */}
              <line x1="192" y1="20" x2="192" y2="10" stroke="#00f5ff" strokeWidth="2" />
              <circle cx="192" cy="10" r="3" fill="#ff007f" className="animate-ping" style={{ filter: 'drop-shadow(0 0 8px #ff007f)' }} />
              {/* Funnel */}
              <rect x="175" y="24" width="6" height="14" fill="#0F172A" stroke="#ff007f" strokeWidth="1" />
            </svg>

            {/* Glowing Neon Wake Trailing Behind the Vessel */}
            <div className="absolute top-[52px] -left-36 w-36 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-cyan-300 blur-[1px] shadow-[0_0_12px_#00f5ff]" />
          </div>
        </div>

        {/* Layer: Animated Neon Waves with Glowing Electric Crests */}
        <div className="absolute inset-x-0 bottom-0 h-28 overflow-hidden z-20">
          {/* Back Wave (Deep Purple Neon) */}
          <svg
            className="absolute bottom-0 w-[200%] h-20 text-[#12072b]/95 animate-[wave_12s_linear_infinite]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 40 Q 150 20 300 40 T 600 40 T 900 40 T 1200 40 V 120 H 0 Z"
              fill="currentColor"
            />
          </svg>

          {/* Middle Wave (Electric Magenta & Cyan Rim) */}
          <svg
            className="absolute bottom-0 w-[200%] h-16 text-[#071933]/95 animate-[wave_8s_linear_infinite_reverse]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 50 Q 150 70 300 50 T 600 50 T 900 50 T 1200 50 V 120 H 0 Z"
              fill="currentColor"
            />
          </svg>

          {/* Forefront Wave with Neon Laser Rim */}
          <svg
            className="absolute bottom-0 w-[200%] h-12 text-[#020b18] animate-[wave_5s_linear_infinite]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 60 Q 150 40 300 60 T 600 60 T 900 60 T 1200 60 V 120 H 0 Z"
              fill="currentColor"
            />
          </svg>

          {/* Neon Water Reflection Bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-emerald-400 blur-xs opacity-70" />
        </div>
      </div>

      {/* --- CENTER BRANDING REVEAL: "HMD global shipments" IN ELECTRIC NEON --- */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <div
          className={`text-center max-w-4xl transform transition-all duration-1000 ease-out ${
            phase === 'entering'
              ? 'opacity-0 translate-y-6 scale-95 blur-xs'
              : 'opacity-100 translate-y-0 scale-100 blur-0'
          }`}
        >
          {/* Neon Emblem Icon */}
          <div className="inline-flex items-center justify-center mb-5 relative">
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-emerald-400 p-[2px] shadow-[0_0_50px_rgba(0,245,255,0.8),0_0_80px_rgba(255,0,127,0.4)]">
              <div className="w-full h-full bg-[#050914] rounded-2xl flex items-center justify-center border border-cyan-400/40">
                <Compass className="w-9 h-9 sm:w-12 sm:h-12 text-cyan-300 animate-[spin_20s_linear_infinite] drop-shadow-[0_0_12px_#00f5ff]" />
              </div>
            </div>
            {/* Pulsing Neon Halo Rings */}
            <div className="absolute -inset-2 rounded-2xl bg-cyan-400/20 blur-xl -z-10 animate-pulse"></div>
            <div className="absolute -inset-4 rounded-3xl bg-fuchsia-500/15 blur-2xl -z-10"></div>
          </div>

          {/* Brand Name: "HMD global shipments" with Neon Tube Light Glow */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-3">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-fuchsia-200 to-pink-400"
              style={{
                textShadow:
                  '0 0 15px rgba(0, 245, 255, 0.9), 0 0 35px rgba(0, 245, 255, 0.6), 0 0 60px rgba(255, 0, 127, 0.5)',
              }}
            >
              HMD global shipments
            </span>
          </h1>

          {/* Neon Laser Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-[2px] w-16 sm:w-32 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-300 shadow-[0_0_10px_#00f5ff]"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-fuchsia-400 shadow-[0_0_12px_#ff007f]"></div>
            <div className="h-[2px] w-16 sm:w-32 bg-gradient-to-l from-transparent via-fuchsia-400 to-fuchsia-300 shadow-[0_0_10px_#ff007f]"></div>
          </div>

          {/* Official Tagline with Neon White/Cyan Glow */}
          <p
            className="text-base sm:text-xl md:text-2xl font-light text-cyan-100 tracking-wide"
            style={{
              textShadow: '0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.4)',
            }}
          >
            Connecting the World, One Shipment at a Time.
          </p>

          {/* Neon Badging Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.4)]">
              ⚡ Air Cargo
            </span>
            <span className="px-3 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-400/80 text-fuchsia-300 shadow-[0_0_12px_rgba(255,0,127,0.4)]">
              ⚓ Ocean Freight
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/80 text-emerald-300 shadow-[0_0_12px_rgba(0,255,136,0.4)]">
              🌐 Global Tracking
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Keyframe Styles for ultra-smooth 60fps animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes planeFlight {
          0% {
            transform: translate(-15vw, 4vh) rotate(-3deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(110vw, -8vh) rotate(4deg);
            opacity: 0;
          }
        }
        @keyframes shipSailing {
          0% {
            transform: translateX(-20vw);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(105vw);
            opacity: 0.9;
          }
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
