'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { History, Search, ExternalLink, Calendar, Clock } from 'lucide-react';

interface PastSearch {
  id: number;
  query: string;
  country: string;
  timestamp: string;
  resultsCount: number;
  bestPrice: string;
  status: string;
  userId?: string;
}

export default function PastSearchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pastSearches, setPastSearches] = useState<PastSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/past');
      return;
    }
    
    // For new users, start with empty state
    // In a real app, this would fetch from the database
    setPastSearches([]);
    setLoading(false);
  }, [session, status, router]);

  // Show loading while session is being checked
  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen bg-[#0D0F17] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading past searches...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
              {pastSearches.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No past searches yet</h3>
                  <p className="text-gray-400 mb-4">Start searching for products to see your history here</p>
                  <Button onClick={() => router.push('/dashboard')}>
                    <Search className="w-4 h-4 mr-2" />
                    Start Searching
                  </Button>
                </div>
              ) : (
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
              )}
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
                {pastSearches.length === 0 ? (
                  <div className="text-center py-6">
                    <Search className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No repeat searches yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastSearches.slice(0, 3).map((search) => (
                      <div key={search.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <span className="text-white">{search.query}</span>
                        <Button variant="outline" size="sm">
                          Search
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                    <span className="text-white font-semibold">{pastSearches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Countries Searched</span>
                    <span className="text-white font-semibold">{pastSearches.length > 0 ? new Set(pastSearches.map(s => s.country)).size : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Results per Search</span>
                    <span className="text-white font-semibold">{pastSearches.length > 0 ? Math.round(pastSearches.reduce((acc, s) => acc + s.resultsCount, 0) / pastSearches.length) : 0}</span>
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