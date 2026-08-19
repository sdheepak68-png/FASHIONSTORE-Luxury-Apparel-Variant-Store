import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Sparkles, X, Grid, List } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Department } from '../types';

interface ProductListProps {
  onToggleSidebarMobile?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onToggleSidebarMobile }) => {
  const { 
    filteredProducts, 
    filters, 
    setFilters, 
    resetFilters 
  } = useStore();

  const departments: (Department | 'All')[] = ['All', 'Women', 'Men', 'Kids', 'Accessories', 'Unisex'];

  // Check if any filter is active
  const hasActiveFilters = 
    filters.department !== 'All' ||
    filters.category !== 'All' ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    Boolean(filters.searchQuery?.trim()) ||
    filters.minPrice > 0 ||
    filters.maxPrice < 20000;

  return (
    <div className="space-y-6">
      
      {/* Top Toolbar: Department Filter Pills & Sorting */}
      <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800/80 p-4 rounded-3xl space-y-4 shadow-md">
        
        {/* Department Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            {departments.map((dept) => {
              const isSelected = filters.department === dept;
              return (
                <button
                  key={dept}
                  id={`dept-tab-${dept.toLowerCase()}`}
                  onClick={() => setFilters((prev) => ({ ...prev, department: dept, category: 'All' }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-850 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {dept === 'All' ? 'All Collections' : dept}
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Toggle */}
          {onToggleSidebarMobile && (
            <button
              onClick={onToggleSidebarMobile}
              className="lg:hidden flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3 py-1.5 rounded-xl border border-stone-700 cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters</span>
            </button>
          )}
        </div>

        {/* Results Count & Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-200 font-mono text-sm">
              {filteredProducts.length}
            </span>
            <span className="text-stone-400">Garments Found</span>
            {filters.searchQuery && (
              <span className="text-stone-400">
                matching &quot;<span className="text-amber-400 font-semibold">{filters.searchQuery}</span>&quot;
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              id="product-sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-stone-950 border border-stone-700 text-stone-100 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stone-800/60 text-xs">
            <span className="text-[11px] text-stone-400 font-medium">Active:</span>

            {filters.department !== 'All' && (
              <span className="bg-stone-800 text-stone-300 text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                Dept: {filters.department}
                <button onClick={() => setFilters((prev) => ({ ...prev, department: 'All' }))} className="hover:text-amber-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.category !== 'All' && (
              <span className="bg-stone-800 text-stone-300 text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                Category: {filters.category}
                <button onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))} className="hover:text-amber-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.sizes.map((s) => (
              <span key={s} className="bg-stone-800 text-stone-300 text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                Size: {s}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, sizes: prev.sizes.filter((x) => x !== s) }))}
                  className="hover:text-amber-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.colors.map((c) => (
              <span key={c} className="bg-stone-800 text-stone-300 text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                Color: {c}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, colors: prev.colors.filter((x) => x !== c) }))}
                  className="hover:text-amber-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.brands.map((b) => (
              <span key={b} className="bg-stone-800 text-stone-300 text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                {b}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, brands: prev.brands.filter((x) => x !== b) }))}
                  className="hover:text-amber-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.inStockOnly && (
              <span className="bg-emerald-950 text-emerald-300 text-[11px] px-2.5 py-0.5 rounded-lg border border-emerald-800 flex items-center gap-1">
                In Stock Only
                <button onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="bg-amber-950 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-lg border border-amber-800 flex items-center gap-1">
                &quot;{filters.searchQuery}&quot;
                <button onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone-800 flex items-center justify-center text-stone-500">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-200">No matching garments found</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try adjusting your size, color, brand, or price filters to view more products in our catalog.
          </p>
          <button
            onClick={resetFilters}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
