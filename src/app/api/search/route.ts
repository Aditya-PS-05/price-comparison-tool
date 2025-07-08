import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/services/searchService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Input validation schema - simplified for current API
const searchRequestSchema = z.object({
  country: z.string().min(2).max(3),
  query: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedBody = searchRequestSchema.parse(body);
    const { country, query } = validatedBody;
    
    console.log(`Searching for "${query}" in ${country}`);
    
    // Initialize search service
    const searchService = new SearchService();
    
    // Get search results using the testSearch method
    const searchResponse = await searchService.testSearch(query, country);
    
    // Save to past searches if user is authenticated
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id && searchResponse.searchResultsCount > 0) {
        await prisma.search.create({
          data: {
            userId: session.user.id,
            query,
            country,
            resultsCount: searchResponse.searchResultsCount
          }
        });
        console.log(`Saved past search for user ${session.user.id}: "${query}" in ${country}`);
      }
    } catch (dbError) {
      // Don't fail the search if database save fails
      console.error('Failed to save past search:', dbError);
    }
    
    // Return response directly (matches current API format)
    return NextResponse.json(searchResponse);
    
  } catch (error) {
    console.error('Search API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          query: '',
          country: '',
          searchResultsCount: 0,
          searchResults: [],
          searchEngineUsed: 'error',
          error: 'Invalid request data'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        query: '',
        country: '',
        searchResultsCount: 0,
        searchResults: [],
        searchEngineUsed: 'error',
        error: error instanceof Error ? error.message : 'Internal server error'
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
        query: '',
        country: '',
        searchResultsCount: 0,
        searchResults: [],
        searchEngineUsed: 'error',
        error: 'Query parameter is required'
      },
      { status: 400 }
    );
  }
  
  // Convert GET request to POST format
  const body = {
    country,
    query
  };
  
  // Create a new request object for the POST handler
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  return POST(postRequest);
}