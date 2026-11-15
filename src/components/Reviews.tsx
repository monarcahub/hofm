import React from 'react';
import { REVIEWS } from '../data/content';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';

export const Reviews: React.FC = () => {
  return (
    <section id="avaliacoes" className="py-20 bg-white border-y border-slate-100 text-slate-800 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Google Reputation Summary Badge (Exact reproduction of original site) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              AVALIAÇÕES PÚBLICAS
            </span>
            <div className="bg-[#004d5a] text-white rounded-3xl p-7 shadow-xl w-full max-w-sm">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                BOM
              </h3>

              {/* 5 Golden Stars */}
              <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 my-2" aria-label="Avaliação 5 estrelas">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                ))}
              </div>

              <p className="text-xs text-teal-100 font-medium">
                Com base em <strong className="text-white font-bold">17 avaliações</strong>
              </p>

              {/* Google Brand Mark */}
              <div className="mt-4 pt-4 border-t border-teal-700/60 flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Avaliações</span>
              </div>
            </div>
          </div>

          {/* Testimonials Cards Column */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#F8FAFB] text-slate-800 rounded-2xl p-6 shadow-2xs border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    {/* Author & Google Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-[#004d5a] font-bold text-xs flex items-center justify-center shrink-0">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight line-clamp-1 text-slate-900">
                            {review.author}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {review.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Google G mark */}
                      <span className="text-xs font-semibold text-slate-400">G</span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Avaliação Verificada</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center lg:text-right">
              <a
                href="https://maps.google.com/?q=Hospital+de+Olhos+Freitag+Timbo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004d5a] hover:text-[#be7b52] transition-colors"
              >
                <span>Ver todas as avaliações no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
