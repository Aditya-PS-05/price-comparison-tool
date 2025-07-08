/**
 * Reliable URL Generator Service
 * 
 * This service generates reliable, working URLs for e-commerce searches
 * instead of using potentially broken product page URLs from search results.
 */

export interface ReliableUrlResult {
  originalUrl: string;
  reliableUrl: string;
  urlType: 'search' | 'product' | 'unknown';
  confidence: number;
  platform: string;
}

export class ReliableUrlGenerator {
  
  /**
   * Generate a reliable search URL for a product query on a specific platform
   */
  static generateReliableUrl(query: string, originalUrl: string, title: string): ReliableUrlResult {
    const urlLower = originalUrl.toLowerCase();
    const cleanQuery = this.cleanQueryForUrl(query);
    let reliableUrl = originalUrl;
    let urlType: 'search' | 'product' | 'unknown' = 'unknown';
    let confidence = 0.5;
    let platform = 'unknown';

    // Amazon URLs
    if (urlLower.includes('amazon.')) {
      platform = 'Amazon';
      const domain = this.extractDomain(originalUrl);
      
      // Check if it's already a search URL
      if (urlLower.includes('/s?') || urlLower.includes('/search?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        // Generate reliable Amazon search URL
        reliableUrl = `https://${domain}/s?k=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Flipkart URLs
    else if (urlLower.includes('flipkart.')) {
      platform = 'Flipkart';
      
      // Check if it's already a search URL
      if (urlLower.includes('/search?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        // Generate reliable Flipkart search URL
        reliableUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(cleanQuery.replace(/\s+/g, '-'))}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // eBay URLs
    else if (urlLower.includes('ebay.')) {
      platform = 'eBay';
      const domain = this.extractDomain(originalUrl);
      
      if (urlLower.includes('/sch/')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://${domain}/sch/i.html?_nkw=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Walmart URLs
    else if (urlLower.includes('walmart.')) {
      platform = 'Walmart';
      
      if (urlLower.includes('/search?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://www.walmart.com/search?q=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Target URLs
    else if (urlLower.includes('target.')) {
      platform = 'Target';
      
      if (urlLower.includes('/s?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Best Buy URLs
    else if (urlLower.includes('bestbuy.')) {
      platform = 'Best Buy';
      
      if (urlLower.includes('/site/searchpage.jsp')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Myntra URLs
    else if (urlLower.includes('myntra.')) {
      platform = 'Myntra';
      
      if (urlLower.includes('/search?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://www.myntra.com/search?q=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Snapdeal URLs
    else if (urlLower.includes('snapdeal.')) {
      platform = 'Snapdeal';
      
      if (urlLower.includes('/search?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://www.snapdeal.com/search?keyword=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // AliExpress URLs
    else if (urlLower.includes('aliexpress.')) {
      platform = 'AliExpress';
      
      if (urlLower.includes('/wholesale?')) {
        reliableUrl = originalUrl;
        urlType = 'search';
        confidence = 0.9;
      } else {
        reliableUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(cleanQuery)}`;
        urlType = 'search';
        confidence = 0.8;
      }
    }
    
    // Generic e-commerce sites - try to detect if it's a product page
    else if (this.isEcommerceSite(originalUrl)) {
      platform = this.extractDomain(originalUrl);
      
      // If it looks like a specific product page, reduce confidence
      if (this.isSpecificProductPage(originalUrl)) {
        urlType = 'product';
        confidence = 0.3; // Low confidence for specific product pages
      } else {
        urlType = 'search';
        confidence = 0.6;
      }
    }
    
    return {
      originalUrl,
      reliableUrl,
      urlType,
      confidence,
      platform
    };
  }
  
  /**
   * Clean and normalize query for URL generation
   */
  private static cleanQueryForUrl(query: string): string {
    return query
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, ' ') // Normalize spaces
      .slice(0, 100); // Limit length
  }
  
  /**
   * Extract domain from URL
   */
  private static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url.split('/')[0];
    }
  }
  
  /**
   * Check if URL is from a known e-commerce site
   */
  private static isEcommerceSite(url: string): boolean {
    const ecommerceSites = [
      'amazon.', 'flipkart.', 'myntra.', 'snapdeal.', 'paytm',
      'ebay.', 'walmart.', 'target.', 'bestbuy.', 'costco.',
      'alibaba.', 'aliexpress.', 'jd.', 'tmall.',
      'mercadolibre.', 'shopee.', 'lazada.', 'qoo10.',
      'noon.', 'souq.', 'jumia.', 'takealot.'
    ];
    
    const urlLower = url.toLowerCase();
    return ecommerceSites.some(site => urlLower.includes(site));
  }
  
  /**
   * Check if URL appears to be a specific product page (likely to be broken)
   */
  private static isSpecificProductPage(url: string): boolean {
    const urlLower = url.toLowerCase();
    
    // Patterns that indicate specific product pages
    const productPagePatterns = [
      '/p/', '/dp/', '/product/', '/item/',
      '/pd/', '/pr/', '/products/',
      // Flipkart specific patterns
      '/p/itm', '/product/',
      // Amazon specific patterns
      '/dp/', '/gp/product/',
      // Generic patterns with product IDs
      /\/[a-z0-9]{8,}/i
    ];
    
    return productPagePatterns.some(pattern => {
      if (typeof pattern === 'string') {
        return urlLower.includes(pattern);
      } else {
        return pattern.test(url);
      }
    });
  }
  
  /**
   * Batch process multiple URLs for reliability
   */
  static batchGenerateReliableUrls(
    query: string,
    searchResults: Array<{title: string, url: string, snippet: string}>
  ): Array<{title: string, url: string, snippet: string, reliableUrl: ReliableUrlResult}> {
    return searchResults.map(result => ({
      ...result,
      reliableUrl: this.generateReliableUrl(query, result.url, result.title)
    }));
  }
  
  /**
   * Filter results by URL reliability
   */
  static filterReliableResults(
    results: Array<{reliableUrl: ReliableUrlResult}>,
    minConfidence: number = 0.6
  ): Array<{reliableUrl: ReliableUrlResult}> {
    return results.filter(result => 
      result.reliableUrl.confidence >= minConfidence
    );
  }
}