export interface Product {
  id: number | string
  title: string
  description: string
  price: number
  category: string
  tags?: string[]
  rating?: number
  reviewCount?: number
  icon: string
  createdAt?: string
}

export interface FilterState {
  searchTerm: string
  category: string
  priceRange: string
  rating: number
  sortBy: string
}

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  let filtered = [...products]

  // テキスト検索
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes(searchLower)
      ))
    )
  }

  // カテゴリフィルター
  if (filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category)
  }

  // 価格フィルター
  if (filters.priceRange !== 'all') {
    const [min, max] = filters.priceRange.split('-').map(Number)
    if (filters.priceRange.includes('+')) {
      const minPrice = Number(filters.priceRange.replace('+', ''))
      filtered = filtered.filter(product => product.price >= minPrice)
    } else if (max) {
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      )
    } else {
      filtered = filtered.filter(product => product.price <= min)
    }
  }

  // 評価フィルター
  if (filters.rating > 0) {
    filtered = filtered.filter(product => 
      (product.rating || 0) >= filters.rating
    )
  }

  // ソート
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'newest':
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      break
    case 'popular':
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      break
    default:
      // デフォルトソート（評価と人気度の組み合わせ）
      filtered.sort((a, b) => {
        const scoreA = (a.rating || 0) * 0.7 + (a.reviewCount || 0) * 0.3
        const scoreB = (b.rating || 0) * 0.7 + (b.reviewCount || 0) * 0.3
        return scoreB - scoreA
      })
  }

  return filtered
}

export function getSearchSuggestions(products: Product[], query: string): string[] {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  products.forEach(product => {
    // タイトルから抽出
    if (product.title.toLowerCase().includes(queryLower)) {
      suggestions.add(product.title)
    }

    // カテゴリから抽出
    if (product.category.toLowerCase().includes(queryLower)) {
      suggestions.add(product.category)
    }

    // タグから抽出
    product.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5)
}