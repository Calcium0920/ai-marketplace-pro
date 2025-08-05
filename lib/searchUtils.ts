import { Product, SearchFilters } from './types';

export function filterProducts(products: Product[], filters: SearchFilters): Product[] {
  let filtered = [...products];

  // カテゴリフィルター
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => 
      product.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  // 価格範囲フィルター
  if (filters.priceRange) {
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange!.min && 
      product.price <= filters.priceRange!.max
    );
  }

  // 評価フィルター
  if (filters.rating) {
    filtered = filtered.filter(product => product.rating >= filters.rating!);
  }

  // ソート
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'popularity':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  }

  return filtered;
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase();
  
  return products.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

export function getUniqueCategories(products: Product[]): string[] {
  const categories = products.map(product => product.category);
  return [...new Set(categories)].sort();
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 10000 };
  
  const prices = products.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

export function getPopularTags(products: Product[], limit: number = 10): string[] {
  const tagCounts: { [key: string]: number } = {};
  
  products.forEach(product => {
    product.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag);
}