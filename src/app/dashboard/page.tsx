'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {SearchForm} from '../../components/search/SearchForm';
import {AnalyzedDealsList} from '../../components/search/AnalyzedDealsList';
import {GlobalCoverage} from '../../components/search/GlobalCoverage';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { AnalysisResponse } from '@/lib/types/product';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Brain } from 'lucide-react';
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
  const [showGlobalCoverage, setShowGlobalCoverage] = useState(false);

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
      <div className="flex h-screen bg-[#0D0F17] text-white items-center justify-center">
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
      <div className="flex h-screen bg-[#0D0F17] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0D0F17] text-white">
      {/* New Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-[#11131C]">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
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
              <Badge variant="outline" className="mb-4">
                <Brain className="w-3 h-3 mr-1" />
                AI-Analyzed Best Deals
              </Badge>
            </div>
          )}

          {/* Results Display */}
          {analysis && <AnalyzedDealsList analysis={analysis} />}

          {/* Global Coverage or Feature Highlights */}
          {!analysis && !error && (
            <div className="max-w-6xl mt-16">
              {showGlobalCoverage ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Global Coverage</h2>
                    <Button variant="outline" onClick={() => setShowGlobalCoverage(false)}>
                      Show Features
                    </Button>
                  </div>
                  <GlobalCoverage />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Feature Cards */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Global Coverage</h3>
                      <p className="text-gray-400 text-sm mb-4">Search across 195+ countries and 1000+ websites</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowGlobalCoverage(true)}
                      >
                        Explore Markets
                      </Button>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Analysis</h3>
                      <p className="text-gray-400 text-sm mb-4">Smart deal scoring and product matching</p>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Real-time Tracking</h3>
                      <p className="text-gray-400 text-sm mb-4">Monitor prices and get instant alerts</p>
                      <Button variant="outline" size="sm">
                        Set Alerts
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-600/30">
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Start</h3>
                    <p className="text-gray-300 text-sm mb-4">Try searching for popular products:</p>
                    <div className="flex flex-wrap gap-2">
                      {['iPhone 16 Pro', 'Samsung Galaxy S24', 'MacBook Pro', 'Nike Air Jordan', 'PlayStation 5'].map((term) => (
                        <Badge key={term} variant="outline" className="cursor-pointer hover:bg-blue-600/20">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
