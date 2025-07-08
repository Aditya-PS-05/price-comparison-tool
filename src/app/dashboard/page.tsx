'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {SearchForm} from '../../components/search/SearchForm';
import {AnalyzedDealsList} from '../../components/search/AnalyzedDealsList';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { AnalysisResponse } from '@/lib/types/product';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Brain, Menu } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard: Session status:', status);
    console.log('Dashboard: Session exists:', !!session);
    
    if (status === 'loading') return; // Still loading
    
    if (status === 'unauthenticated') {
      console.log('Dashboard: Redirecting to signin');
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [session, status, router]);

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleAnalysis = (analysisResults: AnalysisResponse) => {
    setAnalysis(analysisResults);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysis(null);
  };

  // Show loading while session is being checked
  if (status === 'loading') {
    return (
      <div className="flex h-screen bg-[#131416] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return (
      <div className="flex h-screen bg-[#131416] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#131416] text-white">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content */}
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
          <h1 className="text-lg font-bold text-white">Product Search</h1>
          <div></div> {/* Spacer */}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="space-y-6 md:space-y-8">
            {/* Page Header - Desktop */}
            <div className="hidden lg:flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Product Search</h1>
                <p className="text-gray-400">Search for products across global markets with AI-powered analysis</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
                  API Online
                </Badge>
                <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600">
                  AI Analysis Ready
                </Badge>
              </div>
            </div>

            {/* Page Header - Mobile */}
            <div className="lg:hidden">
              <p className="text-gray-400 text-sm mb-4">Search for products across global markets with AI-powered analysis</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600 text-xs">
                  API Online
                </Badge>
                <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600 text-xs">
                  AI Analysis Ready
                </Badge>
              </div>
            </div>

          {/* Search Form */}
          <SearchForm onAnalysis={handleAnalysis} onError={handleError} />

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="max-w-4xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

            {/* Search Mode Indicator */}
            {analysis && (
              <div className="max-w-4xl">
                <Badge variant="outline" className="mb-4 bg-purple-600/20 text-purple-400 border-purple-600">
                  <Brain className="w-3 h-3 mr-1" />
                  AI-Analyzed Best Deals
                </Badge>
              </div>
            )}

            {/* Results Display */}
            {analysis && <AnalyzedDealsList analysis={analysis} />}

            {/* No Products Message */}
            {!analysis && !error && (
              <div className="max-w-4xl mt-8 md:mt-16 mx-auto text-center">
                <div className="bg-gray-800/30 rounded-xl p-6 md:p-12 border border-gray-700">
                  <div className="mb-4 md:mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Brain className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">No product searched yet</h3>
                    <p className="text-gray-400 text-sm md:text-lg px-2">
                      Enter a product name above to find the best deals across global markets
                    </p>
                  </div>
                  
                  {/* Quick Start Suggestions */}
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-gray-300 text-xs md:text-sm">Popular searches to get you started:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['iPhone 16 Pro', 'Samsung Galaxy S24', 'MacBook Pro', 'Nike Air Jordan', 'PlayStation 5'].map((term) => (
                        <Badge 
                          key={term} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-blue-600/20 bg-gray-700/50 border-gray-600 text-gray-300 hover:text-white px-2 md:px-3 py-1 text-xs md:text-sm"
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
