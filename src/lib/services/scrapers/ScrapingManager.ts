import { Product, ProcessedQuery } from '../../types/product';
import { ScraperResult } from '../../types/scraper';
import { AmazonScraper } from './amazon/AmazonScraper';
import { BaseScraper } from './base/BaseScraper';
import { UniversalScraper } from './ai/UniversalScraper';
import { LLMConfig } from '../../types/api';

export class ScrapingManager {
  private llmConfig: LLMConfig;

  constructor(llmConfig: LLMConfig) {
    this.llmConfig = llmConfig;
  }

  async searchProducts(processedQuery: ProcessedQuery, country: string): Promise<Product[]> {
    const regionalSites = this.getRegionalSites(country);
    const scrapers = this.initializeScrapers(regionalSites);
    
    const scrapingPromises = scrapers.map(async ({ scraper, site }) => {
      try {
        const searchUrl = this.buildSearchUrl(site, processedQuery.normalizedQuery);
        console.log(`Scraping ${site} with URL: ${searchUrl}`);
        
        // Try site-specific scraper first, fall back to AI scraper
        if (scraper instanceof AmazonScraper) {
          return await scraper.scrape(processedQuery.normalizedQuery);
        } else {
          // Use AI scraper for other sites
          const aiScraper = scraper as UniversalScraper;
          return await aiScraper.scrapeWithAI(searchUrl, processedQuery.normalizedQuery);
        }
      } catch (error) {
        console.error(`Error scraping ${site}:`, error);
        return {
          products: [],
          metadata: {
            sourceUrl: site,
            scrapedAt: new Date().toISOString(),
            totalFound: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Scraping failed'
          }
        };
      }
    });

    const results = await Promise.allSettled(scrapingPromises);
    
    // Combine all products
    const allProducts: Product[] = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.products) {
        allProducts.push(...result.value.products);
      }
    });

    return this.deduplicateAndRank(allProducts, processedQuery);
  }

  private getRegionalSites(country: string): string[] {
    const sites = {
      'US': ['amazon.com', 'ebay.com', 'walmart.com'],
      'UK': ['amazon.co.uk', 'ebay.co.uk', 'argos.co.uk'],
      'DE': ['amazon.de', 'ebay.de', 'saturn.de'],
      'FR': ['amazon.fr', 'ebay.fr', 'fnac.com'],
      'IN': ['amazon.in', 'flipkart.com', 'snapdeal.com'],
      'CA': ['amazon.ca', 'ebay.ca', 'bestbuy.ca']
    };
    
    return sites[country as keyof typeof sites] || sites['US'];
  }

  private initializeScrapers(sites: string[]): Array<{ scraper: BaseScraper | UniversalScraper, site: string }> {
    return sites.map(site => {
      if (site.includes('amazon')) {
        return { scraper: new AmazonScraper(site), site };
      } else {
        // Use AI scraper for other sites
        return { scraper: new UniversalScraper(`https://${site}`, this.llmConfig), site };
      }
    });
  }

  private buildSearchUrl(site: string, query: string): string {
    const encodedQuery = encodeURIComponent(query);
    
    if (site.includes('amazon')) {
      return `https://${site}/s?k=${encodedQuery}&ref=nb_sb_noss`;
    } else if (site.includes('ebay')) {
      return `https://${site}/sch/i.html?_nkw=${encodedQuery}`;
    } else if (site.includes('walmart')) {
      return `https://${site}/search?q=${encodedQuery}`;
    } else if (site.includes('bestbuy')) {
      return `https://${site}/site/searchpage.jsp?st=${encodedQuery}`;
    } else if (site.includes('target')) {
      return `https://${site}/s?searchTerm=${encodedQuery}`;
    } else if (site.includes('flipkart')) {
      return `https://${site}/search?q=${encodedQuery}`;
    } else {
      return `https://${site}/search?q=${encodedQuery}`;
    }
  }

  private deduplicateAndRank(products: Product[], processedQuery: ProcessedQuery): Product[] {
    // Remove duplicates based on product name similarity
    const unique = products.filter((product, index, array) => {
      return index === array.findIndex(p => 
        this.similarity(p.productName.toLowerCase(), product.productName.toLowerCase()) < 0.8
      );
    });

    // Rank by relevance to query
    return unique
      .map(product => ({
        ...product,
        relevanceScore: this.calculateRelevance(product, processedQuery)
      }))
      .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
      .slice(0, 20); // Top 20 results
  }

  private calculateRelevance(product: Product, query: ProcessedQuery): number {
    let score = 0;
    const productName = product.productName.toLowerCase();
    const normalizedQuery = query.normalizedQuery.toLowerCase();

    // Exact brand match
    if (query.brand && productName.includes(query.brand.toLowerCase())) {
      score += 3;
    }

    // Model match
    if (query.model && productName.includes(query.model.toLowerCase())) {
      score += 2;
    }

    // Query term matches
    const queryWords = normalizedQuery.split(' ');
    queryWords.forEach(word => {
      if (word.length > 2 && productName.includes(word)) {
        score += 1;
      }
    });

    // Trust score bonus
    score += product.trustScore;

    return score;
  }

  private similarity(str1: string, str2: string): number {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    return track[str2.length][str1.length] / Math.max(str1.length, str2.length);
  }
}