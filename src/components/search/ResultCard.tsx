'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
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

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                #{rank}
              </Badge>
              <Badge variant="outline" className="text-xs">
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
        <div className="text-sm text-gray-600 line-clamp-3">
          {result.snippet}
        </div>

        {/* URL Display */}
        <div className="text-xs text-blue-600 truncate">
          {result.url}
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleResultClick}
            className="flex-1"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Site
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}