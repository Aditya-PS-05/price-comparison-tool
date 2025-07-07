'use client';

import React from 'react';
import { ExternalLink, Star, TrendingUp, TrendingDown, ShoppingCart, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyzedDeal } from '@/lib/types/product';

interface DealCardProps {
  deal: AnalyzedDeal;
  rank: number;
}

export function DealCard({ deal, rank }: DealCardProps) {
  const handleDealClick = () => {
    window.open(deal.url, '_blank', 'noopener,noreferrer');
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Award className="w-4 h-4 text-green-600" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'average': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isTopDeal = deal.dealQuality === 'excellent' || rank <= 3;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isTopDeal ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                #{rank}
              </Badge>
              <Badge className={`text-xs ${getQualityColor(deal.dealQuality)}`}>
                {getQualityIcon(deal.dealQuality)}
                {deal.dealQuality.charAt(0).toUpperCase() + deal.dealQuality.slice(1)} Deal
              </Badge>
              <Badge variant="outline" className="text-xs">
                {Math.round(deal.relevanceScore * 100)}% match
              </Badge>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-blue-600 cursor-pointer" onClick={handleDealClick}>
              {deal.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price and Seller */}
        <div className="flex justify-between items-center">
          <div>
            {deal.price && (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {deal.price}
                </span>
                {deal.discount && (
                  <span className="text-sm text-red-600 font-medium">
                    {deal.discount}
                  </span>
                )}
              </div>
            )}
            {deal.availability && (
              <div className="text-sm text-gray-600 mt-1">
                {deal.availability}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-800">{deal.seller}</div>
            {deal.currency && (
              <div className="text-xs text-gray-500">{deal.currency}</div>
            )}
          </div>
        </div>

        {/* Reasons */}
        {deal.reasons && deal.reasons.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700">Why this deal:</div>
            <ul className="text-sm text-gray-600 space-y-1">
              {deal.reasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleDealClick}
            className="flex-1"
            size="sm"
            variant={isTopDeal ? "default" : "outline"}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Shop Now at {deal.seller}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDealClick}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}