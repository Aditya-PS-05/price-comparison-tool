import { ProductSearchResponse } from './product';

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SearchAPIResponse extends APIResponse<ProductSearchResponse> {
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

export interface HealthCheckResponse extends APIResponse {
  data: {
    status: 'healthy' | 'unhealthy';
    services: {
      database: 'up' | 'down';
      redis: 'up' | 'down';
      llm: 'up' | 'down';
    };
    version: string;
    uptime: number;
  };
}

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix: string;
  namespace: string;
}

export interface LLMConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}