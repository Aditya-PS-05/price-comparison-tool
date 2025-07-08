import { ApiService, SearchResult } from './apiService';
import { RegionMapper } from './regionMapper';
import { ProductAvailabilityChecker, SearchResultWithAvailability } from './productAvailabilityChecker';

export interface SearchOptions {
  maxResults?: number;
  includeShipping?: boolean;
  minRating?: number;
}

export interface SearchContext {
  query: string;
  country: string;
  searchResults: SearchResult[];
  availableResults?: SearchResultWithAvailability[];
  searchEngine: string;
  timestamp: string;
  availabilityStats?: {
    total: number;
    available: number;
    withPrice: number;
    highConfidence: number;
  };
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
      
      // Build localized search query with site restrictions
      const localizedQuery = RegionMapper.getLocalizedSearchQuery(query, countryCode);
      const searchQuery = `${localizedQuery} price ${new Date().getFullYear()} site:${regionalSites.join(' OR site:')}`;
      
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
      
      // Check availability of products
      const resultsWithAvailability = await ProductAvailabilityChecker.batchAvailabilityCheck(searchResults);
      const availableResults = ProductAvailabilityChecker.filterAvailableProducts(resultsWithAvailability, 0.5);
      const availabilityStats = ProductAvailabilityChecker.getAvailabilitySummary(resultsWithAvailability);
      
      console.log(`Availability: ${availabilityStats.available}/${availabilityStats.total} available products`);
      
      return {
        query,
        country: countryCode,
        searchResults,
        availableResults,
        searchEngine,
        timestamp: new Date().toISOString(),
        availabilityStats
      };
    } catch (error) {
      console.error('Web search error:', error);
      return {
        query,
        country: country.toUpperCase(),
        searchResults: [],
        availableResults: [],
        searchEngine: 'error',
        timestamp: new Date().toISOString(),
        availabilityStats: { total: 0, available: 0, withPrice: 0, highConfidence: 0 }
      };
    }
  }

  async testSearch(query: string, country: string): Promise<{
    query: string;
    country: string;
    searchResultsCount: number;
    searchResults: SearchResult[];
    availableResultsCount: number;
    availableResults: SearchResult[];
    searchEngineUsed: string;
    timestamp: string;
    availabilityStats?: {
      total: number;
      available: number;
      withPrice: number;
      highConfidence: number;
    };
  }> {
    const searchContext = await this.performWebSearch(query, country);
    
    // Convert available results back to SearchResult format
    const availableResults: SearchResult[] = searchContext.availableResults?.map(result => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet,
      image: result.image,
      thumbnail: result.thumbnail
    })) || [];
    
    return {
      query: searchContext.query,
      country: searchContext.country,
      searchResultsCount: searchContext.searchResults.length,
      searchResults: searchContext.searchResults,
      availableResultsCount: availableResults.length,
      availableResults,
      searchEngineUsed: searchContext.searchEngine,
      timestamp: searchContext.timestamp,
      availabilityStats: searchContext.availabilityStats
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