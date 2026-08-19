import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, ShieldCheck, DollarSign, Package, AlertTriangle, 
  Layers, Check, Sparkles, Database, FileCode2, Search, ArrowRight, RefreshCw, X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, ClothingSize, Department, OrderStatus } from '../types';
import { TASK_INFO, MYSQL_SCHEMA_SQL } from '../data/internshipInfo';
import { formatINR } from '../utils/format';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateVariantStockPrice,
    addVariantToProduct,
    deleteVariantFromProduct,
    orders, 
    updateOrderStatus,
    categories,
    brands,
    setIsAdminView
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'variants' | 'orders' | 'database'>('analytics');
  const [selectedProductIdForVariants, setSelectedProductIdForVariants] = useState<string>(products[0]?.id || '');
  
  // Product Creation / Edit Form State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    basePrice: 2499,
    originalPrice: 3299,
    category: 'Outerwear',
    categoryId: 'cat_women',
    department: 'Women' as Department,
    brand: 'Zara Atelier',
    brandId: 'b_zara',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
    tags: 'Style, Essential, Premium',
    material: '100% Fine Cotton',
    fitType: 'Regular Fit',
    careInstructions: 'Dry clean or gentle hand wash',
  });

  // Variant Creation Form State
  const [variantForm, setVariantForm] = useState({
    size: 'M' as ClothingSize,
    color: 'Midnight Black',
    colorHex: '#1A1A1A',
    stock: 15,
    price: 2499,
    sku: '',
  });

  // Search in product table
  const [productSearch, setProductSearch] = useState('');

  // Selected product for variant editing
  const targetProductForVariants = products.find((p) => p.id === selectedProductIdForVariants) || products[0];

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0);
  const totalStockAcrossAll = products.reduce(
    (sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0), 
    0
  );
  const lowStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.stock <= 3).map((v) => ({ product: p, variant: v }))
  );

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      basePrice: 1999,
      originalPrice: 2499,
      category: 'Outerwear',
      categoryId: 'cat_women',
      department: 'Women',
      brand: 'Zara Atelier',
      brandId: 'b_zara',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      tags: 'Fashion, Seasonal',
      material: '100% Wool Blend',
      fitType: 'Regular',
      careInstructions: 'Dry clean only',
    });
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      description: prod.description,
      basePrice: prod.basePrice,
      originalPrice: prod.originalPrice || prod.basePrice,
      category: prod.category,
      categoryId: prod.categoryId,
      department: prod.department,
      brand: prod.brand,
      brandId: prod.brandId,
      imageUrl: prod.imageUrl,
      tags: prod.tags.join(', '),
      material: prod.material || '',
      fitType: prod.fitType || '',
      careInstructions: prod.careInstructions || '',
    });
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        description: productForm.description,
        basePrice: Number(productForm.basePrice),
        originalPrice: Number(productForm.originalPrice),
        category: productForm.category,
        categoryId: productForm.categoryId,
        department: productForm.department,
        brand: productForm.brand,
        brandId: productForm.brandId,
        imageUrl: productForm.imageUrl,
        tags: productForm.tags.split(',').map((t) => t.trim()),
        material: productForm.material,
        fitType: productForm.fitType,
        careInstructions: productForm.careInstructions,
      });
    } else {
      const generatedVariants: ProductVariant[] = [
        {
          id: `var_${Date.now()}_1`,
          productId: '',
          size: 'S',
          color: 'Midnight Black',
          colorHex: '#1A1A1A',
          stock: 10,
          price: Number(productForm.basePrice),
          sku: `${productForm.brand.slice(0, 2).toUpperCase()}-BLK-S`,
        },
        {
          id: `var_${Date.now()}_2`,
          productId: '',
          size: 'M',
          color: 'Midnight Black',
          colorHex: '#1A1A1A',
          stock: 15,
          price: Number(productForm.basePrice),
          sku: `${productForm.brand.slice(0, 2).toUpperCase()}-BLK-M`,
        },
        {
          id: `var_${Date.now()}_3`,
          productId: '',
          size: 'L',
          color: 'Midnight Black',
          colorHex: '#1A1A1A',
          stock: 8,
          price: Number(productForm.basePrice),
          sku: `${productForm.brand.slice(0, 2).toUpperCase()}-BLK-L`,
        },
      ];

      addProduct({
        name: productForm.name,
        description: productForm.description,
        basePrice: Number(productForm.basePrice),
        originalPrice: Number(productForm.originalPrice),
        category: productForm.category,
        categoryId: productForm.categoryId,
        department: productForm.department,
        brand: productForm.brand,
        brandId: productForm.brandId,
        imageUrl: productForm.imageUrl,
        images: [productForm.imageUrl],
        rating: 5.0,
        reviewCount: 0,
        tags: productForm.tags.split(',').map((t) => t.trim()),
        material: productForm.material,
        fitType: productForm.fitType,
        careInstructions: productForm.careInstructions,
        variants: generatedVariants,
      });
    }
    setIsProductFormOpen(false);
  };

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductForVariants) return;

    const brandPrefix = targetProductForVariants.brand.slice(0, 3).toUpperCase();
    const colorCode = variantForm.color.slice(0, 3).toUpperCase();
    const autoSku = variantForm.sku || `${brandPrefix}-${colorCode}-${variantForm.size}`;

    addVariantToProduct(targetProductForVariants.id, {
      size: variantForm.size,
      color: variantForm.color,
      colorHex: variantForm.colorHex,
      stock: Number(variantForm.stock),
      price: Number(variantForm.price),
      sku: autoSku,
    });

    setVariantForm({
      size: 'M',
      color: 'Midnight Black',
      colorHex: '#1A1A1A',
      stock: 12,
      price: targetProductForVariants.basePrice,
      sku: '',
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(MYSQL_SCHEMA_SQL);
    alert('MySQL schema (fashion_store_db.sql) copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Admin Panel Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-900/60 text-purple-300 border border-purple-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              Spring Boot MVC · Admin Mode
            </span>
            <span className="text-stone-400 text-xs font-mono">Task ID: {TASK_INFO.taskId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-50">
            FashionStore Administration &amp; Inventory Suite
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage product variants, monitor live stock levels, process customer orders, and export database schemas.
          </p>
        </div>

        <button
          onClick={() => setIsAdminView(false)}
          className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-4 py-2 rounded-xl text-xs border border-stone-700 cursor-pointer"
        >
          Return to Customer Storefront
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Overview & Metrics', icon: DollarSign },
          { id: 'products', label: 'Product Catalog', icon: Layers },
          { id: 'variants', label: 'Size & Color Matrix', icon: Sparkles },
          { id: 'orders', label: 'Orders Fulfillment', icon: Package },
          { id: 'database', label: 'MySQL Schema (SQL)', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800 hover:bg-stone-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-stone-400 font-medium">Total Gross Revenue</span>
              <p className="text-2xl font-bold font-mono text-amber-400">{formatINR(totalRevenue)}</p>
              <span className="text-[11px] text-emerald-400">✓ Verified Razorpay / UPI / COD</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-stone-400 font-medium">Customer Orders</span>
              <p className="text-2xl font-bold font-mono text-stone-100">{orders.length}</p>
              <span className="text-[11px] text-stone-400">Total lifetime orders</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-stone-400 font-medium">Active Products &amp; SKUs</span>
              <p className="text-2xl font-bold font-mono text-stone-100">{products.length} Products</p>
              <span className="text-[11px] text-stone-400">
                {products.reduce((s, p) => s + p.variants.length, 0)} total variant combinations
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-stone-400 font-medium">Inventory Units in Stock</span>
              <p className="text-2xl font-bold font-mono text-stone-100">{totalStockAcrossAll} units</p>
              <span className={`text-[11px] font-semibold ${lowStockVariants.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {lowStockVariants.length} low stock alerts
              </span>
            </div>
          </div>

          {/* Low Stock Alerts Section */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-serif text-stone-100">
                  Critical Inventory Alerts (Stock &le; 3 units)
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                {lowStockVariants.length} Variants Require Restock
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockVariants.map(({ product, variant }) => (
                <div
                  key={variant.id}
                  className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-stone-200">{product.name}</p>
                    <p className="text-stone-400 text-[11px]">
                      {variant.color} · Size <span className="text-stone-100 font-bold">{variant.size}</span>
                    </p>
                    <p className="text-stone-400 font-mono text-[10px] mt-0.5">SKU: {variant.sku}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      variant.stock === 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {variant.stock === 0 ? 'Out of Stock' : `${variant.stock} left`}
                    </span>
                    <button
                      onClick={() => updateVariantStockPrice(product.id, variant.id, variant.stock + 10, variant.price)}
                      className="block text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      + Quick Restock (10)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog by title or brand..."
                className="w-full bg-stone-900 border border-stone-700 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2"
              />
            </div>

            <button
              id="admin-add-product-btn"
              onClick={handleOpenAddProduct}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] font-bold tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Brand</th>
                    <th className="p-3.5">Base Price</th>
                    <th className="p-3.5">Variants</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-850 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded-lg bg-stone-950 border border-stone-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-stone-100 block line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] text-stone-400">Created {prod.createdAt}</span>
                          </div>
                        </td>
                        <td className="p-3.5">{prod.department}</td>
                        <td className="p-3.5">{prod.category}</td>
                        <td className="p-3.5 font-semibold text-stone-200">{prod.brand}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-400">{formatINR(prod.basePrice)}</td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setSelectedProductIdForVariants(prod.id);
                              setActiveTab('variants');
                            }}
                            className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] px-2.5 py-1 rounded-lg border border-stone-700 cursor-pointer"
                          >
                            {prod.variants.length} Matrix ({prod.variants.reduce((s, v) => s + v.stock, 0)} in stock)
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${prod.name}" and all its variants?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 bg-stone-800 hover:bg-rose-900/60 text-rose-400 rounded-lg cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VARIANT MANAGEMENT SYSTEM (Key Prompt Feature) */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          {/* Target Product Selector Dropdown */}
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Select Product to Manage Size &amp; Color Variants
              </label>
              <select
                id="admin-variant-product-select"
                value={selectedProductIdForVariants}
                onChange={(e) => setSelectedProductIdForVariants(e.target.value)}
                className="bg-stone-950 border border-stone-700 text-stone-100 text-xs rounded-xl p-2.5 min-w-[280px]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand} · {p.variants.length} variants)
                  </option>
                ))}
              </select>
            </div>

            {targetProductForVariants && (
              <div className="flex items-center gap-3">
                <img
                  src={targetProductForVariants.imageUrl}
                  alt={targetProductForVariants.name}
                  className="w-12 h-14 object-cover rounded-xl border border-stone-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-stone-100 text-sm">{targetProductForVariants.name}</h4>
                  <p className="text-xs text-stone-400">Base Price: {formatINR(targetProductForVariants.basePrice)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Variants Table Matrix */}
          {targetProductForVariants && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Variant Matrix Table (8 Cols) */}
              <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
                  <h3 className="font-bold text-stone-100 text-xs uppercase tracking-wider">
                    Current Variants &amp; Inventory ({targetProductForVariants.variants.length} combinations)
                  </h3>
                  <span className="text-[11px] text-stone-400">Edit stock/price inline directly</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-300">
                    <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] font-bold border-b border-stone-800">
                      <tr>
                        <th className="p-3">Color</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">SKU Code</th>
                        <th className="p-3">Stock Level</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {targetProductForVariants.variants.map((v) => (
                        <tr key={v.id} className="hover:bg-stone-850 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-stone-600 shadow-inner"
                                style={{ backgroundColor: v.colorHex }}
                              />
                              <span className="font-medium text-stone-200">{v.color}</span>
                            </div>
                          </td>

                          <td className="p-3 font-bold text-amber-400">{v.size}</td>

                          <td className="p-3 font-mono text-[11px] text-stone-400">{v.sku}</td>

                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              value={v.stock}
                              onChange={(e) =>
                                updateVariantStockPrice(
                                  targetProductForVariants.id,
                                  v.id,
                                  Number(e.target.value),
                                  v.price
                                )
                              }
                              className={`w-16 bg-stone-950 border rounded-lg p-1 text-center font-mono text-xs ${
                                v.stock === 0 ? 'border-rose-600 text-rose-400' : 'border-stone-700 text-stone-100'
                              }`}
                            />
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <span className="text-stone-400">₹</span>
                              <input
                                type="number"
                                step="50"
                                min="0"
                                value={v.price}
                                onChange={(e) =>
                                  updateVariantStockPrice(
                                    targetProductForVariants.id,
                                    v.id,
                                    v.stock,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 bg-stone-950 border border-stone-700 rounded-lg p-1 text-stone-100 font-mono text-xs"
                              />
                            </div>
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteVariantFromProduct(targetProductForVariants.id, v.id)}
                              className="p-1 text-stone-500 hover:text-rose-400 cursor-pointer"
                              title="Remove Variant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Variant Form (4 Cols) */}
              <div className="lg:col-span-4 bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-stone-100 text-xs uppercase tracking-wider">
                    Add Size/Color Variant
                  </h3>
                </div>

                <form onSubmit={handleAddVariant} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-stone-400">Size</label>
                    <select
                      value={variantForm.size}
                      onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value as any })}
                      className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2"
                    >
                      {(['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'One Size'] as ClothingSize[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-400">Color Name</label>
                    <input
                      type="text"
                      value={variantForm.color}
                      onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                      placeholder="e.g. Desert Sand, Forest Green"
                      className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-400">Color Hex Swatch</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={variantForm.colorHex}
                        onChange={(e) => setVariantForm({ ...variantForm, colorHex: e.target.value })}
                        className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={variantForm.colorHex}
                        onChange={(e) => setVariantForm({ ...variantForm, colorHex: e.target.value })}
                        className="flex-1 bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-stone-400">Initial Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={variantForm.stock}
                        onChange={(e) => setVariantForm({ ...variantForm, stock: Number(e.target.value) })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2 font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-400">Price (₹)</label>
                      <input
                        type="number"
                        step="50"
                        min="0"
                        value={variantForm.price}
                        onChange={(e) => setVariantForm({ ...variantForm, price: Number(e.target.value) })}
                        className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-400">SKU Code (Optional, auto-generated)</label>
                    <input
                      type="text"
                      value={variantForm.sku}
                      onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                      placeholder="e.g. ZA-OVC-CAM-M"
                      className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer mt-3"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Append Variant Matrix</span>
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 4: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
              <h3 className="font-bold text-stone-100 text-xs uppercase tracking-wider">
                Customer Orders &amp; Fulfillment ({orders.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Items &amp; Variants</th>
                    <th className="p-3.5">Total Paid</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-850 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                      <td className="p-3.5">
                        <p className="font-semibold text-stone-100">{ord.customerName}</p>
                        <p className="text-[10px] text-stone-400">{ord.customerEmail}</p>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          {ord.items.map((i) => (
                            <span key={i.id} className="block text-[11px] text-stone-300">
                              {i.quantity}x {i.productName} ({i.size} / {i.color})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-stone-100">{formatINR(ord.totalAmount)}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : ord.status === 'SHIPPED'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-lg p-1.5"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MYSQL SCHEMA & TASK SPEC EXPORT */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-stone-50">
                  MySQL Database Schema (<span className="font-mono text-amber-400">fashion_store_db.sql</span>)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Full relational DDL schema designed for Spring Boot JPA Hibernate entity mapping.
                </p>
              </div>

              <button
                id="copy-sql-schema-btn"
                onClick={handleCopySql}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <FileCode2 className="w-4 h-4" />
                <span>Copy SQL Dump Script</span>
              </button>
            </div>

            <pre className="bg-stone-950 p-5 rounded-2xl border border-stone-800 text-amber-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              {MYSQL_SCHEMA_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 text-stone-100 shadow-2xl">
            <button
              onClick={() => setIsProductFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold font-serif text-stone-50">
              {editingProductId ? 'Edit Product Attributes' : 'Create New Fashion Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-400">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Classic Trench Coat"
                  className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-400">Department</label>
                  <select
                    value={productForm.department}
                    onChange={(e) => setProductForm({ ...productForm, department: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5"
                  >
                    {(['Women', 'Men', 'Kids', 'Accessories', 'Unisex'] as Department[]).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-stone-400">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-400">Base Price (₹)</label>
                  <input
                    type="number"
                    step="50"
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-400">Original / Compare Price (₹)</label>
                  <input
                    type="number"
                    step="50"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-400">Image URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 font-mono text-[11px]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl p-2.5 h-20 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl shadow-lg cursor-pointer"
                >
                  {editingProductId ? 'Update Product' : 'Create & Generate Variants'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
