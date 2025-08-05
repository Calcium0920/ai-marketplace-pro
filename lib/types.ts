// lib/types.ts - 完全な型定義

// 基本的な商品型
export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  creator?: string;
}

// フィルター状態の型
export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'rating' | 'popular';
  tags: string[];
}

// カテゴリアイコンマッピングの型
export interface CategoryIconMap {
  '文章作成': string;
  'データ分析': string;
  'デザイン': string;
  'チャットボット': string;
  '教育': string;
  'SEO': string;
  [key: string]: string; // 追加のカテゴリ用
}

// SearchFilter コンポーネントのProps
export interface SearchFilterProps {
  onSearch: (filters: FilterState) => void;
  totalProducts: number;
  filteredCount: number;
}

// レビュー関連の型
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  toolId: string;
  verified: boolean;
  helpful: number;
}

// 購入関連の型
export interface Purchase {
  id: string | number;
  items: PurchaseItem[];
  status?: 'pending' | 'completed' | 'success' | 'failed' | 'cancelled';
  userEmail?: string;
  purchasedAt?: string;
  total?: number;
  sessionId?: string;
}

export interface PurchaseItem {
  id: string | number;
  title: string;
  price: number;
  category?: string;
  icon?: string;
}

// ツール管理用の型
export interface Tool {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  creator: string;
  created_at: string;
  endpoint_url: string;
  tags: string[];
  status?: 'pending' | 'approved' | 'rejected';
  submitted_by?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

// 承認済みツール用の型
export interface ApprovedTool {
  id: string | number;
  title: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  createdAt?: string;
  creator?: string;
}

// Supabase用のツール型
export interface SupabaseTool {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  creator: string;
  created_at: string;
  endpoint_url: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submitted_by?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  rating?: number;
  review_count?: number;
}

// ツール詳細ページ用の拡張型
export interface ToolDetail extends Product {
  longDescription?: string;
  features?: string[];
  compatibility?: string[];
  apiEndpoint?: string;
  status?: string;
}

// フォームエラー用の型
export interface FormErrors {
  [key: string]: string;
}

// セッション用の型（NextAuth拡張）
export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user?: User;
  expires: string;
}

// API レスポンス用の型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Stripe関連の型
export interface StripeCheckoutResponse {
  url: string;
  sessionId: string;
}

// 統計情報用の型
export interface Stats {
  totalTools: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
}

// 管理者ダッシュボード用の型
export interface AdminStats extends Stats {
  pendingTools: number;
  approvedTools: number;
  rejectedTools: number;
  totalUsers: number;
}

// エクスポート用の便利な型
export type ProductId = number | string;
export type CategoryKey = keyof CategoryIconMap;
export type SortOption = FilterState['sortBy'];
export type ToolStatus = 'pending' | 'approved' | 'rejected';

// デフォルト値
export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  category: '',
  minPrice: 0,
  maxPrice: 100000,
  sortBy: 'newest',
  tags: []
};

export const CATEGORY_ICONS: CategoryIconMap = {
  '文章作成': '🧠',
  'データ分析': '📊',
  'デザイン': '🎨',
  'チャットボット': '💬',
  '教育': '📚',
  'SEO': '🔍'
};

export const CATEGORIES = [
  { value: '文章作成', label: '文章作成', icon: '🧠' },
  { value: 'データ分析', label: 'データ分析', icon: '📊' },
  { value: 'デザイン', label: 'デザイン', icon: '🎨' },
  { value: 'チャットボット', label: 'チャットボット', icon: '💬' },
  { value: '教育', label: '教育', icon: '📚' },
  { value: 'SEO', label: 'SEO', icon: '🔍' },
] as const;