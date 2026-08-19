import React, { useState } from 'react';
import { 
  Heart, Star, Sparkles, Eye, Shirt, Wand2, ShoppingBag, Check 
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { 
    setSelectedProduct, 
    toggleWishlist, 
    isInWishlist, 
    openSizeAdvisor, 
    openVirtualTryOn,
    addToCart,
    setIsCartOpen
  } = useStore();

  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddFeedback, setQuickAddFeedback] = useState<string | null>(null);

  const activeVariant: ProductVariant = product.variants[activeVariantIndex] || product.variants[0];
  const isWishlisted = isInWishlist(product.id);

  // Group unique colors for swatches
  const uniqueColorVariants = product.variants.filter(
    (v, i, self) => i === self.findIndex((t) => t.color === v.color)
  );

  // Available unique sizes in stock
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - activeVariant.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeVariant || activeVariant.stock <= 0) {
      setSelectedProduct(product);
      return;
    }
    const res = addToCart(product, activeVariant, 1);
    if (res.success) {
      setQuickAddFeedback('Added!');
      setTimeout(() => setQuickAddFeedback(null), 1800);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/40 flex flex-col cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full bg-stone-950 overflow-hidden">
        <img
          src={isHovered && product.images[1] ? product.images[1] : (activeVariant.imageUrl || product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isTrending && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md">
              <Sparkles className="w-3 h-3" /> Trending
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && !product.isTrending && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-900'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Interactive Overlay Action Bar */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
          <button
            id={`quick-tryon-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              openVirtualTryOn(product);
            }}
            className="flex-1 bg-stone-950/90 hover:bg-stone-900 text-stone-200 hover:text-amber-300 text-[11px] font-semibold py-2 px-2 rounded-xl backdrop-blur-md border border-stone-700 flex items-center justify-center gap-1 transition-colors"
            title="Virtual Try-On Simulation"
          >
            <Shirt className="w-3.5 h-3.5 text-amber-400" />
            <span>Try-On</span>
          </button>

          <button
            id={`quick-size-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              openSizeAdvisor(product);
            }}
            className="flex-1 bg-stone-950/90 hover:bg-stone-900 text-stone-200 hover:text-emerald-300 text-[11px] font-semibold py-2 px-2 rounded-xl backdrop-blur-md border border-stone-700 flex items-center justify-center gap-1 transition-colors"
            title="AI Size Advisor"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Size</span>
          </button>

          <button
            id={`quick-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            className="p-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95"
            title="Quick Add to Bag"
          >
            {quickAddFeedback ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>

        {/* Stock Badge if Low */}
        {totalStock <= 0 ? (
          <div className="absolute inset-0 bg-stone-950/70 flex items-center justify-center pointer-events-none">
            <span className="bg-rose-950/90 text-rose-300 border border-rose-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
              Out of Stock
            </span>
          </div>
        ) : totalStock <= 5 ? (
          <div className="absolute bottom-2 left-2 z-0 group-hover:opacity-0 transition-opacity">
            <span className="bg-amber-950/90 text-amber-300 border border-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded">
              Only {totalStock} left
            </span>
          </div>
        ) : null}
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Department */}
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="font-medium tracking-wide uppercase">{product.brand}</span>
            <span className="text-[11px] text-stone-400">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-stone-100 text-base line-clamp-1 group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>

          {/* Rating Summary */}
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold ml-1 text-stone-200">{product.rating}</span>
            </div>
            <span className="text-stone-400">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Color Swatch Selector */}
        <div className="space-y-1.5 pt-1 border-t border-stone-800">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-400 font-medium">Color:</span>
            <span className="text-stone-300 font-medium truncate max-w-[120px]">
              {activeVariant.color}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {uniqueColorVariants.map((v) => {
              const isActive = activeVariant.color === v.color;
              return (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const index = product.variants.findIndex((item) => item.color === v.color);
                    if (index !== -1) setActiveVariantIndex(index);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                    isActive
                      ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-900 scale-110 border-white'
                      : 'border-stone-600 hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.color}
                />
              );
            })}
          </div>
        </div>

        {/* Available Sizes Matrix Chips */}
        <div className="flex items-center gap-1 flex-wrap">
          {uniqueSizes.map((size) => {
            const hasStock = product.variants.some((v) => v.size === size && v.stock > 0);
            return (
              <span
                key={size}
                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  hasStock
                    ? 'bg-stone-800 text-stone-300 border-stone-700'
                    : 'bg-stone-950 text-stone-400 border-stone-800 line-through opacity-50'
                }`}
              >
                {size}
              </span>
            );
          })}
        </div>

        {/* Price and Action Footer */}
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-amber-400 font-mono">
              {formatINR(activeVariant.price)}
            </span>
            {product.originalPrice && product.originalPrice > activeVariant.price && (
              <span className="text-xs text-stone-400 line-through font-mono">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <span className="text-xs text-stone-400 font-mono">
            SKU: {activeVariant.sku.split('-').slice(0, 2).join('-')}
          </span>
        </div>
      </div>
    </div>
  );
};
