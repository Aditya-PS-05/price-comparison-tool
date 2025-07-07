import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDealAnalysisPrompt } from '@/lib/prompts/dealAnalysisPrompt';

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

    // Get the comprehensive deal analysis prompt
    const { systemPrompt, userPrompt } = getDealAnalysisPrompt(query, country, searchResults);

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
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