import { ProcessedQuery } from '../../types/product';
import { LLMConfig } from '../../types/api';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export class QueryProcessor {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private config: LLMConfig;
  
  constructor(config: LLMConfig) {
    this.config = config;
    
    if (config.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else if (config.provider === 'anthropic') {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }
  
  async processQuery(query: string, country: string): Promise<ProcessedQuery> {
    const systemPrompt = this.buildSystemPrompt(country);
    const userPrompt = this.buildUserPrompt(query);
    
    try {
      let response: string;
      
      if (this.config.provider === 'openai' && this.openai) {
        response = await this.callOpenAI(systemPrompt, userPrompt);
      } else if (this.config.provider === 'anthropic' && this.anthropic) {
        response = await this.callAnthropic(systemPrompt, userPrompt);
      } else {
        throw new Error('No LLM provider configured');
      }
      
      return this.parseResponse(response, query);
    } catch (error) {
      console.error('Error processing query:', error);
      return this.fallbackProcessing(query);
    }
  }
  
  private buildSystemPrompt(country: string): string {
    return `You are a product search query analyzer. Your task is to extract structured information from user product search queries.
    
    The user is searching from: ${country}
    
    You must return a JSON object with the following structure:
    {
      "normalizedQuery": "cleaned and normalized version of the query",
      "productCategory": "main category (electronics, fashion, home, etc.)",
      "brand": "brand name if mentioned",
      "model": "model name if mentioned", 
      "specifications": {"key": "value", ...},
      "alternativeSearchTerms": ["term1", "term2", ...],
      "localBrandEquivalents": ["brand1", "brand2", ...],
      "suggestedCategories": ["category1", "category2", ...]
    }
    
    Rules:
    - Extract brand and model names accurately
    - Identify key specifications like storage, color, size, etc.
    - Suggest alternative search terms that might find the same product
    - For the country ${country}, suggest local brand equivalents
    - Categorize the product appropriately
    - Return only valid JSON, no additional text`;
  }
  
  private buildUserPrompt(query: string): string {
    return `Analyze this product search query: "${query}"`;
  }
  
  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not initialized');
    
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });
    
    return completion.choices[0]?.message?.content || '';
  }
  
  private async callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic not initialized');
    
    const message = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });
    
    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
  }
  
  private parseResponse(response: string, originalQuery: string): ProcessedQuery {
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
      
      return {
        originalQuery,
        normalizedQuery: parsed.normalizedQuery || originalQuery,
        productCategory: parsed.productCategory || 'general',
        brand: parsed.brand,
        model: parsed.model,
        specifications: parsed.specifications || {},
        alternativeSearchTerms: parsed.alternativeSearchTerms || [],
        localBrandEquivalents: parsed.localBrandEquivalents || [],
        suggestedCategories: parsed.suggestedCategories || []
      };
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      console.error('Raw response:', response);
      return this.fallbackProcessing(originalQuery);
    }
  }
  
  private fallbackProcessing(query: string): ProcessedQuery {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Basic brand detection
    const brands = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'amazon', 'google', 'microsoft'];
    const detectedBrand = brands.find(brand => normalizedQuery.includes(brand));
    
    // Basic category detection
    const categories = {
      'phone': 'electronics',
      'laptop': 'electronics',
      'tv': 'electronics',
      'shoes': 'fashion',
      'shirt': 'fashion',
      'book': 'books',
      'watch': 'accessories'
    };
    
    const detectedCategory = Object.keys(categories).find(key => 
      normalizedQuery.includes(key)
    );
    
    return {
      originalQuery: query,
      normalizedQuery,
      productCategory: detectedCategory ? categories[detectedCategory as keyof typeof categories] : 'general',
      brand: detectedBrand,
      model: undefined,
      specifications: {},
      alternativeSearchTerms: [normalizedQuery],
      localBrandEquivalents: [],
      suggestedCategories: []
    };
  }
}