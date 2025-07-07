import { ApiService, SearchResult } from './apiService';
import { RegionMapper } from './regionMapper';

export interface SearchOptions {
  maxResults?: number;
  includeShipping?: boolean;
  minRating?: number;
}

export interface SearchContext {
  query: string;
  country: string;
  searchResults: SearchResult[];
  searchEngine: string;
  timestamp: string;
}

export class SearchService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async performWebSearch(
    query: string, 
    country: string, 
    options: SearchOptions = {}
  ): Promise<SearchContext> {
    try {
      const countryCode = country.toUpperCase();
      const regionalSites = RegionMapper.getSearchDomains(countryCode);
      const region = this.getRegionName(countryCode);
      
      // Build search query with site restrictions
      const searchQuery = `${query} price buy ${region} 2024 site:${regionalSites.join(' OR site:')}`;
      
      // Try Google Custom Search first, then SerpAPI
      let searchResults: SearchResult[] = [];
      let searchEngine = 'none';
      
      if (this.apiService.isGoogleSearchConfigured()) {
        searchResults = await this.apiService.googleCustomSearch({
          query: searchQuery,
          country: countryCode,
          maxResults: options.maxResults || 100
        });
        searchEngine = 'google_custom_search';
      }
      
      if (searchResults.length === 0 && this.apiService.isSerpApiConfigured()) {
        searchResults = await this.apiService.serpApiSearch({
          query: searchQuery,
          country: countryCode,
          maxResults: options.maxResults || 100
        });
        searchEngine = 'serpapi';
      }
      
      console.log(`Found ${searchResults.length} search results for "${query}" in ${country}`);
      
      return {
        query,
        country: countryCode,
        searchResults,
        searchEngine,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Web search error:', error);
      return {
        query,
        country: country.toUpperCase(),
        searchResults: [],
        searchEngine: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }

  async testSearch(query: string, country: string): Promise<{
    query: string;
    country: string;
    searchResultsCount: number;
    searchResults: SearchResult[];
    searchEngineUsed: string;
    timestamp: string;
  }> {
    const searchContext = await this.performWebSearch(query, country);
    
    return {
      query: searchContext.query,
      country: searchContext.country,
      searchResultsCount: searchContext.searchResults.length,
      searchResults: searchContext.searchResults,
      searchEngineUsed: searchContext.searchEngine,
      timestamp: searchContext.timestamp
    };
  }

  private getRegionName(countryCode: string): string {
    const regionMap: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada',
      'UK': 'United Kingdom',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'IN': 'India',
      'JP': 'Japan',
      'AU': 'Australia',
      'SG': 'Singapore',
      'AE': 'United Arab Emirates',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'ZA': 'South Africa'
    };
    
    return regionMap[countryCode] || countryCode;
  }

  getSupportedCountries(): string[] {
    return RegionMapper.getSupportedCountries();
  }

  getSearchEngineStatus(): {
    googleConfigured: boolean;
    serpApiConfigured: boolean;
    activeEngine: string;
  } {
    return {
      googleConfigured: this.apiService.isGoogleSearchConfigured(),
      serpApiConfigured: this.apiService.isSerpApiConfigured(),
      activeEngine: this.apiService.getConfiguredSearchEngine()
    };
  }
}