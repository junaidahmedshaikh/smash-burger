// ==========================================
// User & Auth Types
// ==========================================
export type UserRole = 'customer' | 'manager' | 'admin';

export interface IUserAddress {
  id?: string;
  _id?: any;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: any;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  addresses: IUserAddress[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

// ==========================================
// Category Types
// ==========================================
export interface ICategory {
  _id: any;
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ==========================================
// Product & Customization Types
// ==========================================
export interface ICustomizationChoice {
  id?: string;
  _id?: any;
  name: string;
  priceDelta: number; // in INR
  isDefault?: boolean;
  caloriesDelta?: number;
}

export interface ICustomizationOption {
  _id?: any;
  groupName: string;
  minSelect: number;
  maxSelect: number;
  choices: ICustomizationChoice[];
}

export interface INutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface IProduct {
  _id: any;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number; // base price in INR
  compareAtPrice?: number;
  images: string[];
  category: any;
  ingredients: string[];
  nutritionalInformation: INutritionalInfo;
  customizationOptions: ICustomizationOption[];
  spiceLevel: 0 | 1 | 2 | 3; // 0: None, 1: Mild Kick, 2: Fiery, 3: Hot Reaper
  preparationTimeMinutes: number;
  isFeatured: boolean;
  isAvailable: boolean;
  isVegetarian: boolean;
  sortOrder: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ==========================================
// Cart & Order Types
// ==========================================
export interface ISelectedCustomization {
  groupName: string;
  choiceName: string;
  priceDelta: number;
}

export interface ICartItem {
  id: string; // unique hash of product ID + chosen customizations
  product: IProduct;
  quantity: number;
  selectedCustomizations: ISelectedCustomization[];
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'cooking'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cash_on_delivery' | 'mock_card';

export interface IOrderItem {
  product: any;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  selectedCustomizations: ISelectedCustomization[];
  itemTotal: number;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: string | Date;
  note?: string;
}

export interface IOrder {
  _id: any;
  id?: string;
  orderNumber: string;
  user?: any;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    paidAt?: string | Date;
  };
  orderStatus: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  deliveryAddress: {
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  customerNotes?: string;
  estimatedDeliveryTime: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ==========================================
// Coupon Types
// ==========================================
export type CouponType = 'percentage' | 'fixed';

export interface ICoupon {
  _id: any;
  id?: string;
  code: string;
  type: CouponType;
  value: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  expiresAt: string | Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IValidateCouponResponse {
  isValid: boolean;
  discountAmount: number;
  coupon: ICoupon;
  message?: string;
}

// ==========================================
// Review Types
// ==========================================
export interface IReview {
  _id: any;
  id?: string;
  user: any;
  product: any;
  rating: number; // 1-5
  comment: string;
  isApproved: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ==========================================
// Store Settings & Locations
// ==========================================
export interface IStoreLocation {
  city: string;
  address: string;
  phone: string;
  openingHours: string;
  isActive: boolean;
}

export interface IStoreSettings {
  storeName: string;
  tagline: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxPercentage: number;
  isOpen: boolean;
  locations: IStoreLocation[];
}

// ==========================================
// Generic API Responses
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: any;
  };
}

// ==========================================
// Admin Dashboard Analytics
// ==========================================
export interface IAdminDashboardStats {
  todayRevenue: number;
  todayOrdersCount: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrdersCount: number;
  revenueTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  categorySales: Array<{
    category: string;
    sales: number;
    count: number;
  }>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    image: string;
    soldCount: number;
    revenue: number;
  }>;
  recentOrders: IOrder[];
}
