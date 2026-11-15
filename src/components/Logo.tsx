import React, { useState } from 'react';
import { IMAGES } from '../config/images';
import { useAccessibility } from '../context/AccessibilityContext';

interface LogoProps {
  variant?: 'light' | 'dark' | 'footer';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '', showText = true }) => {
  const [imageError, setImageError] = useState(false);
  const { isDark } = useAccessibility();

  const isDarkSurface = isDark || variant === 'footer';
  const logoSrc = isDarkSurface ? IMAGES.logo.headerDark : IMAGES.logo.header;

  // Display official image from Supabase
  if (!imageError) {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          key={logoSrc}
          src={logoSrc}
          alt={IMAGES.logo.alt}
          onError={() => setImageError(true)}
          className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          loading="eager"
        />
      </div>
    );
  }

  // Graceful SVG Fallback if image fails to load
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <svg
        className="w-10 h-10 shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={isDarkSurface ? 'rgba(255,255,255,0.2)' : 'rgba(0,77,90,0.1)'}
          strokeWidth="1.5"
        />
        <path d="M50 12C68 12 84 26 87 45C76 43 62 48 53 43C51 32 50 20 50 12Z" fill="#be7b52" />
        <path d="M45 14C30 19 18 32 14 48C26 49 39 42 47 48C46 36 45 24 45 14Z" fill={isDarkSurface ? '#ffffff' : '#004d5a'} />
        <path d="M13 54C16 72 30 86 48 88C49 76 44 64 49 54C37 54 24 53 13 54Z" fill="#be7b52" />
        <path d="M54 87C72 84 86 70 88 52C75 51 63 57 55 52C55 64 54 76 54 87Z" fill={isDarkSurface ? '#ffffff' : '#004d5a'} />
        <circle cx="50" cy="50" r="5" fill={isDarkSurface ? '#024752' : '#ffffff'} />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`text-base sm:text-lg font-bold tracking-tight ${
              isDarkSurface ? 'text-white' : 'text-[#004d5a]'
            }`}
          >
            Hospital de Olhos
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold tracking-wide ${
              isDarkSurface ? 'text-teal-100' : 'text-[#50606e]'
            }`}
          >
            Freitag e Munareto
          </span>
        </div>
      )}
    </div>
  );
};
