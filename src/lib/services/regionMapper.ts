export const COUNTRY_CONFIGS = {
  US: {
    searchDomains: ['amazon.com', 'walmart.com', 'bestbuy.com', 'target.com', 'apple.com', 'newegg.com'],
    currency: 'USD',
    language: 'en-US',
    region: 'United States'
  },
  IN: {
    searchDomains: ['amazon.in', 'flipkart.com', 'snapdeal.com', 'paytmmall.com', 'apple.com/in'],
    currency: 'INR',
    language: 'en-IN',
    region: 'India'
  },
  UK: {
    searchDomains: ['amazon.co.uk', 'currys.co.uk', 'argos.co.uk', 'apple.com/uk'],
    currency: 'GBP',
    language: 'en-GB',
    region: 'United Kingdom'
  },
  CA: {
    searchDomains: ['amazon.ca', 'bestbuy.ca', 'canadiantire.ca', 'apple.com/ca'],
    currency: 'CAD',
    language: 'en-CA',
    region: 'Canada'
  }
};

export class RegionMapper {
  static getConfig(countryCode: string) {
    return COUNTRY_CONFIGS[countryCode.toUpperCase() as keyof typeof COUNTRY_CONFIGS];
  }
  
  static getSearchDomains(countryCode: string): string[] {
    const config = this.getConfig(countryCode);
    return config?.searchDomains || [];
  }
  
  static getCurrency(countryCode: string): string {
    const config = this.getConfig(countryCode);
    return config?.currency || 'USD';
  }
  
  static getLanguage(countryCode: string): string {
    const config = this.getConfig(countryCode);
    return config?.language || 'en-US';
  }
  
  static getRegion(countryCode: string): string {
    const config = this.getConfig(countryCode);
    return config?.region || countryCode;
  }
  
  static getSupportedCountries(): string[] {
    return Object.keys(COUNTRY_CONFIGS);
  }
}