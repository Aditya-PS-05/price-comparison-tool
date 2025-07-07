'use client';

import React from 'react';
import { ExternalLink, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/lib/types/product';

interface ResultCardProps {
  result: SearchResult;
  rank: number;
}

export function ResultCard({ result, rank }: ResultCardProps) {
  const handleResultClick = () => {
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const isTopResult = rank <= 3;
  const isAppleSite = result.url.includes('apple.com');
  const isBestBuy = result.url.includes('bestbuy.com');
  const isAmazon = result.url.includes('amazon.com');
  
  const getSiteIcon = () => {
    if (isAppleSite) return '🍎';
    if (isBestBuy) return '🛒';
    if (isAmazon) return '📦';
    return '🌐';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isTopResult ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isTopResult ? "default" : "secondary"} className="text-xs">
                #{rank}
              </Badge>
              {isTopResult && (
                <Badge variant="default" className="text-xs bg-blue-600">
                  <Star className="w-3 h-3 mr-1" />
                  Top Result
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                <span className="mr-1">{getSiteIcon()}</span>
                {getDomain(result.url)}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-blue-600 cursor-pointer" onClick={handleResultClick}>
              {result.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {result.snippet}
        </div>

        {/* URL Display */}
        <div className="text-xs text-blue-600 truncate bg-blue-50 p-2 rounded font-mono">
          {result.url}
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {result.snippet.toLowerCase().includes('price') && (
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Price Info
            </Badge>
          )}
          {result.snippet.toLowerCase().includes('buy') && (
            <Badge variant="outline" className="text-xs">
              🛍️ Purchase Available
            </Badge>
          )}
          {result.snippet.toLowerCase().includes('discount') && (
            <Badge variant="outline" className="text-xs">
              💰 Discount
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleResultClick}
            className="flex-1"
            size="sm"
            variant={isTopResult ? "default" : "outline"}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit {isAppleSite ? 'Apple Store' : isBestBuy ? 'Best Buy' : isAmazon ? 'Amazon' : 'Website'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}