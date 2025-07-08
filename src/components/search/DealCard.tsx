'use client';

import React, { useState } from 'react';
import { ExternalLink, Star, TrendingUp, TrendingDown, ShoppingCart, Award, ImageIcon, Globe, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyzedDeal } from '@/lib/types/product';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Image from 'next/image';

interface DealCardProps {
  deal: AnalyzedDeal;
  rank: number;
  country: string;
}

export function DealCard({ deal, rank, country }: DealCardProps) {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveProduct = async () => {
    if (!session) {
      toast.error('Please sign in to save products');
      return;
    }

    setIsSaving(true);
    try {
      // Extract price as number
      const priceMatch = deal.price?.match(/[\d.,]+/);
      const currentPrice = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;
      
      // Extract currency symbol or code
      const currency = deal.currency || deal.price?.replace(/[\d.,\s]/g, '').trim() || '$';

      const response = await fetch('/api/saved-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: deal.title,
          currentPrice,
          currency,
          country,
          seller: deal.seller,
          productUrl: deal.url,
          imageUrl: deal.image || deal.thumbnail
        }),
      });

      if (response.ok) {
        toast.success('Product saved successfully!');
      } else {
        const error = await response.json();
        if (response.status === 409) {
          toast.error('Product already saved');
        } else {
          toast.error(error.error || 'Failed to save product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
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
      case 'excellent': return 'bg-green-900/30 text-green-400 border-green-600';
      case 'good': return 'bg-blue-900/30 text-blue-400 border-blue-600';
      case 'average': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600';
      case 'poor': return 'bg-red-900/30 text-red-400 border-red-600';
      default: return 'bg-gray-800/30 text-gray-400 border-gray-600';
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
    <Card className={`bg-gray-900/50 border-gray-800 hover:shadow-lg hover:shadow-gray-900/50 transition-all duration-200 ${isTopDeal ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            {(deal.image || deal.thumbnail) && !imageError ? (
              <div className="relative w-24 h-24 bg-gray-800 rounded-lg overflow-hidden">
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
                  <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                <ImageIcon className="w-8 h-8 text-gray-500" />
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
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-white hover:text-blue-400 cursor-pointer" onClick={handleDealClick}>
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
                <span className="text-2xl font-bold text-green-400">
                  {deal.price}
                </span>
                {deal.discount && (
                  <span className="text-sm text-red-400 font-medium bg-red-900/30 px-2 py-1 rounded">
                    {deal.discount}
                  </span>
                )}
              </div>
            )}
            {deal.availability && (
              <div className={`text-sm mt-1 flex items-center gap-1 ${
                deal.availability.toLowerCase().includes('stock') ? 'text-green-400' : 'text-orange-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  deal.availability.toLowerCase().includes('stock') ? 'bg-green-400' : 'bg-orange-400'
                }`} />
                {deal.availability}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-200 flex items-center gap-1">
              {deal.seller}
              {regionCode && (
                <Badge variant="outline" className="text-xs">
                  {regionCode}
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
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
            <div className="text-sm font-medium text-gray-300">Why this deal:</div>
            <ul className="text-sm text-gray-400 space-y-1">
              {deal.reasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
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
          {session && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveProduct}
              disabled={isSaving}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          )}
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