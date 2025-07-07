import { 
  GLOBAL_COUNTRIES, 
  getCountryInfo, 
  getSupportedCountryCodes, 
  getCurrencyByCountry, 
  getCurrencySymbolByCountry,
  getGoogleDomainByCountry,
  getPopularCountries
} from '@/lib/data/globalCountries';

/**
 * Enhanced Region Mapper with Global E-commerce Support
 * 
 * This service provides comprehensive country-specific configurations for global
 * price comparison and product search across 195+ countries and territories.
 */

interface CountryEcommerceConfig {
  searchDomains: string[];
  currency: string;
  currencySymbol: string;
  language: string;
  region: string;
  googleDomain: string;
  popular: boolean;
}

// Enhanced country configurations with major e-commerce domains
export const ENHANCED_COUNTRY_CONFIGS: { [key: string]: CountryEcommerceConfig } = {
  // North America - Major Markets
  US: {
    searchDomains: ['amazon.com', 'walmart.com', 'bestbuy.com', 'target.com', 'apple.com', 'newegg.com', 'costco.com', 'homedepot.com', 'lowes.com', 'macys.com'],
    currency: 'USD',
    currencySymbol: '$',
    language: 'en-US',
    region: 'United States',
    googleDomain: 'google.com',
    popular: true
  },
  CA: {
    searchDomains: ['amazon.ca', 'bestbuy.ca', 'canadiantire.ca', 'apple.com/ca', 'walmart.ca', 'costco.ca', 'thebay.com', 'londondrugs.com'],
    currency: 'CAD',
    currencySymbol: 'C$',
    language: 'en-CA',
    region: 'Canada',
    googleDomain: 'google.ca',
    popular: true
  },
  MX: {
    searchDomains: ['amazon.com.mx', 'mercadolibre.com.mx', 'liverpool.com.mx', 'walmart.com.mx', 'apple.com/mx', 'coppel.com', 'elektra.com.mx'],
    currency: 'MXN',
    currencySymbol: '$',
    language: 'es-MX',
    region: 'Mexico',
    googleDomain: 'google.com.mx',
    popular: true
  },

  // Europe - Major Markets
  GB: {
    searchDomains: ['amazon.co.uk', 'currys.co.uk', 'argos.co.uk', 'apple.com/uk', 'johnlewis.com', 'very.co.uk', 'tesco.com', 'boots.com'],
    currency: 'GBP',
    currencySymbol: '£',
    language: 'en-GB',
    region: 'United Kingdom',
    googleDomain: 'google.co.uk',
    popular: true
  },
  DE: {
    searchDomains: ['amazon.de', 'otto.de', 'zalando.de', 'apple.com/de', 'mediamarkt.de', 'saturn.de', 'notebooksbilliger.de', 'alternate.de'],
    currency: 'EUR',
    currencySymbol: '€',
    language: 'de-DE',
    region: 'Germany',
    googleDomain: 'google.de',
    popular: true
  },
  FR: {
    searchDomains: ['amazon.fr', 'fnac.com', 'cdiscount.com', 'apple.com/fr', 'darty.com', 'boulanger.com', 'rue-du-commerce.com'],
    currency: 'EUR',
    currencySymbol: '€',
    language: 'fr-FR',
    region: 'France',
    googleDomain: 'google.fr',
    popular: true
  },
  IT: {
    searchDomains: ['amazon.it', 'eprice.it', 'unieuro.it', 'apple.com/it', 'mediaworld.it', 'euronics.it', 'expert.it'],
    currency: 'EUR',
    currencySymbol: '€',
    language: 'it-IT',
    region: 'Italy',
    googleDomain: 'google.it',
    popular: true
  },
  ES: {
    searchDomains: ['amazon.es', 'elcorteingles.es', 'pccomponentes.com', 'apple.com/es', 'mediamarkt.es', 'carrefour.es', 'fnac.es'],
    currency: 'EUR',
    currencySymbol: '€',
    language: 'es-ES',
    region: 'Spain',
    googleDomain: 'google.es',
    popular: true
  },
  NL: {
    searchDomains: ['amazon.nl', 'bol.com', 'coolblue.nl', 'apple.com/nl', 'mediamarkt.nl', 'alternate.nl', 'wehkamp.nl'],
    currency: 'EUR',
    currencySymbol: '€',
    language: 'nl-NL',
    region: 'Netherlands',
    googleDomain: 'google.nl',
    popular: true
  },

  // Asia Pacific - Major Markets  
  JP: {
    searchDomains: ['amazon.co.jp', 'rakuten.co.jp', 'yahoo-shopping.jp', 'apple.com/jp', 'yodobashi.com', 'bic-camera.com', 'kakaku.com'],
    currency: 'JPY',
    currencySymbol: '¥',
    language: 'ja-JP',
    region: 'Japan',
    googleDomain: 'google.co.jp',
    popular: true
  },
  CN: {
    searchDomains: ['tmall.com', 'taobao.com', 'jd.com', 'apple.com.cn', 'suning.com', 'gome.com.cn', 'dangdang.com'],
    currency: 'CNY',
    currencySymbol: '¥',
    language: 'zh-CN',
    region: 'China',
    googleDomain: 'google.cn',
    popular: true
  },
  IN: {
    searchDomains: ['amazon.in', 'flipkart.com', 'snapdeal.com', 'apple.com/in', 'myntra.com', 'bigbasket.com', 'nykaa.com', 'reliance.com'],
    currency: 'INR',
    currencySymbol: '₹',
    language: 'hi-IN',
    region: 'India',
    googleDomain: 'google.co.in',
    popular: true
  },
  KR: {
    searchDomains: ['coupang.com', 'gmarket.co.kr', '11st.co.kr', 'apple.com/kr', 'ssg.com', 'lotte.com', 'interpark.com'],
    currency: 'KRW',
    currencySymbol: '₩',
    language: 'ko-KR',
    region: 'South Korea',
    googleDomain: 'google.co.kr',
    popular: true
  },
  AU: {
    searchDomains: ['amazon.com.au', 'jb-hi-fi.com.au', 'harvey-norman.com.au', 'apple.com/au', 'bunnings.com.au', 'woolworths.com.au', 'coles.com.au'],
    currency: 'AUD',
    currencySymbol: 'A$',
    language: 'en-AU',
    region: 'Australia',
    googleDomain: 'google.com.au',
    popular: true
  },
  SG: {
    searchDomains: ['amazon.sg', 'lazada.sg', 'shopee.sg', 'apple.com/sg', 'courts.com.sg', 'qoo10.sg', 'carousell.sg'],
    currency: 'SGD',
    currencySymbol: 'S$',
    language: 'en-SG',
    region: 'Singapore',
    googleDomain: 'google.com.sg',
    popular: true
  },

  // South America
  BR: {
    searchDomains: ['amazon.com.br', 'mercadolivre.com.br', 'submarino.com.br', 'apple.com/br', 'magazineluiza.com.br', 'casasbahia.com.br', 'extra.com.br'],
    currency: 'BRL',
    currencySymbol: 'R$',
    language: 'pt-BR',
    region: 'Brazil',
    googleDomain: 'google.com.br',
    popular: true
  },
  AR: {
    searchDomains: ['mercadolibre.com.ar', 'fravega.com', 'garbarino.com', 'apple.com/ar', 'musimundo.com', 'cetrogar.com.ar'],
    currency: 'ARS',
    currencySymbol: '$',
    language: 'es-AR',
    region: 'Argentina',
    googleDomain: 'google.com.ar',
    popular: true
  },

  // Middle East
  AE: {
    searchDomains: ['amazon.ae', 'noon.com', 'carrefour.ae', 'apple.com/ae', 'sharaf-dg.com', 'lulu-uae.com', 'emirates.com'],
    currency: 'AED',
    currencySymbol: 'د.إ',
    language: 'ar-AE',
    region: 'United Arab Emirates',
    googleDomain: 'google.ae',
    popular: true
  },
  SA: {
    searchDomains: ['amazon.sa', 'noon.com', 'extra.com', 'apple.com/sa', 'jarir.com', 'saco.sa', 'lulu-ksa.com'],
    currency: 'SAR',
    currencySymbol: '﷼',
    language: 'ar-SA',
    region: 'Saudi Arabia',
    googleDomain: 'google.com.sa',
    popular: true
  },

  // Africa
  ZA: {
    searchDomains: ['takealot.com', 'game.co.za', 'makro.co.za', 'apple.com/za', 'incredible.co.za', 'wootware.co.za', 'loot.co.za'],
    currency: 'ZAR',
    currencySymbol: 'R',
    language: 'en-ZA',
    region: 'South Africa',
    googleDomain: 'google.co.za',
    popular: true
  },
  EG: {
    searchDomains: ['jumia.com.eg', 'souq.com', 'b-tech.com.eg', 'apple.com/eg', 'carrefour.com.eg', 'mobily.com.eg'],
    currency: 'EGP',
    currencySymbol: '£',
    language: 'ar-EG',
    region: 'Egypt',
    googleDomain: 'google.com.eg',
    popular: true
  }
};

/**
 * Generate search domains for any country using common e-commerce patterns
 */
function generateSearchDomains(countryCode: string): string[] {
  const code = countryCode.toLowerCase();
  const countryInfo = getCountryInfo(countryCode);
  
  if (!countryInfo) return ['amazon.com', 'ebay.com', 'apple.com'];

  // Common e-commerce domain patterns
  const commonPatterns = [
    `amazon.${code}`,
    `amazon.co.${code}`,
    `amazon.com.${code}`,
    `ebay.${code}`,
    `ebay.co.${code}`,
    `apple.com/${code}`,
    `walmart.${code}`,
    `aliexpress.com`,
    `shopee.${code}`,
    `lazada.${code}`,
    `mercadolibre.com.${code}`,
    `mercadolivre.com.${code}`,
    `jumia.com.${code}`,
    `flipkart.com`
  ];

  // Regional specific domains
  const regionalDomains = {
    'Asia': ['shopee.com', 'lazada.com', 'qoo10.com', 'zalora.com'],
    'Europe': ['otto.de', 'zalando.com', 'bol.com', 'cdiscount.com'],
    'South America': ['mercadolibre.com', 'submarino.com', 'extra.com'],
    'Africa': ['jumia.com', 'konga.com', 'takealot.com'],
    'Middle East': ['noon.com', 'souq.com', 'carrefour.com']
  };

  let domains = commonPatterns.slice(0, 8); // Start with 8 common patterns
  
  // Add regional domains
  if (countryInfo.region in regionalDomains) {
    domains.push(...regionalDomains[countryInfo.region as keyof typeof regionalDomains]);
  }

  return domains.slice(0, 10); // Limit to 10 domains per country
}

export class RegionMapper {
  static getConfig(countryCode: string): CountryEcommerceConfig | null {
    const upperCode = countryCode.toUpperCase();
    
    // Return enhanced config if available
    if (ENHANCED_COUNTRY_CONFIGS[upperCode]) {
      return ENHANCED_COUNTRY_CONFIGS[upperCode];
    }

    // Generate config for any global country
    const countryInfo = getCountryInfo(upperCode);
    if (countryInfo) {
      return {
        searchDomains: generateSearchDomains(upperCode),
        currency: countryInfo.currency,
        currencySymbol: countryInfo.currencySymbol,
        language: `${countryInfo.language}-${upperCode}`,
        region: countryInfo.name,
        googleDomain: countryInfo.googleDomain,
        popular: countryInfo.popular
      };
    }

    return null;
  }
  
  static getSearchDomains(countryCode: string): string[] {
    const config = this.getConfig(countryCode);
    return config?.searchDomains || ['amazon.com', 'ebay.com', 'apple.com'];
  }
  
  static getCurrency(countryCode: string): string {
    return getCurrencyByCountry(countryCode);
  }

  static getCurrencySymbol(countryCode: string): string {
    return getCurrencySymbolByCountry(countryCode);
  }
  
  static getLanguage(countryCode: string): string {
    const config = this.getConfig(countryCode);
    return config?.language || 'en-US';
  }
  
  static getRegion(countryCode: string): string {
    const countryInfo = getCountryInfo(countryCode);
    return countryInfo?.name || countryCode;
  }

  static getGoogleDomain(countryCode: string): string {
    return getGoogleDomainByCountry(countryCode);
  }
  
  static getSupportedCountries(): string[] {
    return getSupportedCountryCodes();
  }

  static getPopularCountries(): string[] {
    return getPopularCountries().map(country => country.code);
  }

  static getAllCountries(): Array<{code: string, name: string, popular: boolean}> {
    return Object.values(GLOBAL_COUNTRIES).map(country => ({
      code: country.code,
      name: country.name,
      popular: country.popular
    }));
  }

  static isCountrySupported(countryCode: string): boolean {
    return !!getCountryInfo(countryCode);
  }

  static getCountryByName(countryName: string): string | null {
    const country = Object.values(GLOBAL_COUNTRIES).find(
      c => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.code : null;
  }

  /**
   * Get optimized search query for a specific country
   */
  static getLocalizedSearchQuery(query: string, countryCode: string): string {
    const countryInfo = getCountryInfo(countryCode);
    if (!countryInfo) return query;

    // Add country-specific terms for better local results
    const localTerms = {
      'US': 'buy online USA store',
      'CA': 'buy Canada store',
      'GB': 'buy UK store',
      'AU': 'buy Australia store',
      'IN': 'buy India store online',
      'DE': 'kaufen Deutschland shop',
      'FR': 'acheter France boutique',
      'ES': 'comprar España tienda',
      'IT': 'comprare Italia negozio',
      'JP': '購入 日本 store',
      'CN': '购买 中国 store',
      'KR': '구매 한국 store',
      'BR': 'comprar Brasil loja',
      'MX': 'comprar México tienda',
      'AE': 'buy UAE store',
      'SA': 'buy Saudi Arabia store',
      'ZA': 'buy South Africa store'
    };

    const localTerm = localTerms[countryCode as keyof typeof localTerms] || 'buy online store';
    return `${query} ${localTerm}`;
  }
}