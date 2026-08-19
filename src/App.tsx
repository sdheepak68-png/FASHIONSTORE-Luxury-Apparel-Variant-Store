import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductList } from './components/ProductList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeAdvisorModal } from './components/SizeAdvisorModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TaskInfoModal } from './components/TaskInfoModal';
import { Footer } from './components/Footer';

const StoreContent: React.FC = () => {
  const { isAdminView, isInternshipModalOpen, setIsInternshipModalOpen } = useStore();
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const isModalOpen = isInternshipModalOpen || isTaskInfoOpen;
  const handleCloseTaskModal = () => {
    setIsInternshipModalOpen(false);
    setIsTaskInfoOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      
      {/* Top Main Navigation */}
      <Navbar onOpenTaskInfo={() => setIsTaskInfoOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <div className="space-y-8">
            {/* Promotional & Curated Collection Hero */}
            <HeroBanner />

            {/* Shopping Experience: Responsive Sidebar + Product Matrix */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Desktop Sticky Sidebar (3 Cols) */}
                <div className="hidden lg:block lg:col-span-3 sticky top-24">
                  <FilterSidebar />
                </div>

                {/* Main Product Catalog Grid (9 Cols) */}
                <div className="lg:col-span-9">
                  <ProductList onToggleSidebarMobile={() => setIsMobileSidebarOpen(true)} />
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenTaskInfo={() => setIsTaskInfoOpen(true)} />

      {/* Mobile Drawer Filter Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-stone-900 border-r border-stone-800 text-stone-100 shadow-2xl p-4 overflow-y-auto">
              <FilterSidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal />
      <SizeAdvisorModal />
      <VirtualTryOnModal />
      <CartDrawer />
      <CheckoutModal />
      <OrdersModal />
      <WishlistModal />
      <TaskInfoModal isOpen={isModalOpen} onClose={handleCloseTaskModal} />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
