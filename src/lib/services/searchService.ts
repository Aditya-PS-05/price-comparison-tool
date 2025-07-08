import { ApiService, SearchResult } from './apiService';
import { RegionMapper } from './regionMapper';
import { ProductAvailabilityChecker, SearchResultWithAvailability } from './productAvailabilityChecker';
import { ProductDataExtractor, ExtractedProductData } from './productDataExtractor';

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
  extractedProducts?: ExtractedProductData[];
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
      
      // Enhanced query building with multiple search strategies
      const searches = this.buildEnhancedSearchQueries(query, countryCode, regionalSites);
      
      let allResults: SearchResult[] = [];
      let searchEngine = 'none';
      
      // Execute multiple search strategies
      for (const searchQuery of searches) {
        let searchResults: SearchResult[] = [];
        
        if (this.apiService.isGoogleSearchConfigured()) {
          searchResults = await this.apiService.googleCustomSearch({
            query: searchQuery,
            country: countryCode,
            maxResults: Math.min(options.maxResults || 50, 50)
          });
          searchEngine = 'google_custom_search';
        }
        
        if (searchResults.length === 0 && this.apiService.isSerpApiConfigured()) {
          searchResults = await this.apiService.serpApiSearch({
            query: searchQuery,
            country: countryCode,
            maxResults: Math.min(options.maxResults || 50, 50)
          });
          searchEngine = 'serpapi';
        }
        
        allResults = allResults.concat(searchResults);
        
        // Break early if we have enough results
        if (allResults.length >= (options.maxResults || 100)) {
          break;
        }
      }
      
      // Remove duplicates based on URL
      const uniqueResults = this.removeDuplicateResults(allResults);
      
      console.log(`Found ${uniqueResults.length} unique search results for "${query}" in ${country}`);
      
      // Enhanced availability checking with better accuracy
      const resultsWithAvailability = await ProductAvailabilityChecker.batchAvailabilityCheck(uniqueResults);
      const availableResults = ProductAvailabilityChecker.filterAvailableProducts(resultsWithAvailability, 0.4);
      const availabilityStats = ProductAvailabilityChecker.getAvailabilitySummary(resultsWithAvailability);
      
      // Enhanced product data extraction
      const extractedProducts = ProductDataExtractor.batchExtractProductData(uniqueResults, countryCode);
      const filteredProducts = ProductDataExtractor.filterByConfidence(extractedProducts, 0.5);
      const sortedProducts = ProductDataExtractor.sortByRelevance(filteredProducts);
      
      console.log(`Availability: ${availabilityStats.available}/${availabilityStats.total} available products`);
      console.log(`Extracted: ${sortedProducts.length} high-confidence products`);
      
      return {
        query,
        country: countryCode,
        searchResults: uniqueResults,
        availableResults,
        extractedProducts: sortedProducts,
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
        extractedProducts: [],
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

  private buildEnhancedSearchQueries(query: string, countryCode: string, sites: string[]): string[] {
    const queries: string[] = [];
    const currentYear = new Date().getFullYear();
    
    // Strategy 1: Targeted shopping sites with price keywords
    const topSites = sites.slice(0, 5);
    queries.push(`"${query}" price buy ${currentYear} site:${topSites.join(' OR site:')}`);
    
    // Strategy 2: Broader product search with shopping keywords
    queries.push(`${query} shop online store price ${currentYear}`);
    
    // Strategy 3: Deal and discount focused search
    queries.push(`"${query}" discount sale deal offer ${currentYear}`);
    
    // Strategy 4: Country-specific localized search
    const localizedQuery = RegionMapper.getLocalizedSearchQuery(query, countryCode);
    queries.push(`${localizedQuery} ${currentYear}`);
    
    // Strategy 5: Product availability check
    queries.push(`"${query}" available "in stock" buy now ${currentYear}`);
    
    return queries;
  }
  
  private removeDuplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    const unique: SearchResult[] = [];
    
    for (const result of results) {
      // Normalize URL for comparison
      const normalizedUrl = result.url.replace(/[?#].*$/, '').toLowerCase();
      
      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        unique.push(result);
      }
    }
    
    return unique;
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