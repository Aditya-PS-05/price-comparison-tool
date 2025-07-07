'use client';

import React, { useState } from 'react';
import { SearchForm } from '@/components/search/SearchForm';
import { AnalyzedDealsList } from '@/components/search/AnalyzedDealsList';
import { GlobalCoverage } from '@/components/search/GlobalCoverage';
import { AnalysisResponse } from '@/lib/types/product';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Brain, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Search Form */}
        <SearchForm onAnalysis={handleAnalysis} onError={handleError} />
        
        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Search Mode Indicator */}
        {analysis && (
          <div className="max-w-4xl mx-auto">
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
          <div className="max-w-6xl mx-auto mt-16">
            {showGlobalCoverage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Global Coverage</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowGlobalCoverage(false)}
                  >
                    Show Features
                  </Button>
                </div>
                <GlobalCoverage />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Why Choose Our Platform?</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowGlobalCoverage(true)}
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    View Global Coverage
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Global Search</h3>
                    <p className="text-gray-600 text-sm">
                      Search across <strong>195+ countries</strong> and <strong>1000+ websites</strong> for the best deals worldwide.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced AI filters <strong>100+ search results</strong> to show only the best deals and relevant products.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Smart Deal Analysis</h3>
                    <p className="text-gray-600 text-sm">
                      AI analyzes prices, discounts, and seller reputation to rank deals by <strong>quality</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
