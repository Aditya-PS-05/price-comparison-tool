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

  // Enhanced domain patterns with better coverage
  const commonPatterns = [
    `amazon.${code}`,
    `amazon.co.${code}`,
    `amazon.com.${code}`,
    `ebay.${code}`,
    `ebay.co.${code}`,
    `apple.com/${code}`,
    `walmart.${code}`,
    `target.${code}`,
    `bestbuy.${code}`,
    `aliexpress.com`,
    `shopee.${code}`,
    `lazada.${code}`,
    `mercadolibre.com.${code}`,
    `mercadolivre.com.${code}`,
    `jumia.com.${code}`,
    `flipkart.com`,
    `myntra.com`,
    `snapdeal.com`
  ];

  // Enhanced regional specific domains with better coverage
  const regionalDomains = {
    'Asia': [
      'shopee.com', 'lazada.com', 'qoo10.com', 'zalora.com',
      'rakuten.co.jp', 'yahoo-shopping.jp', 'tmall.com', 'jd.com',
      'coupang.com', 'gmarket.co.kr', '11st.co.kr', 'taobao.com',
      'suning.com', 'gome.com.cn', 'tokopedia.com', 'bukalapak.com',
      'blibli.com', 'shopback.com', 'redmart.com', 'hermo.com'
    ],
    'Europe': [
      'otto.de', 'zalando.com', 'bol.com', 'cdiscount.com',
      'mediamarkt.de', 'saturn.de', 'fnac.com', 'darty.com',
      'currys.co.uk', 'argos.co.uk', 'johnlewis.com', 'very.co.uk',
      'elcorteingles.es', 'pccomponentes.com', 'unieuro.it', 'eprice.it',
      'coolblue.nl', 'wehkamp.nl', 'alternate.de', 'notebooksbilliger.de'
    ],
    'North America': [
      'walmart.com', 'target.com', 'bestbuy.com', 'costco.com',
      'homedepot.com', 'lowes.com', 'macys.com', 'nordstrom.com',
      'canadiantire.ca', 'bestbuy.ca', 'thebay.com', 'walmart.ca'
    ],
    'South America': [
      'mercadolibre.com', 'submarino.com', 'extra.com', 'americanas.com',
      'magazineluiza.com.br', 'casasbahia.com.br', 'pontofrio.com.br',
      'fravega.com', 'garbarino.com', 'musimundo.com', 'falabella.com',
      'ripley.com', 'paris.cl', 'linio.com', 'dafiti.com'
    ],
    'Africa': [
      'jumia.com', 'konga.com', 'takealot.com', 'game.co.za',
      'makro.co.za', 'incredible.co.za', 'wootware.co.za', 'loot.co.za',
      'bidorbuy.co.za', 'spree.co.za', 'superbalist.com', 'zando.co.za'
    ],
    'Middle East': [
      'noon.com', 'souq.com', 'carrefour.com', 'sharaf-dg.com',
      'lulu-uae.com', 'emirates.com', 'namshi.com', 'ounass.com',
      'nisnass.com', 'jarir.com', 'extra.com', 'saco.sa'
    ],
    'Oceania': [
      'jb-hi-fi.com.au', 'harvey-norman.com.au', 'bunnings.com.au',
      'woolworths.com.au', 'coles.com.au', 'kmart.com.au', 'bigw.com.au',
      'myer.com.au', 'david-jones.com.au', 'catch.com.au', 'kogan.com'
    ]
  };

  const domains = [...commonPatterns.slice(0, 6)]; // Start with 6 common patterns
  
  // Add regional domains with better matching
  const region = countryInfo.region;
  if (region in regionalDomains) {
    domains.push(...regionalDomains[region as keyof typeof regionalDomains].slice(0, 8));
  }
  
  // Add country-specific major retailers
  const countrySpecificSites = getCountrySpecificSites(countryCode);
  domains.push(...countrySpecificSites);

  // Remove duplicates and return limited set
  return [...new Set(domains)].slice(0, 15);
}

/**
 * Get country-specific major retailers
 */
function getCountrySpecificSites(countryCode: string): string[] {
  const sites: { [key: string]: string[] } = {
    'IN': ['sangeetha.com', 'croma.com', 'reliancedigital.in', 'vijaysales.com', 'poorvika.com'],
    'US': ['macys.com', 'nordstrom.com', 'kohls.com', 'jcpenney.com', 'sears.com'],
    'CN': ['dangdang.com', 'yhd.com', 'vip.com', 'mogujie.com', 'meituan.com'],
    'JP': ['kakaku.com', 'mercari.com', 'zozo.jp', 'nissen.co.jp', 'cecile.co.jp'],
    'KR': ['tmon.co.kr', 'wemakeprice.co.kr', 'auction.co.kr', 'gsshop.com', 'hmall.com'],
    'DE': ['cyberport.de', 'conrad.de', 'pearl.de', 'plus.de', 'neckermann.de'],
    'FR': ['rueducommerce.com', 'laredoute.fr', '3suisses.fr', 'vente-privee.com', 'showroomprive.com'],
    'UK': ['screwfix.com', 'wickes.co.uk', 'b-and-q.co.uk', 'homebase.co.uk', 'dunelm.com'],
    'AU': ['kogan.com', 'ozbargain.com.au', 'gumtree.com.au', 'ebay.com.au', 'catch.com.au'],
    'BR': ['shoptime.com.br', 'americanas.com.br', 'ricardo.com.br', 'netshoes.com.br', 'zattini.com.br'],
    'MX': ['liverpool.com.mx', 'coppel.com', 'elektra.com.mx', 'soriana.com', 'chedraui.com.mx'],
    'CA': ['londondrugs.com', 'staples.ca', 'futureshop.ca', 'sears.ca', 'rona.ca'],
    'ZA': ['pricecheck.co.za', 'priceko.co.za', 'skyonline.co.za', 'evetech.co.za', 'kalahari.com'],
    'AE': ['carrefouruae.com', 'luluhypermarket.com', 'awok.com', 'menakart.com', 'desertcart.ae'],
    'SG': ['carousell.sg', 'redmart.com', 'fairprice.com.sg', 'hermo.com', 'zalora.sg'],
    'TH': ['central.co.th', 'powerbuy.co.th', 'jib.co.th', 'advice.co.th', 'bnn.in.th'],
    'VN': ['tiki.vn', 'sendo.vn', 'adayroi.com', 'fado.vn', 'concung.com'],
    'PH': ['lazada.com.ph', 'zalora.com.ph', 'sm-store.com', 'robinsons.com.ph', 'metromart.com'],
    'MY': ['11street.my', 'hermo.my', 'zalora.com.my', 'mudah.my', 'lelong.my'],
    'ID': ['tokopedia.com', 'bukalapak.com', 'blibli.com', 'bhinneka.com', 'jd.id'],
    'EG': ['jumia.com.eg', 'b-tech.com.eg', 'tradeline.com.eg', 'souq.com', 'carrefour.com.eg'],
    'NG': ['konga.com', 'slot.ng', 'computervillage.com.ng', 'dealdey.com', 'kaymu.com.ng'],
    'KE': ['pigiame.co.ke', 'cheki.co.ke', 'olx.co.ke', 'jiji.co.ke', 'skywave.co.ke'],
    'TR': ['n11.com', 'gittigidiyor.com', 'hepsiburada.com', 'trendyol.com', 'sahibinden.com'],
    'AR': ['fravega.com', 'garbarino.com', 'musimundo.com', 'cetrogar.com.ar', 'compumundo.com'],
    'CL': ['falabella.com', 'ripley.com', 'paris.cl', 'linio.com', 'dafiti.com'],
    'PE': ['falabella.com.pe', 'ripley.com.pe', 'oechsle.pe', 'linio.com.pe', 'mercadolibre.com.pe'],
    'CO': ['falabella.com.co', 'exito.com', 'alkosto.com', 'ktronix.com', 'linio.com.co'],
    'RU': ['ozon.ru', 'wildberries.ru', 'avito.ru', 'citilink.ru', 'mvideo.ru'],
    'PL': ['allegro.pl', 'ceneo.pl', 'morele.net', 'komputronik.pl', 'mediamarkt.pl'],
    'CZ': ['alza.cz', 'mall.cz', 'czc.cz', 'mironet.cz', 'tsbohemia.cz'],
    'HU': ['emag.hu', 'extreme-digital.hu', 'pcx.hu', 'aqua.hu', 'mediamarkt.hu'],
    'RO': ['emag.ro', 'pcgarage.ro', 'evomag.ro', 'cel.ro', 'flanco.ro'],
    'GR': ['skroutz.gr', 'plaisio.gr', 'kotsovolos.gr', 'mediamarkt.gr', 'germanos.gr'],
    'PT': ['worten.pt', 'fnac.pt', 'continente.pt', 'radiopopular.pt', 'mediamarkt.pt'],
    'SE': ['webhallen.com', 'inet.se', 'elgiganten.se', 'mediamarkt.se', 'kjell.com'],
    'NO': ['komplett.no', 'elkjop.no', 'power.no', 'expert.no', 'lefdal.com'],
    'DK': ['proshop.dk', 'elgiganten.dk', 'power.dk', 'expert.dk', 'fona.dk'],
    'FI': ['verkkokauppa.com', 'gigantti.fi', 'power.fi', 'expert.fi', 'jimms.fi'],
    'IL': ['ksp.co.il', 'bug.co.il', 'ivory.co.il', 'plonter.co.il', 'tms.co.il'],
    'UA': ['rozetka.com.ua', 'comfy.ua', 'foxtrot.com.ua', 'eldorado.ua', 'citrus.ua']
  };
  
  return sites[countryCode] || [];
}

export class RegionMapper {
  static getConfig(countryCode: string): CountryEcommerceConfig | null {
    const upperCode = countryCode.toUpperCase();
    
    // Return enhanced config if available
    if (ENHANCED_COUNTRY_CONFIGS[upperCode]) {
      return ENHANCED_COUNTRY_CONFIGS[upperCode];
    }

    // Generate config for any global country with enhanced coverage
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

  /**
   * Get priority retailers for a specific country (most relevant first)
   */
  static getPriorityRetailers(countryCode: string): string[] {
    const config = this.getConfig(countryCode);
    if (!config) return [];
    
    // Return top 5 most relevant retailers for the country
    return config.searchDomains.slice(0, 5);
  }

  /**
   * Get mobile-optimized retailers for a country
   */
  static getMobileOptimizedRetailers(countryCode: string): string[] {
    const mobileFirst = {
      'IN': ['amazon.in', 'flipkart.com', 'myntra.com', 'paytm.com', 'snapdeal.com'],
      'CN': ['tmall.com', 'taobao.com', 'jd.com', 'pinduoduo.com', 'suning.com'],
      'ID': ['tokopedia.com', 'shopee.co.id', 'bukalapak.com', 'blibli.com', 'lazada.co.id'],
      'BR': ['americanas.com.br', 'magazineluiza.com.br', 'mercadolivre.com.br', 'casasbahia.com.br'],
      'MX': ['mercadolibre.com.mx', 'amazon.com.mx', 'liverpool.com.mx', 'coppel.com'],
      'TH': ['shopee.co.th', 'lazada.co.th', 'central.co.th', 'powerbuy.co.th'],
      'VN': ['shopee.vn', 'tiki.vn', 'sendo.vn', 'lazada.vn'],
      'PH': ['shopee.ph', 'lazada.com.ph', 'zalora.com.ph', 'sm-store.com'],
      'MY': ['shopee.com.my', 'lazada.com.my', '11street.my', 'zalora.com.my'],
      'SG': ['shopee.sg', 'lazada.sg', 'qoo10.sg', 'zalora.sg'],
      'KR': ['coupang.com', 'gmarket.co.kr', '11st.co.kr', 'tmon.co.kr'],
      'JP': ['amazon.co.jp', 'rakuten.co.jp', 'yahoo-shopping.jp', 'mercari.com']
    };
    
    return mobileFirst[countryCode as keyof typeof mobileFirst] || this.getPriorityRetailers(countryCode);
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
   * Get marketplace-specific search optimization
   */
  static getMarketplaceOptimizedQuery(query: string, countryCode: string, marketplace: string): string {
    const marketplaceKeywords = {
      'amazon': 'prime shipping deals discount',
      'flipkart': 'flipkart assured exchange offer',
      'myntra': 'fashion style trend discount',
      'shopee': 'free shipping flash sale',
      'lazada': 'voucher discount promotion',
      'tmall': 'authentic brand official',
      'jd': 'genuine fast delivery',
      'mercadolibre': 'envio gratis cuotas',
      'walmart': 'rollback everyday low price',
      'target': 'cartwheel deal save',
      'bestbuy': 'best buy exclusive member',
      'ebay': 'auction buy it now',
      'alibaba': 'wholesale bulk order',
      'aliexpress': 'free shipping choice',
      'rakuten': 'points reward cashback',
      'otto': 'ratenkauf versandkostenfrei',
      'zalando': 'kostenlose retoure',
      'noon': 'express delivery warranty',
      'jumia': 'authentic warranty delivery',
      'takealot': 'fast delivery returns'
    };
    
    const baseQuery = this.getLocalizedSearchQuery(query, countryCode);
    const marketplaceKeyword = marketplaceKeywords[marketplace.toLowerCase() as keyof typeof marketplaceKeywords];
    
    return marketplaceKeyword ? `${baseQuery} ${marketplaceKeyword}` : baseQuery;
  }

  /**
   * Get optimized search query for a specific country
   */
  static getLocalizedSearchQuery(query: string, countryCode: string): string {
    const countryInfo = getCountryInfo(countryCode);
    if (!countryInfo) return query;

    // Enhanced country-specific terms with product category optimization
    const localTerms = {
      'US': 'buy online USA store price deals',
      'CA': 'buy Canada store price CAD',
      'GB': 'buy UK store price GBP deals',
      'AU': 'buy Australia store price AUD',
      'IN': 'buy India store online price INR rupees',
      'DE': 'kaufen Deutschland shop preis EUR',
      'FR': 'acheter France boutique prix EUR',
      'ES': 'comprar España tienda precio EUR',
      'IT': 'comprare Italia negozio prezzo EUR',
      'NL': 'kopen Nederland winkel prijs EUR',
      'JP': '購入 日本 store 価格 円 yen',
      'CN': '购买 中国 store 价格 元 yuan',
      'KR': '구매 한국 store 가격 원 won',
      'BR': 'comprar Brasil loja preço BRL real',
      'MX': 'comprar México tienda precio MXN peso',
      'AE': 'buy UAE store price AED dirham',
      'SA': 'buy Saudi Arabia store price SAR riyal',
      'ZA': 'buy South Africa store price ZAR rand',
      'SG': 'buy Singapore store price SGD dollar',
      'MY': 'buy Malaysia store price MYR ringgit',
      'TH': 'buy Thailand store price THB baht',
      'ID': 'buy Indonesia store price IDR rupiah',
      'PH': 'buy Philippines store price PHP peso',
      'VN': 'buy Vietnam store price VND dong',
      'EG': 'buy Egypt store price EGP pound',
      'NG': 'buy Nigeria store price NGN naira',
      'GH': 'buy Ghana store price GHS cedi',
      'AR': 'comprar Argentina tienda precio ARS peso',
      'CL': 'comprar Chile tienda precio CLP peso',
      'CO': 'comprar Colombia tienda precio COP peso',
      'PE': 'comprar Peru tienda precio PEN sol',
      'TR': 'satın al Türkiye mağaza fiyat TRY lira',
      'RU': 'купить Россия магазин цена RUB рубль',
      'PL': 'kupić Polska sklep cena PLN złoty',
      'CZ': 'koupit Česko obchod cena CZK koruna',
      'HU': 'vásárolni Magyarország bolt ár HUF forint',
      'RO': 'cumpăra România magazin preț RON leu',
      'GR': 'αγοράζω Ελλάδα κατάστημα τιμή EUR ευρώ',
      'PT': 'comprar Portugal loja preço EUR euro',
      'SE': 'köpa Sverige butik pris SEK krona',
      'NO': 'kjøpe Norge butikk pris NOK krone',
      'DK': 'købe Danmark butik pris DKK krone',
      'FI': 'ostaa Suomi kauppa hinta EUR euro',
      'IS': 'kaupa Ísland verslun verð ISK króna',
      'IE': 'buy Ireland store price EUR euro',
      'CH': 'kaufen Schweiz shop preis CHF franken',
      'AT': 'kaufen Österreich shop preis EUR euro',
      'BE': 'kopen België winkel prijs EUR euro',
      'LU': 'acheter Luxembourg boutique prix EUR euro',
      'MT': 'buy Malta store price EUR euro',
      'CY': 'buy Cyprus store price EUR euro',
      'EE': 'osta Eesti pood hind EUR euro',
      'LV': 'pirkt Latvija veikals cena EUR euro',
      'LT': 'pirkti Lietuva parduotuvė kaina EUR euro',
      'SI': 'kupiti Slovenija trgovina cena EUR euro',
      'SK': 'kúpiť Slovensko obchod cena EUR euro',
      'HR': 'kupiti Hrvatska trgovina cijena EUR euro',
      'BG': 'купувам България магазин цена BGN лев',
      'RS': 'купити Србија продавница цена RSD динар',
      'BA': 'kupiti Bosna trgovina cijena BAM marka',
      'MK': 'купи Македонија продавница цена MKD денар',
      'AL': 'bli Shqipëria dyqan çmim ALL lek',
      'ME': 'kupiti Crna Gora trgovina cijena EUR euro',
      'XK': 'bli Kosova dyqan çmim EUR euro',
      'MD': 'cumpăra Moldova magazin preț MDL leu',
      'UA': 'купити Україна магазин ціна UAH гривня',
      'BY': 'купіць Беларусь магазін цана BYN рубель',
      'GE': 'ყიდვა საქართველო მაღაზია ფასი GEL ლარი',
      'AM': 'գնել Հայաստան խանութ գին AMD դրամ',
      'AZ': 'almaq Azərbaycan mağaza qiymət AZN manat',
      'KZ': 'сатып алу Қазақстан дүкен баға KZT теңге',
      'UZ': 'sotib olish Oʻzbekiston doʻkon narx UZS soʻm',
      'KG': 'сатып алуу Кыргызстан дүкөн баа KGS сом',
      'TJ': 'харидан Тоҷикистон дӯкон нарх TJS сомонӣ',
      'TM': 'satyn almak Türkmenistan dükan baha TMT manat',
      'MN': 'худалдаж авах Монгол дэлгүүр үнэ MNT төгрөг',
      'IL': 'לקנות ישראל חנות מחיר ILS שקל',
      'JO': 'اشتري الأردن متجر سعر JOD دينار',
      'LB': 'اشتري لبنان متجر سعر LBP ليرة',
      'SY': 'اشتري سوريا متجر سعر SYP ليرة',
      'IQ': 'اشتري العراق متجر سعر IQD دينار',
      'KW': 'اشتري الكويت متجر سعر KWD دينار',
      'QA': 'اشتري قطر متجر سعر QAR ريال',
      'BH': 'اشتري البحرين متجر سعر BHD دينار',
      'OM': 'اشتري عمان متجر سعر OMR ريال',
      'YE': 'اشتري اليمن متجر سعر YER ريال',
      'MA': 'اشتري المغرب متجر سعر MAD درهم',
      'DZ': 'اشتري الجزائر متجر سعر DZD دينار',
      'TN': 'اشتري تونس متجر سعر TND دينار',
      'LY': 'اشتري ليبيا متجر سعر LYD دينار',
      'SD': 'اشتري السودان متجر سعر SDG جنيه',
      'ET': 'መግዛት ኢትዮጵያ ሱቅ ዋጋ ETB ብር',
      'KE': 'nunua Kenya duka bei KES shilingi',
      'UG': 'gula Uganda dduuka bbeeyi UGX shilingi',
      'TZ': 'nunua Tanzania duka bei TZS shilingi',
      'RW': 'kugura Rwanda iduka igiciro RWF farangi',
      'BI': 'kugura Uburundi iduka igiciro BIF farangi',
      'DJ': 'acheter Djibouti magasin prix DJF franc',
      'SO': 'iibso Soomaaliya dukaan qiimo SOS shilin',
      'ER': 'መግዛት ኤርትራ ሱቅ ዋጋ ERN ናቕፋ',
      'CF': 'acheter Centrafrique magasin prix XAF franc',
      'TD': 'acheter Tchad magasin prix XAF franc',
      'CM': 'acheter Cameroun magasin prix XAF franc',
      'GA': 'acheter Gabon magasin prix XAF franc',
      'GQ': 'comprar Guinea Ecuatorial tienda precio XAF franco',
      'ST': 'comprar São Tomé loja preço STN dobra',
      'CV': 'comprar Cabo Verde loja preço CVE escudo',
      'GW': 'comprar Guiné-Bissau loja preço XOF franco',
      'GN': 'acheter Guinée magasin prix GNF franc',
      'SL': 'buy Sierra Leone store price SLL leone',
      'LR': 'buy Liberia store price LRD dollar',
      'CI': 'acheter Côte d\'Ivoire magasin prix XOF franc',
      'BF': 'acheter Burkina Faso magasin prix XOF franc',
      'ML': 'acheter Mali magasin prix XOF franc',
      'NE': 'acheter Niger magasin prix XOF franc',
      'SN': 'acheter Sénégal magasin prix XOF franc',
      'GM': 'buy Gambia store price GMD dalasi',
      'MR': 'اشتري موريتانيا متجر سعر MRU أوقية',
      'MG': 'mividy Madagasikara fivarotana vidiny MGA ariary',
      'MU': 'acheter Maurice magasin prix MUR roupie',
      'SC': 'buy Seychelles store price SCR rupee',
      'KM': 'acheter Comores magasin prix KMF franc',
      'MZ': 'comprar Moçambique loja preço MZN metical',
      'AO': 'comprar Angola loja preço AOA kwanza',
      'ZW': 'tenga Zimbabwe chitoro mutengo USD dollar',
      'ZM': 'gula Zambia sitolo mtengo ZMW kwacha',
      'MW': 'gula Malawi sitolo mtengo MWK kwacha',
      'BW': 'reka Botswana lefelo tlhwatlhwa BWP pula',
      'NA': 'koop Namibië winkel prys NAD dollar',
      'SZ': 'thenga Eswatini sitolo intengo SZL lilangeni',
      'LS': 'reka Lesotho lebenkele theko LSL loti'
    };

    const localTerm = localTerms[countryCode as keyof typeof localTerms] || 'buy online store price';
    return `${query} ${localTerm}`;
  }

  /**
   * Get category-specific search optimization
   */
  static getCategoryOptimizedQuery(query: string, countryCode: string): string {
    const baseQuery = this.getLocalizedSearchQuery(query, countryCode);
    
    // Category-specific enhancements
    const categoryKeywords = {
      electronics: ['smartphone', 'laptop', 'tablet', 'tv', 'camera', 'headphones', 'speaker', 'gaming'],
      fashion: ['shoes', 'clothing', 'dress', 'shirt', 'pants', 'jacket', 'bag', 'watch'],
      home: ['furniture', 'kitchen', 'bedroom', 'living room', 'appliance', 'decor'],
      beauty: ['makeup', 'skincare', 'perfume', 'cosmetics', 'hair care', 'beauty'],
      sports: ['fitness', 'exercise', 'sports', 'outdoor', 'gym', 'running', 'yoga'],
      books: ['book', 'novel', 'textbook', 'education', 'learning', 'study'],
      automotive: ['car', 'motorcycle', 'auto', 'parts', 'accessories', 'vehicle'],
      health: ['medicine', 'health', 'wellness', 'supplement', 'medical', 'pharmacy'],
      toys: ['toy', 'game', 'kids', 'children', 'baby', 'infant', 'toddler'],
      grocery: ['food', 'grocery', 'organic', 'fresh', 'cooking', 'kitchen']
    };
    
    const queryLower = query.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return `${baseQuery} ${category}`;
      }
    }
    
    return baseQuery;
  }
}