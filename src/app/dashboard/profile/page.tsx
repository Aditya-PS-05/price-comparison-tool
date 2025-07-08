'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { User, Mail, Globe, Clock, Menu, Search, Bookmark, Bell, DollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface UserStats {
  totalSearches: number;
  savedProducts: number;
  activeAlerts: number;
  moneySaved: number;
}

interface SavedProduct {
  id: string;
  savedPrice: number;
  currentPrice: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalSearches: 0,
    savedProducts: 0,
    activeAlerts: 0,
    moneySaved: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async () => {
    try {
      // Fetch past searches count
      const searchesResponse = await fetch('/api/past-searches');
      const searchesData = searchesResponse.ok ? await searchesResponse.json() : { total: 0 };
      
      // Fetch saved products count
      const savedResponse = await fetch('/api/saved-products');
      const savedData = savedResponse.ok ? await savedResponse.json() : { total: 0 };
      
      // Calculate money saved from price drops
      const savedProducts: SavedProduct[] = savedData.products || [];
      const moneySaved = savedProducts.reduce((total: number, product: SavedProduct) => {
        if (product.savedPrice > product.currentPrice) {
          return total + (product.savedPrice - product.currentPrice);
        }
        return total;
      }, 0);

      setUserStats({
        totalSearches: searchesData.total || 0,
        savedProducts: savedData.total || 0,
        activeAlerts: 0, // We can implement this later when price alerts are fully functional
        moneySaved: moneySaved
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/profile');
      return;
    }
    
    if (session?.user) {
      fetchUserStats();
    }
  }, [session, status, router]);

  // Show loading while session is being checked
  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen bg-[#0D0F17] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#131416] text-white">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-[#131416] lg:ml-0">
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
          <h1 className="text-lg font-bold text-white">Profile</h1>
          <div></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Profile</h1>
                <p className="text-gray-400">Your account information</p>
              </div>
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
                <User className="w-3 h-3 mr-1" />
                Active Account
              </Badge>
            </div>

            {/* User Information */}
            <Card className="bg-[#131416] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm text-gray-400">Full Name</div>
                        <div className="text-white">{session.user?.name || 'Not provided'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <Mail className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm text-gray-400">Email Address</div>
                        <div className="text-white">{session.user?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-gray-400">Default Country</div>
                        <div className="text-white">{session.user?.defaultCountry || 'US'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-sm text-gray-400">Preferred Currency</div>
                        <div className="text-white">{session.user?.defaultCurrency || 'USD'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-[#131416] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account Statistics</CardTitle>
                <CardDescription>Your activity and usage overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Search className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{userStats.totalSearches}</div>
                    <div className="text-sm text-gray-400">Total Searches</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-green-500/50 transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Bookmark className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-400">{userStats.savedProducts}</div>
                    <div className="text-sm text-gray-400">Saved Products</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Bell className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{userStats.activeAlerts}</div>
                    <div className="text-sm text-gray-400">Active Alerts</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-orange-400">
                      ${userStats.moneySaved.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">Money Saved</div>
                  </div>
                </div>
                
                {/* Additional Stats Row */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Avg. Searches/Week</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-400">
                      {userStats.totalSearches > 0 ? Math.round(userStats.totalSearches / Math.max(1, 4)) : 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <Bookmark className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">Save Rate</span>
                    </div>
                    <span className="text-sm font-semibold text-green-400">
                      {userStats.totalSearches > 0 ? Math.round((userStats.savedProducts / userStats.totalSearches) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-300">Avg. Saved/Product</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-400">
                      ${userStats.savedProducts > 0 ? (userStats.moneySaved / userStats.savedProducts).toFixed(2) : '0.00'}
                    </span>
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