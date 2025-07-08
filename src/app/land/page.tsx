
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

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
            Discover the essence of GenTool a free tool <br />
          <span className="text-muted-foreground font-normal">
            that lets you find the best deals on products.
          </span>
        </h1>
        <Button className="rounded-full px-6 py-4 text-sm font-medium">
          Get for free <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </main>
  );
}
