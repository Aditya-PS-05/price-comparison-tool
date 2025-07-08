'use client'

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Package, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/base/Footer";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 md:px-20 py-6 md:py-12">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12 md:mb-24">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-3 h-3 md:w-5 md:h-5 text-white" />
          </div>
          <div className="text-lg md:text-2xl font-semibold">Price<span className="text-blue-600">Sphere</span></div>
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

        {/* Features */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="p-3 md:p-4 border rounded-lg">
            <h3 className="font-semibold mb-2 text-sm md:text-base">🌍 Global Coverage</h3>
            <p className="text-xs md:text-sm text-gray-600">Search across 195+ countries and 1000+ websites</p>
          </div>
          <div className="p-3 md:p-4 border rounded-lg">
            <h3 className="font-semibold mb-2 text-sm md:text-base">🤖 AI-Powered</h3>
            <p className="text-xs md:text-sm text-gray-600">Smart deal analysis and product matching</p>
          </div>
          <div className="p-3 md:p-4 border rounded-lg sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-2 text-sm md:text-base">⚡ Real-time</h3>
            <p className="text-xs md:text-sm text-gray-600">Live price tracking and instant alerts</p>
          </div>
        </div>
      </div>

      {/* Dashboard Image Section */}
      <div className="my-16 md:my-32 w-full flex justify-center">
        <div className="bg-[#ECEFF5] rounded-2xl md:rounded-3xl p-3 md:p-6 lg:p-10 w-full max-w-5xl">
          <Image
            src="/dashboard/image.png"
            alt="Dashboard UI Preview"
            width={1000}
            height={600}
            className="rounded-lg md:rounded-xl shadow-xl w-full h-auto"
          />
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}