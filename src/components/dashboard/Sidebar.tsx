'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  Search, 
  Bookmark, 
  History, 
  User,
  Package,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Search", icon: Search, href: "/dashboard" },
  { name: "Saved", icon: Bookmark, href: "/dashboard/saved" },
  { name: "Past", icon: History, href: "/dashboard/past" },
  { name: "Profile", icon: User, href: "/dashboard/profile" }
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-[#1E1F21] border-r border-gray-700 flex flex-col h-screen transition-transform duration-300 ease-in-out z-50",
        "lg:translate-x-0 lg:static lg:z-auto",
        isMobileOpen ? "fixed translate-x-0" : "fixed -translate-x-full lg:translate-x-0"
      )}>
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">PriceSphere</h1>
              <p className="text-xs text-gray-400">Global Price Comparison</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onMobileClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {session && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-[#8EA1FE] text-black shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-black" : "text-gray-400"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-300 border-gray-600 hover:text-black bg-gray-700/50 hover:bg-[#8EA1FE]"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
    </>
  );
}