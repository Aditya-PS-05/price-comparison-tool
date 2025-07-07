import { SearchService } from './searchService';
import { RegionMapper } from './regionMapper';
import { Product, ProductSearchResponse, EnhancedProductSearchResponse } from '../types/product';


export class PriceComparisonService {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  // Method to get the current API format response
  async getSearchResults(
    query: string, 
    country: string
  ): Promise<ProductSearchResponse> {
    const countryCode = country.toUpperCase();
    
    // Perform real web search
    const searchContext = await this.searchService.performWebSearch(query, country);
    
    return {
      query,
      country: countryCode,
      searchResultsCount: searchContext.searchResults.length,
      searchResults: searchContext.searchResults,
      searchEngineUsed: 'google_custom_search'
    };
  }

  // Enhanced method for future use with product data
  async getEnhancedPriceComparison(
    query: string, 
    country: string
  ): Promise<EnhancedProductSearchResponse> {
    const countryCode = country.toUpperCase();
    const currency = RegionMapper.getCurrency(countryCode);
    const region = this.getRegionName(countryCode);

    // Perform real web search
    const searchContext = await this.searchService.performWebSearch(query, country);
    
    // Generate mock products for demonstration
    const mockProducts = this.generateMockProducts(query, currency);
    
    return {
      query,
      country: region,
      resultsCount: mockProducts.length,
      searchTime: new Date().toISOString(),
      results: mockProducts,
      metadata: {
        sourcesScrapped: searchContext.searchResults.map(r => {
          try {
            return new URL(r.url).hostname;
          } catch {
            return 'unknown';
          }
        }),
        cacheHit: false,
        regionMapped: true
      }
    };
  }

  private generateMockProducts(query: string, currency: string): Product[] {
    const products: Product[] = [];
    const basePrice = 999;
    const retailers = ['Amazon', 'Best Buy', 'Apple Store', 'Newegg', 'B&H Photo', 'Walmart'];
    
    for (let i = 0; i < Math.min(10, retailers.length); i++) {
      const price = (basePrice + (Math.random() * 200 - 100)).toFixed(2);
      const shippingCost = Math.random() > 0.5 ? '0.00' : '9.99';
      const totalCost = (parseFloat(price) + parseFloat(shippingCost)).toFixed(2);
      
      products.push({
        productName: `${query} - ${retailers[i]}`,
        price,
        currency,
        link: `https://${retailers[i].toLowerCase().replace(' ', '')}.com/product`,
        seller: retailers[i],
        sellerRating: 4.0 + Math.random(),
        shippingCost,
        totalCost,
        availability: 'In Stock',
        condition: 'New',
        warranty: '1 year',
        estimatedDelivery: '3-5 business days',
        trustScore: 0.8 + Math.random() * 0.2,
        sourceWebsite: `${retailers[i].toLowerCase().replace(' ', '')}.com`,
        lastUpdated: new Date().toISOString(),
        specifications: {},
        reviews: {
          count: Math.floor(Math.random() * 1000) + 100,
          averageRating: 4.0 + Math.random()
        }
      });
    }
    
    return products;
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

  getSupportedCountries(): { [key: string]: unknown } {
    return {
      supportedCountries: this.searchService.getSupportedCountries(),
      details: Object.fromEntries(
        this.searchService.getSupportedCountries().map(country => [
          country,
          {
            sites: RegionMapper.getSearchDomains(country),
            currency: RegionMapper.getCurrency(country),
            language: RegionMapper.getLanguage(country),
            region: RegionMapper.getRegion(country)
          }
        ])
      )
    };
  }

  getHealthStatus(): {
    status: string;
    timestamp: string;
    searchEngineStatus: unknown;
    supportedCountries: string[];
  } {
    const searchEngineStatus = this.searchService.getSearchEngineStatus();
    
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      searchEngineStatus,
      supportedCountries: this.searchService.getSupportedCountries()
    };
  }
}