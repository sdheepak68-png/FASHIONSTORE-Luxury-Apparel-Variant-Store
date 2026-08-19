import React from 'react';
import { 
  X, Package, CheckCircle2, Clock, Truck, Home, MapPin, 
  ChevronRight, ArrowUpRight, RotateCcw 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { formatINR } from '../utils/format';

export const OrdersModal: React.FC = () => {
  const { 
    isOrderHistoryOpen, 
    setIsOrderHistoryOpen, 
    orders, 
    selectedOrder, 
    setSelectedOrder, 
    updateOrderStatus 
  } = useStore();

  if (!isOrderHistoryOpen) return null;

  const currentOrder = selectedOrder || orders[0];

  const handleAdvanceStatus = (order: Order) => {
    const sequence: OrderStatus[] = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          id="close-orders-modal-btn"
          onClick={() => {
            setIsOrderHistoryOpen(false);
            setSelectedOrder(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-50">Order History &amp; Live Tracking</h2>
            <p className="text-xs text-stone-400">
              Track packages, view variant breakdowns, and monitor delivery logistics.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-stone-400 text-sm">No orders placed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Order Selector List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                Your Orders ({orders.length})
              </p>

              {orders.map((order) => {
                const isSelected = currentOrder?.id === order.id;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-800 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                        : 'bg-stone-950 border-stone-800 hover:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-amber-400">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : order.status === 'SHIPPED'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-medium">
                      {order.items.length} item(s) · <span className="font-mono text-stone-100 font-bold">{formatINR(order.totalAmount)}</span>
                    </p>

                    <p className="text-[11px] text-stone-400 mt-1">
                      {new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed Tracking View */}
            {currentOrder && (
              <div className="lg:col-span-7 bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-6">
                
                {/* Order Top Summary */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[11px] text-stone-400">Order ID</span>
                    <h3 className="font-mono font-bold text-base text-stone-100">{currentOrder.orderNumber}</h3>
                  </div>

                  {/* Simulator button */}
                  {currentOrder.status !== 'DELIVERED' && (
                    <button
                      id="advance-tracking-step-btn"
                      onClick={() => handleAdvanceStatus(currentOrder)}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-md cursor-pointer"
                      title="Simulate dispatch / next status update"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Advance Status</span>
                    </button>
                  )}
                </div>

                {/* Timeline Component */}
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Live Tracking Milestones
                  </p>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-800">
                    {currentOrder.trackingTimeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${step.completed ? 'bg-stone-950' : 'bg-stone-500'}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${step.completed ? 'text-stone-100' : 'text-stone-500'}`}>
                              {step.title}
                            </p>
                            <span className="text-[10px] font-mono text-stone-400">{step.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchased Variant Items snapshot */}
                <div className="border-t border-stone-800 pt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Package Contents
                  </p>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {currentOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs bg-stone-900/60 p-2.5 rounded-xl border border-stone-850">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-8 h-10 object-cover rounded bg-stone-950 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-semibold text-stone-200 line-clamp-1">{item.productName}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                              <span>Size: <span className="text-stone-200 font-bold">{item.size}</span></span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.colorHex }} />
                                {item.color}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <p className="text-stone-300">{item.quantity}x {formatINR(item.price)}</p>
                          <p className="text-[10px] text-stone-400">SKU: {item.sku}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="border-t border-stone-800 pt-3 flex items-start gap-2 text-xs text-stone-400">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-200">Destination:</span>{' '}
                    {currentOrder.shippingAddress.fullName}, {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
