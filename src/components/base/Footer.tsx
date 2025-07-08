import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16 md:mt-32 py-12 md:py-16 px-4 sm:px-6 md:px-20">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
          <div className="flex-1">
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Contact</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-4 md:mb-6 leading-tight">
              Let&apos;s start<br />creating together
            </h2>
            <Button variant="secondary" className="rounded-full px-4 md:px-6 py-3 md:py-4 text-black bg-white text-sm md:text-base">
              Let&apos;s talk <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Button>
          </div>

        </div>
    </footer>
  );
}