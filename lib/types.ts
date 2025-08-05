// lib/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'user' | 'seller' | 'admin';
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  seller_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  seller?: {
    name: string;
    avatar_url?: string;
  };
  reviews?: Review[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar_url?: string;
  };
}

export interface Order {
  id: number;
  user_id: string;
  product_id: number;
  amount: number;
  stripe_payment_id: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  product?: Product;
}

export interface SearchFilters {
  category: string;
  priceRange: [number, number];
  tags: string[];
  sortBy: 'price' | 'rating' | 'newest';
  search: string;
}

export interface CartItem extends Product {
  quantity?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Stripe関連
export interface StripeSession {
  id: string;
  url: string;
}

// 出品フォーム用
export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  tags: string[];
  demo_url?: string;
  api_endpoint?: string;
  notebook_file?: File;
}