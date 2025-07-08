'use client';

import React from 'react';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { History, Search, ExternalLink, Calendar } from 'lucide-react';

export default function PastSearchesPage() {
  const pastSearches = [
    {
      id: 1,
      query: 'iPhone 16 Pro',
      country: 'United States',
      timestamp: '2024-01-20 14:30',
      resultsCount: 25,
      bestPrice: '$999',
      status: 'completed'
    },
    {
      id: 2,
      query: 'Samsung Galaxy S24',
      country: 'Canada',
      timestamp: '2024-01-19 09:15',
      resultsCount: 18,
      bestPrice: 'CAD $1,199',
      status: 'completed'
    },
    {
      id: 3,
      query: 'MacBook Pro M3',
      country: 'United Kingdom',
      timestamp: '2024-01-18 16:45',
      resultsCount: 12,
      bestPrice: '£1,599',
      status: 'completed'
    },
    {
      id: 4,
      query: 'Nike Air Jordan',
      country: 'Germany',
      timestamp: '2024-01-17 11:20',
      resultsCount: 31,
      bestPrice: '€179',
      status: 'completed'
    },
    {
      id: 5,
      query: 'PlayStation 5',
      country: 'Japan',
      timestamp: '2024-01-16 19:10',
      resultsCount: 8,
      bestPrice: '¥59,980',
      status: 'completed'
    }
  ];

  return (
    <div className="flex h-screen bg-[#0D0F17] text-white">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-y-auto bg-[#11131C]">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Past Searches</h1>
              <p className="text-gray-400">View your search history and repeat previous searches</p>
            </div>
            <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600">
              <History className="w-3 h-3 mr-1" />
              {pastSearches.length} searches
            </Badge>
          </div>

          {/* Search History */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Search History
              </CardTitle>
              <CardDescription>Your recent product searches and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastSearches.map((search) => (
                  <div key={search.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{search.query}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {search.timestamp}
                          </span>
                          <span>in {search.country}</span>
                          <span>{search.resultsCount} results</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Best Price</div>
                        <div className="font-semibold text-green-400">{search.bestPrice}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Results
                        </Button>
                        <Button size="sm">
                          <Search className="w-3 h-3 mr-1" />
                          Search Again
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Popular Repeat Searches</CardTitle>
                <CardDescription>Products you search for most often</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['iPhone 16 Pro', 'Samsung Galaxy S24', 'MacBook Pro'].map((product) => (
                    <div key={product} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-white">{product}</span>
                      <Button variant="outline" size="sm">
                        Search
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Search Statistics</CardTitle>
                <CardDescription>Your search activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Searches</span>
                    <span className="text-white font-semibold">{pastSearches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">This Week</span>
                    <span className="text-white font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Countries Searched</span>
                    <span className="text-white font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Results per Search</span>
                    <span className="text-white font-semibold">19</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}