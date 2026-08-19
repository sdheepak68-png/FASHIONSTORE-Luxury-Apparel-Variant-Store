export type Role = 'USER' | 'ADMIN';

export type Department = 'Men' | 'Women' | 'Kids' | 'Accessories' | 'Unisex';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  phone?: string;
  address?: ShippingAddress;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  department: Department;
  description: string;
  imageUrl: string;
  itemCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '28' | '30' | '32' | '34' | '36' | 'One Size';

export interface ProductVariant {
  id: string;
  productId: string;
  size: ClothingSize;
  color: string;
  colorHex: string;
  stock: number;
  price: number;
  sku: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  category: string;
  categoryId: string;
  department: Department;
  brand: string;
  brandId: string;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isSeasonal?: boolean;
  seasonalTag?: string;
  tags: string[];
  material?: string;
  fitType?: string;
  careInstructions?: string;
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderTrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  quantity: number;
  sku: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'Credit/Debit Card' | 'UPI / QR' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'PAID' | 'PENDING';
  trackingTimeline: OrderTrackingStep[];
}

export interface SizeRecommendation {
  recommendedSize: ClothingSize;
  confidence: number;
  fitType: 'Fitted' | 'Regular' | 'Relaxed';
  reasoning: string;
  alternativeSize?: ClothingSize;
}
