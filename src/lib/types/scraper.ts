import { Product } from './product';

export interface ScraperConfig {
  baseUrl: string;
  selectors: {
    productName: string;
    price: string;
    link: string;
    seller: string;
    rating: string;
    availability: string;
    image?: string;
    shipping?: string;
  };
  headers?: Record<string, string>;
  rateLimit?: {
    requests: number;
    per: number; // seconds
  };
  antiDetection?: {
    useProxy: boolean;
    rotateUserAgent: boolean;
    randomDelay: boolean;
  };
}

export interface ScraperResult {
  products: Product[];
  metadata: {
    sourceUrl: string;
    scrapedAt: string;
    totalFound: number;
    success: boolean;
    error?: string;
  };
}

export interface RegionalSiteMapping {
  [countryCode: string]: {
    sites: string[];
    currency: string;
    language: string;
    popularCategories: string[];
  };
}

export interface ScrapingStrategy {
  site: string;
  method: 'direct' | 'api' | 'ai-powered';
  config: ScraperConfig;
  priority: number;
}