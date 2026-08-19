import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, Check, Truck 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartCount,
    cartSubtotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    cartTax,
    cartShipping,
    cartTotal,
    setIsCheckoutOpen
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput('');
  };

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-serif text-stone-50">
                Shopping Bag ({cartCount})
              </h2>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-950/80 px-5 py-3 border-b border-stone-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {amountNeededForFreeShipping > 0
                  ? `Add ${formatINR(amountNeededForFreeShipping)} more for FREE Delivery`
                  : '🎉 Qualified for FREE Express Delivery!'}
              </span>
              <span className="font-mono text-amber-400 font-bold">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-stone-300 font-serif font-bold text-lg">Your bag is empty</p>
                <p className="text-xs text-stone-400 max-w-xs">
                  Discover our size &amp; color variant collection and add your favorite pieces to the cart.
                </p>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="bg-stone-950/60 border border-stone-800 rounded-2xl p-3.5 flex gap-3.5 relative group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                    <img
                      src={item.variant.imageUrl || item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-0.5">
                        <span className="font-semibold uppercase tracking-wider">{item.product.brand}</span>
                        <span className="font-mono text-[10px]">SKU: {item.variant.sku}</span>
                      </div>

                      <h4 className="font-bold text-stone-100 text-xs font-serif line-clamp-1">
                        {item.product.name}
                      </h4>

                      {/* Variant Specs */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-300">
                        <span className="bg-stone-800 px-2 py-0.5 rounded border border-stone-700 font-semibold">
                          Size: {item.variant.size}
                        </span>
                        <div className="flex items-center gap-1 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-600"
                            style={{ backgroundColor: item.variant.colorHex }}
                          />
                          <span>{item.variant.color}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 mt-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {formatINR(item.variant.price * item.quantity)}
                      </span>

                      <div className="flex items-center gap-1 bg-stone-900 border border-stone-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                          className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-xs text-stone-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Financials */}
          {cart.length > 0 && (
            <div className="p-5 bg-stone-950 border-t border-stone-800 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="promo-code-input"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Coupon: INTERN20 or FASHION10"
                      className="w-full bg-stone-900 border border-stone-700 text-stone-100 text-xs rounded-xl pl-8 pr-3 py-2 uppercase placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold px-3 py-2 rounded-xl text-xs border border-stone-700 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Promo message */}
                {promoFeedback && (
                  <p className={`text-[11px] font-medium ${promoFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {promoFeedback.message}
                  </p>
                )}

                {appliedPromo && (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs text-amber-300">
                    <span className="flex items-center gap-1 font-mono font-bold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {appliedPromo.code} (-{appliedPromo.discountPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-stone-200 text-[10px] underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">{formatINR(cartSubtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                    <span>Voucher Discount</span>
                    <span className="font-mono">-{formatINR(appliedPromo.amount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-mono font-medium">{formatINR(cartTax)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-mono font-medium">
                    {cartShipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatINR(cartShipping)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-stone-50 pt-2 border-t border-stone-800">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-amber-400">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="drawer-checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Proceed to Checkout · {formatINR(cartTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
