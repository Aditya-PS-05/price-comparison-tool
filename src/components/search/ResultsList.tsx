'use client';

import React, { useState } from 'react';
import { ProductSearchResponse } from '@/lib/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, 
  SortAsc, 
  Clock, 
  Globe, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface ResultsListProps {
  results: ProductSearchResponse;
}

export function ResultsList({ results }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'relevance'>('price');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Sort products based on selected criteria
  const sortedProducts = [...results.results].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'rating':
        return b.sellerRating - a.sellerRating;
      case 'relevance':
        return b.trustScore - a.trustScore;
      default:
        return 0;
    }
  });

  // Filter by rating if specified
  const filteredProducts = filterRating > 0 
    ? sortedProducts.filter(product => product.sellerRating >= filterRating)
    : sortedProducts;

  if (results.resultsCount === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search terms or check the spelling.
          </p>
          {results.alternatives && results.alternatives.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Try these alternatives:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.alternatives.map((alt, index) => (
                  <Badge key={index} variant="outline">
                    {alt.productName}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
            Search Results for "{results.query}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{results.resultsCount}</div>
              <div className="text-sm text-gray-600">Products Found</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{results.searchTime}</div>
              <div className="text-sm text-gray-600">Search Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{results.country}</div>
              <div className="text-sm text-gray-600">Country</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {results.metadata?.sourcesScrapped.length || 0}
              </div>
              <div className="text-sm text-gray-600">Websites</div>
            </div>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {results.metadata?.cacheHit && (
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Cache Hit
              </Badge>
            )}
            {results.metadata?.regionMapped && (
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Region Mapped
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Real-time Results
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
            
            <Select value={filterRating.toString()} onValueChange={(value) => setFilterRating(Number(value))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            
            <Select value={sortBy} onValueChange={(value: 'price' | 'rating' | 'relevance') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Badge variant="secondary">
                {filteredProducts.length} of {results.resultsCount} shown
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      {filteredProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {filteredProducts[0].currency} {Math.min(...filteredProducts.map(p => parseFloat(p.price))).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Lowest Price</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {filteredProducts[0].currency} {(filteredProducts.reduce((sum, p) => sum + parseFloat(p.price), 0) / filteredProducts.length).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Average Price</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {filteredProducts[0].currency} {Math.max(...filteredProducts.map(p => parseFloat(p.price))).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Highest Price</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={`${product.sourceWebsite}-${index}`}
            product={product}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Alternatives Section */}
      {results.alternatives && results.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Alternative Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.alternatives.map((alternative, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{alternative.productName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alternative.reason}</p>
                  {alternative.price !== '0' && (
                    <p className="text-sm font-medium mt-2">
                      Starting at: {filteredProducts[0]?.currency} {alternative.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sources Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Results sourced from:</p>
            <div className="flex flex-wrap gap-2">
              {results.metadata?.sourcesScrapped.map((source) => (
                <Badge key={source} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-xs">
              Prices and availability are updated in real-time. Click "View Product" to see the latest information on the retailer's website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}