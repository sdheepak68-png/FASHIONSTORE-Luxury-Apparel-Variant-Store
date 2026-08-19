import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, CreditCard, QrCode, Building2, Banknote, 
  Sparkles, ArrowRight, PackageCheck, Printer 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { Order, ShippingAddress } from '../types';
import { formatINR } from '../utils/format';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartCount, 
    cartSubtotal, 
    appliedPromo, 
    cartTax, 
    cartShipping, 
    cartTotal, 
    placeOrder, 
    currentUser,
    setSelectedOrder,
    setIsOrderHistoryOpen
  } = useStore();

  if (!isCheckoutOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Aarav Sharma',
    email: currentUser.email || 'aarav.sharma@example.in',
    phone: currentUser.phone || '+91 98765 43210',
    street: currentUser.address?.street || '102, Indiranagar 100ft Road',
    city: currentUser.address?.city || 'Bengaluru',
    state: currentUser.address?.state || 'Karnataka',
    zipCode: currentUser.address?.zipCode || '560038',
    country: currentUser.address?.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Credit/Debit Card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '08/28',
    cardCvc: '888',
    cardName: 'Alex Morgan',
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const order = placeOrder(shippingAddress, paymentMethod);
    setCompletedOrder(order);

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#10b981', '#6366f1'],
      });
    } catch {
      // Fallback
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          id="close-checkout-btn"
          onClick={() => {
            setIsCheckoutOpen(false);
            setCompletedOrder(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ORDER SUCCESS SCREEN */}
        {completedOrder ? (
          <div className="text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Payment Authorized &amp; Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-50 mt-2">
                Thank You for Your Order!
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Order confirmation and tracking details sent to <span className="text-stone-200 font-semibold">{completedOrder.customerEmail}</span>
              </p>
            </div>

            {/* Order Card Summary */}
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 max-w-lg mx-auto text-left space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <p className="text-[11px] text-stone-400">Order Reference</p>
                  <p className="text-sm font-bold font-mono text-amber-400">{completedOrder.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-stone-400">Total Paid</p>
                  <p className="text-sm font-bold font-mono text-stone-100">{formatINR(completedOrder.totalAmount)}</p>
                </div>
              </div>

              {/* Items Purchased with Variant Specs */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-850">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-stone-600 shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-stone-200 font-medium truncate max-w-[200px]">
                        {item.productName} ({item.size})
                      </span>
                    </div>
                    <span className="font-mono text-stone-300">
                      {item.quantity}x {formatINR(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Address Snapshot */}
              <div className="text-xs text-stone-400 pt-2 border-t border-stone-800 space-y-0.5">
                <p className="font-semibold text-stone-300">Shipping To:</p>
                <p>{completedOrder.shippingAddress.fullName} · {completedOrder.shippingAddress.phone}</p>
                <p>{completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} {completedOrder.shippingAddress.zipCode}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="view-order-tracking-btn"
                onClick={() => {
                  setSelectedOrder(completedOrder);
                  setIsCheckoutOpen(false);
                  setIsOrderHistoryOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Track Delivery Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrintReceipt}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT STEPS FLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Multi-Step Forms */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step Navigation Pill */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h2 className="text-xl font-bold font-serif text-stone-50">Express Checkout</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-lg font-semibold ${step === 1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                    1. Shipping
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg font-semibold ${step === 2 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                    2. Payment
                  </span>
                </div>
              </div>

              {/* STEP 1: Shipping Address */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Recipient &amp; Delivery Destination
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-stone-400">Full Name</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-400">Phone Number</label>
                      <input
                        type="text"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-stone-400">Email Address (For Tracking &amp; Invoice)</label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-stone-400">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      placeholder="Street address, apartment, suite"
                      className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-stone-400">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-400">State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-400">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Select Payment Gateway
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      ← Back to Address
                    </button>
                  </div>

                  {/* Payment Method Selector Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'Credit/Debit Card', icon: CreditCard, label: 'Credit / Debit Card' },
                      { id: 'UPI / QR', icon: QrCode, label: 'Instant UPI / QR Code' },
                      { id: 'Net Banking', icon: Building2, label: 'Net Banking' },
                      { id: 'Cash on Delivery', icon: Banknote, label: 'Cash on Delivery (COD)' },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-stone-800 border-amber-400 text-amber-300 font-semibold shadow-md'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-850'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                          <span className="truncate">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mock Card Form if Card selected */}
                  {paymentMethod === 'Credit/Debit Card' && (
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-stone-400">Card Number</label>
                        <input
                          type="text"
                          value={cardInfo.cardNumber}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700 text-stone-100 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-stone-400">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardInfo.cardExp}
                            onChange={(e) => setCardInfo({ ...cardInfo, cardExp: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-700 text-stone-100 rounded-lg p-2 font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-stone-400">CVC / CVV</label>
                          <input
                            type="password"
                            value={cardInfo.cardCvc}
                            onChange={(e) => setCardInfo({ ...cardInfo, cardCvc: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-700 text-stone-100 rounded-lg p-2 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'UPI / QR' && (
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs text-center space-y-2">
                      <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-stone-950" />
                      </div>
                      <p className="text-stone-300 font-mono">fashionstore@dasbank</p>
                      <p className="text-stone-400 text-[11px]">Scan with GPay, PhonePe, or Paytm</p>
                    </div>
                  )}

                  {/* Complete Order Button */}
                  <button
                    id="place-order-submit-btn"
                    onClick={handlePlaceOrder}
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl uppercase tracking-wider"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize &amp; Pay {formatINR(cartTotal)}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Right Column: Order Summary Checklist */}
            <div className="lg:col-span-5 bg-stone-950 p-5 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold font-serif text-stone-100 mb-3 border-b border-stone-800 pb-2">
                  Order Summary ({cartCount} items)
                </h3>

                {/* Items in Bag */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img
                        src={item.variant.imageUrl || item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-lg bg-stone-900 border border-stone-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-stone-200 line-clamp-1">{item.product.name}</p>
                        <p className="text-stone-400 text-[11px]">
                          {item.variant.color} · Size {item.variant.size}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-stone-400">Qty: {item.quantity}</span>
                          <span className="font-mono font-semibold text-amber-400">
                            {formatINR(item.variant.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-300 pt-3 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatINR(cartSubtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Coupon ({appliedPromo.code})</span>
                    <span className="font-mono">-{formatINR(appliedPromo.amount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono">{formatINR(cartTax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {cartShipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatINR(cartShipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-stone-50 pt-2 border-t border-stone-800">
                  <span>Grand Total</span>
                  <span className="font-mono text-amber-400 text-lg">{formatINR(cartTotal)}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
