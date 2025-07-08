'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Bookmark, Search, ExternalLink, Trash2, Bell, Heart, BookmarkX, Menu } from 'lucide-react';

interface SavedItem {
  id: string;
  name: string;
  seller: string;
  country: string;
  dateAdded: string;
  savedPrice: string;
  currentPrice: string;
  status: 'price_drop' | 'price_increase' | 'no_change';
  savings: string;
}

interface SavedSearch {
  id: string;
  query: string;
  country: string;
  created: string;
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/saved');
      return;
    }
    
    // For now, show empty state for new users
    // In a real app, this would fetch from the database
    setSavedItems([]);
    setSavedSearches([]);
    setLoading(false);
  }, [session, status, router]);

  // Show loading while session is being checked
  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen bg-[#0D0F17] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading saved items...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0D0F17] text-white">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-[#11131C] lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-bold text-white">Saved Items</h1>
          <div></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="space-y-6 md:space-y-8">
            {/* Page Header - Desktop */}
            <div className="hidden lg:flex items-center justify-between">
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

            {/* Mobile Header Info */}
            <div className="lg:hidden">
              <p className="text-gray-400 text-sm mb-4">Track your favorite products and searches</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600 text-xs">
                  <Bookmark className="w-3 h-3 mr-1" />
                  {savedItems.length} items
                </Badge>
                <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600 text-xs">
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
              <CardDescription>Products you&apos;re tracking for price changes</CardDescription>
            </CardHeader>
            <CardContent>
              {savedItems.length === 0 ? (
                <div className="text-center py-12">
                  <BookmarkX className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No saved products yet</h3>
                  <p className="text-gray-400 mb-4">Save products from search results to track price changes</p>
                  <Button onClick={() => router.push('/dashboard')}>
                    <Search className="w-4 h-4 mr-2" />
                    Start Searching
                  </Button>
                </div>
              ) : (
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
              )}
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
              {savedSearches.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-md font-semibold text-gray-300 mb-2">No saved searches yet</h3>
                  <p className="text-gray-400 text-sm mb-3">Save your favorite search queries for quick access</p>
                  <Button size="sm" onClick={() => router.push('/dashboard')}>
                    Create Search
                  </Button>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white text-sm md:text-base">Total Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-blue-400">{savedItems.length}</div>
                  <div className="text-xs md:text-sm text-gray-400">Products tracked</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white text-sm md:text-base">Money Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-green-400">$0</div>
                  <div className="text-xs md:text-sm text-gray-400">From price drops</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white text-sm md:text-base">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-orange-400">0</div>
                  <div className="text-xs md:text-sm text-gray-400">Price monitoring</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}