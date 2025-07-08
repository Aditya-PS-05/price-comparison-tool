'use client';

import React, { useState } from 'react';
import { ExternalLink, Star, TrendingUp, TrendingDown, ShoppingCart, Award, ImageIcon, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyzedDeal } from '@/lib/types/product';
import Image from 'next/image';

interface DealCardProps {
  deal: AnalyzedDeal;
  rank: number;
}

export function DealCard({ deal, rank }: DealCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleDealClick = () => {
    window.open(deal.url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
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
  
  // Extract domain for retailer identification
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return deal.seller;
    }
  };
  
  // Get region indicator based on domain
  const getRegionFromDomain = (domain: string) => {
    if (domain.includes('.com.au')) return 'AU';
    if (domain.includes('.co.uk')) return 'GB';
    if (domain.includes('.ca')) return 'CA';
    if (domain.includes('.de')) return 'DE';
    if (domain.includes('.fr')) return 'FR';
    if (domain.includes('.it')) return 'IT';
    if (domain.includes('.es')) return 'ES';
    if (domain.includes('.com.br')) return 'BR';
    if (domain.includes('.co.jp')) return 'JP';
    if (domain.includes('.co.kr')) return 'KR';
    if (domain.includes('.com.mx')) return 'MX';
    if (domain.includes('.ae')) return 'AE';
    if (domain.includes('.sa')) return 'SA';
    if (domain.includes('.co.za')) return 'ZA';
    if (domain.includes('.com.sg')) return 'SG';
    if (domain.includes('.co.in')) return 'IN';
    if (domain.includes('.com.cn')) return 'CN';
    return null;
  };
  
  const domain = getDomain(deal.url);
  const regionCode = getRegionFromDomain(domain);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isTopDeal ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            {(deal.image || deal.thumbnail) && !imageError ? (
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={deal.image || deal.thumbnail || ''}
                  alt={deal.title}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  sizes="96px"
                  priority={rank <= 3} // Prioritize loading for top 3 deals
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
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
              {regionCode && (
                <Badge variant="secondary" className="text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {regionCode}
                </Badge>
              )}
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
                  <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                    {deal.discount}
                  </span>
                )}
              </div>
            )}
            {deal.availability && (
              <div className={`text-sm mt-1 flex items-center gap-1 ${
                deal.availability.toLowerCase().includes('stock') ? 'text-green-600' : 'text-orange-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  deal.availability.toLowerCase().includes('stock') ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                {deal.availability}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
              {deal.seller}
              {regionCode && (
                <Badge variant="outline" className="text-xs">
                  {regionCode}
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {deal.currency && (
                <span className="font-mono">{deal.currency}</span>
              )}
              <span>•</span>
              <span className="truncate max-w-20" title={domain}>{domain}</span>
            </div>
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
            {regionCode ? `Shop ${regionCode}` : `Shop at ${deal.seller}`}
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