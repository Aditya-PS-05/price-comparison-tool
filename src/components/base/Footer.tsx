import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-32 py-16 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              Let&apos;s start<br />creating<br />together
            </h2>
            <Button variant="secondary" className="rounded-full px-6 py-4 text-black bg-white">
              Let&apos;s talk <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex gap-20 mt-10 md:mt-0">
            <div className="space-y-3 text-sm">
              <p>Home</p>
              <p>Work</p>
              <p>About</p>
              <p>Contact</p>
            </div>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">Twitter <ArrowUpRight className="w-3 h-3" /></p>
              <p className="flex items-center gap-2">Dribbble <ArrowUpRight className="w-3 h-3" /></p>
              <p className="flex items-center gap-2">Instagram <ArrowUpRight className="w-3 h-3" /></p>
            </div>
          </div>
        </div>
    </footer>
  );
}