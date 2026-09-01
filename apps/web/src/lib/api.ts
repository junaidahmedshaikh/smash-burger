import {
  ApiResponse,
  IProduct,
  ICategory,
  IOrder,
  IUser,
  IAuthResponse,
  ICoupon,
  IValidateCouponResponse,
  IReview,
  IAdminDashboardStats,
  IStoreSettings,
} from '@smashd/types';
import {
  RegisterInput,
  LoginInput,
  CreateOrderInput,
  OrderQuoteInput,
} from '@smashd/validation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private static getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private static async handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok || !data.success) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const err: any = new Error(errorMsg);
      err.code = data.error?.code;
      err.details = data.error?.details;
      throw err;
    }
    return data.data;
  }

  // ==========================================
  // Auth API
  // ==========================================
  static async register(payload: RegisterInput): Promise<IAuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return this.handleResponse<IAuthResponse>(res);
  }

  static async login(payload: LoginInput): Promise<IAuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return this.handleResponse<IAuthResponse>(res);
  }

  static async getProfile(token: string): Promise<IUser> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(token),
      credentials: 'include',
    });
    return this.handleResponse<IUser>(res);
  }

  static async logout(token: string): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(token),
      credentials: 'include',
    });
  }

  // ==========================================
  // Categories & Products
  // ==========================================
  static async getCategories(): Promise<ICategory[]> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 60 },
    });
    return this.handleResponse<ICategory[]>(res);
  }

  static async getProducts(params?: {
    category?: string;
    isVegetarian?: boolean;
    spiceLevel?: number;
    isFeatured?: boolean;
    search?: string;
    sortBy?: string;
  }): Promise<IProduct[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.isVegetarian !== undefined) query.append('isVegetarian', String(params.isVegetarian));
    if (params?.spiceLevel !== undefined) query.append('spiceLevel', String(params.spiceLevel));
    if (params?.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
      next: { revalidate: 30 },
    });
    return this.handleResponse<IProduct[]>(res);
  }

  static async getFeaturedProducts(): Promise<IProduct[]> {
    const res = await fetch(`${API_BASE_URL}/products/featured`, {
      next: { revalidate: 30 },
    });
    return this.handleResponse<IProduct[]>(res);
  }

  static async getProductBySlug(slug: string): Promise<IProduct> {
    const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      next: { revalidate: 30 },
    });
    return this.handleResponse<IProduct>(res);
  }

  // ==========================================
  // Orders & Checkout
  // ==========================================
  static async getQuote(payload: OrderQuoteInput): Promise<{
    items: any[];
    subtotal: number;
    discount: number;
    couponCode?: string;
    deliveryFee: number;
    tax: number;
    total: number;
  }> {
    const res = await fetch(`${API_BASE_URL}/orders/quote`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }

  static async createOrder(payload: CreateOrderInput, token?: string): Promise<IOrder> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<IOrder>(res);
  }

  static async getOrderById(id: string): Promise<IOrder> {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      cache: 'no-store',
    });
    return this.handleResponse<IOrder>(res);
  }

  static async getMyOrders(token: string): Promise<IOrder[]> {
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: this.getHeaders(token),
    });
    return this.handleResponse<IOrder[]>(res);
  }

  // ==========================================
  // Coupons & Settings
  // ==========================================
  static async validateCoupon(code: string, orderSubtotal: number): Promise<IValidateCouponResponse> {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, orderSubtotal }),
    });
    return this.handleResponse<IValidateCouponResponse>(res);
  }

  static async getSettings(): Promise<IStoreSettings> {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      next: { revalidate: 300 },
    });
    return this.handleResponse<IStoreSettings>(res);
  }

  // ==========================================
  // Admin Endpoints
  // ==========================================
  static async getDashboardAnalytics(token: string): Promise<IAdminDashboardStats> {
    const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getHeaders(token),
      cache: 'no-store',
    });
    return this.handleResponse<IAdminDashboardStats>(res);
  }

  static async getAllOrders(token: string, status?: string): Promise<IOrder[]> {
    const query = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE_URL}/orders${query}`, {
      headers: this.getHeaders(token),
      cache: 'no-store',
    });
    return this.handleResponse<IOrder[]>(res);
  }

  static async updateOrderStatus(
    id: string,
    status: string,
    token: string,
    note?: string
  ): Promise<IOrder> {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify({ status, note }),
    });
    return this.handleResponse<IOrder>(res);
  }
}

export default ApiClient;
