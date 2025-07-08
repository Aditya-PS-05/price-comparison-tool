/**
 * Product Availability Checker Service
 * 
 * This service validates that search results are actual available products
 * rather than just informational pages or out-of-stock items.
 */

import { ReliableUrlResult } from './reliableUrlGenerator';

export interface AvailabilityCheck {
  isAvailable: boolean;
  hasPrice: boolean;
  inStock: boolean;
  isProductPage: boolean;
  confidence: number; // 0-1 score
  reasons: string[];
  reliableUrl?: ReliableUrlResult;
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
    let confidence = 0.3; // Lower base confidence
    let isAvailable = true;
    let hasPrice = false;
    let inStock = true;
    let isProductPage = true;

    // URL Analysis
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();
    const snippetLower = snippet.toLowerCase();
    // const combinedText = `${titleLower} ${snippetLower}`;

    // Enhanced product page indicators with better coverage
    const productPageIndicators = [
      '/product/', '/item/', '/p/', '/dp/', '/products/', '/prod/',
      'buy-', 'shop-', 'purchase-', '/buy/', '/shop/', '/store/',
      'amazon.', 'flipkart.', 'myntra.', 'snapdeal.', 'paytm',
      'ebay.', 'walmart.', 'target.', 'bestbuy.', 'costco.',
      'newegg.', 'homedepot.', 'lowes.', 'macys.', 'nordstrom.',
      'apple.', 'samsung.', 'nike.', 'adidas.', 'zara.',
      'h&m.', 'uniqlo.', 'gap.', 'oldnavy.', 'banana',
      'aliexpress.', 'alibaba.', 'tmall.', 'jd.', 'taobao.',
      'rakuten.', 'yahoo-shopping.', 'yodobashi.', 'bic-camera.',
      'otto.', 'zalando.', 'mediamarkt.', 'saturn.', 'fnac.',
      'cdiscount.', 'darty.', 'boulanger.', 'elcorteingles.',
      'pccomponentes.', 'bol.com', 'coolblue.', 'wehkamp.',
      'coupang.', 'gmarket.', '11st.', 'ssg.', 'lotte.',
      'takealot.', 'game.', 'makro.', 'incredible.', 'wootware.',
      'noon.', 'souq.', 'carrefour.', 'jumia.', 'konga.',
      'lazada.', 'shopee.', 'qoo10.', 'zalora.', 'courts.',
      'mercadolibre.', 'mercadolivre.', 'submarino.', 'magazineluiza.',
      'casasbahia.', 'extra.', 'fravega.', 'garbarino.', 'musimundo.'
    ];

    const hasProductIndicator = productPageIndicators.some(indicator => 
      urlLower.includes(indicator)
    );

    if (hasProductIndicator) {
      confidence += 0.3;
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

    // Enhanced price detection with more patterns and currencies
    const pricePatterns = [
      // Major currencies with symbols
      /\$[\d,]+\.?\d*/g,
      /₹[\d,]+\.?\d*/g,
      /£[\d,]+\.?\d*/g,
      /€[\d,]+\.?\d*/g,
      /¥[\d,]+\.?\d*/g,
      /₩[\d,]+\.?\d*/g,
      /R\$[\d,]+\.?\d*/g,
      /C\$[\d,]+\.?\d*/g,
      /A\$[\d,]+\.?\d*/g,
      /S\$[\d,]+\.?\d*/g,
      /﷼[\d,]+\.?\d*/g,
      /د\.إ[\d,]+\.?\d*/g,
      
      // Currency codes
      /\d+[.,]\d+\s*(USD|INR|GBP|EUR|JPY|CNY|KRW|BRL|CAD|AUD|SGD|AED|SAR|ZAR|EGP|MXN|ARS)/gi,
      /\d+\s*(USD|INR|GBP|EUR|JPY|CNY|KRW|BRL|CAD|AUD|SGD|AED|SAR|ZAR|EGP|MXN|ARS)/gi,
      
      // Price keywords
      /price[:\s]*\d+/gi,
      /cost[:\s]*\d+/gi,
      /rs\.?\s*\d+/gi,
      /rm\s*\d+/gi,
      /php\s*\d+/gi,
      /thb\s*\d+/gi,
      /idr\s*\d+/gi,
      /vnd\s*\d+/gi,
      
      // Common price formats
      /\d+[.,]\d+\s*only/gi,
      /only\s*\d+[.,]\d+/gi,
      /from\s*\d+[.,]\d+/gi,
      /starting\s*\d+[.,]\d+/gi,
      /\d+[.,]\d+\s*off/gi,
      /save\s*\d+[.,]\d+/gi,
      /\d+%\s*off/gi,
      /discount\s*\d+/gi
    ];

    const hasPriceInSnippet = pricePatterns.some(pattern => 
      pattern.test(snippet) || pattern.test(title)
    );

    if (hasPriceInSnippet) {
      hasPrice = true;
      confidence += 0.4;
      reasons.push('Price information found');
    }

    // Enhanced stock and availability indicators
    const stockIndicators = {
      available: [
        'in stock', 'available', 'buy now', 'add to cart', 'add to bag',
        'shop now', 'purchase', 'order now', 'get it', 'buy online',
        'ships', 'delivery', 'free shipping', 'quick delivery',
        'express delivery', 'same day delivery', 'next day delivery',
        'ready to ship', 'immediate delivery', 'fast shipping',
        'available for purchase', 'available online', 'shop online',
        'order online', 'buy today', 'get yours', 'limited stock',
        'few left', 'last chance', 'while supplies last',
        'instant checkout', 'secure checkout', 'easy returns',
        'money back guarantee', 'warranty included', 'authorized dealer',
        'official store', 'genuine product', 'authentic',
        'best price', 'lowest price', 'price match', 'great deal',
        'special offer', 'limited time', 'flash sale', 'clearance'
      ],
      unavailable: [
        'out of stock', 'sold out', 'unavailable', 'not available',
        'discontinued', 'coming soon', 'pre-order', 'notify me',
        'temporarily unavailable', 'currently unavailable',
        'backorder', 'back order', 'waitlist', 'wait list',
        'notify when available', 'email when available',
        'restocking soon', 'expected', 'arriving', 'pre-sale',
        'not in stock', 'temporarily out', 'stock shortage',
        'supply limited', 'production delayed', 'seasonal item',
        'special order', 'custom order', 'made to order',
        'contact for availability', 'call for price', 'quote only'
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

    // Comprehensive e-commerce site validation with regional coverage
    const ecommerceSites = [
      // Global giants
      'amazon.', 'ebay.', 'alibaba.', 'aliexpress.', 'apple.',
      
      // US retailers
      'walmart.', 'target.', 'bestbuy.', 'costco.', 'homedepot.',
      'lowes.', 'macys.', 'nordstrom.', 'kohls.', 'jcpenney.',
      'sears.', 'staples.', 'officedepot.', 'petco.', 'petsmart.',
      'gamestop.', 'radioshack.', 'frys.', 'microcenter.',
      
      // European retailers
      'otto.', 'zalando.', 'mediamarkt.', 'saturn.', 'fnac.',
      'cdiscount.', 'darty.', 'boulanger.', 'elcorteingles.',
      'pccomponentes.', 'bol.com', 'coolblue.', 'wehkamp.',
      'alternate.', 'notebooksbilliger.', 'cyberport.', 'conrad.',
      'currys.', 'argos.', 'johnlewis.', 'very.', 'tesco.',
      'boots.', 'screwfix.', 'wickes.', 'b&q.', 'homebase.',
      
      // Asian retailers
      'flipkart.', 'myntra.', 'snapdeal.', 'paytm', 'bigbasket.',
      'nykaa.', 'ajio.', 'tatacliq.', 'shopclues.', 'pepperfry.',
      'jd.', 'tmall.', 'taobao.', 'suning.', 'gome.',
      'dangdang.', 'yhd.', 'vip.', 'mogujie.', 'meituan.',
      'rakuten.', 'yahoo-shopping.', 'yodobashi.', 'bic-camera.',
      'kakaku.', 'amazon.co.jp', 'mercari.', 'zozo.',
      'coupang.', 'gmarket.', '11st.', 'ssg.', 'lotte.',
      'interpark.', 'auction.', 'tmon.', 'wemakeprice.',
      'lazada.', 'shopee.', 'qoo10.', 'zalora.', 'courts.',
      'harvey-norman.', 'jb-hi-fi.', 'bunnings.', 'kmart.',
      'bigw.', 'myer.', 'david-jones.', 'catch.',
      
      // South American retailers
      'mercadolibre.', 'mercadolivre.', 'submarino.', 'magazineluiza.',
      'casasbahia.', 'extra.', 'americanas.', 'shoptime.',
      'pontofrio.', 'ricardo.', 'fravega.', 'garbarino.',
      'musimundo.', 'cetrogar.', 'compumundo.', 'megatone.',
      
      // Middle Eastern & African retailers
      'noon.', 'souq.', 'carrefour.', 'sharaf-dg.', 'lulu.',
      'emirates.', 'namshi.', 'ounass.', 'nisnass.',
      'jumia.', 'konga.', 'takealot.', 'game.', 'makro.',
      'incredible.', 'wootware.', 'loot.', 'bidorbuy.',
      'spree.', 'superbalist.', 'zando.', 'yuppiechef.'
    ];

    const isEcommerceSite = ecommerceSites.some(site =>
      urlLower.includes(site)
    );

    if (isEcommerceSite) {
      confidence += 0.4;
      reasons.push('Known e-commerce platform');
    }

    // Enhanced quality scoring for better accuracy
    const qualityScore = this.calculateQualityScore(url, title, snippet, hasPrice, isEcommerceSite);
    confidence = Math.max(confidence, qualityScore);
    
    // Final availability determination with stricter criteria
    isAvailable = isProductPage && inStock && confidence > 0.6;

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
   * Calculate quality score based on multiple factors
   */
  private static calculateQualityScore(url: string, title: string, snippet: string, hasPrice: boolean, isEcommerceSite: boolean): number {
    let score = 0;
    
    // Base score for e-commerce sites
    if (isEcommerceSite) score += 0.3;
    
    // Price information adds credibility
    if (hasPrice) score += 0.2;
    
    // Check for product-specific keywords in title
    const productKeywords = ['buy', 'shop', 'sale', 'price', 'deal', 'offer', 'store', 'online'];
    const titleHasKeywords = productKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    );
    if (titleHasKeywords) score += 0.1;
    
    // Check for shopping-related terms in snippet
    const shoppingTerms = ['purchase', 'order', 'delivery', 'shipping', 'cart', 'checkout', 'payment'];
    const snippetHasTerms = shoppingTerms.some(term => 
      snippet.toLowerCase().includes(term)
    );
    if (snippetHasTerms) score += 0.1;
    
    // Bonus for HTTPS (security)
    if (url.startsWith('https://')) score += 0.05;
    
    return score;
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
    return resultsWithAvailability
      .filter(result => 
        result.availability.isAvailable && 
        result.availability.confidence >= minConfidence
      )
      .sort((a, b) => {
        // Sort by confidence descending, then by price availability
        if (a.availability.confidence !== b.availability.confidence) {
          return b.availability.confidence - a.availability.confidence;
        }
        if (a.availability.hasPrice !== b.availability.hasPrice) {
          return a.availability.hasPrice ? -1 : 1;
        }
        return 0;
      });
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