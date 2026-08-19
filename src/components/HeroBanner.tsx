import React from 'react';
import { Sparkles, ArrowRight, Layers, Tag, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setFilters, categories } = useStore();

  return (
    <div className="relative bg-stone-900 border-b border-stone-800 overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Headline & Features */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spring / Summer 2026 Collection Live</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-50 font-serif tracking-tight leading-tight">
              Elevated Fashion with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400">
                Precision Size & Color Variants
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Explore curated silhouettes with instant stock status per size, fabric textures, multi-color palettes, AI fit advisory, and real-time inventory synchronization.
            </p>

            {/* Quick Action Badges / Highlights */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Multi-SKU Variant Matrix</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Fit Size Predictor</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>Virtual Try-On Simulation</span>
              </div>
            </div>

            {/* Promo Code Callout */}
            <div className="inline-flex items-center gap-3 bg-stone-950/80 p-3 rounded-xl border border-stone-800 text-xs text-stone-300">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Use code <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">INTERN20</span> for 20% discount at checkout!
              </span>
            </div>
          </div>

          {/* Right Featured Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                id={`hero-category-${cat.slug}`}
                onClick={() => setFilters((prev) => ({ ...prev, department: cat.department, category: 'All' }))}
                className="group relative h-40 sm:h-44 rounded-2xl overflow-hidden shadow-lg border border-stone-800 text-left transition-all hover:scale-[1.02] hover:border-amber-500/50 cursor-pointer"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-3.5">
                  <span className="text-xs text-amber-400 font-medium">Department</span>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-stone-50 font-serif">{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform text-amber-400" />
                  </div>
                  <span className="text-[11px] text-stone-300">{cat.itemCount}+ styles</span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
