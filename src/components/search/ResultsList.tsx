'use client';

import React, { useState } from 'react';
import { ProductSearchResponse } from '@/lib/types/product';
import { ResultCard } from './ResultCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, 
  SortAsc, 
  Search,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ResultsListProps {
  results: ProductSearchResponse;
}

export function ResultsList({ results }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<'relevance' | 'title'>('relevance');
  const [filterDomain, setFilterDomain] = useState<string>('');

  // Sort results based on selected criteria
  const sortedResults = [...results.searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'relevance':
      default:
        return 0; // Keep original order for relevance
    }
  });

  // Filter by domain if specified
  const filteredResults = filterDomain 
    ? sortedResults.filter(result => result.url.includes(filterDomain))
    : sortedResults;

  if (results.searchResultsCount === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search terms or check the spelling.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Search Results for &quot;{results.query}&quot;
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{results.searchResultsCount}</div>
              <div className="text-sm text-gray-600">Results Found</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{results.country}</div>
              <div className="text-sm text-gray-600">Country</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{results.searchEngineUsed}</div>
              <div className="text-sm text-gray-600">Search Engine</div>
            </div>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              <Search className="w-3 h-3 mr-1" />
              Live Search Results
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sites</SelectItem>
                <SelectItem value="apple.com">Apple</SelectItem>
                <SelectItem value="bestbuy.com">Best Buy</SelectItem>
                <SelectItem value="amazon.com">Amazon</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            
            <Select value={sortBy} onValueChange={(value: 'relevance' | 'title') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Badge variant="secondary">
                {filteredResults.length} of {results.searchResultsCount} shown
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result, index) => (
          <ResultCard 
            key={`${result.url}-${index}`}
            result={result}
            rank={index + 1}
          />
        ))}
      </div>


      {/* Search Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Search powered by: {results.searchEngineUsed}</p>
            <p className="text-xs">
              Results are fetched in real-time. Click &quot;Visit Site&quot; to view the full content on the original website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}