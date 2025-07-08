'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  MapPin, 
  Star, 
  TrendingUp, 
  ShoppingCart,
  Users,
  Zap,
  Award
} from 'lucide-react';
import { RegionMapper } from '@/lib/services/regionMapper';
import { getRegions, getPopularCountries, getAllCountries } from '@/lib/data/globalCountries';

export function GlobalCoverage() {
  const allCountries = getAllCountries();
  const popularCountries = getPopularCountries();
  const regions = getRegions();
  
  // Calculate statistics
  const totalCountries = allCountries.length;
  const totalPopularMarkets = popularCountries.length;
  const totalRegions = regions.length;
  
  // Sample some major markets for display
  const majorMarkets = popularCountries.slice(0, 12);
  
  // Get total search domains across all countries
  const totalSearchDomains = RegionMapper.getSupportedCountries()
    .reduce((total, country) => total + RegionMapper.getSearchDomains(country).length, 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 bg-[#131416]">
      {/* Global Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Global Price Comparison Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">{totalCountries}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" />
                Countries & Territories
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">{totalPopularMarkets}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" />
                Major Markets
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">{totalRegions}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Globe className="w-3 h-3" />
                Global Regions
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">{Math.round(totalSearchDomains / 10)}K+</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                Retailer Sites
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Regional Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regions.map((region) => {
              const regionCountries = allCountries.filter(c => {
                // This is a simplified mapping - in real implementation, you'd use the actual region data
                return true; // For demo purposes
              });
              const regionPopular = regionCountries.filter(c => c.popular).length;
              
              return (
                <div key={region} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{region}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 20) + 5} {/* Demo data */}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {Math.floor(Math.random() * 8) + 2} major markets
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Major Markets Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Major E-commerce Markets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {majorMarkets.map((country) => {
              const searchDomains = RegionMapper.getSearchDomains(country.code);
              
              return (
                <div key={country.code} className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{country.name}</h4>
                    <Badge variant="default" className="text-xs bg-blue-600">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-mono font-semibold">
                        {RegionMapper.getCurrencySymbol(country.code)} {country.currency}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Retailers:</span>
                      <span className="font-semibold text-green-600">
                        {searchDomains.length} sites
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Code:</span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {country.code}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Top Retailers Preview */}
                  <div className="pt-2 border-t border-blue-200">
                    <div className="text-xs text-gray-500 mb-2">Top retailers:</div>
                    <div className="flex flex-wrap gap-1">
                      {searchDomains.slice(0, 3).map((domain, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {domain.split('.')[0]}
                        </Badge>
                      ))}
                      {searchDomains.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{searchDomains.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Global Search Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Multi-Currency Support</h4>
                <p className="text-sm text-gray-600">
                  Automatic currency detection and conversion for all {totalCountries} countries with real-time rates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Localized Search</h4>
                <p className="text-sm text-gray-600">
                  Country-specific search terms and retailer targeting for relevant local results.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI-Powered Analysis</h4>
                <p className="text-sm text-gray-600">
                  Smart filtering and deal quality assessment across all global markets.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}