/**
 * Enhanced Product Data Extraction Service
 * 
 * This service provides advanced extraction of product information from search results
 * with high accuracy for pricing, availability, and product details.
 */

import { SearchResult } from './apiService';
import { RegionMapper } from './regionMapper';

export interface ExtractedProductData {
  productName: string;
  price: string | null;
  originalPrice: string | null;
  currency: string;
  discount: string | null;
  discountPercentage: number | null;
  availability: 'in_stock' | 'out_of_stock' | 'limited_stock' | 'unknown';
  seller: string;
  brand: string | null;
  model: string | null;
  condition: 'new' | 'used' | 'refurbished' | 'unknown';
  rating: number | null;
  reviewCount: number | null;
  shipping: 'free' | 'paid' | 'unknown';
  deliveryTime: string | null;
  warranty: string | null;
  categoryConfidence: number;
  extractionConfidence: number;
  productUrl: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
}

export class ProductDataExtractor {
  /**
   * Extract comprehensive product data from search result
   */
  static extractProductData(searchResult: SearchResult, countryCode: string): ExtractedProductData {
    const { title, url, snippet, image, thumbnail } = searchResult;
    const currency = RegionMapper.getCurrency(countryCode);
    const currencySymbol = RegionMapper.getCurrencySymbol(countryCode);
    
    return {
      productName: this.extractProductName(title, snippet),
      price: this.extractPrice(title, snippet, currencySymbol),
      originalPrice: this.extractOriginalPrice(title, snippet, currencySymbol),
      currency,
      discount: this.extractDiscount(title, snippet),
      discountPercentage: this.extractDiscountPercentage(title, snippet),
      availability: this.extractAvailability(title, snippet),
      seller: this.extractSeller(url),
      brand: this.extractBrand(title, snippet),
      model: this.extractModel(title, snippet),
      condition: this.extractCondition(title, snippet),
      rating: this.extractRating(title, snippet),
      reviewCount: this.extractReviewCount(title, snippet),
      shipping: this.extractShipping(title, snippet),
      deliveryTime: this.extractDeliveryTime(title, snippet),
      warranty: this.extractWarranty(title, snippet),
      categoryConfidence: this.calculateCategoryConfidence(title, snippet),
      extractionConfidence: this.calculateExtractionConfidence(title, snippet, url),
      productUrl: url,
      imageUrl: image || null,
      thumbnailUrl: thumbnail || null
    };
  }

  /**
   * Extract clean product name from title
   */
  private static extractProductName(title: string, snippet: string): string {
    // Remove common e-commerce noise
    let cleanTitle = title
      .replace(/\s*-\s*(Buy|Shop|Purchase|Order|Get|Find|Search|Compare|Price|Deal|Sale|Discount|Offer|Store|Online|Amazon|eBay|Walmart|Target|Best Buy|Flipkart|Myntra|Snapdeal).*$/gi, '')
      .replace(/^\s*(Buy|Shop|Purchase|Order|Get|Find|Search|Compare|Price|Deal|Sale|Discount|Offer|Store|Online)\s+/gi, '')
      .replace(/\s*\|\s*[^|]*$/g, '') // Remove site names after pipe
      .replace(/\s*:\s*[^:]*$/g, '') // Remove descriptions after colon
      .replace(/\s*\(\s*\d+\s*reviews?\s*\)/gi, '') // Remove review counts
      .replace(/\s*\[.*?\]/g, '') // Remove bracketed content
      .replace(/\s*\bfrom\s+\$[\d,]+.*$/gi, '') // Remove "from $X" pricing
      .replace(/\s*\bstarting\s+at\s+\$[\d,]+.*$/gi, '') // Remove "starting at $X"
      .replace(/\s*\b(NEW|SALE|DEAL|OFFER|PROMO|SPECIAL|LIMITED|EXCLUSIVE|BESTSELLER|TOP|POPULAR|TRENDING|HOT|FEATURED)\b/gi, '') // Remove promotional words
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // If title is too short, supplement with snippet
    if (cleanTitle.length < 10 && snippet.length > 0) {
      const snippetWords = snippet.split(' ').slice(0, 10);
      cleanTitle = snippetWords.join(' ');
    }

    return cleanTitle || title;
  }

  /**
   * Extract price information with enhanced currency support
   */
  private static extractPrice(title: string, snippet: string, currencySymbol: string): string | null {
    const text = `${title} ${snippet}`;
    
    // Enhanced price patterns for global currencies
    const pricePatterns = [
      // Currency symbols
      new RegExp(`\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)`, 'gi'),
      new RegExp(`([\\d,]+(?:\\.\\d{2})?)\\s*\\${currencySymbol}`, 'gi'),
      
      // Specific currency patterns
      /\$([\\d,]+(?:\\.\\d{2})?)/gi, // USD
      /₹([\\d,]+(?:\\.\\d{2})?)/gi, // INR
      /£([\\d,]+(?:\\.\\d{2})?)/gi, // GBP
      /€([\\d,]+(?:\\.\\d{2})?)/gi, // EUR
      /¥([\\d,]+(?:\\.\\d{2})?)/gi, // JPY/CNY
      /₩([\\d,]+(?:\\.\\d{2})?)/gi, // KRW
      /R\\$([\\d,]+(?:\\.\\d{2})?)/gi, // BRL
      /C\\$([\\d,]+(?:\\.\\d{2})?)/gi, // CAD
      /A\\$([\\d,]+(?:\\.\\d{2})?)/gi, // AUD
      /S\\$([\\d,]+(?:\\.\\d{2})?)/gi, // SGD
      /RM([\\d,]+(?:\\.\\d{2})?)/gi, // MYR
      /₱([\\d,]+(?:\\.\\d{2})?)/gi, // PHP
      /₫([\\d,]+(?:\\.\\d{2})?)/gi, // VND
      /₪([\\d,]+(?:\\.\\d{2})?)/gi, // ILS
      /﷼([\\d,]+(?:\\.\\d{2})?)/gi, // SAR
      /د\\.إ([\\d,]+(?:\\.\\d{2})?)/gi, // AED
      
      // Price keywords with numbers
      /price[:\\s]*([\\d,]+(?:\\.\\d{2})?)/gi,
      /cost[:\\s]*([\\d,]+(?:\\.\\d{2})?)/gi,
      /only[:\\s]*([\\d,]+(?:\\.\\d{2})?)/gi,
      /from[:\\s]*([\\d,]+(?:\\.\\d{2})?)/gi,
      /starting[:\\s]*([\\d,]+(?:\\.\\d{2})?)/gi,
      
      // Currency codes
      /([\\d,]+(?:\\.\\d{2})?)\\s*(USD|INR|GBP|EUR|JPY|CNY|KRW|BRL|CAD|AUD|SGD|MYR|PHP|VND|THB|IDR|AED|SAR|EGP|ZAR|NGN|KES|GHS|MAD|TND|DZD|ILS|JOD|QAR|KWD|BHD|OMR|MXN|ARS|CLP|COP|PEN|UYU|PYG|BOB|VEF|CRC|GTQ|HNL|NIO|PAB|DOP|JMD|TTD|BBD|XCD|BSD|BZD|KYD|AWG|ANG|SRD|GYD|FKP|SHP|GIP|JEP|GGP|IMP|TVD|NZD|FJD|SBD|TOP|VUV|WST|PGK|NCX|XPF)/gi
    ];

    for (const pattern of pricePatterns) {
      const match = pattern.exec(text);
      if (match) {
        const price = match[1] || match[0];
        // Format price with currency symbol
        return `${currencySymbol}${price.replace(/,/g, '')}`;
      }
    }

    return null;
  }

  /**
   * Extract original price (before discount)
   */
  private static extractOriginalPrice(title: string, snippet: string, currencySymbol: string): string | null {
    const text = `${title} ${snippet}`;
    
    const originalPricePatterns = [
      /was[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi,
      /originally[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi,
      /list[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi,
      /msrp[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi,
      /rrp[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi,
      /reg[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi,
      /before[:\\s]*\\${currencySymbol}([\\d,]+(?:\\.\\d{2})?)/gi
    ];

    for (const pattern of originalPricePatterns) {
      const match = pattern.exec(text);
      if (match) {
        return `${currencySymbol}${match[1]}`;
      }
    }

    return null;
  }

  /**
   * Extract discount information
   */
  private static extractDiscount(title: string, snippet: string): string | null {
    const text = `${title} ${snippet}`;
    
    const discountPatterns = [
      /(\d+)%\s*off/gi,
      /save\s*(\d+)%/gi,
      /(\d+)%\s*discount/gi,
      /save\s*\$(\d+)/gi,
      /(\d+)%\s*less/gi,
      /(\d+)%\s*cheaper/gi,
      /discount\s*(\d+)%/gi,
      /offer\s*(\d+)%/gi,
      /deal\s*(\d+)%/gi,
      /sale\s*(\d+)%/gi
    ];

    for (const pattern of discountPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Extract discount percentage as number
   */
  private static extractDiscountPercentage(title: string, snippet: string): number | null {
    const discount = this.extractDiscount(title, snippet);
    if (!discount) return null;
    
    const match = discount.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Extract availability status
   */
  private static extractAvailability(title: string, snippet: string): 'in_stock' | 'out_of_stock' | 'limited_stock' | 'unknown' {
    const text = `${title} ${snippet}`.toLowerCase();
    
    const inStockIndicators = [
      'in stock', 'available', 'ready to ship', 'ships today',
      'immediate delivery', 'quick delivery', 'express delivery',
      'same day delivery', 'next day delivery', 'fast shipping',
      'free shipping', 'add to cart', 'buy now', 'purchase now',
      'order now', 'get it now', 'shop now'
    ];

    const outOfStockIndicators = [
      'out of stock', 'sold out', 'unavailable', 'not available',
      'discontinued', 'temporarily unavailable', 'currently unavailable',
      'backorder', 'back order', 'pre-order', 'coming soon',
      'notify me', 'email when available', 'waitlist', 'wait list'
    ];

    const limitedStockIndicators = [
      'limited stock', 'few left', 'last chance', 'while supplies last',
      'limited quantity', 'hurry', 'almost gone', 'selling fast',
      'low stock', 'limited time', 'only a few left'
    ];

    if (outOfStockIndicators.some(indicator => text.includes(indicator))) {
      return 'out_of_stock';
    }

    if (limitedStockIndicators.some(indicator => text.includes(indicator))) {
      return 'limited_stock';
    }

    if (inStockIndicators.some(indicator => text.includes(indicator))) {
      return 'in_stock';
    }

    return 'unknown';
  }

  /**
   * Extract seller/retailer name from URL
   */
  private static extractSeller(url: string): string {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Map common domains to retailer names
      const sellerMap: { [key: string]: string } = {
        'amazon.com': 'Amazon',
        'amazon.in': 'Amazon India',
        'amazon.co.uk': 'Amazon UK',
        'amazon.de': 'Amazon Germany',
        'amazon.fr': 'Amazon France',
        'amazon.co.jp': 'Amazon Japan',
        'amazon.ca': 'Amazon Canada',
        'amazon.com.au': 'Amazon Australia',
        'amazon.com.br': 'Amazon Brazil',
        'amazon.com.mx': 'Amazon Mexico',
        'amazon.ae': 'Amazon UAE',
        'amazon.sa': 'Amazon Saudi Arabia',
        'amazon.sg': 'Amazon Singapore',
        'amazon.nl': 'Amazon Netherlands',
        'amazon.it': 'Amazon Italy',
        'amazon.es': 'Amazon Spain',
        'flipkart.com': 'Flipkart',
        'myntra.com': 'Myntra',
        'snapdeal.com': 'Snapdeal',
        'paytm.com': 'Paytm Mall',
        'ebay.com': 'eBay',
        'walmart.com': 'Walmart',
        'target.com': 'Target',
        'bestbuy.com': 'Best Buy',
        'costco.com': 'Costco',
        'homedepot.com': 'Home Depot',
        'lowes.com': 'Lowe\'s',
        'apple.com': 'Apple',
        'samsung.com': 'Samsung',
        'nike.com': 'Nike',
        'adidas.com': 'Adidas',
        'aliexpress.com': 'AliExpress',
        'alibaba.com': 'Alibaba',
        'tmall.com': 'Tmall',
        'jd.com': 'JD.com',
        'taobao.com': 'Taobao',
        'rakuten.co.jp': 'Rakuten',
        'yahoo-shopping.jp': 'Yahoo Shopping',
        'coupang.com': 'Coupang',
        'gmarket.co.kr': 'Gmarket',
        'shopee.com': 'Shopee',
        'lazada.com': 'Lazada',
        'tokopedia.com': 'Tokopedia',
        'bukalapak.com': 'Bukalapak',
        'mercadolibre.com': 'MercadoLibre',
        'otto.de': 'Otto',
        'zalando.com': 'Zalando',
        'mediamarkt.de': 'MediaMarkt',
        'fnac.com': 'Fnac',
        'currys.co.uk': 'Currys',
        'argos.co.uk': 'Argos',
        'noon.com': 'Noon',
        'souq.com': 'Souq',
        'jumia.com': 'Jumia',
        'takealot.com': 'Takealot',
        'game.co.za': 'Game',
        'jb-hi-fi.com.au': 'JB Hi-Fi',
        'harvey-norman.com.au': 'Harvey Norman'
      };

      return sellerMap[domain] || this.formatSellerName(domain);
    } catch {
      return 'Unknown Seller';
    }
  }

  /**
   * Format seller name from domain
   */
  private static formatSellerName(domain: string): string {
    return domain
      .replace(/\.(com|co\.uk|de|fr|in|jp|ca|au|br|mx|ae|sa|sg|nl|it|es|org|net)$/i, '')
      .replace(/[-_.]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Extract brand information
   */
  private static extractBrand(title: string, snippet: string): string | null {
    const text = `${title} ${snippet}`;
    
    // Common brand patterns - simplified for better performance
    const brandPatterns = [
      /\b(Apple|Samsung|Google|Microsoft|Sony|Nintendo|HP|Dell|Lenovo|Acer|Asus|MSI|Razer|Corsair|Logitech|Canon|Nikon|Panasonic|LG|Philips|Xiaomi|Huawei|OnePlus|Oppo|Vivo|Realme|Motorola|Nokia|BlackBerry|HTC|TCL|Alcatel|ZTE|Honor|Redmi|Poco|Nothing|Fairphone|Essential)\b/gi,
      /\b(iPhone|iPad|MacBook|iMac|AirPods|Apple Watch|Galaxy|Pixel|Surface|Xbox|PlayStation|Nintendo Switch|ThinkPad|Inspiron|Pavilion|Envy|Aspire|ZenBook|VivoBook|Xperia|Mi|Redmi Note|OnePlus|P30|Mate|Honor|Nova)\b/gi,
      /\b(Amazon|eBay|Walmart|Target|Best Buy|Costco|Home Depot|Flipkart|Myntra|Snapdeal|Tmall|Taobao|JD|Rakuten|Coupang|Shopee|Lazada|Tokopedia|Bukalapak|MercadoLibre|Otto|Zalando|MediaMarkt|Fnac|Currys|Argos|Noon|Souq|Jumia|Takealot)\b/gi,
      /\b(Nike|Adidas|Puma|Under Armour|Reebok|New Balance|Converse|Vans|Zara|H&M|Uniqlo|Gap|Old Navy|Banana Republic|Levi's|Calvin Klein|Tommy Hilfiger|Ralph Lauren|Gucci|Louis Vuitton|Prada|Coach|Michael Kors|Kate Spade)\b/gi,
      /\b(Model|Version|Gen|Series|Pro|Max|Plus|Mini|Lite|Ultra|Premium|Standard|Basic|Advanced|Professional|Enterprise|Business|Home|Personal)\b/gi
    ];

    for (const pattern of brandPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Extract model information
   */
  private static extractModel(title: string, snippet: string): string | null {
    const text = `${title} ${snippet}`;
    
    // Common model patterns
    const modelPatterns = [
      /\b(iPhone\s+\d+(\s+Pro(\s+Max)?)?|iPad\s+Pro|MacBook\s+(Pro|Air)|iMac|Mac\s+Pro|AirPods(\s+Pro)?|Apple\s+Watch\s+Series\s+\d+)/gi,
      /\b(Galaxy\s+S\d+|Galaxy\s+Note\s+\d+|Galaxy\s+A\d+|Galaxy\s+Z\s+(Fold|Flip)\d*)/gi,
      /\b(Pixel\s+\d+(\s+Pro(\s+XL)?)?|Pixel\s+Buds|Pixel\s+Watch|Pixelbook)/gi,
      /\b(Surface\s+(Pro|Laptop|Studio|Book)\s*\d*|Xbox\s+(Series\s+[SX]|One))/gi,
      /\b(ThinkPad\s+[A-Z]\d+|IdeaPad\s+\d+|Yoga\s+\d+|Legion\s+\d+)/gi,
      /\b(Inspiron\s+\d+|XPS\s+\d+|Alienware\s+\d+|Latitude\s+\d+)/gi,
      /\b(Pavilion\s+\d+|Envy\s+\d+|Omen\s+\d+|EliteBook\s+\d+)/gi,
      /\b(Aspire\s+\d+|Predator\s+\d+|Nitro\s+\d+|Swift\s+\d+)/gi,
      /\b(ZenBook\s+\d+|VivoBook\s+\d+|ROG\s+\d+|TUF\s+\d+)/gi,
      /\b(Xperia\s+\d+|Alpha\s+\d+|FX\s+\d+|WH-\d+)/gi,
      /\b(Mi\s+\d+|Redmi\s+\d+|Poco\s+\d+|Redmi\s+Note\s+\d+)/gi,
      /\b(P\d+(\s+Pro)?|Mate\s+\d+|Honor\s+\d+|Nova\s+\d+)/gi,
      /\b(OnePlus\s+\d+(\s+Pro)?|OnePlus\s+Nord)/gi,
      /\b(Model\s+[A-Z0-9\-]+|Version\s+\d+(\.\d+)?|Gen\s+\d+)/gi,
      /\b([A-Z]{2,}\s*\d{3,}[A-Z]?|[A-Z]\d{2,}[A-Z]?|\d{4}[A-Z]+)/gi
    ];

    for (const pattern of modelPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Extract condition information
   */
  private static extractCondition(title: string, snippet: string): 'new' | 'used' | 'refurbished' | 'unknown' {
    const text = `${title} ${snippet}`.toLowerCase();
    
    if (text.includes('refurbished') || text.includes('renewed') || text.includes('open box')) {
      return 'refurbished';
    }
    
    if (text.includes('used') || text.includes('pre-owned') || text.includes('second hand')) {
      return 'used';
    }
    
    if (text.includes('new') || text.includes('brand new') || text.includes('sealed')) {
      return 'new';
    }
    
    return 'unknown';
  }

  /**
   * Extract rating information
   */
  private static extractRating(title: string, snippet: string): number | null {
    const text = `${title} ${snippet}`;
    
    const ratingPatterns = [
      /(\d+(?:\.\d+)?)\s*\/\s*5\s*stars?/gi,
      /(\d+(?:\.\d+)?)\s*out\s*of\s*5/gi,
      /(\d+(?:\.\d+)?)\s*stars?/gi,
      /rating[:\s]*(\d+(?:\.\d+)?)/gi,
      /rated[:\s]*(\d+(?:\.\d+)?)/gi,
      /⭐+\s*(\d+(?:\.\d+)?)/gi,
      /★+\s*(\d+(?:\.\d+)?)/gi
    ];

    for (const pattern of ratingPatterns) {
      const match = pattern.exec(text);
      if (match) {
        const rating = parseFloat(match[1]);
        if (rating >= 0 && rating <= 5) {
          return rating;
        }
      }
    }

    return null;
  }

  /**
   * Extract review count
   */
  private static extractReviewCount(title: string, snippet: string): number | null {
    const text = `${title} ${snippet}`;
    
    const reviewPatterns = [
      /(\d+(?:,\d+)*)\s*reviews?/gi,
      /(\d+(?:,\d+)*)\s*ratings?/gi,
      /(\d+(?:,\d+)*)\s*customers?\s*reviews?/gi,
      /based\s*on\s*(\d+(?:,\d+)*)/gi,
      /(\d+(?:,\d+)*)\s*people\s*rated/gi
    ];

    for (const pattern of reviewPatterns) {
      const match = pattern.exec(text);
      if (match) {
        const count = parseInt(match[1].replace(/,/g, ''));
        if (count > 0) {
          return count;
        }
      }
    }

    return null;
  }

  /**
   * Extract shipping information
   */
  private static extractShipping(title: string, snippet: string): 'free' | 'paid' | 'unknown' {
    const text = `${title} ${snippet}`.toLowerCase();
    
    if (text.includes('free shipping') || text.includes('free delivery') || text.includes('no shipping cost')) {
      return 'free';
    }
    
    if (text.includes('shipping') || text.includes('delivery') || text.includes('postage')) {
      return 'paid';
    }
    
    return 'unknown';
  }

  /**
   * Extract delivery time
   */
  private static extractDeliveryTime(_title: string, snippet: string): string | null {
    const text = `${_title} ${snippet}`;
    
    const deliveryPatterns = [
      /(\d+[-\s]?\d*\s*days?)/gi,
      /(same\s*day|next\s*day|overnight)/gi,
      /(\d+[-\s]?\d*\s*hours?)/gi,
      /(express|fast|quick|immediate|instant)\s*(delivery|shipping)/gi,
      /(standard|normal|regular)\s*(delivery|shipping)/gi,
      /(free\s*shipping\s*in\s*\d+[-\s]?\d*\s*days?)/gi
    ];

    for (const pattern of deliveryPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Extract warranty information
   */
  private static extractWarranty(_title: string, snippet: string): string | null {
    const text = `${_title} ${snippet}`;
    
    const warrantyPatterns = [
      /(\d+\s*years?\s*warranty)/gi,
      /(\d+\s*months?\s*warranty)/gi,
      /(lifetime\s*warranty)/gi,
      /(extended\s*warranty)/gi,
      /(manufacturer\s*warranty)/gi,
      /(international\s*warranty)/gi,
      /(limited\s*warranty)/gi,
      /(full\s*warranty)/gi
    ];

    for (const pattern of warrantyPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Calculate category confidence based on content analysis
   */
  private static calculateCategoryConfidence(title: string, snippet: string): number {
    const text = `${title} ${snippet}`.toLowerCase();
    let confidence = 0.3;

    // Product-specific keywords
    const productKeywords = [
      'buy', 'purchase', 'shop', 'store', 'price', 'cost', 'deal', 'sale',
      'discount', 'offer', 'available', 'stock', 'delivery', 'shipping',
      'warranty', 'guarantee', 'return', 'exchange', 'refund', 'customer',
      'review', 'rating', 'stars', 'feedback', 'testimonial', 'quality',
      'brand', 'model', 'specification', 'feature', 'description', 'detail'
    ];

    const keywordCount = productKeywords.filter(keyword => text.includes(keyword)).length;
    confidence += (keywordCount * 0.05); // Up to 0.75 for 15 keywords

    // Brand indicators
    if (this.extractBrand(title, snippet)) {
      confidence += 0.15;
    }

    // Model indicators
    if (this.extractModel(title, snippet)) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate overall extraction confidence
   */
  private static calculateExtractionConfidence(title: string, snippet: string, url: string): number {
    let confidence = 0.2;

    // E-commerce site bonus
    const ecommerceSites = [
      'amazon.', 'flipkart.', 'myntra.', 'snapdeal.', 'ebay.', 'walmart.',
      'target.', 'bestbuy.', 'apple.', 'samsung.', 'aliexpress.', 'tmall.',
      'jd.', 'taobao.', 'rakuten.', 'coupang.', 'shopee.', 'lazada.'
    ];

    if (ecommerceSites.some(site => url.toLowerCase().includes(site))) {
      confidence += 0.3;
    }

    // Price information bonus
    if (this.extractPrice(title, snippet, '$')) {
      confidence += 0.25;
    }

    // Product name quality
    const productName = this.extractProductName(title, snippet);
    if (productName.length > 10) {
      confidence += 0.15;
    }

    // Availability information
    if (this.extractAvailability(title, snippet) !== 'unknown') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Batch extract product data from multiple search results
   */
  static batchExtractProductData(
    searchResults: SearchResult[],
    countryCode: string
  ): ExtractedProductData[] {
    return searchResults.map(result => 
      this.extractProductData(result, countryCode)
    );
  }

  /**
   * Filter extracted data by confidence threshold
   */
  static filterByConfidence(
    extractedData: ExtractedProductData[],
    minConfidence: number = 0.6
  ): ExtractedProductData[] {
    return extractedData.filter(data => 
      data.extractionConfidence >= minConfidence
    );
  }

  /**
   * Sort extracted data by relevance and quality
   */
  static sortByRelevance(extractedData: ExtractedProductData[]): ExtractedProductData[] {
    return extractedData.sort((a, b) => {
      // Primary sort: extraction confidence
      if (a.extractionConfidence !== b.extractionConfidence) {
        return b.extractionConfidence - a.extractionConfidence;
      }

      // Secondary sort: availability
      const availabilityOrder = { 'in_stock': 3, 'limited_stock': 2, 'unknown': 1, 'out_of_stock': 0 };
      if (a.availability !== b.availability) {
        return availabilityOrder[b.availability] - availabilityOrder[a.availability];
      }

      // Tertiary sort: price availability
      if (a.price && !b.price) return -1;
      if (!a.price && b.price) return 1;

      // Quaternary sort: category confidence
      return b.categoryConfidence - a.categoryConfidence;
    });
  }
}