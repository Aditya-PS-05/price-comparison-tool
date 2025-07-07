import { RegionalSiteMapping } from '../types/scraper';

export const REGIONAL_SITES: RegionalSiteMapping = {
  // North America
  US: {
    sites: ['amazon.com', 'bestbuy.com', 'target.com', 'walmart.com', 'newegg.com', 'bhphotovideo.com'],
    currency: 'USD',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'books', 'automotive']
  },
  CA: {
    sites: ['amazon.ca', 'bestbuy.ca', 'walmart.ca', 'canadiantire.ca'],
    currency: 'CAD',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'outdoor']
  },
  
  // Europe
  UK: {
    sites: ['amazon.co.uk', 'currys.co.uk', 'argos.co.uk', 'johnlewis.com', 'very.co.uk'],
    currency: 'GBP',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'books']
  },
  DE: {
    sites: ['amazon.de', 'saturn.de', 'mediamarkt.de', 'otto.de', 'zalando.de'],
    currency: 'EUR',
    language: 'de',
    popularCategories: ['electronics', 'fashion', 'home', 'automotive']
  },
  FR: {
    sites: ['amazon.fr', 'fnac.com', 'cdiscount.com', 'darty.com', 'zalando.fr'],
    currency: 'EUR',
    language: 'fr',
    popularCategories: ['electronics', 'fashion', 'home', 'books']
  },
  IT: {
    sites: ['amazon.it', 'eprice.it', 'mediaworld.it', 'zalando.it'],
    currency: 'EUR',
    language: 'it',
    popularCategories: ['electronics', 'fashion', 'home']
  },
  ES: {
    sites: ['amazon.es', 'elcorteingles.es', 'pccomponentes.com', 'zalando.es'],
    currency: 'EUR',
    language: 'es',
    popularCategories: ['electronics', 'fashion', 'home']
  },
  
  // Asia Pacific
  IN: {
    sites: ['amazon.in', 'flipkart.com', 'snapdeal.com', 'myntra.com', 'nykaa.com'],
    currency: 'INR',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'books', 'beauty']
  },
  JP: {
    sites: ['amazon.co.jp', 'rakuten.co.jp', 'yahoo.co.jp', 'mercari.com'],
    currency: 'JPY',
    language: 'ja',
    popularCategories: ['electronics', 'fashion', 'home', 'books']
  },
  AU: {
    sites: ['amazon.com.au', 'ebay.com.au', 'jbhifi.com.au', 'harvey-norman.com.au'],
    currency: 'AUD',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'outdoor']
  },
  SG: {
    sites: ['amazon.sg', 'lazada.sg', 'shopee.sg', 'courts.com.sg'],
    currency: 'SGD',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home']
  },
  
  // Middle East
  AE: {
    sites: ['amazon.ae', 'noon.com', 'sharaf-dg.com', 'carrefour.ae'],
    currency: 'AED',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'automotive']
  },
  
  // Latin America
  BR: {
    sites: ['amazon.com.br', 'mercadolivre.com.br', 'submarino.com.br', 'americanas.com.br'],
    currency: 'BRL',
    language: 'pt',
    popularCategories: ['electronics', 'fashion', 'home', 'books']
  },
  MX: {
    sites: ['amazon.com.mx', 'mercadolibre.com.mx', 'liverpool.com.mx', 'elektra.com.mx'],
    currency: 'MXN',
    language: 'es',
    popularCategories: ['electronics', 'fashion', 'home', 'automotive']
  },
  
  // Africa
  ZA: {
    sites: ['takealot.com', 'makro.co.za', 'game.co.za', 'bidorbuy.co.za'],
    currency: 'ZAR',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'automotive']
  },
  
  // Global fallback
  GLOBAL: {
    sites: ['amazon.com', 'ebay.com', 'aliexpress.com', 'alibaba.com'],
    currency: 'USD',
    language: 'en',
    popularCategories: ['electronics', 'fashion', 'home', 'books', 'automotive']
  }
};

export class RegionMapper {
  static getRegionalSites(countryCode: string): string[] {
    const region = REGIONAL_SITES[countryCode.toUpperCase()];
    if (!region) {
      return REGIONAL_SITES.GLOBAL.sites;
    }
    return region.sites;
  }
  
  static getCurrency(countryCode: string): string {
    const region = REGIONAL_SITES[countryCode.toUpperCase()];
    if (!region) {
      return REGIONAL_SITES.GLOBAL.currency;
    }
    return region.currency;
  }
  
  static getLanguage(countryCode: string): string {
    const region = REGIONAL_SITES[countryCode.toUpperCase()];
    if (!region) {
      return REGIONAL_SITES.GLOBAL.language;
    }
    return region.language;
  }
  
  static getPopularCategories(countryCode: string): string[] {
    const region = REGIONAL_SITES[countryCode.toUpperCase()];
    if (!region) {
      return REGIONAL_SITES.GLOBAL.popularCategories;
    }
    return region.popularCategories;
  }
  
  static getAllSupportedCountries(): string[] {
    return Object.keys(REGIONAL_SITES).filter(code => code !== 'GLOBAL');
  }
}