import React, { useState } from 'react';
import { 
  ShoppingBag, Heart, Search, User as UserIcon, ShieldCheck, 
  Sparkles, FileCode2, SlidersHorizontal, Package, X, ChevronDown, Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Department } from '../types';
import { TASK_INFO } from '../data/internshipInfo';

interface NavbarProps {
  onOpenTaskInfo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTaskInfo }) => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsOrderHistoryOpen, 
    setIsInternshipModalOpen,
    setIsAuthModalOpen,
    currentUser, 
    switchRole, 
    isAdminView, 
    setIsAdminView,
    filters, 
    setFilters 
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const departments: (Department | 'All')[] = ['All', 'Women', 'Men', 'Kids', 'Accessories'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
  };

  const handleDepartmentChange = (dept: Department | 'All') => {
    setFilters((prev) => ({ ...prev, department: dept, category: 'All' }));
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-md">
      {/* Top Banner: Data Alcott Systems Internship & Perks */}
      <div className="bg-stone-950 text-stone-300 text-xs px-4 py-2 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-amber-500/30">
              Task {TASK_INFO.taskId}
            </span>
            <span className="text-stone-300 font-medium">
              Free Java Full Stack Internship · <span className="text-stone-100 font-semibold">{TASK_INFO.company}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <span className="hidden sm:inline">✨ Free Express Delivery on orders over ₹999</span>
            <button
              id="internship-spec-btn"
              onClick={() => setIsInternshipModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Internship Task Specs & MySQL SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setFilters((prev) => ({ ...prev, department: 'All', category: 'All', searchQuery: '', tag: undefined }));
                setIsAdminView(false);
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-xl">👗</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-stone-50 font-serif">
                    FASHION<span className="text-amber-400">STORE</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                    Retail
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">Size & Color Variant Suite</p>
              </div>
            </button>
          </div>

          {/* Department Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {departments.map((dept) => {
              const isActive = filters.department === dept && !isAdminView;
              return (
                <button
                  key={dept}
                  id={`nav-dept-${dept.toLowerCase()}`}
                  onClick={() => {
                    setIsAdminView(false);
                    handleDepartmentChange(dept);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-800 text-amber-400 shadow-sm'
                      : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  {dept === 'All' ? 'All Catalog' : dept}
                </button>
              );
            })}
            <button
              id="nav-trending-btn"
              onClick={() => {
                setIsAdminView(false);
                setFilters((prev) => ({ ...prev, tag: prev.tag === 'trending' ? undefined : 'trending' }));
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1 ${
                filters.tag === 'trending' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending</span>
            </button>
          </nav>

          {/* Search Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-md hidden md:flex items-center relative"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search coats, hoodies, silk slip dresses, denim..."
                className="w-full bg-stone-800/80 border border-stone-700 text-stone-100 text-xs rounded-xl pl-9 pr-8 py-2.5 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setFilters((prev) => ({ ...prev, searchQuery: '' }));
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle: Store vs Admin Dashboard */}
            <button
              id="toggle-admin-view-btn"
              onClick={() => {
                if (!isAdminView) {
                  switchRole('ADMIN');
                } else {
                  switchRole('USER');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                isAdminView
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-bold'
                  : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAdminView ? 'Store Mode' : 'Admin Panel'}</span>
              <span className="sm:hidden">{isAdminView ? 'Store' : 'Admin'}</span>
            </button>

            {/* Orders History Button */}
            <button
              id="open-orders-btn"
              onClick={() => setIsOrderHistoryOpen(true)}
              className="p-2 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors relative cursor-pointer"
              title="My Orders & Tracking"
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="open-wishlist-btn"
              onClick={() => {
                setIsAdminView(false);
                setFilters((prev) => ({ ...prev, tag: 'wishlist' }));
              }}
              className="p-2 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-stone-950 text-amber-400 text-[11px] font-extrabold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* User Account / Role Dropdown */}
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer transition-colors"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.firstName}
                    className="w-7 h-7 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-2 z-50 text-stone-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-800">
                    <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-stone-100 truncate">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        currentUser.role === 'ADMIN' ? 'bg-purple-900/50 text-purple-300 border border-purple-700' : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'
                      }`}>
                        Role: {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="menu-orders-btn"
                      onClick={() => setIsOrderHistoryOpen(true)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-stone-800 text-stone-300 hover:text-stone-100 flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>My Orders & Live Tracking</span>
                    </button>

                    <button
                      id="menu-admin-toggle-btn"
                      onClick={() => switchRole(currentUser.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-stone-800 text-stone-300 hover:text-stone-100 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>Switch to {currentUser.role === 'ADMIN' ? 'Customer' : 'Store Admin'}</span>
                      </span>
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </button>

                    <button
                      id="menu-internship-btn"
                      onClick={() => setIsInternshipModalOpen(true)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-stone-800 text-amber-400 flex items-center gap-2"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Task JV-EC-004 Docs & SQL</span>
                    </button>

                    <button
                      id="menu-auth-btn"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-stone-800 text-stone-400 hover:text-stone-200 border-t border-stone-800 mt-1"
                    >
                      Switch / Edit Profile Credentials
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search garments, sizes, colors..."
              className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs rounded-xl pl-9 pr-8 py-2 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </form>
        </div>
      </div>
    </header>
  );
};
