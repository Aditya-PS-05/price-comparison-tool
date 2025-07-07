import { Product } from '../../../types/product';
import { ScraperConfig, ScraperResult } from '../../../types/scraper';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected browser?: Browser;
  
  constructor(config: ScraperConfig) {
    this.config = config;
  }
  
  abstract extractProducts(html: string, query: string): Product[];
  
  async scrape(query: string, options: { maxResults?: number } = {}): Promise<ScraperResult> {
    const startTime = Date.now();
    
    try {
      const searchUrl = this.buildSearchUrl(query);
      const html = await this.fetchPage(searchUrl);
      const products = this.extractProducts(html, query);
      
      return {
        products: products.slice(0, options.maxResults || 50),
        metadata: {
          sourceUrl: searchUrl,
          scrapedAt: new Date().toISOString(),
          totalFound: products.length,
          success: true
        }
      };
    } catch (error) {
      return {
        products: [],
        metadata: {
          sourceUrl: this.config.baseUrl,
          scrapedAt: new Date().toISOString(),
          totalFound: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
  
  protected abstract buildSearchUrl(query: string): string;
  
  protected async fetchPage(url: string): Promise<string> {
    if (this.config.antiDetection?.useProxy) {
      return this.fetchWithBrowser(url);
    }
    return this.fetchWithAxios(url);
  }
  
  private async fetchWithAxios(url: string): Promise<string> {
    const headers = {
      'User-Agent': this.getRandomUserAgent(),
      ...this.config.headers
    };
    
    if (this.config.antiDetection?.randomDelay) {
      await this.randomDelay();
    }
    
    const response = await axios.get(url, { 
      headers,
      timeout: 10000,
      maxRedirects: 5
    });
    
    return response.data;
  }
  
  private async fetchWithBrowser(url: string): Promise<string> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    
    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent(this.getRandomUserAgent());
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      if (this.config.antiDetection?.randomDelay) {
        await this.randomDelay();
      }
      
      const html = await page.content();
      return html;
    } finally {
      await page.close();
    }
  }
  
  protected getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
    ];
    
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
  
  protected async randomDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  protected normalizePrice(priceText: string): string {
    return priceText.replace(/[^\d.,]/g, '').replace(',', '');
  }
  
  protected calculateTrustScore(sellerRating: number, reviewCount: number): number {
    if (sellerRating === 0) return 0.5;
    
    const ratingScore = sellerRating / 5;
    const reviewScore = Math.min(reviewCount / 100, 1);
    
    return (ratingScore * 0.7 + reviewScore * 0.3);
  }
  
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }
  }
}