// Search result from the actual API response
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

// Enhanced product data structure (for future use)
export interface Product {
  productName: string;
  price: string;
  currency: string;
  link: string;
  seller: string;
  sellerRating: number;
  shippingCost: string;
  totalCost: string;
  availability: string;
  condition: string;
  warranty?: string;
  estimatedDelivery: string;
  trustScore: number;
  sourceWebsite: string;
  lastUpdated: string;
  image?: string;
  specifications?: Record<string, string>;
  reviews?: {
    count: number;
    averageRating: number;
  };
}

export interface ProductSearchRequest {
  country: string;
  query: string;
  options?: {
    maxResults?: number;
    includeShipping?: boolean;
    minRating?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: 'price' | 'rating' | 'relevance';
    categories?: string[];
  };
}

// Current API response format
export interface ProductSearchResponse {
  query: string;
  country: string;
  searchResultsCount: number;
  searchResults: SearchResult[];
  searchEngineUsed: string;
}

// Enhanced search response (for future use)
export interface EnhancedProductSearchResponse {
  query: string;
  country: string;
  resultsCount: number;
  searchTime: string;
  results: Product[];
  alternatives?: {
    productName: string;
    reason: string;
    price: string;
  }[];
  metadata?: {
    sourcesScrapped: string[];
    cacheHit: boolean;
    regionMapped: boolean;
  };
}

export interface ProcessedQuery {
  originalQuery: string;
  normalizedQuery: string;
  productCategory: string;
  brand?: string;
  model?: string;
  specifications: Record<string, string>;
  alternativeSearchTerms: string[];
  localBrandEquivalents: string[];
  suggestedCategories: string[];
}