'use client';

import React, { useState } from 'react';
import { AnalysisResponse } from '@/lib/types/product';
import { DealCard } from './DealCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, 
  SortAsc, 
  Brain,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';

interface AnalyzedDealsListProps {
  analysis: AnalysisResponse;
}

export function AnalyzedDealsList({ analysis }: AnalyzedDealsListProps) {
  const [sortBy, setSortBy] = useState<'relevance' | 'quality' | 'price'>('relevance');
  const [filterQuality, setFilterQuality] = useState<string>('all');

  // Sort deals based on selected criteria
  const sortedDeals = [...analysis.deals].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevanceScore - a.relevanceScore;
      case 'quality':
        const qualityOrder = { excellent: 4, good: 3, average: 2, poor: 1 };
        return qualityOrder[b.dealQuality] - qualityOrder[a.dealQuality];
      case 'price':
        const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
        const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
        return priceA - priceB;
      default:
        return 0;
    }
  });

  // Filter by quality if specified
  const filteredDeals = filterQuality !== 'all'
    ? sortedDeals.filter(deal => deal.dealQuality === filterQuality)
    : sortedDeals;

  if (analysis.relevantResults === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No relevant deals found</h3>
          <p className="text-gray-500 mb-6">
            The AI couldn't find any relevant shopping results for "{analysis.query}".
          </p>
          <p className="text-sm text-gray-400">
            Try searching with more specific product names or different keywords.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getQualityStats = () => {
    const stats = { excellent: 0, good: 0, average: 0, poor: 0 };
    analysis.deals.forEach(deal => {
      stats[deal.dealQuality]++;
    });
    return stats;
  };

  const qualityStats = getQualityStats();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* AI Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Deal Analysis for "{analysis.query}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{analysis.totalResults}</div>
              <div className="text-sm text-gray-600">Total Results</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{analysis.relevantResults}</div>
              <div className="text-sm text-gray-600">Relevant Deals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((analysis.relevantResults / analysis.totalResults) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Relevance Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{qualityStats.excellent}</div>
              <div className="text-sm text-gray-600">Excellent Deals</div>
            </div>
          </div>

          {/* Quality Distribution */}
          <div className="flex flex-wrap gap-2 mb-4">
            {qualityStats.excellent > 0 && (
              <Badge variant="outline" className="bg-green-50 border-green-200">
                <Award className="w-3 h-3 mr-1 text-green-600" />
                {qualityStats.excellent} Excellent
              </Badge>
            )}
            {qualityStats.good > 0 && (
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                <TrendingUp className="w-3 h-3 mr-1 text-blue-600" />
                {qualityStats.good} Good
              </Badge>
            )}
            {qualityStats.average > 0 && (
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
                <Star className="w-3 h-3 mr-1 text-yellow-600" />
                {qualityStats.average} Average
              </Badge>
            )}
            {qualityStats.poor > 0 && (
              <Badge variant="outline" className="bg-red-50 border-red-200">
                <AlertCircle className="w-3 h-3 mr-1 text-red-600" />
                {qualityStats.poor} Poor
              </Badge>
            )}
          </div>

          {/* AI Summary */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-800 mb-1">AI Summary:</div>
            <div className="text-sm text-purple-700">{analysis.summary}</div>
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
            
            <Select value={filterQuality} onValueChange={setFilterQuality}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="excellent">Excellent Only</SelectItem>
                <SelectItem value="good">Good+</SelectItem>
                <SelectItem value="average">Average+</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            
            <Select value={sortBy} onValueChange={(value: 'relevance' | 'quality' | 'price') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="quality">Deal Quality</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Badge variant="secondary">
                {filteredDeals.length} of {analysis.relevantResults} shown
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal, index) => (
          <DealCard 
            key={`${deal.url}-${index}`}
            deal={deal}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Analysis Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Analysis powered by: {analysis.searchEngineUsed}</p>
            <p className="text-xs">
              Results are analyzed by AI for relevance and deal quality. Prices and availability should be verified on the retailer's website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}