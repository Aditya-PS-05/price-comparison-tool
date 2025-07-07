'use client';

import React from 'react';
import { ExternalLink, Star, Truck, ShoppingCart, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Product } from '@/lib/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  rank?: number;
}

export function ProductCard({ product, rank }: ProductCardProps) {
  const trustScorePercentage = Math.round(product.trustScore * 100);
  const isHighTrust = product.trustScore > 0.8;
  const isLowPrice = rank === 1;

  const handleProductClick = () => {
    // Track click analytics here if needed
    window.open(product.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isLowPrice ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <Badge variant={isLowPrice ? "default" : "secondary"} className="text-xs">
                  #{rank}
                </Badge>
              )}
              {isLowPrice && (
                <Badge variant="default" className="text-xs bg-green-600">
                  Best Price
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {product.condition}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              {product.productName}
            </h3>
          </div>
          
          {product.image && (
            <div className="ml-4 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.productName}
                width={80}
                height={80}
                className="rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Section */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-green-600">
                {product.currency} {product.price}
              </span>
              {product.shippingCost !== '0' && (
                <span className="text-sm text-gray-500">
                  + {product.currency} {product.shippingCost} shipping
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Total: {product.currency} {product.totalCost}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.sellerRating.toFixed(1)}</span>
            </div>
            <div className="text-sm text-gray-600">{product.seller}</div>
          </div>
        </div>

        {/* Trust Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trust Score</span>
            <span className={`text-sm font-medium ${isHighTrust ? 'text-green-600' : 'text-yellow-600'}`}>
              {trustScorePercentage}%
            </span>
          </div>
          <Progress value={trustScorePercentage} className="h-2" />
        </div>

        {/* Availability and Delivery */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className={`${product.availability === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
              {product.availability}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{product.estimatedDelivery}</span>
          </div>
        </div>

        {/* Warranty Info */}
        {product.warranty && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>{product.warranty}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleProductClick}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Product
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleProductClick}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Source Info */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span>Source: {product.sourceWebsite}</span>
            <span>Updated: {new Date(product.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}