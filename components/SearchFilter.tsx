// components/SearchFilter.tsx
'use client'
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterState } from '@/lib/types';

interface SearchFilterProps {
  onSearch: (filters: FilterState) => void;
  totalProducts: number;
  filteredCount: number;
}

export default function SearchFilter({ onSearch, totalProducts, filteredCount }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    priceRange: 'all',
    rating: 0,
    sortBy: 'default'
  });

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: '文章作成', label: '文章作成' },
    { value: 'データ分析', label: 'データ分析' },
    { value: 'デザイン', label: 'デザイン' },
    { value: 'チャットボット', label: 'チャットボット' },
    { value: '教育', label: '教育' },
    { value: 'SEO', label: 'SEO' }
  ];

  const priceRanges = [
    { value: 'all', label: 'すべて' },
    { value: '0-1000', label: '¥1,000以下' },
    { value: '1000-3000', label: '¥1,000-3,000' },
    { value: '3000-5000', label: '¥3,000-5,000' },
    { value: '5000+', label: '¥5,000以上' }
  ];

  const sortOptions = [
    { value: 'default', label: 'おすすめ順' },
    { value: 'newest', label: '新着順' },
    { value: 'price-low', label: '価格: 安い順' },
    { value: 'price-high', label: '価格: 高い順' },
    { value: 'rating', label: '評価順' },
    { value: 'popular', label: '人気順' }
  ];

  const handleFilterChange = (newFilters: Partial<FilterState>): void => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onSearch(updatedFilters);
  };

  const clearFilters = (): void => {
    const defaultFilters: FilterState = {
      searchTerm: '',
      category: 'all',
      priceRange: 'all',
      rating: 0,
      sortBy: 'default'
    };
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  const hasActiveFilters = filters.searchTerm || filters.category !== 'all' || 
                          filters.priceRange !== 'all' || filters.rating > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* 基本検索 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* 検索語句 */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="ツールを検索..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* カテゴリ */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange({ category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* 価格範囲 */}
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange({ priceRange: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        {/* ソート */}
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 評価フィルター */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          最低評価
        </label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange({ rating })}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.rating === rating
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {rating === 0 ? 'すべて' : `${rating}★以上`}
            </button>
          ))}
        </div>
      </div>

      {/* 結果表示とクリア */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          {totalProducts}件中 {filteredCount}件を表示
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
            フィルターをクリア
          </button>
        )}
      </div>
    </div>
  );
}