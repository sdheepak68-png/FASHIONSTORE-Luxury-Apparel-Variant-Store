import React, { useState } from 'react';
import { X, Shirt, Sparkles, Check, Sun, Moon, Flame, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductVariant } from '../types';

export const VirtualTryOnModal: React.FC = () => {
  const { 
    isVirtualTryOnOpen, 
    setIsVirtualTryOnOpen, 
    tryOnProduct, 
    addToCart, 
    setIsCartOpen 
  } = useStore();

  if (!isVirtualTryOnOpen || !tryOnProduct) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [modelPose, setModelPose] = useState<'Front' | 'Slight Turn' | 'Full Height'>('Front');
  const [lightingMode, setLightingMode] = useState<'studio' | 'sunset' | 'night'>('studio');
  const [bodyScale, setBodyScale] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  const selectedVariant: ProductVariant = tryOnProduct.variants[selectedVariantIndex] || tryOnProduct.variants[0];

  const handleAddToCart = () => {
    const res = addToCart(tryOnProduct, selectedVariant, 1);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          id="close-virtual-tryon-btn"
          onClick={() => setIsVirtualTryOnOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-stone-50">Virtual Try-On Simulation Studio</h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40">
                Interactive Canvas
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Interactive drape, silhouette &amp; colorway preview for <span className="text-stone-200 font-semibold">{tryOnProduct.name}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Canvas Viewport */}
          <div className="lg:col-span-7 relative h-96 sm:h-[420px] rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center transition-colors duration-500 shadow-inner bg-gradient-to-b from-stone-950 to-stone-900">
            
            {/* Lighting Overlay */}
            {lightingMode === 'sunset' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-rose-500/15 to-transparent pointer-events-none" />
            )}
            {lightingMode === 'night' && (
              <div className="absolute inset-0 bg-stone-950/40 pointer-events-none" />
            )}

            {/* Simulated Garment Silhouette on Mannequin Model */}
            <div 
              className="relative flex flex-col items-center justify-center transition-all duration-300"
              style={{ transform: `scale(${bodyScale})` }}
            >
              {/* Head & Neck Silhouette */}
              <div className="w-16 h-20 rounded-full bg-stone-700/60 border border-stone-600 mb-1" />
              <div className="w-8 h-6 bg-stone-700/60 border-x border-stone-600 -mt-2 mb-1" />

              {/* Garment Body Render (Colored dynamically by variant hex) */}
              <div 
                className="relative w-48 sm:w-56 h-56 rounded-t-3xl rounded-b-xl border-2 border-stone-500/50 shadow-2xl flex flex-col items-center justify-between p-4 transition-colors duration-500"
                style={{ 
                  backgroundColor: selectedVariant.colorHex,
                  boxShadow: `0 20px 40px ${selectedVariant.colorHex}40`
                }}
              >
                {/* Collar & Brand Tag */}
                <div className="w-16 h-6 border-b-2 border-stone-950/40 rounded-b-xl flex items-center justify-center">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-stone-950/70 uppercase">
                    {tryOnProduct.brand.split(' ')[0]}
                  </span>
                </div>

                {/* Fabric Texture Pattern lines */}
                <div className="w-full flex justify-between px-3 opacity-30">
                  <div className="w-0.5 h-24 bg-stone-950" />
                  <div className="w-0.5 h-24 bg-stone-950" />
                  <div className="w-0.5 h-24 bg-stone-950" />
                </div>

                {/* Hemline detail */}
                <div className="w-full flex items-center justify-between px-2 text-[10px] font-mono text-stone-950/60">
                  <span>Size {selectedVariant.size}</span>
                  <span>{selectedVariant.sku}</span>
                </div>
              </div>

              {/* Lower Trousers Silhouette */}
              <div className="flex gap-4 -mt-2">
                <div className="w-10 h-32 bg-stone-800 border border-stone-700 rounded-b-xl" />
                <div className="w-10 h-32 bg-stone-800 border border-stone-700 rounded-b-xl" />
              </div>
            </div>

            {/* Lighting selector floating pill */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-stone-900/90 backdrop-blur-md p-1 rounded-xl border border-stone-700 text-xs">
              <button
                onClick={() => setLightingMode('studio')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  lightingMode === 'studio' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Studio Light"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMode('sunset')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  lightingMode === 'sunset' ? 'bg-stone-800 text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Golden Hour"
              >
                <Flame className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMode('night')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  lightingMode === 'night' ? 'bg-stone-800 text-sky-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Evening Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fit Silhouette badge */}
            <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700 text-[11px] text-stone-300">
              Cut: <span className="text-amber-400 font-semibold">{tryOnProduct.fitType || 'Regular Fit'}</span>
            </div>
          </div>

          {/* Right Control Panel */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Colorway & Variant Swatches */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Choose Color &amp; Size Combination
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {tryOnProduct.variants.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-800 border-amber-400 text-amber-300 font-semibold shadow-md'
                          : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-500 shadow-inner"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        <span>{variant.color} · Size <span className="font-bold">{variant.size}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-400">${variant.price.toFixed(2)}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Scale Slider */}
            <div className="space-y-1.5 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Model Proportions</span>
                <span className="font-mono text-stone-300 font-bold">
                  {bodyScale === 0.9 ? 'Petite' : bodyScale === 1.1 ? 'Broad / Tall' : 'Standard'}
                </span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.1"
                step="0.1"
                value={bodyScale}
                onChange={(e) => setBodyScale(Number(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Add to Bag with selected Try-On settings */}
            <div className="space-y-2 pt-2 border-t border-stone-800">
              {addedToast && (
                <p className="text-xs text-emerald-400 font-semibold text-center animate-in fade-in">
                  ✓ Successfully added to your shopping bag!
                </p>
              )}
              <button
                id="tryon-add-to-bag-btn"
                onClick={handleAddToCart}
                disabled={selectedVariant.stock <= 0}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {selectedVariant.stock <= 0
                    ? 'Variant Out of Stock'
                    : `Add ${selectedVariant.color} (Size ${selectedVariant.size}) · $${selectedVariant.price.toFixed(2)}`}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
