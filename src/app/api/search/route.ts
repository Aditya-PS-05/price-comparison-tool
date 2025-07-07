import { NextRequest, NextResponse } from 'next/server';
import { ProductSearchRequest, ProductSearchResponse } from '@/lib/types/product';
import { QueryProcessor } from '@/lib/services/llm/queryProcessor';
import { RegionMapper } from '@/lib/services/regionMapper';
import { ScrapingManager } from '@/lib/services/scrapers/ScrapingManager';
import { LLMConfig } from '@/lib/types/api';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body: ProductSearchRequest = await request.json();
    const { country, query, options = {} } = body;
    
    // Validate required fields
    if (!country || !query) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Country and query are required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    // Initialize LLM configuration
    const llmConfig: LLMConfig = {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.1,
      maxTokens: 1000,
      timeout: 30000
    };
    
    // Process query with LLM
    const queryProcessor = new QueryProcessor(llmConfig);
    const processedQuery = await queryProcessor.processQuery(query, country);
    
    // Get regional websites
    const regionalSites = RegionMapper.getRegionalSites(country);
    const currency = RegionMapper.getCurrency(country);
    
    // Initialize scraping manager and search for products
    const scrapingManager = new ScrapingManager(llmConfig);
    const allProducts = await scrapingManager.searchProducts(processedQuery, country);
    
    console.log(`Found ${allProducts.length} products total`);
    
    // Apply filters if specified
    let filteredProducts = allProducts.slice(0, options.maxResults || 20);
    
    if (options.minRating) {
      filteredProducts = filteredProducts.filter(p => p.sellerRating >= options.minRating!);
    }
    
    if (options.priceRange) {
      filteredProducts = filteredProducts.filter(p => {
        const price = parseFloat(p.price);
        return price >= options.priceRange!.min && price <= options.priceRange!.max;
      });
    }
    
    // Calculate search time
    const searchTime = `${(Date.now() - startTime) / 1000}s`;
    
    // Build response
    const response: ProductSearchResponse = {
      query: processedQuery.originalQuery,
      country,
      resultsCount: filteredProducts.length,
      searchTime,
      results: filteredProducts,
      alternatives: processedQuery.alternativeSearchTerms.map(term => ({
        productName: term,
        reason: 'Alternative search term',
        price: '0'
      })),
      metadata: {
        sourcesScrapped: regionalSites.slice(0, 3),
        cacheHit: false,
        regionMapped: true
      }
    };
    
    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'US';
  const query = searchParams.get('q') || searchParams.get('query');
  
  if (!query) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Query parameter is required',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  }
  
  // Convert GET request to POST format
  const body: ProductSearchRequest = {
    country,
    query,
    options: {
      maxResults: parseInt(searchParams.get('maxResults') || '20'),
      includeShipping: searchParams.get('includeShipping') === 'true',
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
    }
  };
  
  // Create a new request object for the POST handler
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  return POST(postRequest);
}