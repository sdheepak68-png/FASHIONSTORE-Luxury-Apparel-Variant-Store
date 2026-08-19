import React from 'react';
import { 
  Filter, RotateCcw, Check, Sparkles, Star, Tag, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClothingSize, Department } from '../types';
import { formatINR } from '../utils/format';

const POPULAR_COLORS = [
  { name: 'Camel Beige', hex: '#C19A6B' },
  { name: 'Midnight Black', hex: '#1A1A1A' },
  { name: 'Sage Olive', hex: '#556B2F' },
  { name: 'Washed Ash Grey', hex: '#708090' },
  { name: 'Emerald Jewel', hex: '#046307' },
  { name: 'Champagne Gold', hex: '#EEDC82' },
  { name: 'Indigo Rinse', hex: '#1B365D' },
  { name: 'Crimson Red', hex: '#E53935' },
  { name: 'Optic White', hex: '#F8F9FA' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Cognac Brown', hex: '#8B4513' },
];

const AVAILABLE_SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'One Size'];

export const FilterSidebar: React.FC<{ isMobile?: boolean; onCloseMobile?: () => void }> = ({ 
  isMobile = false, 
  onCloseMobile 
}) => {
  const { filters, setFilters, resetFilters, brands, categories } = useStore();

  const handleSizeToggle = (size: ClothingSize) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const handleColorToggle = (colorName: string) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName],
      };
    });
  };

  const handleBrandToggle = (brandName: string) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brandName);
      return {
        ...prev,
        brands: exists ? prev.brands.filter((b) => b !== brandName) : [...prev.brands, brandName],
      };
    });
  };

  const hasActiveFilters = 
    filters.department !== 'All' ||
    filters.category !== 'All' ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 20000 ||
    filters.inStockOnly ||
    filters.minRating > 0 ||
    filters.searchQuery !== '' ||
    filters.tag !== undefined;

  return (
    <aside className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-stone-200 shadow-sm space-y-6">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2 font-semibold text-stone-100 text-sm">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Product Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Quick Curated Collections */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Curated Drops</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            id="filter-tag-trending"
            onClick={() => setFilters((prev) => ({ ...prev, tag: prev.tag === 'trending' ? undefined : 'trending' }))}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              filters.tag === 'trending'
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
          >
            🔥 Trending
          </button>
          <button
            id="filter-tag-new"
            onClick={() => setFilters((prev) => ({ ...prev, tag: prev.tag === 'new' ? undefined : 'new' }))}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              filters.tag === 'new'
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
          >
            ✨ New Arrivals
          </button>
          <button
            id="filter-tag-sale"
            onClick={() => setFilters((prev) => ({ ...prev, tag: prev.tag === 'sale' ? undefined : 'sale' }))}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              filters.tag === 'sale'
                ? 'bg-rose-500 text-white font-bold border-rose-400'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
          >
            🏷️ On Sale
          </button>
        </div>
      </div>

      {/* Department & Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Department</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['All', 'Women', 'Men', 'Kids', 'Accessories'] as (Department | 'All')[]).map((dept) => (
            <button
              key={dept}
              id={`filter-dept-${dept.toLowerCase()}`}
              onClick={() => setFilters((prev) => ({ ...prev, department: dept }))}
              className={`text-xs py-1.5 px-3 rounded-lg text-left transition-colors cursor-pointer flex items-center justify-between ${
                filters.department === dept
                  ? 'bg-stone-800 text-amber-400 font-semibold border border-amber-500/40'
                  : 'bg-stone-950/50 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <span>{dept}</span>
              {filters.department === dept && <Check className="w-3 h-3 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Size Variant Filter (Crucial requirement for task JV-EC-004) */}
      <div className="space-y-2 border-t border-stone-800 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Size Variants
          </label>
          {filters.sizes.length > 0 && (
            <span className="text-[11px] text-amber-400 font-medium">{filters.sizes.length} selected</span>
          )}
        </div>
        <p className="text-[11px] text-stone-400">Filter products containing these sizes in stock:</p>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                id={`filter-size-${size}`}
                onClick={() => handleSizeToggle(size)}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Swatch Filter */}
      <div className="space-y-2 border-t border-stone-800 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Color Palette
          </label>
          {filters.colors.length > 0 && (
            <span className="text-[11px] text-amber-400 font-medium">{filters.colors.length} selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_COLORS.map((col) => {
            const isSelected = filters.colors.includes(col.name);
            return (
              <button
                key={col.name}
                id={`filter-color-${col.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleColorToggle(col.name)}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-stone-800 border-amber-400 text-amber-300 font-medium'
                    : 'bg-stone-950/40 border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-stone-600 shrink-0 shadow-inner"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="truncate">{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider & Inputs */}
      <div className="space-y-3 border-t border-stone-800 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Price Range</label>
          <span className="text-xs font-semibold text-amber-400 font-mono">
            {formatINR(filters.minPrice)} - {formatINR(filters.maxPrice)}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min="0"
          max="20000"
          step="250"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-amber-500 cursor-pointer bg-stone-700 rounded-lg h-1.5"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-stone-950/60 border border-stone-800 rounded-lg p-1.5 text-xs text-stone-300">
            <span className="text-stone-400 mr-1">₹</span>
            <input
              type="number"
              min="0"
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Math.max(0, Number(e.target.value)) }))}
              className="w-16 bg-transparent text-stone-100 focus:outline-none font-mono"
            />
          </div>
          <span className="text-stone-400 text-xs">to</span>
          <div className="flex-1 bg-stone-950/60 border border-stone-800 rounded-lg p-1.5 text-xs text-stone-300">
            <span className="text-stone-400 mr-1">₹</span>
            <input
              type="number"
              min={filters.minPrice}
              max="50000"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-16 bg-transparent text-stone-100 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2 border-t border-stone-800 pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Brands</label>
        <div className="space-y-1.5">
          {brands.map((brand) => {
            const isChecked = filters.brands.includes(brand.name);
            return (
              <label
                key={brand.id}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-800/60 cursor-pointer transition-colors text-xs text-stone-300"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand.name)}
                    className="rounded accent-amber-500 cursor-pointer"
                  />
                  <span>{brand.name}</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{brand.logo}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* In Stock & Ratings */}
      <div className="space-y-3 border-t border-stone-800 pt-4">
        <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-stone-800/50">
          <span className="text-xs font-medium text-stone-300">In-Stock Only</span>
          <input
            id="filter-in-stock-toggle"
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
          />
        </label>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Customer Rating</label>
          <div className="flex gap-1.5">
            {[4, 3, 0].map((rating) => (
              <button
                key={rating}
                id={`filter-rating-${rating}`}
                onClick={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                className={`flex-1 py-1 text-xs rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  filters.minRating === rating
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                {rating === 0 ? 'All' : `${rating}★+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
        >
          Apply Filters
        </button>
      )}
    </aside>
  );
};
