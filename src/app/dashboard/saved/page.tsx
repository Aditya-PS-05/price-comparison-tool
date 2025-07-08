'use client';

import React from 'react';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Bookmark, Search, ExternalLink, Trash2, Bell, Heart } from 'lucide-react';

export default function SavedPage() {
  const savedItems = [
    {
      id: 1,
      name: 'iPhone 16 Pro 128GB',
      currentPrice: '$999',
      savedPrice: '$1,099',
      country: 'United States',
      seller: 'Apple Store',
      dateAdded: '2024-01-15',
      status: 'price_drop',
      savings: '$100'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      currentPrice: '$1,199',
      savedPrice: '$1,199',
      country: 'Canada',
      seller: 'Samsung Store',
      dateAdded: '2024-01-12',
      status: 'same_price',
      savings: '$0'
    },
    {
      id: 3,
      name: 'MacBook Pro 14" M3',
      currentPrice: '$1,699',
      savedPrice: '$1,599',
      country: 'United Kingdom',
      seller: 'Apple Store UK',
      dateAdded: '2024-01-10',
      status: 'price_increase',
      savings: '-£100'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      currentPrice: '$279',
      savedPrice: '$299',
      country: 'Germany',
      seller: 'Amazon DE',
      dateAdded: '2024-01-08',
      status: 'price_drop',
      savings: '€20'
    }
  ];

  const savedSearches = [
    { id: 1, query: 'Gaming Laptop RTX 4070', country: 'US', created: '2024-01-20' },
    { id: 2, query: 'Wireless Headphones', country: 'CA', created: '2024-01-18' },
    { id: 3, query: 'Smart Watch', country: 'UK', created: '2024-01-15' }
  ];

  return (
    <div className="flex h-screen bg-[#0D0F17] text-white">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-y-auto bg-[#11131C]">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Saved Items</h1>
              <p className="text-gray-400">Track your favorite products and searches</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600">
                <Bookmark className="w-3 h-3 mr-1" />
                {savedItems.length} items
              </Badge>
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
                2 price drops
              </Badge>
            </div>
          </div>

          {/* Saved Products */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Saved Products
              </CardTitle>
              <CardDescription>Products you're tracking for price changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'price_drop' ? 'bg-green-400' :
                        item.status === 'price_increase' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`}></div>
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-sm text-gray-400">
                          {item.seller} • {item.country} • Added {item.dateAdded}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                          <span>Saved at: {item.savedPrice}</span>
                          <span>Current: {item.currentPrice}</span>
                          {item.status === 'price_drop' && (
                            <span className="text-green-400">↓ {item.savings} saved</span>
                          )}
                          {item.status === 'price_increase' && (
                            <span className="text-red-400">↑ {item.savings} increase</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        item.status === 'price_drop' ? 'bg-green-600/20 text-green-400 border-green-600' :
                        item.status === 'price_increase' ? 'bg-red-600/20 text-red-400 border-red-600' :
                        'bg-gray-600/20 text-gray-400 border-gray-600'
                      }>
                        {item.status === 'price_drop' ? 'Price Drop!' :
                         item.status === 'price_increase' ? 'Price Up' :
                         'No Change'}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Bell className="w-3 h-3 mr-1" />
                          Alert
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Searches */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="w-5 h-5" />
                Saved Searches
              </CardTitle>
              <CardDescription>Quick access to your favorite search queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedSearches.map((search) => (
                  <div key={search.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">{search.query}</div>
                        <div className="text-sm text-gray-400">{search.country} • Created {search.created}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Search Again
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Total Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{savedItems.length}</div>
                <div className="text-sm text-gray-400">Products tracked</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Money Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">$120</div>
                <div className="text-sm text-gray-400">From price drops</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">6</div>
                <div className="text-sm text-gray-400">Price monitoring</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}