import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

interface AccessibilityToolbarProps {
  className?: string;
  variant?: 'inline' | 'floating';
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  className = '',
  variant = 'inline',
}) => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

  if (variant === 'floating') {
    // Disabled as requested
    return null;
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-xs text-slate-600 ${className}`}
      role="region"
      aria-label="Ajuste de tamanho da fonte"
    >
      <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-300 shadow-2xs">
        <button
          onClick={decreaseFontSize}
          disabled={fontSize === 'small'}
          className="px-2 py-0.5 text-xs font-semibold rounded hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-700"
          title="Diminuir texto (A-)"
          aria-label="Diminuir texto"
        >
          A-
        </button>
        <button
          onClick={resetFontSize}
          className={`px-2 py-0.5 text-xs font-bold rounded transition-colors ${
            fontSize === 'normal'
              ? 'bg-[#004d5a] text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Tamanho padrão de texto"
          aria-label="Tamanho padrão"
        >
          A
        </button>
        <button
          onClick={increaseFontSize}
          disabled={fontSize === 'xlarge'}
          className="px-2 py-0.5 text-xs font-semibold rounded hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-700"
          title="Aumentar texto (A+)"
          aria-label="Aumentar texto"
        >
          A+
        </button>
      </div>
    </div>
  );
};
