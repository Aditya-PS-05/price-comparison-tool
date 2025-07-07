'use client';

import React, { useState } from 'react';
import { SearchForm } from '@/components/search/SearchForm';
import { ResultsList } from '@/components/search/ResultsList';
import { ProductSearchResponse } from '@/lib/types/product';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<ProductSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResults = (searchResults: ProductSearchResponse) => {
    setResults(searchResults);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Search Form */}
        <SearchForm onResults={handleResults} onError={handleError} />
        
        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Results Display */}
        {results && <ResultsList results={results} />}
        
        {/* Feature Highlights */}
        {!results && !error && (
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
                Advanced AI understands your queries and finds exactly what you&apos;re looking for.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600 text-sm">
                Get live prices, availability, and delivery information in seconds.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
