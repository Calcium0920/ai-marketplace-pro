export interface Product {
  id: string | number;
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
  endpointUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface CartItem extends Product {
  quantity?: number;
}

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  customerInfo: {
    name: string;
    email: string;
  };
}

export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  sortBy?: 'price' | 'rating' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}