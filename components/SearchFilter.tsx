'use client'
import React, { useState } from 'react';
import { SearchFilters } from '@/lib/types';

interface SearchFilterProps {
  onFilterChange: (filters: SearchFilters) => void;
  categories: string[];
  priceRange: { min: number; max: number };
}

export default function SearchFilter({ onFilterChange, categories, priceRange }: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: { min: priceRange.min, max: priceRange.max },
    rating: 0,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      category: 'all',
      priceRange: { min: priceRange.min, max: priceRange.max },
      rating: 0,
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* カテゴリフィルター */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">すべて</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* 価格範囲 */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">価格範囲</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={filters.priceRange?.min || 0}
              onChange={(e) => handleFilterChange({ 
                priceRange: { 
                  min: Number(e.target.value), 
                  max: filters.priceRange?.max || priceRange.max 
                } 
              })}
              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
              min="0"
            />
            <span className="text-gray-500">〜</span>
            <input
              type="number"
              value={filters.priceRange?.max || priceRange.max}
              onChange={(e) => handleFilterChange({ 
                priceRange: { 
                  min: filters.priceRange?.min || 0, 
                  max: Number(e.target.value) 
                } 
              })}
              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
              min="0"
            />
          </div>
        </div>

        {/* 評価フィルター */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">評価</label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange({ rating: Number(e.target.value) })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>すべて</option>
            <option value={4}>★4以上</option>
            <option value={3}>★3以上</option>
            <option value={2}>★2以上</option>
            <option value={1}>★1以上</option>
          </select>
        </div>

        {/* ソート */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">並び順</label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">投稿日</option>
              <option value="price">価格</option>
              <option value="rating">評価</option>
              <option value="popularity">人気</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
          </div>
        </div>

        {/* リセットボタン */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-transparent mb-1">.</label>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors"
          >
            リセット
          </button>
        </div>
      </div>

      {/* アクティブなフィルター表示 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.category !== 'all' && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            カテゴリ: {filters.category}
          </span>
        )}
        {filters.rating && filters.rating > 0 && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            ★{filters.rating}以上
          </span>
        )}
        {(filters.priceRange?.min !== priceRange.min || filters.priceRange?.max !== priceRange.max) && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            ¥{filters.priceRange?.min?.toLocaleString()} - ¥{filters.priceRange?.max?.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}