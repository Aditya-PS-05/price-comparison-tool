'use client';

import React, { useState } from 'react';
import { Search, Globe, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductSearchRequest, ProductSearchResponse } from '@/lib/types/product';
import { RegionMapper } from '@/lib/services/regionMapper';

interface SearchFormProps {
  onResults: (results: ProductSearchResponse) => void;
  onError: (error: string) => void;
}

export function SearchForm({ onResults, onError }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const supportedCountries = RegionMapper.getAllSupportedCountries();

  const handleSearch = async () => {
    if (!query.trim()) {
      onError('Please enter a search query');
      return;
    }

    setLoading(true);
    
    try {
      const searchRequest: ProductSearchRequest = {
        country,
        query: query.trim(),
        options: {
          maxResults: 20,
          includeShipping: true,
          minRating: 3.0
        }
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        onResults(data.data);
        
        // Add to search history
        if (!searchHistory.includes(query.trim())) {
          setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
        }
      } else {
        onError(data.error || 'Search failed');
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
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Search Info */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>Searching:</span>
          <Badge variant="outline">
            {RegionMapper.getRegionalSites(country).length} websites
          </Badge>
          <Badge variant="outline">
            {RegionMapper.getCurrency(country)} prices
          </Badge>
          <Badge variant="outline">
            AI-powered matching
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