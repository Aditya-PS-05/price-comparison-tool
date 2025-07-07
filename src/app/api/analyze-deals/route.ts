import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const analyzeRequestSchema = z.object({
  query: z.string().min(1),
  country: z.string().min(2).max(3),
  searchResults: z.array(z.object({
    title: z.string(),
    url: z.string(),
    snippet: z.string()
  }))
});

// Structured output from LLM
interface AnalyzedDeal {
  title: string;
  url: string;
  price?: string;
  currency?: string;
  discount?: string;
  availability?: string;
  seller: string;
  relevanceScore: number;
  dealQuality: 'excellent' | 'good' | 'average' | 'poor';
  reasons: string[];
}

interface AnalysisResponse {
  query: string;
  country: string;
  totalResults: number;
  relevantResults: number;
  deals: AnalyzedDeal[];
  summary: string;
  searchEngineUsed: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedBody = analyzeRequestSchema.parse(body);
    const { query, country, searchResults } = validatedBody;

    console.log(`Analyzing ${searchResults.length} search results for "${query}" in ${country}`);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        query,
        country,
        totalResults: searchResults.length,
        relevantResults: 0,
        deals: [],
        summary: "OpenAI API key not configured. Returning original results.",
        searchEngineUsed: "raw_search_results"
      });
    }

    // Prepare the prompt for OpenAI
    const systemPrompt = `You are an expert deal analyzer and price comparison specialist. 
    
Your task is to analyze search results and extract ONLY the best and most relevant shopping deals for a specific product query.

STRICT FILTERING GUIDELINES:
1. ONLY include results that are directly relevant to the searched product
2. EXCLUDE: App store listings, informational pages, news articles, reviews, unrelated products
3. INCLUDE ONLY: Actual shopping sites with clear product listings
4. Focus on deals with good prices, discounts, or high-quality retailers
5. Rate deal quality as 'excellent' for great prices/discounts, 'good' for fair deals
6. DO NOT include 'poor' or 'average' deals - only show the best options
7. Extract actual prices when visible in snippets
8. Prioritize well-known, reputable retailers

QUALITY STANDARDS:
- Excellent: Clear discount, competitive price, reputable seller
- Good: Fair price, decent seller, good availability
- DO NOT INCLUDE: Poor or average quality deals

Return only the top deals that users should actually consider buying.`;

    const userPrompt = `Search Query: "${query}"
Country: ${country}

Search Results to Analyze:
${searchResults.map((result, index) => `
${index + 1}. Title: ${result.title}
   URL: ${result.url}
   Snippet: ${result.snippet}
`).join('\n')}

Please analyze these results and return a JSON object with this structure:
{
  "deals": [
    {
      "title": "Product title",
      "url": "Product URL", 
      "price": "Price if found (e.g., '$299')",
      "currency": "Currency code (e.g., 'USD')",
      "discount": "Discount info if any (e.g., '20% off')",
      "availability": "Stock status (e.g., 'In Stock')",
      "seller": "Retailer name",
      "relevanceScore": 0.95,
      "dealQuality": "excellent|good|average|poor",
      "reasons": ["Why this is a good/bad deal"]
    }
  ],
  "summary": "Brief summary of the best deals found"
}

IMPORTANT: Only include EXCELLENT and GOOD quality deals that are directly relevant to buying "${query}". 
- Completely exclude app store listings, informational pages, news articles, and unrelated products
- Focus on actual shopping opportunities with competitive prices
- If a result doesn't clearly offer the product for sale, exclude it
- Prioritize deals with visible prices, discounts, or from reputable retailers
- Maximum 20 best deals only`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const analysisResult = JSON.parse(openaiData.choices[0].message.content);

    const response: AnalysisResponse = {
      query,
      country,
      totalResults: searchResults.length,
      relevantResults: analysisResult.deals?.length || 0,
      deals: analysisResult.deals || [],
      summary: analysisResult.summary || "No relevant deals found",
      searchEngineUsed: "llm_analyzed"
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Deal analysis error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          query: '',
          country: '',
          totalResults: 0,
          relevantResults: 0,
          deals: [],
          summary: 'Invalid request data',
          searchEngineUsed: 'error'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        query: '',
        country: '',
        totalResults: 0,
        relevantResults: 0,
        deals: [],
        summary: error instanceof Error ? error.message : 'Analysis failed',
        searchEngineUsed: 'error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to analyze deals",
    example: {
      query: "Nike Jordan shoes",
      country: "US", 
      searchResults: [
        {
          title: "Air Jordan 1 Retro High OG",
          url: "https://www.nike.com/...",
          snippet: "Classic basketball shoe with premium materials..."
        }
      ]
    }
  });
}