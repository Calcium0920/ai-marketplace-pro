// lib/types.ts
export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  icon: string;
  createdAt?: string;
  creator?: string;
}

export interface FilterState {
  searchTerm: string;
  category: string;
  priceRange: string;
  rating: number;
  sortBy: string;
}

export type CategoryIconMap = {
  [key: string]: string;
  '文章作成': string;
  'データ分析': string;
  'デザイン': string;
  'チャットボット': string;
  '教育': string;
  'SEO': string;
};