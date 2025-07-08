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
    <main className="min-h-screen bg-white px-6 md:px-20 py-12">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-24">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-semibold">Price<span className="text-blue-600">Sphere</span></div>
        </div>
        
        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <div className="animate-pulse bg-gray-200 rounded-full px-6 py-2"></div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Welcome, {session.user?.name || session.user?.email}</span>
              <Button asChild className="rounded-full">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/auth/signin">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link href="/auth/signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Heading Section */}
      <div className="max-w-4xl">
        <div className="text-sm text-muted-foreground font-medium mb-4">
          E-commerce Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
          Discover the power of PriceSphere, a universal price comparison tool. <span className="text-muted-foreground font-normal">
          Let&apos;s find the best deal for any product, from any website, in any country — together.
          </span>
        </h1>
        
        <div className="flex gap-4">
          <Button className="rounded-full px-8 py-6 text-sm font-medium" asChild>
            <Link href={session ? "/dashboard" : "/auth/signup"} className="flex items-center gap-2">
              {session ? "Go to Dashboard" : "Get Started Free"}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
          
          {!session && (
            <Button variant="outline" className="rounded-full px-8 py-6 text-sm font-medium" asChild>
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">🌍 Global Coverage</h3>
            <p className="text-sm text-gray-600">Search across 195+ countries and 1000+ websites</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">🤖 AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart deal analysis and product matching</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">⚡ Real-time</h3>
            <p className="text-sm text-gray-600">Live price tracking and instant alerts</p>
          </div>
        </div>
      </div>

      {/* Dashboard Image Section */}
      <div className="my-32 w-full flex justify-center">
        <div className="bg-[#ECEFF5] rounded-3xl p-6 md:p-10">
          <Image
            src="/dashboard/image.png"
            alt="Dashboard UI Preview"
            width={1000}
            height={600}
            className="rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}