import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';

export const WishlistModal: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    removeFromWishlist, 
    setSelectedProduct 
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          id="close-wishlist-modal-btn"
          onClick={() => setIsWishlistOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-50">
              Saved Wishlist ({wishlist.length})
            </h2>
            <p className="text-xs text-stone-400">
              Your curated fashion favorites saved across sessions.
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500">
              <Heart className="w-8 h-8" />
            </div>
            <p className="text-stone-300 font-serif font-bold text-lg">Your Wishlist is Empty</p>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Tap the heart icon on any garment to save your favorite styles here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden group flex flex-col justify-between p-3 relative"
              >
                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-stone-900/80 text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-900 mb-2">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{item.product.brand}</p>
                  <h4 className="font-bold text-stone-100 text-xs font-serif line-clamp-1 mt-0.5">{item.product.name}</h4>
                  <p className="font-mono text-stone-200 font-bold text-sm mt-1">{formatINR(item.product.basePrice)}</p>
                </div>

                <button
                  id={`wishlist-select-size-${item.product.id}`}
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setSelectedProduct(item.product);
                  }}
                  className="mt-3 w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Choose Size &amp; Buy</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
