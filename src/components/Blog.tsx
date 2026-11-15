import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/content';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 lg:py-28 bg-white border-t border-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              CONTEÚDO & EDUCAÇÃO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              Artigos sobre saúde ocular
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Informações científicas explicadas de forma simples para você cuidar da visão da sua família.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-[#F8FAFB] rounded-3xl p-7 border border-slate-100 shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Category & Read Time (Clean unboxed metadata per Frontend Constitution) */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#be7b52] mb-3">
                  <span>{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 flex items-center gap-1 font-normal">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#004d5a] transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {post.excerpt}
                </p>
              </div>

              {/* Footer action */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {post.date}
                </span>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004d5a] hover:text-[#be7b52] transition-colors cursor-pointer"
                >
                  <span>Ler artigo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-slate-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase text-[#be7b52]">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Fechar artigo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                {selectedPost.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{selectedPost.date}</span>
                <span>·</span>
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
              <p className="font-semibold text-slate-800">
                {selectedPost.excerpt}
              </p>
              <p>
                A visão é responsável por mais de 80% dos estímulos sensoriais que recebemos diariamente. Por isso, consultas regulares ao oftalmologista são essenciais para identificar alterações silenciosas antes que tragam danos irreversíveis.
              </p>
              <p>
                No Hospital de Olhos Freitag Munareto, nossos especialistas realizam um mapeamento minucioso com equipamentos modernos, orientando sobre medidas de prevenção, adaptação de lentes e procedimentos com precisão micrométrica.
              </p>
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
                <p className="text-xs text-[#004d5a] font-medium">
                  Em caso de dúvidas ou sintomas visuais, consulte nosso corpo clínico em Timbó ou Pomerode.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-[#004d5a] hover:bg-[#003842] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
