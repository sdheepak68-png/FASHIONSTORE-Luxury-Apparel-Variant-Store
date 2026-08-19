import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, ProductVariant, CartItem, WishlistItem, Order, Review, User, 
  ClothingSize, Department, OrderStatus, ShippingAddress, SizeRecommendation 
} from '../types';
import { 
  INITIAL_PRODUCTS, CATEGORIES, BRANDS, INITIAL_USER, ADMIN_USER, 
  INITIAL_REVIEWS, INITIAL_ORDERS, PROMO_CODES 
} from '../data/mockData';

interface FilterState {
  searchQuery: string;
  department: Department | 'All';
  category: string | 'All';
  brands: string[];
  sizes: ClothingSize[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  tag?: string;
}

interface StoreContextType {
  // Products & Catalog
  products: Product[];
  categories: typeof CATEGORIES;
  brands: typeof BRANDS;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateVariantStockPrice: (productId: string, variantId: string, stock: number, price: number) => void;
  addVariantToProduct: (productId: string, variant: Omit<ProductVariant, 'id' | 'productId'>) => void;
  deleteVariantFromProduct: (productId: string, variantId: string) => void;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // User & Auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: 'USER' | 'ADMIN') => void;
  updateUserProfile: (profile: Partial<User>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: { code: string; discountPercent: number; amount: number } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: Order['paymentMethod']) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;

  // Reviews
  reviews: Record<string, Review[]>;
  addReview: (productId: string, rating: number, comment: string, fitFeedback?: Review['fitFeedback']) => void;

  // Modals & UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  isSizeAdvisorOpen: boolean;
  setIsSizeAdvisorOpen: (open: boolean) => void;
  sizeAdvisorProduct: Product | null;
  openSizeAdvisor: (product: Product) => void;
  isVirtualTryOnOpen: boolean;
  setIsVirtualTryOnOpen: (open: boolean) => void;
  tryOnProduct: Product | null;
  openVirtualTryOn: (product: Product) => void;
  isInternshipModalOpen: boolean;
  setIsInternshipModalOpen: (open: boolean) => void;
  isAdminView: boolean;
  setIsAdminView: (admin: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Recommendations
  calculateSizeRecommendation: (product: Product, heightCm: number, weightKg: number, fitPreference: 'Fitted' | 'Regular' | 'Relaxed') => SizeRecommendation;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  department: 'All',
  category: 'All',
  brands: [],
  sizes: [],
  colors: [],
  minPrice: 0,
  maxPrice: 20000,
  inStockOnly: false,
  minRating: 0,
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('fs_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // If saved data is in old USD or needs sync with updated model images, refresh with INITIAL_PRODUCTS
        if (parsed.length > 0 && (parsed[0].basePrice < 300 || parsed.some(p => p.imageUrl.includes('photo-1556905055-8f358a7a47b2')))) {
          return INITIAL_PRODUCTS;
        }
        return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('fs_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('fs_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('fs_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    try {
      const saved = localStorage.getItem('fs_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [promoCodeName, setPromoCodeName] = useState<string | null>(null);

  // Modals & UI View Toggles
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState<boolean>(false);
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState<boolean>(false);
  const [sizeAdvisorProduct, setSizeAdvisorProduct] = useState<Product | null>(null);
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState<boolean>(false);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fs_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fs_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fs_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('fs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fs_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Product Management Handlers
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod_${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      variants: newProd.variants.map((v, i) => ({
        ...v,
        id: `var_${Date.now()}_${i}`,
        productId: id,
      })),
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    setWishlist((prev) => prev.filter((item) => item.product.id !== id));
  };

  const updateVariantStockPrice = (
    productId: string,
    variantId: string,
    stock: number,
    price: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) =>
            v.id === variantId ? { ...v, stock: Math.max(0, stock), price: Math.max(0, price) } : v
          ),
        };
      })
    );
  };

  const addVariantToProduct = (
    productId: string,
    variantData: Omit<ProductVariant, 'id' | 'productId'>
  ) => {
    const newVariant: ProductVariant = {
      ...variantData,
      id: `var_${Date.now()}`,
      productId,
    };
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: [...prod.variants, newVariant],
        };
      })
    );
  };

  const deleteVariantFromProduct = (productId: string, variantId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: prod.variants.filter((v) => v.id !== variantId),
        };
      })
    );
  };

  // User / Auth Handlers
  const switchRole = (role: 'USER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      setCurrentUser(ADMIN_USER);
      setIsAdminView(true);
    } else {
      setCurrentUser(INITIAL_USER);
      setIsAdminView(false);
    }
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...profile }));
  };

  // Cart Management
  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (variant.stock <= 0) {
      return { success: false, message: `Size ${variant.size} in ${variant.color} is currently out of stock.` };
    }

    const existingIndex = cart.findIndex((item) => item.variantId === variant.id);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = currentQty + quantity;
      if (newQty > variant.stock) {
        return { 
          success: false, 
          message: `Only ${variant.stock} units available in stock. You already have ${currentQty} in cart.` 
        };
      }
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      if (quantity > variant.stock) {
        return { success: false, message: `Only ${variant.stock} units available in stock.` };
      }
      const newItem: CartItem = {
        id: `ci_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        variantId: variant.id,
        product,
        variant,
        quantity,
        addedAt: new Date().toISOString(),
      };
      setCart((prev) => [newItem, ...prev]);
    }

    return { success: true, message: `Added ${product.name} (${variant.size} / ${variant.color}) to your shopping bag!` };
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;
        const cappedQty = Math.min(quantity, item.variant.stock);
        return { ...item, quantity: cappedQty };
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setPromoCodeName(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const promo = PROMO_CODES[cleanCode];
    if (!promo) {
      return { success: false, message: 'Invalid coupon code. Try FASHION10 or INTERN20.' };
    }
    if (promo.minAmount && cartSubtotal < promo.minAmount) {
      return { success: false, message: `Minimum order of $${promo.minAmount} required for this coupon.` };
    }
    setPromoCodeName(cleanCode);
    return { success: true, message: `Coupon applied: ${promo.description}!` };
  };

  const removePromoCode = () => {
    setPromoCodeName(null);
  };

  const appliedPromo = promoCodeName && PROMO_CODES[promoCodeName]
    ? {
        code: promoCodeName,
        discountPercent: PROMO_CODES[promoCodeName].discountPercent,
        amount: Number(((cartSubtotal * PROMO_CODES[promoCodeName].discountPercent) / 100).toFixed(2)),
      }
    : null;

  const discountAmount = appliedPromo ? appliedPromo.amount : 0;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const cartTax = Number((taxableAmount * 0.05).toFixed(0)); // 5% GST on apparel
  const cartShipping = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99; // Free delivery above ₹999, else ₹99
  const cartTotal = Math.max(0, taxableAmount + cartTax + cartShipping);

  // Wishlist Handlers
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id);
      } else {
        return [{ id: `wl_${Date.now()}`, product, addedAt: new Date().toISOString() }, ...prev];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  // Orders Management
  const placeOrder = (shippingAddress: ShippingAddress, paymentMethod: Order['paymentMethod']): Order => {
    const orderNumber = `DAS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      userId: currentUser.id,
      customerName: shippingAddress.fullName || `${currentUser.firstName} ${currentUser.lastName}`,
      customerEmail: shippingAddress.email || currentUser.email,
      items: cart.map((item) => ({
        id: `oi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: item.product.id,
        productName: item.product.name,
        variantId: item.variant.id,
        size: item.variant.size,
        color: item.variant.color,
        colorHex: item.variant.colorHex,
        price: item.variant.price,
        quantity: item.quantity,
        sku: item.variant.sku,
        imageUrl: item.variant.imageUrl || item.product.imageUrl,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      promoCode: promoCodeName || undefined,
      tax: cartTax,
      shippingFee: cartShipping,
      totalAmount: cartTotal,
      status: 'PLACED',
      orderDate: new Date().toISOString(),
      shippingAddress,
      paymentMethod,
      paymentStatus: 'PAID',
      trackingTimeline: [
        {
          status: 'PLACED',
          title: 'Order Confirmed',
          description: `Order ${orderNumber} received and payment processed via ${paymentMethod}.`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'PROCESSING',
          title: 'Preparing & Packing',
          description: 'Garments inspected and allocated from variant inventory.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'SHIPPED',
          title: 'Dispatched with Carrier',
          description: 'Courier tracking barcode generated.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'OUT_FOR_DELIVERY',
          title: 'Out for Delivery',
          description: 'Package in local courier vehicle.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'DELIVERED',
          title: 'Delivered',
          description: 'Package delivered at shipping address.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
      ],
    };

    // Deduct variant stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItemsForProd = cart.filter((c) => c.productId === prod.id);
        if (cartItemsForProd.length === 0) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            const purchased = cartItemsForProd.find((c) => c.variantId === v.id);
            if (purchased) {
              return { ...v, stock: Math.max(0, v.stock - purchased.quantity) };
            }
            return v;
          }),
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const statusSequence: OrderStatus[] = [
          'PLACED',
          'PROCESSING',
          'SHIPPED',
          'OUT_FOR_DELIVERY',
          'DELIVERED',
        ];
        const targetIndex = statusSequence.indexOf(status);

        const updatedTimeline = order.trackingTimeline.map((step) => {
          const stepIndex = statusSequence.indexOf(step.status);
          if (stepIndex <= targetIndex) {
            return {
              ...step,
              completed: true,
              current: stepIndex === targetIndex,
              timestamp: step.completed ? step.timestamp : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return {
            ...step,
            completed: false,
            current: false,
          };
        });

        return {
          ...order,
          status,
          trackingTimeline: updatedTimeline,
        };
      })
    );
  };

  // Review Handlers
  const addReview = (
    productId: string,
    rating: number,
    comment: string,
    fitFeedback: Review['fitFeedback'] = 'True to Size'
  ) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      productId,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      helpfulCount: 0,
      fitFeedback,
    };

    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: [newRev, ...existing],
      };
    });

    // Update product rating summary
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const currentList = reviews[productId] ? [newRev, ...reviews[productId]] : [newRev];
        const avg = currentList.reduce((s, r) => s + r.rating, 0) / currentList.length;
        return {
          ...prod,
          rating: Number(avg.toFixed(1)),
          reviewCount: currentList.length,
        };
      })
    );
  };

  // Filter and Search logic
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredProducts = products.filter((prod) => {
    // Search query (name, brand, tags, category)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      const matchTags = prod.tags.some((t) => t.toLowerCase().includes(q));
      const matchColor = prod.variants.some((v) => v.color.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchCategory && !matchTags && !matchColor) return false;
    }

    // Department filter
    if (filters.department !== 'All' && prod.department !== filters.department && prod.department !== 'Unisex') {
      return false;
    }

    // Category filter
    if (filters.category !== 'All' && prod.category !== filters.category && prod.categoryId !== filters.category) {
      return false;
    }

    // Tag filter (e.g. seasonal or trending)
    if (filters.tag) {
      if (filters.tag === 'trending' && !prod.isTrending) return false;
      if (filters.tag === 'new' && !prod.isNewArrival) return false;
      if (filters.tag === 'featured' && !prod.isFeatured) return false;
      if (filters.tag === 'sale' && !prod.originalPrice) return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(prod.brand)) {
      return false;
    }

    // Price range
    const minVariantPrice = Math.min(...prod.variants.map((v) => v.price), prod.basePrice);
    if (minVariantPrice < filters.minPrice || minVariantPrice > filters.maxPrice) {
      return false;
    }

    // Size filter
    if (filters.sizes.length > 0) {
      const hasMatchingSize = prod.variants.some(
        (v) => filters.sizes.includes(v.size) && (!filters.inStockOnly || v.stock > 0)
      );
      if (!hasMatchingSize) return false;
    }

    // Color filter
    if (filters.colors.length > 0) {
      const hasMatchingColor = prod.variants.some((v) =>
        filters.colors.some((c) => v.color.toLowerCase().includes(c.toLowerCase()))
      );
      if (!hasMatchingColor) return false;
    }

    // In Stock Only
    if (filters.inStockOnly) {
      const totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);
      if (totalStock <= 0) return false;
    }

    // Minimum Rating
    if (filters.minRating > 0 && prod.rating < filters.minRating) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.basePrice - b.basePrice;
      case 'price-desc':
        return b.basePrice - a.basePrice;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  // Modal helpers
  const openSizeAdvisor = (product: Product) => {
    setSizeAdvisorProduct(product);
    setIsSizeAdvisorOpen(true);
  };

  const openVirtualTryOn = (product: Product) => {
    setTryOnProduct(product);
    setIsVirtualTryOnOpen(true);
  };

  // Smart Fit Recommendation Engine
  const calculateSizeRecommendation = (
    product: Product,
    heightCm: number,
    weightKg: number,
    fitPreference: 'Fitted' | 'Regular' | 'Relaxed'
  ): SizeRecommendation => {
    // Standard BMI approximation and body volume calculation
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let baseSize: ClothingSize = 'M';

    if (product.department === 'Kids') {
      if (heightCm < 110) baseSize = 'XS';
      else if (heightCm < 125) baseSize = 'S';
      else if (heightCm < 140) baseSize = 'M';
      else baseSize = 'L';
    } else if (product.category.includes('Jeans') || product.category.includes('Denim')) {
      if (bmi < 19) baseSize = '28';
      else if (bmi < 22) baseSize = '30';
      else if (bmi < 25) baseSize = '32';
      else if (bmi < 28) baseSize = '34';
      else baseSize = '36';
    } else {
      if (bmi < 19) {
        baseSize = heightCm > 175 ? 'S' : 'XS';
      } else if (bmi < 23) {
        baseSize = heightCm > 180 ? 'M' : 'S';
      } else if (bmi < 26.5) {
        baseSize = heightCm > 182 ? 'L' : 'M';
      } else if (bmi < 30) {
        baseSize = heightCm > 185 ? 'XL' : 'L';
      } else {
        baseSize = 'XXL';
      }

      // Adjust for Fit Preference
      if (fitPreference === 'Relaxed' || fitPreference === 'Fitted') {
        const sizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const idx = sizes.indexOf(baseSize);
        if (fitPreference === 'Relaxed' && idx < sizes.length - 1) {
          baseSize = sizes[idx + 1];
        } else if (fitPreference === 'Fitted' && idx > 0) {
          baseSize = sizes[idx - 1];
        }
      }
    }

    const confidence = Math.min(98, Math.max(85, Math.floor(95 - Math.abs(bmi - 22.5) * 1.5)));

    return {
      recommendedSize: baseSize,
      confidence,
      fitType: fitPreference,
      reasoning: `Based on your stature of ${heightCm}cm and ${weightKg}kg (BMI ${bmi.toFixed(1)}) for ${product.name} with ${product.fitType || 'Standard'} cut.`,
      alternativeSize: baseSize === 'M' ? 'L' : (baseSize === 'L' ? 'XL' : 'S'),
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        brands: BRANDS,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        updateVariantStockPrice,
        addVariantToProduct,
        deleteVariantFromProduct,
        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        currentUser,
        setCurrentUser,
        switchRole,
        updateUserProfile,
        cart,
        addToCart,
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
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        selectedOrder,
        setSelectedOrder,
        reviews,
        addReview,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        isSizeAdvisorOpen,
        setIsSizeAdvisorOpen,
        sizeAdvisorProduct,
        openSizeAdvisor,
        isVirtualTryOnOpen,
        setIsVirtualTryOnOpen,
        tryOnProduct,
        openVirtualTryOn,
        isInternshipModalOpen,
        setIsInternshipModalOpen,
        isAdminView,
        setIsAdminView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        calculateSizeRecommendation,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
