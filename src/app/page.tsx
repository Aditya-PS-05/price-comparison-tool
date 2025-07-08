// app/page.tsx (Next.js with shadcn/ui)

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/base/Footer";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-6 md:px-20 py-12">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-24">
        <div className="text-2xl font-semibold">Gen<span className="text-black">Tool</span></div>
        <button className="bg-black text-white px-5 py-2 rounded-full text-sm">Unlimited Access</button>
      </nav>

      {/* Heading Section */}
      <div className="max-w-4xl">
        <div className="text-sm text-muted-foreground font-medium mb-4">
          Ecommerse Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
          Discover the power of PriceSphere, a universal price comparison tool. <span className="text-muted-foreground font-normal">
          Let’s find the best deal for any product, from any website, in any country — together.
          </span>
        </h1>
        <Button className="rounded-full px-8 py-6 text-sm font-medium">
          <Link href="/dashboard" className="flex items-center gap-2">
            Get for free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
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
