'use client'

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Package, LogIn, UserPlus, ChevronDown } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/base/Footer";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <main className="min-h-screen min-w-screen bg-white px-4 sm:px-6 md:px-20 py-6 md:py-12">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12 md:mb-24">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
            <Package className="w-3 h-3 md:w-7 md:h-7 text-black" />
          </div>
          <div className="text-lg md:text-2xl font-semibold">Price<span className="text-black">Sphere</span></div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          {status === 'loading' ? (
            <div className="animate-pulse bg-gray-200 rounded-full px-4 md:px-6 py-2"></div>
          ) : session ? (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden sm:block text-sm text-gray-600 truncate max-w-32 md:max-w-none">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Button asChild className="rounded-full text-sm px-4 md:px-6">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="outline" className="rounded-full text-sm px-3 md:px-4" asChild>
                <Link href="/auth/signin">
                  <LogIn className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">In</span>
                </Link>
              </Button>
              <Button className="rounded-full text-sm px-3 md:px-4" asChild>
                <Link href="/auth/signup">
                  <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Up</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Heading Section */}
      <div className="max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground font-medium mb-3 md:mb-4">
          E-commerce Platform
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight mb-4 md:mb-6">
          Discover the power of PriceSphere, a universal price comparison tool. <span className="text-muted-foreground font-normal">
          Let&apos;s find the best deal for any product, from any website, in any country — together.
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button className="rounded-full px-6 md:px-8 py-4 md:py-6 text-sm font-medium" asChild>
            <Link href={session ? "/dashboard" : "/auth/signup"} className="flex items-center justify-center gap-2">
              {session ? "Go to Dashboard" : "Get Started Free"}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
          
          {!session && (
            <Button variant="outline" className="rounded-full px-6 md:px-8 py-4 md:py-6 text-sm font-medium" asChild>
              <Link href="/auth/signin" className="flex items-center justify-center">
                Sign In
              </Link>
            </Button>
          )}
        </div>

      </div>

      {/* Dashboard Video Section */}
      <div className="my-16 md:my-32 w-full flex justify-center">
        <div className="bg-[#ECEFF5] rounded-2xl md:rounded-3xl p-3 md:p-6 lg:p-10 w-full max-w-5xl">
          <video
            src="/video/ui.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="rounded-lg md:rounded-xl shadow-xl w-full h-auto"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-8 md:mt-12 w-full">
          <div className="text-[40px] text-black font-bold mb-6">
            Services
          </div>
          
          <div className="space-y-0 border-t border-gray-200 w-full">
            {/* Global Coverage */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('global')}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-medium text-black">Global Coverage</h3>
                  <p className="text-sm text-gray-600 mt-1">Search across 195+ countries and 1000+ websites worldwide</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedSection === 'global' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'global' && (
                <div className="pb-6 px-4">
                  <p className="text-gray-600 leading-relaxed">
                    Our global coverage ensures you never miss a great deal, no matter where you are in the world. 
                    We search across 195+ countries and over 1000 websites to bring you comprehensive price comparisons. 
                    From local marketplaces to international retailers, our platform covers major e-commerce sites, 
                    specialty stores, and regional shopping platforms to give you the most complete view of product 
                    availability and pricing across different markets.
                  </p>
                </div>
              )}
            </div>

            {/* AI-Powered */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('ai')}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-medium text-black">AI-Powered</h3>
                  <p className="text-sm text-gray-600 mt-1">Smart deal analysis and intelligent product matching</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedSection === 'ai' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'ai' && (
                <div className="pb-6 px-4">
                  <p className="text-gray-600 leading-relaxed">
                    Our advanced AI technology goes beyond simple price matching. We use machine learning algorithms 
                    to analyze product descriptions, images, and specifications to ensure accurate matches across 
                    different retailers. Our AI evaluates deal quality, identifies the best offers, and provides 
                    intelligent recommendations based on your preferences. The system continuously learns from user 
                    behavior and market trends to deliver increasingly accurate and relevant results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}