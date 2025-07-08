import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  image?: string;
  thumbnail?: string;
}

export interface GoogleSearchParams {
  query: string;
  country: string;
  maxResults?: number;
}

export interface SerpApiParams {
  query: string;
  country: string;
  maxResults?: number;
}

export class ApiService {
  private googleApiKey?: string;
  private googleSearchEngineId?: string;
  private serpApiKey?: string;

  constructor() {
    this.googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    this.googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    this.serpApiKey = process.env.SERPAPI_KEY;
  }

  async googleCustomSearch(params: GoogleSearchParams): Promise<SearchResult[]> {
    if (!this.googleApiKey || !this.googleSearchEngineId) {
      console.log('Google Search API not configured');
      return [];
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.googleApiKey,
          cx: this.googleSearchEngineId,
          q: params.query,
          num: params.maxResults || 10,
          cr: `country${params.country}`,
          gl: params.country.toLowerCase(),
          searchType: undefined, // Keep web search, not image search
          imgSize: 'medium',
          imgType: 'photo',
          safe: 'medium'
        }
      });

      return response.data.items?.map((item: Record<string, unknown>) => ({
        title: item.title as string,
        url: item.link as string,
        snippet: item.snippet as string,
        image: ((item.pagemap as Record<string, unknown>)?.cse_image as Record<string, unknown>[])?.[0]?.src as string || ((item.pagemap as Record<string, unknown>)?.metatags as Record<string, unknown>[])?.[0]?.['og:image'] as string,
        thumbnail: ((item.pagemap as Record<string, unknown>)?.cse_thumbnail as Record<string, unknown>[])?.[0]?.src as string
      })) || [];
    } catch (error) {
      console.error('Google Search API error:', error);
      return [];
    }
  }

  async serpApiSearch(params: SerpApiParams): Promise<SearchResult[]> {
    if (!this.serpApiKey) {
      console.log('SerpAPI not configured');
      return [];
    }

    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          api_key: this.serpApiKey,
          q: params.query,
          google_domain: `google.${params.country.toLowerCase() === 'us' ? 'com' : params.country.toLowerCase()}`,
          gl: params.country.toLowerCase(),
          hl: 'en',
          num: params.maxResults || 10
        }
      });

      return response.data.organic_results?.map((item: Record<string, unknown>) => ({
        title: item.title as string,
        url: item.link as string,
        snippet: item.snippet as string,
        image: item.thumbnail as string,
        thumbnail: item.thumbnail as string
      })) || [];
    } catch (error) {
      console.error('SerpAPI error:', error);
      return [];
    }
  }

  isGoogleSearchConfigured(): boolean {
    return !!(this.googleApiKey && this.googleSearchEngineId);
  }

  isSerpApiConfigured(): boolean {
    return !!this.serpApiKey;
  }

  getConfiguredSearchEngine(): string {
    if (this.isGoogleSearchConfigured()) return 'google_custom_search';
    if (this.isSerpApiConfigured()) return 'serpapi';
    return 'none';
  }
}