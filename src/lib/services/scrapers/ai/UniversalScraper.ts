import { Product } from '../../../types/product';
import { ScraperResult } from '../../../types/scraper';
import { LLMConfig } from '../../../types/api';
import { BaseScraper } from '../base/BaseScraper';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';

export class UniversalScraper extends BaseScraper {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private llmConfig: LLMConfig;
  
  constructor(baseUrl: string, llmConfig: LLMConfig) {
    super({
      baseUrl,
      selectors: {
        productName: '',
        price: '',
        link: '',
        seller: '',
        rating: '',
        availability: ''
      },
      antiDetection: {
        useProxy: true,
        rotateUserAgent: true,
        randomDelay: true
      }
    });
    
    this.llmConfig = llmConfig;
    
    if (llmConfig.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else if (llmConfig.provider === 'anthropic') {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }
  
  async scrapeWithAI(url: string, query: string): Promise<ScraperResult> {
    const startTime = Date.now();
    
    try {
      const screenshot = await this.takeScreenshot(url);
      const html = await this.fetchPage(url);
      
      const products = await this.extractWithAI(html, screenshot, query);
      
      return {
        products,
        metadata: {
          sourceUrl: url,
          scrapedAt: new Date().toISOString(),
          totalFound: products.length,
          success: true
        }
      };
    } catch (error) {
      return {
        products: [],
        metadata: {
          sourceUrl: url,
          scrapedAt: new Date().toISOString(),
          totalFound: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
  
  private async takeScreenshot(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const screenshot = await page.screenshot({
        encoding: 'base64',
        fullPage: true
      });
      
      return screenshot as string;
    } finally {
      await page.close();
      await browser.close();
    }
  }
  
  private async extractWithAI(html: string, screenshot: string, query: string): Promise<Product[]> {
    const systemPrompt = this.buildAISystemPrompt(query);
    const userPrompt = this.buildAIUserPrompt(html, query);
    
    try {
      let response: string;
      
      if (this.llmConfig.provider === 'openai' && this.openai) {
        response = await this.callOpenAIVision(systemPrompt, userPrompt, screenshot);
      } else if (this.llmConfig.provider === 'anthropic' && this.anthropic) {
        response = await this.callAnthropicVision(systemPrompt, userPrompt, screenshot);
      } else {
        throw new Error('No LLM provider configured');
      }
      
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Error extracting with AI:', error);
      return [];
    }
  }
  
  private buildAISystemPrompt(query: string): string {
    return `You are a web scraping AI assistant. Your task is to extract product information from e-commerce websites.
    
    The user is searching for: "${query}"
    
    You will receive:
    1. HTML content of the page
    2. A screenshot of the page
    
    Extract product information and return a JSON array of products with this structure:
    [
      {
        "productName": "exact product name",
        "price": "price as number string",
        "currency": "currency code",
        "link": "product URL",
        "seller": "seller name",
        "sellerRating": "rating as number",
        "availability": "availability status",
        "condition": "new/used/refurbished",
        "estimatedDelivery": "delivery timeframe",
        "image": "image URL if available"
      }
    ]
    
    Rules:
    - Only extract products that match the search query
    - Ensure prices are clean numbers without currency symbols
    - Include full product URLs, not relative paths
    - Rate products based on relevance to the query
    - Return only valid JSON, no additional text
    - If no products found, return empty array []`;
  }
  
  private buildAIUserPrompt(html: string, query: string): string {
    // Truncate HTML to avoid token limits
    const truncatedHtml = html.substring(0, 8000);
    
    return `Extract products matching "${query}" from this HTML:
    
    ${truncatedHtml}
    
    Focus on product listings, prices, and seller information.`;
  }
  
  private async callOpenAIVision(systemPrompt: string, userPrompt: string, screenshot: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not initialized');
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${screenshot}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });
    
    return completion.choices[0]?.message?.content || '';
  }
  
  private async callAnthropicVision(systemPrompt: string, userPrompt: string, screenshot: string): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic not initialized');
    
    const message = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: screenshot
              }
            }
          ]
        }
      ],
    });
    
    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
  }
  
  private parseAIResponse(response: string): Product[] {
    try {
      // Clean the response by removing markdown code blocks
      let cleanedResponse = response.trim();
      
      // Remove ```json and ``` markers if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7);
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      
      cleanedResponse = cleanedResponse.trim();
      
      const parsed = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(parsed)) {
        return [];
      }
      
      return parsed.map(item => ({
        productName: item.productName || '',
        price: this.normalizePrice(item.price || '0'),
        currency: item.currency || 'USD',
        link: item.link || '',
        seller: item.seller || 'Unknown',
        sellerRating: parseFloat(item.sellerRating || '0'),
        shippingCost: '0',
        totalCost: this.normalizePrice(item.price || '0'),
        availability: item.availability || 'Unknown',
        condition: item.condition || 'New',
        estimatedDelivery: item.estimatedDelivery || '7-14 days',
        trustScore: this.calculateTrustScore(parseFloat(item.sellerRating || '0'), 100),
        sourceWebsite: this.config.baseUrl,
        lastUpdated: new Date().toISOString(),
        image: item.image
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw response:', response);
      return [];
    }
  }
  
  protected buildSearchUrl(query: string): string {
    return this.config.baseUrl;
  }
  
  extractProducts(html: string, query: string): Product[] {
    // This method is required by BaseScraper but not used in AI scraping
    return [];
  }
}