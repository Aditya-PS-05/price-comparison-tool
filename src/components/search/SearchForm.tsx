'use client';

import React, { useState, useMemo } from 'react';
import { Search, Globe, Package, Loader2, Brain, Star, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnalysisResponse } from '@/lib/types/product';
import { RegionMapper } from '@/lib/services/regionMapper';
import { getRegions, getCountriesByRegion } from '@/lib/data/globalCountries';

interface SearchFormProps {
  onAnalysis: (analysis: AnalysisResponse) => void;
  onError: (error: string) => void;
}

export function SearchForm({ onAnalysis, onError }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('Popular');

  // Get organized country data
  const allCountries = RegionMapper.getAllCountries();
  const popularCountries = allCountries.filter(c => c.popular);
  const regions = getRegions();
  
  // Organize countries by regions
  const countriesByRegion = useMemo(() => {
    const organized: { [key: string]: Array<{code: string, name: string, popular: boolean}> } = {
      'Popular': popularCountries
    };
    
    regions.forEach(region => {
      const regionCountries = getCountriesByRegion(region).map(country => ({
        code: country.code,
        name: country.name,
        popular: country.popular
      }));
      organized[region] = regionCountries;
    });
    
    return organized;
  }, []);

  const currentCountryInfo = allCountries.find(c => c.code === country);
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
      
      // Use only available products for LLM analysis
      const resultsToAnalyze = searchData.availableResults && searchData.availableResults.length > 0 
        ? searchData.availableResults 
        : searchData.searchResults;
      
      console.log(`Analyzing ${resultsToAnalyze.length} available products out of ${searchData.searchResultsCount} total results`);
      
      // Automatically analyze the results with AI
      const analysisResponse = await fetch('/api/analyze-deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          country,
          searchResults: resultsToAnalyze,
          availabilityStats: searchData.availabilityStats
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
    <Card className="w-full max-w-4xl mx-auto bg-gray-800/50 border-gray-700 text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2 text-white">
          <Package className="w-8 h-8 text-blue-400" />
          Global Price Comparison
        </CardTitle>
        <CardDescription className="text-gray-300">
          Search for products across <strong className="text-white">{supportedCountries.length} countries</strong> and find the best deals worldwide
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
              className="pl-10 text-lg h-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
          
          <Select value={country} onValueChange={setCountry} disabled={loading}>
            <SelectTrigger className="w-64 h-12 bg-gray-700 border-gray-600 text-white">
              <Globe className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-96 bg-gray-800 border-gray-700 text-white">
              {Object.entries(countriesByRegion).map(([regionName, countries]) => (
                <div key={regionName}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-300 bg-gray-700 flex items-center gap-2">
                    {regionName === 'Popular' ? (
                      <><Star className="w-3 h-3 text-yellow-400" /> Popular Markets</>
                    ) : (
                      <><MapPin className="w-3 h-3 text-blue-400" /> {regionName}</>
                    )}
                    <Badge variant="outline" className="text-xs ml-auto bg-gray-600 border-gray-500 text-gray-300">
                      {countries.length}
                    </Badge>
                  </div>
                  {countries.map((countryItem) => (
                    <SelectItem key={countryItem.code} value={countryItem.code} className="pl-6 text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          {countryItem.popular && regionName !== 'Popular' && (
                            <Star className="w-3 h-3 text-yellow-400" />
                          )}
                          {countryItem.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{countryItem.code}</span>
                          <span>{RegionMapper.getCurrencySymbol(countryItem.code)}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  {regionName !== Object.keys(countriesByRegion)[Object.keys(countriesByRegion).length - 1] && (
                    <Separator className="my-1 bg-gray-600" />
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white"
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
        <div className="space-y-3">
          {/* Current Country Info */}
          {currentCountryInfo && (
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Searching in {currentCountryInfo.name}
                </h4>
                {currentCountryInfo.popular && (
                  <Badge variant="default" className="bg-blue-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular Market
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-400 font-medium">Currency:</span>
                  <div className="text-blue-200">{RegionMapper.getCurrencySymbol(country)} {RegionMapper.getCurrency(country)}</div>
                </div>
                <div>
                  <span className="text-blue-400 font-medium">Websites:</span>
                  <div className="text-blue-200">{RegionMapper.getSearchDomains(country).length} retailers</div>
                </div>
                <div>
                  <span className="text-blue-400 font-medium">Language:</span>
                  <div className="text-blue-200">{RegionMapper.getLanguage(country).split('-')[0].toUpperCase()}</div>
                </div>
                <div>
                  <span className="text-blue-400 font-medium">Region:</span>
                  <div className="text-blue-200">{currentCountryInfo.name.split(' ')[0]}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search Capabilities */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-300">
            <span>AI-powered search:</span>
            <Badge variant="outline" className="bg-gray-700/50 border-gray-600 text-gray-300">
              <Search className="w-3 h-3 mr-1" />
              100 results from {RegionMapper.getSearchDomains(country).length} websites
            </Badge>
            <Badge variant="outline" className="bg-gray-700/50 border-gray-600 text-gray-300">
              <Brain className="w-3 h-3 mr-1" />
              Smart filtering & analysis
            </Badge>
            <Badge variant="outline" className="bg-gray-700/50 border-gray-600 text-gray-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              {RegionMapper.getCurrencySymbol(country)} prices
            </Badge>
          </div>
        </div>

        {/* Quick Search Terms */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Try these popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearchTerms.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => setQuery(term)}
                disabled={loading}
                className="text-xs bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery(term)}
                  disabled={loading}
                  className="text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-200"
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