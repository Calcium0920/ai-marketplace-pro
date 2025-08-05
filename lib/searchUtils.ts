// lib/searchUtils.ts - 検索・フィルタリング機能

import { Product, FilterState } from './types';

/**
 * 商品をフィルタリングする関数
 */
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  let filtered = [...products];

  // 検索クエリでフィルタリング
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes(query)
      )) ||
      (product.creator && product.creator.toLowerCase().includes(query))
    );
  }

  // カテゴリでフィルタリング
  if (filters.category) {
    filtered = filtered.filter(product => 
      product.category === filters.category
    );
  }

  // 価格範囲でフィルタリング
  if (filters.minPrice > 0) {
    filtered = filtered.filter(product => 
      product.price >= filters.minPrice
    );
  }

  if (filters.maxPrice < 100000) {
    filtered = filtered.filter(product => 
      product.price <= filters.maxPrice
    );
  }

  // タグでフィルタリング
  if (filters.tags.length > 0) {
    filtered = filtered.filter(product => 
      product.tags && filters.tags.some(filterTag => 
        product.tags.some(productTag => 
          productTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    );
  }

  // ソート
  filtered = sortProducts(filtered, filters.sortBy);

  return filtered;
}

/**
 * 商品をソートする関数
 */
export function sortProducts(products: Product[], sortBy: FilterState['sortBy']): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    case 'popular':
      return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    
    default:
      return sorted;
  }
}

/**
 * 検索ハイライト用の関数
 */
export function highlightSearchQuery(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

/**
 * 正規表現エスケープ用のユーティリティ
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 商品の関連度を計算する関数
 */
export function calculateRelevance(product: Product, query: string): number {
  if (!query.trim()) return 0;
  
  const lowerQuery = query.toLowerCase();
  let score = 0;

  // タイトルでの一致（最高スコア）
  if (product.title.toLowerCase().includes(lowerQuery)) {
    score += 10;
  }

  // 説明での一致
  if (product.description.toLowerCase().includes(lowerQuery)) {
    score += 5;
  }

  // カテゴリでの一致
  if (product.category.toLowerCase().includes(lowerQuery)) {
    score += 3;
  }

  // タグでの一致
  if (product.tags) {
    const tagMatches = product.tags.filter(tag => 
      tag.toLowerCase().includes(lowerQuery)
    ).length;
    score += tagMatches * 2;
  }

  // 作成者での一致
  if (product.creator && product.creator.toLowerCase().includes(lowerQuery)) {
    score += 1;
  }

  return score;
}

/**
 * 商品を関連度でソートする関数
 */
export function sortByRelevance(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  return [...products].sort((a, b) => {
    const scoreA = calculateRelevance(a, query);
    const scoreB = calculateRelevance(b, query);
    return scoreB - scoreA;
  });
}

/**
 * 人気のタグを取得する関数
 */
export function getPopularTags(products: Product[], limit: number = 10): string[] {
  const tagCounts: { [key: string]: number } = {};

  products.forEach(product => {
    if (product.tags) {
      product.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag);
}

/**
 * カテゴリ別の商品数を取得する関数
 */
export function getCategoryCounts(products: Product[]): { [category: string]: number } {
  const counts: { [category: string]: number } = {};

  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });

  return counts;
}

/**
 * 価格範囲の統計を取得する関数
 */
export function getPriceStats(products: Product[]): {
  min: number;
  max: number;
  average: number;
  median: number;
} {
  if (products.length === 0) {
    return { min: 0, max: 0, average: 0, median: 0 };
  }

  const prices = products.map(p => p.price).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const median = prices.length % 2 === 0
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)];

  return { min, max, average, median };
}

/**
 * 検索候補を生成する関数
 */
export function generateSearchSuggestions(products: Product[], query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  products.forEach(product => {
    // タイトルから提案
    if (product.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.title);
    }

    // タグから提案
    if (product.tags) {
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          suggestions.add(tag);
        }
      });
    }

    // カテゴリから提案
    if (product.category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.category);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}