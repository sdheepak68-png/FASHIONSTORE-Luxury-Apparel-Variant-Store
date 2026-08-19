import React, { useState } from 'react';
import { X, Wand2, Sparkles, Check, ArrowRight, UserCheck, Ruler } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClothingSize } from '../types';

export const SizeAdvisorModal: React.FC = () => {
  const { 
    isSizeAdvisorOpen, 
    setIsSizeAdvisorOpen, 
    sizeAdvisorProduct, 
    setSelectedProduct,
    calculateSizeRecommendation 
  } = useStore();

  if (!isSizeAdvisorOpen || !sizeAdvisorProduct) return null;

  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [fitPreference, setFitPreference] = useState<'Fitted' | 'Regular' | 'Relaxed'>('Regular');
  const [bodyType, setBodyType] = useState<'Slim' | 'Average' | 'Athletic' | 'Curvy'>('Average');

  const recommendation = calculateSizeRecommendation(
    sizeAdvisorProduct,
    heightCm,
    weightKg,
    fitPreference
  );

  const handleApplySize = (size: ClothingSize) => {
    setSelectedProduct(sizeAdvisorProduct);
    setIsSizeAdvisorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          id="close-size-advisor-btn"
          onClick={() => setIsSizeAdvisorOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-stone-50">AI Size & Fit Advisor</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                Machine Fit Engine
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Personalized size calculation for <span className="text-stone-200 font-semibold">{sizeAdvisorProduct.name}</span>
            </p>
          </div>
        </div>

        {/* Input Matrix */}
        <div className="space-y-5 bg-stone-950/70 p-5 rounded-2xl border border-stone-800">
          
          {/* Height Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-medium flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-amber-400" /> Height
              </span>
              <span className="font-bold text-stone-100 font-mono text-sm">
                {heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)
              </span>
            </div>
            <input
              type="range"
              min="120"
              max="210"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Weight Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-medium flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Weight
              </span>
              <span className="font-bold text-stone-100 font-mono text-sm">
                {weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)
              </span>
            </div>
            <input
              type="range"
              min="35"
              max="130"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Fit Preference */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Preferred Fit Silhouette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Fitted', 'Regular', 'Relaxed'] as const).map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setFitPreference(fit)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    fitPreference === fit
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                      : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Body Build Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Body Frame
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Slim', 'Average', 'Athletic', 'Curvy'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBodyType(type)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    bodyType === type
                      ? 'bg-stone-800 text-amber-400 border-amber-500/50 font-semibold'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Prediction Results Banner */}
        <div className="mt-6 bg-gradient-to-r from-emerald-950/60 to-stone-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Recommended Fit
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700">
              {recommendation.confidence}% Match Confidence
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-3xl font-black font-mono text-stone-50">
                Size <span className="text-amber-400">{recommendation.recommendedSize}</span>
              </p>
              <p className="text-xs text-stone-300 mt-1">{recommendation.reasoning}</p>
            </div>

            <button
              id="apply-recommended-size-btn"
              onClick={() => handleApplySize(recommendation.recommendedSize)}
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Select Size {recommendation.recommendedSize}</span>
            </button>
          </div>

          {recommendation.alternativeSize && (
            <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">
              💡 For a looser drape or layering with knitwear, consider size <span className="font-bold text-stone-300">{recommendation.alternativeSize}</span>.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
