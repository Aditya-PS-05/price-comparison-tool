'use client';

import React, { useState } from 'react';
import { SearchForm } from '@/components/search/SearchForm';
import { AnalyzedDealsList } from '@/components/search/AnalyzedDealsList';
import { AnalysisResponse } from '@/lib/types/product';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        
        {/* Feature Highlights */}
        {!analysis && !error && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Search</h3>
              <p className="text-gray-600 text-sm">
                Search across 195+ countries and 1000+ websites for the best deals worldwide.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI filters 100+ search results to show only the best deals and relevant products.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Deal Analysis</h3>
              <p className="text-gray-600 text-sm">
                AI analyzes prices, discounts, and seller reputation to rank deals by quality.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
