/**
 * Product Availability Checker Service
 * 
 * This service validates that search results are actual available products
 * rather than just informational pages or out-of-stock items.
 */

export interface AvailabilityCheck {
  isAvailable: boolean;
  hasPrice: boolean;
  inStock: boolean;
  isProductPage: boolean;
  confidence: number; // 0-1 score
  reasons: string[];
}

export interface SearchResultWithAvailability {
  title: string;
  url: string;
  snippet: string;
  image?: string;
  thumbnail?: string;
  availability: AvailabilityCheck;
}

export class ProductAvailabilityChecker {
  
  /**
   * Quick availability check based on URL and snippet analysis
   */
  static quickAvailabilityCheck(url: string, title: string, snippet: string): AvailabilityCheck {
    const reasons: string[] = [];
    let confidence = 0.5;
    let isAvailable = true;
    let hasPrice = false;
    let inStock = true;
    let isProductPage = true;

    // URL Analysis
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();
    const snippetLower = snippet.toLowerCase();

    // Check if it's a product page (positive indicators)
    const productPageIndicators = [
      '/product/', '/item/', '/p/', '/dp/', '/products/',
      'buy-', 'shop-', 'purchase-', '/buy/', '/shop/',
      'amazon.', 'flipkart.', 'myntra.', 'snapdeal.',
      'ebay.', 'walmart.', 'target.', 'bestbuy.'
    ];

    const hasProductIndicator = productPageIndicators.some(indicator => 
      urlLower.includes(indicator)
    );

    if (hasProductIndicator) {
      confidence += 0.2;
      reasons.push('URL suggests product page');
    }

    // Check for non-product pages (negative indicators)
    const nonProductIndicators = [
      '/search', '/category', '/browse', '/help', '/support',
      '/about', '/contact', '/blog', '/news', '/article',
      '/compare', '/review', '/tutorial', '/guide',
      'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
      'wikipedia.org', 'reddit.com', 'quora.com'
    ];

    const hasNonProductIndicator = nonProductIndicators.some(indicator => 
      urlLower.includes(indicator)
    );

    if (hasNonProductIndicator) {
      isProductPage = false;
      isAvailable = false;
      confidence -= 0.4;
      reasons.push('URL suggests non-product page');
    }

    // Price indicators in snippet
    const pricePatterns = [
      /\$[\d,]+\.?\d*/g,
      /₹[\d,]+\.?\d*/g,
      /£[\d,]+\.?\d*/g,
      /€[\d,]+\.?\d*/g,
      /¥[\d,]+\.?\d*/g,
      /\d+\.\d+.*USD/gi,
      /\d+\.\d+.*INR/gi,
      /\d+\.\d+.*GBP/gi,
      /price.*\d+/gi,
      /rs\.?\s*\d+/gi,
      /cost.*\d+/gi
    ];

    const hasPriceInSnippet = pricePatterns.some(pattern => 
      pattern.test(snippet) || pattern.test(title)
    );

    if (hasPriceInSnippet) {
      hasPrice = true;
      confidence += 0.3;
      reasons.push('Price information found');
    }

    // Stock status indicators
    const stockIndicators = {
      available: [
        'in stock', 'available', 'buy now', 'add to cart',
        'shop now', 'purchase', 'order now', 'get it',
        'ships', 'delivery', 'free shipping'
      ],
      unavailable: [
        'out of stock', 'sold out', 'unavailable', 'not available',
        'discontinued', 'coming soon', 'pre-order', 'notify me',
        'temporarily unavailable', 'currently unavailable'
      ]
    };

    const hasAvailableIndicator = stockIndicators.available.some(indicator =>
      snippetLower.includes(indicator) || titleLower.includes(indicator)
    );

    const hasUnavailableIndicator = stockIndicators.unavailable.some(indicator =>
      snippetLower.includes(indicator) || titleLower.includes(indicator)
    );

    if (hasAvailableIndicator) {
      confidence += 0.2;
      reasons.push('Availability indicators found');
    }

    if (hasUnavailableIndicator) {
      inStock = false;
      isAvailable = false;
      confidence -= 0.5;
      reasons.push('Unavailability indicators found');
    }

    // Title analysis for product-like content
    const productTitleIndicators = [
      'buy', 'price', 'purchase', 'shop', 'deal', 'offer',
      'sale', 'discount', 'online', 'store'
    ];

    const hasProductTitle = productTitleIndicators.some(indicator =>
      titleLower.includes(indicator)
    );

    if (hasProductTitle) {
      confidence += 0.1;
      reasons.push('Product-related title');
    }

    // App store detection (usually not actual shopping)
    const appStoreIndicators = [
      'app store', 'play store', 'download', 'install',
      'apps.apple.com', 'play.google.com'
    ];

    const isAppStore = appStoreIndicators.some(indicator =>
      urlLower.includes(indicator) || titleLower.includes(indicator)
    );

    if (isAppStore) {
      isProductPage = false;
      isAvailable = false;
      confidence -= 0.6;
      reasons.push('App store listing detected');
    }

    // Country-specific e-commerce site validation
    const ecommerceSites = [
      'amazon.', 'flipkart.', 'myntra.', 'snapdeal.', 'paytm',
      'ebay.', 'walmart.', 'target.', 'bestbuy.', 'costco.',
      'alibaba.', 'aliexpress.', 'jd.', 'tmall.',
      'mercadolibre.', 'shopee.', 'lazada.', 'qoo10.',
      'noon.', 'souq.', 'jumia.', 'takealot.'
    ];

    const isEcommerceSite = ecommerceSites.some(site =>
      urlLower.includes(site)
    );

    if (isEcommerceSite) {
      confidence += 0.3;
      reasons.push('Known e-commerce platform');
    }

    // Final availability determination
    isAvailable = isProductPage && inStock && confidence > 0.4;

    // Clamp confidence between 0 and 1
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      isAvailable,
      hasPrice,
      inStock,
      isProductPage,
      confidence,
      reasons
    };
  }

  /**
   * Batch check availability for multiple search results
   */
  static async batchAvailabilityCheck(
    searchResults: Array<{title: string, url: string, snippet: string, image?: string, thumbnail?: string}>
  ): Promise<SearchResultWithAvailability[]> {
    const results = searchResults.map(result => {
      const availability = this.quickAvailabilityCheck(result.url, result.title, result.snippet);
      
      return {
        ...result,
        availability
      };
    });

    // Log availability stats
    const totalResults = results.length;
    const availableResults = results.filter(r => r.availability.isAvailable).length;
    const withPrices = results.filter(r => r.availability.hasPrice).length;
    
    console.log(`Availability Check: ${availableResults}/${totalResults} available, ${withPrices} with prices`);

    return results;
  }

  /**
   * Filter only available products with high confidence
   */
  static filterAvailableProducts(
    resultsWithAvailability: SearchResultWithAvailability[],
    minConfidence: number = 0.6
  ): SearchResultWithAvailability[] {
    return resultsWithAvailability.filter(result => 
      result.availability.isAvailable && 
      result.availability.confidence >= minConfidence
    );
  }

  /**
   * Enhanced availability check with external validation
   * (For future implementation with actual HTTP requests)
   */
  static async deepAvailabilityCheck(url: string): Promise<AvailabilityCheck> {
    // TODO: Implement actual HTTP request to check page content
    // For now, return quick check result
    return this.quickAvailabilityCheck(url, '', '');
  }

  /**
   * Get availability summary for logging/debugging
   */
  static getAvailabilitySummary(results: SearchResultWithAvailability[]): {
    total: number;
    available: number;
    withPrice: number;
    highConfidence: number;
    avgConfidence: number;
  } {
    const total = results.length;
    const available = results.filter(r => r.availability.isAvailable).length;
    const withPrice = results.filter(r => r.availability.hasPrice).length;
    const highConfidence = results.filter(r => r.availability.confidence >= 0.7).length;
    const avgConfidence = results.reduce((sum, r) => sum + r.availability.confidence, 0) / total;

    return {
      total,
      available,
      withPrice,
      highConfidence,
      avgConfidence: Math.round(avgConfidence * 100) / 100
    };
  }
}