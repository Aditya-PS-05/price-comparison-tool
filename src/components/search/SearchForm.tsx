'use client';

import React, { useState } from 'react';
import { Search, Globe, Package, Loader2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalysisResponse } from '@/lib/types/product';
import { RegionMapper } from '@/lib/services/regionMapper';

interface SearchFormProps {
  onAnalysis: (analysis: AnalysisResponse) => void;
  onError: (error: string) => void;
}

export function SearchForm({ onAnalysis, onError }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const supportedCountries = RegionMapper.getSupportedCountries();

  const handleSearch = async () => {
    if (!query.trim()) {
      onError('Please enter a search query');
      return;
    }

    setLoading(true);
    
    try {
      const searchRequest = {
        country,
        query: query.trim()
      };

      // First get the raw search results (up to 100)
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest),
      });

      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      
      // Automatically analyze the results with AI
      const analysisResponse = await fetch('/api/analyze-deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          country,
          searchResults: searchData.searchResults
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error(`Analysis error! status: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      onAnalysis(analysisData);
      
      // Add to search history
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      onError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickSearchTerms = [
    'iPhone 16 Pro',
    'Samsung Galaxy S24',
    'MacBook Pro',
    'Nike Air Jordan',
    'PlayStation 5'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <Package className="w-8 h-8 text-blue-600" />
          Global Price Comparison
        </CardTitle>
        <CardDescription>
          Search for products across {supportedCountries.length}+ countries and find the best deals
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Search Form */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for any product... (e.g., iPhone 16 Pro, 128GB)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 text-lg h-12"
              disabled={loading}
            />
          </div>
          
          <Select value={country} onValueChange={setCountry} disabled={loading}>
            <SelectTrigger className="w-48 h-12">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {supportedCountries.map((countryCode) => (
                <SelectItem key={countryCode} value={countryCode}>
                  {countryCode} - {RegionMapper.getCurrency(countryCode)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            className="h-12 px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching & Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Find Best Deals
              </>
            )}
          </Button>
        </div>

        {/* Search Info */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>AI-powered search:</span>
          <Badge variant="outline">
            <Search className="w-3 h-3 mr-1" />
            100 results from {RegionMapper.getSearchDomains(country).length} websites
          </Badge>
          <Badge variant="outline">
            <Brain className="w-3 h-3 mr-1" />
            Smart filtering & analysis
          </Badge>
          <Badge variant="outline">
            {RegionMapper.getCurrency(country)} prices
          </Badge>
        </div>

        {/* Quick Search Terms */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Try these popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearchTerms.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => setQuery(term)}
                disabled={loading}
                className="text-xs"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery(term)}
                  disabled={loading}
                  className="text-xs text-gray-500"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}