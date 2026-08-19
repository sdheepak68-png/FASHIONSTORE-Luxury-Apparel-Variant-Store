import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Star, ShoppingBag, Check, ShieldCheck, 
  Truck, RefreshCw, Wand2, Shirt, Sparkles, AlertCircle, MessageSquare 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, ClothingSize } from '../types';
import { formatINR } from '../utils/format';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    openSizeAdvisor,
    openVirtualTryOn,
    reviews,
    addReview,
    currentUser
  } = useStore();

  if (!selectedProduct) return null;

  const [selectedColor, setSelectedColor] = useState<string>(selectedProduct.variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(selectedProduct.variants[0]?.size || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care' | 'reviews'>('details');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [newFitFeedback, setNewFitFeedback] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Find exact matching variant
  const currentVariant = selectedProduct.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  ) || selectedProduct.variants.find((v) => v.color === selectedColor) || selectedProduct.variants[0];

  // Available unique colors
  const uniqueColors: ProductVariant[] = Array.from(
    new Map<string, ProductVariant>(selectedProduct.variants.map((v) => [v.color, v])).values()
  );

  // Available unique sizes for currently selected color
  const variantsForColor = selectedProduct.variants.filter((v) => v.color === selectedColor);
  const allProductSizes: ClothingSize[] = Array.from(
    new Set(selectedProduct.variants.map((v) => v.size))
  );

  // Update selected size when color changes if previous size not available
  useEffect(() => {
    if (currentVariant) {
      setSelectedSize(currentVariant.size);
    }
  }, [selectedColor]);

  const isWishlisted = isInWishlist(selectedProduct.id);
  const productReviews = reviews[selectedProduct.id] || [];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    const res = addToCart(selectedProduct, currentVariant, quantity);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(selectedProduct.id, newRating, newComment, newFitFeedback);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const images = selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.imageUrl];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 my-auto">
        
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/70 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 bg-stone-950 p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
              <img
                src={images[selectedImageIndex] || selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Floating Try-On and AI buttons */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <button
                  id="modal-tryon-btn"
                  onClick={() => openVirtualTryOn(selectedProduct)}
                  className="flex-1 bg-stone-950/90 hover:bg-stone-900 text-stone-100 text-xs font-semibold py-2.5 px-3 rounded-xl border border-stone-700 flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-lg hover:border-amber-400 cursor-pointer"
                >
                  <Shirt className="w-4 h-4 text-amber-400" />
                  <span>Virtual Try-On</span>
                </button>

                <button
                  id="modal-size-advisor-btn"
                  onClick={() => openSizeAdvisor(selectedProduct)}
                  className="flex-1 bg-stone-950/90 hover:bg-stone-900 text-stone-100 text-xs font-semibold py-2.5 px-3 rounded-xl border border-stone-700 flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-lg hover:border-emerald-400 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Size Advisor</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Switcher */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                        : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Variant Selector Matrix */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Header section */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                <span className="font-semibold uppercase tracking-wider text-amber-400">
                  {selectedProduct.brand}
                </span>
                <span>{selectedProduct.department} · {selectedProduct.category}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-50 leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Rating and SKU row */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(selectedProduct.rating) ? 'fill-current' : 'text-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-stone-200">{selectedProduct.rating}</span>
                  <button 
                    onClick={() => setActiveTab('reviews')} 
                    className="text-stone-400 hover:text-amber-400 underline cursor-pointer"
                  >
                    ({selectedProduct.reviewCount} customer reviews)
                  </button>
                </div>

                <span className="font-mono text-stone-400 bg-stone-800/80 px-2 py-1 rounded border border-stone-700">
                  SKU: {currentVariant ? currentVariant.sku : 'N/A'}
                </span>
              </div>

              {/* Price section */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-mono text-amber-400">
                  {formatINR(currentVariant ? currentVariant.price : selectedProduct.basePrice)}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > (currentVariant?.price || 0) && (
                  <span className="text-sm font-mono text-stone-500 line-through">
                    {formatINR(selectedProduct.originalPrice)}
                  </span>
                )}
                {currentVariant && currentVariant.price !== selectedProduct.basePrice && (
                  <span className="text-xs text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                    Variant price adjusted
                  </span>
                )}
              </div>
            </div>

            {/* VARIANT MANAGEMENT MATRIX (Core requirement of JV-EC-004) */}
            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-4">
              
              {/* 1. Color Variant Selection */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-stone-300">
                    Color: <span className="text-amber-400 font-semibold">{selectedColor}</span>
                  </span>
                  <span className="text-stone-500 text-[11px]">{uniqueColors.length} colors available</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {uniqueColors.map((v) => {
                    const isSelected = selectedColor === v.color;
                    return (
                      <button
                        key={v.color}
                        id={`modal-color-${v.color.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSelectedColor(v.color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-stone-800 border-amber-400 text-amber-300 font-semibold ring-1 ring-amber-400/40 shadow-sm'
                            : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-500 shadow-inner"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Size Variant Selection & Stock Indicator */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-stone-300">
                    Size: <span className="text-amber-400 font-semibold">{selectedSize}</span>
                  </span>
                  
                  {/* Stock Availability Status */}
                  {currentVariant && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      currentVariant.stock > 5
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : currentVariant.stock > 0
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}>
                      {currentVariant.stock > 5
                        ? `✓ In Stock (${currentVariant.stock} available)`
                        : currentVariant.stock > 0
                        ? `⚠️ Only ${currentVariant.stock} left in stock!`
                        : '✕ Out of Stock'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {allProductSizes.map((size) => {
                    const variantForThisSize = selectedProduct.variants.find(
                      (v) => v.color === selectedColor && v.size === size
                    );
                    const stock = variantForThisSize?.stock ?? 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        id={`modal-size-${size}`}
                        onClick={() => setSelectedSize(size)}
                        className={`relative py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md scale-105'
                            : stock > 0
                            ? 'bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800'
                            : 'bg-stone-950 border-stone-800 text-stone-500 line-through opacity-60'
                        }`}
                      >
                        <span className="text-sm font-bold">{size}</span>
                        <span className={`text-[9px] ${isSelected ? 'text-stone-900' : stock > 0 ? 'text-stone-400' : 'text-rose-400'}`}>
                          {stock > 0 ? `${stock} left` : '0'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Quantity</span>
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentVariant?.stock || 1, quantity + 1))}
                    disabled={!currentVariant || quantity >= currentVariant.stock}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Wishlist */}
            <div className="space-y-2">
              {toastMessage && (
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{toastMessage}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!currentVariant || currentVariant.stock <= 0}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-stone-800 disabled:to-stone-800 disabled:text-stone-500 text-stone-950 font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {!currentVariant || currentVariant.stock <= 0
                      ? 'Selected Variant Out of Stock'
                      : `Add to Bag · ${formatINR((currentVariant?.price || selectedProduct.basePrice) * quantity)}`}
                  </span>
                </button>

                <button
                  id="modal-wishlist-toggle-btn"
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 border-rose-400 text-white'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white hover:bg-stone-700'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Assurance Guarantees */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-800 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free Ship &gt; $75</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>100% Authentic</span>
              </div>
            </div>

            {/* Tabbed Specs, Materials & Reviews */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-800 pb-2 text-xs">
                {(['details', 'materials', 'care', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`capitalize font-semibold pb-1 px-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {tab === 'reviews' ? `Reviews (${productReviews.length})` : tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Details */}
              {activeTab === 'details' && (
                <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
                  <p>{selectedProduct.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div>
                      <span className="text-stone-400">Fit Type:</span> {selectedProduct.fitType || 'Regular'}
                    </div>
                    <div>
                      <span className="text-stone-400">Department:</span> {selectedProduct.department}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Materials */}
              {activeTab === 'materials' && (
                <div className="text-xs text-stone-300 space-y-1.5">
                  <p className="font-semibold text-stone-200">Fabric Composition:</p>
                  <p className="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                    {selectedProduct.material || 'Premium organic woven blend.'}
                  </p>
                </div>
              )}

              {/* Tab 3: Care */}
              {activeTab === 'care' && (
                <div className="text-xs text-stone-300 space-y-1.5">
                  <p className="font-semibold text-stone-200">Washing & Maintenance:</p>
                  <p className="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                    {selectedProduct.careInstructions || 'Machine wash cold with like colors. Tumble dry low or air dry.'}
                  </p>
                </div>
              )}

              {/* Tab 4: Reviews & Review Form */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 text-xs">
                  {/* Reviews List */}
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {productReviews.length === 0 ? (
                      <p className="text-stone-400 py-2">No reviews yet. Be the first to leave feedback!</p>
                    ) : (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-200">{rev.userName}</span>
                              {rev.verifiedPurchase && (
                                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                                  Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400">{rev.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-stone-700'}`} />
                              ))}
                            </div>
                            {rev.fitFeedback && (
                              <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                Fit: {rev.fitFeedback}
                              </span>
                            )}
                          </div>

                          <p className="text-stone-300 text-xs pt-1">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2.5">
                    <p className="font-bold text-stone-200">Leave a Product Review</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setNewRating(s)}
                            className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${s <= newRating ? 'fill-current' : 'text-stone-700'}`} />
                          </button>
                        ))}
                      </div>

                      <select
                        value={newFitFeedback}
                        onChange={(e) => setNewFitFeedback(e.target.value as any)}
                        className="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-1"
                      >
                        <option value="True to Size">Fit: True to Size</option>
                        <option value="Runs Small">Fit: Runs Small</option>
                        <option value="Runs Large">Fit: Runs Large</option>
                      </select>
                    </div>

                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your thoughts on size fit, fabric texture, and comfort..."
                      className="w-full bg-stone-900 border border-stone-700 text-stone-100 text-xs rounded-xl p-2.5 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 h-16 resize-none"
                    />

                    <div className="flex items-center justify-between">
                      {reviewSubmitted && (
                        <span className="text-emerald-400 text-xs font-semibold">✓ Review submitted!</span>
                      )}
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="ml-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        Post Review
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
