'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterState, SearchFilterProps, DEFAULT_FILTER_STATE, CATEGORIES } from '@/lib/types';

export default function SearchFilter({ onSearch, totalProducts, filteredCount }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // 検索実行（デバウンス付き）
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      onSearch(filters);
    }, 300); // 300ms後に検索実行

    setSearchTimeout(timeoutId);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [filters, onSearch]);

  // フィルター値の更新
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // フィルターリセット
  const resetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
    setShowAdvanced(false);
  };

  // アクティブフィルター数の計算
  const activeFiltersCount = [
    filters.searchQuery,
    filters.category,
    filters.minPrice > 0,
    filters.maxPrice < 100000,
    filters.tags.length > 0
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 検索ボックス */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="AIツールを検索..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
            />
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="lg:w-48">
          <select
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">全カテゴリ</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* 詳細フィルターボタン */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
            showAdvanced 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          詳細フィルター
          {activeFiltersCount > 0 && (
            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
              showAdvanced ? 'bg-blue-500' : 'bg-blue-600 text-white'
            }`}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* リセットボタン */}
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
            リセット
          </button>
        )}
      </div>

      {/* 詳細フィルター */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 価格範囲 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                価格範囲
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="最小"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
                />
                <span className="text-gray-500">〜</span>
                <input
                  type="number"
                  placeholder="最大"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.maxPrice === 100000 ? '' : filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 100000)}
                />
              </div>
            </div>

            {/* 並び順 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び順
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
              >
                <option value="newest">新着順</option>
                <option value="oldest">古い順</option>
                <option value="price-low">価格が安い順</option>
                <option value="price-high">価格が高い順</option>
                <option value="rating">評価が高い順</option>
                <option value="popular">人気順</option>
              </select>
            </div>

            {/* タグフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <input
                type="text"
                placeholder="カンマ区切りで入力"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.tags.join(', ')}
                onChange={(e) => updateFilter('tags', 
                  e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* 検索結果表示 */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          {filteredCount !== totalProducts ? (
            <span>
              {totalProducts}件中 <strong className="text-blue-600">{filteredCount}件</strong> を表示
            </span>
          ) : (
            <span>全 <strong>{totalProducts}件</strong> を表示</span>
          )}
        </div>
        
        {filters.searchQuery && (
          <div>
            「<strong>{filters.searchQuery}</strong>」の検索結果
          </div>
        )}
      </div>
    </div>
  );
}