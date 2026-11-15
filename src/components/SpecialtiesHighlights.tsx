import React from 'react';
import { SPECIALTIES, Specialty } from '../data/content';

interface SpecialtiesHighlightsProps {
  onSelectSpecialty: (specialty: Specialty) => void;
  onNavigateSpecialties?: () => void;
}

export const SpecialtiesHighlights: React.FC<SpecialtiesHighlightsProps> = ({
  onSelectSpecialty,
  onNavigateSpecialties,
}) => {
  const featured = SPECIALTIES.filter((s) => s.isFeatured);

  return (
    <section id="especialidades" className="relative z-20 bg-white pt-0 pb-8 font-['Jost',sans-serif]">
      {/* Floating container overlapping the bottom of the Hero */}
      <div className="-mt-16 sm:-mt-24 lg:-mt-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {featured.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-7 sm:p-8 lg:p-9 border-t-[3px] border-t-[#be7b52] border border-slate-200/70 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_48px_-6px_rgba(0,77,90,0.14)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Title in Deep Hospital Teal */}
                <h3 className="text-xl sm:text-[22px] font-bold text-[#004d5a] tracking-tight mb-4 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] sm:text-sm text-[#004d5a]/85 leading-relaxed font-normal mb-8">
                  {item.shortDescription}
                </p>
              </div>

              {/* Saiba Mais Outline Button */}
              <div>
                <button
                  onClick={() => onSelectSpecialty(item)}
                  className="px-5 py-2 rounded-md border border-[#004d5a] text-[#004d5a] hover:bg-[#004d5a] hover:text-white transition-colors text-xs font-semibold tracking-wide cursor-pointer w-fit inline-block"
                  aria-label={`Saiba mais sobre ${item.title}`}
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Link to all specialties page */}
        {onNavigateSpecialties && (
          <div className="text-center pt-8">
            <button
              onClick={onNavigateSpecialties}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#004d5a] hover:text-[#be7b52] transition-colors cursor-pointer group"
            >
              <span>Conheça todas as especialidades e procedimentos</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
