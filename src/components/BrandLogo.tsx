import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  onClick?: () => void;
  showGlow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 70,
  onClick,
  showGlow = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/csb-logo.jpg');

  const handleImageError = () => {
    if (imgSrc === '/csb-logo.jpg') {
      // Primary online mirror from the user's ibb link
      setImgSrc('https://i.ibb.co/TD9fRgHH/photo-2026-08-03-16-16-34.jpg');
    } else if (imgSrc.indexOf('TD9fRgHH') !== -1) {
      // Secondary online mirror
      setImgSrc('https://i.ibb.co/qLTS9rRR/photo-2026-08-03-16-16-34.jpg');
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center rounded-full shrink-0 select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      title="সাইবার সেন্টিনেল বাংলাদেশ অফিসিয়াল রিং লোগো"
    >
      {/* Outer cyber glow aura */}
      {showGlow && (
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600 opacity-75 blur-[4px] group-hover:opacity-100 transition duration-300"></div>
      )}

      {/* Cyber ring border */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-black border-2 border-cyan-400/90 shadow-2xl shadow-blue-950/80 ring-2 ring-blue-600/70">
        {!imgError ? (
          <img
            src={imgSrc}
            onError={handleImageError}
            alt="Cyber Sentinel Bangladesh Official Ring Logo"
            className="w-full h-full object-cover rounded-full select-none transform transition duration-300 group-hover:scale-105"
          />
        ) : (
          <svg
            viewBox="0 0 400 400"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <defs>
              <radialGradient id="header-logo-red-aura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                <stop offset="65%" stopColor="#b91c1c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="header-logo-shield-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            <rect width="400" height="400" fill="#000000" />
            <circle cx="200" cy="200" r="195" fill="none" stroke="#2563eb" strokeWidth="6" />
            <circle cx="200" cy="180" r="115" fill="url(#header-logo-red-aura)" />
            <circle cx="200" cy="185" r="140" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.85" />

            <g stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.85">
              <path d="M 6 160 L 60 160 L 80 175 L 110 175" />
              <circle cx="110" cy="175" r="2.5" fill="#38bdf8" />
              <path d="M 12 185 L 70 185 L 90 198" />
              <circle cx="90" cy="198" r="2.5" fill="#38bdf8" />
              <path d="M 20 210 L 55 210 L 75 222 L 105 222" />
              <circle cx="105" cy="222" r="2.5" fill="#38bdf8" />

              <path d="M 394 160 L 340 160 L 320 175 L 290 175" />
              <circle cx="290" cy="175" r="2.5" fill="#38bdf8" />
              <path d="M 388 185 L 330 185 L 310 198" />
              <circle cx="310" cy="198" r="2.5" fill="#38bdf8" />
              <path d="M 380 210 L 345 210 L 325 222 L 295 222" />
              <circle cx="295" cy="222" r="2.5" fill="#38bdf8" />
            </g>

            <path d="M 95 320 Q 140 235 182 220 L 218 220 Q 260 235 305 320 C 265 335 135 335 95 320 Z" fill="#0c1322" stroke="#1e293b" strokeWidth="2" />
            <path d="M 200 60 C 240 60 280 105 288 170 C 293 215 275 240 260 268 C 240 260 225 255 200 255 C 175 255 160 260 140 268 C 125 240 107 215 112 170 C 120 105 160 60 200 60 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <ellipse cx="200" cy="170" rx="55" ry="65" fill="#030712" />

            <polygon points="168,143 192,151 190,157 163,148" fill="#ef4444" />
            <polygon points="232,143 208,151 210,157 237,148" fill="#ef4444" />

            <path d="M 200 188 L 245 198 C 245 240 232 272 200 292 C 168 272 155 240 155 198 Z" fill="url(#header-logo-shield-gold)" stroke="#78350f" strokeWidth="2" />
            <text x="200" y="325" fontFamily="'Orbitron', sans-serif" fontWeight="900" fontSize="22" letterSpacing="2" fill="#7dd3fc" textAnchor="middle">
              CYBER SENTINEL
            </text>
            <text x="200" y="348" fontFamily="'Orbitron', sans-serif" fontWeight="800" fontSize="14" letterSpacing="6" fill="#f87171" textAnchor="middle">
              BANGLADESH
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
